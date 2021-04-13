import { animatedClusters } from "./animatedClusters";
import { selectClusters } from "./selectClusters";
import { ClustersExt } from "./ClustersExt";
import { Vector } from 'ol/source';
import { Fill, Stroke, Text, Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';


/**
 * @description: 聚合类图层
 */
export class olClusterLayer {
    private map: any = null;
    private styleCache: any = [];
    private callbackClickFeature: any = null;

    private _clusterLayer: any = null;
    private _selectCluster: any = null;
    private _name: string = "";
    private _singleSym: string = "";
    private _singleSymDisabled: string = "";
    private _singleSymUnknown: string = "";
    private _singleSymRunning: string = "";
    private _jhSym: string = "";

    private popupOverlay: any = null;

    constructor(option: any) {
        this._name = option.name;
        this.map = option.map;

        this._singleSym = option.singleSym;
        this._jhSym = option.jhSym;

        this.popupOverlay = new Overlay({
            autoPan: true,
            //positioning:"top-center",
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map.addOverlay(this.popupOverlay);
    }
    /**
     * @description: 回调函数
     * @param {type} 
     * @return: 
     */
    public Initcallback(option: any) {
        this.callbackClickFeature = option.callbackClickFeature || null;
    }
    /**
     * @description: 图层显示与隐藏
     * @param {type} 
     * @return: 
     */
    public setLayerVisible(visible: boolean) {
        this._clusterLayer.setVisible(visible);
        if (!visible) this._selectCluster.clear();
    }

    //清空数据以及对象
    public clear() {
        this._selectCluster.clear();
        this._clusterLayer.clear();
        this.map.removeLayer(this._clusterLayer);
        this.map.removeInteraction(this._selectCluster);
    }

    /**
     * @description: 初始化聚合图层
     * @param {type}  clusterMaxZoom  设置聚合图层层级,大于该层级不聚合
     * @return: 
     */
    public initClusterLayer(features: any, clusterMaxZoom: number = -1) {

        // Cluster Source
        var clusterSource: any = new ClustersExt({
            distance: 40,
            source: new Vector(),
            clusterMaxZoom: clusterMaxZoom
        }, this.map);

        // Animated cluster layer
        this._clusterLayer = new animatedClusters({
            name: this._name,
            source: clusterSource,
            animationDuration: 700,
            style: this.getStyle
        });
        this.map.addLayer(this._clusterLayer);

        clusterSource.getSource().clear();
        clusterSource.getSource().addFeatures(features);

        ////选择聚合点
        var style1 = new Style({
            image: new Icon({
                src: (this._singleSym)
            }),
            stroke: new Stroke({
                color: "#1AB1F2",
                width: 2
            })
        });

        // 选择聚合图层的样式
        let self = this;
        this._selectCluster = new selectClusters({
            // Point radius: to calculate distance between the features
            layers: [this._clusterLayer],
            pointRadius: 20,   //周围圆的距离
            animate: true,
            // Feature style when it springs apart
            featureStyle: function () {
                return [style1]
            },
            // selectCluster: false,	// disable cluster selection
            // Style to draw cluster when selected
            style: function (f: any, res: any) {
                var cluster: any = f.get('features');
                if (!!!cluster) return null;
                if (cluster.length > 1) {
                    var s = [self.getStyle(f, res)];
                    return s;
                } else {
                    return [
                        new Style({
                            image: new Icon({
                                scale: 1.2,
                                src: (self._singleSym)
                            })
                        })];
                }
            }
        });
        this.map.addInteraction(this._selectCluster);

        ///点击对象的响应事件, 
        this._selectCluster.getFeatures().on(['add'], this.clickFeature)
        // this._selectCluster.getFeatures().on(['contextmenu'], function (e:any) {    
        //     debugger;
        // })
    }
    /**
     * @description: 点击对象响应事件
     * @param {type} 
     * @return: 
     */
    private clickFeature = (e: any) => {
        var c = e.element.get('features');
        if (!!!c) return null;
        if (c.length == 1) {
            var feature = c[0];
            if (this._selectCluster.isMouseRIght) {  //点击右键
                alert("点击右键")
                this._selectCluster.isMouseRIght = false;
                this.popupOverlay.setPosition(undefined);
                (this._selectCluster as any).getFeatures().clear();
            }
            else {
                this.callbackClickFeature(feature);
                this.popupOverlay.setPosition(feature.getGeometry().getCoordinates());
            }
        } else {
            //$(".infos").text("Cluster (" + c.length + " features)");
        }
    }

    /**
     * @description: 鼠标右键点击地图响应消息
     * @param {type} 
     * @return: 
     */
    public contextmenu = (e: any) => {
        (this._selectCluster as any).getFeatures().clear();
        this._selectCluster.isMouseRIght = true;
        e.type = "singleclick";
        (this._selectCluster as any).handleEvent(e);
    }
    /**
     * @description: 设置弹出框的元素
     * @param {type} 
     * @return: 
     */
    public setPopupElement(div: any) {
        this.popupOverlay.setElement(div);
    }

    /**
     * @description: 聚合样式设置
     * @param {type} 
     * @return: 
     */
    public getStyle = (feature: any, resolution: any) => {
        var size = feature.get('features').length;
        var style = this.styleCache[size];
        if (!style) {
            if (size > 1) {
                ///聚合样式
                style = this.styleCache[size] = new Style({
                    image: new Icon({
                        src: (this._jhSym)
                    }),
                    text: new Text({
                        text: size.toString(),
                        fill: new Fill({
                            color: 'red'
                        })
                    })
                });
            }
            else {
                style = this.styleCache[size] = new Style({
                    image: new Icon({
                        src: (this._singleSym)
                    })
                });
            }
        }
        return style;
    }
}


