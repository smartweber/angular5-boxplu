export interface Session {
  id: number,
  name: string,
  auth_token: string,
  image: {
    url: string
  },
  ip_address: string,
  last_time_used: number
}
