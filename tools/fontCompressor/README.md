# 基于font-spider的文字压缩器
- 用于静态页面字体文件压缩
- 通过遍历目录中的所有html文件, 取得其中的所有用到的字符, 用font-spider压缩
- 动态页面不适用

### 开发背景
- 开发公司官网Vue前端项目时, 使用vuecli3结合prerender-spa-plugin构建静态页面, 进行seo优化: [参考链接](https://www.jianshu.com/p/718fe15b3835)
- 由于设计稿中使用了多种不同的字体, 字体文件大多在10Mb左右, 体检极差

### npm package
- font-spider
