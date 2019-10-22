const puppeteer = require("puppeteer");
const replaceString = require('replace-string');
const BASE_URL = "https://ascii.co.uk/";
const data = require("./info.json")
const URL = `https://ascii.co.uk/art/${data.LookFor}`;

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--start-maximized"]
      });

     const asciipage = await browser.newPage();
     await asciipage.setViewport({ width: 1920, height: 1080 });
     await asciipage.goto(BASE_URL, { waitUntil: "networkidle2" });

     await asciipage.waitFor(500);

     await asciipage.goto(URL, { waitUntil: "networkidle2" });
     console.log(`i jumped to ${asciipage.url()}`);
     await asciipage.waitFor(500);

     var text = await asciipage.$('font[color="#00ff00"] > pre');
     const x = await asciipage.evaluate(text => text.innerText, text);

     console.log(x);

     await browser.close();
    })();