import { fileURLToPath } from 'node:url'
import { basename, dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      tsconfigPath: resolve(currentDir, 'tsconfig.json'),
      exclude: ['vite.config.ts', '**/*.test.*', '**/*.spec.*'],
      beforeWriteFile: (filePath, content) => {
        const fileName = basename(filePath)

        if (fileName === 'loading.d.ts' || fileName === 'org-layout.d.ts') {
          return false
        }

        return {
          filePath,
          content,
        }
      },
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(currentDir, 'src/index.ts'),
        loading: resolve(currentDir, 'src/loading/index.tsx'),
        'org-layout': resolve(currentDir, 'src/org-layout/index.tsx'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index'
          ? format === 'es'
            ? 'index.js'
            : 'index.cjs'
          : format === 'es'
            ? `${entryName}/index.js`
            : `${entryName}/index.cjs`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'antd'],
      output: {
        chunkFileNames: 'shared/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          antd: 'antd',
        },
      },
    },
  },
})