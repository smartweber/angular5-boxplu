/* Asset's related content */

type assetsProps = {
  id: number,
  name: string,
  slug: string,
  type: string,
  age_rating: [
    {
      id: number,
      name: string,
      description: string,
      level: number,
      country_code: string,
      image: {
        url: string
      }
    }
    ],
  rating: number,
  short_description: string,
  image: {
    url: string
  },
  social_url: string
}

/*
 Warning! this has a slightly different "set" as the API returned a (malformed) array
 at the beginning :S
 */
export interface Related {
  items: (assetsProps) [],
  pagination: {
    url: {
      next: string,
      previous: string
    },
    page: number,
    limit: number,
    total_size: number
  }
}
