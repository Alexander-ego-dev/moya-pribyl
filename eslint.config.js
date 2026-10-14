import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config({ignores:['dist/**','node_modules/**','.update-check/**']},js.configs.recommended,...ts.configs.recommended,{files:['**/*.{ts,tsx}'],rules:{'@typescript-eslint/no-explicit-any':'error'}},{files:['**/*.js','**/*.mjs'],languageOptions:{globals:{process:'readonly',console:'readonly'}}});
