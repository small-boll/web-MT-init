<template>
  <div id="sample">
    <div style="width: 100%; display: flex; justify-content: space-between">
      <div id="myDiagramDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

// 破解GoJS v2.1.15 ：修改go.js b.V[Ra("7eba17a4ca3b1a8346")][Ra("78a118b7")](b.V, Kk, 4, 4); 替换为  function () { return true; };
import go from "gojs";

@Component
export default class MTTreeView extends Vue {
  private name: string = "MTTreeView";

  @Prop({
    default: {}
  })
  option!: any;

  private optionInfo: any = {
    isReadOnly: this.option.isReadOnly || false
  };

  private MAKE: any = new Object();
  private myDiagram: any = new Object();

  /**
   *组件加载完毕
   */
  private mounted() {
    //debugger;
    this.init();
    //this.$nextTick(() => {
      
    //});
     let that=this;
    setTimeout(() => {
        that.load();
    }, 300);
  }

  private load() {
    var nodeDataArray = [{ key: 0 }];
    var max = 1000;
    var count = 0;
    while (count < max) {
      count = this.makeTree(3, count, max, nodeDataArray, nodeDataArray[0]);
    }
    this.myDiagram.model = new go.TreeModel(nodeDataArray);
  }

  private makeTree(
    level: number,
    count: number,
    max: number,
    nodeDataArray: any,
    parentdata: any
  ) {
    var numchildren = Math.floor(Math.random() * 10);
    for (var i = 0; i < numchildren; i++) {
      if (count >= max) return count;
      count++;
      var childdata = { key: count, parent: parentdata.key };
      nodeDataArray.push(childdata);
      if (level > 0 && Math.random() > 0.5) {
        count = this.makeTree(level - 1, count, max, nodeDataArray, childdata);
      }
    }
    return count;
  }

  /**获取json格式数据 */
  private getJsonData() {
    return this.myDiagram.model.toJson();
  }

  private save() {
    //document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    //myDiagram.isModified = false;
  }

  /**组件初始化 */
  private init() {
    // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    this.MAKE = go.GraphObject.make; // for conciseness in defining templates

    let that = this;
    this.myDiagram = this.MAKE(go.Diagram, "myDiagramDiv", {
      allowMove: false,
      allowCopy: false,
      allowDelete: false,
      allowHorizontalScroll: false,
      layout: this.MAKE(go.TreeLayout, {
        alignment: go.TreeLayout.AlignmentStart,
        angle: 0,
        compaction: go.TreeLayout.CompactionNone,
        layerSpacing: 16,
        layerSpacingParentOverlap: 1,
        nodeIndentPastParent: 1.0,
        nodeSpacing: 0,
        setsPortSpot: false,
        setsChildPortSpot: false
      })
    });

    // This button assumes data binding to the "checked" property.
    go.GraphObject.defineBuilder("TriStateCheckBoxButton", function(args) {
      var button = /** @type {Panel} */ go.GraphObject.make(
        "Button",
        {
          "ButtonBorder.fill": "white",
          width: 14,
          height: 14
        },
        go.GraphObject.make(
          go.Shape,
          {
            name: "ButtonIcon",
            geometryString: "M0 0 M0 8.85 L4.9 13.75 16.2 2.45 M16.2 16.2", // a 'check' mark
            strokeWidth: 2,
            stretch: go.GraphObject.Fill, // this Shape expands to fill the Button
            geometryStretch: go.GraphObject.Uniform, // the check mark fills the Shape without distortion
            background: null,
            visible: false // visible set to false: not checked, unless data.checked is true
          },
          new go.Binding("visible", "checked", function(p) {
            return p === true || p === null;
          }),
          new go.Binding("stroke", "checked", function(p) {
            return p === null ? null : "black";
          }),
          new go.Binding("background", "checked", function(p) {
            return p === null ? "gray" : null;
          })
        )
      );

      function updateCheckBoxesDown(node: any, val: any) {
        node.diagram.model.setDataProperty(node.data, "checked", val);
        node.findTreeChildrenNodes().each(function(child: any) {
          updateCheckBoxesDown(child, val);
        });
      }

      function updateCheckBoxesUp(node: any) {
        var parent = node.findTreeParentNode();
        if (parent !== null) {
          var anychecked = parent.findTreeChildrenNodes().any(function(n:any) {
            return n.data.checked !== false && n.data.checked !== undefined;
          });
          var allchecked = parent.findTreeChildrenNodes().all(function(n:any) {
            return n.data.checked === true;
          });
          node.diagram.model.setDataProperty(
            parent.data,
            "checked",
            allchecked ? true : anychecked ? null : false
          );
          updateCheckBoxesUp(parent);
        }
      }

      button.click = function(e: any, button: any) {
        if (!button.isEnabledObject()) return;
        var diagram = e.diagram;
        if (diagram === null || diagram.isReadOnly) return;
        if (diagram.model.isReadOnly) return;
        e.handled = true;
        var shape = button.findObject("ButtonIcon");
        diagram.startTransaction("checkbox");
        // Assume the name of the data property is "checked".
        var node = button.part;
        var oldval = node.data.checked;
        var newval = oldval !== true; // newval will always be either true or false, never null
        // Set this data.checked property and those of all its children to the same value
        updateCheckBoxesDown(node, newval);
        // Walk up the tree and update all of their checkboxes
        updateCheckBoxesUp(node);
        // support extra side-effects without clobbering the click event handler:
        if (typeof button["_doClick"] === "function")
          button["_doClick"](e, button);
        diagram.commitTransaction("checkbox");
      };

      return button;
    });

    that.myDiagram.nodeTemplate = that.MAKE(
      go.Node,
      {
        // no Adornment: instead change panel background color by binding to Node.isSelected
        selectionAdorned: false,
        // a custom function to allow expanding/collapsing on double-click
        // this uses similar logic to a TreeExpanderButton
        doubleClick: function(e: any, node: any) {
          var cmd = that.myDiagram.commandHandler;
          if (node.isTreeExpanded) {
            if (!cmd.canCollapseTree(node)) return;
          } else {
            if (!cmd.canExpandTree(node)) return;
          }
          e.handled = true;
          if (node.isTreeExpanded) {
            cmd.collapseTree(node);
          } else {
            cmd.expandTree(node);
          }
        }
      },
      that.MAKE("TreeExpanderButton", {
        width: 14,
        "ButtonBorder.fill": "whitesmoke",
        "ButtonBorder.stroke": "lightgray",
        _buttonFillOver: "rgba(0,128,255,0.25)",
        _buttonStrokeOver: null,
        _buttonFillPressed: "rgba(0,128,255,0.4)"
      }),
      that.MAKE(
        go.Panel,
        "Horizontal",
        {
          position: new go.Point(16, 0),
          margin: new go.Margin(0, 2, 0, 0),
          defaultAlignment: go.Spot.Center
        },
        new go.Binding("background", "isSelected", function(s) {
          return s ? "lightblue" : "white";
        }).ofObject(),
        that.MAKE("TriStateCheckBoxButton"),
        that.MAKE(
          go.TextBlock,
          {
            font: "9pt Verdana, sans-serif",
            margin: new go.Margin(0, 0, 0, 2)
          },
          new go.Binding("text", "key", function(s) {
            return "item " + s;
          })
        )
      ) // end Horizontal Panel
    ); // end Node

    that.myDiagram.linkTemplate = that.MAKE(go.Link);
    // that.myDiagram.linkTemplate = that.MAKE(
    //   go.Link,
    //   {
    //     selectable: false,
    //     routing: go.Link.Orthogonal,
    //     fromEndSegmentLength: 4,
    //     toEndSegmentLength: 4,
    //     fromSpot: new go.Spot(0.001, 1, 7, 0),
    //     toSpot: go.Spot.Left
    //   },
    //   that.MAKE(go.Shape, { stroke: "gray", strokeDashArray: [1, 2] })
    // );
  }
}
</script>
<style scoped lang="scss">
</style>
