/**
 * 爬取单个微信公众号文章, 转化为静态html页面, 把所有图片转化为base64编码一同塞进html中
 * 应用场景: 企业官网需要部署新闻资讯等静态化页面(方便seo), 而资讯主要在微信公众号上更新
 *
 */
const request = require('request-promise');

// 把图片src转换为base64的src
function getBase64Image(url) {
  return request({
    url,
    encoding: null,
  }).then(body => {
    if(!Buffer.isBuffer(body)) {
      throw new Error('获取图片失败, 请给出正确的图片链接!')
      return
    }
    return 'data:image/jpg;base64,' + body.toString('base64');
  });
}
function getSingleArticle(url) {
// 把单个微信文章转换为静态html
    return request({
      url,
    }).then(async body => {
      // 去除script标签
      let html = body.replace(/<script[\S\s]*?<\/script>/g, '')
      // 去除不可见样式
      html = html.replace(/visibility:[\S\s]*?hidden/g, '')
      // todo: 图片压缩, node很难做到, 可能要调用python
      // 替换背景图片
      const bgImgReg = /(<section.*?background-image: url\(&quot;)(.*?)(&quot;\).*?>)/
      const bgImgMatcher = bgImgReg.exec(html)
      if(bgImgMatcher) {
        const bgImgElement = bgImgMatcher[1] + await getBase64Image(bgImgMatcher[2]) + bgImgMatcher[3]
        html = html.replace(bgImgReg, bgImgElement)
      }
      // 替换图片
      let imgReg = /(<img.*?data-src=")(.*?)(".*?\/>)/g
      let replaceList = []
      while(true) {
        let match = imgReg.exec(html)
        if(match) {
          let src = await getBase64Image(match[2])
          replaceList.push(match[1].replace('data-src', 'src') + src + match[3])
        } else {
          break
        }
      }
      let i = 0
      html = html.replace(imgReg, (match, $1, $2, $3) => {
        return replaceList[i++]
        // todo: 封装异步的replace https://dev.to/ycmjason/stringprototypereplace-asynchronously-28k9
        // let b64 = await getBase64Image($2)
        // console.log($1 + b64 + $3)
        // return $1 + b64 + $3
      })
      return html
    })
  }

module.exports = {
  getBase64Image,
  getSingleArticle
}
