/*	Copyright (c) 2015 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*
*  Add a chart style to display charts (pies or bars) on a map 
*/

import ol_style_RegularShape from 'ol/style/RegularShape'
import ol_style_Fill from 'ol/style/Fill'
import { asString as ol_color_asString } from 'ol/color'

/**
 * @requires ol.style.Circle
 * @requires ol.structs.IHasChecksum
 */
/**
 * @classdesc
 * Set chart style for vector features.
 *
 * @constructor
 * @param {} options
 *	@param {String} options.type Chart type: pie,pie3D, donut or bar
 *	@param {number} options.radius Chart radius/size, default 20
 *	@param {number} options.rotation Rotation in radians (positive rotation clockwise). Default is 0.
 *	@param {bool} options.snapToPixel use integral numbers of pixels, default true
 *	@param {_ol_style_Stroke_} options.stroke stroke style
 *	@param {String|Array<ol_color>} options.colors predefined color set "classic","dark","pale","pastel","neon" / array of color string, default classic
 *	@param {number} options.offsetX X offset in px
 *	@param {number} options.offsetY Y offset in px
 *	@param {number} options.animation step in an animation sequence [0,1]
 *	@param {number} options.max maximum value for bar chart
 * @see [Statistic charts example](../../examples/style/map.style.chart.html)
 * @extends {ol_style_RegularShape}
 * @implements {ol.structs.IHasChecksum}
 * @api
 */

export class chartStyle extends ol_style_RegularShape {
  private stroke_: any;
  private radius_: number;
  private donutratio_: number;
  private type_: string;
  private offset_: any;
  private animation_: any;
  private max_: number;
  private data_: any;
  private colors_: any;

  private colors = {
    "classic": ["#ffa500", "blue", "red", "green", "cyan", "magenta", "yellow", "#0f0"],
    "dark": ["#960", "#003", "#900", "#060", "#099", "#909", "#990", "#090"],
    "pale": ["#fd0", "#369", "#f64", "#3b7", "#880", "#b5d", "#666"],
    "pastel": ["#fb4", "#79c", "#f66", "#7d7", "#acc", "#fdd", "#ff9", "#b9b"],
    "neon": ["#ff0", "#0ff", "#0f0", "#f0f", "#f00", "#00f"]
  };

  constructor(opt_options: any) {
    super(opt_options);
    var options = opt_options || {};
    var strokeWidth = 0;
    if (opt_options.stroke) strokeWidth = opt_options.stroke.getWidth();
    ol_style_RegularShape.call(this, {
      radius: options.radius + strokeWidth,
      fill: new ol_style_Fill({ color: [0, 0, 0] }),
      rotation: options.rotation,
      snapToPixel: options.snapToPixel
    });
    if (options.scale) (this as any).setScale(options.scale);

    this.stroke_ = options.stroke;
    this.radius_ = options.radius || 20;
    this.donutratio_ = options.donutRatio || 0.5;
    this.type_ = options.type;
    this.offset_ = [options.offsetX ? options.offsetX : 0, options.offsetY ? options.offsetY : 0];
    this.animation_ = (typeof (options.animation) == 'number') ? { animate: true, step: options.animation } : this.animation_ = { animate: false, step: 1 };
    this.max_ = options.max;

    this.data_ = options.data;
    if (options.colors instanceof Array) {
      this.colors_ = options.colors;
    } else {
      this.colors_ = this.colors[options.colors];
      if (!this.colors_) this.colors_ = this.colors.classic;
    }

    this.renderChart_();
  }



  /**
   * Clones the style. 
   * @return {ol_style_Chart}
   */
  public clone() {
    let s: any = new chartStyle({
      type: this.type_,
      radius: this.radius_,
      rotation: (this as any).getRotation(),
      scale: (this as any).getScale(),
      data: this.getData(),
      snapToPixel: (this as any).getSnapToPixel() ? (this as any).getSnapToPixel() : false,
      stroke: this.stroke_,
      colors: this.colors_,
      offsetX: this.offset_[0],
      offsetY: this.offset_[1],
      animation: this.animation_
    });
    s.setScale((this as any).getScale());
    s.setOpacity((this as any).getOpacity());
    return s;
  }

  /** Get data associatied with the chart
  */
  public getData() {
    return this.data_;
  }

  /** Set data associatied with the chart
  *	@param {Array<number>}
  */
  public setData(data: any) {
    this.data_ = data;
    this.renderChart_();
  }

  /** Get symbol radius
  */
  public getRadius() {
    return this.radius_;
  }

  /** Set symbol radius
  *	@param {number} symbol radius
  *	@param {number} donut ratio
  */
  public setRadius(radius: any, ratio: any) {
    this.radius_ = radius;
    // this.donuratio_ = ratio || this.donuratio_;
    this.renderChart_();
  }

  /** Set animation step 
  *	@param {false|number} false to stop animation or the step of the animation [0,1]
  */
  public setAnimation(step: any) {
    if (step === false) {
      if (this.animation_.animate == false) return;
      this.animation_.animate = false;
    } else {
      if (this.animation_.step == step) return;
      this.animation_.animate = true;
      this.animation_.step = step;
    }
    this.renderChart_();
  }


  /** @private
  */
  public renderChart_() {
    var strokeStyle;
    var strokeWidth = 0;

    if (this.stroke_) {
      strokeStyle = ol_color_asString(this.stroke_.getColor());
      strokeWidth = this.stroke_.getWidth();
    }

    // no atlas manager is used, create a new canvas
    var canvas = (this as any).getImage();

    // draw the circle on the canvas
    var context = (canvas.getContext('2d'));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineJoin = 'round';

    var sum = 0;
    var i, c;
    for (i = 0; i < this.data_.length; i++) {
      sum += this.data_[i];
    }

    // reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    // then move to (x, y)
    context.translate(0, 0);

    var step = this.animation_.animate ? this.animation_.step : 1;
    //console.log(this.animation_.step)

    // Draw pie
    switch (this.type_) {
      case "donut":
      case "pie3D":
      case "pie": {
        var a, a0 = Math.PI * (step - 1.5);
        c = canvas.width / 2;
        context.strokeStyle = strokeStyle;
        context.lineWidth = strokeWidth;
        context.save();
        if (this.type_ == "pie3D") {
          context.translate(0, c * 0.3);
          context.scale(1, 0.7);
          context.beginPath();
          context.fillStyle = "#369";
          context.arc(c, c * 1.4, this.radius_ * step, 0, 2 * Math.PI);
          context.fill();
          context.stroke();
        }
        if (this.type_ == "donut") {
          context.save();
          context.beginPath();
          context.rect(0, 0, 2 * c, 2 * c);
          context.arc(c, c, this.radius_ * step * this.donutratio_, 0, 2 * Math.PI);
          context.clip("evenodd");
        }
        for (i = 0; i < this.data_.length; i++) {
          context.beginPath();
          context.moveTo(c, c);
          context.fillStyle = this.colors_[i % this.colors_.length];
          a = a0 + 2 * Math.PI * this.data_[i] / sum * step;
          context.arc(c, c, this.radius_ * step, a0, a);
          context.closePath();
          context.fill();
          context.stroke();
          a0 = a;
        }
        if (this.type_ == "donut") {
          context.restore();
          context.beginPath();
          context.strokeStyle = strokeStyle;
          context.lineWidth = strokeWidth;
          context.arc(c, c, this.radius_ * step * this.donutratio_, Math.PI * (step - 1.5), a0);
          context.stroke();
        }
        context.restore();
        break;
      }
      case "bar":
      default: {
        var max = 0;
        if (this.max_) {
          max = this.max_;
        } else {
          for (i = 0; i < this.data_.length; i++) {
            if (max < this.data_[i]) max = this.data_[i];
          }
        }
        var s = Math.min(5, 2 * this.radius_ / this.data_.length);
        c = canvas.width / 2;
        var b = canvas.width - strokeWidth;
        var x, x0 = c - this.data_.length * s / 2
        context.strokeStyle = strokeStyle;
        context.lineWidth = strokeWidth;
        for (i = 0; i < this.data_.length; i++) {
          context.beginPath();
          context.fillStyle = this.colors_[i % this.colors_.length];
          x = x0 + s;
          var h = this.data_[i] / max * 2 * this.radius_ * step;
          context.rect(x0, b - h, s, h);
          //console.log ( x0+", "+(b-this.data_[i]/max*2*this.radius_)+", "+x+", "+b);
          context.closePath();
          context.fill();
          context.stroke();
          x0 = x;
        }

      }
    }

    // Set Anchor
    var anchor = (this as any).getAnchor();
    anchor[0] = c - this.offset_[0];
    anchor[1] = c - this.offset_[1];
  }
}




