// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json', // path of tsconfig file
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    'array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 2,
      },
    ],
    'array-element-newline': [
      'error',
      {
        multiline: true,
        minItems: 2,
      },
    ],
    camelcase: 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': [
      2,
      {
        allowShortCircuit: true,
      },
    ],
    'import/first': 'off',
    'import/extensions': 'off',
    'import/newline-after-import': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-empty-function': [
      'error',
      {
        allow: ['constructors'],
      },
    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'multiline-ternary': ['warn', 'always-multiline'],
    'newline-per-chained-call': [
      'error',
      {
        ignoreChainWithDepth: 2,
      },
    ],
    'no-duplicate-imports': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 1,
      },
    ],
    'object-curly-newline': [
      'error',
      {
        minProperties: 2,
        multiline: true,
        consistent: true,
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'operator-linebreak': ['error', 'after'],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'return',
          'class',
          'export',
          'switch',
          'throw',
          'try',
          'while',
          'for',
          'block',
          'if',
        ],
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'any',
        prev: ['export'],
        next: ['export'],
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
      },
    ],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: false,
      },
    ],
    curly: ['error', 'all'],
    '@typescript-eslint/member-delimiter-style': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
