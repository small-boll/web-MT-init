import Config from './config'
import FormDesign from './index.vue'

export default {
  install (Vue: any) {
    Vue.use(Config)
    Vue.component('Avue' + FormDesign.name, FormDesign);
  }
}
