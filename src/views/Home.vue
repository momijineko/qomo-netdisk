<template>
  <file-manager></file-manager>
</template>

<script>
import FileManager from '@/components/FileManager'

export default {
  components: {
    FileManager
  },
  data: () => {
    return {
      items: [
        {
          text: "home",
          disabled: false,
          href: "#"
        },
        {
          text: ".ssh",
          disabled: false,
          href: "#"
        }
      ],
      // 表头
      headers: [
        {
          text: "名称",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "大小", value: "size" },
        { text: "日期", value: "date" }
      ],
      fileItems: [
        {
          name: "这是个假的文件夹",
          size: "159k",
          date: "2021-01-01",
          isFolder: true
        },
        {
          name: "这是个假的文件",
          size: "25m",
          date: "2021-01-01",
          isFolder: false
        }
      ]
    };
  }
};
</script>