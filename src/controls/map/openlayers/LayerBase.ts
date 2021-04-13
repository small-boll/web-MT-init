import { OlMap } from './OlMap';
import { Layer } from 'ol/layer/Layer'

export abstract class LayerBase {

    private id: string;
    private layerType: string;
    protected map!: OlMap;
    protected olLayer!: Layer;

    public maxResolution: number = 0;

    public minResolution: number = 0;

    constructor(id: string, layerType: string) {
        this.id = id;
        this.layerType = layerType;
    }

    /**
     * 获取图层Id，全局唯一
     */
    public getId(): string {
        return this.id;
    }

    /**
     * 获取图层类型
     */
    public getLayerType(): string {
        return this.layerType;
    }

    public setMap(map: OlMap) {
        this.map = map;
        this.mapChanged();
    }

    public getMap(): OlMap {
        return this.map;
    }

    protected abstract mapChanged();

    public getOlLayer():Layer{
        return this.olLayer;
    }
}