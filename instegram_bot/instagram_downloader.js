const puppeteer = require("puppeteer");
const BASE_URL = "https://www.instagram.com/";
const data = require("./info.json");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--start-maximized"]
      });
      // creating a new browser and a new page with the BASE_URL //////////////////////////////////////////////////////////////////
     const instagramPage = await browser.newPage();
     await instagramPage.setViewport({ width: 1920, height: 1080 });
     await instagramPage.goto(BASE_URL, { waitUntil: "networkidle2" });

     await instagramPage.waitFor(1000);

      // clicking on the login text ////////////////////////////////////////////////////////////////////////////////////////////////
     let loginButton = await instagramPage.$x('//a[contains(text(), "Log in")]');
     await loginButton[0].click();

     await instagramPage.waitForNavigation({ waitUntil: "networkidle2" });
     await instagramPage.waitFor(3000);


     // writing username and password to the site////////////////////////////////////////////////////////////////////////////////
     await instagramPage.type('input[name="username"]', data.username, {
        delay: 55
      });
      console.info("i entered the username");
      await instagramPage.type('input[name="password"]', data.password, {
        delay: 55
      });
      console.info("i entered the password");

     // clcking on the login Button//////////////////////////////////////////////////////////////////////////////////////////////
      loginButton = await instagramPage.$x('//div[contains(text(), "Log In")]');
      await loginButton[0].click();
  
      await instagramPage.waitForNavigation({ waitUntil: "networkidle2" });
      await instagramPage.waitFor('a > svg[aria-label="Profile"]');
      console.info("Logged in !");
  
      await instagramPage.waitFor(1000);

      await instagramPage.goto(data.downloadLink, { waitUntil: "networkidle2" });
      await instagramPage.waitFor(3000);
 
      await instagramPage.screenshot({path: 'post.png',  clip: {x: 485, y: 218, width: 600, height: 600}}).then(console.log("took a pic")); 

        await browser.close();
  })();