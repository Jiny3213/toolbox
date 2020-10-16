const axios = require('axios')
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function randomSleep(max) {
  if(max === 0.5) {
    return sleep(500)
  }
  let random = 500 + Math.round(Math.random() * 1000 * (max - 0.5))
  return sleep(random)
}

// 正在刷人气标志, 防止重复开启刷人气进程
let isBrushing = false
// 停止标识, 标识用户点击了停止按钮
let shouldStop = false
module.exports.stop = function(console) {
  if(isBrushing) { // 这里无法取到true的状态!!!!
    shouldStop = true
  }
}
// 刷人气
module.exports.brush = async function brush(console, url, time, cookie, sleep) {
  if(isBrushing) {
    console.warn('已经存在一个刷人气的进程了, 请等待前一个刷完!')
    return
  }
  isBrushing = true
  let isError = false
  let roomId
  for(let i=0; i<time; i++) {
    await axios.request({
      url: url,
      headers: {
        Cookie: 'ko_token=' + cookie // 重要登录状态
      }
    }).then(res => {
      // 取出房间号码
      if(!roomId) {
        roomId = res.data.match(/业务数据.*?\n<input.*?(@.{13})/m)[1]
      }
      return roomId
    }).catch(err => {
      // 网络请求错误处理
      console.error('发生错误!!!')
      console.error(`url是${url}`)
      console.error(`time是${time}`)
      console.error(`cookie是${cookie}`)
      console.error(err)
      isError = true
      isBrushing = false
    })
    if(isError) return
    if(shouldStop) {
      break
    }
    await joinGroup(roomId)
    console.log(`success: ${i+1}`)
    await randomSleep(sleep)
  }
  if(shouldStop) {
    shouldStop = false
    console.warn('已停止刷人气')
  } else {
    console.log(`本次刷人气完成, 一个刷了${time}个人气`)
  }
  isBrushing = false
}

// 这个接口用于websocket发送人次增加给用户
function joinGroup(roomId) {
  axios.request({
    method: "post",
    url: 'https://webim.tim.qq.com/v4/group_open_http_svc/apply_join_group?websdkappid=537048168&v=1.7.3&platform=10&tinyid=144115215858588241&a2=96e5ae348cc89a603372c5897531c1167f7b1e5be8d1093af050d1d114b9b8fa2c991ea03443cb4b8309291b8c708394b85cdb2a31caca64d4e74dae20c392caf69863a767a5e46d&contenttype=json&sdkappid=1400017628&accounttype=5267&apn=1&reqtime=1593572135',
    data: `{"GroupId":"${roomId}"}`
  }).then(res => {
    return res.data
  })
}
