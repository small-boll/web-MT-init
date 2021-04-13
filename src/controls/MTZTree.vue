<template>
  <div id="sample">
    <div style="width: 100%; display: flex; justify-content: space-between">
      <ul id="zTree" class="ztree"></ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";

import "@/assets/zTree_v3/js/jquery-1.4.4.min.js";
import "@/assets/zTree_v3/js/jquery.ztree.all.min.js";
// import "@/assets/zTree_v3/js/jquery.ztree.core.min.js";
// import "@/assets/zTree_v3/js/jquery.ztree.excheck.min.js";
// import "@/assets/zTree_v3/js/jquery.ztree.exedit.min.js";
import "@/assets/zTree_v3/js/ztree.extendfunc.js";

/**
 * 帮助文档参考api
 * https://www.jyvtc.edu.cn/dzb/uiFramework/js/zTree-v3.2/api/API_cn.html
 * http://www.treejs.cn/v3/api.php
 */
import { showIconInfo } from "@/controls/base/BaseOption";

@Component
export default class MTZTree extends Vue {
  private name: string = "MTZTree";

  @Prop({
    default: {}
  })
  option!: any;

  @Prop({
    default: {}
  })
  zNodes!: Array<any>;

  private optionInfo: any = {
    isReadOnly: this.option.isReadOnly || false,
    beforeExpand: this.option.beforeExpand,
    onAsyncSuccess: this.option.onAsyncSuccess,
    childrenName: this.option.childrenName || "children",
    name: this.option.name || "name",
    idKey: this.option.idKey || "id",
    pIdKey: this.option.pIdKey || "pId",
    rootPId: this.option.rootPId || 0,
    zTreeOnCheck: this.option.zTreeOnCheck,
    zTreeOnClick: this.option.zTreeOnClick
  };

  private setting = {
    async: {
      enable: true
      //url: getUrl
    },
    check: {
      enable: true
    },

    data: {
      key: {
        children: this.optionInfo.childrenName,
        name: this.optionInfo.name
      },
      simpleData: {
        enable: true,
        idKey: this.optionInfo.idKey,
        pIdKey: this.option.pIdKey,
        rootPId: this.option.rootPId
      }
    },
    view: {
      addDiyDom: this.addDiyDom,
      showIcon: false
    },
    callback: {
      beforeExpand: this.beforeExpand,
      onAsyncSuccess: this.optionInfo.onAsyncSuccess,
      beforeClick: this.beforeClick,
      onClick: this.zTreeOnClick,
      onCheck: this.zTreeOnCheck
      //onAsyncError: onAsyncError
    }
  };

  private zTree: any = null;

  private destroyed() {
    this.destoryTree();
    this.zTree = null;
  }

  /**释放ztree */
  private destoryTree() {
    $.fn.zTree.destroy();
  }

  /**
   * 获取被选中的集合（和getCheckedNodes不同，getCheckedNodes是选框勾选）而此为节点文字被选中
   * @param checked
   */
  public getSelectedNodes(): Array<any> {
    if (!!this.zTree) {
      return this.zTree.getSelectedNodes();
    }
    return [];
  }

  /**
   * checked为true则获取被勾选中的集合，checked为false则获取未被勾选的集合
   * @param checked
   */
  public getCheckedNodes(checked: boolean): Array<any> {
    if (!!this.zTree) {
      return this.zTree.getCheckedNodes(checked);
    }
    return [];
  }

  /**
   * 选择节点
   * @param key
   * @param val
   */
  public selectzTreeNode(key: string = "id", val: any) {
    if (!!this.zTree) {
      let node = this.zTree.getNodeByParam(key, val);
      if (node != null) {
        this.zTree.selectNode(node, true); //指定选中ID的节点
      }
    }
  }

  /**
   *  根据节点id 批量删除子节点
   * @param key
   * @param nodes
   */
  public removeZTreeNodebPi(key: string = "id", nodes: []) {
    if (!!this.zTree) {
      for (let i = 0; i < nodes.length; i++) {
        let node = this.zTree.getNodeByParam(key, nodes[i]);
        if (node != null) {
          this.zTree.selectNode(node, true); //指定选中ID的节点
        }
      }
    }
  }

  /**
   *  删除子节点 --勾选节点
   * @param obj
   */
  public removeZTreeNodeByChecked() {
    if (!!this.zTree) {
      let nodes = this.zTree.getCheckedNodes(true); //获取勾选节点
      for (let i = 0; i < nodes.length; i++) {
        this.zTree.removeNode(nodes[i]);
      }
    }
  }

  /**
   * 修改子节点
   * @param node
   */
  public editZTreeNode(node: any) {
    if (!!this.zTree) {
      let nodes = this.zTree.getSelectedNodes();
      for (let i = 0; i < nodes.length; i++) {
        nodes[i] = node;
        this.zTree.updateNode(nodes[i]);
      }
    }
  }

  /**
   * 添加节点
   * @param node
   */
  public addZTreeNode(node: any, showIcon?: showIconInfo[]) {
    if (!!this.zTree) {
      let parentZNode = this.zTree.getSelectedNodes(); //获取父节点
      node.nodeFlg = 1; // 可以自定义节点标识
      node = this.zTree.addNodes(parentZNode[0], node, true);
      if (!!node && !!showIcon) {
        this.addZTreeNodeHtml(node, showIcon);
      }
    }
    return node;
  }

  /**
   * 添加节点
   * @param node
   */
  public addZTreeNodeHtml(node: any, showIcon?: showIconInfo[]) {
    if (!!node && !!showIcon) {
      this.$nextTick(() => {
        let nodes = node instanceof Array ? node : [node];
        for (let i = 0; i < nodes.length; i++) {
          $("#" + nodes[i].tId + "_menu").remove();
          let ul = $(
            "<ul id='" + nodes[i].tId + "_menu' class='zTree_menu'></ul>"
          );
          for (let j = 0; j < showIcon.length; j++) {
            let li = $("<li></li>");
            let a = $("<a href='javascript:void(0);'></a>").html(showIcon[j].content);
            if (showIcon[j].click) {
              a.bind("click", function() {
                showIcon[j].click(showIcon[j]);
              });
            }
            li.append(a);
            ul.append(li);
          }
          $("#" + nodes[i].tId + "_a").after(ul);
        }
      });
    }
  }

  /**
   * 该方法来源于ztree官网模糊搜索demo源码。
   * @param controlId 对象的id,不需要#
   * @param searchFlag 值为1时根据节点name进行模糊搜索，值为2时根据id进行模糊搜索
   */
  public searchNodeLazy(
    controlId: string,
    keyWords: string,
    searchFlag: string = "1"
  ) {
    $.fn.zTree.extendfunc.fuzzySearch(
      "zTree",
      "#" + controlId,
      null,
      true,
      searchFlag
    ); //初始化模糊搜索方法
  }

  /**刷新组件 */
  public refresh() {
    this.load();
  }

  /** 用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作*/
  private beforeExpand(treeId: any, treeNode: any) {
    if (!!this.optionInfo.beforeExpand) {
      this.optionInfo.beforeExpand(treeId, treeNode);
    }
  }
  /**用于捕获异步加载正常结束的事件回调函数 */
  private onAsyncSuccess(event: any, treeId: any, treeNode: any, msg: any) {
    if (!!this.optionInfo.onAsyncSuccess) {
      this.optionInfo.onAsyncSuccess(event, treeId, treeNode, msg);
    }
  }
  /**
 * 用于在节点上固定显示用户自定义控件

1. 大数据量的节点加载请注意：在 addDiyDom 中针对每个节点 查找 DOM 对象并且添加新 DOM 控件，
肯定会影响初始化性能；如果不是必须使用，建议不使用此功能
2. 属于高级应用，使用时请确保对 zTree 比较了解。
 */
  private addDiyDom(treeId: any, treeNode: any) {
    //debugger;
    treeNode.name = treeNode.label;
    if (!!this.optionInfo.addDiyDom) {
      this.optionInfo.addDiyDom(treeId, treeNode);
    }
  }

  /**点击前触发 */
  private beforeClick(treeId: any, treeNode: any) {
    if (!!this.optionInfo.beforeClick) {
      this.optionInfo.beforeClick(treeId, treeNode);
    }
  }
  /**点击节点触发 */
  private zTreeOnClick(event: any, treeId: any, treeNode: any) {
    if (!!this.optionInfo.zTreeOnClick) {
      this.optionInfo.zTreeOnClick(event, treeId, treeNode);
    }
  }
  /**选中节点出发 */
  private zTreeOnCheck(event: any, treeId: any, treeNode: any) {
    if (!!this.optionInfo.zTreeOnCheck) {
      this.optionInfo.zTreeOnCheck(event, treeId, treeNode);
    }
  }

  /**
   *组件加载完毕
   */
  private mounted() {
    this.load();
  }

  private load() {
    this.destoryTree();
    this.zTree = $.fn.zTree.init($("#zTree"), this.setting, this.zNodes);
  }

  //private Refresh(){}
}
</script>
<style lang="scss">
@import "../assets/zTree_v3/css/zTreeStyle/zTreeStyle.css";
.zTree_menu {
  display: inline-block;
  li {
    display: inline-block;
  }
}
</style>
