<!--地图-第一课-显示open street map地图-->
<template>
  <div class="MapIndex1-template">
    要开始认真的学习地图！！！
    step1:安转openlayers依赖 npm install ol (推荐6.3.1版本 )
    step2:全局引用ol ，在main.js中引入 import 'ol/ol.css'
    <div id="mapDiv"
         class="map-div"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileGrid from "ol/tilegrid/TileGrid";
import VectorLayer from "ol/layer/Vector";

import { OSM } from "ol/source";
import XYZ from "ol/source/XYZ";
import TileArcGISRest from "ol/source/TileArcGISRest";

import { fromLonLat } from "ol/proj";
import axios from "axios";

@Component({})
export default class MapIndex1 extends Vue {
  //矢量数据请求地址
  private url: string = "/map-api/arcgis/rest/services/whmap/MapServer?f=json";

  //地图对象
  private olMap: any = null;

  //底图图层对象
  private olLayers: any = [];

  //单个图层对象
  private olLayer: any = null;

  //视图对象
  private OLView: any = null;

  //底图信息（个人理解）
  private tiled: any = null;

  mounted() {
    this.init();
  }

  private async init() {
    this.olLayer = new TileLayer({
      source: new OSM(),
    });
    this.OLView = new View({
      // projection: "EPSG:4326", //wgs84坐标系,(地图的一种坐标系)<个人理解：使用open street map地图源时  使用wgs84坐标+center:[]经纬度坐标 可定位到预期的位置>
      // center:[114.37524819351535, 30.576546015969555],

      //projection: "EPSG:4326",+center:[114.37524819351535, 30.576546015969555],效果等同于center: fromLonLat([114.37524819351535, 30.576546015969555]),

      center: fromLonLat([114.37524819351535, 30.576546015969555]), //<个人理解：使用open street map地图源时 center:fromLonlat([经度，纬度])可定位到预期的位置>

      // center: [0,0], // 定义地图显示中心于经度0度，纬度0度处

      zoom: 6, // 并且定义地图缩放层级为2
    });
    this.olLayers.push(this.olLayer);

    this.olMap = new Map({
      // 设置地图图层
      layers: this.olLayers,
      // [
      /*layers: []数组 用于定义地图中可用的图层列表,多个图层可以叠加，最上面的会覆盖下面的。
        主要有 热度图层(heatmaplayer)、图片图层(imagelayer)、切片图层(tilelayer) 和 矢量图层(vectorlayer)*/
      // new TileLayer({
      //   source: new OSM(), //创建一个使用open street map地图源的瓦片图层
      //替换成矢量切片
      //   // source:new XYZ({//尝试中 未成功
      //   //   url:"/map-api/arcgis/rest/services/whmap/MapServer?f=json",
      //   // })
      // }),
      // ],

      // 设置显示地图的视图,视图允许指定地图的中心，分辨率和旋转。
      view: this.OLView,

      // 让id为mapDiv的div作为地图的容器,target指定地图在页面中具体哪个位置进行显示
      target: "mapDiv",
    });

    //创建一个新的图层
    // let lMap = new TileLayer({
    //   name: "天地图影像注记图层",
    //   source: new XYZ({
    //     url: "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=5d27dc75ca0c3bdf34f657ffe1e9881d", //parent.TiandituKey()为天地图密钥
    //     wrapX: false,
    //   }),
    // });

    // map.addLayer(lMap);//添加图层
  }

  //从服务器端获取geoJson数据 渲染上界面（暂时未成功）
  private getdituData() {
    axios
      .get(this.url)
      .then((res) => {
        console.log(res, "请求的矢量数据");
        //接口返回的数据结构如./mapDitu.json文件
        //获取接口的服务数据之后组装新的底图 图层所需要的数据结构tiled
        let array: number[] = [];
        let minZoom = 0;
        let maxZoom = 0;
        for (let index = 0; index < res.data.tileInfo.lods.length; index++) {
          const lod = res.data.tileInfo.lods[index];
          array.push(lod.resolution);
          if (lod.scale == res.data.minScale) {
            minZoom = index;
          }
          if (lod.scale == res.data.maxScale) {
            maxZoom = index;
          }
        }

        //底图信息赋值
        this.tiled = {
          extent: [
            res.data.fullExtent.xmin,
            res.data.fullExtent.ymin,
            res.data.fullExtent.xmax,
            res.data.fullExtent.ymax,
          ],
          origin: [res.data.tileInfo.origin.x, res.data.tileInfo.origin.y],
          projection:
            "EPSG:" +
            (res.data.spatialReference.wkid == 4490
              ? 4326
              : res.data.spatialReference.wkid),
          resolutions: array,
          minZoom: minZoom,
          maxZoom: maxZoom <= 0 ? array.length - 1 : maxZoom,
        };
        console.log(this.tiled, "这是this.tiled");

        debugger;
        //底图新对象
        let titleGrid = new TileGrid({
          titleSize: 256,
          origin: this.tiled.origin,
          resolutions: this.tiled.resolutions,
          extent: this.tiled.extent,
        });
        this.olLayer.setExtent(this.tiled.extent);
        this.olLayer.setSource(
          new XYZ({
            titleGrid: titleGrid,
            projection: this.olLayer.projection,
            url: this.url + "/title/{z}/{y}/{x}",
          })
        );

        console.log(this.olLayer, "this.olLayer");
        this.updateTiledInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  private updateTiledInfo() {
    let center = this.OLView.getCenter();
    let zoom = this.OLView.getZoom();
    let resolutions = this.OLView.getResolutions();

    this.OLView = new View({
      resolutions: resolutions,
      center: center,
      centerStyle: {},
      projection: this.tiled.projection,
      zoom: zoom,
      minZoom: this.tiled.minZoom,
      maxZoom: this.tiled.maxZoom,
    });
    console.log(this.OLView, "this.view");
    debugger;
    this.olMap.setView(this.OLView);
  }
}
</script>

<style lang="scss">
.MapIndex1-template {
  height: 100%;
  width: 100%;
  margin: auto;
  .map-div {
    width: 50%;
    height: 70%;
    background-color: aquamarine;
  }
}
</style>