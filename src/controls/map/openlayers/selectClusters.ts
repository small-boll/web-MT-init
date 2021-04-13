/*
  Copyright (c) 2015 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (http://www.cecill.info/).
  
  ol.interaction.SelectCluster is an interaction for selecting vector features in a cluster.
  
*/


import ol_Map from 'ol/Map';
import ol_Collection from 'ol/Collection';
import ol_layer_Vector from 'ol/layer/Vector';
import ol_source_Vector from 'ol/source/Vector';
import ol_interaction_Select from 'ol/interaction/Select';
import ol_Feature from 'ol/Feature';
import ol_geom_LineString from 'ol/geom/LineString';
import { unByKey as ol_Observable_unByKey } from 'ol/Observable';
import { easeOut as ol_easing_easeOut } from 'ol/easing';
import ol_geom_Point from 'ol/geom/Point';
import ol_style_Style from 'ol/style/Style';
import ol_style_Circle from 'ol/style/Circle';
import { utily } from './utily';
/**
 * @classdesc
 * Interaction for selecting vector features in a cluster. 
 * It can be used as an ol.interaction.Select. 
 * When clicking on a cluster, it springs apart to reveal the features in the cluster.
 * Revealed features are selectable and you can pick the one you meant.
 * Revealed features are themselves a cluster with an attribute features that contain the original feature.
 * 
 * @constructor
 * @extends {ol.interaction.Select}
 * @param {olx.interaction.SelectOptions=} options SelectOptions.
 *  @param {ol.style} options.featureStyle used to style the revealed features as options.style is used by the Select interaction.
 * 	@param {boolean} options.selectCluster false if you don't want to get cluster selected
 * 	@param {Number} options.pointRadius to calculate distance between the features
 * 	@param {bool} options.spiral means you want the feature to be placed on a spiral (or a circle)
 * 	@param {Number} options.circleMaxObject number of object that can be place on a circle
 * 	@param {Number} options.maxObjects number of object that can be drawn, other are hidden
 * 	@param {bool} options.animate if the cluster will animate when features spread out, default is false
 * 	@param {Number} options.animationDuration animation duration in ms, default is 500ms
 * @fires ol.interaction.SelectEvent
 * @api stable
 */
export class selectClusters extends ol_interaction_Select {
    private pointRadius: number = 0;
    private circleMaxObjects: number = 0;
    private maxObjects: number = 0;
    private spiral: boolean = false;
    private animate: any = null;
    private animationDuration: number = 0;
    private selectCluster_: boolean = false;
    private overlayLayer_: any = null;
    private filter_: any = null;
    private utily = new utily();
    private isMouseRIght:boolean = false;
    constructor(options: any) {
        super(options);
        options = options || {};
        var fn;
        this.pointRadius = options.pointRadius || 12;
        this.circleMaxObjects = options.circleMaxObjects || 10;
        this.maxObjects = options.maxObjects || 60;
        this.spiral = (options.spiral !== false);
        this.animate = options.animate;
        this.animationDuration = options.animationDuration || 500;
        this.selectCluster_ = (options.selectCluster !== false);

        // Create a new overlay layer for 
        var overlay = this.overlayLayer_ = new ol_layer_Vector({
            source: new ol_source_Vector({
                features: new ol_Collection(),
                wrapX: options.wrapX,
                useSpatialIndex: true
            }),
            name: 'Cluster overlay',
            updateWhileAnimating: true,
            updateWhileInteracting: true,
            displayInLayerSwitcher: false,
            style: options.featureStyle
        });

        // Add the overlay to selection
        if (options.layers) {
            if (typeof (options.layers) == "function") {
                fn = options.layers;
                options.layers = function (layer) {
                    return (layer === overlay || fn(layer));
                };
            } else if (options.layers.push) {
                options.layers.push(this.overlayLayer_);
            }
        }

        // Don't select links
        if (options.filter) {
            fn = options.filter;
            options.filter = function (f, l) {
                //if (l===overlay && f.get("selectclusterlink")) return false;
                if (!l && f.get("selectclusterlink")) return false;
                else return fn(f, l);
            };
        } else options.filter = function (f, l) {
            //if (l===overlay && f.get("selectclusterlink")) return false; 
            if (!l && f.get("selectclusterlink")) return false;
            else return true;
        };
        this.filter_ = options.filter;

        ol_interaction_Select.call(this, options);
        (this as any).on("select", this.selectCluster.bind(this));
    }

    /**
     * Remove the interaction from its current map, if any,  and attach it to a new
     * map, if any. Pass `null` to just remove the interaction from the current map.
     * @param {ol.Map} map Map.
     * @api stable
     */
    private setMap(map: any) {
        if ((this as any).getMap()) {
            (this as any).getMap().removeLayer(this.overlayLayer_);
        }
        if ((this as any)._listener) ol_Observable_unByKey((this as any)._listener);
        (this as any)._listener = null;

        ol_interaction_Select.prototype.setMap.call(this, map);
        this.overlayLayer_.setMap(map);

        if (map && map.getView()) {
            (this as any)._listener = map.getView().on('change:resolution', this.clear.bind(this));
        }

    }

    /**
     * Clear the selection, close the cluster and remove revealed features
     * @api stable
     */
    public clear() {
        (this as any).getFeatures().clear();
        this.overlayLayer_.getSource().clear();
    }

    /**
     * Get the layer for the revealed features
     * @api stable
     */
    public getLayer() {
        return this.overlayLayer_;
    };

    /**
     * Select a cluster 
     * @param {ol.SelectEvent | ol.Feature} a cluster feature ie. a feature with a 'features' attribute.
     * @api stable
     */
    public selectCluster(e: any) {
        debugger;
        // It's a feature => convert to SelectEvent
        if (e instanceof ol_Feature) {
            e = { selected: [e] };
        }
        // Nothing selected
        if (!e.selected.length) {
            this.clear();
            return;
        }

        // Get selection
        var feature = e.selected[0];
        // It's one of ours
        if (feature.get('selectclusterfeature')) return;

        // Clic out of the cluster => close it
        var source = this.overlayLayer_.getSource();
        source.clear();

        var cluster = feature.get('features');
        // Not a cluster (or just one feature)
        if (!cluster || cluster.length == 1) return;

        // Remove cluster from selection
        if (!this.selectCluster_) (this as any).getFeatures().clear();

        var center = feature.getGeometry().getCoordinates();
        // Pixel size in map unit
        var pix = (this as any).getMap().getView().getResolution();
        var r = pix * this.pointRadius * (0.5 + cluster.length / 4);
        var a, i, max;
        var p, cf, lk;

        // The features
        var features: any = [];

        // Draw on a circle
        if (!this.spiral || cluster.length <= this.circleMaxObjects) {
            max = Math.min(cluster.length, this.circleMaxObjects);
            for (i = 0; i < max; i++) {
                a = 2 * Math.PI * i / max;
                if (max == 2 || max == 4) a += Math.PI / 4;
                p = [center[0] + r * Math.sin(a), center[1] + r * Math.cos(a)];
                cf = new ol_Feature({ 'selectclusterfeature': true, 'features': [cluster[i]], geometry: new ol_geom_Point(p) });
                cf.setStyle(cluster[i].getStyle());
                features.push(cf);
                lk = new ol_Feature({ 'selectclusterlink': true, geometry: new ol_geom_LineString([center, p]) });
                features.push(lk);
            }
        }
        // Draw on a spiral
        else {
            // Start angle
            a = 0;
            r;
            var d = 2 * this.pointRadius;
            max = Math.min(this.maxObjects, cluster.length);
            // Feature on a spiral
            for (i = 0; i < max; i++) {
                // New radius => increase d in one turn
                r = d / 2 + d * a / (2 * Math.PI);
                // Angle
                a = a + (d + 0.1) / r;
                var dx = pix * r * Math.sin(a)
                var dy = pix * r * Math.cos(a)
                p = [center[0] + dx, center[1] + dy];
                cf = new ol_Feature({ 'selectclusterfeature': true, 'features': [cluster[i]], geometry: new ol_geom_Point(p) });
                cf.setStyle(cluster[i].getStyle());
                features.push(cf);
                lk = new ol_Feature({ 'selectclusterlink': true, geometry: new ol_geom_LineString([center, p]) });
                features.push(lk);
            }
        }

        source.clear();
        if (this.animate) {
            this.animateCluster_(center, features);
        } else {
            source.addFeatures(features);
        }
    }

    /**
     * Animate the cluster and spread out the features
     * @param {ol.Coordinates} the center of the cluster
     */
    public animateCluster_(center: any, features: any) {
        // Stop animation (if one is running)
        if ((this as any).listenerKey_) {
            ol_Observable_unByKey((this as any).listenerKey_);
        }

        // Features to animate
        // var features = this.overlayLayer_.getSource().getFeatures();
        if (!features.length) return;

        var style = this.overlayLayer_.getStyle();
        var stylefn = (typeof (style) == 'function') ? style : style.length ? function () { return style; } : function () { return [style]; };
        var duration = this.animationDuration || 500;
        var start = new Date().getTime();

        // Animate function
        let self: any = this;
        function animate(event: any) {
            var vectorContext = event.vectorContext || self.utily.getVectorContext(event);
            // Retina device
            var ratio = event.frameState.pixelRatio;
            var res = self.getMap().getView().getResolution();
            var e = ol_easing_easeOut((event.frameState.time - start) / duration);
            for (var i = 0, feature; feature = features[i]; i++) if (feature.get('features')) {
                var pt = feature.getGeometry().getCoordinates();
                pt[0] = center[0] + e * (pt[0] - center[0]);
                pt[1] = center[1] + e * (pt[1] - center[1]);
                var geo = new ol_geom_Point(pt);
                // Image style
                var st = stylefn(feature, res);
                for (var s = 0; s < st.length; s++) {
                    var sc;
                    // OL < v4.3 : setImageStyle doesn't check retina
                    var imgs = ol_Map.prototype.getFeaturesAtPixel ? false : st[s].getImage();
                    if (imgs) {
                        sc = imgs.getScale();
                        imgs.setScale(ratio);
                    }
                    // OL3 > v3.14
                    if (vectorContext.setStyle) {
                        vectorContext.setStyle(st[s]);
                        vectorContext.drawGeometry(geo);
                    }
                    // older version
                    else {
                        vectorContext.setImageStyle(imgs);
                        vectorContext.drawPointGeometry(geo);
                    }
                    if (imgs) imgs.setScale(sc);
                }
            }
            // Stop animation and restore cluster visibility
            if (e > 1.0) {
                ol_Observable_unByKey(self.listenerKey_);
                self.overlayLayer_.getSource().addFeatures(features);
                self.overlayLayer_.changed();
                return;
            }

            // tell OL3 to continue postcompose animation
            event.frameState.animate = true;
        }

        // Start a new postcompose animation
        (this as any).listenerKey_ = this.overlayLayer_.on(['postcompose', 'postrender'], animate.bind(this));
        // Start animation with a ghost feature
        var feature = new ol_Feature(new ol_geom_Point((this as any).getMap().getView().getCenter()));
        feature.setStyle(new ol_style_Style({ image: new ol_style_Circle({}) }));
        this.overlayLayer_.getSource().addFeature(feature);
    }
}





