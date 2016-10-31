const fs = require('fs');
const nodejieba = require("nodejieba");
const markdown = require('markdown').markdown;

let content = fs.readFileSync('./example/google.md', 'utf8');

console.log(content);


var tree = markdown.parse(content);

console.log(tree);

console.log(tree[0])

nodejieba.load({
  userDict: './dict/keywords.dict.utf8',
});

var words = nodejieba.cut(tree[3][1][1]);
console.log(words);
var jobs = [];
for (let word of words) {
    switch (word) {
        case "找到":
            jobs.push("FIND");
            break;
        case "輸入":
            jobs.push("INPUT");
            break;
        case "開啟":
        case "打開":
            jobs.push("OPEN");
            break;
        case "關閉":
        case "關掉":
            jobs.push("CLOSE");
            break;
        case "點擊按鈕":
            jobs.push("CLICK_BUTTON");
            break;
        case "關閉瀏覽器":
            jobs.push("CLOSE_BROWSER");
            break;
        default:
    }
}

console.log(jobs);
