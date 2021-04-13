<template>
  <div id="mapDiv" style="width:100%; height:100%"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

import { baseMap } from "./map/baseMap";
import { arcgisMap } from "./map/arcgis/arcgisMap";
import { openlayersMap } from "./map/openlayers/openlayersMap";

const { loadmapScript } = require("../assets/js/loadmapScript.js");

@Component({})
export default class MTMapComponent extends Vue {
  ///地图参数
  @Prop({
    default: () => ({
      scriptUrl: "",
      cssUrl: "",
      serverUrl: "",
      wiki: "EPSG:4326",
      origin: [],
      extent: [],
      resolutions: [],
      matrixIds: [],
      center: [],
      zoom: 7,
      layerName: "",
      mapType: 1,
    }),
  })
  mapParameter!: any;

  //地图对象
  private baseMap: any = null;

  mounted() {
    this.init();
  }

  /**
   * @description: 初始化对象
   * @param {type}
   * @return:
   */
  private init() {
    this.baseMap = new openlayersMap(this.mapParameter);

    //this.baseMap.initPointAndZoom(114.4188, 30.6087, 11);
  }
  /**
   * @description:初始化位置
   * @param {type}
   * @return:
   */
  private initPosition(lon: number, lat: number) {
    this.baseMap.initPosition(lon, lat);
  }
  /**
   * @description:定位位置
   * @param {type}
   * @return:
   */
  private locationPosition(
    name: string,
    lon: number,
    lat: number,
    url: any,
    attribute: any = null
  ) {
    this.baseMap.locationPosition(name, lon, lat, url, attribute);
  }
  /**
   * @description: 清空定位图层
   * @param {type}
   * @return:
   */
  public clearLactionLayer(name: string) {
    this.baseMap.clearLactionLayer(name);
  }

  /**
   * @description: 清空所有定位图层
   * @param {type}
   * @return:
   */
  public clearAllLactionLayer() {
    this.baseMap.clearAllLactionLayer();
  }

  /**
   * @description: 长度测量
   * @param {type}
   * @return:
   */
  public distanceMeasure() {
    this.baseMap.distanceMeasure();
  }
  /**
   * @description: 面积测量
   * @param {type}
   * @return:
   */
  public areaMeasure() {
    this.baseMap.areaMeasure();
  }
  /**
   * @description: 点拾取坐标
   * @param {type}
   * @return:
   */
  public pointMeasure() {
    this.baseMap.pointMeasure();
  }

  public clearMap() {
    this.baseMap.clearMap();
  }
  /**
   * @description: 初始化图层
   * @param {type}
   * @return:
   */
  public initClusterLayer(
    option: any,
    callbackfunc: any,
    features: any,
    clusterMaxZoom: number = -1
  ) {
    this.baseMap.initClusterLayer(
      option,
      callbackfunc,
      features,
      clusterMaxZoom
    );
  }
  /**
   * @description: 设置弹出框的元素
   * @param {type}
   * @return:
   */
  public setPopupElement(name: string, div: any) {
    this.baseMap.setPopupElement(name, div);
  }
  /**
   * @description:   设置图层显示与隐藏
   * @param {type}
   * @return:
   */
  public setLayerVisible(name: string, visible: boolean) {
    this.baseMap.setLayerVisible(name, visible);
  }
  /**
   * @description: 删除图层
   * @param {type}
   * @return:
   */
  public removeLayer(name: string) {
    this.baseMap.setLayerVisible(name);
  }
  /**
   * @description: 删除所有图层
   * @param {type}
   * @return:
   */
  public removeAllLayers() {
    this.baseMap.removeAllLayers();
  }

  /**
   * @description: 放大
   * @param {type}
   * @return:
   */
  public ZoomIn() {
    this.baseMap.ZoomIn();
  }
  /**
   * @description: 缩小
   * @param {type}
   * @return:
   */
  public ZoomOut() {
    this.baseMap.ZoomOut();
  }
  /**
   * @description: 平移
   * @param {type}
   * @return:
   */
  public Pan() {
    this.baseMap.Pan();
  }
  /**
   * @description: 圆选
   * @param {type}
   * @return:
   */
  public circleSelect(callbackFuc: any, isWfs: boolean = false) {
    this.baseMap.circleSelect(callbackFuc, isWfs);
  }
  /**
   * @description: 矩形选
   * @param {type}
   * @return:
   */
  public rectangleSelect(callbackFuc: any, isWfs: boolean = false) {
    this.baseMap.rectangleSelect(callbackFuc, isWfs);
  }
  /**
   * @description: 多边形选
   * @param {type}
   * @return:
   */
  public polygonSelect(callbackFuc: any, isWfs: boolean = false) {
    this.baseMap.polygonSelect(callbackFuc, isWfs);
  }
  /**
   * @description: 自由选
   * @param {type}
   * @return:
   */
  public freehandSelect(callbackFuc: any, isWfs: boolean = false) {
    this.baseMap.freehandSelect(callbackFuc, isWfs);
  }
  /**
   * @description:画轨迹
   * @param {type}
   * @return:
   */
  public drawLocus(
    arrayVertex: any,
    callbackFuc: any,
    width: number = 0,
    color: string = ""
  ) {
    this.baseMap.drawLocus(arrayVertex, callbackFuc, width, color);
  }
  /**
   * @description: 播放轨迹
   * @param {type}
   * @return:
   */
  public lotusStart() {
    this.baseMap.lotusStart();
  }
  /**
   * @description: 暂停轨迹
   * @param {type}
   * @return:
   */
  public lotusSuepend() {
    this.baseMap.lotusSuepend();
  }
  /**
   * @description: 停止轨迹
   * @param {type}
   * @return:
   */
  public lotusStop() {
    this.baseMap.lotusStop();
  }
  /**
   * @description: 清空轨迹
   * @param {type}
   * @return:
   */
  public clearLotus() {
    this.baseMap.clearLotus();
  }
  /**
   * @description: 添加点数据到WebGL中
   * @param {type}
   * @return:
   */
  public addPoints_gl(points: any, src: any) {
    this.baseMap.addPoints_gl(points, src);
  }
  /**
   * @description: 清空点数据到WebGL中
   * @param {type}
   * @return:
   */
  public clearGLPointsLayer() {
    this.baseMap.clearGLPointsLayer();
  }

  /**
   * @description: 添加点数据,可以进行编辑
   * @param {type}
   * @return:
   */
  public addPoints_edit(arrayVertex: any, src: any, funcCallBack: any = null) {
    this.baseMap.addPoints_edit(arrayVertex, src, funcCallBack);
  }

  /**
   * @description: 清空编辑图层
   * @param {type}
   * @return:
   */
  public clearEditLayer() {
    this.baseMap.clearEditLayer();
  }

  /**
   * @description: 画线
   * @param {type}
   * @return:
   */
  public drawPolyline(
    arrayVertex: any,
    width: number = 0,
    color: string = "",
    funcCallBack: any = null
  ) {
    this.baseMap.drawPolyline(arrayVertex, width, color, funcCallBack);
  }

  /**
   * @description: 画面
   * @param {type}
   * @return:
   */
  public drawPolygon(
    arrayVertex: any,
    width: number = 0,
    color: string = "",
    fillcolor: string = "",
    funcCallBack: any = null
  ) {
    this.baseMap.drawPolygon(
      arrayVertex,
      width,
      color,
      fillcolor,
      funcCallBack
    );
  }

  /**
   * @description: 添加点数据
   * @param {type}
   * @return:
   */
  public drawPoints(arrayVertex: any, url: any, funcCallBack: any = null) {
    this.baseMap.drawPoints(arrayVertex, url, funcCallBack);
  }

  public clearcustomLayer(type: any) {
    this.baseMap.clearcustomLayer(type);
  }
  /**
   * @description: 添加热力图的点数据
   * @param {type}
   * @return:
   */
  public addPoints_heatMap(arrayVertex: any) {
    this.baseMap.addPoints_heatMap(arrayVertex);
  }
  public clearHeatmapLayer() {
    this.baseMap.clearHeatmapLayer();
  }

  /**
   * @description: 手动绘制点数据
   * @param {type}
   * @return:
   */
  public hand_drawPoint(handDrawCallback: any) {
    this.baseMap.hand_drawPoint(handDrawCallback);
  }

  /**
   * @description: 手动绘制点数据
   * @param {type}
   * @return:
   */
  public hand_drawPolyline(handDrawCallback: any) {
    this.baseMap.hand_drawPolyline(handDrawCallback);
  }

  /**
   * @description: 手动绘制面数据
   * @param {type}
   * @return:
   */
  public hand_drawPolygon(handDrawCallback: any) {
    this.baseMap.hand_drawPolygon(handDrawCallback);
  }

  /**
   * @description: 手动绘制点数据
   * @param {type}
   * @return:
   */
  public hand_drawCircle(handDrawCallback: any) {
    this.baseMap.hand_drawCircle(handDrawCallback);
  }

  public clearHandleLayer() {
    this.baseMap.clearHandleLayer();
  }

  /**
   * @description: 添加饼状图的数据点
   * @param {type}
   * @return:
   */
  public addChartPoints(arrayVertex: any, Callback: any, graphType: string="pie") {
    this.baseMap.addChartPoints(arrayVertex,Callback,graphType);
  }
  public clearChartLayer() {
    this.baseMap.clearChartLayer();
  }

  public beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
</style>
