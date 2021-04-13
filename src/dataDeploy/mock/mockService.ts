/*
 * @Author: your name
 * @Date: 2020-07-29 09:51:19
 * @LastEditTime: 2020-07-29 15:51:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mthanos\src\dataDeploy\mock\index.ts
 */ 
import Mock from "mockjs";  
import { mockTest } from "@/dataDeploy/mock/data/mockTest"; 

const type="mock";

Mock.mock("/authority/captcha"+type, "get", mockTest.fRandomBy());