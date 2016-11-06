const fs = require('fs');
const markdown = require('markdown').markdown;

let parserToken = function(msg) {
    let token = [];

    switch (msg[0]) {
        case "header":
            // 情境
            token.push({
                type: "scenario",
                value: msg[2]
            });
            break;
        case "bulletlist":
        case "numberlist":
            for (let index in msg) {
                if(Array.isArray(msg[index])) {
                    token.push(parserToken(msg[index]));
                }
            }
            break;
        case "listitem":
            // 測試步驟
            token.push({
                type: "step",
                value: msg[1],
            });
            break;
    }
    return token;
};

let parser = function(filename) {
	let content = fs.readFileSync(filename, 'utf8');
	let tree = markdown.parse(content);
    let tokens = [];

	for (let p in tree) {
		if (Array.isArray(tree[p])) {
            var token = parserToken(tree[p]);
            let t;
            for (let i = 0; i < token.length; i++) {
                if(Array.isArray(token[i])) {
                    t = token[i][0];
                    tokens.push(t);
                } else {
                    t = token[i];
                    tokens.push(t);
                }

                if( tokens[i].type === "step"  && tokens[i - 1].type === "scenario") {
                    tokens.push({
                        type: "end",
                        value: ""
                    });
                }
            }
            tokens.push({
                type: "end",
                value: ""
            });
		}
	}
	return tokens;
};

let Parser = {
	getToken: function(filename) {
		return parser('./example/google.md');
	}
};

var exports = module.exports = Parser;
