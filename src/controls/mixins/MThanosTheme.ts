import { Vue, Component, Emit, Watch } from 'vue-property-decorator'
import { Getter, Action } from "vuex-class";



/**
* mixins
*/
@Component
export default class MThanosThemeMixin extends Vue {
    @Action("setThemeName") setThemeName!: any;
    @Getter("getThemeName") getThemeName!: string;

    private themeName: string = ""; //主题名称

    /**
     * 组件加载完成
     */
    private mounted() { 
        this.themeName = this.getThemeName;
        this.setThemeName(this.themeName);
    }

    /**
     * 监听主题变化
     */
    @Watch("themeName")
    private watchThemeName(newVal: any, oldVal: any) {
        this.themeName = newVal;
        this.setThemeName(newVal);
    }
}
