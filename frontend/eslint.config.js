import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'

export default defineConfig([stylistic.configs.recommended, {
  ignores: ['dist', 'node_modules'],
},
{ files: ['**/*.{js,mjs,cjs}'], plugins: { js, reactPlugin }, extends: ['js/recommended'] },
{ files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
])
