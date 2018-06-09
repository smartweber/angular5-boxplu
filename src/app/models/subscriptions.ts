export interface Subscription {
  id: string,
  plan_id: string,
  plan_name: string,
  plan_interval: string,
  trial_time: string,
  expiry_date: string,
  price: string,
  currency: string,
  payment_gateways: [
    {
      id: string,
      active: string,
      gateway: string,
      name: string,
      store_product_id: string
    }
  ]
}

export interface Subscriptions {
  data: Subscription[],
    pagination: {
    url: {
      next: string,
      previous: string
    },
    page: string,
    limit: string,
    total_size: string
  }
}
