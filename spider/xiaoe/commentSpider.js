const axios = require('axios')
// 分享链接示例:
const exampleLink = 'https://appb0chwvkb4794.h5.xiaoeknow.com/v1/course/alive/l_5ffc2974e4b0ab9a2544de2c?type=2'

const koToken = 'e284de035c7961e21ae19773856edd4e'

function getRoomId(aliveId) {
  return axios.request('https://appb0chwvkb4794.h5.xiaoeknow.com/_alive/alivePageData', {
    method: 'post',
    headers: {
      Cookie: `ko_token=${koToken}`,
    },
    data: `buz_data[alive_id]=${aliveId}`
  }).then(res => {
    return res.data.data.pageData.room_id
  })
}

function getDiscussNumber(roomId) {
  return axios.request('https://appb0chwvkb4794.h5.xiaoeknow.com/_alive/get_discuss_number', {
    method: 'post',
    headers: {
      Cookie: `ko_token=${koToken}`,
    },
    data: `bizData[room_id]=${roomId}`
  }).then(res => {
    return res.data.data
  })
}

function getComments(aliveId, roomId) {
  const getCommentDto = {
    'bizData[loadOrder]': 1, // 0是反向查找, 1是正向查找, 使用id时用0, 第一次获取(没有id)用1
    'bizData[infoType]': 2,
    'bizData[comment_id]': '',// 这个字段用于分页, 获取这个评论时间往后的评论
    'bizData[loadHistory]': 0,
    'bizData[size]': 20, // 最多只能一次拿30个数据
    'bizData[alive_id]': aliveId,
    'bizData[room_id]': roomId
  }
  let strGetCommentDto = ''
  for(let [k, v] of Object.entries(getCommentDto)) {
    strGetCommentDto += `${k}=${v}&`
  }
  return axios.request('https://appb0chwvkb4794.h5.xiaoeknow.com/_alive/get_more_msg', {
    method: 'post',
    headers: {
      Cookie: `ko_token=${koToken}`,
    },
    data: strGetCommentDto,
  }).then(res => {
    return res.data.data.msgs
  })
}

async function main() {
  // const aliveId = 'l_5ffc2974e4b0ab9a2544de2c'
  const aliveId = 'l_5e70ac862985e_JGObQcVW'
  const roomId = await getRoomId(aliveId)
  const discussNumber = await getDiscussNumber(roomId)
  const comments = await getComments(aliveId, roomId)
  console.log(comments)
}

main()