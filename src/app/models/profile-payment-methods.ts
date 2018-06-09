export interface ProfilePaymentMethods {
  id: string,
  active: string,
  payment_gateway: string,
  date_added: string,
  payment_method_token: string,
  payment_name: string,
  expiration_date: string,
  payment_owner_name: string,
  credit_card_number: string
}
