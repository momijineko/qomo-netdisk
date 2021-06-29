<template>
  <!-- 当disktype为webdav时渲染 -->
  <dav-file-manager v-if="diskType == '坚果云' || diskType == 'WebDav'" />
  <!-- 为ftp时渲染 -->
  <ftp-file-manager v-else-if="diskType == 'FTP'" />
  <!-- 为seafile时渲染 -->
  <seafile-manager v-else-if="diskType == 'Seafile'" />
</template>

<script>
import DavFileManager from "@/components/DavFileManager";
import FtpFileManager from "@/components/FtpFileManager";
import SeafileManager from "@/components/SeafileManager";

export default {
  components: {
    DavFileManager,
    FtpFileManager,
    SeafileManager,
  },
  data() {
    return {
      diskType: "", // 云盘种类
    };
  },
  beforeMount() {
    // 获取当前页面云盘种类
    this.$db
      .get("user")
      .value()
      .forEach((item) => {
        if (item.id == this.$route.hash.slice(1)) {
          console.log(item);
          this.diskType = item.type;
        }
      });
  },
  watch: {
    $route(to) {
      // 获取当前页面云盘种类
      this.$db
        .get("user")
        .value()
        .forEach((item) => {
          if (item.id == to.hash.slice(1)) {
            console.log(item);
            this.diskType = item.type;
          }
        });
    },
  },
};
</script>
