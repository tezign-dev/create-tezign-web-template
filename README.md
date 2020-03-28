### 初始化项目 

1. package.json 中业务公共包的 version 为 `latest` ，根据项目需求修改对应的版本号
1. 修改 src/index.html 中的 `${dsn}` 和 `${pli}`  
1. 运行指令 `npm i` 或者 `yarn`

### 启动项目 

`npm start` 

- 设置环境：通过 `__ENV__` 可以设置不同的开发环境
  ```
  __ENV__=PROD npm start
  ```
- 设置端口
  ```
  PORT=5033 npm start
  ```

### 打包项目 

`npm run build`

- 设置环境
  ```
  __ENV__=PROD npm run build
  // 指令等同👆的效果
  npm run build:prod
  ```

#### 支持的 CMD 指令参数

- 环境变量 `__ENV__`
  
  - webpack 的 DefinePlugin 会在 js 的全局作用域里添加 `__ENV__` 
  - webpack 的 HtmlWebpackPlugin 的 options 也会添加 `__ENV__` 

- 端口 `PORT`

  设置开发模式下的网站端口  

- 添加其他自定义参数 `__XXX__`

  借助 webpack 的 DefinePlugin 来获取 CMD 指令上的自定义参数
  > 配置文件地址: webpack/getConfig.js
  ```js 
  new DefinePlugin({
    __ENV__: JSON.stringify(process.env.__ENV__),
    __XXX__: JSON.stringify(process.env.__XXX__),
    // 更多自定义参数... __???__: JSON.stringify(process.env.__???__),
  }),
  // 如果需要还可以把自定义参数加入到 HtmlWebpackPlugin 的 options 中
  new HtmlWebpackPlugin({
    //... 其他默认配置
    __XXX__: process.env.__XXX__
    // 更多自定义参数... __???__: process.env.__???__,
  }),
  ```

#### webpack 配置常量

在 `webpack/constants.js` 下可以修改常量

### 项目结构说明

```
├── src/
│   ├── commons/ 
│   │   ├── assets/ 静态资源目录
│   │   ├── styles/ 公共样式目录
│   │   ├── utils/ 公用方法目录
│   │   ├── constants.ts 项目常量配置
│   │   └── history.ts 项目使用的 history
│   ├── components/ 组件目录
│   ├── locales/ 国际化文件目录
│   ├── pages/ 页面目录
│   ├── services/ 
│   ├── index.html 网站页面模版
│   ├── index.scss 项目样式入口
│   ├── index.tsx 项目 ts 入口
│   ├── router.tsx 项目的路由配置
│   └── ...
├── webpack/
│   ├── build.js 项目打包模式下的 webpack 配置
│   ├── constants.js webpack 配置常量
│   ├── debug.js 项目开发模式下的 webpack 配置
│   └── getConfig.js 获取公共的 webpack 配置
├── .gitignore
├── babel.config.js
├── index.d.ts
├── package.json
├── READEME.md
└── tsconfig.json
```
