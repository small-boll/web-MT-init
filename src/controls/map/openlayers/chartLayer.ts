/*
 * @Author: your name
 * @Date: 2020-07-30 15:50:49
 * @LastEditTime: 2020-07-30 17:27:18
 * @LastEditors: Please set LastEditors
 * @Description: 生成饼图功能
 * @FilePath: \mthanos\src\controls\map\openlayers\chartLayer.ts
 */

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Select, Snap } from 'ol/interaction';
import { Icon, Stroke, Style, Fill, Circle as CircleStyle, Text } from 'ol/style';
import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing'
import { ILayer } from './ILayer';
import { chartStyle } from './chartStyle';


export class chartLayer extends ILayer {

    private animation: boolean = false;
    private styleCache: object = {};
    private listenerKey;

    private graph: string = "pie";
    private color: string = "Classic";

    constructor(map: any, funcCallBack: any = null) {
        super();
        this.map = map;
        this.funcCallBack = funcCallBack;

        this.source = new VectorSource();
        this.vector = new VectorLayer({
            source: this.source,
            style: (f: any) => { return this.getFeatureStyle(f); }
        });
        this.map.addLayer(this.vector);

        var select = new Select({
            style: (f: any) => { return this.getFeatureStyle(f, true); }
        });
        map.addInteraction(select);

        select.getFeatures().on(['add', 'remove'], (e: any) => {
            if (e.type == "add") {
                this.funcCallBack(e);
            }
            else {

            }
        })
    }


    public doAnimate() {
        if (this.listenerKey) return;
        var start = new Date().getTime();
        var duration = 1000;
        this.animation = false;
        this.listenerKey = this.source.on(['precompose', 'prerender'], (event: any) => {
            var frameState = event.frameState;
            var elapsed = frameState.time - start;
            if (elapsed > duration) {
                unByKey(this.listenerKey);
                this.listenerKey = null;
                this.animation = false;
            } else {
                this.animation = easeOut(elapsed / duration);
                frameState.animate = true;
            }
            this.source.changed();
        });
        this.source.changed();
    }

    public getFeatureStyle(feature: any, sel: boolean = false) {
        var k = this.graph + "-" + this.color + "-" + (sel ? "1-" : "") + feature.get("data");
        debugger;
        let styleArray: any = [];
        var style = this.styleCache[k];
        if (!style) {
            var radius = 15;
            // area proportional to data size: s=PI*r^2
            if (this.graph != "bar") {
                radius = 8 * Math.sqrt(feature.get("sum") / Math.PI);
            }
            // Create chart style
            var c = this.color;
            let style1 = new Style({
                image: new chartStyle({
                    type: this.graph,
                    radius: (sel ? 1.2 : 1) * radius,
                    offsetY: this.graph == 'pie' ? 0 : (sel ? -1.2 : -1) * feature.get("radius"),
                    data: feature.get("data") || [10, 30, 20],
                    colors: /,/.test(c) ? c.split(",") : c,
                    rotateWithView: true,
                    animation: this.animation,
                    stroke: new Stroke({
                        color: this.color != "neon" ? "#fff" : "#000",
                        width: 2
                    }),
                })
            });
            style1.getImage().setAnimation(this.animation);
            styleArray.push(style1);

            if (sel) {	/*
				var sum = 0;
				for (var i=0; i<data.length; i++)
				{	sum += data[i];
				}
				*/
                var sum = feature.get("sum");

                var s = 0;
                for (var i = 0; i < feature.get("data").length; i++) {
                    var d = feature.get("data")[i];
                    var a = (2 * s + d) / sum * Math.PI - Math.PI / 2;
                    var v = Math.round(d / sum * 1000);
                    if (v > 0) {
                        styleArray.push(new Style(
                            {
                                text: new Text(
                                    {
                                        text: (v / 10) + "%", /* d.toString() */
                                        offsetX: Math.cos(a) * (radius + 3),
                                        offsetY: Math.sin(a) * (radius + 3),
                                        textAlign: (a < Math.PI / 2 ? "left" : "right"),
                                        textBaseline: "middle",
                                        stroke: new Stroke({ color: "#fff", width: 2.5 }),
                                        fill: new Fill({ color: "#FF0000" })
                                    })
                            }));
                    }
                    s += d;
                }
            }
        }
        if (styleArray.length > 0)
            this.styleCache[k] = styleArray;
        return this.styleCache[k];
    }

    /**
     * @description: 添加饼状图的数据点
     * @param {type} 
     * @return: 
     */
    public addChartPoints(arrayVertex: any, graphType: string = "pie") {
        this.graph = graphType;
        let features: any = [];

        arrayVertex.forEach((element: any) => {
            var iconFeature = new Feature({
                geometry: new Point([element.lon || element.longitude, element.lat || element.latitude]),
                data: element.data,
                sum: element.nb
            });

            //??????
            if (!!element.properties) {
                for (let key in element.properties) {
                    iconFeature.set(key, element.properties[key]);
                }
            }

            features.push(iconFeature)
        });
        this.source.addFeatures(features);
    }

    /**
     * @description: 清空实体
     * @param {type} 
     * @return: 
     */
    public clear() {
        this.source.clear();
    }


}