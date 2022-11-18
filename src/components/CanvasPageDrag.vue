<template>
  <at-flex class="draw-content" direction="column">
    <at-flex-item is-auto :size="1" class="display-items">
      <view class="display-container">
        <image id="display-image" class="display-image" :src="displayUrl" />
      </view>
    </at-flex-item>
    <AtDivider content="加油哦！" fontColor="#2d8cf0" lineColor="#2d8cf0" />
    <at-flex-item is-auto :size="1" class="block-items">
      <at-flex wrap="wrap" class="block-items-wrap" justify="around">
        <at-flex-item
          class="block-item"
          is-auto
          :size="1"
          v-for="(item, index) in blockArr"
          :key="item.index"
          @touchstart="(e) => touchstart(e, index)"
          @touchmove="(e) => touchmove(e, item)"
          @touchend="(e) => touchend(e, item.index)"
        >
          <image class="block-image" type="2d" :src="item.url" />
        </at-flex-item>
      </at-flex>
    </at-flex-item>
    <at-flex-item class="button-wrap">
      <AtButton class="re-start-button" type="primary" @click="reStart"
        >重新开始
      </AtButton>
    </at-flex-item>

    <view v-show="showMovePic" class="move-pic-wrap" :style="movePicWrapStyle">
      <image class="cover-image" :src="moveImageUrl" />
    </view>
  </at-flex>
  <AtMessage></AtMessage>
</template>

<script>
import Taro, { useReady } from "@tarojs/taro";
import { ref, computed } from "vue";
import { AtMessage } from "taro-ui-vue3";
import { drawCanvas, generateNum } from "../lib/tools";
import { useImageList } from "../stores/imageList";

export default {
  components: { AtMessage },
  props: ["gameType", "imgIndex"],
  setup(props) {
    const showMovePic = ref(false);
    const movePicWrapPos = ref({ x: 0, y: 0 });
    const movePicWrapStyle = computed(() => {
      const { x, y } = movePicWrapPos.value;
      return `top:${y}px;left:${x}px`;
    });

    const gameType = ref(parseInt(props.gameType));
    const imgIndex = ref(parseInt(props.imgIndex));

    let moveImageUrl = ref("");

    let displayUrl = ref("");

    const blockArr = ref([]);

    const completeBlockArr = ref([]);

    const numOrigin = computed(() => {
      return gameType.value === 4
        ? [
            [11, 12],
            [21, 22],
          ]
        : [
            [11, 12, 13],
            [21, 22, 23],
            [31, 32, 33],
          ];
    });
    const num = computed(() => {
      return gameType.value === 4
        ? [
            [11, 12],
            [21, 22],
          ]
        : [
            [11, 12, 13],
            [21, 22, 23],
            [31, 32, 33],
          ];
    });

    const LAST_NUM = gameType.value === 4 ? 22 : 33;
    const W = gameType.value === 4 ? 150 : 100;
    const BOUND = gameType.value === 4 ? 1 : 2;

    num.value = generateNum({ num: num.value, BOUND });

    const ImageListStore = useImageList();
    const imageUrl = ImageListStore.imageList[imgIndex.value];

    const getCanvasImg = ({ canvasId }) => {
      return new Promise((resolve) => {
        Taro.createSelectorQuery()
          .select(`#${canvasId}`)
          .fields({ node: true, size: true, context: true })
          .exec((res) => {
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");
            resolve(ctx.canvas.toDataURL("image/png", 1));
          });
      });
    };

    const startDraw = () => {
      Taro.nextTick(() => {
        num.value.flat(Infinity).forEach(async (item) => {
          const url = await drawCanvas({
            width: W,
            height: W,
            index: item,
            imageUrl,
            W,
          });
          blockArr.value.push({ url, index: item });
        });
      });
    };

    useReady(async () => {
      startDraw();
    });

    const reStart = () => {
      displayUrl.value = "";
      blockArr.value = [];
      completeBlockArr.value = [];
      num.value = generateNum({ num: num.value, BOUND });
      startDraw();
    };

    const checkWin = () => {
      const itemOrigin = numOrigin.value.flat(Infinity).join("-");
      const itemCurrent = completeBlockArr.value.sort().join("-");

      console.log(itemOrigin);
      console.log(itemCurrent);
      if (itemOrigin !== itemCurrent) {
        return false;
      }
      return true;
    };

    const getDisplayBound = () => {
      return new Promise((resolve) => {
        Taro.createSelectorQuery()
          .select("#display-image")
          .boundingClientRect()
          .exec((res) => {
            const bound = res[0];
            resolve(bound);
          });
      });
    };

    const touchstart = async (e, index) => {
      const url = blockArr.value[index].url;
      moveImageUrl.value = url;
    };

    const touchmove = (e, item) => {
      showMovePic.value = true;
      const { clientX, clientY } = e.changedTouches[0];
      movePicWrapPos.value = {
        x: clientX,
        y: clientY,
      };
    };

    const touchend = async (e, item) => {
      showMovePic.value = false;
      const { width, height, top, left } = await getDisplayBound(e);
      const maxTop = top + height;
      const maxLeft = left + width;
      const { clientX, clientY } = e.changedTouches[0];
      const isComplete = false;
      if (
        clientX >= left &&
        clientX <= maxLeft &&
        clientY >= top &&
        clientY <= maxTop &&
        !isComplete
      ) {
        completeBlockArr.value = [...completeBlockArr.value, item];
        const url = await drawCanvas({
          width: 300,
          height: 300,
          index: item,
          imageUrl,
          W,
          isDisplay: true,
          completeBlockArr: completeBlockArr.value,
        });

        displayUrl.value = url;
        const isWin = checkWin();
        if (isWin) {
          Taro.atMessage({
            message: "消息通知",
            type: "success",
          });
        }
      }
    };

    return {
      reStart,
      startDraw,
      touchstart,
      touchmove,
      touchend,
      completeBlockArr,
      showMovePic,
      movePicWrapPos,
      movePicWrapStyle,
      moveImageUrl,
      blockArr,
      displayUrl,
    };
  },
};
</script>

<style lang="scss">
.draw-content {
  height: 100%;
  width: 100%;

  .display-items {
    .display-container {
      display: flex;
      justify-content: center;
      align-content: center;

      .display-image {
        height: 600px;
        width: 600px;
        margin-top: 8px;
        margin-bottom: 4px;
        border-radius: 12px;
        box-shadow: 0px -10px 0px 0px #ff0000, 10px 0px 0px 0px #2279ee,
          0px 10px 0px 0px #eede15, -10px 0px 0px 0px #3bee17;
      }
    }
  }
  .block-items {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 600px;
    .block-items-wrap {
      .block-item {
        margin-bottom: 6px;
        .block-image {
          height: 200px;
          width: 200px;
        }
      }
    }
  }
  .button-wrap {
    margin-top: 12px;
    .re-start-button {
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
.move-pic-wrap {
  position: absolute;
  width: 200px;
  height: 200px;
  .cover-image {
    width: 100%;
    height: 100%;
  }
}
</style>
