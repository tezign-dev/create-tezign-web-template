module.exports={
  "extends": "stylelint-config-standard",
  "plugins": [
   "stylelint-scss"
 ],
   "rules": {
      "declaration-empty-line-before": ["never", {"severity": "warning"}],
      "no-empty-source": [true, {"severity": "warning"}],
      "rule-empty-line-before": ["always", {"severity": "warning",except:["after-single-line-comment"]}],
      "selector-list-comma-newline-after": null,
      "no-missing-end-of-source-newline": [true, {"severity": "warning"}],
      "no-eol-whitespace": [true, {"severity": "warning"}],
      "indentation": [2, {"severity": "warning"}],
      "declaration-colon-space-after": ["always", {"severity": "warning"}],
      "block-opening-brace-space-before":  ["always", {"severity": "warning"}],
      "selector-pseudo-class-no-unknown": [true, {"ignorePseudoClasses": ["global","local"]}],
      "block-closing-brace-empty-line-before": ["never", {"severity": "warning"}],
      "color-hex-case": ["lower", {"severity": "warning"}],
      "color-hex-length": ["short", {"severity": "warning"}],
      "block-no-empty":[true, {"severity": "warning"}],
      "no-descending-specificity": null,
      "at-rule-empty-line-before": ["always", {"severity": "warning"}],
      "at-rule-no-unknown": [ true, {
         "ignoreAtRules": ['extend', 'at-root', 'debug', 'warn', 'error', 'if', 'else', 'for', 'each', 'while', 'mixin', 'include', 'content', 'return', 'function']
       }],
       "length-zero-no-unit": null,
       "max-empty-lines": [1, {"severity": "warning"}],
       "selector-combinator-space-after": ["always", {"severity": "warning"}],
       "selector-combinator-space-before":["always", {"severity": "warning"}],
       "declaration-block-no-duplicate-properties":[true, {"severity": "warning"}],
       "no-duplicate-selectors": null,
   }
}
