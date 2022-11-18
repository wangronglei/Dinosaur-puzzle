<template>
  <view class="main-page">
    <CanvasPageDrag :gameType="gameType" :imgIndex="imgIndex" />
  </view>
</template>

<script>
import CanvasPageDrag from "../../components/CanvasPageDrag.vue";
import Taro from "@tarojs/taro";

export default {
  name: "MainPage",
  components: {
    CanvasPageDrag,
  },
  setup() {
    const { gameType, imgIndex } = Taro.getCurrentInstance().router.params;
    return { gameType, imgIndex };
  },
};
</script>
<style lang="scss">
.main-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #83d4f5;
}
</style>
