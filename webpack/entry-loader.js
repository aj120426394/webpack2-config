const fs = require("fs");

/**
 * Auto-load any js files contained within basePath but not its sub-directories as webpack module definition files.
 *
 * @param basePath Location to search for webpack module definition files.
 * @returns {{}} Entry configuration hash.
 */
module.exports = function (basePath) {

  // Auto load any "Module Definitions" in the root src directory.
  const entries = fs.readdirSync(basePath).filter((val) => {
    return val.match(/.js$/);

  }).map((name) => {
    return `${basePath}/${name}`;
  });

  const entryHash = {};

  // Now create named hash so our output files have the correct name.
  for (var index in entries) {
    var name = entries[index].match(/([^/]+).js$/)[1];

    entryHash[name] = entries[index];
  }

  return entryHash;
};
