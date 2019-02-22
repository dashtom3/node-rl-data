'use strict';
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
(async () => {
    // 启动Chromium
    // const browser = await puppeteer.launch({ignoreHTTPSErrors: true, headless:false, args: ['--no-sandbox']});
    const browser = await puppeteer.launch()
    // 打开新页面
    const page = await browser.newPage();
    // 设置页面分辨率
    await page.setViewport({width: 1940, height: 1080});
    // await page.emulate(devices['iPhone 6']);
    let request_url = 'http://localhost:8080/#/cameraPage?id=1&from_time=2019-01-26%2010%3A00&to_time=2019-01-28%2023%3A59';
    // 访问
    await page.goto(request_url, {waitUntil: 'domcontentloaded'}).catch(err => console.log(err));
    await page.waitFor(15000);
    let title = await page.title();
    console.log(title);

    // 网页加载最大高度
    const max_height_px = 30000;
    // 滚动高度
    let scrollStep = 600;
    let height_limit = false;
    let mValues = {'scrollEnable': true, 'height_limit': height_limit};

    while (mValues.scrollEnable) {
        mValues = await page.evaluate((scrollStep, max_height_px, height_limit) => {
            // 防止网页没有body时，滚动报错
            if (document.scrollingElement) {
                let scrollTop = document.scrollingElement.scrollTop;
                document.scrollingElement.scrollTop = scrollTop + scrollStep;

                if (null != document.body && document.body.clientHeight > max_height_px) {
                    height_limit = true;
                } else if (document.scrollingElement.scrollTop + scrollStep > max_height_px) {
                    height_limit = true;
                }

                let scrollEnableFlag = false;
                if (null != document.body) {
                    scrollEnableFlag = document.body.clientHeight > scrollTop + 1081 && !height_limit;
                } else {
                    scrollEnableFlag = document.scrollingElement.scrollTop + scrollStep > scrollTop + 1081 && !height_limit;
                }

                return {
                    'scrollEnable': scrollEnableFlag,
                    'height_limit': height_limit,
                    'document_scrolling_Element_scrollTop': document.scrollingElement.scrollTop
                };
            }

        }, scrollStep, max_height_px, height_limit);

        await sleep(9000);
    }

    try {
        // await page.screenshot({path: "客流分析.jpg", fullPage:true}).catch(err => {
        //     console.log('截图失败');
        //     console.log(err);
        // });
        await page.emulateMedia('screen')
        await page.pdf({printBackground:true,width:1940,height:15600,margin:{left:0,right:0},path:'public/'+ title+'2-134.pdf'}).catch(err =>{
            console.log('导出失败')
        });
        await page.waitFor(5000);
        } 
    catch (e) {
            console.log('执行异常');
            } finally {
            await browser.close();
            console.log('导出完成')
    }
})();

//延时函数
function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay)
    })
}
