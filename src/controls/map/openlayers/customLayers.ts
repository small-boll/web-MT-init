/*
 * @Author: your name
 * @Date: 2020-07-22 14:50:34
 * @LastEditTime: 2020-07-28 09:20:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mthanos\src\controls\map\openlayers\customLayers.ts
 */
import { enum_custormLayer } from '.././enumMap';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon,Text } from 'ol/style';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { Point } from "ol/geom";
import { Select } from 'ol/interaction';
import { ILayer } from './ILayer';

export class customLayers extends ILayer  {
    private select: any = null;
    constructor(map: any,funcCallBack: any=null) {
        super();
        this.map = map;
        this.funcCallBack = funcCallBack;
        
        this.source = new VectorSource();
        this.vector = new VectorLayer({
            source: this.source,
            style: (f: any) => { return this.createStyle(f, false) }
        });
 
        this.vector.setZIndex(0);
        this.map.addLayer(this.vector);

        this.select = new Select({
            layers: [this.vector],
            style: (f: any) => { return this.createStyle(f, true) }
        });
        this.map.addInteraction(this.select);
        this.select.setActive(true);


        this.select.on('select', this.selectFeature);

    }

    /**
     * @description: 选择图层中的实体
     * @param {type} e 实体的对象
     * @return: 
     */
    private selectFeature = (e: any) => {
        if(!!this.funcCallBack)
            this.funcCallBack(e);
    }


    /**
     * @description: 创建实体样式
     * @param {type} 
     * @return: 
     */
    private createStyle(f: any, isSelect: boolean) {
        let stroke = new Stroke({
            color: 'blue',
            width: 2
        });

        let fill = new Fill({
            color: 'rgba(217, 244, 219, 0.7)'
        });

       let text= new Text({
            font: '12px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
                color: '#000',
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 3,
            }),
            text:""
        });

        if (!isSelect) {
            let color = f.get('color');
            if (!!color) stroke.setColor(color);
            let width = f.get('width');
            if (!!width) stroke.setWidth(width);
            let fillcolor = f.get('fillcolor');
            if (!!fillcolor) fill.setColor(fillcolor);
        }

        let src = "";
        if (!!f.get('url')) src = f.get('url');
        if (!!src) {
            let image = new Icon({
                src: src
            });

            if (isSelect) image.setScale(1.2);

            return new Style({ stroke: stroke, fill: fill, image: image,text:text });
        }
        else
            return new Style({ stroke: stroke, fill: fill,text:text });

    }


    /**
    * @description: 画线
    * @param {type} 
    * @return: 
    */
    public drawPolyline(arrayVertex: any, width: number = 0, color: string = "") {
        let pointList: any = [];
        arrayVertex.geometry.coordinates.forEach((itemcoordinates: any) => {
            itemcoordinates.forEach((item: any) => {
                if (!!item[0] && !!item[1]) {
                    pointList.push([item[0], item[1]]);
                }
            });
        });

        let lineFeature = new Feature(new LineString([...pointList]));
        if (width > 0) lineFeature.set("width", width);
        if (!!color) lineFeature.set("color", color);
        //实体属性挂接
        if (!!arrayVertex.properties) {
            for (let key in arrayVertex.properties) {
                lineFeature.set(key, arrayVertex.properties[key]);
            }
        }

        this.source.addFeatures([lineFeature]);
    }



    /**
    * @description: 画面
    * @param {type} 
    * @return: 
    */
    public drawPolygon(arrayVertex: any, width: number = 0, color: string = "", fillcolor: string = "") {

        let PolygonPoints: any = [];
        arrayVertex.geometry.coordinates.forEach((itemcoordinates: any) => {
            let pointList: any = [];
            itemcoordinates[0].forEach((item: any) => {
                if (!!item[0] && !!item[1]) {
                    pointList.push([item[0], item[1]]);
                }
            });
            PolygonPoints.push(pointList);
        });

        let PolygonFeature = new Feature(new Polygon(PolygonPoints));
        if (width > 0) PolygonFeature.set("width", width);
        if (!!color) PolygonFeature.set("color", color);
        if (!!fillcolor) PolygonFeature.set("fillcolor", fillcolor);
        //实体属性挂接
        if (!!arrayVertex.properties) {
            for (let key in arrayVertex.properties) {
                PolygonFeature.set(key, arrayVertex.properties[key]);
            }
        }

        this.source.addFeatures([PolygonFeature]);
    }


    /**
 * @description: 添加点数据
 * @param {type} 
 * @return: 
 */
    public drawPoints(arrayVertex: any, url: any) {

        let features: any = [];

        arrayVertex.forEach((element: any) => {

            var iconFeature = new Feature({
                geometry: new Point([element.geometry.coordinates[0],
                element.geometry.coordinates[1]])
            });
            //实体属性挂接
            if (!!element.properties) {
                for (let key in element.properties) {
                    iconFeature.set(key, element.properties[key]);
                }
            }

            if (!!url) iconFeature.set("url", url);
            features.push(iconFeature)
        });
        this.source.addFeatures(features);
    }


    /**
     * @description: 清空数据
     * @param {type} 
     * @return: 
     */
    public clear(type: any) {
        let self = this;
        switch (type as enum_custormLayer) {
            case enum_custormLayer.point:
                {
                    this.source.forEachFeature((f: any) => {
                        if (f.getGeometry() instanceof Point) {
                            this.source.removeFeature(f);
                        }
                    })
                    break;
                }
            case enum_custormLayer.polyline:
                {
                    this.source.forEachFeature((f: any) => {
                        if (f.getGeometry() instanceof LineString) {
                            this.source.removeFeature(f);
                        }
                    })
                    break;
                }
            case enum_custormLayer.polygon:
                {
                    this.source.forEachFeature((f: any) => {
                        if (f.getGeometry() instanceof Polygon) {
                            this.source.removeFeature(f);
                        }
                    })
                    break;
                }
            case enum_custormLayer.allGeo: {
                this.source.clear();
                break;
            }
            default: {
                this.source.clear();
                break;
            }
        }
    }
}