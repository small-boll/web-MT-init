/**
 * 添加地图功能
 */
export class mapObj {
    public map: any = null;
    public T: any = null;
    public menuAdd: any = null;
    public menumodify: any = null;

    constructor() {
    }

    public setMap(map: any) { this.map = map; }
    public getMap() { return this.map; }
    public setT(T: any) { this.T = T; }
    public getT() { return this.T; }

    public centerAndZoom(lon: any, lat: any, zoom: number) {
        this.map.centerAndZoom(new this.T.LngLat(lon, lat), zoom);
    }
    public panTo(lon: any, lat: any) {
        this.map.panTo(new this.T.LngLat(lon, lat));
    }
    public PanToLngLat(LngLat:any){
        this.map.panTo(LngLat);
    }
    public removeOverLay(overlay: any) {
        this.map.removeOverLay(overlay);
    }
    
    /**
     * @description: 生成点对象
     * @param {type} 
     * @return: 
     */
    public point(lon: any, lat: any) {
        return new this.T.LngLat(lon, lat);
    }
    /**
     * @description: 生成点实体
     * @param {type} 
     * @return: 
     */
    public addMarker(lon: any, lat: any, url: string, sizex: number = 31, sizey: number = 36) {
        var icon = new this.T.Icon({
            iconUrl: url,
            iconSize: new this.T.Point(sizex, sizey)
        });

        //创建标注对象
        var marker = new this.T.Marker(new this.T.LngLat(lon, lat), { icon: icon });
        //向地图上添加标注
        this.map.addOverLay(marker);

        return marker;
    }

    /**
     * @description: 添加标注
     * @param {type} 
     * @return: 
     */
    public addLable(lon: any, lat: any, text: string) {
        if(!!!text) return null;
        let len: number = text.length;
        let nGap = len * 2 + 1

        var latlng = new this.T.LngLat(lon, lat);
        var label = new this.T.Label({
            text: text,
            position: latlng,
            offset: new this.T.Point(-1 * (30 + nGap * 2), -27)
        });
        label.setBackgroundColor("transparent");
        //创建地图文本对象
        this.map.addOverLay(label);

        return label;
    }

    /**
     * @description: 添加点和标注
     * @param {type} 
     * @return: 
     */
    public addMarkerAndLable(lon: any, lat: any, text: string, url: string, sizex: number = 31, sizey: number = 36) {
        this.addMarker(lon, lat, url, sizex, sizey);
        this.addLable(lon, lat, text);
    }
    /**
     * @description: 画线
     * @param {type} 
     * @return: 
     */
    public addLine(points: any, color: any, weight: number = 3, opacity: number = 0.8) {
        var line = new this.T.Polyline(points, {
            color: color,
            weight: weight,
            opacity: opacity,
            lineStyle: "solid"

        });
        //向地图上添加线
        this.map.addOverLay(line);
        return line;
    }
    /**
     * @description: 显示弹出菜单
     * @param {type} 
     * @return: 
     */
    // public showMenuAdd(callback: any) {
    //     if (!!this.menuAdd) return false;
    //     this.menuAdd = new this.T.ContextMenu({
    //         width: 70
    //     });
    //     var _MenuItem2 = new this.T.MenuItem("后退", ()=> {callback("undo")});
    //     this.menuAdd.addItem(_MenuItem2);
    //     var _MenuItem3 = new this.T.MenuItem("完成",  ()=> {callback("finish")});
    //     this.menuAdd.addItem(_MenuItem3);
    //     this.map.addContextMenu(this.menuAdd);
    //     return true;
    // }
    public showMenuModity(callback: any) {
        if (!!this.menumodify) return false;
        this.menumodify = new this.T.ContextMenu({
            width: 70
        });
        var _MenuItem1 = new this.T.MenuItem("后退", ()=> {callback("undo")});
        this.menumodify.addItem(_MenuItem1);
        var _MenuItem2 = new this.T.MenuItem("删除", ()=> {callback("delete")});
        this.menumodify.addItem(_MenuItem2);
        var _MenuItem3 = new this.T.MenuItem("完成", ()=> {callback("finish")});
        this.menumodify.addItem(_MenuItem3);
        this.map.addContextMenu(this.menumodify);
        return true;
    }

 
}
