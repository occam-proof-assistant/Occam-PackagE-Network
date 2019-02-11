'use strict';

const necessary = require('necessary');

const File = require('./file'),
      Directory = require('./directory'),
      nameUtilities = require('./utilities/name'),
      filePathUtilities = require('./utilities/filePath');

const { pathUtilities, arrayUtilities, asynchronousUtilities, fileSystemUtilities } = necessary,
      { first, filter } = arrayUtilities,
      { forEach } = asynchronousUtilities,
      { readDirectory } = fileSystemUtilities,
      { isNameHiddenName } = nameUtilities,
      { isFilePathRecognisedFilePath } = filePathUtilities,
      { concatenatePaths, topmostDirectoryNameFromPath } = pathUtilities;

class Entries {
  constructor(array) {
    this.array = array;
  }

  getTopmostDirectoryName() {
    let topmostDirectoryName = null;
    
    const firstEntry = first(this.array); ///

    if (firstEntry) { ///
      const firstEntryPath = firstEntry.getPath();

      topmostDirectoryName = topmostDirectoryNameFromPath(firstEntryPath);

      if (topmostDirectoryName === null) {
        topmostDirectoryName = firstEntryPath;
      }
    }

    return topmostDirectoryName;
  }

  removeFileByPath(path) {
    filter(this.array, function(entry) {
      const entryFile = entry.isFile();

      if (entryFile) {
        const file = entry, ///
              filePath = file.getPath();

        if (filePath === path) {
          return false;
        }
      }

      return true;
    });
  }

  addFile(file) {
    this.array.push(file);
  }

  mapEntry(callback) { return this.array.map(callback); }

  someEntry(callback) { return this.array.some(callback); }

  everyEntry(callback) { return this.array.every(callback); }

  forEachEntry(callback) { this.array.forEach(callback); }

  reduceEntry(callback, initialValue) { return this.array.reduce(callback, initialValue); }

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

  static fromTopmostDirectoryName(topmostDirectoryName, projectsDirectoryPath, allowOnlyRecognisedFiles, disallowHiddenFilesAndDirectories) {
    const array = [],
          relativeDirectoryPath = topmostDirectoryName;  ///

    entriesFromRelativeDirectoryPath(array, relativeDirectoryPath, projectsDirectoryPath, allowOnlyRecognisedFiles, disallowHiddenFilesAndDirectories);

    const entries = new Entries(array);

    return entries;
  }
}

module.exports = Entries;

function entriesFromRelativeDirectoryPath(array, relativeDirectoryPath, projectsDirectoryPath, allowOnlyRecognisedFiles, disallowHiddenFilesAndDirectories) {
  const absoluteDirectoryPath = concatenatePaths(projectsDirectoryPath, relativeDirectoryPath),
        subEntryNames = readDirectory(absoluteDirectoryPath);

  subEntryNames.forEach(function(subEntryName) {
    const subEntryNameHiddenName = isNameHiddenName(subEntryName),
          subEntryNameNotHiddenName = !subEntryNameHiddenName,
          allowHiddenFilesAndDirectories = !disallowHiddenFilesAndDirectories,
          allowUnrecognisedFilesAndDirectories = !allowOnlyRecognisedFiles;

    if (subEntryNameNotHiddenName || allowHiddenFilesAndDirectories) {
      let entry;

      const path = concatenatePaths(relativeDirectoryPath, subEntryName),
            directory = Directory.fromPath(path, projectsDirectoryPath);

      if (directory !== null) {
        const directoryPath = path; ///

        if (allowUnrecognisedFilesAndDirectories) {
          entry = directory;  ///

          array.push(entry);  ///
        }

        entriesFromRelativeDirectoryPath(array, directoryPath, projectsDirectoryPath, allowOnlyRecognisedFiles, disallowHiddenFilesAndDirectories); ///
      } else {
        const file = File.fromPath(path, projectsDirectoryPath);

        if (file !== null) {
          const filePath = file.getPath(),
                filePathRecognisedFilePath = isFilePathRecognisedFilePath(filePath),
                fileRecognisedFile = filePathRecognisedFilePath;  ///

          if (fileRecognisedFile || allowUnrecognisedFilesAndDirectories) {
            entry = file; ///

            array.push(entry);  ///
          }
        }
      }
    }
  });
}
