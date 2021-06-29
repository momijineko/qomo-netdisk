<template>
  <div @contextmenu="rightClick($event)">
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-item @click="handleOpenClick(selectRow)">
          <v-list-item-title>打开</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleDownloadClick(selectRow)" v-if="!dlBtn">
          <v-list-item-title>下载</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="handleCopyClick"
          v-if="!$store.state.mvpath.path ? true : false"
        >
          <v-list-item-title>复制</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="handleMoveClick"
          v-if="!$store.state.mvpath.path ? true : false"
        >
          <v-list-item-title>移动</v-list-item-title>
        </v-list-item>

        <!-- 如果mvpath没有值 ， 粘贴 按钮不可用 -->
        <v-list-item
          @click="handlePasteClick"
          v-if="$store.state.mvpath.path ? true : false"
        >
          <v-list-item-title>粘贴</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleRenameClick(selectRow)">
          <v-list-item-title>重命名</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleDeleteClick">
          <v-list-item-title>删除</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handlePropClick(selectRow)">
          <v-list-item-title>属性</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu
      v-model="showMenuOut"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense>
        <!-- 如果mvpath没有值 ， 粘贴 按钮不可用 -->
        <v-list-item
          @click="handlePasteClick"
          v-if="$store.state.mvpath.path ? true : false"
        >
          <v-list-item-title>粘贴</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-toolbar flat>
      <!-- 面包屑渲染实现难度高，这里改用输入框 -->
      <v-text-field
        placeholder="文件路径"
        class="path-field"
        v-model="path"
        @keyup.enter="handleEnter"
      ></v-text-field>
      <v-spacer></v-spacer>
      <!-- 上一页 -->
      <v-btn icon @click="handleReturnClick" :disabled="returnBtn">
        <v-icon>mdi-keyboard-return</v-icon>
      </v-btn>
      <!-- 新建文件夹 -->
      <v-btn icon @click="handleNewClick">
        <v-icon>mdi-folder-plus</v-icon>
      </v-btn>
      <!-- 排序方式 -->
      <!-- <v-btn icon>
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-view-module</v-icon>
      </v-btn> -->
    </v-toolbar>

    <v-divider></v-divider>
    <!-- 禁用分页和隐藏页脚 -->
    <v-data-table
      :headers="headers"
      :items="fileItems"
      fixed-header
      hide-default-footer
      disable-pagination
    >
      <!-- 重新渲染json 添加文件类型图标 -->
      <template v-slot:item="{ item }">
        <!-- 双击和右击第一项都是进入功能 -->
        <tr
          @dblclick="handleOpenClick(item)"
          @contextmenu="rightClick($event, item)"
          :class="selectRow.name == item.name ? selectRow.class : ''"
        >
          <td>
            <v-icon class="mr-2" v-if="item.isDirectory"
              >mdi-folder-outline</v-icon
            >
            <v-icon class="mr-2" v-else>mdi-file-outline</v-icon>
            {{ item.name | fileNameEllipsis }}
          </td>
          <td>{{ item.size | fileSizeEllipsis }}</td>
          <!-- <td v-if="$vuetify.breakpoint.smAndUp">{{ item.birthDate }}</td> -->
          <td v-if="$vuetify.breakpoint.smAndUp">{{ item.changeDate }}</td>
        </tr>
      </template>
    </v-data-table>

    <v-container fluid>
      <!-- 内容区域样式 -->
      <span style="font-size: 10px; color: #666"
        >本目录下共有{{ fileCount }}个文件，
        {{ directoryCount }} 个文件夹。</span
      >
    </v-container>

    <v-dialog v-model="dialog" :max-width="dialogWidth">
      <v-card>
        <v-card-title class="headline" v-text="dialogTitle"></v-card-title>

        <v-card-text v-html="dialogInfo"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialog = false">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="renameDialog" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">重命名</v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="文件名称"
            v-model="filename"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="renameDialog = false"
            >取消</v-btn
          >
          <v-btn color="red darken-1" text @click="handleRenameOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="newDialog" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">新建</v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="文件夹名称"
            v-model="filename"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="newDialog = false"
            >取消</v-btn
          >
          <v-btn color="red darken-1" text @click="handleNewOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除 -->
    <v-dialog v-model="deleteDialog" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">新建</v-card-title>

        <v-card-text>
          是否要删除
          <b>{{ selectRow.name }}</b> ？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteDialog = false"
            >取消</v-btn
          >
          <v-btn color="red darken-1" text @click="handleDeleteOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import format from "date-format";
import download from "download";
import { getQuota } from "./../apis/netdisk";
import {
  getDirectoryContents,
  getFileContents,
  moveFile,
  createDirectory,
  deleteFile,
  downloadFile,
} from "./../apis/file";
import { filesizeConvert } from "./../utils/filesizeConvert";
import os from "os";
import path from "path";

export default {
  filters: {
    // 文件名过滤器，过长会自动显示省略号
    fileNameEllipsis(value) {
      if (!value) return "";
      if (value.length > 40) {
        return value.slice(0, 8) + "...";
      }
      return value;
    },
    // 文件大小自动转换，默认给的值是字节
    fileSizeEllipsis(value) {
      return filesizeConvert(value);
    },
  },
  data: () => {
    return {
      client: {},
      path: "/", // 当前路径
      prevPath: [], // 上个路径
      dialog: false, // 普通的提示弹窗，只有确定按钮，点击关闭
      dialogTitle: "",
      dialogInfo: "",
      dialogWidth: "",
      renameDialog: false, // 重命名的弹窗
      newDialog: false, // 新建文件夹的弹窗
      deleteDialog: false, // 删除弹窗
      copyDialog: false, // 复制到 弹窗
      filename: "", // 重命名文件名
      // 表头
      headers: [
        {
          text: "名称",
          align: "start",
          sortable: false,
          value: "name",
          width: "55%",
        },
        { text: "大小", align: "", value: "size" },
        // { text: "创建日期", value: "birthDate" },
        { text: "修改日期", value: "changeDate" },
      ],
      fileItems: [],
      selectRow: {}, // 当前选中的行
      showMenu: false, // 右键菜单开关
      showMenuOut: false, // 右键菜单开关
      dlBtn: true, // 下载是否可用按钮，默认为不可用，只有文件可下载
      returnBtn: true, // 上一页按钮默认不可用
      x: 0,
      y: 0,
      fileCount: 0,
      directoryCount: 0,
      diskId: 0, // 云盘id
    };
  },
  methods: {
    /**
     *右键菜单 row是选中行
     */
    rightClick(e, row) {
      // 清除冒泡事件
      e.stopPropagation();
      if (typeof row == "undefined") {
        this.showMenuOut = false;
        e.preventDefault();
        this.x = e.clientX;
        this.y = e.clientY;
        this.$set(this.selectRow, "path", this.path);
        this.$set(this.selectRow, "isDirectory", true);
        this.$nextTick(() => {
          this.showMenuOut = true;
        });
      } else {
        if (row.isDirectory == false) {
          this.dlBtn = false;
        } else {
          this.dlBtn = true;
        }
        this.selectRow = row;
        this.showMenu = false;
        e.preventDefault();
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
          this.showMenu = true;
        });
      }
    },

    // 修改进入路径
    handleEnter() {
      this.prevPath.push(this.path);
      console.log(this.prevPath);
      this.$store.commit("setPath", this.path);
      this.handleFileRender();
    },

    // 点击返回按钮
    handleReturnClick() {
      this.path = this.prevPath.pop();
      this.$store.commit("setPath", this.path);
      this.handleFileRender();
    },

    // 新建文件夹按钮
    handleNewClick() {
      this.newDialog = true;
    },

    // 点击新建中的确定按钮
    handleNewOk() {
      console.log(this.filename);
      // 创建文件夹
      if (/^\s+$/gi.test(this.filename)) {
        this.dialog = true;
        this.dialogTitle = "错误";
        this.dialogInfo = "文件夹名称不能为空！";
        this.dialogWidth = "30%";
        return;
      } else if (this.filename[0] == " ") {
        this.dialog = true;
        this.dialogTitle = "错误";
        this.dialogInfo = "文件夹名称不能以空格开头！";
        this.dialogWidth = "30%";
        return;
      }
      createDirectory(this.client, this.filename, "1")
        .then(() => {
          // 成功时关闭弹窗关重渲染页面
          // 使用正则表达式判断不能全为空格

          this.newDialog = false;
          this.handleFileRender();
          this.filename = "";
        })
        .catch((err) => {
          this.dialog = true;
          this.dialogTitle = "错误";
          this.dialogInfo = err;
          // 当文件夹名为空时，渲染 错误信息和已存在时一样，所以这样判断
          if (this.filename == "") this.dialogInfo = "文件夹名称不能为空！";
          // 当文件夹名已存在时，渲染
          else if (err.toString().indexOf("EEXIST") != -1) {
            this.dialogInfo = "文件夹已存在，请重新输入！";
          } else if (err.toString().indexOf("EINVAL") != -1) {
            this.dialogInfo = "文件夹名称非法，请重新输入！";
          } else if (err.toString().indexOf("EPERM") != -1) {
            this.dialogInfo = "权限不足，无法进行操作！";
          }
          this.dialogWidth = "30%";
        });
    },

    // 点击开始按钮
    handleOpenClick(row) {
      // 当 选中项为文件夹时，进入文件夹
      if (row.isDirectory) {
        this.prevPath.push(this.path);
        // 路径
        this.$store.commit(
          "setPath",
          this.path.charAt(this.path.length - 1) == "/"
            ? (this.path = this.path + row.path + "/")
            : ""
        );
        this.handleFileRender();
      } else {
        // 选中项为文件时，判断 是否为纯文本文件，不是弹出对话框
        console.log(path.extname(row.path));
        if (
          [".txt", ".json", ".ini", ".log", ".md"].indexOf(
            path.extname(row.path)
          ) !== -1
        ) {
          // 大于2m不予显示
          if (row.size <= 2000000) {
            this.dialog = true;
            this.dialogTitle = "预览";
            this.dialogInfo = "Seafile 云盘暂不支持预览，请下载后查看！";
            this.dialogWidth = "30%";
            getFileContents(this.client, {}, row.path, "2")
              .then((content) => {
                console.log(content);
                this.dialogInfo = content.toString().replace(/\n/g, "<br />");
                if ([".json", ".md"].indexOf(path.extname(row.path)) !== -1) {
                  this.dialogInfo = `<code>${content}</code>`;
                }
                this.dialogWidth = "50%";
              })
              .catch((err) => err);
          } else {
            this.dialog = true;
            this.dialogTitle = "错误";
            this.dialogInfo = `文件过大（<b>超过2MB</b>），请下载查看！`;
            this.dialogWidth = "30%";
          }
        } else {
          this.dialog = true;
          this.dialogTitle = "错误";
          this.dialogInfo = `<span>暂时只支持预览 <code>.txt</code> 、 <code>.json</code> 、 <code>.ini</code> 、 <code>.log</code> 、 <code>.md</code> 格式的文件！</span>`;
          this.dialogWidth = "30%";
        }
      }
    },
    // 点击下载按钮
    handleDownloadClick() {
      console.log("点击了下载按钮");
      // getFileDownloadLink(this.client, this.selectRow.path)
      //   .then((res) => console.log(res))
      //   .catch((err) => console.log(err));
      console.log(this.selectRow);
      downloadFile(this.client, this.selectRow.path, "1").then((res) => {
        console.log(res.data);
        download(res.data, this.$db.get("dlPath").value(), {
          filename: require("path").basename(this.selectRow.path),
        })
          .then(() => {
            console.log("下载成功");
            alert("下载成功");
          })
          .catch((err) => {
            console.log(err.response);
            console.log("下载失败");
          });
      });
    },
    // 点击复制按钮
    handleCopyClick() {
      console.log(this.selectRow);
      this.$set(this.selectRow, "class", "select-item");
      this.$store.commit("setMvpath", {
        path: this.path + this.selectRow.path,
        type: 1,
        fileType: this.selectRow.isDirectory,
      });
    },

    // 点击移动按钮
    handleMoveClick() {
      this.$set(this.selectRow, "class", "select-item");
      this.$store.commit("setMvpath", {
        path: this.path + this.selectRow.path,
        type: 2,
      });
    },

    // 点击粘贴按钮
    handlePasteClick() {
      console.log("点击了粘贴按钮");
      // 当 type 为 1 时 复制
      if (this.$store.state.mvpath.type == 1) {
        moveFile(
          this.client,
          this.$store.state.mvpath.path,
          this.selectRow.path,
          "1",
          {
            type: "copy",
            isDirectory: this.$store.state.mvpath.isDirectory,
          }
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err.response));
        this.$store.commit("setMvpath", {});
        // 当 type 为 2 时，粘贴
      } else if (this.$store.state.mvpath.type == 2) {
        moveFile(
          this.client,
          this.$store.state.mvpath.path,
          this.selectRow.path,
          "1",
          {
            type: "move",
            isDirectory: this.$store.state.mvpath.isDirectory,
          }
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err.response));
        this.$store.commit("setMvpath", {});
      }

this.$store.commit("setPath", this.path);
      this.handleFileRender();
    },

    // 点击重命名按钮
    handleRenameClick(row) {
      console.log(row);
      this.renameDialog = true;
      this.filename = row.name;
    },

    // 点击重命名弹窗中的确认按钮
    handleRenameOk() {
      console.log(this.selectRow);
      if (/^\s+$/gi.test(this.filename) || this.filename == "") {
        this.filename = this.selectRow.name;
        this.dialog = true;
        this.dialogTitle = "错误";
        this.dialogInfo = "文件名不能为空！";
        this.dialogWidth = "30%";
        return;
      } else if (this.filename[0] == " ") {
        this.filename = this.selectRow.name;
        this.dialog = true;
        this.dialogTitle = "错误";
        this.dialogInfo = "文件名不能以空格开头！";
        this.dialogWidth = "30%";
        return;
      }
      console.log(this.selectRow);
      moveFile(
        this.client,
        this.path + this.selectRow.path,
        this.filename,
        "1",
        {
          type: "rename",
          isDirectory: this.selectRow.isDirectory,
        }
      )
        .then((res) => {
          // 成功时关闭弹窗关重渲染页面
          // 使用正则表达式判断不能全为空格
          console.log(res.data);
          if (res.toString().indexOf("EPERM") != -1) {
            throw "权限不足，无法进行操作！";
          }
          this.renameDialog = false;
          this.handleFileRender();
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status == 409) {
            this.dialogInfo = "新文件名与旧文件名相同！";
          } else {
            this.dialogInfo = err.response.data.error_msg;
          }
          this.dialog = true;
          this.dialogTitle = "错误";
          //   this.dialogInfo = err;
          this.dialogWidth = "30%";
        });
      console.log();
    },
    // 点击删除按钮
    handleDeleteClick() {
      // console.log("点击了删除按钮");
      this.deleteDialog = true;
    },
    handleDeleteOk() {
      deleteFile(this.client, this.path + this.selectRow.path, "1", {
        isDirectory: this.selectRow.isDirectory,
      })
        .then((res) => {
          console.log(res);
          this.deleteDialog = false;
          this.handleFileRender();
        })
        .catch((err) => {
          console.log(err);
          this.dialog = true;
          this.dialogTitle = "错误";
          this.dialogInfo = "您的权限不足，无法删除！";
          this.dialogWidth = "30%";
        });
    },

    // 点击查看文件属性
    handlePropClick(row) {
      this.dialog = true;
      this.dialogTitle = "属性";
      // 当为文件夹时，不显示文件大小修改时间和访问时间
      // 当无法分离出后缀名时，把文件名赋给文件类型
      this.dialogInfo = `
        文件名称：${row.name}<br />
        文件类型：${
          row.isDirectory
            ? "文件夹"
            : path.extname(row.path) == 0
            ? row.name
            : path.extname(row.path)
        }<br />
        位置：${row.path}<br />
        ${row.isDirectory ? "" : `文件大小：${filesizeConvert(row.size)}<br />`}
        ${row.isDirectory ? "" : `修改时间：${row.changeDate}`}

        `;
      this.dialogWidth = "30%";
    },

    // 文件列表渲染 重更新页面不能用
    handleFileRender() {
      this.fileCount = 0;
      this.directoryCount = 0;

      // 获取目录文件
      getDirectoryContents(this.client, {}, this.path, "1")
        .then((res) => {
          console.log(res.data);
          this.fileItems = [];
          // 两次forEach将文件夹和文件分开存入数组，保证存入顺序
          // 当Symbol(type)=3时不渲染，因为不会在本地文件夹中显示
          // 存储路径时顺便格式化
          res.data.forEach((item) => {
            if (item.type == "dir") {
              this.fileItems.push({
                name: item.name,
                isDirectory: item.type == "dir",
                path: item.name,
                changeDate: format.asString(
                  "yyyy-MM-dd hh:mm:ss",
                  new Date(item.mtime * 1000)
                ),
              });
              this.directoryCount++;
            }
          });
          res.data.forEach((item) => {
            if (item.type == "file") {
              this.fileItems.push({
                name: item.name,
                isDirectory: item.type == "dir",
                path: item.name,
                changeDate: format.asString(
                  "yyyy-MM-dd hh:mm:ss",
                  new Date(item.mtime * 1000)
                ),
                size: item.size,
              });
              this.fileCount++;
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.dialog = true;
          this.dialogTitle = "错误";
          if (err.response.status == "401") {
            this.dialogInfo = `云盘配置信息有误，请删除后重试！`;
          } else
            this.dialogInfo = `路径 <b>${this.path}</b> 不存在或无访问权限！<br />请检查路径输入是否正确。`;
          this.dialogWidth = "30%";
          this.path = this.prevPath.pop(); // 还原正确的路径删除最后一个错误的路径
        });
    },
  },
  beforeMount() {
    // console.log(this.$store.state.path);
    const userInfo = this.$store.state.userInfo;
    const config = {};

    os;
    userInfo;

    this.diskId = this.$route.hash.slice(1);
    this.$db
      .get("user")
      .value()
      .forEach((item) => {
        if (item.id == this.diskId) {
          console.log(item.id);
          if (item.type == "Seafile") {
            config.type = "1";
            config.host = item.host;
            config.user = item.user;
            config.pass = item.pass;
            this.client = {
              name: item.name,
              host: item.host,
              token: item.token,
              repo: item.repo,
            };
            window.client = this.client;
            console.log(config);
            // this.$set(this.client, "type", "2");
          }
        }
      });

    let data = [];
    let count = 0;
    getQuota(this.client, "1")
      .then((res) => {
        data.push({
          id: count++,
          name: this.client.name,
          used: filesizeConvert(res.data.usage),
          total: filesizeConvert(res.data.total),
          pcent: ((res.data.usage / res.data.total) * 100).toFixed(1) + "%",
        });
      })
      .catch((err) => console.log(err));
    this.$store.commit("setNetdiskInfo", data);

    // 调用文件列表渲染函数
    this.handleFileRender();
  },
  beforeUpdate() {
    // 如果没有 prevPath, 按钮不可点
    // 如果有的话，点击返回上一页
    if (this.prevPath.length == 0) {
      this.returnBtn = true;
    } else {
      this.returnBtn = false;
    }
    this.$store.commit("setPath", this.path);
  },
  watch: {
    $route(to) {
      // 当渲染本地文件时，下载按钮不可用
      // if (to.path == "/") {
      //   this.dlBtn = true;
      // } else {
      //   this.dlBtn = false;
      // }
      // 使用 slice()方法截取掉hash的#
      if (to.hash == "") {
        // this.$store.commit("setPath", this.path);
      } else {
        // this.$store.commit(
        //   "setPath",
        //   path.normalize(
        //     this.$store.state.diskInfo[to.hash.slice(1)].name + "/"
        //   )
        // );
      }
      this.handleFileRender();
    },
  },
};
</script>

<style scoped>
.path-field {
  position: relative;
  top: 10px;
  width: 100%;
}

.select-item {
  opacity: 90%;
  background: #ddd;
}
</style>
