module.exports = {
  "root": true,
  "env": {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 'latest',
    'parser': '@babel/eslint-parser',
  },
  "rules": {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ["warn", { "code": 90 }],
    'vue/multi-word-component-names': ['error', {
      'ignores': ['Layout']
    }],
    'no-trailing-spaces': 'off',
    'quotes': 'off',
    'indent': ['error', 2],
    'comma-dangle': 'off',
    'linebreak-style': ['error', 'linux'],
    'arrow-parens': 'off',
    'require-jsdoc': 'off',
    'no-sparse-arrays': 'off',
    'prefer-const': 'warn',
    'eol-last': ['error', 'never'],
    'object-curly-spacing': 'off',
    'comma-style': ['error', 'last', {'exceptions': {'ArrayExpression': true}}],
    'semi': ['error', 'always', {'omitLastInOneLineBlock': true}],
    'brace-style': ['error', '1tbs', {'allowSingleLine': true}],
    'quote-props': ['error', 'consistent'],
    'key-spacing': ['error'],
    'no-unused-vars': 'warn', // потом включить
    'no-undef': 'warn', // потом включить
    'no-invalid-this': 'error',
    'no-multi-spaces': [
      'warn',
      {
        'ignoreEOLComments':
        true,
        'exceptions': {
          'VariableDeclarator': true,
          'Property': true,
          'ImportDeclaration': true,
        }}],
    // "no-multi-spaces":   "off",
  }
};