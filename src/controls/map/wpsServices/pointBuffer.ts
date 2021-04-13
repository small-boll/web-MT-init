
import axios from "axios";

/**
 * 通过WPS服务，计算一个点坐标的缓冲区
 *
 * @export
 * @class pointBuffer
 */
export class pointBuffer {
    constructor() {
        debugger;
        this.init();
    }

    /**
     * 服务请求模板
     *
     * @private
     * @type {string}
     * @memberof pointBuffer
     */
    private templete: string = "";

    /**
     * 初始化请求类
     *
     * @return {*}  {Boolean}
     * @memberof pointBuffer
     */
    private async init() {
        let templete: string = "./wpsTempletes/pointBuffer.xml";

        new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: templete,
                headers: { "content-type": "text/xml" },
            })
                .then((res: any) => {
                    resolve(res);
                    this.templete = res.data;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        });
    }

    public async Query(param: pointBufferParam) {
        debugger;
        let result = this.fillTemplete(this.templete, param);
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: param.url,
                headers: { "content-type": "text/xml" },
                data: result
            })
                .then((res: any) => {
                    resolve(res.data);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        });
    }

    private fillTemplete(templete: string, param: pointBufferParam) {
        let result: string = templete;
        result = result.replace("${x}", param.centerX.toString());
        result = result.replace("${y}", param.centerY.toString());
        result = result.replace("${distance}", param.distance.toString());
        result = result.replace("${quadrantSegments}", param.quadrantSegments.toString());
        return result;
    }
}

/**
 * 查询参数类
 *
 * @class pointBufferParam
 */
export class pointBufferParam {

    constructor(url: string, centerX: number, centerY: number, distance: number, quadrantSegments: number = 8) {
        this.url = url;
        this.centerX = centerX;
        this.centerY = centerY;
        this.distance = distance;
        this.quadrantSegments = quadrantSegments;
    }


    /**
     * WPS服务地址
     *
     * @type {string}
     * @memberof QueryNearestParam
     */
    public url: string = "";

    /**
     * 查询中心点x坐标
     *
     * @type {number}
     * @memberof QueryNearestParam
     */
    public centerX: number;

    /**
     * 查询中心点y坐标
     *
     * @type {number}
     * @memberof QueryNearestParam
     */
    public centerY: number;

    /**
     * 缓冲区半径，单位：米
     *
     * @type {number}
     * @memberof pointBufferParam
     */
    public distance: number;

    /**
     * 点密度，每四分之一个圆具有的点数量。默认为8.
     *
     * @type {number}
     * @memberof pointBufferParam
     */
    public quadrantSegments: number = 8;
}