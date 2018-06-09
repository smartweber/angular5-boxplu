export interface Asset {
  asset: {
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
    social_url: string,
    seo: {
      name: string,
      description: string,
      keywords: [
        {
          slug: string,
          name: string
        }
        ]
    },
    added_date: string,
    production_year: number,
    production_country: string,
    long_description: string,
    length: number,
    images: {
      banner: {
        url: string
      },
      wide_banner: {
        url: string
      },
      backdrop: {
        url: string
      },
      thumbnail: {
        url: string
      },
      poster: {
        url: string
      },
      square: {
        url: string
      }
    },
    video: {
      trailer: {
        id: string,
        name: string,
        slug: string,
        type: string,
        format: string
      },
      streams: {
        id: string,
        name: string,
        slug: string,
        type: string,
        format: string
      }
    },
    genres: [
      {
        id: number,
        name: string,
        slug: string,
        type: string,
        image: {
          url: string
        }
      }
      ],
    cast: {
      actors: [
        {
          id: number,
          name: string,
          slug: string,
          type: string,
          meta_title: string
        }
        ],
      directors: [
        {
          id: number,
          name: string,
          slug: string,
          type: string,
          meta_title: string
        }
        ],
      producers: [
        {
          id: number,
          name: string,
          slug: string,
          type: string,
          meta_title: string
        }
        ],
      writers: [
        {
          id: 0,
          name: string,
          slug: string,
          type: string,
          meta_title: string
        }
        ]
    },
    store_product_ids: [
      {
        product_type: string,
        payment_gateway: string,
        product_payment_gateway_id: string,
        product_title: string,
        product_expiration_value: number,
        product_trial_period: number,
        product_price: number,
        product_currency: string
      }
      ]
  },
  screen: {
    id: number,
    name: string,
    slug: string,
    type: string,
    design: string,
    blocks: [
      {
        id: number,
        name: string,
        slug: string,
        type: string,
        position: number,
        block_type: string,
        style: string,
        widgets: [
          {
            id: number,
            name: string,
            slug: string,
            type: string,
            position: number,
            layout: {
              id: number,
              name: string,
              slug: string,
              type: string,
              layout_type: string,
              rows: number,
              columns: number,
              number_max_elements: number,
              orientation: string,
              navigation_type: string,
              pagination_indicator: string,
              view_all_position: string,
              move_after_behaviour: string,
              move_after_index_vertical: number,
              move_after_index_horizontal: number,
              show_element_loader: number,
              element_vertical_spacing: number,
              element_horizontal_spacing: number,
              assets_format_ratio: number,
              presentation_order: string,
              style: string,
              animation_transition_speed: number,
              autoscroll_timeout: number,
              show_elements_view_bookmark: string,
              show_elements_rating: string,
              show_elements_title: string,
              show_elements_favorite: string,
              metadata_position: string,
              element_placeholder_image: string,
              show_playlist_title: number,
              show_asset_description: number,
              asset_description_size: number
            },
            playlist: {
              id: number,
              name: string,
              slug: string,
              type: string,
              description: string,
              image: {
                url: string
              },
              seo: {
                name: string,
                description: string,
                keywords: [
                  {
                    slug: string,
                    name: string
                  }
                  ]
              },
              genres: [
                {
                  id: number,
                  name: string,
                  slug: string,
                  type: string,
                  image: {
                    url: string
                  }
                }
                ],
              asset_type: [
                string
                ],
              playlist_ref: string,
              contents: [
                {
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
                ],
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
          }
          ]
      }
      ],
    layout: {
      id: number,
      name: string,
      slug: string,
      type: string,
      screen_type: string,
      background: {
        type: string,
        size: number,
        image_template: string,
        color: string
      },
      image: {
        aspect_ratio: number,
        image_template: string
      },
      expand_episode_cell: number,
      season_selection_type: string,
      buttons_positioning: {
        icon_button: [
          {
            name: string,
            on_image: string,
            off_image: string,
            action: string
          }
          ],
        full_button: [
          {
            name: string,
            on_image: string,
            off_image: string,
            action: string
          }
          ]
      }
    }
  }
}
