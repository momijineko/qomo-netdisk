<template>
  <v-container fluid>
    <!-- 内容区域样式 -->
    <!-- 设置页的首页，主要放置个人信息和杂项设置菜单 -->
    <br />
    <v-card class="mx-auto" max-width="60%" tile>
      <v-list>
        <v-list-item-group color="primary">
          <v-subheader>云盘配置管理</v-subheader>
          <v-list-item
            v-for="item in $db.get('user').value()"
            :key="item.id"
            @click="handleDelClick(item)"
          >
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                >{{ item.type }} - {{ item.name }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <v-dialog v-model="dialog" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">云盘信息</v-card-title>

        <v-card-text v-html="dialogInfo"> </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">取消</v-btn>
          <v-btn color="red darken-1" text @click="handleDel">删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog1" :max-width="'30%'">
      <v-card>
        <v-card-title class="headline">请确认</v-card-title>

        <v-card-text>是否删除？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog1 = false">取消</v-btn>
          <v-btn color="red darken-1" text @click="handleOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      dialog1: false,
      dialogInfo: "",
      path: "",
      item: {},
    };
  },
  methods: {
    handleDelClick(item) {
      //
      this.item = item;
      this.dialog = true;
      this.dialogInfo = `
      云盘名称：${item.name} <br />
      云盘类型：${item.type}<br />
      云盘地址：${item.host}<br />
      端口号：${item.port}<br />
      云盘用户名：${item.user}
    
      `;
    },
    handleDel() {
      //   this.$db
      //     .get("user")
      //     .value()
      //     .forEach((item) => {
      //       if ((item.id = this.item.id)) {
      //         console.log(item.id);
      //       }
      //     });

      this.dialog1 = true;
    },
    handleOk() {
      this.$db
        .get("user")
        .remove({ id: this.item.id })
        .write();
      this.dialog = false;
      this.dialog1 = false;
    },
  },
  beforeMount() {},
};
</script>
