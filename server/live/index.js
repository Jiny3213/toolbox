
const NodeMediaServer = require('node-media-server');
 
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};
 
var nms = new NodeMediaServer(config)
nms.run();

// 加入网页服务器
const express = require('express')
const app = express()
const port = 3333
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.listen(port, () => {
  console.log('express start...')
  console.log('express start at http://localhost:3333/')
})