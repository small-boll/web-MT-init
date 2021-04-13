/*
 * @Author: your name
 * @Date: 2020-07-22 14:20:55
 * @LastEditTime: 2020-07-27 16:35:33
 * @LastEditors: Please set LastEditors
 * @Description: 热力图图层
 * @FilePath: \mthanos\src\controls\map\openlayers\heatmapLayer.ts
 */
import { Heatmap as HeatmapLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point } from "ol/geom";
import { ILayer } from './ILayer';
export class heatmapLayer extends ILayer {
 
    constructor(map: any) {
        super();
        this.map = map;

        this.source = new VectorSource();
        this.vector = new HeatmapLayer({
            source: this.source,
            blur: 25,
            radius: 20,
            weight: (feature:any) =>{
                return  feature.get('weight')||0.1;
              }
        });
        this.map.addLayer(this.vector);
    }

    /**
     * @description: 添加热力图的点数据
     * @param {type} 
     * @return: 
     */
    public addPoints_heatMap(arrayVertex: any) {
        let features: any = [];

        arrayVertex.forEach((element: any) => {

            var iconFeature = new Feature({
                geometry: new Point([element.geometry.coordinates[0],
                element.geometry.coordinates[1]])
            });

            //刷新挂接
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
     * @description: 清空热力图的点数据
     * @param {type} 
     * @return: 
     */
    public clear() {
        this.source.clear();
    }


}