import { fileURLToPath } from 'node:url'
import boundaries from 'eslint-plugin-boundaries'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
export default [
  { ignores: ['dist/**', 'node_modules/**', '.tools/**', 'test-results/**', 'playwright-report/**'] },
  {
    files: ['src/**/*.{ts,vue}'],
    ignores: ['src/env.d.ts'],
    languageOptions: { parser: tseslint.parser },
    plugins: { boundaries },
    settings: {
      'boundaries/root-path': fileURLToPath(new URL('.', import.meta.url)),
      'boundaries/dependency-nodes': ['import', 'export', 'dynamic-import', 'require'],
      'boundaries/elements': layers.map(type => ({ type, pattern: type === 'app' ? 'src/app' : `src/${type}/*` })),
      'import/resolver': { typescript: { project: './tsconfig.json', extensions: ['.ts', '.vue', '.js'] } },
    },
    rules: {
      'boundaries/dependencies': ['error', { default: 'disallow', policies: layers.map((type, index) => ({
        from: { element: { type } },
        allow: { to: { element: { type: type === 'shared' ? ['shared'] : layers.slice(index + 1), fileInternalPath: 'index.ts' } } },
      })) }],
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/no-unknown-files': 'error',
    },
  },
  { files: ['src/**/*.vue'], languageOptions: { parser: vueParser, parserOptions: { parser: tseslint.parser } } },
  {
    files: ['src/**/*.{ts,vue}'],
    ignores: ['src/shared/ui/**', 'src/app/providers/ui.ts'],
    rules: { 'no-restricted-imports': ['error', { patterns: [{ group: ['primevue', 'primevue/**', '@primeuix/themes', '@primeuix/themes/**'], message: 'Import UI components through shared/ui.' }] }] },
  },
]
