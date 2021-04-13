/*
 * @Author: your name
 * @Date: 2020-06-30 16:41:16
 * @LastEditTime: 2020-07-30 16:53:16
 * @LastEditors: Please set LastEditors
 * @Description: 地图操作管理类
 * @FilePath: \mthanos\src\controls\map\openlayers\openlayersMap.ts
 */
import { baseMap } from ".././baseMap";
import { measure } from "./measure";
import { olClusterLayer } from './olClusterLayer';
import { topoDraw } from './topoDraw';
import { locationLayer } from './locationLayer';
import { trackLayer } from './trackLayer';
import { glPointsLayer } from './glPointsLayer';
import { editLayer } from './editLayer';
import { customLayers } from './customLayers';
import { heatmapLayer } from './heatmapLayer';
import { handDrawLayer } from './handDrawLayer';
import { lcollectionLayer } from './lcollectionLayer';
import { mapSource } from "./mapSource";
import { eventMap } from "./eventMap";
import { chartLayer } from "./chartLayer";

import Map from 'ol/Map';
import View from 'ol/View';

import Feature from 'ol/Feature';
import { Point, Polygon } from 'ol/geom';
import { get } from 'ol/proj';
import 'ol/ol.css';

export class openlayersMap extends baseMap {
    //GIS对象
    private spatialRef: any = null;
    private view: any = null;
    //测量类
    private measureRef: any = null;
    //空间查询类
    private topoDrawRef: any = null;
    //轨迹类
    private trackLayerRef: any = null;
    //大量点数据展示类 webgl
    private glPointsLayerRef: any = null;
    //编辑图层类
    private editLayerRef: any = null;
    //点，线，面图层类
    private customLayersRef: any = null;
    //热力图
    private heatmapLayerRef: any = null;
    //手工绘制图层
    private handDrawLayerRef: any = null;
    //图层集合预警定位管理类
    private lcollectionLayerRef: lcollectionLayer<locationLayer> = new lcollectionLayer<locationLayer>();
    //图层集合
    private clusterLayerArray: lcollectionLayer<olClusterLayer> = new lcollectionLayer<olClusterLayer>();

    private eventMapRef: any = null;
    private chartLayerRef: any = null;
    //事件集合图层响应
    private eventLayerCollection: any = [];

    constructor(mapParameter: any) {
        super(mapParameter);
        //坐标系
        this.spatialRef = get(mapParameter.wiki);
        this.initMap();
    }
    /**
     * @description: 加载地图
     * @param {type} 
     * @return: 
     */
    private initMap() {
        let layers: any = null;

        switch (this.mapParameter.mapType) {
            case 1:  //arcgis mapserver服务
                layers = mapSource.LoadArcgisMap(this.mapParameter, this.spatialRef);
                break;
            case 2:
                layers = mapSource.LoadTileWMSMap(this.mapParameter, this.spatialRef);
                break;
            case 3:
                layers = mapSource.LoadWMTSMap(this.mapParameter, this.spatialRef);
                break;
        }
        layers.push();

        this.view = new View({
            center: this.mapParameter.center,
            projection: this.spatialRef,
            zoom: this.mapParameter.zoom || 11
        });
        this.map = new Map({
            layers: layers,
            target: 'mapDiv',
            view: this.view
        });

        //绑定地图事件
        this.eventMapRef = new eventMap(this.map);
        this.eventMapRef.mouseRightCallback = this.mouseRight;
    }

    /**
     * @description: 放大
     * @param {type} 
     * @return: 
     */
    public ZoomIn() {
        let zoom = this.view.getZoom();
        this.view.setZoom(zoom + 1);
    }
    /**
   * @description: 缩小
   * @param {type} 
   * @return: 
   */
    public ZoomOut() {
        let zoom = this.view.getZoom();
        if (zoom - 1 >= 0) this.view.setZoom(zoom - 1);
    }
    /**
   * @description: 平移
   * @param {type} 
   * @return: 
   */
    public Pan() {

    }

    /**
     * @description: 右键响应菜单
     * @param {type} 
     * @return: 
     */
    public mouseRight = (e: any) => {
        //聚合类响应右键
        this.clusterLayerArray.getAll().forEach((element: any) => {
            element.layer.contextmenu(e);
        });

    }

    /**
    * 初始化地图显示位置和缩放级别
    * @param  {Double} lon 经度
    * @param {Double} lat 纬度
    * @param  {int} zoom  缩放级别整数
    * @constructor
    */
    public initPositionAndZoom(lon: number, lat: number, zoom: number) {
        this.WaitScriptFinsh().then(() => {
            console.log(' this.spatialRef this.spatialRef===>>>', this.spatialRef);
            this.view.setCenter([lon, lat]);
            this.view.setZoom(zoom);
        }
        )
    }

    /**
     * 初始化地图显示位置和缩放级别
     * @param  {Double} lon 经度
     * @param {Double} lat 纬度
     * @constructor
     */
    public initPosition(lon: number, lat: number) {
        this.WaitScriptFinsh().then(() => {
            //this.view.setCenter([lon, lat]);
            this.view.animate({ center: [lon, lat] }, { duration: 1000 })
        }
        )
    }
    /**
    * 定位预警
    * @param  {Double} lon 经度
    * @param {Double} lat 纬度
    * @constructor
    */
    public locationPosition(name: string, lon: number, lat: number, url: any, attribute: any = null) {

        let layer = this.lcollectionLayerRef.find(name);
        if (!!layer) {
            layer.locationPosition(lon, lat, url, attribute);
            this.initPosition(lon, lat);
        }
        else {
            let locationLayerRef = new locationLayer(this.map);
            this.lcollectionLayerRef.push(name, locationLayerRef)
            locationLayerRef.locationPosition(lon, lat, url, attribute);
            this.initPosition(lon, lat);
        }

    }
    /**
     * @description: 清空定位图层
     * @param {type} 
     * @return: 
     */
    public clearLactionLayer(name: string) {
        this.lcollectionLayerRef.clearLayer(name);
    }
    /**
     * @description: 清空所有定位图层
     * @param {type} 
     * @return: 
     */
    public clearAllLactionLayer() {
        this.lcollectionLayerRef.clearAll();
    }

    /**
     *距离测量
    */
    public distanceMeasure() {
        if (!this.measureRef)
            this.measureRef = new measure(this.map);
        this.measureRef.distanceMeasure();
    }

    /**
     *面积测量
     */
    public areaMeasure() {
        if (!this.measureRef)
            this.measureRef = new measure(this.map);
        this.measureRef.areaMeasure();
    }

    /**
     * @description: 获取点坐标
     * @param {type} 
     * @return: 
     */
    public pointMeasure() {
        if (!this.measureRef)
            this.measureRef = new measure(this.map);
        this.measureRef.pointMeasure();
    }
    /**
     *清空测量
     */
    public clearMeasure() {
        if (this.measureRef) this.measureRef.clearMeasure();
    }


    /**
     * @description: 创建聚合图层
     * @param {type} 
     * @return: 
     */
    public initClusterLayer(option: any, callbackfunc: any, features: any, clusterMaxZoom: number = -1) {

        var ext = this.map.getView().calculateExtent(this.map.getSize());
        for (var i = 0; i < 2000; ++i) {
            features[i] = new Feature(new Point([ext[0] + (ext[2] - ext[0]) * Math.random(), ext[1] + (ext[3] - ext[1]) * Math.random()]));
            features[i].set('id', i);
            features[i].set('name', "wwww");
            features[i].set('posiotn', 'sdfsdf');
            features[i].set('idalicese', i);
        }

        let _olClusterLayer = new olClusterLayer({
            map: this.map,
            name: option.name,
            singleSym: option.singleSym,
            jhSym: option.jhSym
        });
        _olClusterLayer.Initcallback({
            callbackClickFeature: callbackfunc
        });
        _olClusterLayer.initClusterLayer(features, clusterMaxZoom);

        this.clusterLayerArray.push(option.name, _olClusterLayer);

    }

    /**
   * @description: 设置弹出框的元素
   * @param {type} 
   * @return: 
   */
    public setPopupElement(name: string, div: any) {
        let layer = this.clusterLayerArray.find(name);
        if (!!layer) { /* 说明存在更新的警察数据  */
            layer.setPopupElement(div);
        }
    }

    /**
   * @description:   设置图层显示与隐藏
   * @param {type} 
   * @return: 
   */
    public setLayerVisible(name: string, visible: boolean) {
        let layer = this.clusterLayerArray.find(name);
        if (!!layer) { /* 说明存在更新的警察数据  */
            layer.setLayerVisible(visible);
        }
    }
    /**
     * @description: 删除图层
     * @param {type} 
     * @return: 
     */
    public removeLayer(name: string) {

        let layer = this.clusterLayerArray.find(name);
        if (!!layer) { /* 说明存在更新的警察数据  */
            this.clusterLayerArray.clearLayer(name);
        }
    }
    /**
     * @description: 删除所有图层
     * @param {type} 
     * @return: 
     */
    public removeAllLayers() {
        this.clusterLayerArray.clearAll();
    }

    /**
     * @description: 圆选
     * @param {type}
     * @return:
     */
    public circleSelect(callbackFuc: any, isWfs: boolean = false) {
        if (!this.topoDrawRef)
            this.topoDrawRef = new topoDraw(this.map, callbackFuc, isWfs);
        this.topoDrawRef.circleSelect();
    }
    /**
     * @description: 矩形选
     * @param {type}
     * @return:
     */
    public rectangleSelect(callbackFuc: any, isWfs: boolean = false) {
        if (!this.topoDrawRef)
            this.topoDrawRef = new topoDraw(this.map, callbackFuc, isWfs);
        this.topoDrawRef.rectangleSelect();
    }
    /**
     * @description: 多边形选
     * @param {type}
     * @return:
     */
    public polygonSelect(callbackFuc: any, isWfs: boolean = false) {

        if (!this.topoDrawRef)
            this.topoDrawRef = new topoDraw(this.map, callbackFuc, isWfs);
        this.topoDrawRef.polygonSelect();
    }

    /**
     * @description: 自由选
     * @param {type}
     * @return:
     */
    public freehandSelect(callbackFuc: any, isWfs: boolean = false) {

        if (!this.topoDrawRef)
            this.topoDrawRef = new topoDraw(this.map, callbackFuc, isWfs);
        this.topoDrawRef.freehandSelect();
    }
    /**
     * @description: 清空选择
     * @param {type} 
     * @return: 
     */
    public clearSelect() {
        if (this.topoDrawRef) this.topoDrawRef.closeDraw();
    }

    /**
     * @description:画轨迹
     * @param {type}
     * @return:
     */
    public drawLocus(arrayVertex: any, callbackFuc: any, width: number = 0, color: string = "") {
        var ext = this.map.getView().calculateExtent(this.map.getSize());
        for (var i = 0; i < 3; ++i) {
            arrayVertex.push({
                lon: ext[0] + (ext[2] - ext[0]) * Math.random(),
                lat: ext[1] + (ext[3] - ext[1]) * Math.random(),
                name: "sfsdfsdf"
            })
        }
        if (!this.trackLayerRef)
            this.trackLayerRef = new trackLayer(this.map, callbackFuc);
        this.trackLayerRef.drawLocus(arrayVertex);


        // arrayVertex = [];
        // for (var i = 0; i < 80; ++i) {
        //     arrayVertex.push({
        //         lon: ext[0] + (ext[2] - ext[0]) * Math.random(),
        //         lat: ext[1] + (ext[3] - ext[1]) * Math.random(),
        //         name: "sfsdfsdf"
        //     })
        // }
        // this.trackLayerRef.drawLocus(arrayVertex);
    }

    /**
   * @description: 播放轨迹
   * @param {type}
   * @return:
   */
    public lotusStart() {
        if (this.trackLayerRef) this.trackLayerRef.lotusStart();
    }
    /**
     * @description: 暂停轨迹
     * @param {type}
     * @return:
     */
    public lotusSuepend() {
        if (this.trackLayerRef) this.trackLayerRef.lotusSuepend();
    }
    /**
     * @description: 停止轨迹
     * @param {type}
     * @return:
     */
    public lotusStop() {
        if (this.trackLayerRef) this.trackLayerRef.lotusStop();
    }
    /**
     * @description: 清空轨迹
     * @param {type} 
     * @return: 
     */
    public clearLotus() {
        if (this.trackLayerRef) this.trackLayerRef.clearTrackLayer();
    }


    /**
  * @description: 添加点数据到WebGL中
  * @param {type} 
  * @return: 
  */
    public addPoints_gl(points: any, src: any) {
        if (!this.glPointsLayerRef)
            this.glPointsLayerRef = new glPointsLayer(this.map, src);

        this.glPointsLayerRef.clear_gl();

        this.glPointsLayerRef.addPoints_gl(points);
    }

    public clearGLPointsLayer() {
        if (this.glPointsLayerRef) this.glPointsLayerRef.clear_gl();
    }

    /**
    * @description: 添加点数据,可以进行编辑
    * @param {type} 
    * @return: 
    */
    public addPoints_edit(arrayVertex: any, src: any, funcCallBack: any = null) {

        if (!this.editLayerRef)
            this.editLayerRef = new editLayer(this.map, src, funcCallBack);
        var ext = this.map.getView().calculateExtent(this.map.getSize());
        for (var i = 0; i < 3; ++i) {
            arrayVertex.push({
                lon: ext[0] + (ext[2] - ext[0]) * Math.random(),
                lat: ext[1] + (ext[3] - ext[1]) * Math.random(),
                name: "sfsdfsdf" + i.toString()
            })
        }
        this.editLayerRef.addPoints_edit(arrayVertex);
    }
    /**
     * @description: 清空编辑图层
     * @param {type} 
     * @return: 
     */
    public clearEditLayer() {
        if (this.editLayerRef) this.editLayerRef.clear();
    }

    /**
     * @description: 画线
     * @param {type} 
     * @return: 
     */
    public drawPolyline(arrayVertex: any, width: number = 0, color: string = "", funcCallBack: any = null) {
        if (!this.customLayersRef)
            this.customLayersRef = new customLayers(this.map, funcCallBack);

        this.customLayersRef.drawPolyline(arrayVertex, width, color);
    }

    /**
   * @description: 画面
   * @param {type} 
   * @return: 
   */
    public drawPolygon(arrayVertex: any, width: number = 0, color: string = "", fillcolor: string = "", funcCallBack: any = null) {
        if (!this.customLayersRef)
            this.customLayersRef = new customLayers(this.map, funcCallBack);

        this.customLayersRef.drawPolygon(arrayVertex, width, color, fillcolor);
    }

    /**
    * @description: 添加点数据
    * @param {type} 
    * @return: 
    */
    public drawPoints(arrayVertex: any, url: any, funcCallBack: any = null) {
        if (!this.customLayersRef)
            this.customLayersRef = new customLayers(this.map, funcCallBack);

        this.customLayersRef.drawPoints(arrayVertex, url);
    }

    public clearcustomLayer(type: any) {
        if (this.customLayersRef) this.customLayersRef.clear(type);
    }

    /**
     * @description: 添加热力图的点数据
     * @param {type} 
     * @return: 
     */
    public addPoints_heatMap(arrayVertex: any) {
        if (!this.heatmapLayerRef)
            this.heatmapLayerRef = new heatmapLayer(this.map);

        this.heatmapLayerRef.addPoints_heatMap(arrayVertex);
    }

    public clearHeatmapLayer() {
        if (this.heatmapLayerRef) this.heatmapLayerRef.clear();
    }
    /**
     * @description: 清空地图
     * @param {type} 
     * @return: 
     */
    public clearMap() {
        this.clearMeasure();
        this.clearSelect();
        this.clearAllLactionLayer();
        this.clearLotus();
    }

    /**
  * @description: 手动绘制点数据
  * @param {type} 
  * @return: 
  */
    public hand_drawPoint(handDrawCallback: any) {
        if (!this.handDrawLayerRef)
            this.handDrawLayerRef = new handDrawLayer(this.map, handDrawCallback);
        this.handDrawLayerRef.hand_drawPoint();
    }

    /**
    * @description: 手动绘制点数据
    * @param {type} 
    * @return: 
    */
    public hand_drawPolyline(handDrawCallback: any) {
        if (!this.handDrawLayerRef)
            this.handDrawLayerRef = new handDrawLayer(this.map, handDrawCallback);
        this.handDrawLayerRef.hand_drawPolyline();

    }


    /**
     * @description: 手动绘制面数据
     * @param {type} 
     * @return: 
     */
    public hand_drawPolygon(handDrawCallback: any) {
        if (!this.handDrawLayerRef)
            this.handDrawLayerRef = new handDrawLayer(this.map, handDrawCallback);
        this.handDrawLayerRef.hand_drawPolygon();
    }


    /**
   * @description: 手动绘制点数据
   * @param {type} 
   * @return: 
   */
    public hand_drawCircle(hand_drawCallback: any) {
        if (!this.handDrawLayerRef)
            this.handDrawLayerRef = new handDrawLayer(this.map, hand_drawCallback);
        this.handDrawLayerRef.hand_drawCircle();
    }

    public clearHandleLayer() {
        if (this.handDrawLayerRef) this.handDrawLayerRef.clear();
    }

    /**
    * @description: 添加饼状图的数据点
    * @param {type} 
    * @return: 
    */
    public addChartPoints(arrayVertex: any, Callback: any, graphType: string="pie") {
        if (!this.chartLayerRef)
            this.chartLayerRef = new chartLayer(this.map, Callback);

            //test
        var ext = this.map.getView().calculateExtent(this.map.getSize());
        var features = [];
        for (var i = 0; i < 50; ++i) {
            let  n, nb = 0;
            let data:any = [];
            for (var k = 0; k < 4; k++) {
                n = Math.round(8 * Math.random());
                data.push(n);
                nb += n;
            }
            arrayVertex.push({
                lon:ext[0]+(ext[2]-ext[0])*Math.random(),
                lat:ext[1]+(ext[3]-ext[1])*Math.random(),
                data: data,
                nb: nb
            })

        }

        this.chartLayerRef.addChartPoints(arrayVertex,graphType);
    }
    public clearChartLayer() {
        if (this.chartLayerRef) this.chartLayerRef.clear();
    }

}