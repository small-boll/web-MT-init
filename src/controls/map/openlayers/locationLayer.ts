/*
 * @Author: your name
 * @Date: 2020-07-14 13:43:20
 * @LastEditTime: 2020-07-27 16:26:30
 * @LastEditors: Please set LastEditors
 * @Description: 定位图层类
 * @FilePath: \mthanos\src\controls\map\openlayers\locationLayer.ts
 */

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Icon, Stroke, Style, Fill, Circle as CircleStyle } from 'ol/style';
import { ILayer } from './ILayer';
export class locationLayer extends ILayer {

    constructor(map: any) {
        super();
        this.map = map;

        this.source = new VectorSource();
        this.vector = new VectorLayer({
            source: this.source,
            style: (feature: any) => {
                return feature.get('style');
            },
        });
   
        this.map.addLayer(this.vector);
    }

    /**
     * @description: 创建样式
     * @param {type} 
     * @return: 
     */
    private createStyle(src: any) {
        return new Style({
            image: new Icon({
                src: src
            }),
        });
    }

    /**
     * @description: 定位
     * @param {type} 
     * @return: 
     */
    public locationPosition(lon: number, lat: number, url: any, attribute: any = null) {

        this.source.clear();
        var iconFeature = new Feature({
            geometry: new Point([lon, lat])
        });
        //实体属性挂接
        if(!!attribute){
            for (let key in attribute) {
                iconFeature.set(key, attribute[key]);
            }
        }
        iconFeature.set('style', this.createStyle(url));

        this.source.addFeature(iconFeature);
    }

    /**
     * @description: 清空
     * @param {type} 
     * @return: 
     */
    public clear() {
        this.source.clear();
    }
}