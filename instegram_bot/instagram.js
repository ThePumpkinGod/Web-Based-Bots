const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require("path");

const BASE_URL = "https://www.instagram.com/";
const TAG_URL = tag => `https://www.instagram.com/explore/tags/${tag}/`;
const data = require("./info.json");

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: true,
      args: ["--start-maximized"]
    });

    instagram.page = await instagram.browser.newPage();
    await instagram.page.setViewport({ width: 1920, height: 1080 });
  },
  login: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    await instagram.page.waitFor(3500);

    let loginButton = await instagram.page.$x('//a[contains(text(), "Log in")]');

    // click on the login url button////////////////////////////////////////////////////////////////////////////////////////////
    await loginButton[0].click();

    await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    await instagram.page.waitFor(3000);

    // writing username and password to the site////////////////////////////////////////////////////////////////////////////////
    await instagram.page.type('input[name="username"]', username, {
      delay: 55
    });
    console.info("i entered the username");
    await instagram.page.type('input[name="password"]', password, {
      delay: 55
    });
    console.info("i entered the password");

    // clcking on the login Button//////////////////////////////////////////////////////////////////////////////////////////////
    loginButton = await instagram.page.$x('//div[contains(text(), "Log In")]');
    await loginButton[0].click();

    await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });
    await instagram.page.waitFor('a > svg[aria-label="Profile"]');
    console.info("Logged in !")

    await instagram.page.waitFor(1000);
  },

  likeTagsProcess: async (tags = []) => {
    for (let tag of tags) {
      // go to the tag page//////////////////////////////////////////////////////////////////////////////////////////////////////
      await instagram.page.goto(TAG_URL(tag), { waitUntil: "networkidle2" });
      await instagram.page.waitFor(1000);

      let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');

      for (let i = 0; i < data.postsToLike; i++) {
        let post = posts[i];

        // click on the post/////////////////////////////////////////////////////////////////////////////////////////////////////
        await post.click();

        // wait for the module to appar//////////////////////////////////////////////////////////////////////////////////////////
        await instagram.page.waitFor('div[role="dialog"]');
        await instagram.page.waitFor(1000);

        let isLikeble = await instagram.page.$('span[aria-label="Like"]');

        if (isLikeble) {
          await instagram.page.click('span[aria-label="Like"]');
           var name = await instagram.page.$('a[class="FPmhX notranslate nJAzx"]');
           var name = await instagram.page.evaluate(name => name.innerText, name);

           console.log(`I liked the picture ${instagram.page.url()} by ${name}`);

           if(data.followUser === true){
            await instagram.page.waitFor(5000);
            await instagram.page.click('button[class="oW_lN sqdOP yWX7d    y3zKF     "]');
            console.log(`i followed ${name}`);
           }

           if(data.MoreInfo === true){
           var bio = await instagram.page.$('div[class="C4VMK"] > span');
           var bio = await instagram.page.evaluate(bio => bio.innerText, bio);

           var time = await instagram.page.$('time[class="FH9sR Nzb55"]');
           var time = await instagram.page.evaluate(time => time.innerText, time);

           console.log(`Bio: \n ${bio} \n time posted : ${time}`);
           console.log('\n--------------------------------------------------------------------------------------------\n')
           }

        }else{
          console.log("post aready liked!");
        }
        await instagram.page.waitFor(2000);

        // close the module/////////////////////////////////////////////////////////////////////////////////////////////

        let closeButtonModle = await instagram.page.$x(
          '//button[contains(text(), "Close")]'
        );
        await closeButtonModle[0].click();
        await instagram.page.waitFor(2000);
      }
      await instagram.page.waitFor(15000);
    }
  }
};

module.exports = instagram;
