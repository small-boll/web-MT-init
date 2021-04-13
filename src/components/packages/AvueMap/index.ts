// 从 avue-plugin-map 0.0.8 移植出来，为了解决打开预览时的此报错：
// Invalid prop: type check failed for prop "value". Expected Object, got String with value "".
import AvueMap from './AvueMap.vue'

export default {
  install (Vue: any) {
    Vue.component('AvueMap', AvueMap);
  }
}
