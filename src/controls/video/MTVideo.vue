<template>
  <div class="video-box">
    <div class="video-top-box">
      <p class="title">{{ options.title }}</p>
      <div class="top-img-box">
        <img v-if="!bigOrSmall" @click="scaleBigVideo" class="full-screen" title="放大" src="~@/assets/video-img/full-screen.png">
        <img v-else @click="scaleSmallVideo" class="reset-screen" title="还原" src="~@/assets/video-img/reset.png">
        <img title="关闭" @click="closeVideo" src="~@/assets/video-img/closed.png"/>
      </div>
    </div>
    <div class="video-cont">
      <video
        ref="viodeRef"
        :id="videoElem"
        class="video-js vjs-default-skin vjs-big-play-centered">
        <source :src="options.videoSrc" type="rtmp/flv" />
        <p class="vjs-no-js">抱歉，您的浏览器不支持</p>
      </video>
    </div>
    <div class="video-bottom-box">
      <div class="video-control-box">
         <img src="~@/assets/video-img/arrow-left.png" title="摄像头左转" alt="摄像头左转" @click="controlVideoOrientation(3)">
          <img src="~@/assets/video-img/arrow-right.png" title="摄像头右转" alt="摄像头右转" @click="controlVideoOrientation(4)">
          <img src="~@/assets/video-img/arrow-up.png" title="摄像头上转" alt="摄像头上转" @click="controlVideoOrientation(1)">
          <img src="~@/assets/video-img/arrow-down.png" title="摄像头下转" alt="摄像头下转" @click="controlVideoOrientation(2)">
          <img class="change-size" src="~@/assets/video-img/big.png" title="图像拉近" alt="图像放大" @click="controlScale(1)">
          <img class="change-size" src="~@/assets/video-img/small.png" title="图像拉远" alt="图像放小" @click="controlScale(-1)">
      </div>
      <div class="right-content-box">
        <!-- <img
          title="重新播放回放"
          src="~@/assets/video-img/paly-back.png"
        /> -->
        <div class="video-time-box">
          <div class="time">
            <el-date-picker
              popper-class="date-box"
              v-model="startTime"
              type="datetime"
              placeholder="选择日期时间"
              size="small"
              :clearable="false"
              value-format="yyyy-MM-ddTHH:mm:ss.0000000+08:00"
            >
            </el-date-picker>
          </div>
          -
          <div class="time">
            <el-date-picker
              popper-class="date-box"
              v-model="endTime"
              type="datetime"
              placeholder="选择日期时间"
              size="small"
              :clearable="false"
              value-format="yyyy-MM-ddTHH:mm:ss.0000000+08:00"
            >
            </el-date-picker>
          </div>
          <div class="controls-box">
            <img
              v-if="recStatus"
              title="暂停回放"
              @click="controlVideo(5)"
              src="~@/assets/video-img/stop.png"
            />
            <img
              v-else
              title="播放选中时段内容"
              @click="controlVideo(4)"
              src="~@/assets/video-img/re-play.png"
            />
            <img
              @click="controlVideo(3)"
              title="停止回放"
              src="~@/assets/video-img/turn-off.png"
            />
          </div>
        </div>
        <div class="right-box">
          <img
            title="已当前视频为主要进行跟踪"
            @click="setMainVideo"
            src="~@/assets/video-img/related.png"
          />
           <img
            v-if="liveStatus"
            @click="controlVideo(1)"
            title="播放"
            src="~@/assets/video-img/play.png"
          />
          <img
           v-else
           @click="controlVideo(2)"
            title="暂停"
            src="~@/assets/video-img/live-stop.png"
          />
        </div>
      </div>
    </div>
    <!-- <div class="toast-box">
      <div>{{ explainWords }}</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import videojs from "video.js";
import videozhCN from "video.js/dist/lang/zh-CN.json";
import "video.js/dist/video-js.css";
import "videojs-flash"; // 播放RTMP要使用flash videojs-flash

import moment from 'moment';

@Component
export default class Video extends Vue {
  @Prop() public options: any;

  public bigOrSmall = false; // 区域内放大视频
  public recStatus = false; // 回放暂停开始状态
  public liveStatus = true; // 直播暂停开始状态

  public startTime = ''; // 回放开始时间
  public endTime = ''; // 回放结束时间
  public explainWords = ''; // 地址提示

  public recVideoSrc: string = ''; // 回放地址

  public myPlayer: any = '';

  public get videoElem() {
    return 'video' + this.options.videoId
  }

  @Watch('options', { deep: true })
  optionChange(newVal: any, oldVal: any) {
    this.options = newVal;
    let videoPlay = this.myPlayer;
    videoPlay.off("timeupdate");//清空时间
    videoPlay.reset(); //重置播放器
    videoPlay.pause(); //暂停播放
    videoPlay.src({
      src: this.options.videoSrc,
      type: "rtmp/flv"
    });
    videoPlay.load(); // 直播流，暂定后需要load
    videoPlay.play(); // 直播播放
    videoPlay.one('playing', () => {
      this.liveStatus = false;
      // 监听播放
      console.log("播放器开始播放");
    });
    this.liveStatus = false;
    this.recStatus = false;
    this.explainWords = this.options.videoSrc;
  }

  /** 摄像头转动 */
  public controlVideoOrientation(direction: number) {
    this.$emit('controlVideoOrientation', direction, this.options);
  }

  /** 摄像头变焦 */
  public controlScale(scaleType: number) {
    this.$emit('controlScale', scaleType, this.options);
  }

  /** 摄像头区域内放大 */
  public scaleBigVideo() {
    this.bigOrSmall = false;
    this.$emit('scaleBig');
  }

  /** 摄像头区域内缩小 */
  public scaleSmallVideo() {
    this.bigOrSmall = true;
    this.$emit('scaleSmall');
  }

  public editZommStatus(status: boolean) {
    this.bigOrSmall = status;
  }

  /** 关闭 */
  public closeVideo() {
    this.$emit("closeVideo");
  }

  /** 设为主摄 */
  public setMainVideo() {
    // 需重新调用 获取摄像头点位
    this.$emit("setMainVideo", this.options);
  }

  public mounted () {
    this.startTime = moment(new Date(this.options.sendTime).getTime() - 30 * 1000).format();
    this.endTime = moment(new Date(this.options.sendTime).getTime() + 30 * 1000).format();
    this.explainWords = this.options.videoSrc;

    // 初始化播放
    this.$nextTick(() => {
      this.initVideo(this.videoElem);
    });
  }

  /** 视频初始化 */
  initVideo(val: any) {
    let videoOptions = {
      // poster: "", // 默认提示图片
      width: "100%",
      height: this.options.height,
      autoplay: true, // 自动播放
      language: "zh-CN", // 设置语言
      preload: "auto", // 自动加载
      errorDisplay: true, //错误展示
      userActions: {
        hotkeys: true //是否支持热键
      },
      controls: true, // 控制条
      controlBar: {
        fullscreenToggle: true, //显示全屏按钮，默认为true
        volumePanel: true, //隐藏声音面板
        currentTimeDisplay: true, //显示当前播放时间
        pictureInPictureToggle: false, //隐藏画中画按钮，默认为true
        timeDivider: true, //显示时间分割线
        durationDisplay: true, //显示总时间
        // remainingTimeDisplay: false //隐藏剩余时间
      },
      // aspectRatio: "4:3", //将播放器置于流体模式下，计算播放器动态大小时使用该值。
      //该值应该是比用冒号隔开的两个数字（如“16:9”或“4:3”）。
      // fluid: true, //是否自适应布局,播放器将会有流体体积。换句话说，它将缩放以适应容器。
      // 如果<video>标签有“vjs-fluid”样式时，这个选项会自动设置为true。
      notSupportedMessage: "此视频暂无法播放，请稍后再试",
      techOrder : ["flash", "html5"],
      sources: [
        {
          src: this.options.videoSrc,
          type: "rtmp/flv"
        }
      ]
    }
    //初始化视频方法
    this.myPlayer = videojs(
      val,
      videoOptions,
      () => {
      console.log('初始化成功！');
      this.myPlayer.volume(0); // muted 无效 控制声音的方法 默认静音
      this.myPlayer.play();
      this.myPlayer.one('playing', () => {
        this.liveStatus = false;
        // 监听播放
        console.log("播放器开始播放");
      })
    });
  }

  /** 视频底部右边的控制按钮事件 */
  controlVideo(type: number) {
    let videoPlay = this.myPlayer;
    switch (type) {
      case 1: // 播放
        videoPlay.load();
        videoPlay.play(); // 直播播放
        this.liveStatus = false; // 直播暂停按钮
        this.recStatus = false; // 回放播放按钮
        break;
      case 2: // 暂停
        videoPlay.pause(); // 直播暂停
        this.liveStatus = true;
        break;
      case 3:
        // 停止回放，播放直播
        videoPlay.off("timeupdate");//清空时间
        videoPlay.reset(); //重置播放器
        videoPlay.pause(); //暂停播放
        videoPlay.src({
          src: this.options.videoSrc,
          type: "rtmp/flv"
        });
        videoPlay.load(); // 直播流，暂定后需要load
        videoPlay.play(); // 直播播放
        videoPlay.one('playing', () => {
          this.liveStatus = false;
          // 监听播放
          console.log("播放器开始播放");
        });
        this.liveStatus = false;
        this.recStatus = false;
        this.explainWords = this.options.videoSrc;
        break;
      case 4:
        if(new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
          this.$message({
            type: 'warning',
            message: '结束时间要大于开始时间'
          })
          return
        }
        // 回放播放  rtmp://172.31.108.167:1935/rec/ServerId=34020000002000000002&SourceId=34020000001320000101&starttime=2018-11-22_10:14:22&endtime=2018-11-22_13:46:20
        let startTime = this.transformTimeStr(this.startTime);
        let endTime = this.transformTimeStr(this.endTime);
        this.recVideoSrc = `${this.options.videoRecSrc}&starttime=${startTime}&endtime=${endTime}`;
        videoPlay.off("timeupdate");//清空时间
        videoPlay.reset(); //重置播放器
        videoPlay.pause(); //暂停播放
        videoPlay.src({
          src: this.recVideoSrc,
          type: "rtmp/flv"
        });
        videoPlay.load();
        videoPlay.play();
        videoPlay.one('playing', () => {
          this.liveStatus = false;
          // 监听播放
          console.log("播放器开始播放");
        });
        this.explainWords = this.recVideoSrc;
        this.recStatus = true;
        this.liveStatus = true;
        break;
      case 5:
        // 回放暂停
        videoPlay.pause(); // 暂停
        this.recStatus = false;
        this.liveStatus = true;
        break;
      default:
        videoPlay.dispose(); // 销毁
        break;
    }
  }

  /** 转换时间格式 2018-11-22_13:46:20  2019-12-29T14:44:25.0000000+08:00 */
  transformTimeStr(str: string) {
    return str.slice(0, 10).split('-').join(':') + "_" + str.slice(11, 19);
  }

  beforeDestroy() {
    console.log("dispose");
    const videoDom = this.$refs.viodeRef; //不能用document 获取节点
    videojs(this.videoElem).dispose(); //销毁video实例，避免出现节点不存在 但是flash一直在执行，报 this.el.......is not function
  }
}
</script>

<style lang="scss" scoped>
.video-box {
  position: relative;
  background-color: #000000;
  border: solid 1px #2989dd;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;
  width: 100%;
  height: 100%;
  .video-top-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 98%;
    height: 33px;
    line-height: 33px;
    .title {
      color:#fff;
    }
    .top-img-box {
      display: flex;
      align-items: center;
      img {
        cursor: pointer;
      }
      .full-screen {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      .reset-screen {
        width:24px;
        height: 24px;
        margin-right: 5px;
      }
    }
  }
  .video-cont {
    width: 100%;
    height: calc(100% - 60px);
    background-color: #000000;
    .video-js {
      width: 100%;
      height: 100%;
      padding: 0;

      ::v-deep {
        .vjs-big-play-button {
          display: none;
        }
        .vjs-error-display {
          display: none;
        }
      }
    }
  }
  .video-bottom-box {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 31px;
    width: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .video-control-box {
      display: flex;
      align-items: center;
      margin-left: 6px;
      img {
        display: flex;
        align-items: center;
        margin-right: 10px;
        cursor: pointer;
      }
      .change-size{
        width: 24px;
        height: 24px;
      }
    }

    .right-content-box {
      display: flex;
      align-items: center;
      margin-right: 4px;
      .video-time-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .time {
          width: 156px;
          height: 23px;
          line-height: 23px;
          text-align: center;
          background-color: #112f49;
          border-radius: 3px;
          margin: 0 3px;
        }

        .time {
          ::v-deep {
            .el-input__inner {
              width: 156px;
              background-color: #112f49;
              color: #fff;
              height: 23px;
              line-height: 23px;
              text-align: center;
              border: none;
              padding: 0;
            }
            .el-icon-time::before {
              content: "";
            }
            .el-date-editor.el-input {
              width: 100%;
            }
          }
        }

        .controls-box {
          width: 56px;
          height: 23px;
          background-color: #112f49;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          img {
            cursor: pointer;
          }
        }
      }
      .right-box {
        display: flex;
        align-items: center;
        margin-left: 6px;
        img:first-child {
          margin-right: 4px;
        }
      }
      img {
        cursor: pointer;
      }
    }
  }

  .toast-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: red;
  }
}
.selected {
  border: 1px solid #ffff00;
  box-sizing: border-box;
}
</style>