/*
 * @Author: your name
 * @Date: 2020-05-20 09:31:18
 * @LastEditTime: 2020-07-01 16:02:39
 * @LastEditors: Please set LastEditors
 * @Description: Arcgis处理类
 * @FilePath: \mapComponent\src\map\core\arcgis\arcgisMap.ts
 */

import { baseMap } from ".././baseMap"
import { ClusterLayer } from "./ClusterLayer"
import { layerManager } from "./layerManager"
import { loadModules } from 'esri-loader'

export class arcgisMap  {

    private gisModules: any = [
        'esri/map',
        "dojo/number",
        'dojo/_base/array',
        'dojo/_base/lang',
        'dojo/on',
        'dojo/promise/all',
        "esri/Color",
        "esri/units",
        'esri/layers/ArcGISTiledMapServiceLayer',
        "esri/layers/GraphicsLayer",
        "esri/SpatialReference",
        "esri/graphic",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/geometry/Extent",
        "esri/geometry/Point",
        "esri/geometry/Circle",
        "esri/dijit/Measurement",
        "esri/symbols/Font",
        "esri/renderers/ClassBreaksRenderer",
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        "esri/symbols/PictureMarkerSymbol",
        "esri/dijit/PopupTemplate",
        "esri/symbols/TextSymbol",
        'dojo/domReady!'
    ];

    private gisConstructor: any = {}; //gis 构造函数
    private layerManager: any = new layerManager();

    //GIS对象
    private spatialRef: any = null;
    private wiki: number = 4326;
    private measureToolbar: any = null;
    public map:any =null;
        // 地图库对象
        public option: any = null;
        // 地图服务对象
        public serverUrl: string = "";

    //功能实现对象//
    private measureResultGraphic: any = null;      //测量结果标注

    constructor(option: any, wiki: number, serverUrl: string) {
       // super(option);
        this.wiki = wiki;
      //  this.serverUrl = serverUrl;
        this.loadModules();
    }
    /**
     * @description: 加载GIS库对象
     * @param {type} 
     * @return: 
     */
    private loadModules() {
        loadModules(this.gisModules, this.option).then((args: any) => {
            for (let k in args) {
                let name = this.gisModules[k].split('/').pop();
                this.gisConstructor[name] = args[k];
            }
            console.log('this.gisConstructor=============>>>>>>>>>>>>', this.gisConstructor);
            //聚合对象
            let self = this;
            console.log('tag', this.gisConstructor.GraphicsLayer);
            // @ts-ignore
            dojo.declare('ClusterFeatureLayer', this.gisConstructor.GraphicsLayer, {
                constructor(option: any) {
                    this.ClusterLayer = new ClusterLayer(option, self.gisConstructor, self.wiki, this);
                },
                //聚合图层加入地图中
                addMap:function(){
                    self.map.addLayer(this);
                },
                setClusterSymbol(jh_imagesurl: string, imagesurl: string, width: number, height: number){
                    this.ClusterLayer.setClusterSymbol(jh_imagesurl, imagesurl, width, height);
                },
                setData(data: any) {
                    this.ClusterLayer.setData(data);
                },
                _getDefaultSymbol(g: any) {
                    this.ClusterLayer._getDefaultSymbol(g);
                },
                _getRenderedSymbol(feature: any) {
                    this.ClusterLayer._getRenderedSymbol(feature);
                },
                _reCluster() {
                    debugger;
                    this.ClusterLayer._reCluster();
                },
                _setMap(map: any, surface: any){
                    debugger;
          

                    var div = this.inherited(arguments);
                    var super222 = this.getInherited;
                    super222.apply(this, arguments);
                    //var inherited = this.getInherited;
                    //inherited.apply(this,arguments);
                     self.gisConstructor.GraphicsLayer._setMap.apply(this,arguments);
                    //var div = this.postCreate(this.inherited);
                    this.ClusterLayer._setMap(map, surface);
                    //var div = this.inherited(arguments);
                    //return div;
                },
                postCreate(method:any) {
                    debugger;
                    var slice = Array.prototype.slice;
                    var proxy:any;
                    let self = this;
                    proxy = function () {
                        debugger;
                        var me = self;
                        var inherited = (self.getInherited && self.getInherited({
                            // emulating empty arguments
                            callee: proxy,
                            length: 0
                        })) || function () {};
            
                        return method.apply(me, [function () {
                            return inherited.apply(me, arguments);
                        }].concat(slice.apply(arguments)));
                    };
            
                    proxy.method = method;
                    proxy.overrides = true;
            
                    return proxy;
                },
                _unsetMap() {
                    this.ClusterLayer._unsetMap();
                },
                _onClusterClick(e: any) {
                    this.ClusterLayer._onClusterClick(e);
                },
                _getObjectIds(extent: any) {
                    this.ClusterLayer._getObjectIds(extent);
                },
                _onIdsReturned(results: any) {
                    this.ClusterLayer._onIdsReturned(results);
                },
                _inExtent() {
                    this.ClusterLayer._inExtent();
                },
                _onFeaturesReturned(results: any) {
                    this.ClusterLayer._onFeaturesReturned(results);
                },
                // public ClusterLayer methods
                updateClusters() {
                    this.ClusterLayer.updateClusters();
                },
                clearCache() {
                    // Summary: Clears the cache for clustered items
                    this.ClusterLayer.clearCache();
                },
                add(p: any) {
                    this.ClusterLayer.add(p);
                },
                clear() {
                    // Summary:  Remove all clusters and data points.
                    this.ClusterLayer.clear();
                },
                clearSingles(singles: any) {
                    // Summary:  Remove graphics that represent individual data points.
                    this.ClusterLayer.clearSingles(singles);
                },
                onClick(e: any) {

                    this.ClusterLayer.onClick(e);
                },
                //   // internal methods
                _clusterGraphics() {
                    this.ClusterLayer._clusterGraphics();
                },
                _clusterTest(p: any, cluster: any) {
                    this.ClusterLayer._clusterTest(p, cluster);
                },
                //   // points passed to clusterAddPoint should be included
                //   // in an existing cluster
                //   // also give the point an attribute called clusterId
                //   // that corresponds to its cluster
                _clusterAddPoint(feature: any, p: any, cluster: any) {
                    // average in the new point to the cluster geometry
                    this.ClusterLayer._clusterAddPoint(feature, p, cluster);
                },
                //   // point passed to clusterCreate isn't within the
                //   // clustering distance specified for the layer so
                //   // create a new cluster for it
                _clusterCreate(feature: any, p: any) {
                    this.ClusterLayer._clusterCreate(feature, p);

                },
                _showAllClusters() {
                    this.ClusterLayer._showAllClusters();
                },
                _showCluster(c: any) {
                    this.ClusterLayer._showCluster();
                },
                _addSingles(singles: any) {
                    this.ClusterLayer._addSingles(singles);
                },
                _updateClusterGeometry(c: any) {
                    this.ClusterLayer._updateClusterGeometry(c);
                },
                _updateLabel(c: any) {
                    this.ClusterLayer._updateLabel(c);
                },
                _clusterMeta() {
                    // print total number of features
                    this.ClusterLayer._clusterMeta();
                },
                //更新对象的状态
                _updateOnlineStatus(featureArray: any) {
                    this.ClusterLayer._updateOnlineStatus(featureArray);
                },
                _queryGraphic(geometry: any, selectedGraphics: any) {
                    this.ClusterLayer._queryGraphic(geometry, selectedGraphics);
                }
            });
        }).then(() => {
            this.spatialRef = new this.gisConstructor.SpatialReference(this.wiki);

            this.map = new this.gisConstructor.map("mapDiv", {
                logo: false,
                showLabels: true,
                spatialReference: this.spatialRef,
                slider: false,
                isDoubleClickZoom: false,
            });

            //加载底图
            if (!!this.serverUrl) this.map.addLayer(new this.gisConstructor.ArcGISTiledMapServiceLayer(this.serverUrl));

            //初始化测量工具栏
            this.measureToolbar = new this.gisConstructor.Measurement({
                map: this.map,
                defaultAreaUnit: this.gisConstructor.units.SQUARE_MILES,
                defaultLengthUnit: this.gisConstructor.units.KILOMETERS,
                pointSymbol: new this.gisConstructor.SimpleMarkerSymbol(this.gisConstructor.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new this.gisConstructor.SimpleLineSymbol(this.gisConstructor.SimpleLineSymbol.STYLE_SOLID, new this.gisConstructor.Color([255, 0, 0]), 1), new this.gisConstructor.Color([0, 255, 0, 0.25])),
                lineSymbol: new this.gisConstructor.SimpleLineSymbol(this.gisConstructor.SimpleLineSymbol.STYLE_SOLID, new this.gisConstructor.Color([255, 0, 0, 0.8]), 2),
                fillSymbol: new this.gisConstructor.SimpleFillSymbol(this.gisConstructor.SimpleFillSymbol.STYLE_SOLID, new this.gisConstructor.SimpleLineSymbol(this.gisConstructor.SimpleLineSymbol.STYLE_SOLID, new this.gisConstructor.Color([255, 0, 0]), 2), new this.gisConstructor.Color([255, 255, 0, 0.5]))
            }, null);

            //测量操作开始事件
            this.measureToolbar.on("measure-start", this.measureStartEventHandler);

            //测量操作结束事件
            this.measureToolbar.on("measure-end", this.measureEndEventHandler);

            this.measureToolbar.startup();

            this.map.on("load", this.mapOnLoadEventHandler);

            ////////////////////////////////////////////////////////////////////
        }).catch((err: any) => {
            console.log(err)
        })
    }
    /**
     * @description: 生产聚合类
     * @param {type} 
     * @return: 
     */
    public initClusterLayer(layerName: string, singleSymbolName: string) {
        this.layerManager.initClusterLayer(layerName, singleSymbolName);

    }

    /**
    * @description: 初始化人脸，wifi等图层
    * @param {type} 
    * @return: 
    */
    public initBasicsLayers() {
        this.layerManager.initBasicsLayers();
    }
    public setvideoLayerData(data: any) {
        this.layerManager.setvideoLayerData(data);
    }
    public setfaceLayerData(data: any) {
        this.layerManager.setfaceLayerData(data);
    }
    public setwifiLayerData(data: any) {
        this.layerManager.setwifiLayerData(data);
    }
    public setcarLayerData(data: any) {
        this.layerManager.setcarLayerData(data);
    }
    public WaitScriptFinsh() {
        return new Promise(resolve => {});
    }
    /**
    * 初始化地图显示位置和缩放级别
    * @param  {Double} lon 经度
    * @param {Double} lat 纬度
    * @param  {int} zoom  缩放级别整数
    * @constructor
    */
    public initPointAndZoom(lon: number, lat: number, zoom: number) {
        this.WaitScriptFinsh().then(() => {
            console.log(' this.spatialRef this.spatialRef===>>>', this.spatialRef);
            this.map.centerAndZoom(new this.gisConstructor.Point(lon, lat, this.spatialRef), zoom);
        }
        )
    }

    /**
     * 初始化地图显示位置和缩放级别
     * @param  {Double} lon 经度
     * @param {Double} lat 纬度
     * @constructor
     */
    public initPoint(lon: number, lat: number) {
        this.WaitScriptFinsh().then(() => {
            this.map.centerAt(new this.gisConstructor.Point(lon, lat, this.spatialRef));
        }
        )
    }

    /**
    *距离测量
    */
    public distanceMeasure() {
        this.clearMapTools();
        this.map.setMapCursor("crosshair");
        this.measureToolbar.clearResult();
        this.measureToolbar.setTool("distance", true);
    }

    /**
     *面积测量
     */
    public areaMeasurefunction() {
        this.clearMapTools();
        this.map.setMapCursor("crosshair");
        this.measureToolbar.clearResult();
        this.measureToolbar.setTool("area", true);
    }
    /**
    * 坐标拾取
    */
    pointMeasure() {
        this.clearMapTools();
        this.map.setMapCursor("crosshair");
        this.measureToolbar.clearResult();
        //this.measureToolbar.setTool("location", true);
        this.map.on("click", (mouseEvent: any) => {
            this.measureEndEventHandler({
                toolName: "location",
                geometry: mouseEvent.mapPoint
            });
        });
    }
    /**
        * 关闭地图工具
        */
    public clearMapTools() {
        this.measureToolbar.setTool("location", false);
        this.measureToolbar.setTool("distance", false);
        this.measureToolbar.setTool("area", false);
        //this.drawToolbar.deactivate();//撤销地图绘制功能
        this.map.setMapCursor("default");
    }


    /**
    * 测量开始事件响应函数
    * @param evt
    */
    private measureStartEventHandler = (evt: any) => {
        if (this.measureResultGraphic != null)   //点拾取时不触发
        {
            this.map.graphics.remove(this.measureResultGraphic);
            this.measureResultGraphic = null;
        }
    }

    /**
      * 测量结束事件响应函数
      * @param evt
      */
    private measureEndEventHandler = (evt: any) => {
        if (this.measureResultGraphic != null) {
            this.map.graphics.remove(this.measureResultGraphic);
            this.measureResultGraphic = null;
        }

        var geometry = evt.geometry;//绘制图形的geometry

        var txtFont = new this.gisConstructor.Font("16px", this.gisConstructor.Font.STYLE_NORMAL, this.gisConstructor.Font.VARIANT_NORMAL, this.gisConstructor.Font.WEIGHT_BOLDER);

        if (evt.toolName == "distance") {
            var total = this.gisConstructor.number.format(evt.values, { pattern: "#.000" }); //    设置总长度的显示样式，并添加到地图上
            var totalSymbol = new this.gisConstructor.TextSymbol("总长度：" + total + "千米", txtFont, new this.gisConstructor.Color([204, 102, 51]));
            totalSymbol.setOffset(80, -5);
            var aVal = geometry.paths[0][geometry.paths[0].length - 1];
            var lastPnt = new this.gisConstructor.Point(aVal[0], aVal[1], this.spatialRef);

            this.measureResultGraphic = new this.gisConstructor.graphic(lastPnt, totalSymbol);
        }

        if (evt.toolName == "area") {
            var areaSymbol = new this.gisConstructor.TextSymbol(this.gisConstructor.number.format(evt.values, { pattern: '#.000' }) + "平方公里", txtFont, new this.gisConstructor.Color([204, 102, 51]));
            this.measureResultGraphic = new this.gisConstructor.graphic(geometry.getExtent().getCenter(), areaSymbol);   //在地图上显示测量的面积
        }

        if (evt.toolName == "location") {
            var locationSymbol = new this.gisConstructor.TextSymbol("坐标: " + this.gisConstructor.number.format(geometry.x, { pattern: '#.000000' }) + " , " + this.gisConstructor.number.format(geometry.y, { pattern: '#.000000' }), txtFont, new this.gisConstructor.Color([204, 102, 51]));
            locationSymbol.setOffset(20, -20);
            this.measureResultGraphic = new this.gisConstructor.graphic(geometry, locationSymbol);//在地图上显示测量的面积
        }

        if (this.measureResultGraphic != null) {
            this.map.graphics.add(this.measureResultGraphic);
        }
    }

    private mapOnLoadEventHandler = () => {
        //地图上的图形点击事件
        // this.map.graphics.on("click", this.graphicMouseClickEventHandler);

        //地图上的图形鼠标移入事件
        this.map.graphics.on("mouse-over", (evt: any) => { this.map.setMapCursor("pointer"); });

        //地图上的图形鼠标移出事件
        this.map.graphics.on("mouse-out", (evt: any) => { this.map.setMapCursor("default"); });
    }




}