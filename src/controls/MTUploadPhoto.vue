<!--上传图片组件-->
<template>
  <div>
    <el-upload
      ref="upload"
      class="common-upload-picture"
      :class="{'disUoloadSty':noneBtnImg}"
      :multiple="false"
      action
      :auto-upload="ifAutoUpload"
      :limit="limit"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-change="handleOnChange"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :http-request="handleHttpRequest"
      :file-list="propFile"
      :disabled="disabled"
    >
      <i :class="`${iconName}`"></i>
      <p v-if="innerText">{{ innerText }}</p>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { commonService } from "@/bll/common/commonService";

//基础控件

//model & Service
@Component
export default class MTUploadPhoto extends Vue {
  //private name:string="MTUploadPhoto";

  private bll = new commonService();

  /**
   * prop参数
   */
  @Prop({ default: "" }) imgUrl!: string; //地址
  @Prop({ default: "el-icon-plus" }) iconName!: string; //中部图标
  @Prop({ default: "" }) innerText!: string; //中部文字
  @Prop({ default: "" }) ImageUrlBase64!: string; //图片的Base64

  @Prop({ default: "" }) name!: string; //图片的prop
  @Prop({ default: false }) disabled!: boolean; //是否禁用

  @Prop({ default: 1 }) limit!: number; //限制上传个数
  /**data */
  private dialogVisible: boolean = false; //图片显示状态
  private dialogImageUrl: string = ""; //图片路径
  private successFile: any = {}; //上传成功图片
  private uploadFileList: Array<any> = []; //上传文件列表
  private ifAutoUpload: boolean = true; //是否自动上传
  //private limit: number = 1; //限制上传个数
  private propFile: Array<any> = [];

  private noneBtnImg: boolean = false;

  @Watch("imgUrl")
  private watchImgUrl(newVal: any, oldVal: any) {
    //如果父组件有图片回显信息，则直接显示该图片
    if (!!newVal) {
      this.propFile = [
        {
          url: this.imgUrl,
        },
      ];
    }
    console.log("newVal===========>", newVal);
  }

  private created() {
    // this.propFile = [
    //   {
    //     url: this.imgUrl
    //   }
    // ];
  }

  private mounted() {
    console.log("this.imgUrl===******=============>", this.imgUrl);
  }

  /**
   * 清除文件
   */
  public clearImg() {
    let that: any = this;
    that.$refs.upload.clearFiles();
  }

  /**
   * 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
   */
  private handlePreview(file: any) {
    console.log("file", file);

    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
    // console.log("点击已上传的文件链接时Preview-----file", file);
  }

  /**
   * 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
   */
  private handleBeforeUpload(file: any) {
    console.log("上传之前file-----", file);
    const isJPG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 10;

    if (!isJPG && !isPNG) {
      this.$message.error("上传头像图片只能是 JPG或PNG 格式!");

      return false;
    }
    if (!isLt2M) {
      this.$message.error("上传文件大小不能超过 10MB");
      return false;
    }
    return true;
  }
  /**
   * 文件移除时的钩子
   */
  private handleRemove(file: any, fileList: any) {
    console.log("文件移除了file", file);
    this.successFile = {};
    this.noneBtnImg = fileList.length >= this.limit;
    //向父级发送删除图片指令
    this.$emit("removeFile", this.name);
  }

  /**
   * 文件超出个数限制时的钩子
   */
  private handleExceed() {
    this.$message.warning("超出上传限制");
  }

  /**
   * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
   */
  private handleOnChange(file: any, fileList: any) {
    this.uploadFileList = fileList;
    if (this.uploadFileList.length != 0) {
      //this.importUserDialog = true;
    } else {
      // this.importUserDialog = false;
    }

    this.noneBtnImg = fileList.length >= this.limit;
  }

  /**
   * 文件上传成功
   */
  private handleSuccess(response: any, file: any, fileList: any) {
    console.log("上传文件完成", response);

    if (response.success == true) {
      this.successFile = response.data;
      this.$message.success("文件上传成功！");

      let that: any = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (e) {
        let base64: any = this.result;
        that.$emit("uploadSuccess", that.successFile, base64, that.name);
        console.log("上传组件丢出来的successFile", that.successFile);
        // console.log("上传组件丢出来的base64", base64);
      };
    } else {
      this.$message.error(response.message);
    }
  }

  /**
   * 自定义上传行为
   */
  private async handleHttpRequest(item: any) {
    console.log("开始上传文件", item);
    const fileObj = item.file;
    // FormData 对象
    const form = new FormData();
    // 文件对象
    form.append("file", fileObj);
    let data: any = await new commonService().uploadUrl(form);
    return data;
  }
}
</script>
<style scoped lang="scss">
.uploadSection {
  .upload-warpper {
    margin: 0 30px;
  }
}

.disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
</style>

<style lang="scss">
.disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
</style>

