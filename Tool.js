const fs = require('fs')
const Data = require('./Data')

class Tool {
  static getLevenshteinDistance (str1, str2) {
    let d = []
    let i, j, cost
    let lenStr1 = str1.length
    let lenStr2 = str2.length

    for (i = 0; i <= lenStr1; i++) {
      d[i] = []
      d[i][0] = i
    }
    for (j = 0; j <= lenStr2; j++) {
      d[0][j] = j
    }

    for (i = 1; i <= lenStr1; i++) {
      for (j = 1; j <= lenStr2; j++) {
        if (str1[i] === str2[j]) {
          cost = 0
        } else {
          cost = 1
        }
        d[i][j] = Math.min(
          d[i - 1][j] + 1, // 删除
          d[i][j - 1] + 1, // 插入
          d[i - 1][j - 1] + cost // 替換
        )
      }
    }

    return d[lenStr1][lenStr2]
  }

  static getSimilarity (str1, str2) {
    return 1 - Tool.getLevenshteinDistance(str1, str2) / Math.max(str1.length, str2.length)
  }

  static getHighestSimilarityCPU (str) {
    let type = str.indexOf('Intel') === -1 ? 0 : 1
    str = str.replace('酷睿', 'Core ')
      .replace('奔腾', 'Pentium ')
      .replace('赛扬', 'Celeron ')
      .replace(/.核/g, '')
    let max = 0
    let maxItem = ['NULL', 'NULL']
    for (let item of Data.CPU_MARKS) {
      if ((type && item[0].search(/Intel/i) === -1) || (!type && item[0].search(/Intel/i) !== -1)) {
        continue
      }
      if (Tool.getSimilarity(str, item[0]) > max) {
        max = Tool.getSimilarity(str, item[0])
        maxItem = item
      }
    }
    return maxItem
  }

  static getHighestSimilarityGPU (str) {
    str = str.replace(/AMD /i, '')
      .replace(/[（(](.+)[）)]/g, '')
      .replace(/GMA/i, '')
      .replace(/Max-Q/i, 'with Max-Q Design')
    if (str.search(/NVIDIA TITAN/i) === -1) {
      str = str.replace(/NVIDIA /i, '')
    }
    let max = 0
    let maxItem = ['NULL', 'NULL', 'NULL']
    for (let item of Data.GPU_MARKS) {
      if (Tool.getSimilarity(str, item[0]) > max) {
        max = Tool.getSimilarity(str, item[0])
        maxItem = item
      }
    }
    return maxItem
  }

  output (name, data) {
    fs.writeFileSync(`output/${name}.csv`, '')
  }
}

module.exports = Tool
