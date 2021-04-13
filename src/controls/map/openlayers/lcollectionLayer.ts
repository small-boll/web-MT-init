
/*
 * @Author: your name
 * @Date: 2020-07-20 17:04:39
 * @LastEditTime: 2020-07-29 16:28:55
 * @LastEditors: Please set LastEditors
 * @Description: 图层集合
 * @FilePath: \mthanos\src\controls\map\openlayers\collectionLayer.ts
 */
export class lcollectionLayer<T>{

    public recordsLayers:any = [];

    constructor() {
    }

    /**
     * @description: 记录对象
     * @param {type} 
     * @return: 
     */
    public push(name: string, layer: T) {
        this.recordsLayers.push({
            name: name,
            layer: layer
        });
    }
    /**
     * @description: 获取所有
     * @param {type} 
     * @return: 
     */
    public getAll(){
        return this.recordsLayers;
    }

    /**
     * @description: 查找对象
     * @param {type} 
     * @return: 
     */
    public find(name: string) {
        let index = this.recordsLayers.findIndex((item: any) => {
            return item.name == name && !!item.layer;
        });
        if (index >= 0) { /* 说明存在更新的警察数据  */
           return this.recordsLayers[index].layer as T;
        }
        return null;
    }
    /**
     * @description:清空指定图层 
     * @param {type} 
     * @return: 
     */
    public clearLayer(name:string){
        let index = this.recordsLayers.findIndex((item: any) => {
            return item.name == name && !!item.layer;
        });
        if (index >= 0) { /* 说明存在更新的警察数据  */
            this.recordsLayers[index].layer.clear();
            this.recordsLayers.splice(index, 1)
        }
    }
    /**
     * @description: 清空所有
     * @param {type} 
     * @return: 
     */
    public clearAll(){
        this.recordsLayers.forEach((element:any) => {
            element.layer.clear();
        });
        this.recordsLayers=[];
    }
    
}