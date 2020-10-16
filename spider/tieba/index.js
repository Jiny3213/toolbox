const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

// 帖子列表
// axios.get('https://tieba.baidu.com/f?kw=%E9%AB%98%E8%BE%BE%E6%A8%A1%E5%9E%8B&ie=utf-8&pn=0&pagelets=frs-list%2Fpagelet%2Fthread&pagelets_stamp=1602726575670')
//   .then(res => {
//     // console.log(res.data)
//     const html = res.data
//
//     const re = /Bigpipe.register\("frs-list\/pagelet\/thread_list", {"content":(".*"),"parent"/
//     const str = JSON.parse(html.match(re)[1])
//     // fs.writeFileSync('./parsed', str)
//
//     const $ = cheerio.load(str)
//
//     $('.j_thread_list a.j_th_tit').each((function(index,item) {
//         console.log(index, $(this).text(), 'https://tieba.baidu.com' + $(this).attr('href'))
//     }))
//   })

axios({
  baseURL: 'https://tieba.baidu.com/',
  url: '/f',
  params: {
    'kw': '%E9%AB%98%E8%BE%BE%E6%A8%A1%E5%9E%8B',
    'ie': 'utf-8',
    'pn': '0',
    'pagelets': 'frs-list%2Fpagelet%2Fthread',
    'pagelets_stamp': '1602726575670'
  }
}).then(res => {
  console.log(res.data)
  console.log(res.headers)
  const html = res.data

  const re = /Bigpipe.register\("frs-list\/pagelet\/thread_list", {"content":(".*"),"parent"/
  const str = JSON.parse(html.match(re)[1])
  // fs.writeFileSync('./parsed', str)

  const $ = cheerio.load(str)

  $('.j_thread_list a.j_th_tit').each((function(index,item) {
    console.log(index, $(this).text(), 'https://tieba.baidu.com' + $(this).attr('href'))
  }))
})
