const Crawler = require('crawler')
const url = require('url')
// const fs = require('fs')
const Tool = require('./Tool')
const Data = require('./Data')

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

console.log(`开始爬取数据，一共有${Data.BRAND_LINKS.length}个品牌。`)

for (let item of Data.BRAND_LINKS) {
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
    // fs.writeFileSync(`output/${name}.json`, JSON.stringify(data))
    Tool.output(name, data)
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
                              '型号': $td.text().trim() || 'NULL',
                              '网址': url.resolve(res.request.uri.format(), $td.children('a').attr('href')) || 'NULL'
                            }
                          })
                        } else if (index === 1) {
                          $tr.children('td').each(function (index, element) {
                            seriesData[index]['图片'] = $(element).find('img').attr('src').trim() || 'NULL'
                          })
                        } else if (index === 2) {
                          $tr.children('td').each(function (index, element) {
                            seriesData[index]['价格'] = $(element).find('.price').children('b').text().trim() || 'NULL'
                            if ($(element).find('.price-status').length === 0) {
                              seriesData[index]['状态'] = '正常'
                            } else {
                              seriesData[index]['状态'] = $(element).find('.price-status').text().trim() || 'NULL'
                            }
                          })
                        } else {
                          if ($tr.children('td').length > 0) {
                            let param = $tr.children('th').text().trim()
                            $tr.children('td').each(function (index, element) {
                              seriesData[index][param] = $(element).text().trim() || 'NULL'
                            })
                          }
                        }
                      })
                      console.log(`${name}品牌数据爬取完成。`)
                      for (let item of seriesData) {
                        if (!item['CPU型号'] || item['CPU型号'] === 'NULL') {
                          item['CPU跑分'] = 'NULL'
                        } else {
                          let str = item['CPU型号']
                          if (!item['CPU主频'] || item['CPU主频'] !== 'NULL') {
                            str += ` @ ${item['CPU主频']}`
                          }
                          item['CPU跑分'] = Tool.getHighestSimilarityCPU(str)[1]
                        }
                        console.log(`${name}品牌数据CPU跑分处理完成。`)
                        if (!item['显卡类型'] || item['显卡类型'] === 'NULL') {
                          item['显卡跑分'] = 'NULL'
                        } else {
                          if (!item['显卡芯片'] || item['显卡芯片'] === 'NULL') {
                            item['显卡跑分'] = 'NULL'
                          } else {
                            let str
                            if (item['显卡类型'].indexOf('双显卡') !== -1) {
                              str = item['显卡芯片'].replace(/[＋+](.+)$/g, '')
                            } else {
                              str = item['显卡芯片']
                            }
                            item['显卡跑分'] = Tool.getHighestSimilarityGPU(str)[1]
                            // let result = Tool.getHighestSimilarityGPU(str)
                            // fs.appendFileSync('test2.csv', `${item['显卡类型']},${item['显卡芯片']},${result[0]},${result[1]},${result[2]}\r\n`)
                          }
                        }
                        console.log(`${name}品牌数据显卡跑分处理完成。`)
                      }
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
