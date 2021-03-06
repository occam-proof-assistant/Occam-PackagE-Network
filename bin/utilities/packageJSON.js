"use strict";

const { arrayUtilities, fileSystemUtilities } = require("necessary");

const { PACKAGE_JSON_FILE_NAME } = require("../constants");

const { second } = arrayUtilities,
      { readFile } = fileSystemUtilities;

const utilitiesDirectoryName = __dirname, ///
      matches = utilitiesDirectoryName.match(/^(.+)\/bin\/utilities$/),
      secondMatch = second(matches),
      applicationDirectoryName = secondMatch, ///
      packageJSONFilePath = `${applicationDirectoryName}/${PACKAGE_JSON_FILE_NAME}`,
      packageJSONFile = readFile(packageJSONFilePath),
      packageJSON = JSON.parse(packageJSONFile),
      { version } = packageJSON,
      packageVersion = version;  ///

function getPackageVersion() {
  return packageVersion;
}

module.exports = {
  getPackageVersion
};
