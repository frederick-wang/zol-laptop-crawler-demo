const Crawler = require('crawler')
const url = require('url')
const fs = require('fs')
const Tool = require('./Tool')

let brandLinks = [
  ['联想', 'http://detail.zol.com.cn/notebook_index/subcate16_160_list_1.html'],
  ['惠普', 'http://detail.zol.com.cn/notebook_index/subcate16_223_list_1.html'],
  ['戴尔', 'http://detail.zol.com.cn/notebook_index/subcate16_21_list_1.html'],
  ['苹果', 'http://detail.zol.com.cn/notebook_index/subcate16_544_list_1.html'],
  ['华硕', 'http://detail.zol.com.cn/notebook_index/subcate16_227_list_1.html'],
  ['神舟', 'http://detail.zol.com.cn/notebook_index/subcate16_1191_list_1.html'],
  ['ThinkPad', 'http://detail.zol.com.cn/notebook_index/subcate16_32108_list_1.html'],
  ['Acer宏碁', 'http://detail.zol.com.cn/notebook_index/subcate16_218_list_1.html'],
  ['机械革命', 'http://detail.zol.com.cn/notebook_index/subcate16_35578_list_1.html'],
  ['三星', 'http://detail.zol.com.cn/notebook_index/subcate16_98_list_1.html'],
  ['雷神', 'http://detail.zol.com.cn/notebook_index/subcate16_35393_list_1.html'],
  ['Alienware', 'http://detail.zol.com.cn/notebook_index/subcate16_33520_list_1.html'],
  ['机械师', 'http://detail.zol.com.cn/notebook_index/subcate16_36359_list_1.html'],
  ['华为', 'http://detail.zol.com.cn/notebook_index/subcate16_613_list_1.html'],
  ['炫龙', 'http://detail.zol.com.cn/notebook_index/subcate16_36391_list_1.html'],
  ['微软', 'http://detail.zol.com.cn/notebook_index/subcate16_364_list_1.html'],
  ['MSI微星', 'http://detail.zol.com.cn/notebook_index/subcate16_133_list_1.html'],
  ['小米', 'http://detail.zol.com.cn/notebook_index/subcate16_34645_list_1.html'],
  ['雷蛇', 'http://detail.zol.com.cn/notebook_index/subcate16_1590_list_1.html'],
  ['Terrans', 'Force', 'http://detail.zol.com.cn/notebook_index/subcate16_34305_list_1.html'],
  ['LG', 'http://detail.zol.com.cn/notebook_index/subcate16_143_list_1.html'],
  ['技嘉', 'http://detail.zol.com.cn/notebook_index/subcate16_234_list_1.html'],
  ['海尔', 'http://detail.zol.com.cn/notebook_index/subcate16_221_list_1.html'],
  ['中柏', 'http://detail.zol.com.cn/notebook_index/subcate16_36793_list_1.html'],
  ['火影', 'http://detail.zol.com.cn/notebook_index/subcate16_36607_list_1.html'],
  ['昂达', 'http://detail.zol.com.cn/notebook_index/subcate16_265_list_1.html'],
  ['清华同方', 'http://detail.zol.com.cn/notebook_index/subcate16_24_list_1.html'],
  ['博本', 'http://detail.zol.com.cn/notebook_index/subcate16_52061_list_1.html'],
  ['酷比魔方', 'http://detail.zol.com.cn/notebook_index/subcate16_2251_list_1.html'],
  ['富士通', 'http://detail.zol.com.cn/notebook_index/subcate16_283_list_1.html'],
  ['松下', 'http://detail.zol.com.cn/notebook_index/subcate16_84_list_1.html'],
  ['东芝', 'http://detail.zol.com.cn/notebook_index/subcate16_209_list_1.html'],
  ['索立信', 'http://detail.zol.com.cn/notebook_index/subcate16_34055_list_1.html'],
  ['谷歌', 'http://detail.zol.com.cn/notebook_index/subcate16_1922_list_1.html'],
  ['刀客', 'http://detail.zol.com.cn/notebook_index/subcate16_47070_list_1.html'],
  ['镭波', 'http://detail.zol.com.cn/notebook_index/subcate16_34130_list_1.html'],
  ['台电', 'http://detail.zol.com.cn/notebook_index/subcate16_970_list_1.html'],
  ['麦本本', 'http://detail.zol.com.cn/notebook_index/subcate16_37353_list_1.html'],
  ['VAIO', 'http://detail.zol.com.cn/notebook_index/subcate16_50829_list_1.html'],
  ['ENZ', 'http://detail.zol.com.cn/notebook_index/subcate16_51642_list_1.html'],
  ['锡恩帝', 'http://detail.zol.com.cn/notebook_index/subcate16_34329_list_1.html'],
  ['宝扬', 'http://detail.zol.com.cn/notebook_index/subcate16_47841_list_1.html'],
  ['海鲅', 'http://detail.zol.com.cn/notebook_index/subcate16_35232_list_1.html'],
  ['爱尔轩', 'http://detail.zol.com.cn/notebook_index/subcate16_50972_list_1.html'],
  ['紫麦', 'http://detail.zol.com.cn/notebook_index/subcate16_49394_list_1.html'],
  ['金属大师', 'http://detail.zol.com.cn/notebook_index/subcate16_51268_list_1.html'],
  ['SOSOON', 'http://detail.zol.com.cn/notebook_index/subcate16_33832_list_1.html'],
  ['联想扬天', 'http://detail.zol.com.cn/notebook_index/subcate16_36595_list_1.html']
]

let c = new Crawler({
  rateLimit: 1000,
  callback: function (error, res, done) {
    if (error) {
      console.error(error)
    } else {
      console.log(`开始爬取${res.options.name}品牌，链接为${res.options.link}`)
      getBrand(res.options.name, res.options.link, done)
    }
  }
})

console.log(`开始爬取数据，一共有${brandLinks.length}个品牌。`)

for (let item of brandLinks) {
  c.queue([{
    html: '<html></html>',
    name: item[0],
    link: item[1]
  }])
}

function getBrand (name, link, done) {
  let c = new Crawler()
  let data = []
  c.on('drain', () => {
    fs.writeFileSync(`output/${name}.json`, JSON.stringify(data))
    console.log(`${name}品牌爬取完成。`)
    done()
  })
  c.queue({
    uri: link,
    callback: function (error, res, done) {
      if (error) {
        console.error(error)
      } else {
        let $ = res.$
        $('.filter-series-list').find('a').not('.null').each((index, element) => {
          let seriesHref = url.resolve(res.request.uri.format(), $(element).attr('href'))
          let seriesName = $(element).text().trim()
          c.queue({
            uri: seriesHref,
            seriesName: seriesName,
            callback: function (error, res, done) {
              if (error) {
                console.error(error)
              } else {
                let $ = res.$
                let itemListHref = url.resolve(res.request.uri.format(), $('.nav__list').children('li').eq(1).children('a').attr('href') || $('.nav').children('li').eq(1).children('a').attr('href'))
                c.queue({
                  uri: itemListHref,
                  seriesName: res.options.seriesName,
                  callback: function (error, res, done) {
                    if (error) {
                      console.error(error)
                    } else {
                      let $ = res.$
                      let $trs = $('#seriesParamTable').find('tr')
                      let seriesData = []
                      $trs.each(function (index, element) {
                        let $tr = $(element)
                        if (index === 0) {
                          $tr.children('td').each(function (index, element) {
                            let $td = $(element)
                            seriesData[index] = {
                              '型号': $td.text().trim(),
                              '网址': url.resolve(res.request.uri.format(), $td.children('a').attr('href'))
                            }
                          })
                        } else if (index === 1) {
                          $tr.children('td').each(function (index, element) {
                            seriesData[index]['图片'] = $(element).find('img').attr('src')
                          })
                        } else if (index === 2) {
                          $tr.children('td').each(function (index, element) {
                            seriesData[index]['价格'] = $(element).find('.price').children('b').text().trim()
                            if ($(element).find('.price-status').length === 0) {
                              seriesData[index]['状态'] = '正常'
                            } else {
                              seriesData[index]['状态'] = $(element).find('.price-status').text()
                            }
                          })
                        } else {
                          if ($tr.children('td').length > 0) {
                            let param = $tr.children('th').text().trim()
                            $tr.children('td').each(function (index, element) {
                              seriesData[index][param] = $(element).text().trim()
                            })
                          }
                        }
                      })
                      data.push({
                        seriesName: res.options.seriesName,
                        seriesData: seriesData
                      })
                    }
                    done()
                  }
                })
              }
              done()
            }
          })
        })
      }
      done()
    }
  })
}
