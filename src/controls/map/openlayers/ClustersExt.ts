/*
 * @Author: your name
 * @Date: 2020-07-30 10:20:46
 * @LastEditTime: 2020-07-30 11:41:38
 * @LastEditors: Please set LastEditors
 * @Description: 处理聚合类 
 * @FilePath: \mthanos\src\controls\map\openlayers\ClustersExt.ts
 */

import { Cluster } from 'ol/source';

export class ClustersExt extends Cluster {
    private distanceExt = 0.0;
    private map: any = null;
    private clusterMaxZoom: number = -1;

    constructor(options: any, map: any) {
        super(options);

        this.distanceExt = (this as any).distance;
        this.clusterMaxZoom = options.clusterMaxZoom || -1;
        this.map = map;
    }
    /**
     * @description: 聚合处理
     * @param {type} 
     * @return: 
     */
    public cluster() {
        if (!!this.map) {
            if (this.map.getView().getZoom() >= this.clusterMaxZoom)
                (this as any).distance = 0;
            else
                (this as any).distance = this.distanceExt;
        }
        super.cluster();
    }
}


