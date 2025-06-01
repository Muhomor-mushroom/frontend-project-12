import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([stylistic.configs.recommended, {
  ignores: ['./frontend/dist', './frontend/node_modules', './frontend/build'],
},
{ files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
{ files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
])
