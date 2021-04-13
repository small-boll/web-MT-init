<!--左右切换展示图片组件  -->
<template>
  <div class="imgDisplayCarousel-template">
    <div class="imgDisplay-bigImg">
      <!-- <ImgView src="@/assets/images/temporary_photo_100x100.png"></ImgView> -->
      <img v-if="imgUrlArr.length > 0" :src="imgUrlArr[currentImgIndex]" />
      <span v-else class="empty-text">暂无图片</span>
    </div>
    <div class="imgDisplay-imgList">
      <i
        id="arrowL"
        @click="handleClick_arrow('left')"
        class="imgDisplay-arrow imgDisplay-arrowL el-icon-arrow-left is-disabled"
      ></i>
      <div class="imgDisplay-imgItems" id="imgDisplay-imgItems">
        <div v-if="imgUrlArr.length > 0"  class="imgDisplay-imgItems-wrapper">
          <div
            class="imgDisplay-imgItem"
            :class="{ 'is-actrive': currentImgIndex == index }"
            v-for="(item, index) in imgUrlArr"
            :key="index"
          >
            <span
              class="imgDisplay-imgItem-wrapper"
              @click="handleClick_imgItem(index)"
            >
              <i></i>
              <img :src="item" />
            </span>
          </div>
        </div>

        <span v-else  class="empty-text">暂无图片</span>
      </div>
      <i
        id="arrowR"
        @click="handleClick_arrow('right')"
        class="imgDisplay-arrow imgDisplay-arrowR  el-icon-arrow-right"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component({
  components: {
    //ImgView: (resolve) => require(["@/controlsBak/ImgView.vue"], resolve),
  },
})
export default class MTImgDisplayCarousel extends Vue {
  @Prop({ default: ()=>[
    require("@/assets/images/temporary_photo_01.jpg"),
    require("@/assets/images/temporary_photo_02.jpg"),
    require("@/assets/images/temporary_photo_03.jpg"),
    require("@/assets/images/temporary_photo_04.jpg"),
    require("@/assets/images/temporary_photo_100x100.png")
  ] }) imgUrlArr!: any;
  /**data */
  private currentImgIndex: number = 0; //当前data
  private imgDisplayNum: number = 3; //下边展示多扫张小图片
  private imgWrapperWidth = 0; //卡片父级宽度
  private imgItemWidth = 0; //单张卡片宽度
  private imgWrapperLeftIndex = 0; //当前图片向左移动几张图片的距离index
  /**
   *组件加载完毕
   */
  private mounted() {
    this.initImgStyle();
  }

  /**
   *点击下边小图片
   */
  private handleClick_imgItem(index: number) {
    this.currentImgIndex = index;
  }

  /**
   *初始化样式
   */
  private initImgStyle() {
    let arrowDomRight: any = document.getElementById("arrowR");
    if(this.imgUrlArr.length < this.imgDisplayNum+1){
      arrowDomRight.classList.add("is-disabled");
    }

    let imgWraper: any = document.getElementById("imgDisplay-imgItems");
    let imgItems: any = document.getElementsByClassName(
      "imgDisplay-imgItems-wrapper"
    )[0];
    let imgItemArr: any = document.getElementsByClassName("imgDisplay-imgItem");

    //拿到图片框的宽度
    let imgWraperWidthStr: any = window.getComputedStyle(imgWraper).width;
    let imgWraperWidth = imgWraperWidthStr.substr(
      0,
      imgWraperWidthStr.length - 2
    );

    //设置所有卡片的总宽度
    this.imgItemWidth = imgWraperWidth * 0.33333333;
    this.imgWrapperWidth = this.imgItemWidth * this.imgUrlArr.length;
    imgItems.style.width = this.imgWrapperWidth + "px";

    //设置单张卡片宽度
    for (let i = 0; i < imgItemArr.length; i++) {
      imgItemArr[i].style.width = this.imgItemWidth + "px";
    }
  }

  /**
   *点击箭头
   */
  private handleClick_arrow(arrowType: string) {
    let imgItems: any = document.getElementsByClassName(
      "imgDisplay-imgItems-wrapper"
    )[0];
    let arrowDomLeft: any = document.getElementById("arrowL");
    let arrowDomRight: any = document.getElementById("arrowR");
    if (arrowType == "left") {
      if(this.imgUrlArr.length > this.imgDisplayNum){
        arrowDomRight.classList.remove("is-disabled");
      }
      

      if (this.imgWrapperLeftIndex > 0) {
        if(this.imgWrapperLeftIndex + 2 == this.currentImgIndex){
          this.currentImgIndex--;
        }
        this.imgWrapperLeftIndex -= 1;
        imgItems.style.left =
          -this.imgWrapperLeftIndex * this.imgItemWidth + "px";
        if (this.imgWrapperLeftIndex == 0) {
          arrowDomLeft.classList.add("is-disabled");
        }
        
      } else {
        return false;
      }
    }

    if (arrowType == "right") {
      if(this.imgUrlArr.length > this.imgDisplayNum){
        arrowDomLeft.classList.remove("is-disabled");
      }
      if (this.imgWrapperLeftIndex < this.imgUrlArr.length - 3) {
        if(this.imgWrapperLeftIndex == this.currentImgIndex){
          this.currentImgIndex++;
        }
        this.imgWrapperLeftIndex += 1;
        imgItems.style.left =
          -this.imgWrapperLeftIndex * this.imgItemWidth + "px";
        if (this.imgWrapperLeftIndex == this.imgUrlArr.length - 3) {
          arrowDomRight.classList.add("is-disabled");
        }

        
      } else {
        return false;
      }
    }
  }
}
</script>
<style scoped lang="scss">
.imgDisplayCarousel-template {
  width: 440px;
  height: 400px;


  .imgDisplay-bigImg {
    height: 260px;
    width: 100%;
    border-radius: 10px;
    & > img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
  }
  .imgDisplay-imgList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(100% - 260px);
    padding: 15px 0;
    .imgDisplay-arrow {
      width: 30px;
      height: 100%;
      background-color: #d8ddf3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #6a85f1;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: rgba(#6a85f1, 0.5);
      }

      &.is-disabled {
        background-color: #eee;
        color: #fff;
        cursor: not-allowed;
      }
      &.imgDisplay-arrowL {
      }
      &.imgDisplay-arrowR {
      }
    }

    .imgDisplay-imgItems {
      height: 100%;
      width: calc(100% - 90px);
      overflow: hidden;
      position: relative;

      .imgDisplay-imgItems-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;

        .imgDisplay-imgItem {
          width: 30%;
          height: 100%;
          cursor: pointer;
          padding: 0 10px;
          transition: all 0.2s;

          .imgDisplay-imgItem-wrapper {
            transition: all 0.2s;
            display: block;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            & > img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          &.is-actrive {
            transition: all 0.2s;
            .imgDisplay-imgItem-wrapper {
              border: 1px solid #d8ddf3;
              position: relative;
              transition: all 0.2s;

              &:before {
                content: "";
                width: 10px;
                height: 10px;
                border-top: 1px solid #6a85f1;
                border-left: 1px solid #6a85f1;
                position: absolute;
                top: -1px;
                left: -1px;
              }
              &:after {
                content: "";
                width: 10px;
                height: 10px;
                border-top: 1px solid #6a85f1;
                border-right: 1px solid #6a85f1;
                position: absolute;
                top: -1px;
                right: -1px;
              }

              & > i {
                &:before {
                  content: "";
                  width: 10px;
                  height: 10px;
                  border-bottom: 1px solid #6a85f1;
                  border-left: 1px solid #6a85f1;
                  position: absolute;
                  bottom: -1px;
                  left: -1px;
                }
                &:after {
                  content: "";
                  width: 10px;
                  height: 10px;
                  border-bottom: 1px solid #6a85f1;
                  border-right: 1px solid #6a85f1;
                  position: absolute;
                  bottom: -1px;
                  right: -1px;
                }
              }
              & > img {
                width: calc(100% - 10px);
                height: calc(100% - 10px);
              }
            }
          }
        }
      }
    }
  }


  .empty-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #6a85f1;
    font-size: 16px;
    font-weight:bold;
    text-align: center;
  }
}
</style>
