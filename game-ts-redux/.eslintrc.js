module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'unused-imports'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
        // Allow any TypeScript-related comments
        '@typescript-eslint/ban-ts-comment': 'off',
        // Allow unused imports
        'unused-imports/no-unused-imports-ts': 'off',
        // Disable other rules if needed
        '@typescript-eslint/consistent-type-definitions': 'off',
        'no-var': 'off',
    },
}
