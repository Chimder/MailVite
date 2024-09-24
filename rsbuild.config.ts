import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

const { publicVars } = loadEnv({ prefixes: ['VITE_'] })
export default defineConfig({
  plugins: [pluginReact() ],
  html: {
    template: './index.html',
  },
  source: {
    define: publicVars,
    entry: {
      index: './src/app/main.tsx',
    },
  },
 
})
