const puppeteer = require('puppeteer')
try {
  (async (newurl = 'https://v.qq.com/x/cover/mzc00200ytgrst3.html') => {
    //打开浏览器
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null, //默认大小
      args: ['--start-maximized'],
      ignoreDefaultArgs: ['--enable-automation'],
      devtools: false
    });
    //新建标签
    const page = await browser.newPage();
    //跳转指定页面
    await page.goto(`https://www.sp-flv.com/?url=${newurl}`);
    // 监听返回->利用原页面方法解析返回的数据
    page.on('response', async function (response) {
      // 过滤返回接口
      if (response.url().includes('/api.php')) {
        let db = await response.text()
        let data = JSON.parse(db)
        // 利用页面方法解析数据
        if (data.code == 200) {
          let urls = await page.evaluate((data) => {
            let CryptoJS = window.CryptoJS;
            let key = data.key;
            let iv = data.iv;
            let str = data.url;
            let keys = CryptoJS.enc.Utf8.parse(key);// 秘钥
            let ivv = CryptoJS.enc.Utf8.parse(iv);//向量iv
            let decrypted = CryptoJS.AES.decrypt(str, keys, { iv: ivv, padding: CryptoJS.pad.ZeroPadding });//解码
            let rest = decrypted.toString(CryptoJS.enc.Utf8);
            return rest
          }, data)
          // // 关闭标签
          // await page.close()
          // // 跳转到M3U8工具箱自动播放
          // const page2 = await browser.newPage()
          // await page2.goto('http://tool.liumingye.cn/m3u8/')
          // // // 输入地址-》无法打开form表单post
          // await page2.type('.am-form-field', urls, { delay: 100 });
          // // // // 等待2秒
          // await page2.waitFor(1000)
          // // // 播放
          // await page2.click('#str-post button[type="submit"]')
          // // //模拟键盘“回车”键
          // // await page2.keyboard.press('Enter');
          // // 采用video标签操作
          console.log(88, urls)
        } else {
          await browser.close();//关闭浏览器
        }
      } else {
        await browser.close();//关闭浏览器
      }
    })
  })()
} catch (error) {
  console.log(99, error)
}