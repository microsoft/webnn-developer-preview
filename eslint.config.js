import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

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
    eslintPluginPrettierRecommended,
];
