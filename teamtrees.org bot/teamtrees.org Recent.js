const puppeteer = require("puppeteer");
const BASE_URL = "https://teamtrees.org/";

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--start-maximized"]
      });
      // creating a new browser and a new page with the BASE_URL //////////////////////////////////////////////////////////////////
     const teamtreespage = await browser.newPage();
     await teamtreespage.setViewport({ width: 1920, height: 1080 });
     await teamtreespage.goto(BASE_URL, { waitUntil: "networkidle2" });

     //await teamtreespage.waitFor(2000);

     await teamtreespage.screenshot({path: 'best.png'}); //,  clip: {x: 693, y: 6, width: 533, height: 394}}).then(console.log("took a pic")

     await browser.close();
  })();