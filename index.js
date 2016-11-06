const parser = require('./lib/parser.js');
const parserAST = require('./lib/parserAST.js');


let data = parser.getToken();

console.log("== parse token ==");
console.log(data);
console.log("== parse AST ==");
console.log(parserAST.getAST(data));
