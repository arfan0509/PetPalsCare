const path = require("path");

const fileDir = (directory) =>
  path.join(__dirname, `../../uploads/${directory}`);

module.exports = { fileDir };
