
/**
 * @roxi/routify 2.7.3
 * File generated Tue Dec 08 2020 17:53:40 GMT-0300 (Brasilia Standard Time)
 */

export const __version = "2.7.3"
export const __timestamp = "2020-12-08T20:53:40.273Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
  "root": true,
  "ownMeta": {
    "preload": "proximity"
  },
  "children": [
    {
      "isFallback": true,
      "meta": {
        "recursive": true,
        "preload": "proximity",
        "prerender": true
      },
      "path": "/_fallback",
      "component": () => import('../src/pages/_fallback.svelte').then(m => m.default)
    },
    {
      "isDir": true,
      "children": [
        {
          "isFallback": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/_fallback",
          "id": "_example__fallback",
          "component": () => import('../src/pages/example/_fallback.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "children": [
            {
              "isIndex": true,
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/aliasing/index",
              "id": "_example_aliasing_index",
              "component": () => import('../src/pages/example/aliasing/index.svelte').then(m => m.default)
            },
            {
              "isDir": true,
              "children": [
                {
                  "isFallback": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1.1/_fallback",
                  "id": "_example_aliasing_v1_1__fallback",
                  "component": () => import('../src/pages/example/aliasing/v1.1/_fallback.svelte').then(m => m.default)
                },
                {
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1.1/feature2",
                  "id": "_example_aliasing_v1_1_feature2",
                  "component": () => import('../src/pages/example/aliasing/v1.1/feature2.svelte').then(m => m.default)
                },
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1.1/index",
                  "id": "_example_aliasing_v1_1_index",
                  "component": () => import('../src/pages/example/aliasing/v1.1/index.svelte').then(m => m.default)
                }
              ],
              "isLayout": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/aliasing/v1.1",
              "id": "_example_aliasing_v1_1__layout",
              "component": () => import('../src/pages/example/aliasing/v1.1/_layout.svelte').then(m => m.default)
            },
            {
              "isDir": true,
              "children": [
                {
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1/feature1",
                  "id": "_example_aliasing_v1_feature1",
                  "component": () => import('../src/pages/example/aliasing/v1/feature1.svelte').then(m => m.default)
                },
                {
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1/feature2",
                  "id": "_example_aliasing_v1_feature2",
                  "component": () => import('../src/pages/example/aliasing/v1/feature2.svelte').then(m => m.default)
                },
                {
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1/feature3",
                  "id": "_example_aliasing_v1_feature3",
                  "component": () => import('../src/pages/example/aliasing/v1/feature3.svelte').then(m => m.default)
                },
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/aliasing/v1/index",
                  "id": "_example_aliasing_v1_index",
                  "component": () => import('../src/pages/example/aliasing/v1/index.svelte').then(m => m.default)
                }
              ],
              "isLayout": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/aliasing/v1",
              "id": "_example_aliasing_v1__layout",
              "component": () => import('../src/pages/example/aliasing/v1/_layout.svelte').then(m => m.default)
            }
          ],
          "isLayout": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/aliasing",
          "id": "_example_aliasing__layout",
          "component": () => import('../src/pages/example/aliasing/_layout.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "children": [
            {
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/api/:showId",
              "id": "_example_api__showId",
              "component": () => import('../src/pages/example/api/[showId].svelte').then(m => m.default)
            },
            {
              "isIndex": true,
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/api/index",
              "id": "_example_api_index",
              "component": () => import('../src/pages/example/api/index.svelte').then(m => m.default)
            }
          ],
          "isLayout": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/api",
          "id": "_example_api__layout",
          "component": () => import('../src/pages/example/api/_layout.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "children": [
            {
              "isFallback": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/app/_fallback",
              "id": "_example_app__fallback",
              "component": () => import('../src/pages/example/app/_fallback.svelte').then(m => m.default)
            },
            {
              "isIndex": true,
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/app/index",
              "id": "_example_app_index",
              "component": () => import('../src/pages/example/app/index.svelte').then(m => m.default)
            },
            {
              "isDir": true,
              "children": [
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/app/login/index",
                  "id": "_example_app_login_index",
                  "component": () => import('../src/pages/example/app/login/index.svelte').then(m => m.default)
                }
              ],
              "isLayout": true,
              "isReset": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/app/login",
              "id": "_example_app_login__reset",
              "component": () => import('../src/pages/example/app/login/_reset.svelte').then(m => m.default)
            }
          ],
          "isLayout": true,
          "isReset": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/app",
          "id": "_example_app__reset",
          "component": () => import('../src/pages/example/app/_reset.svelte').then(m => m.default)
        },
        {
          "isIndex": true,
          "isPage": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/index",
          "id": "_example_index",
          "component": () => import('../src/pages/example/index.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "children": [
            {
              "isDir": true,
              "children": [
                {
                  "isDir": true,
                  "children": [
                    {
                      "isIndex": true,
                      "isPage": true,
                      "meta": {
                        "recursive": true,
                        "preload": "proximity",
                        "prerender": true
                      },
                      "path": "/example/layouts/child/grandchild/index",
                      "id": "_example_layouts_child_grandchild_index",
                      "component": () => import('../src/pages/example/layouts/child/grandchild/index.svelte').then(m => m.default)
                    }
                  ],
                  "isLayout": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/layouts/child/grandchild",
                  "id": "_example_layouts_child_grandchild__layout",
                  "component": () => import('../src/pages/example/layouts/child/grandchild/_layout.svelte').then(m => m.default)
                },
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/layouts/child/index",
                  "id": "_example_layouts_child_index",
                  "component": () => import('../src/pages/example/layouts/child/index.svelte').then(m => m.default)
                }
              ],
              "isLayout": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/layouts/child",
              "id": "_example_layouts_child__layout",
              "component": () => import('../src/pages/example/layouts/child/_layout.svelte').then(m => m.default)
            },
            {
              "isIndex": true,
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/layouts/index",
              "id": "_example_layouts_index",
              "component": () => import('../src/pages/example/layouts/index.svelte').then(m => m.default)
            }
          ],
          "isLayout": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/layouts",
          "id": "_example_layouts__layout",
          "component": () => import('../src/pages/example/layouts/_layout.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "children": [
            {
              "isDir": true,
              "children": [
                {
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/modal/animated/:key",
                  "id": "_example_modal_animated__key",
                  "component": () => import('../src/pages/example/modal/animated/[key].svelte').then(m => m.default)
                },
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/modal/animated/index",
                  "id": "_example_modal_animated_index",
                  "component": () => import('../src/pages/example/modal/animated/index.svelte').then(m => m.default)
                }
              ],
              "isLayout": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/modal/animated",
              "id": "_example_modal_animated__layout",
              "component": () => import('../src/pages/example/modal/animated/_layout.svelte').then(m => m.default)
            },
            {
              "isDir": true,
              "children": [
                {
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/modal/basic/:key",
                  "id": "_example_modal_basic__key",
                  "component": () => import('../src/pages/example/modal/basic/[key].svelte').then(m => m.default)
                },
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/modal/basic/index",
                  "id": "_example_modal_basic_index",
                  "component": () => import('../src/pages/example/modal/basic/index.svelte').then(m => m.default)
                }
              ],
              "isLayout": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/modal/basic",
              "id": "_example_modal_basic__layout",
              "component": () => import('../src/pages/example/modal/basic/_layout.svelte').then(m => m.default)
            },
            {
              "isIndex": true,
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/modal/index",
              "id": "_example_modal_index",
              "component": () => import('../src/pages/example/modal/index.svelte').then(m => m.default)
            }
          ],
          "isLayout": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/modal",
          "id": "_example_modal__layout",
          "component": () => import('../src/pages/example/modal/_layout.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "children": [
            {
              "isFallback": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/reset/_fallback",
              "id": "_example_reset__fallback",
              "component": () => import('../src/pages/example/reset/_fallback.svelte').then(m => m.default)
            },
            {
              "isIndex": true,
              "isPage": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/reset/index",
              "id": "_example_reset_index",
              "component": () => import('../src/pages/example/reset/index.svelte').then(m => m.default)
            }
          ],
          "isLayout": true,
          "isReset": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/reset",
          "id": "_example_reset__reset",
          "component": () => import('../src/pages/example/reset/_reset.svelte').then(m => m.default)
        },
        {
          "isPage": true,
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/Splash",
          "id": "_example_Splash",
          "component": () => import('../src/pages/example/Splash.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isDir": true,
              "children": [
                {
                  "isPage": true,
                  "ownMeta": {
                    "index": 0
                  },
                  "meta": {
                    "index": 0,
                    "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/transitions/tabs/home",
                  "id": "_example_transitions_tabs_home",
                  "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_home)
                },
                {
                  "isIndex": true,
                  "isPage": true,
                  "meta": {
                    "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/transitions/tabs/index",
                  "id": "_example_transitions_tabs_index",
                  "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_index)
                },
                {
                  "isDir": true,
                  "children": [
                    {
                      "isDir": true,
                      "ext": "",
                      "children": [
                        {
                          "isIndex": true,
                          "isPage": true,
                          "meta": {
                            "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                            "recursive": true,
                            "preload": "proximity",
                            "prerender": true
                          },
                          "path": "/example/transitions/tabs/feed/:id/index",
                          "id": "_example_transitions_tabs_feed__id_index",
                          "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_feed__id_index)
                        }
                      ],
                      "meta": {
                        "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                        "recursive": true,
                        "preload": "proximity",
                        "prerender": true
                      },
                      "path": "/example/transitions/tabs/feed/:id"
                    },
                    {
                      "isIndex": true,
                      "isPage": true,
                      "meta": {
                        "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                        "recursive": true,
                        "preload": "proximity",
                        "prerender": true
                      },
                      "path": "/example/transitions/tabs/feed/index",
                      "id": "_example_transitions_tabs_feed_index",
                      "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_feed_index)
                    }
                  ],
                  "isLayout": true,
                  "ownMeta": {
                    "index": 1
                  },
                  "meta": {
                    "index": 1,
                    "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/transitions/tabs/feed",
                  "id": "_example_transitions_tabs_feed__layout",
                  "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_feed__layout)
                },
                {
                  "isPage": true,
                  "ownMeta": {
                    "index": 2
                  },
                  "meta": {
                    "index": 2,
                    "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/transitions/tabs/updates",
                  "id": "_example_transitions_tabs_updates",
                  "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_updates)
                },
                {
                  "isPage": true,
                  "ownMeta": {
                    "index": 3
                  },
                  "meta": {
                    "index": 3,
                    "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                    "recursive": true,
                    "preload": "proximity",
                    "prerender": true
                  },
                  "path": "/example/transitions/tabs/settings",
                  "id": "_example_transitions_tabs_settings",
                  "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs_settings)
                }
              ],
              "isLayout": true,
              "isReset": true,
              "ownMeta": {
                "bundle": true
              },
              "meta": {
                "bundle": true,
                "$$bundleId": "_example_transitions_tabs__reset_svelte.js",
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/transitions/tabs",
              "id": "_example_transitions_tabs__reset",
              "component": () => import('./_example_transitions_tabs__reset_svelte.js').then(m => m._example_transitions_tabs__reset)
            }
          ],
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/transitions"
        },
        {
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isFallback": true,
              "meta": {
                "recursive": true,
                "preload": "proximity",
                "prerender": true
              },
              "path": "/example/widget/_fallback",
              "id": "_example_widget__fallback",
              "component": () => import('../src/pages/example/widget/_fallback.svelte').then(m => m.default)
            }
          ],
          "meta": {
            "recursive": true,
            "preload": "proximity",
            "prerender": true
          },
          "path": "/example/widget"
        }
      ],
      "isLayout": true,
      "isReset": true,
      "meta": {
        "recursive": true,
        "preload": "proximity",
        "prerender": true
      },
      "path": "/example",
      "id": "_example__reset",
      "component": () => import('../src/pages/example/_reset.svelte').then(m => m.default)
    },
    {
      "isIndex": true,
      "isPage": true,
      "meta": {
        "recursive": true,
        "preload": "proximity",
        "prerender": true
      },
      "path": "/index",
      "id": "_index",
      "component": () => import('../src/pages/index.svelte').then(m => m.default)
    }
  ],
  "isLayout": true,
  "meta": {
    "preload": "proximity",
    "recursive": true,
    "prerender": true
  },
  "path": "/",
  "id": "__layout",
  "component": () => import('../src/pages/_layout.svelte').then(m => m.default)
}


export const {tree, routes} = buildClientTree(_tree)

