import Tile from 'ol/Tile.js';
import TileState from 'ol/TileState.js';
import { createCanvasContext2D } from 'ol/dom.js';
import { toSize } from 'ol/size.js';
import XYZ from 'ol/source/XYZ.js';
import { getKeyZXY } from 'ol/tilecoord.js';
// const XYZ = require("ol/source/XYZ.js") 

class gridTile extends Tile {

    private tileSize: any;
    private features: any[];
    private canvas: any;
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("../size.js").Size} tileSize Tile size.
     * @param {string} text Text.
     */
    constructor(tileCoord, tileSize, features) {

        super(tileCoord, TileState.LOADED);

        /**
        * @private
        * @type {import("../size.js").Size}
        */
        this.tileSize = tileSize;

        /**
        * @private
        * @type {string}
        */
        this.features = features;

        /**
        * @private
        * @type {HTMLCanvasElement}
        */
        this.canvas = null;

    }

    /**
    * Get the image element for this tile.
    * @return {HTMLCanvasElement} Image.
    */
    getImage() {
        if (this.canvas) {
            return this.canvas;
        } else {
            const tileSize = this.tileSize;
            const context = createCanvasContext2D(tileSize[0], tileSize[1]);

            context.strokeStyle = 'grey';
            context.strokeRect(0.5, 0.5, tileSize[0] + 0.5, tileSize[1] + 0.5);

            context.fillStyle = 'grey';
            context.strokeStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = '24px sans-serif';
            context.lineWidth = 4;
            context.strokeText(this.features.length, tileSize[0] / 2, tileSize[1] / 2, tileSize[0]);
            context.fillText(this.features.length, tileSize[0] / 2, tileSize[1] / 2, tileSize[0]);

            this.canvas = context.canvas;
            return context.canvas;
        }
    }

    /**
    * @override
    */
    load() { }
}

export class gridClusters extends XYZ {
    /**
     * @param {Options=} opt_options Debug tile options.
     */
    constructor(opt_options) {
        /**
         * @type {Options}
         */

        super({
            opaque: false,
            projection: opt_options.projection,
            tileGrid: opt_options.tileGrid,
            wrapX: opt_options.wrapX !== undefined ? opt_options.wrapX : true,
        });

        this.features = opt_options.features;
    }

    private features: any[] = [];

    /**
    * @inheritDoc
    */
    getTile(z, x, y) {
        const tileCoordKey = getKeyZXY(z, x, y);
        let that:any=this;

        if (that.tileCache.containsKey(tileCoordKey)) {
            return /** @type {!LabeledTile} */ (that.tileCache.get(tileCoordKey));
        } else {
            const tileSize = toSize(that.tileGrid.getTileSize(z));
            const tileCoord = [z, x, y];
            let extent = that.tileGrid.getTileCoordExtent(tileCoord);
            let tempFeatures: any[] = [];
            that.features.forEach(f => {
                if (extent[0] <= f.geometry.coordinates[0] && extent[2] > f.geometry.coordinates[0] &&
                    extent[1] < f.geometry.coordinates[1] && extent[3] >= f.geometry.coordinates[1]) {
                    tempFeatures.push(f);
                }
            });

            const tile = new gridTile(tileCoord, tileSize, tempFeatures);
            that.tileCache.set(tileCoordKey, tile);
            return tile;
        }
    }
}
