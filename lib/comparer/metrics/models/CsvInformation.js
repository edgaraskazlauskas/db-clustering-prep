// @ts-check
const CsvReadableStream = require("csv-reader");
const Fs = require("fs");

module.exports = class CsvInformation {
  /**
   *
   * @param {String} filePath
   */
  constructor(filePath) {
    this.filePath = filePath;
    this.inputStream = Fs.createReadStream(process.cwd() + filePath, "utf8");
  }

  async parse() {
    const rows = [];
    await new Promise((resolve) => {
      this.inputStream
        .pipe(
          new CsvReadableStream({
            parseNumbers: true,
            trim: true,
            asObject: true,
          })
        )
        .on("data", function (line) {
          rows.push(line);
        })
        .on("end", function () {
          resolve();
        });
    });

    return rows;
  }
};
