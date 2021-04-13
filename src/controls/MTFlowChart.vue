<template>
  <div id="sample">
    <div style="width: 100%; display: flex; justify-content: space-between">
      <div
        id="myPaletteDiv"
        style="width: 120px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"
      ></div>
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
export default class MTFlowChart extends Vue {
  private name: string = "MTFlowChart";

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
    //this.load(null);
  }

  /***定义节点模板 */
  private nodeStyle() {
    return [
      // The Node.location comes from the "loc" property of the node data,
      // converted by the Point.parse static method.
      // If the Node.location is changed, it updates the "loc" property of the node data,
      // converting back using the Point.stringify static method.
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center
      }
    ];
  }

  // Define a function for creating a "port" that is normally transparent.
  // The "name" is used as the GraphObject.portId,
  // the "align" is used to determine where to position the port relative to the body of the node,
  // the "spot" is used to control how links connect with the port and whether the port
  // stretches along the side of the node,
  // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
  private makePort(
    name: string,
    align: any,
    spot: any,
    output: boolean,
    input: boolean
  ) {
    let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    // the port is basically just a transparent rectangle that stretches along the side of the node,
    // and becomes colored when the mouse passes over it
    return this.MAKE(go.Shape, {
      fill: "transparent", // changed to a color in the mouseEnter event handler
      strokeWidth: 0, // no stroke
      width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
      height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
      alignment: align, // align the port on the main Shape
      stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
      portId: name, // declare this object to be a "port"
      fromSpot: spot, // declare where links may connect at this port
      fromLinkable: output, // declare whether the user may draw links from here
      toSpot: spot, // declare where links may connect at this port
      toLinkable: input, // declare whether the user may draw links to here
      cursor: "pointer", // show a different cursor to indicate potential link point
      mouseEnter: function(e: any, port: any) {
        // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
      },
      mouseLeave: function(e: any, port: any) {
        port.fill = "transparent";
      }
    });
  }
  /**文字样式 */
  private textStyle() {
    return {
      font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
      stroke: "#F8F8F8"
    };
  }

  // Make link labels visible if coming out of a "conditional" node.
  // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
  private showLinkLabel(e: any) {
    let label = e.subject.findObject("LABEL");
    if (label !== null)
      label.visible = e.subject.fromNode.data.category === "Conditional";
  }

  private animateFadeDown(e: any) {
    let diagram = e.diagram;
    let animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900;
    // Fade "down", in other words, fade in from above
    animation.add(
      diagram,
      "position",
      diagram.position.copy().offset(0, 200),
      diagram.position
    );
    animation.add(diagram, "opacity", 0, 1);
    animation.start();
  }

  /**获取json格式数据 */
  private getJsonData() {
    return this.myDiagram.model.toJson();
  }

  private save() {
    //document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    //myDiagram.isModified = false;
  }

  private load(obj: any) {
    if (obj == null || obj.nodeDataArray == null || obj.linkDataArray) {
      obj.nodeDataArray = [
        {
          category: "Comment",
          loc: "360 -10",
          text: "Kookie Brittle",
          key: -13
        },
        { key: -1, category: "Start", loc: "175 0", text: "Start" },
        { key: 0, loc: "-5 75", text: "Preheat oven to 375 F" },
        {
          key: 1,
          loc: "175 100",
          text:
            "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"
        },
        {
          key: 2,
          loc: "175 200",
          text: "Gradually beat in 1 cup sugar and 2 cups sifted flour"
        },
        {
          key: 3,
          loc: "175 290",
          text: "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"
        },
        {
          key: 4,
          loc: "175 380",
          text: "Press evenly into ungreased 15x10x1 pan"
        },
        {
          key: 5,
          loc: "355 85",
          text: "Finely chop 1/2 cup of your choice of nuts"
        },
        { key: 6, loc: "175 450", text: "Sprinkle nuts on top" },
        { key: 7, loc: "175 515", text: "Bake for 25 minutes and let cool" },
        { key: 8, loc: "175 585", text: "Cut into rectangular grid" },
        { key: -2, category: "End", loc: "175 660", text: "Enjoy!" }
      ];

      obj.linkDataArray = [
        { from: 1, to: 2, fromPort: "B", toPort: "T" },
        { from: 2, to: 3, fromPort: "B", toPort: "T" },
        { from: 3, to: 4, fromPort: "B", toPort: "T" },
        { from: 4, to: 6, fromPort: "B", toPort: "T" },
        { from: 6, to: 7, fromPort: "B", toPort: "T" },
        { from: 7, to: 8, fromPort: "B", toPort: "T" },
        { from: 8, to: -2, fromPort: "B", toPort: "T" },
        { from: -1, to: 0, fromPort: "B", toPort: "T" },
        { from: -1, to: 1, fromPort: "B", toPort: "T" },
        { from: -1, to: 5, fromPort: "B", toPort: "T" },
        { from: 5, to: 4, fromPort: "B", toPort: "T" },
        { from: 0, to: 4, fromPort: "B", toPort: "T" }
      ];
    }

    let json = {
      class: "go.GraphLinksModel",
      linkFromPortIdProperty: "fromPort",
      linkToPortIdProperty: "toPort",
      nodeDataArray: obj.nodeDataArray,
      linkDataArray: obj.linkDataArray
    };

    this.myDiagram.model = go.Model.fromJson(json);
  }

  // print the diagram by opening a new window holding SVG images of the diagram contents for each page
  private printDiagram() {
    let svgWindow: any = window.open();
    if (!svgWindow) return; // failure to open a new Window
    var printSize = new go.Size(700, 960);
    var bnds = this.myDiagram.documentBounds;
    var x = bnds.x;
    var y = bnds.y;
    while (y < bnds.bottom) {
      while (x < bnds.right) {
        var svg = this.myDiagram.makeSVG({
          scale: 1.0,
          position: new go.Point(x, y),
          size: printSize
        });
        svgWindow.document.body.appendChild(svg);
        x += printSize.width;
      }
      x = bnds.x;
      y += printSize.height;
    }
    setTimeout(function() {
      svgWindow.print();
    }, 1);
  }

  /**组件初始化 */
  private init() {
    // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    this.MAKE = go.GraphObject.make; // for conciseness in defining templates

    this.myDiagram = this.MAKE(
      go.Diagram,
      "myDiagramDiv", // must name or refer to the DIV HTML element
      {
        LinkDrawn: this.showLinkLabel, // this DiagramEvent listener is defined below
        LinkRelinked: this.showLinkLabel,
        ///启用撤消和重做
        "undoManager.isEnabled": true, // enable undo & redo
        isReadOnly: this.optionInfo.isReadOnly, //只读
        ////有鼠标滚轮事件放大和缩小，而不是向上和向下滚动
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "initialPosition":new go.Point(-350,-50),
        "canStart":false,
        //hasHorizontalScrollbar: false, //去除水平滚动条
        //hasVerticalScrollbar: false, //去除竖直滚动条

        grid: this.MAKE(
          go.Panel,
          "Grid", //网格
          this.MAKE(go.Shape, "LineH", {
            stroke: "lightgray",
            strokeWidth: 0.5
          }),
          this.MAKE(go.Shape, "LineH", {
            stroke: "gray",
            strokeWidth: 0.5,
            interval: 10
          }),
          this.MAKE(go.Shape, "LineV", {
            stroke: "lightgray",
            strokeWidth: 0.5
          }),
          this.MAKE(go.Shape, "LineV", {
            stroke: "gray",
            strokeWidth: 0.5,
            interval: 10
          })
        ),
        layout: this.MAKE(go.TreeLayout, {
          angle: 90,
          arrangement: go.TreeLayout.ArrangementVertical
        })
      }
    );

    ////修改文档后，在标题上添加“ *”并启用“保存”按钮
    let that = this;
    that.myDiagram.addDiagramListener("Modified", function(e: any) {
      let button: any = document.getElementById("SaveButton");
      if (button) button.disabled = !that.myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (that.myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });

    // helper definitions for node templates
    //this.nodeStyle();

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    //this.makePort();

    // define the Node templates for regular nodes
    that.myDiagram.nodeTemplateMap.add(
      "", // the default category
      that.MAKE(
        go.Node,
        "Table",
        that.nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        that.MAKE(
          go.Panel,
          "Auto",
          that.MAKE(
            go.Shape,
            "Rectangle",
            { fill: "#00A9C9", stroke: "#00A9C9", strokeWidth: 3.5 },
            new go.Binding("figure", "figure")
          ),
          that.MAKE(
            go.TextBlock,
            that.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        ),
        // four named ports, one on each side:
        that.makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
        that.makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
        that.makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
        that.makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    );

    that.myDiagram.nodeTemplateMap.add(
      "Conditional",
      that.MAKE(
        go.Node,
        "Table",
        that.nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        that.MAKE(
          go.Panel,
          "Auto",
          that.MAKE(
            go.Shape,
            "Diamond",
            // { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
            { fill: "#00A9C9", strokeWidth: 0 },
            new go.Binding("figure", "figure")
          ),
          that.MAKE(
            go.TextBlock,
            that.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        ),
        // four named ports, one on each side:
        that.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        that.makePort("L", go.Spot.Left, go.Spot.Left, true, true),
        that.makePort("R", go.Spot.Right, go.Spot.Right, true, true),
        that.makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    that.myDiagram.nodeTemplateMap.add(
      "Start",
      that.MAKE(
        go.Node,
        "Table",
        that.nodeStyle(),
        that.MAKE(
          go.Panel,
          "Auto",
          that.MAKE(
            go.Shape,
            "Circle",

            //   {
            //     desiredSize: new go.Size(70, 70),
            //     fill: "#282c34",
            //     stroke: "#09d3ac",
            //     strokeWidth: 3.5
            //   }
            { minSize: new go.Size(40, 40), fill: "#79C900", strokeWidth: 0 }
          ),
          that.MAKE(
            go.TextBlock,
            "Start",
            that.textStyle(),
            new go.Binding("text")
          )
        ),
        // three named ports, one on each side except the top, all output only:
        that.makePort("L", go.Spot.Left, go.Spot.Left, true, false),
        that.makePort("R", go.Spot.Right, go.Spot.Right, true, false),
        that.makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    that.myDiagram.nodeTemplateMap.add(
      "End",
      that.MAKE(
        go.Node,
        "Table",
        that.nodeStyle(),
        that.MAKE(
          go.Panel,
          "Auto",
          that.MAKE(
            go.Shape,
            "Circle",
            { minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }
            //   {
            //     desiredSize: new go.Size(60, 60),
            //     fill: "#282c34",
            //     stroke: "#DC3C00",
            //     strokeWidth: 3.5
            //   }
          ),
          that.MAKE(
            go.TextBlock,
            "End",
            that.textStyle(),
            new go.Binding("text")
          )
        ),
        // three named ports, one on each side except the bottom, all input only:
        that.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        that.makePort("L", go.Spot.Left, go.Spot.Left, false, true),
        that.makePort("R", go.Spot.Right, go.Spot.Right, false, true)
      )
    );

    // taken from ../extensions/Figures.js:
    go.Shape.defineFigureGenerator("File", function(shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, 0, true); // starting point
      geo.add(fig);
      fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      var fig2 = new go.PathFigure(0.75 * w, 0, false);
      geo.add(fig2);
      // The Fold
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
      geo.spot1 = new go.Spot(0, 0.25);
      geo.spot2 = go.Spot.BottomRight;
      return geo;
    });

    that.myDiagram.nodeTemplateMap.add(
      "Comment",
      that.MAKE(
        go.Node,
        "Auto",
        that.nodeStyle(),
        that.MAKE(
          go.Shape,
          "File",
          // {
          //   fill: "#282c34",
          //   stroke: "#DEE0A3",
          //   strokeWidth: 3
          // }
          { fill: "#EFFAB4", strokeWidth: 0 }
        ),
        that.MAKE(
          go.TextBlock,
          that.textStyle(),
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit, // 尺寸自适应
            textAlign: "center",
            editable: true, // 文字可编辑
            font: "bold 12pt Helvetica, Arial, sans-serif",
            stroke: "#454545"
          },
          new go.Binding("text").makeTwoWay()
        )
        // no ports, because no links are allowed to connect with a comment
      )
    );

    // replace the default Link template in the linkTemplateMap
    that.myDiagram.linkTemplate = that.MAKE(
      go.Link, // the whole link panel
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        // mouse-overs subtly highlight links:
        mouseEnter: function(e: any, link: any) {
          link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
        },
        mouseLeave: function(e: any, link: any) {
          link.findObject("HIGHLIGHT").stroke = "transparent";
        },
        selectionAdorned: false
      },
      new go.Binding("points").makeTwoWay(),
      that.MAKE(
        go.Shape, // the highlight shape, normally transparent
        {
          isPanelMain: true,
          strokeWidth: 8,
          stroke: "transparent",
          name: "HIGHLIGHT"
        }
      ),
      that.MAKE(
        go.Shape, // the link path shape
        { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
        new go.Binding("stroke", "isSelected", function(sel) {
          return sel ? "dodgerblue" : "gray";
        }).ofObject()
      ),
      that.MAKE(
        go.Shape, // the arrowhead
        { toArrow: "standard", strokeWidth: 0, fill: "gray" }
      ),
      that.MAKE(
        go.Panel,
        "Auto", // the link label, normally not visible
        {
          visible: false,
          name: "LABEL",
          segmentIndex: 2,
          segmentFraction: 0.5
        },
        new go.Binding("visible", "visible").makeTwoWay(),
        that.MAKE(
          go.Shape,
          "RoundedRectangle", // the label shape
          { fill: "#F8F8F8", strokeWidth: 0 }
        ),
        that.MAKE(
          go.TextBlock,
          "是", // the label
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#333333",
            editable: true
          },
          new go.Binding("text").makeTwoWay()
        )
      )
    );

    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    that.myDiagram.toolManager.linkingTool.temporaryLink.routing =
      go.Link.Orthogonal;
    that.myDiagram.toolManager.relinkingTool.temporaryLink.routing =
      go.Link.Orthogonal;

    //that.load(); // load an initial diagram from some JSON text

    // initialize the Palette that is on the left side of the page
    const myPalette = that.MAKE(
      go.Palette,
      "myPaletteDiv", // must name or refer to the DIV HTML element
      {
        // Instead of the default animation, use a custom fade-down
        "animationManager.initialAnimationStyle": go.AnimationManager.None,
        InitialAnimationStarting: that.animateFadeDown, // Instead, animate with this function

        nodeTemplateMap: that.myDiagram.nodeTemplateMap, // share the templates used by myDiagram
        model: new go.GraphLinksModel([
          // specify the contents of the Palette
          { category: "Start", text: "开始" },
          { text: "步骤" },
          { category: "Conditional", text: "条件" },
          { category: "End", text: "结束" },
          { category: "Comment", text: "注解" }
        ])
      }
    );

    // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
  }
}
</script>
<style scoped lang="scss">
</style>
