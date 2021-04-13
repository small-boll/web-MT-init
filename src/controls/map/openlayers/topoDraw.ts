/*
 * @Author: your name
 * @Date: 2020-07-09 11:37:51
 * @LastEditTime: 2020-07-27 16:26:16
 * @LastEditors: Please set LastEditors
 * @Description: 空间查询
 * @FilePath: \mthanos\src\controls\map\openlayers\topoDraw.ts
 */

import 'ol/ol.css';
import { animatedClusters } from "./animatedClusters";
import Draw, { createBox } from 'ol/interaction/Draw';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import * as turf from '@turf/turf'
import { ILayer } from './ILayer';
export class topoDraw extends ILayer {

    private typeSelect = 'None';

    private draw: any = null; // global so we can remove it later
    private callbackFuc: any = null;
    private isWfs: boolean = false;

    constructor(map: any, callbackFuc: any, isWfs: boolean) {
        super();
        this.map = map;
        this.callbackFuc = callbackFuc;
        this.isWfs = isWfs;

        this.source = new VectorSource();
        this.vector = new VectorLayer({
            source: this.source,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.1)'
                }),
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 3,
                    fill: new Fill({
                        color: 'red'
                    })
                })
            })
        });
        this.map.addLayer(this.vector);

    }

    public closeDraw() {
        this.typeSelect = "None";
        this.source.clear();
        if (this.draw)
            this.map.removeInteraction(this.draw);
    }

    public circleSelect() {
        this.closeDraw();
        this.typeSelect = "Circle";
        this.addInteraction();
    }

    public rectangleSelect() {
        this.closeDraw();
        this.typeSelect = "rectangle";
        this.addInteraction();
    }

    public polygonSelect() {
        this.closeDraw();
        this.typeSelect = "Polygon";
        this.addInteraction();
    }

    public freehandSelect() {
        this.closeDraw();
        this.typeSelect = "LineString";
        this.addInteraction();
    }

    private addInteraction() {
        let value = this.typeSelect;
        if (value !== 'None') {
            let geometryFunction;
            let freehand = false;
            if (value === 'rectangle') {
                this.typeSelect = 'Circle';
                geometryFunction = createBox();
            } else if (value === 'LineString') {
                freehand = true;
            }
            this.draw = new Draw({
                source: this.source,
                type: this.typeSelect,
                freehand: freehand,
                geometryFunction: geometryFunction
            });
            this.map.addInteraction(this.draw);

            this.draw.on('drawstart', (evt: any) => {
                this.source.clear();
            });

            this.draw.on('drawend', (evt: any) => {
                if (this.isWfs)
                    this.queryWFS(evt, value);
                else
                    this.querymap(evt, value);
            });
        }

    }
    /**
     * @description: 查询WFS
     * @param {type} 
     * @return: 
     */
    private queryWFS = (evt: any, value: string) => {
        let featuredraw = evt.feature;
        let geo = featuredraw.getGeometry();
        this.callbackFuc(geo);
    }
    /**
     * @description: 空间查询地图
     * @param {type} 
     * @return: 
     */
    private querymap = (evt: any, value: string) => {

        let featuredraw = evt.feature;
        let geo = featuredraw.getGeometry();

        let polygon: any = "";
        let center: any = [];
        let Radius: any = 0.0;
        switch (value) {
            case 'rectangle':
            case 'Polygon':
                {
                    polygon = turf.polygon([...geo.getCoordinates()]);
                    break;
                }
            case 'LineString': {
                let pts = geo.getCoordinates();
                pts.push(pts[0]);
                polygon = turf.polygon([[...pts]]);
                break;
            }
            case 'Circle': {
                Radius = geo.getRadius();
                center = geo.getCenter();
                break;
            }

        }

        //遍历图层
        let FeatureArray: any = [];
        let reArrayLayer: any = [];
        this.map.getLayers().forEach((layer: any) => {
            if (layer instanceof animatedClusters) {
                console.log('animatedClusters============>>>>>', layer);
                let name = (layer as any).get("name");

                let arrayFeatures = (layer as any).getSource().getFeaturesInExtent(geo.getExtent());
                //遍历实体
                arrayFeatures.forEach((features: any) => {
                    let f = features.get('features');
                    //遍历聚合实体
                    f.forEach((feature: any) => {
                        let Propert = feature.getProperties();
                        let coords = Propert.geometry.getCoordinates();
                        //点对象
                        if (value === 'Circle') {
                            if (turf.distance(turf.point(center), turf.point(coords), { units: 'degrees' }) <= Radius) {
                                ///判断是否包含实体
                                Propert.geometry = coords;
                                FeatureArray.push(Propert);
                            }

                        } else {
                            if (turf.booleanContains(polygon, turf.point(coords))) {
                                ///判断是否包含实体
                                Propert.geometry = coords;
                                FeatureArray.push(Propert);
                            }
                        }
                    });
                });

                reArrayLayer.push({ name, FeatureArray });
            }
        });

        ///返回实体
        this.callbackFuc(reArrayLayer);

    }

}