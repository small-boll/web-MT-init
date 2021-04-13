
import axios from "axios";

/**
 * 通过WPS服务，查询指定数据源中，离指定点最近的点数据
 * 考虑到性能问题，数据源由WFS服务提供，而不是直接指定一个图层
 *
 * @export
 * @class queryNearest
 */
export class queryNearest {
    constructor() {
        this.init();
    }

    /**
     * 服务请求模板
     *
     * @private
     * @type {string}
     * @memberof queryNearest
     */
    private templete: string = "";

    /**
     * 初始化请求类
     *
     * @return {*}  {Boolean}
     * @memberof queryNearest
     */
    private async init() {
        let templete: string = "./wpsTempletes/queryNearest.xml";

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

    public async Query(param: queryNearestParam) {
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

    private fillTemplete(templete: string, param: queryNearestParam) {
        let result: string = templete;
        let url=param.dataSourceUrl.replace(/&/g,"&amp;");
        result = result.replace("${dataSourceUrl}", url);
        result = result.replace("${x}", param.centerX.toString());
        result = result.replace("${y}", param.centerY.toString());
        return result;
    }
}

/**
 * 查询参数类
 *
 * @class queryNearestParam
 */
export class queryNearestParam {
    /**
     * Creates an instance of queryNearestParam.
     * @param {string} url WPS服务地址
     * @param {string} dataSourceUrl WFS数据源服务地址
     * @param {number} centerX 查询中心点x坐标
     * @param {number} centerY 查询中心点y坐标
     * @memberof queryNearestParam
     */
    constructor(url: string, dataSourceUrl: string, centerX: number, centerY: number) {
        this.url = url;
        this.dataSourceUrl = dataSourceUrl;
        this.centerX = centerX;
        this.centerY = centerY;
    }


    /**
     * WPS服务地址
     *
     * @type {string}
     * @memberof QueryNearestParam
     */
    public url: string = "";


    /**
     * 数据源地址
     * 
     * @type {string}
     * @memberof QueryNearestParam
     */
    public dataSourceUrl: string = "";

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
}