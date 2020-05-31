module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "__dirname": "readonly",
        "process": "writable"
    },
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {}
};