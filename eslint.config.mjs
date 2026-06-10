import {defineConfig, globalIgnores} from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        linterOptions: {
            reportUnusedDisableDirectives: "warn",
        },
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            "curly": ["warn", "all"],
            "eqeqeq": ["error", "always", {null: "ignore"}],
            "no-alert": "error",
            "no-debugger": "error",
            "no-implicit-coercion": "error",
            "no-var": "error",
            "object-shorthand": ["error", "always"],
            "prefer-const": ["error", {destructuring: "all"}],
            "prefer-template": "error",
            "no-console": ["warn", {allow: ["warn", "error"]}],
            "react/jsx-curly-brace-presence": [
                "warn",
                {props: "never", children: "never"},
            ],
            "react/jsx-no-useless-fragment": "warn",
            "react/self-closing-comp": "warn",
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                {
                    prefer: "type-imports",
                    fixStyle: "separate-type-imports",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "react/destructuring-assignment": [
                "warn",
                "always",
                {
                    destructureInSignature: "always",
                },
            ],
            "object-curly-newline": [
                "warn",
                {
                    ObjectPattern: {
                        multiline: false,
                        minProperties: 999,
                    },
                },
            ],
        },
    },
    // Must be last: disables stylistic rules that conflict with Prettier.
    prettierConfig,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "components/_archive/**",
        ".codex-animals-archive/**",
    ]),
]);

export default eslintConfig;
