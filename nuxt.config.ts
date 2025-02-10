// https://nuxt.com/docs/api/configuration/nuxt-config
import * as fs from "node:fs";
import path from "node:path";

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)
const appVersion = packageJson.version

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: false},
    devServer: {
        host: '127.0.0.1',
        port: 1007
    },
    modules: [
        '@nuxt/image',
        '@nuxt/icon',
        '@nuxt/eslint',
        '@nuxtjs/i18n',
        '@nuxtjs/color-mode',
        '@nuxtjs/sitemap',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        '@vite-pwa/nuxt',
        'dayjs-nuxt',
        'nuxt-schema-org'
    ],
    runtimeConfig: {
        MONGODB_URL: process.env.MONGODB_URL,

        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,

        JWT_ISS: process.env.JWT_ISS,
        JWT_AUD: process.env.JWT_AUD,
        JWT_SECRET: process.env.JWT_SECRET,

        public: {
            FORUM_VERSION: appVersion,
            YZFORUM_URL: import.meta.dev ? process.env.YZFORUM_URL : process.env.YZFORUM_URL_PRODUCT,
            YZFORUM_URL_PRODUCT: process.env.YZFORUM_URL_PRODUCT
        }
    },
    imports: {
        dirs: ['./composables', './utils', './store/**/*.ts']
    },
    css: ['~/assets/css/index.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    additionalData: '@use "~/assets/css/mixins.scss" as *;'
                }
            }
        },
        esbuild: {
            drop: ['console', 'debugger']
        }
    },

    icon: {
        fetchTimeout: 7777,
        provider: 'iconify',
        serverBundle: false
    },

    piniaPluginPersistedstate: {
        cookieOptions: {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'strict'
        }
    },

    i18n: {
        langDir: './language',
        locales: [
            {
                code: 'en-us',
                language: 'en-US',
                file: 'en.json'
            },
            {
                code: 'zh-cn',
                language: 'zh-CN',
                file: 'zh-CN.json'
            },
            {
                code: 'ja-jp',
                language: 'ja-JP',
                file: 'ja-JP.json'
            }
        ],
        defaultLocale: 'zh-cn',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'yzforum-language',
            redirectOn: 'root'
        }
    },

    colorMode: {
        preference: 'system',
        fallback: 'light',
        hid: 'nuxt-color-mode-script',
        globalName: '__YZFORUM_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: 'yz-',
        classSuffix: '-mode',
        storageKey: 'yzforum-color-mode'
    },

    // 后端
    pwa: {
        registerType: 'autoUpdate',
        disable: process.env.NODE_ENV === 'development',
        manifest: {
            name: 'Yuzu Game Forum',
            short_name: 'YzForum',
            theme_color: '#218bff',
            icons: [
                {
                    src: 'pwa/192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa/512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                },
                {
                    src: 'pwa/512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ]
        },
        workbox: {
            globPatterns: ['**/*.{js,css,png,webp,svg,ico}'],
            navigateFallback: null
        },
        client: {
            installPrompt: true
        }
    },

    nitro: {
        experimental: {
            websocket: true
        }
    }
})
