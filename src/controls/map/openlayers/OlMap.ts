import { LayerBase } from "./LayerBase"
import View from "ol/View"
import Map from 'ol/Map';
import { OlLayer } from 'ol/layer/Layer'
import 'ol/ol.css';
/**
 * OpenLayers地图封装类
 *
 * @export
 * @class OlMap
 */
export class OlMap {

    private layers: LayerBase[];
    private olLayers: OlLayer[];
    private olView!: View;
    private olMap!: Map;
    private option: MapOption;

    public target: any;
    public isInited: boolean = false;

    constructor(option: MapOption) {
        this.option = option;
        this.target = option.target;
        this.layers = [];
        this.olLayers = [];
    }

    public init() {
        this.olView = new View({
            center: this.option.center,
            projection: this.option.projection,
            zoom: this.option.zoom,
            extent: this.option.extent
        });
        this.olMap = new Map({
            layers: this.olLayers,
            target: this.target,
            view: this.olView
        })
        this.isInited = true;
    }

    public addLayer(layer: LayerBase) {
        this.layers.push(layer);
        layer.setMap(this);
        this.olLayers.push(layer.getOlLayer());
        this.olMap.addLayer(layer.getOlLayer());
    }


}

export class MapOption {

    public target!: any;
    public extent!: any;
    public center!: any;
    public projection!: any;
    public zoom: number = 11;
    constructor(option:any) {
        if (option) {
            this.target = option.target;
            this.extent = option.extent;
            this.center = option.center;
            this.projection = option.projection;
            this.zoom = option.zoom;
        }
    }
}