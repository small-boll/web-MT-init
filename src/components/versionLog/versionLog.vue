<template>
  <div class="msgPops-template">
    <MsgPopDetailPanel
      class="msg-detail-section"
      title="版本日志"
      width="470px"
      height="480px"
      @handleClose="handleClose"
    >
      <div slot="slot-content" class="content car-content">
        <div class="equipList-search-section">
          <div class="equipList-search-title">
            <h5>{{ this.resultData.version }}</h5>
            <i class="equipList-close-btn icon-popups-close28x28"></i>
          </div>
          <div class="banbenhao-show-list">
            <el-scrollbar class="deepadd-scroll-y" style="height:100%">
              <ul>
                <li v-for="(item,index) in this.result" :key="index">
                  {{ item }}
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </MsgPopDetailPanel>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component, Prop, Emit } from "vue-property-decorator";
  import { common } from "@/utils/common.ts";
  import { versionLogModel } from "@/versionPublish/versionLog";
  import { mtConsole } from "@/utils/mtConsole";




  @Component({
    components: {}
  })
  export default class versionLogPanel extends Vue  {
    /**data */
    // private result = new versionLogModel();
    private result: any = {};
    private resultData: any = {};
    // private resultData: string = "";

    mounted() {
      this.resultData = common.getCurrentVersion();
      console.log("result", this.resultData);
      console.log("result", this.resultData.updateContentList);
      this.result = this.resultData.updateContentList;
    }

    /**
     * 窗体关闭事件
     */
    @Emit("handleClose")
    private handleClose() {}

   setPropDicData(control:HTMLFormElement,prop:string,dicData: Array<any>){
     
   }
    
  }
</script>

<style lang="scss" scoped>
  
  @import "~@/assets/css/components/versionLog.scss";
</style>
