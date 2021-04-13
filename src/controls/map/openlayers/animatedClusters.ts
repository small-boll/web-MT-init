/*
  Copyright (c) 2015 Jean-Marc VIGLINO,
  released under the CeCILL-B license (http://www.cecill.info/).

  ol_layer_AnimatedCluster is a vector layer that animate cluster
*/
// import ol_layer_Vector from 'ol/layer/Vector'
import { Vector as ol_layer_Vector } from 'ol/layer';
import { Vector } from 'ol/source';
import ol_source_Vector from 'ol/source/Vector'
import ol_Feature from 'ol/Feature'
import {
    easeOut as ol_easing_easeOut
} from 'ol/easing'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {
    buffer as ol_extent_buffer
} from 'ol/extent';
import { Circle, Fill, Stroke, Text, Style } from 'ol/style';
import { utily } from './utily';
/*
  Copyright (c) 2015 Jean-Marc VIGLINO,
  released under the CeCILL-B license (http://www.cecill.info/).
  ol.layer.AnimatedCluster is a vector layer that animate cluster
*/
/**
 *  A vector layer for animated cluster
 * @constructor 
 * @extends {ol.layer.Vector}
 * @param {olx.layer.AnimatedClusterOptions=} options extend olx.layer.Options
 *  @param {Number} options.animationDuration animation duration in ms, default is 700ms 
 *  @param {ol.easingFunction} animationMethod easing method to use, default ol.easing.easeOut
 */
export class animatedClusters extends ol_layer_Vector {
    private oldcluster: any = null;
    private clusters: any = [];
    private animation: any = null;
    private sourceChanged: boolean = false;
    private utily = new utily();
    private styleCache: any = [];

    constructor(opt_options: any) {
        super(opt_options || {});
        var options = opt_options || {};
        this.oldcluster = new Vector();
        this.clusters = [];
        this.animation = { start: false };

        (this as any).set('animationDuration', typeof (options.animationDuration) == 'number' ? options.animationDuration : 700);
        (this as any).set('animationMethod', options.animationMethod || ol_easing_easeOut);
        // Save cluster before change
        (this as any).getSource().on('change', this.saveCluster.bind(this));
        // Animate the cluster
        (this as any).on(['precompose', 'prerender'], this.animate.bind(this));
        (this as any).on(['postcompose', 'postrender'], this.postanimate.bind(this));
    }

    //ol.ext.inherits(ol.layer.AnimatedCluster, ol.layer.Vector);
    /** save cluster features before change
     * @private
     */
    public saveCluster() {
        if (this.oldcluster) {
            this.oldcluster.clear();
            if (!(this as any).get('animationDuration')) return;
            var features = (this as any).getSource().getFeatures();
            if (features.length && features[0].get('features')) {
                this.oldcluster.addFeatures(this.clusters);
                this.clusters = features.slice(0);
                this.sourceChanged = true;
            }
        }
    }

    /** 
     * Get the cluster that contains a feature
     * @private
    */
    public getClusterForFeature(f: any, cluster: any) {
        for (var j = 0, c; c = cluster[j]; j++) {
            var features = c.get('features');
            if (features && features.length) {
                for (var k = 0, f2; f2 = features[k]; k++) {
                    if (f === f2) {
                        return c;
                    }
                }
            }
        }
        return false;
    }
    /** 
     * Stop animation 
     * @private 
     */
    public stopAnimation() {
        this.animation.start = false;
        this.animation.cA = [];
        this.animation.cB = [];
    }
    /** 
     * animate the cluster
     * @private
     */
    public animate(e: any) {
        var duration = (this as any).get('animationDuration');
        if (!duration) return;
        var resolution = e.frameState.viewState.resolution;
        var i, c0, a = this.animation;
        var time = e.frameState.time;
        // Start a new animation, if change resolution and source has changed
        if (a.resolution != resolution && this.sourceChanged) {
            var extent = e.frameState.extent;
            if (a.resolution < resolution) {

                extent = ol_extent_buffer(extent, 100 * resolution);
                a.cA = this.oldcluster.getFeaturesInExtent(extent);
                a.cB = (this as any).getSource().getFeaturesInExtent(extent);
                a.revers = false;
            } else {
                extent = ol_extent_buffer(extent, 100 * resolution);
                a.cA = (this as any).getSource().getFeaturesInExtent(extent);
                a.cB = this.oldcluster.getFeaturesInExtent(extent);
                a.revers = true;
            }
            a.clusters = [];
            for (i = 0, c0; c0 = a.cA[i]; i++) {
                var f = c0.get('features');
                if (f && f.length) {
                    var c = this.getClusterForFeature(f[0], a.cB);
                    if (c) a.clusters.push({ f: c0, pt: c.getGeometry().getCoordinates() });
                }
            }
            // Save state
            a.resolution = resolution;
            this.sourceChanged = false;
            // No cluster or too much to animate
            if (!a.clusters.length || a.clusters.length > 1000) {
                this.stopAnimation();
                return;
            }
            // Start animation from now
            time = a.start = (new Date()).getTime();
        }
        // Run animation
        if (a.start) {

            var vectorContext = e.vectorContext || this.utily.getVectorContext(e);
            var d = (time - a.start) / duration;
            // Animation ends
            if (d > 1.0) {
                this.stopAnimation();
                d = 1;
            }
            d = (this as any).get('animationMethod')(d);
            // Animate
            var style = (this as any).getStyle();
            var stylefn = (typeof (style) == 'function') ? style : style.length ? function () { return style; } : function () { return [style]; };
            // Layer opacity
            e.context.save();
            e.context.globalAlpha = (this as any).getOpacity();
            for (i = 0, c; c = a.clusters[i]; i++) {
                var pt = c.f.getGeometry().getCoordinates();
                var dx = pt[0] - c.pt[0];
                var dy = pt[1] - c.pt[1];
                if (a.revers) {
                    pt[0] = c.pt[0] + d * dx;
                    pt[1] = c.pt[1] + d * dy;
                } else {
                    pt[0] = pt[0] - d * dx;
                    pt[1] = pt[1] - d * dy;
                }
                // Draw feature
                var st = stylefn(c.f, resolution, true);
                if (!st.length) st = [st];
                // If one feature: draw the feature
                if (c.f.get("features").length === 1 && !dx && !dy) {
                    f = c.f.get("features")[0];
                }
                // else draw a point
                else {
                    var geo = new Point(pt);
                    f = new Feature(geo);
                }
                for (var k = 0, s; s = st[k]; k++) {
                    // Multi-line text
                    if (s.getText() && /\n/.test(s.getText().getText())) {
                        var offsetX = s.getText().getOffsetX();
                        var offsetY = s.getText().getOffsetY();
                        var rot = s.getText().getRotation() || 0;
                        var fontSize = Number((s.getText().getFont() || '10px').match(/\d+/)) * 1.2;
                        var str = s.getText().getText().split('\n')
                        var dl, nb = str.length - 1;
                        var s2 = s.clone();
                        // Draw each lines
                        str.forEach(function (t, i) {
                            if (i == 1) {
                                // Allready drawn
                                s2.setImage();
                                s2.setFill();
                                s2.setStroke();
                            }
                            switch (s.getText().getTextBaseline()) {
                                case 'alphabetic':
                                case 'ideographic':
                                case 'bottom': {
                                    dl = nb;
                                    break;
                                }
                                case 'hanging':
                                case 'top': {
                                    dl = 0;
                                    break;
                                }
                                default: {
                                    dl = nb / 2;
                                    break;
                                }
                            }
                            s2.getText().setOffsetX(offsetX - Math.sin(rot) * fontSize * (i - dl));
                            s2.getText().setOffsetY(offsetY + Math.cos(rot) * fontSize * (i - dl));
                            s2.getText().setText(t);
                            vectorContext.drawFeature(f, s2);
                        });
                    } else {
                        vectorContext.drawFeature(f, s);
                    }
                    /* OLD VERSION OL < 4.3
                    // Retina device
                    var ratio = e.frameState.pixelRatio;
                    var sc;
                    // OL < v4.3 : setImageStyle doesn't check retina
                    var imgs = ol.Map.prototype.getFeaturesAtPixel ? false : s.getImage();
                    if (imgs)
                    {	sc = imgs.getScale(); 
                      imgs.setScale(sc*ratio); 
                    }
                    // OL3 > v3.14
                    if (vectorContext.setStyle)
                    {	// If one feature: draw the feature
                      if (c.f.get("features").length===1 && !dx && !dy) {
                        vectorContext.drawFeature(c.f.get("features")[0], s);
                      }
                      // else draw a point
                      else {
                        vectorContext.setStyle(s);
                        vectorContext.drawGeometry(geo);
                      }
                    }
                    // older version
                    else
                    {	vectorContext.setImageStyle(imgs);
                      vectorContext.setTextStyle(s.getText());
                      vectorContext.drawPointGeometry(geo);
                    }
                    if (imgs) imgs.setScale(sc);
                    */
                }
            }
            e.context.restore();
            // tell ol to continue postcompose animation
            e.frameState.animate = true;
            // Prevent layer drawing (clip with null rect)
            e.context.save();
            e.context.beginPath();
            e.context.rect(0, 0, 0, 0);
            e.context.clip();
            (this as any).clip_ = true;
        }
        return;
    }
    /**  
     * remove clipping after the layer is drawn
     * @private
     */
    public postanimate(e: any) {
        if ((this as any).clip_) {
            e.context.restore();
            (this as any).clip_ = false;
        }
    }
}

