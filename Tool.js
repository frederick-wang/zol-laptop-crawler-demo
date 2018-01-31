const iconvlite = require('iconv-lite')
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

  static output (name, data) {
    function getParam (item, param) {
      return item[param] ? item[param].toString().replace(/"/g, '""').replace(/,/g, '，').replace(/\r/g, '').replace(/\n/g, '').replace(/\u00A0/g, ' ') : 'NULL'
    }
    console.log(`${name}品牌 开始写入数据：output/${name}.csv`)
    let title = '型号,系列,网址,图片,价格,状态,CPU跑分,CPU型号,CPU系列,CPU主频,最高睿频,核心/线程数,三级缓存,总线规格,核心架构,制程工艺,功耗,内存容量,内存类型,插槽数量,硬盘容量,硬盘描述,显卡跑分,显卡类型,显卡芯片,显存容量,显存类型,显存位宽,外壳材质,可选配件,网络通信,电池类型,基本参数,厚度,屏幕技术,无线网卡,扬声器,屏幕分辨率,上市时间,宽度,工作温度,其它特点,产品类型,数据接口,长度,笔记本重量,安全性能,客服电话,电话备注,人脸识别,电源适配器,质保备注,音频系统,光驱类型,笔记本附件,存储温度,有线网卡,主板芯片组,显卡,产品定位,操作系统,电源描述,质保时间,外壳描述,处理器,输入设备,指取设备,保修政策,包装清单,外观,附带软件,保修信息,读卡器,显示比例,音频接口,工作湿度,蓝牙,指纹识别,环境要求,麦克风,变形方式,其他,扩展插槽,摄像头,存储设备,详细内容,屏幕尺寸,商用技术,最大内存容量,续航时间,视频接口,特色功能,显示屏,多媒体设备,触控屏,I/O接口,键盘描述,其它接口\n'
    fs.writeFileSync(`output/${name}.csv`, iconvlite.encode(title, 'gb2312'))
    for (let series of data) {
      for (let item of series.seriesData) {
        let str = `${getParam(item, '型号')},${getParam(item, '系列')},${getParam(item, '网址')},${getParam(item, '图片')},${getParam(item, '价格')},${getParam(item, '状态')},${getParam(item, 'CPU跑分')},${getParam(item, 'CPU型号')},${getParam(item, 'CPU系列')},${getParam(item, 'CPU主频')},${getParam(item, '最高睿频')},${getParam(item, '核心/线程数')},${getParam(item, '三级缓存')},${getParam(item, '总线规格')},${getParam(item, '核心架构')},${getParam(item, '制程工艺')},${getParam(item, '功耗')},${getParam(item, '内存容量')},${getParam(item, '内存类型')},${getParam(item, '插槽数量')},${getParam(item, '硬盘容量')},${getParam(item, '硬盘描述')},${getParam(item, '显卡跑分')},${getParam(item, '显卡类型')},${getParam(item, '显卡芯片')},${getParam(item, '显存容量')},${getParam(item, '显存类型')},${getParam(item, '显存位宽')},${getParam(item, '外壳材质')},${getParam(item, '可选配件')},${getParam(item, '网络通信')},${getParam(item, '电池类型')},${getParam(item, '基本参数')},${getParam(item, '厚度')},${getParam(item, '屏幕技术')},${getParam(item, '无线网卡')},${getParam(item, '扬声器')},${getParam(item, '屏幕分辨率')},${getParam(item, '上市时间')},${getParam(item, '宽度')},${getParam(item, '工作温度')},${getParam(item, '其它特点')},${getParam(item, '产品类型')},${getParam(item, '数据接口')},${getParam(item, '长度')},${getParam(item, '笔记本重量')},${getParam(item, '安全性能')},${getParam(item, '客服电话')},${getParam(item, '电话备注')},${getParam(item, '人脸识别')},${getParam(item, '电源适配器')},${getParam(item, '质保备注')},${getParam(item, '音频系统')},${getParam(item, '光驱类型')},${getParam(item, '笔记本附件')},${getParam(item, '存储温度')},${getParam(item, '有线网卡')},${getParam(item, '主板芯片组')},${getParam(item, '显卡')},${getParam(item, '产品定位')},${getParam(item, '操作系统')},${getParam(item, '电源描述')},${getParam(item, '质保时间')},${getParam(item, '外壳描述')},${getParam(item, '处理器')},${getParam(item, '输入设备')},${getParam(item, '指取设备')},${getParam(item, '保修政策')},${getParam(item, '包装清单')},${getParam(item, '外观')},${getParam(item, '附带软件')},${getParam(item, '保修信息')},${getParam(item, '读卡器')},${getParam(item, '显示比例')},${getParam(item, '音频接口')},${getParam(item, '工作湿度')},${getParam(item, '蓝牙')},${getParam(item, '指纹识别')},${getParam(item, '环境要求')},${getParam(item, '麦克风')},${getParam(item, '变形方式')},${getParam(item, '其他')},${getParam(item, '扩展插槽')},${getParam(item, '摄像头')},${getParam(item, '存储设备')},${getParam(item, '详细内容')},${getParam(item, '屏幕尺寸')},${getParam(item, '商用技术')},${getParam(item, '最大内存容量')},${getParam(item, '续航时间')},${getParam(item, '视频接口')},${getParam(item, '特色功能')},${getParam(item, '显示屏')},${getParam(item, '多媒体设备')},${getParam(item, '触控屏')},${getParam(item, 'I/O接口')},${getParam(item, '键盘描述')},${getParam(item, '其它接口')}\n`
        fs.appendFileSync(`output/${name}.csv`, iconvlite.encode(str, 'gb2312'))
      }
    }
    console.log(`${name}品牌 写入数据完成。`)
  }
}

module.exports = Tool
