const path = require('path')
const fontSpider = require('font-spider')

/**
 * 提供字体, 压缩文字文件, 在vuecli项目build以后执行
 * @param {Object[]} rawWebFonts
 * @param {string} rawWebFonts[].path 指向dist中的字体文件的相对路径
 * @param {string} rawWebFonts[].format 根据字体文件的类型决定, 如ttf文件为truetype
 * @param {string[]} rawWebFonts[].charsArray 需要用到的文字
 * @returns {Promise}
 */
function compressFont(rawWebFonts) {
  const webFonts = rawWebFonts.map(item => {
    return {
      files: [{
        url: path.join(__dirname, item.path),
        format: item.format
      }],
      chars: item.charsArray.reduce((a, b) => a + b)
    }
  })
  return fontSpider.compressor(webFonts, {backup: false})
}

module.exports = compressFont

