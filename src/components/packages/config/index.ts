import Input from './input.vue'
import Textarea from './textarea.vue'
import Number from './number.vue'
import Dynamic from './dynamic.vue'
import Switch from './switch.vue'
import Rate from './rate.vue'
import Slider from './slider.vue'
import Color from './color.vue'
import Radio from './radio.vue'
import Checkbox from './checkbox.vue'
import Select from './select.vue'
import Cascader from './cascader.vue'
import Tree from './tree.vue'
import Date from './date.vue'
import Upload from './upload.vue'
import UEditor from './ueditor.vue'
import Map from './map.vue'
import Group from './group.vue'
import Array from './array.vue'

const components = [
  Input,
  Textarea,
  Number,
  Dynamic,
  Switch,
  Rate,
  Slider,
  Color,
  Radio,
  Checkbox,
  Select,
  Cascader,
  Tree,
  Date,
  UEditor,
  Upload,
  Map,
  Group,
  Array
]

const Config = {
  install (Vue: any) {
    if ((this as any).installed) return
    (this as any).installed = true

    components.map(component => {
      Vue.component(component.name, component);
    })
  }
}

export default Config
