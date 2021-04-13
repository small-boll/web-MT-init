
/*
 * @Author: your name
 * @Date: 2020-07-20 17:04:39
 * @LastEditTime: 2020-07-27 15:20:13
 * @LastEditors: Please set LastEditors
 * @Description: 大批量点数据显示等
 * @FilePath: \mthanos\src\controls\map\openlayers\editLayer.ts
 */

import WebGLPointsLayer from "ol/layer/WebGLPoints";
import Vector from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
export class glPointsLayer {
    private map: any = null;
    private layer: any = null;
    private vectorSource: any = null;

    constructor(map: any, src: any) {

        this.map = map;
        this.vectorSource = new Vector();


        this.layer = new WebGLPointsLayer({
            source: this.vectorSource,
            style: {
                symbol: {
                    symbolType: "image",
                    src: src,
                    size: [26, 38],
                    offset: [0, 0]
                }
            }
        });
            
        this.map.addLayer(this.layer);

    }
    /**
     * @description: 添加点数据
     * @param {type} 
     * @return: 
     */
    public addPoints_gl(points: any) {

        let features: any = [];

        points.forEach((element: any) => {

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
            features.push(iconFeature)
        });
        this.vectorSource.addFeatures(features);
    }


    /**
     * @description: 清空数据
     * @param {type} 
     * @return: 
     */
    public clear_gl() {
        this.vectorSource.clear();
    }

}