'use strict';

const necessary = require('necessary');

const File = require('./file'),
      Directory = require('./directory'),
      nameUtilities = require('./utilities/name');

const { pathUtilities, arrayUtilities, asynchronousUtilities, fileSystemUtilities } = necessary,
      { first } = arrayUtilities,
      { forEach } = asynchronousUtilities,
      { readDirectory } = fileSystemUtilities,
      { isNameHiddenName } = nameUtilities,
      { concatenatePaths, topmostDirectoryNameFromPath } = pathUtilities;

class Entries {
  constructor(array) {
    this.array = array;
  }

  addEntry(entry) {
    this.array.push(entry);
  }

  getTopmostDirectoryName() {
    let topmostDirectoryName = null;
    
    const firstEntry = first(this.array); ///

    if (firstEntry !== undefined) {
      const firstEntryPath = firstEntry.getPath();

      topmostDirectoryName = topmostDirectoryNameFromPath(firstEntryPath);

      if (topmostDirectoryName === null) {
        topmostDirectoryName = firstEntryPath;
      }
    }

    return topmostDirectoryName;
  }

  toJSON() {
    const entriesJSON = this.array.map(function(entry) {
            const entryJSON = entry.toJSON();
  
            return entryJSON;
          }),
          json = entriesJSON; ///

    return json;
  }

  static fromJSON(json) {
    const entriesJSON = json, ///
          array = entriesJSON.map(function(entryJSON) {
            const json = entryJSON, ///
                  file = File.fromJSON(json),
                  directory = Directory.fromJSON(json),
                  entry = file || directory;  ///

            return entry;
          }),
          entries = new Entries(array);

    return entries;
  }

  static fromJSZip(jsZip, callback) {
    const array = [],
          { files } =jsZip,
          jsZipEntries = files, ///
          jsZipEntryNames = Object.keys(jsZipEntries);

    function done() {
      const entries = new Entries(array);

      callback(entries);
    }

    forEach(jsZipEntryNames, function (jsZipEntryName, next) {
      const jsZipEntry = jsZipEntries[jsZipEntryName];

      let entry;

      Directory.fromJSZipEntry(jsZipEntry, function (directory) {
        if (directory !== null) {
          entry = directory;  ///

          array.push(entry);  ///

          next();
        } else {
          File.fromJSZipEntry(jsZipEntry, function (file) {
            if (file !== null) {
              entry = file;

              array.push(entry);  ///
            }

            next();
          });
        }
      });
    }, done);
  }

  static fromTopmostDirectoryName(topmostDirectoryName, projectsDirectoryPath, doNotLoadHiddenFilesAndDirectories) {
    const array = [],
          relativeDirectoryPath = topmostDirectoryName;  ///

    entriesFromRelativeDirectoryPath(array, relativeDirectoryPath, projectsDirectoryPath, doNotLoadHiddenFilesAndDirectories);

    const entries = new Entries(array);

    return entries;
  }
}

module.exports = Entries;

function entriesFromRelativeDirectoryPath(array, relativeDirectoryPath, projectsDirectoryPath, doNotLoadHiddenFilesAndDirectories) {
  const absoluteDirectoryPath = concatenatePaths(projectsDirectoryPath, relativeDirectoryPath),
        subEntryNames = readDirectory(absoluteDirectoryPath);

  subEntryNames.forEach(function(subEntryName) {
    const subEntryNameHiddenName = isNameHiddenName(subEntryName),
          subEntryNameNotHiddenName = !subEntryNameHiddenName,
          loadHiddenFilesAndDirectories = !doNotLoadHiddenFilesAndDirectories;

    if (subEntryNameNotHiddenName || loadHiddenFilesAndDirectories) {
      let entry;

      const path = concatenatePaths(relativeDirectoryPath, subEntryName),
            directoryPath = path, ///
            directory = Directory.fromDirectoryPath(directoryPath, projectsDirectoryPath);

      if (directory !== null) {
        entry = directory;  ///

        array.push(entry);  ///

        entriesFromRelativeDirectoryPath(array, directoryPath, projectsDirectoryPath, doNotLoadHiddenFilesAndDirectories); ///
      } else {
        const filePath = directoryPath, //
              file = File.fromFilePath(filePath, projectsDirectoryPath);

        if (file !== null) {
          entry = file; ///

          array.push(entry);  ///
        }
      }
    }
  });
}
