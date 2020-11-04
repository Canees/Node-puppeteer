const puppeteer = require('puppeteer')
const fs = require('fs')
let a = 0 //计数
// 删除文件夹下面所有文件
function delDir(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath) //递归删除文件夹
      } else {
        fs.unlinkSync(curPath) //删除文件
      }
    })
    fs.rmdirSync(path)
  }
}
try {
  ;(async () => {
    //打开浏览器
    const browser = await puppeteer.launch({
      headless: true, //是否展示界面
      defaultViewport: null, //默认大小
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-infobars',
        '--no-zygote',
        '--no-first-run',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu=True',
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      devtools: false,
    })
    //新建标签
    const page = await browser.newPage()
    // 监听socket
    const client = await page.target().createCDPSession()
    await client.send('Network.enable')
    client.on('Network.webSocketCreated', (params) => {
      console.log(`创建 WebSocket 连接：${params.url}`)
    })
    client.on('Network.webSocketClosed', (params) => {
      console.log(`WebSocket 连接关闭`)
    })
    client.on('Network.webSocketFrameSent', (params) => {
      console.log(`发送 WebSocket 消息：${params.response.payloadData}`)
    })
    client.on('Network.webSocketFrameReceived', (params) => {
      console.log(`收到 WebSocket 消息：${params.response.payloadData}`)
    })
    client.on('Network.webSocketWillSendHandshakeRequest', (params) => {
      console.log(`准备发送 WebSocket 握手消息`)
    })
    client.on('Network.webSocketHandshakeResponseReceived', (params) => {
      console.log(`接收到 WebSocket 握手消息`)
    })
    //跳转指定页面（url）
    await page.goto(`https://www.dadungou.com:9043/`)
    // 登录=>自行操作
    // await page.type('.login-form>form input:nth-child(1)','GaoYang', {delay: 500})
    // await page.type('.login-form>form input:nth-child(2)','GaoYangdms01', {delay: 500})
    // await page.click('.login-form>form input:nth-child(3)')

    // 截图=》定时器=>文件保存路径自行修改
    const times = setInterval(async () => {
      a++
      await page.screenshot({
        path: `C:/Users/Caner/Desktop/puppeteer/saveimg/baidu${a}.png`,
      })
      console.log('已保存' + a)
      //关闭浏览器
      if (a >= 15) {
        console.log('清除')
        clearInterval(times)
        a = 0
        await browser.close()
      }
    }, 1000)

    // 监听所有HTTP数据返回
    // page.on('response',async (response)=>{
    //   if (response.url().includes('https://dmsmanager.soilmec.com/Thingworx/Things/Info_Messages/Services/Tooltip_Text?Accept=application%2Fjson-compressed&_twsr=1&Content-Type=application%2Fjson')) {
    //     let db = await response.text()
    //     let data = JSON.parse(db)
    //     console.log(888, data)
    //   }
    // })
  })()
} catch (error) {
  console.log(99, error)
}
