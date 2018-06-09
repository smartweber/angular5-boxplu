export interface Stream {
  stream: {
    id: string,
    name: string,
    slug: string,
    type: string,
    format: string,
    url: string,
    MIMEType: string,
    drm: {
      type: string,
      url: string,
      data: {
        license_url: string,
        custom_data: string,
        cpName: string,
        vcas: string,
        drmServerURL: string,
        heartbeatPeriod: number,
        heartbeatURL: string,
        drmAckServerURL: string,
        streamID: string,
        portalID: string,
        userData: string,
        certificate: string,
        asset: string,
        content_key: string
      }
    },
    live: number,
    ads: {
      type: string,
      vmap: string,
      vast: [
        {
          url: string,
          timeOffset: string
        }
        ]
    }
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
      controls: {
        allow_ff: number,
        allow_fb: number,
        show_ads: number
      }
    }
  }
}
