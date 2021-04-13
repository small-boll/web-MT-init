/*
 * @Author: your name
 * @Date: 2020-06-09 17:20:40
 * @LastEditTime: 2020-07-06 11:40:27
 * @LastEditors: Please set LastEditors
 * @Description: 聚合图层管理工具
 * @FilePath: \mthanos\src\controls\map\arcgis\layertypes.ts
 */
 
export class layerManager {
    private layerCollection: any = [];
    //private  layerArrayName= ["video", "face", "wifi", "car"];   //治安。人脸，wifi，卡警
    private  layerArrayName= ["video"];   //治安。人脸，wifi，卡警

    constructor() {
        this.layerCollection = [];
    }

    /**
     * @description: 初始化人脸，wifi等图层
     * @param {type} 
     * @return: 
     */
    public initBasicsLayers() {
        for (let i=0;i<this.layerArrayName.length;i++) {
            let item = this.layerArrayName[i];
            let opt = {
                layerId: i,  //图层ID
                layerName: item,
                data: [],
                singleSymbol: "@/assets/images/map" + item + ".png",
                singleSymbolDisabled: "@/assets/images/map" + item + "-disabled.png",
                singleSymbolUnknown: "@/assets/images/map" + item + "-unknown.png",
                singleSymbolRunning: "@/assets/images/map" + item + "-gif.gif",
                // singleSymbolRunning: require("@/assets/images/"+item+"-gif.gif"),  
            }
            // @ts-ignore
            let clusterLayer = new ClusterFeatureLayer(opt);
            clusterLayer.setClusterSymbol("@/assets/images/map" + item + ".png", "@/assets/images/map/jh_" + item + ".png", 26, 30);
            clusterLayer.addMap();
            this.layerCollection.push(clusterLayer);
        }
    }
    /**
     * @description: 设置图层数据
     * @param {type} 
     * @return: 
     */
    public setvideoLayerData(data: any) {
        this.setLayerData(data,"video");
    }
    public setfaceLayerData(data: any) {
        this.setLayerData(data,"face");
    }
    public setwifiLayerData(data: any) {
        this.setLayerData(data,"wifi");
    }
    public setcarLayerData(data: any) {
        this.setLayerData(data,"car");
    }
    private setLayerData(data: any, layerEnum: string) {
        this.layerCollection.forEach((item: any) => {
            if (item._layerName == layerEnum) {
                console.log('itemitemitem=========>>>>>', item);
                item.setData(data);
            }
        });
    }

    /**
     * @description: 自定义聚合图层
     * @param {type} 
     * @return: 
     */
    public initCustomLayers(layerName: string, singleSymbolName: string) {
        let opt = {
            layerId: this.layerCollection.length + 1,  //图层ID
            layerName: layerName,
            data: [],
            singleSymbol: require("@/assets/images/" + singleSymbolName + ".png"),
            singleSymbolDisabled: require("@/assets/images/" + singleSymbolName + "-disabled.png"),
            singleSymbolUnknown: require("@/assets/images/" + singleSymbolName + "-unknown.png"),
            singleSymbolRunning: require("@/assets/images/" + singleSymbolName + "-gif.gif"),
        }
        // @ts-ignore
        let clusterlayer = new ClusterFeatureLayer(opt);
        this.layerCollection.push(clusterlayer);
    }

    public clear() {
        this.layerCollection.length = 0;
    }
}