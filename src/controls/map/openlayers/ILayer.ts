/*
 * @Author: your name
 * @Date: 2020-07-27 16:02:10
 * @LastEditTime: 2020-07-27 16:50:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mthanos\src\controls\map\openlayers\ILayer.ts
 */

export abstract class ILayer {
    public source?: any;   //图层实体
    public vector?: any;    //图层实体
    public map?: any;   //地图对象
    public funcCallBack?: any; //回调函数
}
