/* 云盘相关操作接口 */

import { createClient } from "webdav/web";
import ftp from "promise-ftp";
import qs from "qs";
import { diskinfo } from "@dropb/diskinfo";
import axios from "../plugins/axios";

/**
 * 创建云盘
 * @param {object} config 用户个人信息配置
 * @param {string} config.user 用户名
 * @param {string} config.pass 密码
 * @param {string} config.host 服务器地址
 * @param {string} config.port  端口号（如果有）
 * @param {number} config.type 云盘协议分类，1   为 seafile，2 为 Webdav，3 为 FTP，4 为 SMB / SAMBA
 * @returns {object} 云盘客户端对象，包含云盘的种类
 */
const create = (config) => {
  if (config.type == 0) {
    // 本地文件
    return {
      path: config.remoteURL,
      type: config.type,
    };
  } else if (config.type == 1) {
    // seafile rest
    // let data = qs.stringify({
    //   username: config.user,
    //   password: config.pass,
    // });
    return axios({
      method: "post",
      url: config.host + "/api2/auth-token/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        username: config.user,
        password: config.pass,
      }),
    });
  } else if (config.type == 2) {
    // webdav
    return createClient(config.host, {
      username: config.user,
      password: config.pass,
    });
  } else if (config.type == 3) {
    // FTP

    const client = new ftp();
    return client.connect({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.pass,
    });
  } else if (config.type == 4) {
    // samba
  }
};

/**
 * 获取云盘配额
 * @param {object} client 客户端对象
 * @returns {object} Promise 云盘配额信息
 */
const getQuota = (client, type) => {
  if (type == 0) {
    return diskinfo();
  } else if (type == 1) {
    return axios({
      method: "get",
      url: client.host + "/api2/account/info/",
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  } else if (type == 2) {
    return client.getQuota();
  }
};

const getRepos = (client, type) => {
  if (type == "1") {
    return axios({
      method: "GET",
      url: client.host + "/api2/repos/",
      headers: {
        Authorization: "Token " + client.token,
      },
    });
  }
};

export { create, getQuota, getRepos };
