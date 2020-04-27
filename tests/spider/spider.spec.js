const {getSingleArticle, getBase64Image} = require("../../node/spider/weixin-article/article")
const {getArticleList} = require('../../node/spider/weixin-article/articleList')

describe('test weixin article spider', () => {

  test('get the correct image form baidu', async () => {
    let baiduImage = 'https://www.baidu.com/img/bd_logo1.png'
    let baiduImageB64 = await getBase64Image(baiduImage)
    expect(baiduImageB64).toMatch(/^data:image\/jpg;base64,/)
    expect(baiduImageB64.length).toBeGreaterThan(100)
  })

  test('get the correct article in 10s', async () => {
    let articleUrl = 'https://mp.weixin.qq.com/s/2xKkM3VSm1TzfuVQk6fyuA'
    let timeBefore = new Date().getTime()
    let html = await getSingleArticle(articleUrl)
    let timeAfter = new Date().getTime()
    console.log('get article in ' + (timeAfter - timeBefore) / 1000 + 's')
    expect((timeAfter - timeBefore) / 1000).toBeLessThan(10)
    expect(html).toMatch(/<html/)
  })

  /**
   * you must catch the package for a key, biz, uin before this test!! see article.js for suggest.
   */
  // test('get correct article list', async () => {
  //   let key = 'ccd5ddabfc37519163761e9e3169f322c937c15e8bd6027aa16e34e119f6611311bc72037806a3210b0edc04546068771f874459dd1007da9b476ccf3f1e3b6f6d44e2d972c4b6316dc72cdea76d49bb'
  //   let biz = 'MzI5ODQ1MzY1NQ=='
  //   let uin = 'your uin'
  //   let article = await getArticleList(key, biz, uin)
  //   expect(article.length).toEqual(10)
  // })
})
