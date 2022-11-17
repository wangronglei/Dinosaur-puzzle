<template>
  <at-flex class="index-page-content" direction="column">
    <at-flex-item is-auto :size="1" class="title-warp">
      <text class="title">Dinosaur puzzle</text>
    </at-flex-item>
    <at-flex-item>
      <image class="logo" src="../assets/images/IndexPageLogo.gif" />
    </at-flex-item>
    <at-flex-item class="button-wrap">
      <AtButton class="start-button" type="primary" @click="startGame(4)"
        >2X2</AtButton
      >
      <AtButton class="start-button" type="primary" @click="startGame(9)"
        >3X3</AtButton
      >
    </at-flex-item>
  </at-flex>
</template>
<script>
import Taro from "@tarojs/taro";

export default {
  setup() {
    const startGame = (param) => {
      Taro.navigateTo({
        url: `/pages/main/index?gameType=${param}`,
      });
    };
    return { startGame };
  },
};
</script>
<style lang="scss">
.index-page-content {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  .title-warp {
    text-align: center;
    .title {
      margin: 0 auto;
      font-size: 3rem;
      transform: translate(-50%, -50%);
      text-shadow: 7px 7px orange, 12px 12px black;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: white;
      font-family: "DynaPuff", cursive;
    }
  }

  .logo {
    width: 100%;
  }
  .button-wrap {
    text-align: center;
    .start-button {
      margin: 20px auto;
      font-size: 1.5em;
      width: 400px;
      border-radius: 10px;
      color: white;
      text-shadow: -1px -1px 1px rgb(0 0 0 / 80%);
      border: 5px solid transparent;
      border-bottom-color: rgba(0, 0, 0, 0.35);
      background: hsla(260, 100%, 50%, 1);
      cursor: pointer;
    }
  }
}
</style>
