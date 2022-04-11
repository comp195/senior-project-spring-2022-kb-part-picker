import {fire, db} from './firebase.mjs'
import {set, ref} from 'firebase/database'
import {uid} from "uid"
import puppeteer from 'puppeteer'

const WebScraper = () => {
    const urls = ['https://novelkeys.com/collections/switches', 'https://novelkeys.com/collections/keyboards', 'https://cannonkeys.com/collections/switches/', 'https://cannonkeys.com/collections/keyboard-kits']
    
    const keycaps_ref = fire.database().ref("/Keycaps")
    const switches_ref = fire.database().ref("/Switches")
    const housing_ref = fire.database().ref("/Housing")
    
    const keycaps = []
    const switches = []
    const cases = []

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
        const p_name_xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div/h1'
        
        // TODO: possible refactor, search for a unifying xpath
        const p_img_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[1]/div[1]/div/button/img'
        const p_img_ck_xp = '/html/body/div[4]/main/div/div[1]/div/div[1]/div[1]/div/a/img'
        const p_img_xp = ''

        for (let i = 0; i < hrefs.length; i++) {
            const link = hrefs[i]

            if(!link.includes('/product')) continue 

            await page.goto(link, {timeout: 3000000, waitUntil: 'networkidle2'})
            
            console.log({cur: link})

            // get product name
            // TODO: transfer code to a function getXPAndParseJSON(xpath, property)
            await page.waitForXPath(p_name_xp);
            const [e] = await page.$x(p_name_xp)
            if (!e) continue

            const e_parse = await e.getProperty('textContent')
            const product_name = await e_parse.jsonValue()
            console.log({productName: product_name})
            
            // get product image
            if (link.includes('cannonkeys')) {
                p_img_xp = p_img_ck_xp
            }
            else if (link.includes('novelkeys')) {
                p_img_xp = p_img_nk_xp
            }
            
            await page.waitForXPath(p_img_xp);
            const img_url = 'Unknown'
            if (e) {
                const [img] = await page.$x(p_img_xp)
                const img_parse = await img.getProperty('src')
                img_url = await img_parse.jsonValue()
            }
            
            // save product to db, only if switch, keycap, or housing
            if(link.includes('/switches') && (product_name.includes('Switch') && !product_name.includes('Film'))){ 
                set (ref(db, `Switches/${product_name}`), {
                    product_name,
                    img_url,
                    link
                })
            }
            else if(link.includes('/keyboard')) {
                const size = 'Unknown'

                // check product name first before running another xpath check
                const sizes = ['60', '65', '75', 'TKL']
                const size_check = sizes.find(sc => (product_name === sc))
                if (size_check) {
                    size = size_check
                }
                else {
                    // TODO: other possible xpath refactor
                    const size_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[2]/div[2]/ul[1]/li[1]'
                    const size_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div/div[8]/div/ul/li[1]/text()'
                    const size_xp = ''
                
                    if (link.includes('cannonkeys')) {
                        size_xp = size_ck_xp
                    }
                    else if (link.includes('novelkeys')) {
                        size_xp = size_nk_xp
                    }

                    await page.waitForXPath(size_xp)
                    const [s] = await page.$x(size_xp)
                    const possible_size = ''
                    if (s) {
                        const size_parse = await s.getProperty('textContent')
                        possible_size = await size_parse.jsonValue()
                    }
                    size_check = sizes.find(sc => (product_name === sc))
                    if (size_check) {
                        size = size_check
                    }
                }
                
                
                set (ref(db, `Housing/${product_name}`), {
                    product_name,
                    img_url,
                    size,
                    link
                })
            }
            else if(link.includes('keycaps/')) {
                // get keycap material (abs, pbt)
                const mat_ck_xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div[2]/div[1]/table/tbody/tr[2]/td[2]/text()'
                const mat_nk_xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div/div[7]/div/ul/li[1]/text()'
                const mat_xp = ''
                const material = ''
                if (link.includes('cannonkeys')) {
                    mat_xp = mat_ck_xp
                }
                else if (link.includes('novelkeys')) {
                    mat_xp = mat_nk_xp
                }

                await page.waitForXPath(mat_xp)
                const [mat] = await page.$x(mat_xp)
                if (mat) {
                    const mat_parse = await mat.getProperty('textContent')
                    material = await mat_parse.jsonValue()
                }

                if (material.toLowerCase.includes('abs')) {
                    material = 'ABS'
                }
                else if (material.toLowerCase.includes('pbt')) {
                    material = 'PBT'
                }
                else {
                    material = 'Unknown'
                }

                set (ref(db, `Keycaps/${product_name}`), {
                    product_name,
                    img_url,
                    material,
                    link
                })
            }
        }

        browser.close()
    }

    return(
        scrapeProduct(urls)
    )
}

WebScraper()
