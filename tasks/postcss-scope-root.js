module.exports = (options) => ({
  postcssPlugin: 'postcss-scope-root',
  Rule: (rule) => {
    if (rule.selector === ':root') {
      rule.selector = options.customPropRoot;
    }
  },
});
module.exports.postcss = true;
