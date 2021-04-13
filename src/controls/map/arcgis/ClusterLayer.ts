/*
 * @Author: your name
 * @Date: 2020-06-09 17:20:40
 * @LastEditTime: 2020-07-06 11:40:49
 * @LastEditors: Please set LastEditors
 * @Description: 聚合图层类
 * @FilePath: \mthanos\src\controls\map\arcgis\layertypes.ts
 */

export class ClusterLayer {
  private gisConstructor: any = null;
  private _clusterTolerance: number = 0;
  private _layerId: any = null;
  private _layerName: string = "";
  private _data = [];
  private _id: string = "";
  private _clusterLabelColor: string = "";
  private _resolution: number = 0;
  private _singleColor: string = "";
  private _singleTemplate: any = null;
  private _useDefaultSymbol: boolean = false;
  private _objectIdField: string = "";
  private _singleSym: any = null;
  private _singleSymDisabled: any = null;
  private _singleSymUnknown: any = null;
  private _singleSymRunning: any = null;
  private _clusterData: any = [];
  private _LayerDataArray: any = [];
  private _DataIdsArray: any = [];
  private _clusters: any = [];
  private _singles: any = [];
  private _clusterLabelOffset: number = -3;
  private _showSingles: boolean = true;
  private _zoomOnClick: boolean = true;
  private _maxSingles: number = 1000;
  private _font: any = null;
  private _sr: any = null;
  private _outFields: string = "";
  private _returnLimit: number = 1000;
  private _clusterCache: any = {};
  private _objectIdCache = [];
  private _objectIdHash = {};
  private detailsLoaded = false;
  private ctxMenuForGraphics: any = null;

  private _clusterLayer: any = null;    //聚合图层

  constructor(options: any, gisConstructor: any, wiki: number, clusterLayer: any) {

    this.gisConstructor = gisConstructor;
    this._clusterLayer = clusterLayer;

    this._clusterTolerance = options.distance || 50;
    this._clusterLabelColor = options.labelColor || '#000';
    // labelOffset can be zero so handle it differently
    this._clusterLabelOffset = (options.hasOwnProperty('labelOffset')) ? options.labelOffset : -3;
    this._showSingles = options.hasOwnProperty('showSingles') ? options.showSingles : true;
    this._zoomOnClick = options.hasOwnProperty('zoomOnClick') ? options.zoomOnClick : true;
    // symbol for single graphics
    this._singleSym = options.singleSymbol;
    this._singleSymDisabled = options.singleSymbolDisabled;
    this._singleSymUnknown = options.singleSymbolUnknown;
    this._singleSymRunning = options.singleSymbolRunning;

    this._singleTemplate = options.singleTemplate || new this.gisConstructor.PopupTemplate({ 'title': '', 'description': '{*}' });
    this._maxSingles = options.maxSingles || 1000;

    this._font = options.font || new this.gisConstructor.Font('10pt').setFamily('Arial');

    this._sr = options.spatialReference || new this.gisConstructor.SpatialReference(wiki);

    this._outFields = options.outFields || ['*'];

    this._useDefaultSymbol = options.hasOwnProperty('useDefaultSymbol') ? options.useDefaultSymbol : false;
    this._returnLimit = options.returnLimit || 1000;

    this._objectIdField = options.objectIdField || 'OBJECTID';
    this._layerId = options.layerId;
    this._layerName = options.layerName;
    this._id = options.id;

    this._clusterLayer._layerId = options.layerId;
    this._clusterLayer._layerName = options.layerName;
    this._clusterLayer._id = options.id;

    this.ctxMenuForGraphics = null;
  }

  /**
   * @description: 设置初始化数据
   * @param {type} 
   * @return: 
   */
  private setData(data: any) {
    //默认id , longitude, latitude
    for (let p in data) {//遍历json数组时，这么写p为索引，0,1
      let value = data[p];

      let gf: any = new this.gisConstructor.graphic(
        new this.gisConstructor.Point(parseFloat(value.longitude), parseFloat(value.latitude), this._sr),
        new this.gisConstructor.SimpleMarkerSymbol("circle", 6, null, new this.gisConstructor.Color("#888")), data[p], this._singleTemplate);
      this._LayerDataArray.push(gf);
      this._DataIdsArray.push(value.id);
    }
  }

  private setClusterSymbol(jh_imagesurl: string, imagesurl: string, width: number, height: number) {

    var defaultSym = new this.gisConstructor.PictureMarkerSymbol(imagesurl, width, height);

    var renderer = new this.gisConstructor.ClassBreaksRenderer(defaultSym, 'clusterCount');

    var clusterSymbol = new this.gisConstructor.PictureMarkerSymbol(jh_imagesurl, width, height).setOffset(-15, 0);

    renderer.addBreak(2, 10000, clusterSymbol);

    this._clusterLayer.setRenderer(renderer);
  }


  private concat(a1: any, a2: any) {
    return a1.concat(a2);
  }

  private merge(arrs: any) {
    let len = arrs.length;
    let target: any = [];

    while (len--) {
      var o = arrs[len];
      if (o.constructor === Array) {
        target = this.concat(target, o);
      } else {
        target.push(o);
      }
    }
    return target;
  }

  private difference(arr1: any, cacheCount: any, hash: any) {
    let len = arr1.length;
    let diff = [];
    if (!cacheCount) {
      diff = arr1;
      while (len--) {
        var value = arr1[len];
        if (!hash[value]) {
          hash[value] = value;
        }
      }
      //var endEarly = new Date().valueOf();
      //console.debug('difference end', (endEarly - start)/1000);
      return diff;
    }
    while (len--) {
      var val:any = arr1[len];
      // if (!hash[val]) {
      //   hash[val] = val;
      //   diff.push(val);
      // }
    }
    //var end = new Date().valueOf();
    //console.debug('difference end', (end - start)/1000);
    return diff;
  }

 

  public _getDefaultSymbol(g: any) {
    let rend = this._clusterLayer._defaultRenderer;
    if (!this._useDefaultSymbol || !rend) {
      var attr = g.attributes;
      if (attr.status == 1) {  //在线
        return this._singleSym;
      }
      else if (attr.status == 2) {  //离线
        return this._singleSymDisabled;
      }
      else if (attr.status == 3) {  //未知
        return this._singleSymUnknown;
      }
      else if (attr.status == 4) {  //状态正在执行中
        return this._singleSymRunning;
      }
      else
        return this._singleSym;
    } else {
      return rend.getSymbol(g);
    }
  }

  public _getRenderedSymbol(feature: any) {
    let attr = feature.attributes;
    if (attr.clusterCount === 1) {
      if (!this._useDefaultSymbol && attr.status == 1) {  //在线
        return this._singleSym;
      }
      else if (!this._useDefaultSymbol && attr.status == 2) {  //离线
        return this._singleSymDisabled;
      }
      else if (!this._useDefaultSymbol && attr.status == 3) {  //未知
        return this._singleSymUnknown;
      }
      else if (!this._useDefaultSymbol && attr.status == 4) {  //状态正在执行中
        return this._singleSymRunning;
      }
      else {
        return null;
      }
      let rend = this._clusterLayer._defaultRenderer;
      if (!rend) { // something went wrong getting default renderer
        return null;
      } else {
        return rend.getSymbol(feature);
      }
    } else {
      return null;
    }
  }

  public _reCluster() {
    // update resolution
    this._clusterLayer._clusterResolution = this._clusterLayer._map.extent.getWidth() / this._clusterLayer._map.width;
    this._getObjectIds(this._clusterLayer._map.extent);
  }

  // override esri/layers/GraphicsLayer methods
  public _setMap(map: any, surface: any) {
    // this._query.outSpatialReference = map.spatialReference;
    // this._query.returnGeometry = true;
    // this._query.outFields = this._outFields;
    // listen to extent-change so data is re-clustered when zoom level changes
    this._clusterLayer._extentChange = this.gisConstructor.on(map, 'extent-change', this.gisConstructor.lang.hitch(this, '_reCluster'));

    let self = this;
    var layerAdded = this.gisConstructor.on(map, 'layer-add', this.gisConstructor.lang.hitch(this._clusterLayer, function (e: any) {
      if (e.layer === self._clusterLayer) {
        layerAdded.remove();
        if (!self.detailsLoaded) {
          {
            self._reCluster();
          }
        }
      }
    }));

    // GraphicsLayer will add its own listener here
    // var div = this._clusterLayer.inherited(arguments);
    // return div;
  }

  public _unsetMap() {
    debugger;
    this._clusterLayer.inherited(arguments);
    this._clusterLayer._extentChange.remove();
  }

  public _onClusterClick(e: any) {
    let attr: any;
    if (e.graphic) {
      attr = e.graphic.attributes;
    }
    if (attr && attr.clusterCount) {
      var source = this.gisConstructor.array.filter(this._clusterData, function (g: any) {
        return attr.clusterId === g.attributes.clusterId;
      }, this);
      this._clusterLayer.emit('cluster-click', source);
    }
  }

  public _getObjectIds(extent: any) {
    this.gisConstructor.all(this._DataIdsArray).then(
      this.gisConstructor.lang.hitch(this, '_onIdsReturned'), this._onError
    );

  }

  public _onError(err: any) {
    console.warn('ReturnIds Error', err);
  }

  public _onIdsReturned(results: any) {
    debugger;
    var uncached = this.difference(results, this._objectIdCache.length, this._objectIdHash);
    this._objectIdCache = this.concat(this._objectIdCache, uncached);
    if (uncached && uncached.length) {
      //this._query.where = null;
      // this._query.geometry = null;
      // var queries = [];
      if (uncached.length > this._returnLimit) {

        let self = this;
        this.gisConstructor.all(this._LayerDataArray).then(this.gisConstructor.lang.hitch(this, function (res: any) {
          var features = self.gisConstructor.array.map(res, function (r: any) {
            // return r.features;
            return r;
          });
          self._onFeaturesReturned(
            // features: merge(features)
            self.merge(features)
          );
        }));
      } else {
        //this._query.where = this._objectIdField + ' IN (' + uncached.join(',') + ')';
        // this.queryTask.execute(this._query).then(
        //   lang.hitch(this, '_onFeaturesReturned'), this._onError
        // );
        this.gisConstructor.all(this._LayerDataArray).then(
          this.gisConstructor.lang.hitch(this, '_onFeaturesReturned'), this._onError
        );
      }
    } else if (this._objectIdCache.length) {
      //this._onFeaturesReturned({ // kinda hacky here
      // features: []
      //});
      this._onFeaturesReturned( // kinda hacky here
        []);
    } else {
      this.clear();
    }
  }

  public _inExtent() {
    //var start = new Date().valueOf();
    //console.debug('#inExtent start');
    var ext = this._clusterLayer._map.extent;
    var len = this._objectIdCache.length;
    var valid: any = [];

    while (len--) {
      var oid = this._objectIdCache[len];
      var cached: any = this._clusterCache[oid];
      if (cached && ext.contains(cached.geometry)) {
        valid.push(cached);
      }
    }
    //var end = new Date().valueOf();
    //console.debug('#inExtent end', (end - start)/1000);
    return valid;
  }

  public _onFeaturesReturned(results: any) {
    //var start = new Date().valueOf();
    //console.debug('#_onFeaturesReturned start');
    var inExtent = this._clusterLayer._inExtent();
    var features;
    if (this._clusterLayer.native_geometryType === 'esriGeometryPolygon') {
      // features = toPoints(results.features);
      // features = this.toPoints(results);
    } else {
      features = results;//.features;
    }
    var len = features.length;
    this._clusterData.length = 0;
    this.clear();
    if (len) {
      let self = this;
      this.gisConstructor.array.forEach(features, function (feat: any) {
        self._clusterCache[feat.attributes[self._objectIdField]] = feat;
      }, this);
    }
    this._clusterData = this.concat(features, inExtent);
    this._clusterGraphics();
    //var end = new Date().valueOf();
    //console.debug('#_onFeaturesReturned end', (end - start)/1000);
  }

  // public ClusterLayer methods
  public updateClusters() {
    this.clearCache();
    this._reCluster();
  }
  public clearCache() {
    // Summary: Clears the cache for clustered items
    let self = this;
    this.gisConstructor.array.forEach(this._objectIdCache, function (oid: any) {
      delete self._objectIdCache[oid];
    }, this);
    this._objectIdCache.length = 0;
    this._clusterCache = {};
    this._objectIdHash = {};
  }

  public add(p: any) {
    // Summary:  The argument is a data point to be added to an existing cluster. If the data point falls within an existing cluster, it is added to that cluster and the cluster's label is updated. If the new point does not fall within an existing cluster, a new cluster is created.
    //
    // if passed a graphic, use the GraphicsLayer's add method
    if (p.declaredClass) {
      debugger;
      this._clusterLayer.inherited(arguments);
      return;
    }

    // add the new data to _clusterData so that it's included in clusters
    // when the map level changes
    this._clusterData.push(p);
    var clustered = false;
    // look for an existing cluster for the new point
    for (var i = 0; i < this._clusters.length; i++) {
      var c = this._clusters[i];
      if (this._clusterTest(p, c)) {
        // add the point to an existing cluster
        this._clusterAddPoint(p, c, null);
        // update the cluster's geometry
        this._updateClusterGeometry(c);
        // update the label
        this._updateLabel(c);
        clustered = true;
        break;
      }
    }

    if (!clustered) {
      this._clusterCreate(p, null);
      p.attributes.clusterCount = 1;
      this._showCluster(p);
    }
  }

  public clear() {
    // Summary:  Remove all clusters and data points.
    debugger;
    this._clusterLayer.inherited(arguments);
    this._clusters.length = 0;
  }

  public clearSingles(singles: any) {
    // Summary:  Remove graphics that represent individual data points.
    var s = singles || this._singles;
    let self = this;
    this.gisConstructor.array.forEach(s, function (g: any) {
      self._clusterLayer.remove(g);
    }, this);
    this._singles.length = 0;
  }
  //   ///进行鼠标右键菜单控制
  //   public onMouseDown(e:any){
  //      if(e.button!=2)  return;
  //     // if(this._map.getZoom()<9)  return;
  //      if(e.graphic._layer.id==="ARHeightDevice"||e.graphic._layer.id==="ZACamera")
  //         this.createMenu(e);
  //      else if(e.graphic._layer.id==="stopCaptureDevice")  //违停抓拍
  //         this.createMenuCapture(e);
  //      else if(e.graphic._layer.id==="voiceDevice")  //应急语音广播
  //        this.createMenuVoice(e);

  //   }
  //   public createMenuVoice(evt:any){
  //     if(this.ctxMenuForGraphicsVoice==null) {
  //       this.ctxMenuForGraphicsVoice = new Menu({});

  //       this.ctxMenuForGraphicsVoice.addChild(new MenuItem({
  //         label: "<div style='background-color:#4488ff;color: #fff;font-size: 12px;width: 100px;padding: 0 10px;line-height: 24px;border-radius:  0 0 4px 4px'>应急语音广播 </div>",
  //         onClick: function () {
  //           GlobalPopup.rightClickInfo(6);
  //         }
  //       }));
  //       this.ctxMenuForGraphicsVoice.startup();
  //     }
  //     GlobalPopup.rightAttrInfo(evt.graphic);
  //     // Let's bind to the graphic underneath the mouse cursor
  //     this.ctxMenuForGraphicsVoice.bindDomNode(evt.graphic.getDojoShape().getNode());

  //   }
  //   public createMenuCapture(evt:any){
  //     if(this.ctxMenuForGraphicsCapture==null) {
  //       this.ctxMenuForGraphicsCapture = new Menu({});

  //       this.ctxMenuForGraphicsCapture.addChild(new MenuItem({
  //         label: "<div style='background-color:#4488ff;color: #fff;font-size: 12px;width: 100px;padding: 0 10px;line-height: 24px;border-radius:  0 0 4px 4px'>语音广播 </div>",
  //         onClick: function () {
  //           GlobalPopup.rightClickInfo(5);
  //         }
  //       }));
  //       this.ctxMenuForGraphicsCapture.startup();
  //     }
  //     GlobalPopup.rightAttrInfo(evt.graphic);
  //     // Let's bind to the graphic underneath the mouse cursor
  //     this.ctxMenuForGraphicsCapture.bindDomNode(evt.graphic.getDojoShape().getNode());

  //   }
  //   //创建菜单
  //   public createMenu(evt:any){
  //     if(this.ctxMenuForGraphics==null){
  //       this.ctxMenuForGraphics = new Menu({});

  //       this.ctxMenuForGraphics .addChild(new MenuItem({
  //         label: "<div style='background-color:#4488ff;color: #fff;font-size: 12px;width: 100px;padding: 0 10px;line-height: 24px;border-radius: 4px 4px 0 0 ;border-bottom: 1px solid rgba(255,255,255,0.3);'>实时</div>",
  //         onClick: function () {
  //             GlobalPopup.rightClickInfo(1);
  //         }
  //       }));
  //       this.ctxMenuForGraphics .addChild(new MenuItem({
  //         label:"<div style='background-color:#4488ff;color: #fff;font-size: 12px;width: 100px;padding: 0 10px;line-height: 24px;border-bottom: 1px solid rgba(255,255,255,0.3);'>回放 </div>",
  //         onClick: function () {
  //           GlobalPopup.rightClickInfo(2);
  //         }
  //       }));
  //       this.ctxMenuForGraphics .addChild(new MenuItem({
  //         label: "<div style='background-color:#4488ff;color: #fff;font-size: 12px;width: 100px;padding: 0 10px;line-height: 24px;order-bottom: 1px solid rgba(255,255,255,0.3);'>网格实时 </div>",
  //         onClick: function () {
  //           GlobalPopup.rightClickInfo(3);
  //         }
  //       }));
  //       this.ctxMenuForGraphics .addChild(new MenuItem({
  //         label: "<div style='background-color:#4488ff;color: #fff;font-size: 12px;width: 100px;padding: 0 10px;line-height: 24px;border-radius:  0 0 4px 4px'>网格回放 </div>",
  //         onClick: function () {
  //           GlobalPopup.rightClickInfo(4);
  //         }
  //       }));
  //       this.ctxMenuForGraphics.startup();
  //     }
  //     GlobalPopup.rightAttrInfo(evt.graphic);
  //     // Let's bind to the graphic underneath the mouse cursor
  //     this.ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());

  //   }

  public onClick(e: any) {
    this._onClusterClick(e);
    // zoom in to cluster if possible
    if (
      this._zoomOnClick &&
      e.graphic.attributes.clusterCount > 1 &&
      this._clusterLayer._map.getZoom() !== this._clusterLayer._map.getMaxZoom()
    ) {
      this._clusterLayer._map.centerAndZoom(
        e.graphic.geometry,
        this._clusterLayer._map.getZoom() + 1
      );
    } else {
      // remove any previously showing single features
      this.clearSingles(this._singles);

      // find single graphics that make up the cluster that was clicked
      // would be nice to use filter but performance tanks with large arrays in IE
      var singles = [];
      for (var i = 0, il = this._clusterData.length; i < il; i++) {
        if (e.graphic.attributes.clusterId == this._clusterData[i].attributes.clusterId) {
          //singles.push(this._clusterData[i]);
        }
      }
      if (singles.length > this._maxSingles) {
        alert('Sorry, that cluster contains more than ' + this._maxSingles + ' points. Zoom in for more detail.');

      } else {
        // stop the click from bubbling to the map
        e.stopPropagation();
        //this._map.infoWindow.show(e.graphic.geometry);
        this._addSingles(singles);
      }
    }
  }

  //   // internal methods
  public _clusterGraphics() {
    this.clear();
    // first time through, loop through the points
    for (var j = 0, jl = this._clusterData.length; j < jl; j++) {
      // see if the current feature should be added to a cluster
      var point = this._clusterData[j].geometry || this._clusterData[j];
      var feature = this._clusterData[j];
      var clustered = false;
      var numClusters = this._clusters.length;
      for (var i = 0; i < this._clusters.length; i++) {
        var c = this._clusters[i];
        if (this._clusterTest(point, c)) {
          this._clusterAddPoint(feature, point, c);
          clustered = true;
          break;
        }
      }

      if (!clustered) {
        this._clusterCreate(feature, point);
      }
    }
    this._showAllClusters();
  }

  public _clusterTest(p: any, cluster: any) {
    var distance = (
      Math.sqrt(
        Math.pow((cluster.x - p.x), 2) + Math.pow((cluster.y - p.y), 2)
      ) / this._clusterLayer._clusterResolution
    );

    return (distance <= this._clusterTolerance) && (this._clusterLayer._map.getZoom() < 9);
  }

  //   // points passed to clusterAddPoint should be included
  //   // in an existing cluster
  //   // also give the point an attribute called clusterId
  //   // that corresponds to its cluster
  public _clusterAddPoint(feature: any, p: any, cluster: any) {
    // average in the new point to the cluster geometry
    var count, x, y;
    count = cluster.attributes.clusterCount;
    x = (p.x + (cluster.x * count)) / (count + 1);
    y = (p.y + (cluster.y * count)) / (count + 1);
    cluster.x = x;
    cluster.y = y;

    // build an extent that includes all points in a cluster
    // extents are for debug/testing only...not used by the layer
    if (p.x < cluster.attributes.extent[0]) {
      cluster.attributes.extent[0] = p.x;
    } else if (p.x > cluster.attributes.extent[2]) {
      cluster.attributes.extent[2] = p.x;
    }
    if (p.y < cluster.attributes.extent[1]) {
      cluster.attributes.extent[1] = p.y;
    } else if (p.y > cluster.attributes.extent[3]) {
      cluster.attributes.extent[3] = p.y;
    }

    // increment the count
    cluster.attributes.clusterCount++;
    // attributes might not exist
    if (!p.hasOwnProperty('attributes')) {
      p.attributes = {};
    }
    // give the graphic a cluster id
    feature.attributes.clusterId = p.attributes.clusterId = cluster.attributes.clusterId;
  }

  //   // point passed to clusterCreate isn't within the
  //   // clustering distance specified for the layer so
  //   // create a new cluster for it
  public _clusterCreate(feature: any, p: any) {
    var clusterId = this._clusters.length + 1;
    // console.log('cluster create, id is: ', clusterId);
    // p.attributes might be undefined
    if (!p.attributes) {
      p.attributes = {};
    }
    feature.attributes.clusterId = p.attributes.clusterId = clusterId;
    let attributes: any = { 'clusterCount': 1, 'clusterId': clusterId, 'extent': [p.x, p.y, p.x, p.y], };

    for (let p in feature.attributes) {//遍历json对象的每个key/value对,p为key
      attributes[p] = feature.attributes[p];
    }
    // create the cluster
    var cluster = {
      'x': p.x,
      'y': p.y,
      'attributes': attributes
    };
    this._clusters.push(cluster);
  }

  public _showAllClusters() {
    //var start = new Date().valueOf();
    //console.debug('#_showAllClusters start');
    var len = this._clusters.length;

    for (var i = 0, il = this._clusters.length; i < il; i++) {
      this._showCluster(this._clusters[i]);
    }
    this._clusterLayer.emit('clusters-shown', this._clusters);
    //var end = new Date().valueOf();
    //console.debug('#_showAllClusters end', (end - start)/1000);
  }

  public _showCluster(c: any) {
    var point = new this.gisConstructor.Point(c.x, c.y, this._sr);
    var count = c.attributes.clusterCount;

    var g = new this.gisConstructor.graphic(point, null, c.attributes);
    g.setSymbol(this._getRenderedSymbol(g));
    this._clusterLayer.add(g);
    // code below is used to not label clusters with a single point

    if (c.attributes.clusterCount < 2) {
      return;
    }

    // show number of points in the cluster
    var label = new this.gisConstructor.TextSymbol(c.attributes.clusterCount.toString())
      .setColor(new this.gisConstructor.Color(this._clusterLabelColor))
      .setOffset(-5, this._clusterLabelOffset)
      .setFont(this._font)
      .setAlign(this.gisConstructor.TextSymbol.ALIGN_MIDDLE);
    this._clusterLayer.add(
      new this.gisConstructor.graphic(
        point,
        label,
        c.attributes
      )
    );
  }

  public _addSingles(singles: any) {
    // add single graphics to the map
    let self = this;
    this.gisConstructor.array.forEach(singles, function (g: any) {
      g.setSymbol(self._clusterLayer._getDefaultSymbol(g));
      //  g.setInfoTemplate(this._singleTemplate);
      self._clusterLayer._singles.push(g);
      if (self._clusterLayer._showSingles) {
        self.add(g);
      }
    }, this);
    // this._map.infoWindow.setFeatures(this._singles);
    //GlobalPopup.showOwnerContent(this._singleTemplate,this._singles);
  }

  public _updateClusterGeometry(c: any) {
    // find the cluster graphic
    var cg = this.gisConstructor.filter(this._clusterLayer.graphics, function (g: any) {
      return !g.symbol &&
        g.attributes.clusterId == c.attributes.clusterId;
    });
    if (cg.length == 1) {
      cg[0].geometry.update(c.x, c.y);
    } else {
      console.log('didn not find exactly one cluster geometry to update: ', cg);
    }
  }

  public _updateLabel(c: any) {
    // find the existing label
    var label = this.gisConstructor.array.filter(this._clusterLayer.graphics, function (g: any) {
      return g.symbol &&
        g.symbol.declaredClass == 'esri.symbol.TextSymbol' &&
        g.attributes.clusterId == c.attributes.clusterId;
    });
    if (label.length == 1) {
      // console.log('update label...found: ', label);
      this._clusterLayer.remove(label[0]);
      var newLabel = new this.gisConstructor.TextSymbol(c.attributes.clusterCount.toString())
        .setColor(new this.gisConstructor.Color(this._clusterLabelColor))
        .setOffset(-5, this._clusterLabelOffset)
        .setFont(this._font)
        .setAlign(this.gisConstructor.TextSymbol.ALIGN_MIDDLE);
      this.add(
        new this.gisConstructor.graphic(
          new this.gisConstructor.Point(c.x, c.y, this._sr),
          newLabel,
          c.attributes)
      );
    } else {
      console.log('didn not find exactly one label: ', label);
    }
  }

  // debug only...never called by the layer
  public _clusterMeta() {
    // print total number of features
    console.log('Total:  ', this._clusterData.length);

    // add up counts and print it
    var count = 0;
    this.gisConstructor.array.forEach(this._clusters, function (c: any) {
      count += c.attributes.clusterCount;
    });
    console.log('In clusters:  ', count);
  }

  //更新对象的状态
  public _updateOnlineStatus(featureArray: any) {
    var _this = this;
    for (var p in featureArray) {
      var value = featureArray[p];
      if (value.status == 2)
        _this._clusterCache[value.id].attributes.status = value.status;
      else
        _this._clusterCache[value.id].attributes.status = value.status;
    }
    _this._reCluster();
  }

  public _queryGraphic(geometry: any, selectedGraphics: any) {
    var _this = this;

    if (geometry.type == "polyline") {
      geometry = new this.gisConstructor.Polygon(geometry.paths, geometry.spatialReference);
    }
    this.gisConstructor.array.forEach(_this._LayerDataArray, function (c: any) {
      if (geometry.contains(c.geometry)) {

        var temp = {
          "layerId": _this._layerId,
          "layerName": _this._layerName,
          "feature": c
        };

        selectedGraphics.push(temp);
      }
    });
  }


}