import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    {
        ignores: ["assets/dist_transformers/", "assets/dist/", "demos/whisper-base/static/js/*"],
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
];
