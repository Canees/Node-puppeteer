const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
try {
  (async () => {
    //打开浏览器
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null, //默认大小
      args: [
        '--start-maximized',
        '--no-sandbox',
        // '--disable-infobars',
        // '--no-zygote',
        // '--no-first-run',
        // '--disable-setuid-sandbox',
        // '--disable-dev-shm-usage',
        // '--disable-gpu=True',
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      devtools: false,
    })
    //新建标签
    const page = await browser.newPage()
    //跳转指定页面
    await page.goto(`https://dmsmanager.soilmec.com/Thingworx/FormLogin/Everyone`)
    // 登录
    await page.type('.login-form>form input:nth-child(1)','GaoYang', {delay: 500})
    await page.type('.login-form>form input:nth-child(2)','GaoYangdms01', {delay: 500})
    await page.click('.login-form>form input:nth-child(3)')
    // 等待
    page.on('response',async (response)=>{
      if (response.url().includes('https://dmsmanager.soilmec.com/Thingworx/Things/Info_Messages/Services/Tooltip_Text?Accept=application%2Fjson-compressed&_twsr=1&Content-Type=application%2Fjson')) {
        let db = await response.text()
        let data = JSON.parse(db)
        console.log(888, data)
      }
    })
  })()
} catch (error) {
  console.log(99, error)
}