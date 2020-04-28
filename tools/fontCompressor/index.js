const path = require('path')
const fs = require('fs')
const getFonts = require('./getFonts')
const outputPath = path.join(__dirname, './compress.html') // 用于压缩字体的html入口文件
const fontSpider = require('font-spider')

// dist所在目录
let filePath = path.resolve(path.join(__dirname, '../dist'))
// 每个html中用到的文字的数组
let words = []

// 递归遍历dist目录, filePath可以取到当前目录(绝对路径)
function fileDisplay(filePath) {
    // 获取到包含文件的数组, 没有后缀名的为目录
    let files = fs.readdirSync(filePath)
    // 除了默认字体还用了其他字体的页面
    let wordObj = {
        default: 'pingfang', // 默认字体
        word: '',
        special: [] // 默认字体以外的特殊字体, 名称对应compress.html中的类名
    }

    // 示例: curriculum路由中使用到了YOUYUAN字体
    if(/dist\\curriculum$/.test(filePath)) {
        wordObj.special.push('youyuan')
    }
    // 示例: about 路由中使用到了Trends字体
    else if(/dist\\about$/.test(filePath)) {
        wordObj.special.push('trends')
    }

    files.forEach(filename => {
        // 判断是否html文件
        let isHtml = /index\.html/.test(filename)
        if (isHtml) {
            let fileDir = path.join(filePath, filename)
            // 在指定html文件中查找汉字
            let chineseStr = getFonts(fileDir)
            wordObj.word = chineseStr
            words.push(wordObj)
        }

        let fileDir = path.join(filePath, filename)
        let stats = fs.statSync(fileDir)
        let isDir = stats.isDirectory()
        if (isDir) {
            fileDisplay(fileDir)
        }
    })
}

// 在compress.html中插入p标签, 提供给spider进行压缩
function insert() {
    let data = fs.readFileSync(outputPath, 'utf8').split('\n')
    // 去除既往的p标签
    data = data.filter(row => !/^<p/.test(row))

    // 遍历words, 插入新的p标签
    for (let item of words) {
        // 新增默认字体样式的p标签, 从倒数第三行开始插入
        data.splice(data.length - 2, 0, `<p class="${item.default}">${item.word}</p>`)
        if(item.special) {
            for(let sp of item.special)
            data.splice(data.length - 2, 0, `<p class="${sp}">${item.word}</p>`)
        }
    }
    fs.writeFileSync(outputPath, data.join('\n'), 'utf8')
}

// 使用font-spider进行字体压缩, 不备份
function compress(htmlFilePath) {
    fontSpider.spider([htmlFilePath],)
        .then(webFonts => {
            return fontSpider.compressor(webFonts, {backup: false})
        })
        .catch(err => {
            console.log(err)
        })
}

// 获取words, 中文数组
fileDisplay(filePath)
// 插入html中
insert()
// 压缩文字
compress(outputPath)

console.log('字体打包成功')
