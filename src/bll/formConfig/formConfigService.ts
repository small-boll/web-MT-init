import { base_model } from "@/model/base_model";

export class formConfigService {
  // 查列表
  public async getList(): Promise<base_model> {
    let data = {
      code: 200,
      data: [
        {
          enable: true,
          name: "人员",
          remark: "居民信息",
        },
        {
          enable: true,
          name: "户所",
          remark: "户所信息，不同于户口",
        },
        {
          enable: true,
          name: "场所",
          remark: "场所信息，例如医院、饭店、旅店",
        },
        {
          enable: false,
          name: "宗教场所",
          remark: "宗教场所信息",
        }
      ],
      message: "",
      success: true,
      expendTime: 0
    };
    return data;
  }

}
