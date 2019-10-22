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
    await instagram.page.waitFor('a > span[aria-label="Profile"]');
    console.info("Logged in !")

    // wait to click no to nofication
    
    await instagram.page.waitFor(1000);
    //let noButton = await instagram.page.$x('//button[contains(text(), "Not Now")]');
    //let noButton = await instagram.page.$x('//div[class="mt3GC"] > button[class="aOOlW   HoLwm "]');
    //await noButton[0].click();
    
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
          console.log(`i liked the picture ${instagram.page.url()}`)

          if(data.SaveLikedPosts = "true"){

            let pic = `./instegram_bot_files/liked_posts/instagram.png`;
            await instagram.page.screenshot({path: pic});
            console.log("i took a screenshot of the post of the last post!");
          }
        }else{
          console.log("post aready liked!")
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