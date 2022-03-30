const puppeteer = require('puppeteer')

async function scrapeProduct(links) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    for(let i = 0; i < links.length; i++) {
        await page.goto(links[i])

        const hrefs = await page.$$eval('a', as => as.map(a => a.href))
        getInfo(hrefs)
    }
    
    browser.close()
    console.log({switches})
    console.log({cases})
}

async function getInfo(hrefs) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div/h1'

    for (let i = 0; i < hrefs.length; i++) {
        const cur = hrefs[i]

        if(!cur.includes('/product')) continue 

        await page.goto(cur, {timeout: 0, waitUntil: 'networkidle0'})
        
        console.log({cur})
        await page.waitForXPath(xp);
        const [e] = await page.$x(xp)
        if (!e) continue

        const e_parse = await e.getProperty('textContent')
        const productName = await e_parse.jsonValue()
        console.log({productName})
        if(cur.includes('/switches') && (productName.includes('Switch') && !productName.includes('Film'))){ 
            switches.push(productName)
        }
        else if(cur.includes('/keyboard')) {
            cases.push(productName)
        }
    }

    browser.close()
}


const urls = ['https://novelkeys.com/collections/switches', 'https://novelkeys.com/collections/keyboards', 'https://cannonkeys.com/collections/switches/', 'https://cannonkeys.com/collections/keyboard-kits']
const switches = []
const cases = []

scrapeProduct(urls)
