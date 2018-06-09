/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface JQuery {
  slick(options?: any, callback?: Function): any;
}

/* Register Stripe class */
declare var Stripe: any;
declare var Elements: any;
