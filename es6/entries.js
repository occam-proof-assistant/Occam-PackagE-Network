'use strict';

const necessary = require('necessary');

const File = require('./file'),
      Files = require('./files'),
      messages = require('./messages'),
      constants = require('./constants'),
      Directory = require('./directory'),
      nameUtilities = require('./utilities/name'),
      filePathUtilities = require('./utilities/filePath');

const { pathUtilities, arrayUtilities, asynchronousUtilities, fileSystemUtilities } = necessary,
      { first, filter } = arrayUtilities,
      { forEach } = asynchronousUtilities,
      { readDirectory } = fileSystemUtilities,
      { isNameHiddenName } = nameUtilities,
      { isFilePathRecognisedFilePath } = filePathUtilities,
      { ENTRIES_MAXIMUM_ARRAY_LENGTH } = constants,
      { ENTRIES_MAXIMUM_ARRAY_LENGTH_EXCEEDED_MESSAGE } = messages,
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

  getFiles() {
    const files = Files.fromNothing();

    this.mapEntry(function(entry) {
      const entryFile = entry.isFile();

      if (entryFile) {
        const file = entry; ///

        files.addFile(file);
      }
    });

    return files;
  }

  getFilePaths() {
    const filePaths = this.reduceEntry(function(filePaths, entry) {
      const entryFile = entry.isFile();

      if (entryFile) {
        const file = entry, ///
              filePath = file.getPath();

        filePaths.push(filePath);
      }

      return filePaths;
    }, []);

    return filePaths;
  }

  getDirectoryPaths() {
    const directoryPaths = this.reduceEntry(function(directoryPaths, entry) {
      const entryDirectory = entry.isDirectory();

      if (entryDirectory) {
        const directory = entry, ///
              directoryPath = directory.getPath();

        directoryPaths.push(directoryPath);
      }

      return directoryPaths;
    }, []);

    return directoryPaths;
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

    forEach(jsZipEntryNames, function(jsZipEntryName, next) {
      const jsZipEntry = jsZipEntries[jsZipEntryName];

      Directory.fromJSZipEntry(jsZipEntry, function(directory) {
        if (directory !== null) {
          const entry = directory;  ///

          array.push(entry);  ///

          next();
        } else {
          File.fromJSZipEntry(jsZipEntry, function(file) {
            if (file !== null) {
              const entry = file;

              array.push(entry);  ///
            }

            next();
          });
        }
      });
    }, done);

    function done() {
      const entries = new Entries(array);

      callback(entries);
    }
  }

  static fromTopmostDirectoryName(topmostDirectoryName, projectsDirectoryPath, loadOnlyRecognisedFiles, doNotLoadHiddenFilesAndDirectories) {
    const array = [],
          relativeDirectoryPath = topmostDirectoryName;  ///

    entriesFromRelativeDirectoryPath(array, relativeDirectoryPath, projectsDirectoryPath, loadOnlyRecognisedFiles, doNotLoadHiddenFilesAndDirectories);

    const entries = new Entries(array);

    return entries;
  }
}

module.exports = Entries;

function entriesFromRelativeDirectoryPath(array, relativeDirectoryPath, projectsDirectoryPath, loadOnlyRecognisedFiles, doNotLoadHiddenFilesAndDirectories) {
  const absoluteDirectoryPath = concatenatePaths(projectsDirectoryPath, relativeDirectoryPath),
        subEntryNames = readDirectory(absoluteDirectoryPath);

  subEntryNames.forEach(function(subEntryName) {
    const subEntryNameHiddenName = isNameHiddenName(subEntryName),
          subEntryNameNotHiddenName = !subEntryNameHiddenName,
          loadHiddenFilesAndDirectories = !doNotLoadHiddenFilesAndDirectories,
          loadUnrecognisedFilesAndDirectories = !loadOnlyRecognisedFiles;

    if (subEntryNameNotHiddenName || loadHiddenFilesAndDirectories) {
      let entry;

      const path = concatenatePaths(relativeDirectoryPath, subEntryName),
            directory = Directory.fromPath(path, projectsDirectoryPath);

      if (directory !== null) {
        const directoryPath = path; ///

        if (loadUnrecognisedFilesAndDirectories) {
          entry = directory;  ///

          array.push(entry);  ///

          const arrayLength = array.length;

          if (arrayLength > ENTRIES_MAXIMUM_ARRAY_LENGTH) {
           throw new Error(ENTRIES_MAXIMUM_ARRAY_LENGTH_EXCEEDED_MESSAGE)
          }
        }

        entriesFromRelativeDirectoryPath(array, directoryPath, projectsDirectoryPath, loadOnlyRecognisedFiles, doNotLoadHiddenFilesAndDirectories); ///
      } else {
        const file = File.fromPath(path, projectsDirectoryPath);

        if (file !== null) {
          const filePath = file.getPath(),
                filePathRecognisedFilePath = isFilePathRecognisedFilePath(filePath),
                fileRecognisedFile = filePathRecognisedFilePath;  ///

          if (fileRecognisedFile || loadUnrecognisedFilesAndDirectories) {
            entry = file; ///

            array.push(entry);  ///

            const arrayLength = array.length;

            if (arrayLength > ENTRIES_MAXIMUM_ARRAY_LENGTH) {
              throw new Error(ENTRIES_MAXIMUM_ARRAY_LENGTH_EXCEEDED_MESSAGE)
            }
          }
        }
      }
    }
  });
}
