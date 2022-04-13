import {fire, db} from './firebase.mjs'
import {set, ref} from 'firebase/database'
import {uid} from "uid"
import puppeteer from 'puppeteer'
import response from 'express'

const WebScraper = () => {
    const urls = ['https://novelkeys.com/collections/switches', 'https://novelkeys.com/collections/keyboards', 'https://cannonkeys.com/collections/switches/', 'https://cannonkeys.com/collections/keyboard-kits']
    
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
        const p_img_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[1]/div[1]/div/a/img'
        const p_img_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[1]/div[1]/div/button/img'
        const size_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[2]/div[2]/ul[1]/li[1]'
        const size_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div/div[8]/div/ul/li[1]/text()'
        const mat_ck_xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div[2]/div[1]/table/tbody/tr[2]/td[2]/text()'
        const mat_nk_xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div/div[7]/div/ul/li[1]/text()'
                
        var p_img_xp = ''
        var mat_xp = ''
        var size_xp = ''

        for (let i = 0; i < hrefs.length; i++) {
            const link = hrefs[i]

            if(!link.includes('/product')) continue 

            // set proper xpaths per site
            if (link.includes('cannonkeys')) {
                p_img_xp = p_img_ck_xp
                mat_xp = mat_ck_xp
                size_xp = size_ck_xp
            }
            else if (link.includes('novelkeys')) {
                p_img_xp = p_img_nk_xp
                mat_xp = mat_nk_xp
                size_xp = size_nk_xp
            }
            else {
                continue
            }

            await page.goto(link, {timeout: 3000000, waitUntil: 'networkidle2'})
            
            console.log({cur: link})

            // get product name
            const product_name = await parseJSONFromXP(page, p_name_xp, 'textContent')
            console.log({productName: product_name})
            
            if (product_name.includes('Unknown')) continue
            
            // get product image
            var img_url = await parseJSONFromXP(page, p_img_xp, 'src')
            
            // save product to db, only if switch, keycap, or housing
            if(link.includes('/switches') && (product_name.includes('Switch') && !product_name.includes('Film'))){ 
                set (ref(db, `Switches/${product_name}`), {
                    product_name,
                    img_url,
                    link
                })
            }
            else if(link.includes('/keyboard')) {
                var size = 'Unknown'

                // check product name first before running another xpath check
                const sizes = ['60', '65', '75', '87', 'TKL']
                var size_check = sizes.find(sc => product_name.includes(sc))
                if (size_check) {
                    size = size_check
                }
                else {
                    var possible_size = await parseJSONFromXP(page, size_xp, 'textContent')
                    size_check = sizes.find(sc => possible_size.includes(sc))
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
                var material = await parseJSONFromXP(page, mat_xp, 'textContent')

                if (material.toLowerCase.includes('abs')) {
                    material = 'ABS'
                }
                else if (material.toLowerCase.includes('pbt')) {
                    material = 'PBT'
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

    async function parseJSONFromXP (page, xpath, property) {
        try {
            await page.waitForXPath(xpath);
            const [e] = await page.$x(xpath)
            if (!e) return null
    
            const e_parse = await e.getProperty(property)
            const product_name = await e_parse.jsonValue()
            return product_name
        }
        catch (e) {
            console.log({e})
            return 'Unknown'
        }
    }

    return(
        scrapeProduct(urls)
    )
}

WebScraper()
