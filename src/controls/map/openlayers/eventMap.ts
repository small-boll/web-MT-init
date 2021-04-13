/*
 * @Author: your name
 * @Date: 2020-07-28 13:45:42
 * @LastEditTime: 2020-07-29 17:33:42
 * @LastEditors: Please set LastEditors
 * @Description: 地图响应时间
 * @FilePath: \mthanos\src\controls\map\openlayers\event.ts
 */

export class eventMap {
    private map: any = null;
    public  mouseRightCallback:any =null;
    constructor(map: any) {
        this.map = map;

        //右键菜单
        this.map.on('contextmenu', this.mouseRight);

        //双击
        this.map.on('dblclick', this.dblclick);
    }

    /**
     * @description: 右键菜单
     * @param {type} 
     * @return: 
     */
    private mouseRight=(e:any)=> {
       e.preventDefault();
       this.mouseRightCallback(e); 
    }
    /**
     * @description: 双击
     * @param {type} 
     * @return: 
     */
    private dblclick=(e:any)=> {
        debugger;
    }



}