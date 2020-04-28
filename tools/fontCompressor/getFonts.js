const fs = require('fs')

// 数组文字去重
function getUniqueStr(arr) {
    //将数组进行排序
    arr.sort();
    //定义结果数组
    let result = [arr[0]];
    for (let i = 1; i < arr.length; i++) {    //从数组第二项开始循环遍历数组
        //判断相邻两个元素是否相等，如果相等说明数据重复，否则将元素写入结果数组
        if (arr[i] !== result[result.length - 1]) {
            result.push(arr[i]);
        }
    }
    return result;
}

// 筛选汉字(大概)的正则表达式
const reg = /[\u4e00-\u9fa5]/g

module.exports = function (filePath) {
    // 获取文件中所有的文字
    let strOrigin = fs.readFileSync(filePath, 'utf8')
    // 筛选汉字
    let strArray = strOrigin.match(reg)
    // 去重
    let str = getUniqueStr(strArray).join('')
    return str
}
