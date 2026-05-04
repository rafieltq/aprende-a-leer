import { defineConfig } from '@quasar/app-vite/wrappers'

export default defineConfig((/* ctx */) => {
  return {
    boot: [],
    css: ['app.scss'],
    extras: ['material-icons'],
    build: {
      target: {
        browser: ['es2020'],
        node: 'node16'
      },
      vueRouterMode: 'history'
    },
    devServer: {
      port: 9000
    },
    framework: {
      config: {
        brand: {
          primary: '#D12052',
          secondary: '#03AED2',
          accent: '#F8DE22',
          positive: '#4CAF50',
          negative: '#F45B26',
          info: '#03AED2',
          warning: '#F45B26'
        }
      },
      plugins: []
    },
    animations: [],
    ssr: { pwa: false },
    pwa: {
      workboxMode: 'generateSW'
    }
  }
})
