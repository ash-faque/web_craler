// file system module for saving the output
const fs = require("fs");

// puppetteer for running a browser
const puppeteer = require('puppeteer');


// starting crawling
(async () => {

    // start a browser
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 200,
    });

    // take a new tab
    const page = await browser.newPage();

    // setting browser view port size
    await page.setViewport({
        width: 1200,
        height: 1200
    });

    // navigate to site
    await page.goto('https://www.freethink.com/articles', {
        waitUntil: 'networkidle0', // cooldown for loading
        timeout: 0 // allow maximum time for the browser
    });

    // evaluate the requered fields in browser
    let output = await page.evaluate(() => {
        let posts = Array.from(document.querySelectorAll(".loop-item")); // get all the posts
        let data = []; // data array
        posts.forEach(post => {
            let thumbnail = post.querySelector(".loop-item__thumbnail"),
                content = post.querySelector(".loop-item__content"),
                img_src = thumbnail.querySelector("a img").getAttribute("src"),
                post_link = content.querySelector("a").href,
                heading = content.querySelector("a").innerText,
                description = content.querySelector("div").innerText; // navigate to requeired datas
            data.push({
                title: heading,
                image_link: img_src,
                news_page_link: post_link,
                description: description
            }); // add datas to the array
        });
        return data;
    });

    fs.writeFileSync("output.json", JSON.stringify(output)); // write json file

    await browser.close(); // close the browser

})();
