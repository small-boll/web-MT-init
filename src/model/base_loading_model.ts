/**
 * base_loading_model用于http请求时，loading加载区域设置
 */
export class base_loading_model {
    /**
     * 默认构造函数
     */
    public constructor() { }

    /**
     * loading加载区域设置 ,默认：body，即全屏显示loading
     * 请在需要使用全局loading或者局部loading效果时给值。默认为可为空参数
     */
    public loadingTarget?: string;

    /**头部参数 */
    //public headers?:any;
}


