const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const cp = require('child_process')

router.post('/deploy', (req, res) => {
  let password = req.body.password
  console.log(password)
  if(password === '123456') {
    // windows下暂时找不到通过绝对路径调用bat脚本的方法, 只能在当前目录下运行服务器
    cp.execFile('deploy.bat', (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
      console.log('部署成功')
    })

    res.status(200).json({
      msg: 'start deploy'
    })
  }
  else {
    res.status(400).json({
      msg: 'reject'
    })
  }

})
const server = express()
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(router)
server.listen(3333, function() {
  console.log('部署服务器开始运行')
})

