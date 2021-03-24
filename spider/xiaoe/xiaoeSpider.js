'use strict';

const request = require('request-promise');

class Xiaoe {
  constructor(shareUrl, keyword, cookie = 'ko_token=e284de035c7961e21ae19773856edd4e;') {
    this.shareUrl = shareUrl;
    this.keyword = keyword || '';
    this.cookie = cookie;
    this.resourseId = '';
    this.roomId = '';
    this.discussNumber = 0;
    this.comments = [];
  }
  // 获取资源id
  getResourseId() {
    return request({
      // 获取重定向
      url: this.shareUrl,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
        // 需要微信登陆态
        Cookie: this.cookie,
      },
      resolveWithFullResponse: true,
      followRedirect: false,
    }).then(res => {
      console.log(res.data)
    })
      .catch(err => {
        const redirect = err.response.headers.location;
        const resourseId = redirect.match(/\/alive\/(.*)\?type/)[1];
        this.resourseId = resourseId;
        console.log(111)
        console.log(resourseId)
        return resourseId;
      });
  }
  // 获取房间id
  getRoomId() {
    const baseInfoUrl = 'https://appb0chwvkb4794.h5.xiaoeknow.com/_alive/base_info';
    return request({
      url: baseInfoUrl,
      qs: {
        pay_info: `{"type":"2","app_id":"appb0cHwvKB4794","resource_id":"${this.resourseId}","resource_type":4,"payment_type":"","product_id":""}`,
      },
      headers: {
        Cookie: this.cookie,
      },
      resolveWithFullResponse: true,
    }).then(res => {
      console.log(res.body)
      const body = JSON.parse(res.body);
      const roomId = body.data.bizData.data.alive_info.room_id;
      this.roomId = roomId;
      return roomId;
    });
  }
  // 获取有多少个评论
  getDiscussNumber() {
    const url = 'https://appb0chwvkb4794.h5.xiaoeknow.com/_alive/get_discuss_number';
    return request({
      method: 'POST',
      url,
      headers: {
        Cookie: this.cookie,
      },
      form: {
        'bizData[room_id]': this.roomId,
      },
    }).then(res => {
      this.discussNumber = JSON.parse(res).data;
      return this.discussNumber;
    });
  }
  // 读取评论
  getUserComments() {
    const userCommentUrl = 'https://appb0cHwvKB4794.h5.xiaoeknow.com/_alive/get_more_msg';
    return request({
      method: 'POST',
      uri: userCommentUrl,
      form: {
        'bizData[loadOrder]': 1,
        'bizData[infoType]': 2,
        'bizData[comment_id]': '',
        'bizData[loadHistory]': 0,
        // 要先获取总共有多少个评论
        'bizData[size]': this.discussNumber,
        'bizData[alive_id]': this.resourseId,
        'bizData[room_id]': this.roomId,
      },
      headers: {
        Cookie: this.cookie,
      },
    }).then(res => {
      this.comments = JSON.parse(res).data.msgs;
      return this.comments;
    });
  }
  // 用户去重
  removeRepeat() {
    const useridList = [];
    const single = this.comments.filter(item => {
      if (useridList.findIndex((value, index) => {
        return value === item.user_id;
      }) === -1) {
        useridList.push(item.user_id);
        return true;
      }
      return false;
    });
    this.comments = single;
    return this.comments;
  }

  // 过滤关键词
  keywordFilter() {
    const re = new RegExp(this.keyword);
    const withKeyword = this.comments.filter(item => {
      return re.test(item.org_msg_content);
    });
    this.comments = withKeyword;
    return withKeyword;
  }

  // 获取所有评论
  async start() {
    await this.getResourseId();
    await this.getRoomId();
    await this.getDiscussNumber();
    await this.getUserComments();
    return this.comments;
  }

  // 获取无重复的过滤关键词的评论
  async getFinalComments() {
    await this.start();
    if (this.keyword) {
      await this.keywordFilter();
    }
    await this.removeRepeat();
    return this.comments;
  }
}

async function getComments(url, keyword) {
  const xiaoe = new Xiaoe(url, keyword);
  return xiaoe.getFinalComments();
}

const comments = getComments('https://appb0chwvkb4794.h5.xiaoeknow.com/v1/course/alive/l_60192f67e4b029faba155d7e?type=2', '直播间')
console.log(comments)
