const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

// 帖子列表
function getTopics() {
  axios.get('https://tieba.baidu.com/f', {
    params: {
      'kw': '高达模型', // axios会进行url编码, 如果写入编码后的数据, 会被再次编码, 导致404
      'ie': 'utf-8',
      'pn': '0', // 页数 50 的倍数
      'pagelets': 'frs-list/pagelet/thread',
      'pagelets_stamp': '1602726575670'
    },
    proxy: {
      host: '127.0.0.1',
      port: 8888,
    },
  }).then(res => {
    const html = res.data

    const re = /Bigpipe.register\("frs-list\/pagelet\/thread_list", {"content":(".*"),"parent"/
    const str = JSON.parse(html.match(re)[1])
    // fs.writeFileSync('./parsed', str)

    const $ = cheerio.load(str)

    $('.j_thread_list').each(function (index, item) {
      const title = $(this).find('a.j_th_tit')
      console.log(index, title.text(), 'https://tieba.baidu.com' + title.attr('href'))
      const images = $(this).find('.threadlist_media img')
      if(images.length) {
        images.each(function(index, item) {
          console.log(`图${index + 1}`, $(this).attr('bpic'))
        })
      }
    })
  })
}


// 一个帖子
function getTopicDetail() {
  axios.get('https://tieba.baidu.com/p/7029367562', {
    params: {
      pn: 1, // 第一页: 1
      ajax: 1,
      t: 1603270535773
    }
  }).then(res => {
    const html = res.data
    const $ = cheerio.load(html)
    let result = []
    $('.d_post_content').each((index, item) => {
      console.log(index)
      console.log($(item).text().trim() || '无文字评论')
      const images = $(item).find('img')
      if(images.length) {
        images.each((index, item) => {
          console.log(`图${index+1}, ${$(item).attr('src')}`)
        })
      }
    })
  })
}

getTopicDetail()
