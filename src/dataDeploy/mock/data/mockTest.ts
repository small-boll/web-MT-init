/*
 * @Author: your name
 * @Date: 2020-07-29 09:18:10
 * @LastEditTime: 2020-07-29 09:54:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mthanos\src\dataDeploy\mock\mkTest.ts
 */
import Mock from "mockjs";
import {
    Random
} from "mockjs"; // 引入random对象,随机生成数据的对象，（与占位符@一样）

export class mockTest {

    static fRandomBy() {
        let backData: any = [];
        for (let i = 0; i < 5; i++) {
            //定义数据模板
            //其中模板由三部分组成：属性名，生成规则，属性值 'name|role':value
            //其中value值可以是：
            /**
             *      字符串：String
             *      数字：Number
             *      布尔类型：Boolean
             *      对象：Object
             *      数组：Array
             *      函数：Function
             *      正则表达式：RegExp
             * 
             */
            let template = {
                'Boolean': Random.boolean, // 可以生成基本数据类型
                'Natural': Random.natural(5, 10), // 生成1到100之间自然数
                'Integer': Random.integer(5, 100), // 生成1到100之间的整数
                'Float': Random.float(0, 100, 0, 3), // 生成0到100之间的浮点数,小数点后尾数为0到5位
                'Character': Random.character(), // 生成随机字符串,可加参数定义规则
                'String': Random.string(2, 10), // 生成2到10个字符之间的字符串
                'Range': Random.range(0, 10, 2), // 生成一个随机数组
                'Date': Random.date(), // 生成一个随机日期,可加参数定义日期格式
                'Color': Random.color(), // 生成一个颜色随机值
                'Paragraph': Random.paragraph(4, 5), //生成2至5个句子的文本
                'Name': Random.name(), // 生成姓名
                'Url': Random.url(), // 生成web地址
                'Address': Random.province() // 生成地址
            }
            backData.push(template)
        }
        return backData;
    }




}
