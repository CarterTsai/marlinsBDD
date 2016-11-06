const nodejieba = require("nodejieba");

const maxRecursion = 2;

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
            case "輸入框":
                jobs.push("INPUT_FIELD");
                break;
			case "開啟":
			case "打開":
				jobs.push("OPEN");
				break;
			case "關閉":
			case "關掉":
				jobs.push("CLOSE");
				break;
			case "點擊":
				jobs.push("CLICK");
				break;
            case "按鈕":
                jobs.push("BUTTON");
                break;
            case "瀏覽器":
                jobs.push("BROWSER");
                break;
			default:
		}
	}

	return jobs;
};

let astStrcut = {
    "type": "",
    "name":"",
    "": []
};

let ParserAST = {
	getAST: (tokenArray) => {
        let ast = [];
        for (let tokenIndex = 0; tokenIndex < tokenArray.length; tokenIndex++) {
            let obj =  Object.assign({}, astStrcut);
            switch (tokenArray[tokenIndex].type) {
                case "step":
                    ast.push("step");
                    let _tokens = nodejieba.cut(tokenArray[tokenIndex].value);
                    let test = [];
                    let word = "";
                    let isWord = false;
                    let isBracket = false;
                    for (let _tokensIndex = 0; _tokensIndex < _tokens.length; _tokensIndex++) {
                        if(_tokens[_tokensIndex] === '(') {
                            isBracket = true;
                            continue;
                        }

                        if(_tokens[_tokensIndex] === ')') {
                            isBracket = false;
                            test.push(word);
                            word = "";
                            continue;
                        }

                        if(isBracket) {
                            word = word + _tokens[_tokensIndex];
                        } else {
                            test.push(_tokens[_tokensIndex]);
                        }
                    }
                    ast.push(test);
                    break;
                default:
                case "scenario":
                    if(tokenArray[tokenIndex].type !== "scenario") {
                        ast.push(obj);
                    } else {
                        obj.type = "comment";
                        obj.name = tokenArray[tokenIndex].value;
                    }
                    break;
            }
        }

		return {test: ast};
	}
}

var exports = module.exports = ParserAST;
