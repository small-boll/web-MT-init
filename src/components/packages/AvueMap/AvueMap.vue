<template>
  <div class="avue-map">
    <el-button @click="box=true"
               class="avue-map__submit">{{textTitle}}</el-button>
    <el-dialog fullscreen
               class="avue-map__dialog"
               width="100%"
               append-to-body
               modal-append-to-body
               :title="title"
               @close="handleClose"
               :visible.sync="box">
      <div class="avue-map__content"
           v-if="box">
        <el-input class="avue-map__content-input"
                  id="map__input"
                  size="small"
                  :readonly="disabled"
                  v-model="text"
                  clearable
                  placeholder="输入关键字选取地点"></el-input>
        <div class="avue-map__content-box">
          <div id="map__container"
               class="avue-map__content-container"
               tabindex="0"></div>
          <div id="map__result"
               class="avue-map__content-result"></div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer"
            v-if="!disabled">
        <el-button type="primary"
                   @click="handleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component, Prop, Watch } from "vue-property-decorator";

  @Component({
    components: {
    }
  })
  export default class AvueMap extends Vue {
    public name: string = "AvueMap";

    @Prop({
      default: false
    })
    disabled!: boolean;

    @Prop({
      default: () => ({})
    })
    lnglat!: any;

    @Prop({
      default: () => ({})
    })
    value!: any ;

    private poi: any = {};
    private marker: any = null;
    private map: any = null;
    private text: string = "";
    private box: boolean = false;

    get title () {
      return this.disabled ? "查看坐标" : '选择坐标'
    }

    get isPR () {
      return this.R && this.P;
    }

    get P () {
      return this.lnglat.P || 0;
    }

    get R () {
      return this.lnglat.R || 0;
    }

    get textTitle () {
      return this.disabled ? this.title : (this.poi.name === undefined ? "选择坐标" : "重新选择");
    }

    @Watch("box", {
      immediate: true
    })
    private watchBox() { // newVal: any, oldVal: any
      if (this.box) {
        this.$nextTick(() => {
          this.init(() => {
            if (this.isPR) {
              this.addMarker(this.R, this.P);
              this.getAddress(this.R, this.P);
            }
          })
        });
      }
    }

    //新增坐标
    addMarker (R: any, P: any) {
      this.clearMarker();
      this.marker = new window.AMap.Marker({
        position: [R, P]
      });
      this.marker.setMap(this.map);
    }

    //清空坐标
    clearMarker () {
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
    }

    //获取坐标
    getAddress (R: any, P: any) {
      new window.AMap.service("AMap.Geocoder", () => {
        //回调函数
        let geocoder = new window.AMap.Geocoder({});
        geocoder.getAddress([R, P], (status: any, result: any) => {
          if (status === "complete" && result.info === "OK") {
            const regeocode = result.regeocode;
            this.poi = Object.assign(regeocode, {
              longitude: R,
              latitude: P
            });
            this.text = regeocode.formattedAddress;
            // 自定义点标记内容
            var markerContent = document.createElement("div");

            // 点标记中的图标
            var markerImg = document.createElement("img");
            markerImg.src =
              "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";
            markerContent.appendChild(markerImg);

            // 点标记中的文本
            var markerSpan = document.createElement("span");
            markerSpan.className = "avue-map__marker";
            markerSpan.innerHTML = this.text;
            markerContent.appendChild(markerSpan);
            this.marker.setContent(markerContent); //更新点标记内容
          }
        });
      });
    }

    handleClose () {
      this.text = "";
      window.poiPicker.clearSearchResults();
      this.poi = {};
    }

    handleSubmit () {
      this.$emit("input", this.poi);
      this.poi = {};
      this.box = false;
    }

    addClick () {
      this.map.on("click", (e: any) => {
        const lnglat = e.lnglat;
        const P = lnglat.P;
        const R = lnglat.R;
        this.addMarker(R, P);
        this.getAddress(R, P);
      });
    }

    init (callback: any) {
      this.map = new window.AMap.Map("map__container", {
        zoom: 13,
        center: (() => {
          if (this.isPR) {
            return [this.R, this.P];
          }
        })()
      });
      this.initPoip();
      this.addClick();
      callback();
    }

    initPoip () {
      window.AMapUI.loadUI(["misc/PoiPicker"], (PoiPicker: any) => {
        var poiPicker = new PoiPicker({
          input: "map__input",
          placeSearchOptions: {
            map: this.map,
            pageSize: 10
          },
          searchResultsContainer: "map__result"
        });
        //初始化poiPicker
        this.poiPickerReady(poiPicker);
      });
    }

    poiPickerReady (poiPicker: any) {
      window.poiPicker = poiPicker;
      //选取了某个POI
      poiPicker.on("poiPicked", (poiResult: any) => {
        this.clearMarker();
        var source = poiResult.source,
          poi = poiResult.item;
        this.text = poi.name;
        this.poi = poi;
        if (source !== "search") {
          poiPicker.searchByKeyword(poi.name);
        }
      });
    }

  };
</script>

<style lang="scss">
  .amap-icon img,
  .amap-marker-content img {
    width: 25px;
    height: 34px;
  }
  .avue-map {
    &__submit {
      width: 100%;
    }
    &__marker {
      position: absolute;
      top: -20px;
      right: -118px;
      color: #fff;
      padding: 4px 10px;
      box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
      white-space: nowrap;
      font-size: 12px;
      font-family: "";
      background-color: #25a5f7;
      border-radius: 3px;
    }
    &__content {
      &-input {
        margin-bottom: 10px;
      }
      &-box {
        position: relative;
      }
      &-container {
        width: 100%;
        height: 450px;
      }
      &-result {
        display: block !important;
        position: absolute;
        top: 0;
        right: -8px;
        width: 250px;
        height: 450px;
        overflow-y: auto;
      }
    }
  }
</style>
