/* 文件管理相关接口 */

import fs from "fs";
import db from "../db";
// import fsPromises from "fs/promises";
import del from "del";
import path from "path";
// 判断 和转换文件编码
import jschardet from "jschardet";
import iconv from "iconv-lite";
import download from "download";
// import FormData from "form-data";
import axios from "../plugins/axios";
import qs from "qs";

const fsPromises = fs.promises;

/**
 * 获取文件夹中的文件信息
 * @param {object} client 客户端对象
 * @param {object} config 筛选配置
 * @example
 * {
 *  glob: "/**\/*.{png,jpg,gif}",
 *  deep: true
 * }
 * @param {string} path 文件夹路径
 * @returns {object} 文件信息数组
 */
const getDirectoryContents = (client, config, path, type) => {
  if (type == 0) {
    // 使用readdir 读取本地文件目录
    // readdir 会返回一个数组，只包含文件名，这里包装为类数组 ，加入文件的类型 （即文件或文件夹）
    return fsPromises.readdir(path || client.path, { withFileTypes: true });
  } else if (type == 1) {
    return axios({
      method: "get",
      url: client.host + "/api2/repos/" + client.repo + "/dir/?p=" + path,
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  } else if (type == 2) {
    return client.getDirectoryContents(path, config);
  } else if (type == 3) {
    return client.list(path);
  }
};

/**
 * 获取指定文件的信息
 * @param {object} client 客户端对象
 * @param {string} path  路径
 * @returns {object} 文件信息对象
 */
const getFileStat = (client, path, type) => {
  if (type == 0) {
    return fsPromises.stat(path);
  } else if (type == 1) {
    return axios({
      method: "get",
      url:
        client.host +
        "/api/v2.1/repos/" +
        client.repo +
        "/dir/detail/?path=" +
        path,
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  } else if (type == 2) {
    return client.stat(path);
  }
};

/**
 * 判断路径是否存在
 * @param {object} client 客户端对象
 * @param {string} path 路径
 * @returns {boolean} 存在为 `true`，不存在为 `false`
 */
const exist = (client, path, type) => {
  if (type == 0) {
    return fsPromises
      .access(path, fs.constants.F_OK)
      .then((bool) => bool)
      .catch((err) => err);
  } else if (type == 2) {
    return client
      .exist(path)
      .then((res) => res)
      .catch((err) => err);
  }
};

/**
 * 新建文件夹
 * @param {object} client 客户端对象
 * @param {string} path 路径
 * @returns {object} 返回对象 本地新建成功不返回数据
 */
const createDirectory = (client, path, type) => {
  if (type == 0) {
    return fsPromises.mkdir(path, { recursive: false });
  } else if (type == 1) {
    return axios({
      method: "post",
      url: client.host + "/api2/repos/" + client.repo + "/dir/?p=/" + path,
      headers: {
        Authorization: "Token " + client.token,
      },
      data: qs.stringify({
        operation: "mkdir",
      }),
    });
  } else if (type == 2) {
    return client.createDirectory(path);
  }
};

/**
 * 上传文件
 * @param {object} client 客户端对象
 * @param {string} localPath 本地路径
 * @param {string} path 云盘路径
 * @returns {object} 返回对象
 */
const uploadFile = (client, localPath, remotePath, type) => {
  if (type == 1) {
    return axios({
      method: "get",
      url:
        client.host +
        "/api2/repos/" +
        client.repo +
        "/upload-link/?p=" +
        remotePath,
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  } else if (type == 2) {
    // let filePath = path.resolve(localPath[0]); // 如果是本地文件
    // console.log(localPath);
    let data = fs.readFileSync(localPath);
    return client.putFileContents(
      remotePath + "/" + path.basename(localPath),
      data
    );
  }
};

/**
 * 下载文件
 * @param {object} client 客户端对象
 * @param {string} path 文件路径
 */
const downloadFile = (client, path, type) => {
  let dlPath = db.get("dlPath").value();
  if (fs.existsSync(dlPath)) {
    //1
  } else {
    fs.mkdirSync(dlPath, { recursive: true });
  }

  if (type == 1) {
    return axios({
      method: "get",
      url:
        client.host +
        "/api2/repos/" +
        client.repo +
        "/file/?p=" +
        path +
        "&reuse=1",
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  } else if (type == 2) {
    // client
    //   .createReadStream(path)
    //   .pipe(
    //     fs.createWriteStream(
    //       db.get("dlPath").value() + "/" + require("path").basename(path)
    //     )
    //   );
    let url = client
      .getFileDownloadLink(path)
      .replace(/.*?:\/\//g, "")
      .split("@");
    let auth, davUrl;
    if (url.length == 3) {
      auth = url[0] + "@" + url[1];
      davUrl = url[2];
    } else {
      auth = url[0];
      davUrl = url[1];
    }
    console.log(url);
    return download(davUrl, dlPath, {
      auth: auth,
      filename: require("path").basename(path),
    });
  }
};

/**
 * 获取纯文本文件的文本内容
 * @param {object} client 客户端对象
 * @param {object} config 格式化配置
 * @param {string} path 文件路径
 * @returns {string} 文本内容
 */
const getFileContents = (client, config, path, type) => {
  if (type == 0) {
    return fsPromises
      .readFile(path)
      .then((data) => {
        // 检测文件编码格式并渲染时自动转换
        return iconv.decode(data, jschardet.detect(data).encoding);
      })
      .catch((err) => err);
  } else if (type == 2) {
    return client
      .getFileContents(path, config)
      .then((res) => {
        return iconv.decode(
          // 转换 默认返回的是 arraybuffer 格式的数据
          String.fromCharCode.apply(null, new Uint8Array(res)),
          jschardet.detect(String.fromCharCode.apply(null, new Uint8Array(res)))
            .encoding
        );
      })
      .catch((err) => err);
  }
};

/**
 * 复制文件
 * @param {object} client 客户端对象
 * @param {string} oldPath 旧路径
 * @param {string} newPath 新路径
 * @returns {object} 返回对象
 */
const copyFile = (client, oldPath, newPath, type) => {
  if (type == 0) {
    return fsPromises.copyFile(oldPath, newPath);
  } else if (type == 2) {
    return client.copyFile(oldPath, newPath);
  }
};

/**
 * 复制或重命名文件
 * @param {object} client 客户端对象
 * @param {string} oldPath 旧路径
 * @param {string} newPath 新路径
 * @returns {object} 返回对象
 */
const moveFile = (client, oldPath, newPath, type, config) => {
  if (type == 0) {
    return fsPromises.rename(oldPath, newPath);
  } else if (type == 1) {
    let data = {};
    console.log(config);
    if (config.type == "rename") {
      data = {
        operation: config.type,
        newname: newPath,
      };
    } else if (config.type == "copy") {
      data = {
        operation: "copy",
        dst_repo: client.repo,
        dst_dir: newPath,
      };
    } else if (config.type == "move") {
      data = {
        operation: "move",
        dst_repo: client.repo,
        dst_dir: newPath,
      };
    }
    console.log(data);
    return axios({
      method: "post",
      url: config.isDirectory
        ? client.host + "/api2/repos/" + client.repo + "/dir/?p=" + oldPath
        : client.host + "/api2/repos/" + client.repo + "/file/?p=" + oldPath,
      headers: {
        Authorization: "Token " + client.token,
      },
      data: qs.stringify(data),
    });
  } else if (type == 2) {
    return client.moveFile(oldPath, newPath);
  }
};

/**
 * 删除文件
 * @param {object} client 客户端对象
 * @param {*} path 路径
 * @returns {object} 返回对象
 */
const deleteFile = (client, path, type, config) => {
  if (type == 0) {
    if (fs.statSync(path).isFile()) return fsPromises.unlink(path);
    else return del([path], { force: true });
  } else if (type == 1) {
    return axios({
      method: "delete",
      url: config.isDirectory
        ? client.host + "/api2/repos/" + client.repo + "/dir/?p=" + path
        : client.host + "/api2/repos/" + client.repo + "/file/?p=" + path,
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  } else if (type == 2) {
    return client.deleteFile(path);
  }
};

export {
  getDirectoryContents,
  getFileStat,
  exist,
  createDirectory,
  uploadFile,
  downloadFile,
  getFileContents,
  copyFile,
  moveFile,
  deleteFile,
};
