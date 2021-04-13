
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileLayer from "ol/layer/Tile";
import TileGrid from "ol/tilegrid/TileGrid";
import XYZ from "ol/source/XYZ";

export class mapSource {

    constructor() {
    }

    /**
   * @description: arcgis MapServer服务加载
   * @param {type} 
   * @return: 
   */
    public static LoadArcgisMap(mapParameter: any, spatialRef: any) {
        let tileGrid = new TileGrid({
            tileSize: 256,
            origin: mapParameter.origin,
            resolutions: mapParameter.resolutions,
        });
        return [
            new TileLayer({
                extent: mapParameter.extent,
                source: new XYZ({
                    tileGrid: tileGrid,
                    projection: spatialRef,
                    url: mapParameter.serverUrl + '/tile/{z}/{y}/{x}'
                })
            })
        ];
    }
    /**
     * @description: 加载WMS服务
     * @param {type} 
     * @return: 
     */
    public static LoadTileWMSMap(mapParameter: any, spatialRef: any) {
        return [new TileLayer({
            extent: mapParameter.extent,
            source: new TileWMS({
                url: mapParameter.serverUrl,
                params: { 'LAYERS': mapParameter.layerName, 'TILED': true },
                serverType: 'geoserver',
                transition: 0
            })
        })
        ];
    }

    /**
     * @description: 加载WMTS服务
     * @param {type} 
     * @return: 
     */
    public static LoadWMTSMap(mapParameter: any, spatialRef: any) {
        let tileGrid = new WMTSTileGrid({
            origin: mapParameter.origin,
            resolutions: mapParameter.resolutions,
            matrixIds: mapParameter.matrixIds
        });

        return [new TileLayer({
            source: new WMTS({
                url: mapParameter.serverUrl,
                layer: mapParameter.layerName,
                format: 'image/png',
                matrixSet: mapParameter.wiki,
                tileGrid: tileGrid,
                style: 'default',

            })
        })
        ];
    }


}