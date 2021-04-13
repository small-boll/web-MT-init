import { LayerBase } from "./LayerBase"
import TileLayer from "ol/layer/Tile";
import TileGrid from "ol/tilegrid/TileGrid";
import XYZ from "ol/source/XYZ";

export class ArcGISTiledLayer extends LayerBase {

    public tiled!: ArcGISTiled;

    public url: string;

    constructor(id: string, url: string, tiled?: ArcGISTiled) {
        super(id, "ArcGISTiledLayer");
        this.url = url;
        this.olLayer = new TileLayer();
        if (tiled) {
            this.tiled = tiled;
            this.init();
        }
    }

    private init() {
        let tileGrid = new TileGrid({
            tileSize: 256,
            origin: this.tiled.origin,
            resolutions: this.tiled.resolutions,
            extent:this.tiled.extent
        });
        this.olLayer.setExtent(this.tiled.extent);
        this.olLayer.setSource(new XYZ({
            tileGrid: tileGrid,
            projection: this.tiled.projection,
            url: this.url + '/tile/{z}/{y}/{x}'
        }))
    }

    private initFromUrl() {
        // TODO
    }

    protected mapChanged() {

    }
}

export class ArcGISTiled {
    public extent: any;

    public origin: any;

    public resolutions: any;

    public projection: any;

    constructor(option: any) {
        if (option) {
            this.extent = option.extent;
            this.origin = option.origin;
            this.resolutions = option.resolutions;
            this.projection = option.projection;
        }

    }
}