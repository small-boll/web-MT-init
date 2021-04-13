<template>
  <div class="video-wrapper">
    <div class="video-content" :style="{width: videoWidth, height: videoHeight}" v-for="(item, index) in lists" :key="index" :class="[item.showScaleStatus ? 'reset-size': '']">
      <videoPlayer
        ref="video"
        @scaleBig="enlargeVideo(index)"
        @scaleSmall="reduceVideo(index)"
        @closeVideo="closeVideo(index)"
        @controlVideoOrientation="controlVideoOrientation(arguments)"
        @setMainVideo="setMainVideo"
        @controlScale="controlScale(arguments)"
        v-if="item.showStatus"
        :options="item"
      ></videoPlayer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import videoPlayer from "./MTVideo.vue";
import store from '@/store';

@Component({
  components: {
    videoPlayer,
  },
})
export default class GridVideo extends Vue {
  @Prop() videoLists!: object[];
  @Prop() props!: object;
  @Prop() videoServerId!: string;
  @Prop() videoAddress!: string;
  @Prop({default: 1}) videoNums!: number;
  @Prop() width!: number;
  @Prop() height!: number;

  public lists: object[] = [];
  public videoWidth = '';
  public videoHeight = '';

  @Watch('videoLists', {deep: true})
  videoListChange(newVal: any, oldVal: any) {
    this.transfromData();
  }

  @Watch('videoNums')
  videoNumsChange(newVal: number, oldVal: number) {
    this.videoNums = newVal;
    this.videoWidth = (100 / this.videoNums).toFixed(3) + '%';
    this.videoHeight = (100 / this.videoNums).toFixed(3) + '%';
  }

  mounted () {
    this.videoWidth = (100 / this.videoNums).toFixed(3) + '%';
    this.videoHeight = (100 / this.videoNums).toFixed(3) + '%';
    this.transfromData();
  }

  public convertKey(arr: any, keyMap: any){
    let tempString = JSON.stringify(arr);
    for(var key in keyMap){
        var reg = `/"${key}":/g`;
        tempString = tempString.replace(eval(reg),'"'+keyMap[key]+'":');
    }
    return JSON.parse(tempString);
}

  /**
   * 视频列表
   * vidoeId 唯一
   * live rtmp://172.31.108.167:1935/live/ServerId=34020000002000000001&SourceId=34020000001320000001
   * rec rtmp://172.31.108.167:1935/rec/ServerId=34020000002000000002&SourceId=34020000001320000101&starttime=2018-11-22_10:14:22&endtime=2018-11-22_13:46:20
  */
  transfromData(){
    let result = this.convertKey(this.videoLists, this.props).map((item: any) => {
      return {
        videoId: item.videoId,
        sendTime: item.sendTime,
        title: item.title,
        // videoSrc: `rtmp://${this.videoAddress}/live/ServerId=${this.videoServerId}&SourceId=${item.videoId}`, // 公司rtmp视频播放格式
        videoRecSrc: `rtmp://${this.videoAddress}/rec/ServerId=${this.videoServerId}&SourceId=${item.videoId}`,
        showStatus: true, // 是否显示
        showScaleStatus: false, // 是否放大缩小状态
        videoSrc: 'rtmp://58.200.131.2:1935/livetv/hunantv', // 因公司环境没有，使用的网络rtmp流，测试
      }
    });
    this.$nextTick(() => {
      this.lists = result;
    });
  }

  /**
   * 云台控制
   * @param {directionID} 方位 上：1 下：2 左：3 右：4 左上：5 左下：6 右上：7 右下：8
   */
  public controlVideoOrientation(args: any) {
    this.$emit('controlVideoOrientation', args);
  }

  /**变焦 放大缩小  放大1  缩小-1  */
  public controlScale(args: any) {
    this.$emit('controlScale', args);
  }

  /** 区域内放大视频 */
  public enlargeVideo(index: number) {
    (this.$refs.video as any)[index].editZommStatus(true);
    this.$set(this.lists[index], "showScaleStatus", true);
  }

  /** 区域内缩小视频 */
  public reduceVideo(index: number) {
    let ref = 'videoRef' + index;
    (this.$refs.video as any)[index].editZommStatus(false);
    this.$set(this.lists[index], "showScaleStatus", false);
  }

  /** 关闭视频 */
  public closeVideo(index: number) {
    this.$set(this.lists[index], "showStatus", false);
  }

  /** 设为主摄 */
  public setMainVideo(videoData: object) {
    this.$emit('setMainVideo', videoData);
  }
}
</script>

<style lang="scss" scoped>
.video-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  position: relative;
  .video-content {
    z-index: 1;
  }
  .reset-size {
    position: absolute;
    top:0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: 999 !important;
  }
}
</style>
