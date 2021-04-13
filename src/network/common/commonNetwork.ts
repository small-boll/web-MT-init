import { GlobalAPI } from "@/api/GlobalAPI";
import { mtConsole } from "@/utils/mtConsole";
import { httpAsync } from "@/network/axiosHelper.ts";

export class commonNetwork {
  /**
   * 构造函数
   */
  public constructor() {}

  /**
   * 上传图片
   */
  public async uploadUrl(params: any) {
    const resultData: any = await httpAsync(
      GlobalAPI.CommonAPIS.mt_file.mt_uploadFile_api.baseUrl,
      GlobalAPI.CommonAPIS.mt_file.mt_uploadFile_api.url,
      GlobalAPI.CommonAPIS.mt_file.mt_uploadFile_api.method,
      params
    );
    mtConsole.log("【文件上传common_network】 resultData", resultData);

    return resultData;
  }
}
