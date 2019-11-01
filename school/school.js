const puppeteer = require("puppeteer");
const express = require("express");

const port = 3000;
const app = express();

const BASE_URL = "https://docs.google.com/document/d/1YZmws5M-_TLC-0-SsQ8cYaZmZXkWWhs4WO2Ny1I4SmU/edit";
(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--start-maximized"]
      });
      // creating a new browser and a new page with the BASE_URL //////////////////////////////////////////////////////////////////
     const schoolpage = await browser.newPage();
     await schoolpage.setViewport({ width: 1920, height: 1080 });
     await schoolpage.goto(BASE_URL, { waitUntil: "networkidle2" });

     await schoolpage.waitFor(500);

     var text = await schoolpage.$('div[class="kix-page-column"]');
     const x = await schoolpage.evaluate(text => text.innerText, text);

     console.log(x);
     console.log("נוצר על ידי דניאל דימיטרוב");

     await browser.close();

     app.get('/', (req, res) => res.send(x));
     app.listen(port, () => console.log(`Example app listening on port ${port}!`));
      console.log("http://localhost:3000/");
  })();