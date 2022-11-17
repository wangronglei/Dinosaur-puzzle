<template>
  <view class="index-page">
    <IndexPageContent />
  </view>
</template>

<script>
import IndexPageContent from "../../components/IndexPageContent.vue";

export default {
  name: "IndexPage",
  components: {
    IndexPageContent,
  },
};
</script>
<style lang="scss">
.index-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #83d4f5;
}
</style>
