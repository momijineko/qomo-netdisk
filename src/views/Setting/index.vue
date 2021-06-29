<template>
  <v-container fluid>
    <!-- 内容区域样式 -->
    <!-- 设置页的首页，主要放置个人信息和杂项设置菜单 -->
    <br />
    <v-card class="mx-auto" max-width="60%" tile>
      <v-list>
        <v-list-item-group color="primary">
          <v-subheader>基本设置</v-subheader>
          <v-list-item @click="handleDLPathClick">
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>下载目录</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="handleBackupClick">
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>本地文件备份</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <br />
          <v-divider />
          <br />

          <v-subheader>云盘设置</v-subheader>
          <v-list-item to="/setting/disk">
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>云盘配置管理</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <v-dialog v-model="dlDialog" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">设置下载目录</v-card-title>

        <v-card-text>
          <v-text-field label="下载目录" v-model="path"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dlDialog = false"
            >取消</v-btn
          >
          <v-btn color="red darken-1" text @click="handleNewOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="backupDialog" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">备份设置</v-card-title>

        <v-card-text>
          <v-text-field
            label="备份目录（每次打开应用时自动备份）"
            v-model="backupPath"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="backupDialog = false"
            >取消</v-btn
          >
          <v-btn color="red darken-1" text @click="handleBackupOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dlDialog: false,
      backupDialog: false,
      path: "",
      backupPath: "",
      time: null,
      menu2: false,
    };
  },
  methods: {
    handleDLPathClick() {
      console.log("点击了下载目录按钮");
      this.dlDialog = true;
    },
    handleNewOk() {
      this.$db.set("dlPath", this.path).write();
      this.dlDialog = false;
    },
    handleBackupClick() {
      console.log("点击了定时备份按钮");
      this.backupDialog = true;
    },
    handleBackupOk() {
      this.$db.set("backupPath", this.backupPath).write();
      this.backupDialog = false;
    },
  },
  beforeMount() {
    this.path = this.$db.get("dlPath").value();
    this.backupPath = this.$db.get("backupPath").value();
  },
};
</script>

<style scoped></style>
