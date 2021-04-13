/*
 * @Author: your name
 * @Date: 2020-07-15 10:11:33
 * @LastEditTime: 2020-07-27 16:26:03
 * @LastEditors: Please set LastEditors
 * @Description: 轨迹图层
 * @FilePath: \mthanos\src\controls\map\openlayers\trackLayer.ts
 */
import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import { getVectorContext } from 'ol/render';
import { ILayer } from './ILayer';
export class trackLayer extends ILayer {
 
    private callbackFuc: any = null;

    //轨迹线集合
    private LineArray: any = [];

    private animating: boolean = false;
    private movePointStyle: any = null;
    private lineObj: any = [];      //播放线集合
    private finishLine: number = 0;  //播放完几条线

    constructor(map: any, callbackFuc: any) {
        super();
        this.map = map;
        this.callbackFuc = callbackFuc;

        this.source = new VectorSource();
        this.vector = new VectorLayer({
            source: this.source,
            style: (f: any) => {
                let stroke = new Stroke({
                    color: 'red',
                    width: 2
                });
                let value: any = f.get('linenum');
                switch (value) {
                    case 0:
                        break;
                    case 1:
                        stroke.setColor('#00FF00');
                        break;
                    case 2:
                        stroke.setColor('#0000FF');
                        break;
                    default:
                        stroke.setColor('#FFE900');
                        break;
                }
                let color = f.get('color');
                if (!!color) stroke.setColor(color);
                let width = f.get('width');
                if (!!width) stroke.setWidth(width);

                return new Style({ stroke: stroke })
            }
        });
        this.map.addLayer(this.vector);
    }

    /**
     * @description: 创建样式
     * @param {type} 
     * @return: 
     */
    private createStyle(src: any) {
        return new Style({
            image: new Icon({
                src: src
            }),
        });
    }
    /**
     * @description: 创建轨迹点移动点样式
     * @param {type} 
     * @return: 
     */
    private async createMovePointStyle() {
        let image = require("@/assets/images/map/basic/mapposition.png");
  
        await this.addImageProcess(image).then((img:any) => {
 
            let width = 40;
            let height = 48;
    
            let canvas = document.createElement('canvas');
            let context: any = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, 0, 0, width, height);

            this.movePointStyle= new Style({
                image: new Icon({
                    img: canvas,
                    imgSize: [width, height],
                })
            });
     
        }).catch((err)=>{
            console.log(`${err}`)
        })
    }

    private addImageProcess(src:any) {
        return new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = () => resolve(img)
            img.onerror = ()=>reject("加载失败")
            img.src = src;
        })
    }

    /**
     * @description: 画轨迹线
     * @param {type} 
     * @return: 
     */
    public drawLocus(arrayVertex: any, width: number = 0, color: string = "") {

        let pointList: any = [];
        let startPoint: any = null;
        let endPoint: any = null;
        let i: number = 0;
        arrayVertex.forEach((item: any) => {
            if (!!(item.lon || item.longitude) && !!(item.lat || item.latitude)) {
                pointList.push([item.lon || item.longitude, item.lat || item.latitude]);
            }
        });
        //添加起点和终点
        if (pointList.length > 0) {
            startPoint = new Feature({ geometry: new Point(pointList[0]) });
            endPoint = new Feature({ geometry: new Point(pointList[pointList.length - 1]) });
            startPoint.setStyle(this.createStyle(require("@/assets/images/map/basic/start.png")));
            endPoint.setStyle(this.createStyle(require("@/assets/images/map/basic/end.png")));
        }


        let lineFeature = new Feature(new LineString([...pointList]));
        lineFeature.set("linenum", this.LineArray.length);
        if (width > 0) lineFeature.set("width", width);
        if (!!color) lineFeature.set("color", color);

        this.source.addFeatures([lineFeature, startPoint, endPoint]);
        this.LineArray.push(pointList);
        this.lineObj.push({
            segment: 1,
            feature: null,
            points: [],
            pointsNum: -1,
            pointindex: -1
        });
        this.animating = false;
    }

    /**
     * @description: 清空轨迹线
     * @param {type} 
     * @return: 
     */
    public clearTrackLayer() {
        this.source.clear();

        this.animating = false;
        this.movePointStyle = null;
        this.lineObj = [];      //播放线集合
        this.finishLine = 0;  //播放完几条线
        this.vector.un('postrender', this.moveFeature);
    }

    private moveFeature = (event: any) => {
        var vectorContext = getVectorContext(event);

        let self = this;
        if (self.animating) {

            let nLineNum = self.LineArray.length;
            //循环多个轨迹线
            for (let i = 0; i < nLineNum; i++) {

                let pointList = self.LineArray[i];
                let nsegment = self.lineObj[i].segment;
                if (nsegment < pointList.length) {

                    ///计算每段的点数据
                    if (self.lineObj[i].pointindex < 0) {
                        self.lineObj[i].points = self.interpolation(pointList[nsegment - 1][0], pointList[nsegment - 1][1], pointList[nsegment][0], pointList[nsegment][1], 6);
                        self.lineObj[i].pointsNum = self.lineObj[i].points.length;
                        self.lineObj[i].pointindex = 0;
                    }
                    //轨迹播放
                    if (self.lineObj[i].pointindex < self.lineObj[i].pointsNum) {

                        let sPoint: any = new Feature({ geometry: new Point(self.lineObj[i].points[self.lineObj[i].pointindex]) });
                        vectorContext.drawFeature(sPoint, self.movePointStyle );
                        self.lineObj[i].pointindex++;

                        // sPoint.setStyle(this.createStyle(require("@/assets/images/map/basic/mapposition.png")));
                        // self.lineObj[i].feature = sPoint;
                    }
                    else {

                        self.lineObj[i].pointindex = -1;
                        self.lineObj[i].points = [];
                        self.lineObj[i].pointsNum = -1;
                        self.lineObj[i].segment++;
                    }
                }
                else {
                    self.finishLine++;
                }
            }

            if (self.finishLine == nLineNum) {
                self.lotusStop();
                return;
            }

        }
        else {
            // if (!self.lineObj[i].feature) {
            //     sPoint.setStyle(this.createStyle(require("@/assets/images/map/basic/mapposition.png")));
            //     self.source.addFeature(sPoint);
            //     self.lineObj[i].feature = sPoint;
            //  }
            //  else{
            //      let pt = self.lineObj[i].feature.getGeometry();
            //      pt.setCoordinates(self.lineObj[i].points[self.lineObj[i].pointindex]);
            //  }

        }
        // tell OpenLayers to continue the postrender animation
        self.map.render();
    }


    /**
       * @description: 播放轨迹
       * @param {type}
       * @return:
       */
    public async lotusStart() {
        this.animating = true;
 
        if(!this.movePointStyle)await this.createMovePointStyle();
  
        this.vector.on('postrender', this.moveFeature);
        this.map.render();
    }
    /**
     * @description: 暂停轨迹
     * @param {type}
     * @return:
     */
    public lotusSuepend() {
        this.animating = false;
    }
    /**
     * @description: 停止轨迹
     * @param {type}
     * @return:
     */
    public lotusStop() {
        this.animating = false;
        this.finishLine = 0;
        let nLineNum = this.LineArray.length;
        //循环多个轨迹线
        for (let i = 0; i < nLineNum; i++) {
            this.lineObj[i].pointindex = -1;
            this.lineObj[i].points = [];
            this.lineObj[i].pointsNum = -1;
            this.lineObj[i].segment = 1;
            this.lineObj[i].feature = null;
        }
        this.vector.un('postrender', this.moveFeature);
    }



    /**
     * 根据回放速度在两点之间进行插值
     */
    private interpolation(pointAx: number, pointAy: number, pointBx: number, pointBy: number, speed: number) {
        let tmp: any = [];
        speed = speed - 0.5; //不能大于播放速度
        let count = Math.abs(speed) * 25;
        let disX = (pointBx - pointAx) / count;
        let disY = (pointBy - pointAy) / count;
        let i = 0;
        while (i <= count) {
            let x: number = pointAx + i * disX;
            let y: number = pointAy + i * disY;
            tmp.push([x, y]);
            i++;
        }
        tmp.push([pointBx, pointBy]);//防止插值出来的最后一个点到不了B点
        return tmp;
    }


}