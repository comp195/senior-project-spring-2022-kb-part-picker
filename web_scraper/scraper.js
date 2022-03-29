const puppeteer = require('puppeteer')

async function scrapeProduct(links) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    for(let i = 0; i < links.length; i++) {
        await page.goto(links[i])

        const hrefs = await page.$$eval('a', as => as.map(a => a.href))
        getSwitchInfo(hrefs)
    }
    
    browser.close()
}

async function getSwitchInfo(hrefs) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const productNames = []
    for (let i = 0; i < hrefs.length; i++) {
        if(hrefs[i].includes('/products/')){ 
            const xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div/h1'
            const cur = hrefs[i]
            console.log({cur})  
            await page.goto(cur, {timeout: 0, waitUntil: 'networkidle0'})
            await page.waitForXPath(xp);
            const [e] = await page.$x(xp)
            if (e) {
                const e_parse = await e.getProperty('textContent')
                const productName = await e_parse.jsonValue()
                console.log({productName})
                if (productName.includes('Switch') && !productName.includes('Film')) {
                    productNames.push(productName)
                }
            }
        }
    }
    console.log({productNames})
    browser.close()
}

const urls = ['https://novelkeys.com/collections/switches', 'https://cannonkeys.com/collections/switches/']
scrapeProduct(urls)