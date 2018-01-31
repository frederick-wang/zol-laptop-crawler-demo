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
}

module.exports = Tool
