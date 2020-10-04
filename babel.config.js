module.exports = function(api) {
  api.cache(false);
  const presets = [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ];
  const plugins = [
    "react-hot-loader/babel",
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["import", { "libraryName": "tezign-ui", "libraryDirectory": "lib", "style": true }, "tezign-ui"],
    "<bizPackage>",
    // 如果需要添加其他的 import 转换
    // ["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib"}, "antd-mobile"]
  ];
  return {
    presets,
    plugins
  }
}