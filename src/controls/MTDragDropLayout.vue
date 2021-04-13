<template>
  <div class="row">
    <div class="col-5">
      <h3>可用组件列表</h3>
      <draggable
        class="dragArea list-group"
        :list="list1"
        :group="{ name: 'comp', pull: 'clone', put: false }"
        @change="log"
      >
        <div class="list-group-item" v-for="element in list1" :key="element.id">{{ element.name }}</div>
      </draggable>
    </div>
    <div class="col-5">
      <h3>组件配置页面展示</h3>
      <draggable
        tag="el-collapse"
        class="dragArea list-group"
        :list="list2"
        group="comp"
        @change="log"
      >
        <el-collapse
          class="list-group-item left"
          v-for="(element,index) in list2"
          :key="index"
          v-model="activeNames"
          @change="handleChange"
        >
          <el-collapse-item :name="element.id">
            <template slot="title">
              <span>{{element.name}}</span>
              <i class="el-icon-circle-close" @click.stop="deleteItem(index)"></i>
            </template>
            <div v-if=" element.type=='button'">
              <el-button>默认按钮</el-button>
            </div>
            <div v-else-if=" element.type=='input'">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div v-else-if=" element.type=='select'">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div v-else-if=" element.type=='switch'">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </div>
            <div v-else-if=" element.type=='slider'">
              <el-slider v-model="value1"></el-slider>
            </div>
            <div v-else-if=" element.type=='time-select'">
              <el-time-select
                v-model="value"
                :picker-options="{
    start: '08:30',
    step: '00:15',
    end: '18:30'
  }"
                placeholder="选择时间"
              ></el-time-select>
            </div>
            <div v-else-if=" element.type=='el-rate'">
              <el-rate v-model="value1"></el-rate>
            </div>
          </el-collapse-item>
        </el-collapse>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "clone",
  display: "Clone",
  order: 2,
  components: {
    draggable,
  },
  data() {
    return {
      list1: [
        {
          name: "Button 按钮",
          id: 1,
          content: "内容内容内容。。。。",
          type: "button",
        },
        {
          name: "Input 输入框",
          id: 2,
          content: "内容内容内容。。。。",
          type: "input",
        },
        {
          name: "Select 选择器",
          id: 3,
          content: "内容内容内容。。。。",
          type: "select",
        },
        {
          name: "Switch 开关",
          id: 4,
          content: "内容内容内容。。。。",
          type: "switch",
        },
        {
          name: "Slider 滑块",
          id: 5,
          content: "内容内容内容。。。。",
          type: "slider",
        },
        {
          name: "TimePicker 时间选择器",
          id: 6,
          content: "内容内容内容。。。。",
          type: "time-select",
        },
        {
          name: "Rate 评分",
          id: 7,
          content: "内容内容内容。。。。",
          type: "el-rate",
        },
      ],
      list2: [],
      activeNames: [],
      count: 0,

      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
    };
  },
  methods: {
    log: function (evt) {
      console.log(evt);
      if (evt.added) {
        this.count += 1;
        const item = evt.added.element;
        const idx = this.list2.findIndex((e) => e.id === item.id);
        let temp = JSON.parse(JSON.stringify(this.list2));
        temp[idx].id = this.count;
        this.list2 = temp;
      }
    },
    handleChange: function () {},
    deleteItem: function (index) {
      this.list2.splice(index, 1);
    },
  },
};
</script>
<style>
.row {
  display: flex;
  width: 100%;
}
.col-5 {
  flex: 0 0 40%;
  max-width: 40%;
  margin-right: 10%;
}
.list-group {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border: 0;
}
.list-group-item:first-child {
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-sizing: border-box;
}
.el-collapse-item__header {
  border: 0;
  height: 40px;
  line-height: 40px;
}
.el-collapse-item__wrap {
  border-bottom: 0;
}
.list-group-item {
  cursor: move;
}
h3 {
  font-size: 28px;
  margin-bottom: 20px;
}
.el-icon-circle-close {
  color: #c9a2a2;
  font-size: 20px;
  position: absolute;
  right: 50px;
}
.el-icon-circle-close:hover {
  color: #f40;
}
</style>