const testFolder = './src/assets/input9/';
const fs = require('fs');

let files = []
fs.readdirSync(testFolder).forEach(file => {
  files.push("" + file + "")
});

console.log(files)