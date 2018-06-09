import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GlobalsService} from "../globals.service";
import {PaymentsService} from "./payments.service";
import {ProfilePaymentMethods} from "../models/profile-payment-methods";
import {NgForm} from "@angular/forms";
import swal from 'sweetalert2';
import {LoadingService} from "../loading/loading.service";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit, AfterViewInit, OnDestroy {
  paymentOptions:any[];                     // List of the current payment options for the given payment object

  private payObject: string;                // Defines what are we paying for (subscription, token, asset rent/buy/whatever)
  private payObjectId: string;              // Defines the Id of the object being paid for
  payObjectPrice: string;                   // Price of the object being bought
  payObjectCurrency: string;                // Currency of the object being bought

  public paySubscription: any = null;       // If the payObject == 'subscription' this will be !== null
  payAsset: any = null;                     // If the payObject == 'asset' this will be filled !== null

  paymentMethod: string;                    // Indicates the current payment method (stripe, voucher, token)


  /* CREDIT CARD RELATED */
  stripe: any;          // Holds the stripe (credit card payments) object
  elements: any;        // Stripe (v3) elements
  card: any;            // Current credit card
  elementStyles: any;   // Elements styles
  elementClasses: any;  // Elements classes
  cardName: string = '';     // Card holder name
  showCreditCardList: boolean = false;      // Show initial credit card list (or on button request)
                                            /* @Notes: if no credit cards are found proceed directly
                                                       to the add credit card screen with a descriptive
                                                       message on top
                                             */
  showAddCreditCard: boolean = false;       // Show div for adding a credit card

  @ViewChild('cardInfo') cardInfo: ElementRef;
  cardHandler = this.onChange.bind(this);
  error: string;

  /* VOUCHER RELATED */
  voucher: string = null;                   // 2-way bind this in the view


  /* TOKEN RELATED */
  showTokenList: boolean = false;           // Show initial token list (or on button request)

  /* PAYMENT METHODS RELATED */
  profilePaymentMethods: ProfilePaymentMethods[];   // This ALWAYS relates to a given gateway!!

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globals: GlobalsService,
    private paymentsService: PaymentsService,
    private cd: ChangeDetectorRef,
    private loading: LoadingService
  ) {
    /**
     * Products:
     *  - Subscriptions
     *  - Tokens
     *  - Assets (buy/rent)
     *
     * @Notes: A user can have a subscribed plan and still buy/rent an
     * asset to which he/she is not entitled to (see API entitlements)
     *
     * Known payment options [Credit Card, Voucher, Token] and associated
     * payment gateways coming from the API:
     *
     * Credit card (stripe):
     *  - Give the possibility of entering a discount coupon
     *
     * Voucher:
     *  - Pays for whatever is being bought (subscription, asset) entirely
     *
     * Token:
     *  - Like an eCoin. User has an eWallet and can spend these on assets
     *    for buying/renting
     *
     */
  }

  ngOnInit() {
    /* Subscribe to the parameters being passed via URL */
    this.route.params
      .subscribe(params => {
        this.payObject = params.payObject;
        this.payObjectId = params.payObjectId;

        // Clear previous pay objects
        this.paySubscription = null;
        this.payAsset = null;

        // What are we paying for?
        switch (this.payObject) {
          case 'subscription':
            // Make sure we clear previous payment options ... :P
            this.paymentOptions = [];
            // Get the payment gateways for this subscription
            this.globals.subscriptions.data.forEach((subscription, index) => {
              if (subscription.plan_id == this.payObjectId) {
                // This is a subscription. Fill paySubscription object
                this.paySubscription = subscription;
                // Get the price of this subscription
                this.payObjectPrice = subscription.price;
                this.payObjectCurrency = subscription.currency;

                subscription.payment_gateways.forEach((paymentGateway) => {
                  if (paymentGateway.active)
                    this.paymentOptions.push({label: paymentGateway.name, gateway: paymentGateway.gateway, selected: false});
                });
              }
            });
            break;

          case 'token':
            // TODO: support token payments
            // @Notes: tokens should also be identifiable by 'id'
            break;

          case 'asset':
            // @Notes: an asset can be bought or rent. Payment can be in tokens
            // TODO: This is an asset. Fill payAsset object

            break;

        }
      });


    /* Create stripe object for credit card payments */
    this.stripe = Stripe(this.globals.stripePubKey);

    /* Use the new 'elements' */
    this.elements = this.stripe.elements({
      fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css?family=Quicksand',
        },
      ],
      // Stripe's examples are localized to specific languages, but if
      // you wish to have Elements automatically detect your user's locale,
      // use `locale: 'auto'` instead.
      locale: 'auto',
    });

    /* Define personalized styles for the elements */
    this.elementStyles = {
      base: {
        color: '#fff',
        fontWeight: 600,
        fontFamily: 'Quicksand, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':focus': {
          color: '#424770'
        },

        '::placeholder': {
          color: '#424770',
        },

        ':focus::placeholder': {
          color: '#004770',
        },
      },
      invalid: {
        color: '#fff',
        ':focus': {
          color: '#FA755A',
        },
        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };

    this.elementClasses = {
      focus: 'focus',
      empty: 'empty',
      invalid: 'invalid',
    };

    // Subscribe to whatever subjects come from the related service
    this.paymentsService.paymentMethods.subscribe(val => {
      this.profilePaymentMethods = val;
      /*
       If we have a list (of a least 1) of credit cards show it
        and let the user use one of them for payment of whatever is being bought
       */
      if (this.profilePaymentMethods.length > 0) {
        this.showCreditCardList = true;
      }
      else {
        /* Show add credit card screen */
        this.showCreditCardList = false;  // Don't forget to hide whatever else is on the screen here!
        this.showAddCreditCard = true;
      }
    });

    this.paymentsService.purchaseResponse.subscribe(val => {
      // Stop the loading status in any circumstance (either success or failure)
      this.loading.set(false);

      if (val.code == "200") {
        // Show a success dialog
        swal({
            type: 'success',
            html:  '<span style="color: #fff;">'+val.description || 'Payment successful'+'</span>',
            background: '#2a292a'
          }
        ).then(result => {
          if (result.value) {
            // Hide the credit card add modal
            this.showAddCreditCard = false;
            // redirect to home and let the user enjoy content with his/her active subscription :P
            this.router.navigate(['']);
          }
        });


      }
      else {
        swal({
            type: 'error',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
            html:  '<span style="color: #fff;">'+val.error.description+'</span>',
            background: '#2a292a'
          }
        );
      }
    });


  }


  /**
   * Stuff that needs to be run AFTER the view is init'ed
   */
  ngAfterViewInit(): void {
    this.showAddCreditCard = false;

    this.card = this.elements.create('card', {hidePostalCode: true});

    /*this.card.mount(this.cardNumber.nativeElement);
    this.card.mount(this.cardExpiry.nativeElement);
    this.card.mount(this.cardCvc.nativeElement);*/

    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);

  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  /**
   * Process payment choice btn click
   * @param {string} gateway
   */
  onPaymentBtnClick(paymentOption: any) {

    // Set all 'visibility' flags to false here!
    this.showCreditCardList = false;
    this.showAddCreditCard = false;


    // Get the available payment methods for the current profile
    // FIXME: HARDWIRED! If this ever changes in the API this exclusion is going to fail!
    // @Notes: the .../purchase_methods endpoint doesn't return a list of vouchers
    //         this might change in the future (as per meeting with Bruno and Sobrinho on 2018-03-02)
    if (paymentOption.gateway !== 'voucher')
      this.paymentsService.getProfilePaymentMethods(paymentOption.gateway);

    this.paymentOptions.forEach((paymentOption) => {
      paymentOption.selected = false;
    });

    this.paymentMethod = paymentOption.gateway;
    paymentOption.selected = true;
  }


  /**
   * Get a token for the currently submitted card
   */
  async getStripeToken(form: NgForm) {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
      // make the actual purchase
      // errr.. what were we buying again? :P
      let purchaseType = this.payObject == 'subscription' ? 'SVOD' : 'TVOD';

      var productId = null;
      var storeProductId = null;

      // If the thing being bought is a subscription get the Ids from paySubscription object
      if (this.payObject == 'subscription' && this.paySubscription !== null) {
        productId = this.paySubscription.plan_id;
        for (let paymentGateway of this.paySubscription.payment_gateways) {
          if (paymentGateway.gateway === "stripe") {
            storeProductId = paymentGateway.store_product_id;
            console.log("store pid: "+ paymentGateway.store_product_id);
          }
        }
      }

      // TODO: get the Ids from an asset
      if (this.payObject == 'asset') {

      }

      // Ensure we have productId and a storeProductId...
      if (productId!== null && storeProductId!==null) {
        this.loading.set(true);
        this.paymentsService.purchase(productId, purchaseType, 'stripe', storeProductId, token.id);
      }
      else {
        // Something went south ... :S show an error dialog
        swal({
            type: 'error',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
            html:  '<span style="color: #fff;">'+this.globals.strings.PAYMENT_PROCESSMENT_FAILURE || 'There was a problem processing your request. Please try again later'+'</span>',
            background: '#2a292a'
          }
        );
      }
    }
  }


  /**
   * Handle choosing one the credit cards of the list for payment
   * @param {string} paymentMethodToken
   */
  payWithThisCC(stripeToken: string) {
    console.info("Credit card token: "+stripeToken);
    // errr.. what were we buying again? :P
    let purchaseType = this.payObject == 'subscription' ? 'SVOD' : 'TVOD';

    var productId = null;
    var storeProductId = null;

    // If the thing being bought is a subscription get the Ids from paySubscription object
    if (this.payObject == 'subscription' && this.paySubscription !== null) {
      productId = this.paySubscription.plan_id;
      for (let paymentGateway of this.paySubscription.payment_gateways) {
        if (paymentGateway.gateway === "stripe") {
          storeProductId = paymentGateway.store_product_id;
          console.log("store pid: "+ paymentGateway.store_product_id);
        }
      }
    }

    // TODO: get the Ids from an asset
    if (this.payObject == 'asset') {

    }

    // Ensure we have productId and a storeProductId...
    if (productId!== null && storeProductId!==null) {
      this.paymentsService.purchase(productId, purchaseType, 'stripe', storeProductId, stripeToken);
    }
    else {
      // Something went south ... :S show an error dialog
      swal({
          type: 'error',
          title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
          html:  '<span style="color: #fff;">'+this.globals.strings.PAYMENT_PROCESSMENT_FAILURE || 'There was a problem processing your request. Please try again later'+'</span>',
          background: '#2a292a'
        }
      );
    }

  }

  /**
   * Handle the submission of a voucher as a means of payment
   * @param {NgForm} form
   */
  onVoucherSubmit(form: NgForm) {

    console.log(form);

    console.log('Voucher was: ' + form.value.voucher);

    // errr.. what were we buying again? :P
    let purchaseType = this.payObject == 'subscription' ? 'SVOD' : 'TVOD';

    var productId = null;
    var storeProductId = null;

    // If the thing being bought is a subscription get the Ids from paySubscription object
    if (this.payObject == 'subscription' && this.paySubscription !== null) {
      productId = this.paySubscription.plan_id;
      for (let paymentGateway of this.paySubscription.payment_gateways) {
        if (paymentGateway.gateway === "stripe") {
          storeProductId = paymentGateway.store_product_id;
          console.log("store pid: "+ paymentGateway.store_product_id);
        }
      }
    }

    // TODO: get the Ids from an asset
    if (this.payObject == 'asset') {

    }

    // Ensure we have productId and a storeProductId...
    if (productId!== null && storeProductId!==null) {
      this.paymentsService.purchase(productId, purchaseType, 'voucher', form.value.voucher, form.value.voucher);
    }
    else {
      // Something went south ... :S show an error dialog
      swal({
          type: 'error',
          title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
          html:  '<span style="color: #fff;">'+this.globals.strings.PAYMENT_PROCESSMENT_FAILURE || 'There was a problem processing your request. Please try again later'+'</span>',
          background: '#2a292a'
        }
      );
    }



  }

}
