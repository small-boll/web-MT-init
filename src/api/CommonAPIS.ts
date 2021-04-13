/**
 * 公共api
 */
const CommonAPIS = {
  /**
   * 字典
   */
  mt_dict: {
    /**
     *传入dict
     */
    mt_dict_child_list_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/child-list",
      method: "get",
    },
    /**
     *传入dict 业务系统字典
     */
    mt_dictbiz_child_list_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict-biz/child-list",
      method: "get",
    },
    /**
     *传入dict
     */
    mt_dict_detail_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/detail",
      method: "get",
    },
    /**
     *获取字典
     */
    mt_dict_dictionary_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/dictionary",
      method: "get",
    },
    /**
     *传入dict
     */
    mt_dict_list_api: {
      baseUrl: "mtHttpUrl",
      url: "/sysDict/all",
      method: "get",
    },
    /**
     *传入dict
     */
    mt_dict_parent_list_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/parent-list",
      method: "get",
    },
    /**
     *树形结构
     */
    mt_dict_parent_tree_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/parent-tree",
      method: "get",
    },
    /**
     *传入ids
     */
    mt_dict_remove_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/remove",
      method: "post",
    },
    /**
     *传入dict
     */
    mt_dict_submit_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/submit",
      method: "post",
    },
    /**
     *树形结构
     */
    mt_dict_tree_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-system/dict/tree",
      method: "get",
    },
  },
  /**
   * 公共功能（上传、下载）
   */
  mt_common: {
    mt_uploadUrl_api: {
      baseUrl: "mtHttpUrl",
      url: "/blade-resource/oss/endpoint/put-file",
      method: "post",
    },
  },
  /**
   * 乡镇街道
   */
  mt_basics: {
    /**
     * 查询乡镇（街道办）
     */
    mt_community_township_api: {
      baseUrl: "mtHttpUrl",
      url: "/community-base/base/township",
      method: "get",
    },

    /**
     * 查询社区
     */
    mt_community_village_api: {
      baseUrl: "mtHttpUrl",
      url: "/community-base/base/village",
      method: "get",
    },

    /**
     * 查询查询省市区
     */
    mt_community_getAreaTree_api: {
      baseUrl: "mtHttpUrl",
      url: "/community-base/base/getAreaTree",
      method: "get",
    },
  },

  mt_file: {
    mt_uploadFile_api: {
      baseUrl: "mtHttpUrl",
      url: "/file/upload",
      method: "post",
    },
  }

};

export { CommonAPIS };
