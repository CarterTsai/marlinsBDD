const fs = require('fs');
const nodejieba = require("nodejieba");
const markdown = require('markdown').markdown;

let content = fs.readFileSync('./example/google.md', 'utf8');
var tree = markdown.parse(content);

let maxRecursion = 2;

var token = [];

var IR = {
    type: "",
    value: "",
    job: []
}

nodejieba.load({
  userDict: './dict/keywords.dict.utf8',
});

var findToken = (stepWord) => {
    let jobs = [];
    let words = nodejieba.cut(stepWord);
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

    return jobs;
}

for (let p in tree) {
    if(Array.isArray(tree[p])){
        switch(tree[p][0]) {
            case "header":
                // 情境
                token.push({
                    type: "scenario",
                    value: tree[p][2],
                    job: []
                });
                break;
            case "bulletlist":
            case "numberlist":
                console.log(tree[p]);
                var step = tree[p][1][1];
                token.push({
                    type: "step",
                    value: step,
                    job: findToken(step)
                });

                break;
        }
    }
}



//console.log(token);
