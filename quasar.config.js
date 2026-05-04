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
          primary: '#4caf50',
          secondary: '#ff9800',
          accent: '#9c27b0',
          positive: '#4caf50',
          negative: '#ef5350',
          info: '#42a5f5',
          warning: '#ff9800'
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
