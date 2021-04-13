/*
 * @Author: your name
 * @Date: 2020-07-01 16:23:32
 * @LastEditTime: 2020-07-08 15:26:40
 * @LastEditors: Please set LastEditors
 * @Description: 地图测量类
 * @FilePath: \mthanos\src\controls\map\openlayers\unitityFunc.ts
 */

import 'ol/ol.css';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';
import { getArea, getLength } from 'ol/sphere';
import View from 'ol/View';
import { LineString, Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { get } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

export class measure {

  private sketch: any;
  /**
   * The help tooltip element.
   * @type {HTMLElement}
   */
  private helpTooltipElement: any = null;
  /**
   * Overlay to show the help messages.
   * @type {Overlay}
   */
  private helpTooltip: any = null;;
  /**
   * The measure tooltip element.
   * @type {HTMLElement}
   */
  private measureTooltipElement: any = null;

  private pointTooltipElement: any = null;
  /**
   * Overlay to show the measurement.
   * @type {Overlay}
   */
  private measureTooltip: any = null;;
  private pointTooltip: any = null;;
  /**
   * Message to show when the user is drawing a polygon.
   * @type {string}
   */
  private continuePolygonMsg = '继续点击绘制多边形';

  /**
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  private continueLineMsg = '继续点击绘制线';
  private source: any = null;
  private vector: any = null;

  private typeSelect = 'area';
  //地图map对象
  private map: any = null;

  private draw: any = null; // global so we can remove it later

  constructor(map: any) {
    this.map = map;

    this.source = new VectorSource();
    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)'
        }),
        stroke: new Stroke({
          color: 'red',
          width: 2
        }),
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({
            color: 'red'
          })
        })
      })
    });
    this.map.addLayer(this.vector);

    //this.map.on('pointermove', (evt: any) => { this.pointerMoveHandler(evt) });
    //this.map.on('pointermove', this.pointerMoveHandler);

    this.map.getViewport().addEventListener('mouseout', () => {
      if (this.helpTooltipElement) this.helpTooltipElement.classList.add('hidden');
    });
  }

  public distanceMeasure() {
    this.startMeasure('distance');
  }
  public areaMeasure() {
    this.startMeasure('area');
  }
  /**
   * @description: 开始测量
   * @param {type} 
   * @return: 
   */
  private startMeasure(type: string) {
    this.source.clear();
    this.map.un("click", this.drawPointMeasure);
    this.map.removeInteraction(this.draw);

    if (this.pointTooltip) this.map.removeOverlay(this.pointTooltip);

    this.typeSelect = type;
    this.addInteraction();

  }

  public clearMeasure() {
    this.source.clear();
    // this.map.un('pointermove', this.pointerMoveHandler);
    this.map.un("click", this.drawPointMeasure);
    this.map.removeInteraction(this.draw);

    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      this.helpTooltipElement = null;
    }

    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
      this.measureTooltipElement = null;
    }

    if (this.measureTooltip) this.map.removeOverlay(this.measureTooltip);
    if (this.helpTooltip) this.map.removeOverlay(this.helpTooltip);

    if (this.pointTooltipElement) {
      this.pointTooltipElement.parentNode.removeChild(this.pointTooltipElement);
      this.pointTooltipElement = null;
    }
    if (this.pointTooltip) this.map.removeOverlay(this.pointTooltip);
  }


  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */
  private pointerMoveHandler(evt: any) {
    if (evt.dragging) {
      return;
    }
    if (!this.helpTooltipElement)
      return;

    /** @type {string} */
    var helpMsg = '请点击开始绘制';

    if (this.sketch) {
      var geom = this.sketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = this.continueLineMsg;
      }
    }
    this.helpTooltipElement.style.color = 'red';
    this.helpTooltipElement.innerHTML = helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);

    this.helpTooltipElement.classList.remove('hidden');
  };

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  private formatLength(line: any) {
    var length = getLength(line, { projection: get('EPSG:4326') });
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  };


  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  private formatArea(polygon: any) {
    var area = getArea(polygon, { projection: get('EPSG:4326') });
    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  };

  private addInteraction() {
    var type = (this.typeSelect == 'area' ? 'Polygon' : 'LineString');
    this.draw = new Draw({
      source: this.source,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)'
        }),
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, 0.2)'
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
          })
        })
      })
    });
    this.map.addInteraction(this.draw);

    this.createMeasureTooltip();
    this.createHelpTooltip();

    var listener;
    this.draw.on('drawstart', (evt: any) => {

      this.source.clear();
      // this.createMeasureTooltip();
      // set sketch
      this.sketch = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      var tooltipCoord = evt.coordinate;

      listener = this.sketch.getGeometry().on('change', (evt: any) => {
        if (!!!this.measureTooltipElement) return;
        var geom = evt.target;
        var output;
        if (geom instanceof Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(tooltipCoord);
      });
    });

    this.draw.on('drawend', () => {
      if (!!!this.measureTooltipElement) return;
      this.measureTooltipElement.style.color = 'red';
      this.measureTooltip.setOffset([0, -7]);
      // unset sketch
      this.sketch = null;
      // unset tooltip so that a new one can be created
      // this.measureTooltipElement = null;
      // this.createMeasureTooltip();
      unByKey(listener);

    });
  }


  /**
   * Creates a new help tooltip
   */
  private createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    //this.helpTooltipElement.className = 'ol-tooltip hidden';
    this.measureTooltipElement.style.color = 'red';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip);
  }

  /**
   * Creates a new measure tooltip
   */
  private createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    //this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltipElement.style.color = 'red';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  }

  private createpointTooltipElement() {

    if (this.pointTooltipElement) {
      this.pointTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.pointTooltipElement = document.createElement('div');
    this.pointTooltipElement.style.color = 'red';
    this.pointTooltip = new Overlay({
      element: this.pointTooltipElement,
      offset: [0, 0],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.pointTooltip);
  }


  /**
   * @description: 点测量
   * @param {type} 
   * @return: 
   */
  public pointMeasure() {
    //this.map.setMapCursor("crosshair");
    //this.measureToolbar.setTool("location", true);
    this.clearMeasure();
    this.map.on('click', this.drawPointMeasure);

  }

  private drawPointMeasure = (e: any) => {
    if (!this.pointTooltipElement) this.createpointTooltipElement();
    this.source.clear();

    let tooltipCoord = e.coordinate;
    let output = e.coordinate[0].toFixed(4) + "," + e.coordinate[1].toFixed(4);

    this.pointTooltipElement.innerHTML = output;
    this.pointTooltip.setPosition(tooltipCoord);

    var newFeature = new Feature(new Point(tooltipCoord));
    this.source.addFeature(newFeature);
  }

}