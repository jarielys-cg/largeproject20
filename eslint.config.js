// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint(
    { ignores: ["dist", "build", "coverage", "*.js"] },

    js.configs.recommended,
    tseslint.configs.recommended,

    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {

        },
    },
);