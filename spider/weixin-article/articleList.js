/**
 * lastUpdate: 2020-04-27
 * 抓包工具: https://www.telerik.com/fiddler
 * 获取微信文章列表, 需要用登录电脑微信, 点开微信公众号历史文章, 通过抓包工具抓取获取文章列表的请求中的query中的key
 */
const request = require('request-promise');

// 获取微信文章列表
function getArticleList(key, biz, uin) {
  return request({
    // 微信文章列表接口, 当点开微信公众号历史文章并滚动最底下开始异步加载新的文章时, 微信会调用这个接口
    url: 'https://mp.weixin.qq.com/mp/profile_ext',
    qs: {
      // 必要参数
      action: 'getmsg',
      f: 'json',
      __biz: biz, // 与公众号唯一对应, base64编码
      offset: 10, // 将此参数每次递增10以爬取所有文章
      key: key, // 具有时效性
      uin: uin, // 与微信账号唯一对应, base64编码

      // 非必要参数
      // count: 10, // 每页文章数, 只能是10
      // is_ok: 1,
      // scene: 124,
      // pass_ticket: 'gg6tpUpfXoHIkGZxiPDqAJ%2BFNFabkOnBHMSaMavpx%2F7WqXNN7UdruaeCOizphq%2Bv',
      // appmsg_token: '1058_74AYqP72hQZWKmYcOELnkY5gDJZlJL8ZPRKIew~~',
      // x5: 0,
    },
  }).then(body => {
    let data = JSON.parse(body)
    if(data.errmsg !== 'ok') {
      throw new Error('爬取失败, 请检查key是否过期')
      return []
    } else {
      // console.log(data['msg_count']) // 有多少个结果被返回, 当这个参数为0, 说明没有文章了
      const articleList = JSON.parse(data['general_msg_list']).list
      return articleList
    }
    // for(let item of list) {
    //   console.log(item['app_msg_ext_info']['content_url']) // 文章链接
    // }
  });
}

module.exports = {
  getArticleList
}
