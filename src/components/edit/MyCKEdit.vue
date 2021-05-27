
 <!-- 1.安装 npm install --save @ckeditor/ckeditor5-build-decoupled-document
    2.在使用的页面引入，需要中文的可引入 zh-cn.js 文件
    import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn.js'
    3.html 页面写入 -->
<template>
  <div class="myckedit-template">
    <!-- 这块是快捷按钮块 -->
    <div class="view-contain"
         id="view-contain"></div>
    <!-- 这块是编辑内容块 -->
    <div class="edit-contain"
         id="edit-contain"></div>
  </div>
</template>

<script lang="ts">
import CKEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    // CKEditor
  },
})
export default class MyCKEdit extends Vue {
  // private editor: any = ClassicEditor;
  // private editorData: string = "<p>Content of the editor.</p>";
  // private editorConfig: object = {
  //   // The configuration of the editor.
  // };
  private editorConfig: any = {
    language: "zh-cn",
    ckfinder: {},
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      //"link",
      "bulletedList",
      "numberedList",
      "|",
      "indent",
      "outdent",
      "|",
      //'imageUpload',
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        { model: "paragraph", title: "段落", class: "ck-heading_paragraph" },
        {
          model: "heading6",
          view: "h6",
          title: "标题6",
          class: "ck-heading_heading6",
        },
        {
          model: "heading5",
          view: "h5",
          title: "标题5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading4",
          view: "h4",
          title: "标题4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading3",
          view: "h3",
          title: "标题3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading2",
          view: "h2",
          title: "标题2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading1",
          view: "h1",
          title: "标题1",
          class: "ck-heading_heading1",
        },
      ],
    },
    fontSize: {
      options: [12, "default", 14, 16, 18, 20, 22, 24, 26, 28, 36, 44, 48, 72],
    },
    fontFamily: {
      options: ["宋体", "黑体", "楷体", "微软雅黑"],
    },
  };

  private mounted() {
    this.initChart();
  }
  private initChart() {
    CKEditor.create(document.querySelector("#edit-contain"), this.editorConfig)
      .then((editor: any) => {
        console.log(editor, "这是editor");
        let contain: any = document.querySelector("#view-contain");
        contain.appendChild(editor.ui.view.toolbar.element);
      })
      .catch((error: any) => {
        console.log(error, "这是error");
      });
  }
}
</script>

<style lang="scss">
.myckedit-template {
  width: 100%;
  height: 100%;
  .view-contain {
    width: 420px;
    height: 300px;
    margin: auto;
    background: darkcyan;
  }
  .edit-contain {
    width: 100px;
    height: 200px;
    background-color: aqua;
  }
}
</style>
