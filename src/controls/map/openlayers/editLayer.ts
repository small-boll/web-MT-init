/*
 * @Author: your name
 * @Date: 2020-07-20 17:04:39
 * @LastEditTime: 2020-07-27 16:57:41
 * @LastEditors: Please set LastEditors
 * @Description: 编辑图层
 * @FilePath: \mthanos\src\controls\map\openlayers\editLayer.ts
 */
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Icon, Stroke, Style, Fill, Circle as CircleStyle } from 'ol/style';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { ILayer } from './ILayer';

export class editLayer extends ILayer {

    private select: any = null;
    private modify: any = null;

    constructor(map: any, src: any,funcCallBack: any=null) {
        super();
        this.map = map;
        this.funcCallBack = funcCallBack;

        this.source = new VectorSource();
        this.vector = new VectorLayer({
            source: this.source,
            style: new Style({
                image: new Icon({
                    src: src
                }),
                // fill: new Fill({
                //     color: 'rgba(255, 255, 255, 0.2)'
                // }),
                // stroke: new Stroke({
                //     color: '#ffcc33',
                //     width: 2
                // }),
                // image: new CircleStyle({
                //     radius: 7,
                //     fill: new Fill({
                //         color: '#ffcc33'
                //     })
                // })
            })
        });
        this.map.addLayer(this.vector);

        this.select = new Select({
            layers: [this.vector],
            style: new Style({
                image: new Icon({
                    src: src
                }),
            })

        });
        this.map.addInteraction(this.select);

        this.modify = new Modify({
            features: this.select.getFeatures(),
        });
        this.map.addInteraction(this.modify);

        var snap = new Snap({
            source: this.source
        });
        this.map.addInteraction(snap);


        this.setActive(true)
        this.setEvents();


        this.modify.on("modifyend", this.modifyend);
    }
    /**
     * @description: ????
     * @param {type} 
     * @return: 
     */
    public modifyend(e: any) {

        let aaa = e.features.item(0).get("name");
        var extent = e.features.item(0).getGeometry().getCoordinates();
        
        if(!!this.funcCallBack)
            this.funcCallBack(e.features.item(0));

        alert("modifysuccess!");
    }

    private setEvents() {
        var selectedFeatures = this.select.getFeatures();

        this.select.on('change:active', function () {
            selectedFeatures.forEach(function (each) {
                selectedFeatures.remove(each);
            });
        });
    }
    private setActive(active: boolean) {
        this.select.setActive(active);
        this.modify.setActive(active);
    }

    /**
     * @description: ?????
     * @param {type} 
     * @return: 
     */
    public addPoints_edit(arrayVertex: any) {
        let features: any = [];

        arrayVertex.forEach((element: any) => {
            var iconFeature = new Feature({
                geometry: new Point([element.lon || element.longitude, element.lat || element.latitude])
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

    public clear() {
        this.source.clear();
    }


}