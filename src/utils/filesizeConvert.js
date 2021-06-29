// [number].toFixed(2) 保留两位小数

/**
 * 文件大小转换函数
 * @param {number} filesize 文件大小，单位为字节
 * @returns {string} 转换后的带单位文件大小
 */
export const filesizeConvert = (filesize) => {
  if (filesize < 1024) return filesize + " B";
  else if (filesize < 1024 * 1000) return Math.round(filesize / 1000) + " KB";
  else if (filesize < 1024 * 1000000) {
    return (filesize / 1000000).toFixed(2) + " MB";
  } else if (filesize < 1024 * 1000000000) {
    return (filesize / 1000000000).toFixed(2) + " GB";
  } else if (filesize < 1024 * 1000000000000) {
    return (filesize / 1000000000000).toFixed(2) + " TB";
  }
};
