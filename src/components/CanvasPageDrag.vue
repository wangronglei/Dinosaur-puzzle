<template>
  <at-flex class="canvas-content" direction="column">
    <at-flex-item is-auto :size="1" class="display-items">
      <view class="canvas-container">
        <canvas
          style="width: 300px; height: 300px"
          type="2d"
          id="canvas-display"
        />
      </view>
    </at-flex-item>
    <AtDivider content="加油哦！" fontColor="#2d8cf0" lineColor="#2d8cf0" />
    <at-flex-item is-auto :size="1" class="block-items">
      <at-flex wrap="wrap" class="block-items-wrap" justify="around">
        <at-flex-item
          class="block-item"
          is-auto
          :size="1"
          v-for="item in flatNumArr"
          :key="item"
          @touchstart="(e) => touchstart(e, item)"
          @touchmove="(e) => touchmove(e, item)"
          @touchend="(e) => touchend(e, item)"
          ><canvas
            style="width: 100px; height: 100px"
            type="2d"
            :id="`canvas-block-${item}`"
        /></at-flex-item>
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
</template>

<script>
import Taro, { useReady } from "@tarojs/taro";
import { ref, computed } from "vue";

export default {
  props: ["gameType"],
  setup(props) {
    const showMovePic = ref(false);
    const movePicWrapPos = ref({ x: 0, y: 0 });
    const movePicWrapStyle = computed(() => {
      const { x, y } = movePicWrapPos.value;
      return `top:${y}px;left:${x}px`;
    });
    const gameType = ref(parseInt(props.gameType));
    const completeBlockArr = ref([]);

    let moveImageUrl = ref("");

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
    const ROW_COL_NUM = gameType.value === 4 ? 2 : 3;

    const generateNum = () => {
      //循环进行拼图打乱
      for (let i = 0; i < 20; i++) {
        //随机抽取其中一个数据
        const i1 = Math.round(Math.random() * BOUND);
        const j1 = Math.round(Math.random() * BOUND);
        //再随机抽取其中一个数据
        const i2 = Math.round(Math.random() * BOUND);
        const j2 = Math.round(Math.random() * BOUND);
        //对调它们的位置
        const temp = num.value[i1][j1];
        num.value[i1][j1] = num.value[i2][j2];
        num.value[i2][j2] = temp;
      }
    };

    generateNum();
    let flatNumArr = num.value.flat(Infinity);

    const drawCanvas = ({ canvasId, index, isDisplay = false }) => {
      Taro.createSelectorQuery()
        .select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          // 图片对象
          const image = canvas.createImage();
          // 图片加载完成回调
          image.onload = () => {
            // 将图片绘制到 canvas 上
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, W, W);
            if (isDisplay) {
              for (const i of completeBlockArr.value) {
                //获取数值的十位数，即第几行
                const row = parseInt(i / 10) - 1;
                //获取数组的个位数，即第几列
                const col = (i % 10) - 1;
                //在画布的相关位置上绘图
                ctx.drawImage(
                  image,
                  col * W,
                  row * W,
                  W,
                  W,
                  col * W,
                  (row * W) / 2,
                  W,
                  W / 2
                );
              }
            } else {
              //获取数值的十位数，即第几行
              const row = parseInt(index / 10) - 1;
              //获取数组的个位数，即第几列
              const col = (index % 10) - 1;
              ctx.drawImage(
                image,
                col * W,
                row * W,
                W,
                W,
                0,
                0,
                canvas.width,
                canvas.height
              );
            }
          };
          // 设置图片src
          image.src = require("../assets/images/image1.jpeg");
        });
    };

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
        num.value.flat(Infinity).forEach((item) => {
          drawCanvas({
            canvasId: `canvas-block-${item}`,
            index: item,
            isDisplay: false,
          });
        });
      });
    };

    useReady(async () => {
      startDraw();
    });

    const reStart = () => {
      generateNum();
      flatNumArr = num.value.flat(Infinity);
      startDraw();
    };

    const checkWin = () => {
      const itemOrigin = numOrigin.value.flat(Infinity).join("-");
      const itemCurrent = completeBlockArr.value.sort().join("-");
      if (itemOrigin !== itemCurrent) {
        return false;
      }
      return true;
    };

    const getDisplayBound = () => {
      return new Promise((resolve) => {
        Taro.createSelectorQuery()
          .select("#canvas-display")
          .boundingClientRect()
          .exec((res) => {
            const bound = res[0];
            resolve(bound);
          });
      });
    };

    const touchstart = async (e, item) => {
      const image = await getCanvasImg({ canvasId: `canvas-block-${item}` });
      moveImageUrl.value = image;
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
      const isComplete = completeBlockArr.value.indexOf(item) > 0;
      if (
        clientX >= left &&
        clientX <= maxLeft &&
        clientY >= top &&
        clientY <= maxTop &&
        !isComplete
      ) {
        drawCanvas({
          canvasId: "canvas-display",
          isDisplay: true,
        });

        completeBlockArr.value = [...completeBlockArr.value, item];
        const isWin = checkWin();
        if (isWin) {
          console.log("win!!!");
        }
      }
    };

    return {
      reStart,
      startDraw,
      touchstart,
      touchmove,
      touchend,
      flatNumArr,
      showMovePic,
      movePicWrapPos,
      movePicWrapStyle,
      moveImageUrl,
    };
  },
};
</script>

<style lang="scss">
.canvas-content {
  height: 100%;
  width: 100%;
  #canvas-display {
    margin-top: 8px;
    margin-bottom: 4px;
    border-radius: 12px;
    box-shadow: 0px -10px 0px 0px #ff0000, 10px 0px 0px 0px #2279ee,
      0px 10px 0px 0px #eede15, -10px 0px 0px 0px #3bee17;
  }
  .display-items {
    .canvas-container {
      display: flex;
      justify-content: center;
      align-content: center;
      .block-item {
        text-align: center;
      }
    }
  }
  .block-items {
    display: flex;
    justify-content: center;
    align-content: center;
    .block-items-wrap {
      .block-item {
        margin-bottom: 6px;
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
