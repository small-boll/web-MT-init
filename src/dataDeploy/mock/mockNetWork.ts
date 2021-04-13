/*
 * @Author: your name
 * @Date: 2020-07-29 09:55:24
 * @LastEditTime: 2020-07-29 15:51:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mthanos\src\dataDeploy\mock\mockService.ts
 */
import axios from "axios";

const type="mock";
/* 
* 
* 请求MOCK数据
*/ 
export class mockNetWork {
    public static getMock(url: any) {
        return new Promise(async (resolve, reject) => {
            await axios.get(url+type).then((res: any) => {
                resolve({
                    code: 200,
                    data: res,
                    msg: "成功",
                    success: true,
                })
            }).catch((err: any) => reject(err));
        });
    }
}