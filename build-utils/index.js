const fs = require('fs-extra');
const path = require('path');

async function listAllFiles (rootPath, { ext } = {}) {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });

  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      files.push(...await listAllFiles(`${rootPath}${entry.name}/`));
    } else {
      files.push({
        ...entry,
        path: path.join(rootPath, entry.name),
        dirname: rootPath,
      });
    }
  }

  return ext
    ? files.filter(file => path.extname(file.name) === ext)
    : files;
}

module.exports = { listAllFiles };
