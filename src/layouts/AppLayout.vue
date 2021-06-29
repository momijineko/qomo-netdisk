<template>
  <v-app>
    <!--
      自适应 app 布局，用于大多数页面的基础布局
      navigation drawer 是导航区 
      app-bar 类似于header
      footer 是底部
    -->

    <!-- 窗口栏 -->
    <!-- <v-system-bar app>
      <v-icon>mdi-message</v-icon>
      <span>酷猫云盘管理器</span>
      <v-spacer></v-spacer>
      <v-icon>mdi-minus</v-icon>
      <v-icon>mdi-checkbox-blank-outline</v-icon>
      <v-icon>mdi-close</v-icon>
    </v-system-bar>-->

    <!-- dark 属性字符和图标会反色 -->
    <v-app-bar app dark clipped-left color="primary accent-4">
      <!-- 控制左侧抽屉 -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- 内部放顶栏控件 -->
      <v-toolbar-title>酷猫云盘</v-toolbar-title>
      <!-- 当页面尺寸小于等于sm时，隐藏搜索框 -->
      <v-col
        class="hidden-sm-and-down ml-3"
        style="position: absolute; left: 232px; width: 324px"
      >
        <!-- <v-text-field
          flat
          dense
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="搜索云盘中的文件"
        ></v-text-field>-->
      </v-col>

      <!-- spacer 补足空白自动对齐 -->
      <v-spacer></v-spacer>
      <!-- 当页面尺寸大于等于md时即搜索框显示时，隐藏搜索按钮 -->
      <v-btn icon class="hidden-md-and-up" @click="handleSearchBtnClick">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon to="/setting">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- absolute 属性让左侧导航位于app-bar之下 permanent始终可以看到抽屉 -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :clipped="$vuetify.breakpoint.lgAndUp"
    >
      <!-- 内部放菜单项 -->
      <v-list>
        <v-subheader>此电脑</v-subheader>

        <v-list-item link to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>HOME</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          :to="'/#' + item.id"
          v-for="item in $store.state.diskInfo"
          :key="item.id"
        >
          <v-list-item-icon>
            <v-icon>mdi-harddisk</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>挂载点 - {{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader>我的云盘</v-subheader>

        <v-list-item
          link
          :to="'/disk#' + item.id"
          v-for="item in $db.get('user').value()"
          :key="item.id"
        >
          <v-list-item-icon>
            <v-icon>mdi-cloud</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              >{{ item.type }} - {{ item.name }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- 云盘或本地磁盘配额 -->
      <template v-slot:append>
        <v-card class="mx-auto" max-width="344" outlined>
          <!-- <v-list-item two-line v-if="$route.path == '/' && $route.hash === ''">
            <v-list-item-content>
              <div class="overline">
                {{ $store.state.diskInfo[0].name }}
              </div>
              <v-list-item-subtitle>
                {{ $store.state.diskInfo[0].used }}
                /
                {{ $store.state.diskInfo[0].total }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-progress-circular
              :value="$store.state.diskInfo[0].pcent"
              size="50"
              >{{ $store.state.diskInfo[0].pcent }}</v-progress-circular
            >
          </v-list-item>-->
          <div v-if="$route.path == '/' && $route.hash === ''"></div>

          <v-list-item two-line v-else-if="$route.path == '/disk'">
            <v-list-item-content>
              <div class="overline">{{ $store.state.netdiskInfo[0].name }}</div>
              <v-list-item-subtitle>
                {{ $store.state.netdiskInfo[0].used }}
                /
                {{ $store.state.netdiskInfo[0].total }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-progress-circular
              :value="$store.state.netdiskInfo[0].pcent"
              size="50"
              >{{ $store.state.netdiskInfo[0].pcent }}</v-progress-circular
            >
          </v-list-item>
          <!-- 当页面为设置页时，不渲染配额 -->
          <div
            v-else-if="
              $route.path == '/setting' || $route.path == '/setting/disk'
            "
          ></div>

          <v-list-item two-line v-else>
            <v-list-item-content>
              <div class="overline">
                {{ $store.state.diskInfo[$route.hash.slice(1)].name }}
              </div>
              <v-list-item-subtitle>
                {{ $store.state.diskInfo[$route.hash.slice(1)].used }}
                /
                {{ $store.state.diskInfo[$route.hash.slice(1)].total }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-progress-circular
              :value="$store.state.diskInfo[$route.hash.slice(1)].pcent"
              size="50"
            >
              {{ $store.state.diskInfo[$route.hash.slice(1)].pcent }}
            </v-progress-circular>
          </v-list-item>
        </v-card>
      </template>
    </v-navigation-drawer>

    <!-- 主体内容 -->
    <v-content>
      <!-- 路由 -->
      <router-view :key="timer"></router-view>
    </v-content>

    <!-- speed-dial -->
    <v-speed-dial
      :open-on-hover="$vuetify.breakpoint.lgAndUp"
      fixed
      bottom
      right
      direction="top"
      transition="slide-y-reverse-transition"
      v-if="$route.path != '/setting'"
      v-model="fab"
    >
      <template v-slot:activator>
        <v-btn fab dark color="red">
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            dark
            small
            color="red"
            @click="handleDiskClick"
          >
            <v-icon>mdi-harddisk-plus</v-icon>
          </v-btn>
        </template>
        <span>新建云盘</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            dark
            small
            color="red"
            @click="handleUploadClick"
          >
            <v-icon>mdi-cloud-upload</v-icon>
          </v-btn>
        </template>
        <span>上传文件</span>
      </v-tooltip>
    </v-speed-dial>

    <!-- 新增服务器弹窗 -->
    <v-dialog v-model="dialog" max-width="30%">
      <v-card>
        <v-card-title class="headline">新增云盘</v-card-title>

        <v-card-text>
          <v-select
            :items="items"
            v-model="selectedItem"
            label="云盘协议类型"
          ></v-select>
          <div v-if="selectedItem == 'WebDav'">
            <v-text-field label="云盘名称" v-model="name"></v-text-field>
            <v-text-field label="主机名" v-model="host"></v-text-field>
            <v-text-field label="用户名" v-model="user"></v-text-field>
            <v-text-field
              type="password"
              label="密码"
              v-model="pass"
            ></v-text-field>
          </div>
          <div v-else-if="selectedItem == 'Seafile'">
            <v-text-field label="云盘名称" v-model="name"></v-text-field>
            <v-text-field label="主机名" v-model="host"></v-text-field>
            <v-text-field label="用户名" v-model="user"></v-text-field>
            <v-text-field
              type="password"
              label="密码"
              v-model="pass"
            ></v-text-field>
            <v-select
              :items="repoItems"
              item-text="name"
              item-value="repo"
              v-model="repo"
              label="资料库"
              @click="handleRepoClick"
            ></v-select>
          </div>
          <div
            v-else-if="selectedItem == '坚果云' || selectedItem == '百度云盘'"
          >
            <v-text-field label="云盘名称" v-model="name"></v-text-field>
            <v-text-field label="用户名" v-model="user"></v-text-field>
            <v-text-field
              type="password"
              label="密码"
              v-model="pass"
            ></v-text-field>
          </div>
          <div v-else-if="selectedItem == 'FTP'">
            <v-text-field label="云盘名称" v-model="name"></v-text-field>
            <v-text-field label="主机名" v-model="host"></v-text-field>
            <v-text-field label="端口号" v-model="port"></v-text-field>
            <v-text-field label="用户名" v-model="user"></v-text-field>
            <v-text-field
              type="password"
              label="密码"
              v-model="pass"
            ></v-text-field>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            取消
          </v-btn>

          <v-btn color="green darken-1" text @click="handleOkClick">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <v-footer app>这里是 footer</v-footer> -->

    <!-- 文件 -->
    <form
      style="display:none"
      action=""
      method="post"
      enctype="multipart/form-data"
    >
      <input
        type="file"
        :key="timer"
        @change="handleUpload"
        name="file"
        id="upload"
      />
    </form>
  </v-app>
</template>

<script>
import { uploadFile, createDirectory } from "../apis/file";
import { create, getRepos } from "../apis/netdisk";
import axios from "../plugins/axios";
import fs from "fs";
const fsPromises = fs.promises;

// const electron = require("electron").remote;
export default {
  name: "AppLayout",
  data: () => {
    return {
      drawer: true, // 左侧抽屉
      fab: false, // fab按钮
      dialog: false,
      // items: ["Seafile", "坚果云", "百度云盘", "WebDav", "Smaba", "FTP"],
      items: ["Seafile", "坚果云", "WebDav"],
      repoItems: [],
      selectedItem: "",
      timer: "",
      name: "",
      host: "",
      port: "",
      user: "",
      pass: "",
      repo: "",
      token: "",
    };
  },
  methods: {
    handleSearchBtnClick: () => {
      console.log("点击了search按钮");
    },
    handleDiskClick() {
      console.log("点击新增云盘按钮");
      this.dialog = true;
    },
    handleRepoClick() {
      console.log("点击了资料库");
      if (this.host.charAt(this.host.length - 1) == "/") {
        this.host = this.host.substring(0, this.host.length - 1);
      }
      create({
        user: this.user,
        pass: this.pass,
        host: this.host,
        type: "1",
      })
        .then((res) => {
          this.token = res.data.token;
          getRepos({ token: this.token, host: this.host }, "1")
            .then((res) => {
              let temp = [];
              res.data.forEach((item) => {
                temp.push({
                  repo: item.id,
                  name: item.name,
                });
              });
              this.repoItems = temp;
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
    handleOkClick() {
      console.log("点击了确定");
      this.$db
        .get("user")
        .push({
          id: new Date().getTime(),
          type: this.selectedItem,
          name: this.name,
          host:
            this.selectedItem == "坚果云"
              ? "https://dav.jianguoyun.com/dav/"
              : this.host,
          port: this.port,
          user: this.user,
          pass: this.pass,
          repo: this.repo,
          token: this.token,
        })
        .write();
      this.$store.commit("setUserInfo", this.$db.get("user").value());
      this.dialog = false;
      this.selectedItem = "";
      this.host = "";
      this.port = "";
      this.user = "";
      this.pass = "";
      this.repo = "";
      this.token = "";
    },
    handleUploadClick() {
      console.log("点击上传文件按钮");
      console.log(this.$route.hash);
      let input = document.getElementById("upload");

      input.click();
      // console.log(this.fileValue);
    },
    handleUpload() {
      let input = document.getElementById("upload");
      // input.click()
      console.log(input.files[0]);

      this.$db
        .get("user")
        .value()
        .forEach((item) => {
          if (item.id == this.$route.hash.replace("#", "")) {
            console.log(item);
            if (item.type == "坚果云" || item.type == "Webdav") {
              let client = create({
                username: item.user,
                password: item.pass,
                remoteURL: item.host,
                type: 2,
              });
              window.client = client;
              uploadFile(
                client,
                input.files[0].path,
                this.$store.state.path,
                "2"
              )
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            } else if (item.type == "Seafile") {
              let client = {
                type: 1,
                host: item.host,
                token: item.token,
                repo: item.repo,
              };
              window.client = client;
              console.log(this.$store.state);
              uploadFile(client, input.files, this.$store.state.path, "1")
                .then((res) => {
                  let data = new FormData();
                  data.append("file", input.files[0], input.files[0].path);
                  data.append("parent_dir", this.$store.state.path);
                  data.append("replace", "1");
                  axios({
                    method: "post",
                    url: res.data + "?ret-json=1",
                    headers: {
                      Authorization: "Token " + client.token,
                    },
                    data: data,
                  })
                    .then((res) => {
                      console.log(res);
                      console.log("上传成功");
                      alert("文件上传成功");
                      this.timer = new Date().getTime();
                      input.value = "";
                    })
                    .catch((err) => {
                      console.log(err.response);
                      input.value = "";
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        });
    },
    handleSelected(item) {
      this.selectedItem = item;
      return (item = "");
    },
  },
  beforeMount() {
    // 当页面尺寸小于 lg 时， 初始化抽屉默认为关
    if (!this.$vuetify.breakpoint.lgAndUp) this.drawer = false;
    // console.log(this.$store.state.diskInfo[0].pcent);
    this.$store.commit("setUserInfo", this.$db.get("user").value());
    // console.log(this.$store.state.userInfo);
    let backupPath = this.$db.get("backupPath").value();
    fsPromises.readdir(backupPath, { withFileTypes: true }).then((res) => {
      console.log(res);
      this.$db
        .get("user")
        .value()
        .forEach((item) => {
          if (item.type == "Seafile") {
            let client = {
              type: 1,
              host: item.host,
              token: item.token,
              repo: item.repo,
            };
            window.client = client;
            // console.log(this.$store.state);
            res.forEach((item1) => {
              console.log(item1);
              uploadFile(client, backupPath, "/backup", "1")
                .then((res1) => {
                  console.log("上传链接", res1.data);
                  console.log("成功", res1.data);

                  console.log(backupPath + "/" + item1.name);

                  const FormData = require("form-data");
                  // const request = require("request");

                  let data = new FormData();

                  // html5 input file写法
                  data.append(
                    "file",
                    new window.File(
                      [
                        Buffer.from(
                          fs.readFileSync(backupPath + "/" + item1.name)
                        ),
                      ],
                      backupPath + "/" + item1.name
                    )
                  );
                  data.append("parent_dir", "/backup");
                  data.append("replace", "1");

                  axios({
                    method: "post",
                    url: res1.data + "?ret-json=1",
                    headers: {
                      Authorization: "Token " + client.token,
                    },
                    data: data,
                  })
                    .then((r) => {
                      console.log("上传成功", r);
                    })
                    .catch((err) => {
                      console.log(err.response);
                    });

                  // const { upload } = require("upload");
                  // upload(res1.data, {
                  //   files: fs.createReadStream(backupPath + "\\" + item1.name),
                  //   parent_dir: "/backup",
                  //   replace: 1,
                  // })
                  //   .then((r) => {
                  //     console.log("上传成功", r);
                  //   })
                  //   .catch((err) => {
                  //     console.log(err);
                  //   });
                })
                .catch((err) => {
                  console.log(err);
                  if (err.response.status == 404) {
                    createDirectory(client, "backup", "1")
                      .then((res2) => {
                        res2;
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                });
            });
          }
        });
    });
  },
};
</script>

<style></style>
