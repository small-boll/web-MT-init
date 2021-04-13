<template>
  <!-- 语言切换 -->
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <el-tooltip
      class="item"
      effect="dark"
      :content="$t('header.rightBtns.langConfig')"
      placement="bottom"
    >
      <img class="logo" src="~@/assets/images/lang/lang.png" />
    </el-tooltip>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh'" command="zh">
        中文简体
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'zh_tw'" command="zh_tw">
        中文繁体
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getLocale } from "@/lang";
import { setLanguage } from "@/utils/cookies";

@Component({
  name: "LangSelect",
})
export default class MTLangSelect extends Vue {
  private language: string = getLocale();
  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang;
    this.language = lang;
    setLanguage(lang);
    this.$message({
      message: this.$i18n.tc("suc_message"),
      type: "success",
    });
  }
}
</script>
