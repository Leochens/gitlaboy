const fs = require('fs');
const path = require('path');
function clearFolder(folderPath) {
    // 检查目标路径是否存在
    if (!fs.existsSync(folderPath)) {
      return;
    }
  
    // 读取目标路径下的文件和子文件夹
    const files = fs.readdirSync(folderPath);
  
    // 遍历文件和子文件夹
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
  
      // 判断是文件还是文件夹
      if (fs.lstatSync(filePath).isDirectory()) {
        // 递归清空子文件夹
        clearFolder(filePath);
        // 删除空的子文件夹
        fs.rmdirSync(filePath);
      } else {
        // 删除文件
        fs.unlinkSync(filePath);
      }
    });

  }
module.exports = clearFolder;