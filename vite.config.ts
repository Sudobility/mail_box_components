import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { existsSync } from 'fs';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

// Each folded-in module is a build entry, exposed via a subpath export
// (e.g. `@sudobility/components/subscription`). Derive the entries from the
// package.json `exports` map so the two stay in sync.
const moduleEntries = Object.fromEntries(
  Object.keys(pkg.exports as Record<string, unknown>)
    .filter(
      k =>
        k.startsWith('./') &&
        !['./ui/toast', './*', './package.json'].includes(k) &&
        existsSync(resolve(__dirname, 'src', k.slice(2), 'index.ts'))
    )
    .map(k => [k.slice(2), resolve(__dirname, 'src', k.slice(2), 'index.ts')])
);

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  esbuild: {
    jsx: 'automatic',
    jsxDev: false,
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...moduleEntries,
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@sudobility/design',
        '@sudobility/types',
        // Deps pulled in by folded-in modules — external so consumers provide
        // them (and so their RN/Flow transitive code isn't parsed/bundled).
        '@sudobility/di',
        '@sudobility/subscription_lib',
        '@revenuecat/purchases-js',
        'recharts',
        /^firebase(\/.*)?$/,
        /^react-native(\/.*)?$/,
        /^@react-native-firebase\//,
        /^expo(-|\/|$)/,
        '@heroicons/react/20/solid',
        '@heroicons/react/24/outline',
        '@heroicons/react/24/solid',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-dialog',
        '@radix-ui/react-label',
        '@radix-ui/react-select',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        // Optional peer dependencies
        'react-i18next',
        'i18next',
        'react-router-dom',
        'react-share',
        'web-vitals',
      ],
      output: {
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
