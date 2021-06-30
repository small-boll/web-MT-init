<template>
  <div class="MapIndex2-template">
    <div class="map-contain"
         id="mapdiv"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

@Component({})
export default class MapIndex2 extends Vue {
  private map: Map = null;
  private viewOl: View = null;
  private layersOl = Array<any>();

  private mounted() {
    debugger
    let layer = new VectorLayer({
      title: "first Map",
      source: new VectorSource({
        projection: "EPSG:4326",
        url: "./mapDitu.json",
        format: new GeoJSON(),
      }),
    });
    this.layersOl.push(layer);

    this.viewOl = new View({
      center: [114.37524819351535, 30.576546015969555],
      zoom: 8,
    });
    this.map = new Map({
      target: "mapdiv",
      layers: this.layersOl,
      view: this.viewOl,
    });
  }
}
</script>

<style lang="scss">
.MapIndex2-template {
  width: 100%;
  height: 100%;
  .map-contain{
    width: 60%;
    height: 70%;
  }
}
</style>