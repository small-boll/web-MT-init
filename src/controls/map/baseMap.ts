/*
 * @Author: your name
 * @Date: 2020-05-20 09:17:29
 * @LastEditTime: 2020-07-30 16:26:16
 * @LastEditors: Please set LastEditors
 * @Description: 地图基类
 * @FilePath: \mapComponent\src\map\core\basemap.ts
 */


export class baseMap {
    // 地图对象
    public map: any = null;
    // 地图库对象
    public mapParameter: any = null;

    constructor(mapParameter: any) {
        this.mapParameter = mapParameter;
    }

    /**
   * @description: 等待库加载完成
   * @param {type}
   * @return:
   */
    public WaitScriptFinsh() {
        return new Promise(resolve => {
            let interval = setInterval(() => {
                if (!!this.map) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }
    /**
     * @description: 初始化位置和层级
     * @param {type} 经纬度 和  级别
     * @return: 无
     */
    public initPositionAndZoom(lon: number, lat: number, zoom: number) { }
    public initPosition(lon: number, lat: number) { }
    /**
     * @description: 定位加图标
     * @param {type} 
     * @return: 
     */
    public locationPosition(name: string, lon: number, lat: number, url: any, attribute: any = null) { }

    /**
     * @description:    //长度测量
     * @param {type} 
     * @return: 
     */
    public distanceMeasure() { }
    /**
   * @description:   面积测量
   * @param {type} 
   * @return: 
   */
    public areaMeasure() { }

    /**
    * @description:   点拾取
    * @param {type} 
    * @return: 
    */
    public pointMeasure() { }
    /**
     * @description:   自定义图层
     * @param {type} 
     * @return: 
     */
    public initClusterLayer(option: any, callbackfunc: any, features: any, clusterMaxZoom: number = -1) { }
    /**
   * @description: 设置弹出框的元素
   * @param {type} 
   * @return: 
   */
    public setPopupElement(name: string, div: any) { }
    /**
   * @description:   设置图层显示与隐藏
   * @param {type} 
   * @return: 
   */
    public setLayerVisible(name: string, visible: boolean) { }
    //删除所有图层
    public removeAllLayers() { }
    //删除指定图层
    public removeLayer(name: string) { }
    /**
     * @description:   清空地图数据
     * @param {type} 
     * @return: 
     */
    public clearMap() { }
    //清空GL图层
    public clearGLPointsLayer() { }
    //清空编辑图层
    public clearEditLayer() { }
    //清空定位图层
    public clearLactionLayer(name: string) { }
    /**
   * @description: 清空所有定位图层
   **/
    public clearAllLactionLayer() { }
    /**
    * @description: 清空选择
    **/
    public clearSelect() { }
    /**
   * @description:   清空测量
   * @param {type} 
   * @return: 
   */
    public clearMeasure() { }

    /**
     * @description: 放大
     * @param {type} 
     * @return: 
     */
    public ZoomIn() { }
    /**
   * @description: 缩小
   * @param {type} 
   * @return: 
   */
    public ZoomOut() { }
    /**
   * @description: 平移
   * @param {type} 
   * @return: 
   */
    public Pan() { }
    /**
     * @description: 圆选
     * @param {type}
     * @return:
     */
    public circleSelect(callbackFuc: any, isWfs: boolean = false) { }
    /**
     * @description: 矩形选
     * @param {type}
     * @return:
     */
    public rectangleSelect(callbackFuc: any, isWfs: boolean = false) { }
    /**
     * @description: 多边形选
     * @param {type}
     * @return:
     */
    public polygonSelect(callbackFuc: any, isWfs: boolean = false) { }
    /**
    * @description: 自由选
    * @param {type}
    * @return:
    */
    public freehandSelect(callbackFuc: any, isWfs: boolean = false) { }

    /**
     * @description:画轨迹
     * @param {type}
     * @return:
     */
    public drawLocus(arrayVertex: any, callbackFuc: any, width: number = 0, color: string = "") { }
    /**
   * @description: 播放轨迹
   * @param {type}
   * @return:
   */
    public lotusStart() { }
    /**
     * @description: 暂停轨迹
     * @param {type}
     * @return:
     */
    public lotusSuepend() { }
    /**
     * @description: 停止轨迹
     * @param {type}
     * @return:
     */
    public lotusStop() { }
    /**
     * @description: 添加点数据到WebGL中
     * @param {type} 
     * @return: 
     */
    public addPoints_gl(points: any, src: any) { }

    /**
    * @description: 添加点数据,可以进行编辑
    * @param {type} 
    * @return: 
    */
    public addPoints_edit(arrayVertex: any, src: any, funcCallBack: any = null) { }
    /**
 * @description: 画线
 * @param {type} 
 * @return: 
 */
    public drawPolyline(arrayVertex: any, width: number = 0, color: string = "", funcCallBack: any = null) { }

    /**
  * @description: 画面
  * @param {type} 
  * @return: 
  */
    public drawPolygon(arrayVertex: any, width: number = 0, color: string = "", fillcolor: string = "", funcCallBack: any = null) { }

    /**
    * @description: 添加点数据
    * @param {type} 
    * @return: 
    */
    public drawPoints(arrayVertex: any, url: any, funcCallBack: any = null) { }
    /**
 * @description: 清空数据
 * @param {type} 
 * @return: 
 */
    public clearcustomLayer(type: any) { }
    /**
     * @description: 添加热力图的点数据
     * @param {type} 
     * @return: 
     */
    public addPoints_heatMap(arrayVertex: any) { }
    public clearHeatmapLayer() { }

    /**
    * @description: 手动绘制点数据
    * @param {type} 
    * @return: 
    */
    public hand_drawPoint(handDrawCallback: any) { }

    /**
    * @description: 手动绘制点数据
    * @param {type} 
    * @return: 
    */
    public hand_drawPolyline(handDrawCallback: any) { }


    /**
     * @description: 手动绘制面数据
     * @param {type} 
     * @return: 
     */
    public hand_drawPolygon(handDrawCallback: any) { }


    /**
   * @description: 手动绘制点数据
   * @param {type} 
   * @return: 
   */
    public hand_drawCircle(handDrawCallback: any) { }
    public clearHandleLayer() { }
    /**
* @description: 添加饼状图的数据点
* @param {type} 
* @return: 
*/
    public addChartPoints(arrayVertex: any, Callback: any, graphType: string="pie") { }
    public clearChartLayer(){}
}