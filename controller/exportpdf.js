'use strict';
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors'); 
const baseUrl = 'http://116.62.228.3:8089/'
class PDF {
    constructor(){

    }
    async exportPDF(req,res,next){
        const {id,from_time,to_time} = req.query
            console.log(id,from_time,to_time,new Date())
                // 启动Chromium
    try {
    // const browser = await puppeteer.launch({ignoreHTTPSErrors: true, headless:false, args: ['--no-sandbox']});
    const browser = await puppeteer.launch({headless:true,args: ['--no-sandbox', '--disable-setuid-sandbox']})
    // 打开新页面
    const page = await browser.newPage();
    // 设置页面分辨率
    await page.setViewport({width: 1940, height: 1080});
    // await page.emulate(devices['iPhone 6']);
    let request_url = baseUrl + '#/cameraPage?id='+id+'&from_time='+from_time+'&to_time='+to_time;
    console.log(request_url)
    // 访问
    await page.goto(request_url, {waitUntil: 'domcontentloaded'}).catch(err => console.log(err));
    await page.waitFor(20000);
    let title = await page.title();

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

        // await this.sleep(5000);
        await page.waitFor(3000);
            }
        await page.emulateMedia('screen')
        await page.pdf({printBackground:true,width:1940,height:15600,margin:{left:0,right:0},path:'public/'+'数据报告.pdf'}).catch(err =>{
            console.log('导出失败')
        });
        await page.waitFor(1000);
        await browser.close();
        console.log('导出完成')
        res.send({
            status:1,
            data:1,
        })
        }catch (e) {
            console.log(e);
            res.send({
                status:0,
                data:0,
            })
            }
    }
    async download(req,res,next){
        try{
            res.download('public/数据报告.pdf')
        }catch(e){
            res.send({
                status:0,
                data:0
            })
        }
    }
    //延时函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}
export default new PDF()