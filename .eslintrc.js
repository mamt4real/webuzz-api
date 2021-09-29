module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "airbnb",
        "prettier"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules":{
        "prettier/prettier":"error",
        "spaced-comment":"off",
        "no-console":"off",
        "consistent-return":"off",
        "func-names":"off",
        "object-shorthand":"off",
        "no-process-exit":"off",
        "no-param-reasssign":"off",
        "no-return-await":"off",
        "no-underscore-dangle":"off",
        "class-method-use-this":"off",
        "prefer-destructuring":["error",{"object":true,"array":false}],
        "no-unused-vars":["error",{"argsIgnorePattern":"req|res|val"}]
    }
};

    