import fs from "fs";

/**
 * 
 * @param {string} target 
 * @param {string} path 
 */
const symlink = (target, path) => {
  return new Promise((resolve, reject) => {
    fs.link(target, path, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default symlink;