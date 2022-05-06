import {fire, db} from './firebase.mjs'
import {set, ref} from 'firebase/database'
import {uid} from "uid"
import puppeteer from 'puppeteer'
import response from 'express'

const WebScraper = () => {
    //const urls = ['https://cannonkeys.com/collections/cannonkeys-keycaps', 'https://novelkeys.com/collections/keycaps', 'https://novelkeys.com/collections/switches', 'https://novelkeys.com/collections/keyboards', 'https://cannonkeys.com/collections/switches/', 'https://cannonkeys.com/collections/keyboard-kits']
    const urls = ['https://cannonkeys.com/collections/accessories?page=1', 'https://cannonkeys.com/collections/accessories?page=2', 'https://cannonkeys.com/collections/accessories?page=3', 'https://novelkeys.com/collections/supplies']

    async function scrapeProduct(links) {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        for(let i = 0; i < links.length; i++) {
            await page.goto(links[i])
            console.log(i)
            const hrefs = await page.$$eval('a', as => as.map(a => a.href))
            getInfo(hrefs)
        }
        
        browser.close()
    }

    async function getInfo(hrefs) {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const p_name_xp = '//*[@id="ProductSection-product-template"]/div/div[2]/div/h1'
        
        // TODO: possible refactor, search for a unifying xpath
        const price_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[2]/div[1]/div/dl/div[1]/dd/span'
        const price_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div/div[3]/dl/div[1]/dd/span'
        const p_img_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[1]/div[1]/div/a/img'
        const p_img_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[1]/div[1]/div/button/img'
        const size_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[2]/div[2]/ul[1]/li[1]'
        const size_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div/div[8]/div/ul/li[1]/text()'
        const mat_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[2]/div[2]/p[2]/strong[2]'
        const mat_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div/h2'
        const type_ck_xp = '/html/body/div[3]/main/div/div[1]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[2]'
        const type_nk_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div/div[7]/div/table/tbody/tr[1]/td[2]'
        
        var p_img_xp = ''
        var price_xp = ''
        var mat_xp = ''
        var size_xp = ''
        var pcb_xp = ''
        var type_xp = ''

        const sizes = ['60', '65', '75', '87', 'TKL']

        for (let i = 0; i < hrefs.length; i++) {
            const link = hrefs[i]
            
            if(!link.includes('/products/') && !link.includes('/supplies/') && !link.includes('/accessories/')) continue 
            
            // set proper xpaths per site
            if (link.includes('cannonkeys')) {
                p_img_xp = p_img_ck_xp
                price_xp = price_ck_xp
                mat_xp = mat_ck_xp
                size_xp = size_ck_xp
                pcb_xp = '/html/body/div[4]/main/div/div[1]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[2]'
                type_xp = type_ck_xp
            }
            else if (link.includes('novelkeys')) {
                p_img_xp = p_img_nk_xp
                price_xp = price_nk_xp
                mat_xp = mat_nk_xp
                size_xp = size_nk_xp
                type_xp = type_nk_xp
            }
            else {
                continue
            }
            console.log({cur: link})
            await page.goto(link, {timeout: 300000, waitUntil: 'networkidle2'})
            
            // get product name
            var product_name = await parseJSONFromXP(page, p_name_xp, 'textContent')
            console.log({productName: product_name})
            
            if (product_name.includes('Unknown')) continue
            
            var temp = product_name.replace(/[|&;$%@"<>()+,\[\]]/g, "")
            
            product_name = temp
            // get product image
            var img_url = await parseJSONFromXP(page, p_img_xp, 'src')

            // get product price
            var product_price = ""
            var possible_price = await parseJSONFromXP(page, price_xp, 'textContent')
            if (!possible_price.includes('Unknown')) {
                product_price = parseFloat(possible_price.match(/[\d\.\d]+/i))
                if (!product_price) {
                    product_price = 'N/A'
                }
            }
            else {
                product_price = 'Unknown'
            }
            
            //save product to db, only if switch, keycap, or housing
            if(link.includes('/switches') && (product_name.includes('Switch') && !product_name.includes('Film'))){ 
                var type = await parseJSONFromXP(page, type_xp, 'textContent')
                set (ref(db, `Switches/${product_name}`), {
                    product_name,
                    product_price,
                    img_url,
                    type,
                    link
                })
            }
            else if(link.includes('/keyboard')) {
                var size = 'Unknown'

                // check product name first before running another xpath check
                
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
                    product_price,
                    img_url,
                    size,
                    link
                })
            }
            else if(link.includes('keycaps/')) {
                // get keycap material (abs, pbt)
                var material = await parseJSONFromXP(page, mat_xp, 'textContent')

                if (material.toLowerCase().includes('abs')) {
                    material = 'ABS'
                }
                else if (material.toLowerCase().includes('pbt')) {
                    material = 'PBT'
                }
                else {
                    material = 'Unknown'
                }


                set (ref(db, `Keycaps/${product_name}`), {
                    product_name,
                    product_price,
                    img_url,
                    material,
                    link
                })
            }
            else if(link.includes('pcb')) {
                var size = 'Unknown'
                if (link.includes('cannonkeys')) size = await parseJSONFromXP(page, pcb_xp, 'textContent')
                else if (link.includes('novelkeys')) {
                    if (product_name.includes('87')) size = 'TKL'
                    else if (product_name.includes('65')) size = '65'
                }

                set (ref(db, `PCB/${product_name}`), {
                    product_name,
                    product_price,
                    img_url,
                    size,
                    link
                })
            }
            else if(link.includes('stabilizer')) {
                set (ref(db, `Stabilizers/${product_name}`), {
                    product_name,
                    product_price,
                    img_url,
                    link
                })
            }
            else if(link.includes('plate')) {
                // get plate material (brass, copper, polycarbonate)
                var material = await parseJSONFromXP(page, mat_xp, 'textContent')
                var size = "Unknown"
                
                var size_check = sizes.find(sc => product_name.includes(sc))
                if (size_check) {
                    size = size_check
                }

                if (material.toLowerCase().includes('abs')) {
                    material = 'ABS'
                }
                else if (material.toLowerCase().includes('pbt')) {
                    material = 'PBT'
                }
                else {
                    material = 'Unknown'
                }

                set (ref(db, `Plate/${product_name}`), {
                    product_name,
                    product_price,
                    img_url,
                    material,
                    size,
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
