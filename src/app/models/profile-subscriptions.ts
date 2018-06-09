export interface ProfileSubscriptions {
  active: string,
  subscriptions: [
    {
      id: string,
      plan_id: string,
      plan_name: string,
      plan_interval: string,
      start_date: string,
      end_date: string,
      payment_gateway: string
    }
  ]
}
