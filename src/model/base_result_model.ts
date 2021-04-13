// import { base_model } from "@/model/base_model";
// import { base_loading_model } from "@/model/base_loading_model";
// import { base_page_model } from '../base_page_model';

// /**
//  * 【入参】测试请求入参model
//  */
// class base_par_model extends base_loading_model {
//   /**默认构造函数 */
//   public constructor() {
//     super();
//   }

//   public name!: string;
//   public email!: string;
//   public address!: string;
//   public loginName!: string;
//   public password!: string;
//   public cellphone!: string;
//   public sex!: number;
//   public pic!: string;
//   public theme!: string;
//   public language!: string;
//   public roleIds!: any;
//   public createId!: number;
//   public updateId!: number;
//   public status!: number;
//   public id!: any;
// }

// /**
//  * 【输出】测试输出结果model
//  */
// class base_result_model extends base_model {
//   /**默认构造函数 */
//   public constructor() {
//     super();
//   }
//   /**明细数据 */
//   public data!: base_result_model_detail[];
// }

// /***【输出】带分页的结果modelOK**/
// class base_page_reult_model extends base_page_model<base_result_model_detail> {
//   public constructor() { super(); }
// }

// /**
//  * 【明细数据】
//  */
// class base_result_model_detail {
//   /**默认构造函数 */
//   public constructor() { }

//   public name!: string;
//   public email!: string;
//   public address!: string;
//   public loginName!: string;
//   public password!: string;
//   public cellphone!: string;
//   public sex!: number;
//   public pic!: string;
//   public theme!: string;
//   public language!: string;
//   public roleIds!: any;
//   public createId!: number;
//   public updateId!: number;
//   public status!: number;
//   public id!: any;

// }

// /**
//  * uiModel界面数据绑定
//  */
// class base_ui_model extends base_par_model {
//   /**默认构造函数 */
//   public constructor() {
//     super();
//   }
// }

// export {
//   /**model部分 */
//   base_par_model,
//   base_result_model,
//   base_page_reult_model,
//   base_result_model_detail,
//   /**uimodel部分 */
//   base_ui_model
// };
