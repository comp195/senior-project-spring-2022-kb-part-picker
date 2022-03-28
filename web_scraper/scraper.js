const puppeteer = require('puppeteer')

async function scrapeProduct(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const [el] = await page.$x('//*[@id="ProductCardImage-collection-template-6557105356967"]')
    const src = await el.getProperty('src')
    const srcTxt = src.jsonValue()

    console.log({srcTxt})
    browser.close()
}

scrapeProduct('https://novelkeys.com/collections/keyboards')