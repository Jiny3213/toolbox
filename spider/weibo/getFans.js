const axios = require('axios')
let id = 1940

async function loopGetFans(id) {
  return axios.get('https://m.weibo.cn/api/container/getIndex', {
    params: {
      containerid: '231051_-_fans_-_6375093475',
      since_id: id
    }
  }).then(res => {
    const fanList = res.data.data.cards[0].card_group
    // console.log(fanList.length)
    let goodLoop = false
    for(item of fanList) {
      let fanName =  item.user.screen_name
      // console.log(item.user.screen_name)
      if(/用户/.test(fanName)) {
        console.log(fanName)
        if(/用户7519852668/.test(fanName)) {
          console.log('!!!!!!!!!')
          goodLoop = true
        }
      }
    }
    if(goodLoop) {
      console.log(`查找到用户, id=${id}`)
      return true
    }
    else {
      return false
    }
  })
}

async function main() {
  let done = false
  while (!done) {
    done = await loopGetFans(id)
    console.log(done)
    if(!done) {
      console.log(`id=${id}, 未能找到`)
      id-=20
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 2000)
      })
    }
    else {
      console.log(`找到用户${id}`)
    }
  }
}

main()