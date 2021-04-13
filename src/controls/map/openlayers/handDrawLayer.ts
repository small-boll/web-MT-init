/*
 * @Author: your name
 * @Date: 2020-07-01 16:23:32
 * @LastEditTime: 2020-07-30 10:05:16
 * @LastEditors: Please set LastEditors
 * @Description: 地图测量类
 * @FilePath: \mthanos\src\controls\map\openlayers\unitityFunc.ts
 */

import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
 
import { ILayer } from './ILayer';

export class handDrawLayer extends ILayer {
 
  private handDrawCallback:any =null;

  private draw: any = null; // global so we can remove it later

  constructor(map: any,handDrawCallback:any) {
    super();
    this.map = map;
    this.handDrawCallback = handDrawCallback;

    this.source = new VectorSource();
    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)'
        }),
        stroke: new Stroke({
          color: 'blue',
          width: 2
        }),
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({
            color: 'blue'
          })
        })
      })
    });
    this.map.addLayer(this.vector);
  }


  /**
   * @description: 设置绘制的对象
   * @param {type} 
   * @return: 
   */
  private addInteraction(type:string) {
    this.draw = new Draw({
      source: this.source,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)'
        }),
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, 0.2)'
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
          })
        })
      })
    });
    this.map.addInteraction(this.draw);

    this.draw.on('drawend', (sketchFeature:any) => {

      let f:any =sketchFeature.feature;
      let obj={Coordinates:[],geoType:""};
      obj.geoType =f.get("geometry").getType();
      if( obj.geoType==="Circle"){
        (obj.Coordinates as any).push(...f.getGeometry().getCenter());
        (obj.Coordinates as any).push(f.getGeometry().getRadius());
      }
      else{
        obj.Coordinates =f.getGeometry().getCoordinates();

      }
      ///绘制完后返回数据
      this.handDrawCallback(obj);
    });
  }

  /**
   * @description: 手动绘制点数据
   * @param {type} 
   * @return: 
   */
  public hand_drawPoint() {
    this.map.removeInteraction(this.draw);
    this.addInteraction("Point");

  }


  /**
   * @description: 手动绘制线数据
   * @param {type} 
   * @return: 
   */
  public hand_drawPolyline() {

    this.map.removeInteraction(this.draw);
    this.addInteraction("LineString");

  }

  /**
   * @description: 手动绘制面数据
   * @param {type} 
   * @return: 
   */
  public hand_drawPolygon() {
    this.map.removeInteraction(this.draw);
    this.addInteraction("Polygon");
  }

    /**
   * @description: 手动绘制点数据
   * @param {type} 
   * @return: 
   */
  public hand_drawCircle() {
    this.map.removeInteraction(this.draw);
    this.addInteraction("Circle");
  }

  public clear(){
    this.map.removeInteraction(this.draw);
    this.source.clear();
  }

}