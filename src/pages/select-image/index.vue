<template>
  <view class="select-image-page">
    <scroll-view
      :scroll-y="true"
      :style="`height: ${windowHeight}px`"
      :scroll-into-view="toView"
      :scroll-top="scrollTop"
    >
      <view
        v-for="(url, i) in imageList"
        :key="i"
        class="scroll-view-item"
        @tap="goInto(i)"
      >
        <image lazyLoad="true" class="image-item" :src="url" />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import { useImageList } from "../../stores/imageList";

export default {
  name: "SelectImagePage",
  setup() {
    const ImageListStore = useImageList();

    const imageList = ImageListStore.imageList;

    const res = Taro.getSystemInfoSync();
    const windowHeight = res.windowHeight;

    const { gameType } = Taro.getCurrentInstance().router.params;
    const goInto = (i) => {
      Taro.navigateTo({
        url: `/pages/main/index?gameType=${gameType}&imgIndex=${i}`,
      });
    };
    return { imageList, windowHeight, goInto };
  },
};
</script>
<style lang="scss">
.select-image-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #83d4f5;
  .scroll-view-item {
    display: flex;
    align-content: center;
    justify-content: center;
    .image-item {
      height: 600px;
      width: 600px;
      margin-bottom: 8px;
      border: 1px #f8ed77 dotted;
    }
  }
}
</style>
