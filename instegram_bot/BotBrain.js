const ig = require('./instagram');
const data = require('./info.json');

(async () => {

    await ig.initialize();
    await ig.login(data.username , data.password);
    await ig.likeTagsProcess(data.tags);

    console.log("Done With No Error!");

    process.exit();
})()