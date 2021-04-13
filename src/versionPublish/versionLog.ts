/**
 * 版本发布日志
 */
class versionLog {
  /**
   * 获取所有版本列表
   */
  public getVersionList(): Array<versionLogModel> {
    var versionList = new Array<versionLogModel>();

    //加入版本V1.11.07.01版本发布记录
    versionList.push(this.get_20191212_02_verion());

    //每次发布时在此处加入

    return versionList;
  }

  /**
   * 20191126_01版本发布记录
   */
  private get_20191212_02_verion(): versionLogModel {
    var version = new versionLogModel();
    version.version = "V1.12.12.02";
    version.publishDate = "2019-12-12";
    version.buildDate = "2019-12-12";
    version.updateContentList = new Array<string>();
    version.updateContentList.push("1. 首页子按钮增加点击显示隐藏功能");
    version.updateContentList.push("2. 人脸预警详情增加以图搜图和视频联动入口");
    version.publishAutor = "lavender";
    version.buildAutor = "lavender";

    return version;
  }
}

/**
 * 版本更新日志模型
 */
class versionLogModel {
  /**
   * 版本号
   */
  public version!: string;

  /**
   * 版本构建日期
   */
  public buildDate!: string;

  /**
   * 版本构建人员
   */
  public buildAutor!: string;

  /**
   * 版本发布日期
   */
  public publishDate!: string;

  /**
   * 版本发布人员
   */
  public publishAutor!: string;

  /**
   * 版本更新内容，暂时先写在一起
   * 后续需要拆分成多个列表字段，
   * 包含新增功能、修改功能、解决Bug等列表
   */
  public updateContentList!: Array<string>;
}

export {
  versionLog, versionLogModel
}