const fs = require("fs");

module.exports = function writeOutput(object) {
  fs.writeFileSync("output.json", JSON.stringify(object, null, 2));
};
