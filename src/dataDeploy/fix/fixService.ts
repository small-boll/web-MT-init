/*
 * @Author: your name
 * @Date: 2020-07-29 09:51:19
 * @LastEditTime: 2020-07-29 15:50:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mthanos\src\dataDeploy\mock\index.ts
 */ 
import Mock from "mockjs"; 
import { fixTest } from "@/dataDeploy/fix/data/fixTest"; 
const type="fix";

Mock.mock("/authority/captcha"+type, "get", fixTest.trackOpt);