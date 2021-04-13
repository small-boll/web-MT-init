import { base_model } from './base_model';

/**
 * 分页返回模型
 */
class basePage {
    // /**
    //  * 是否最后一条
    //  */
    // public isEnd !: number;

    // /**
    //  * 下一页
    //  */
    // public nextPage!: number;

    // /**
    //  * 当前页数/页码
    //  */
    // public pageNum !: number;

    // /**
    //  * 当前页条数（每页显示多少条）
    //  */
    // public pageSize!: number;

    // /**
    //  * 总数据条数
    //  */
    // public total!: number;

    // /**
    //  * 总共多少页
    //  */
    // public totalPage!: number;

    /**
     * 当前页码
     */
    public current!: number;

    /**
     * 
     */
    public hitCount!: boolean;

    /**
     * 总共多少页
     */
    public pages!: number;

    /**
     * 
     */
    public searchCount!: boolean;

    /**
     * 当前页条数（每页显示多少条）
     */
    public size!: number;

    /**
     * 总数据条数
     */
    public total!: number;

    
}

/**
 * 分页数据返回模型
 */
class base_page_reuslt_model<T> extends basePage {
    /**
     * 数据集合
     */
    public records!: Array<T>;

    // /**
    //  * 分页信息
    //  */
    // public page!: basePage;
}

/**
 * 用于带分页查询的基础模型，继承自base_model
 * <T>指分页返回的具体实体对象
 */
class base_page_model<T> extends base_model {
    /**
     * 返回的实体数据
     * <T>指具体要返回的实体数据对象类型
     */
    public data!: base_page_reuslt_model<T>;
}

export {
    base_page_model,
    basePage,
    base_page_reuslt_model
}