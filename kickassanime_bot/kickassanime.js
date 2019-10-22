//document.querySelector('span[class="ax-toggle"]')

const puppeteer = require("puppeteer");
const replaceString = require('replace-string');
const data = require("./info.json");

const BASE_URL = "https://kickassanime.io/";

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--start-maximized"]
      });
      // creating a new browser and a new page with the BASE_URL //////////////////////////////////////////////////////////////////
     const kaapage = await browser.newPage();
     await kaapage.setViewport({ width: 1920, height: 1080 });
     await kaapage.goto(BASE_URL, { waitUntil: "networkidle2" });

     await kaapage.waitFor(500);

     // going to the anime that was selected in the json //////////////////////////////////////////////////////////////////////////
     var url = "https://kickassanime.io/anime/*";
     var name = data.name;

     var name =replaceString(name, " ","-");
     var name =replaceString(name, ".", "");
     var name =replaceString(name, ",", "");
     var name =replaceString(name, ":", "");
     var url  =replaceString(url, "*",name);

     await kaapage.goto(url, { waitUntil: "networkidle2" });
     console.log(`i jumped to ${kaapage.url()}`);
     await kaapage.waitFor(800);

     // click on the last ep for that show /////////////////////////////////////////////////////////////////////////////////////////

     var ep = await kaapage.$('td[aria-colindex="1"]');
     await ep.click();

     await kaapage.waitForNavigation({ waitUntil: "networkidle2" });
     await kaapage.waitFor(300);

     // takes a screenshot of the time //////////////////////////////////////////////////////////////////////////////////////////////

     await kaapage.screenshot({path: 'time.png',  clip: {x: 432, y: 763, width: 1053, height: 362}});

     var animename = await kaapage.$('h1[class="title"]');

     console.log(`The link for ${animename} like is: ${kaapage.url()}`);

     await browser.close();
  })();

  /*
  cridits:
  shaked8813
  the pumpkin god
  */