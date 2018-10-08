import fs from "fs";

fs.symlink()

const symlink = (target, path) => {
    return new Promise((resolve, reject) => {
        fs.symlink(target, path, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export default symlink;