<template>
  <view class="canvas-container">
    <canvas
      style="width: 300px; height: 300px"
      type="2d"
      id="canvas"
      @tap="tapCanvas"
    />
  </view>
  <view>
    <AtButton class="re-start-button" type="primary" @click="reStart"
      >重新开始</AtButton
    >
  </view>
</template>

<script>
import Taro, { useReady } from "@tarojs/taro";
import { ref } from "vue";

export default {
  props: ["gameType"],
  setup(props) {
    const gameType = ref(parseInt(props.gameType));
    const numOrigin =
      gameType.value === 4
        ? [
            [11, 12],
            [21, 22],
          ]
        : [
            [11, 12, 13],
            [21, 22, 23],
            [31, 32, 33],
          ];
    const num =
      gameType.value === 4
        ? [
            [11, 12],
            [21, 22],
          ]
        : [
            [11, 12, 13],
            [21, 22, 23],
            [31, 32, 33],
          ];

    const LAST_NUM = gameType.value === 4 ? 22 : 33;
    const W = gameType.value === 4 ? 150 : 100;
    const BOUND = gameType.value === 4 ? 1 : 2;
    const ROW_COL_NUM = gameType.value === 4 ? 2 : 3;
    const generateNum = () => {
      //循环进行拼图打乱
      for (let i = 0; i < 20; i++) {
        //随机抽取其中一个数据
        let i1 = Math.round(Math.random() * BOUND);
        let j1 = Math.round(Math.random() * BOUND);
        //再随机抽取其中一个数据
        let i2 = Math.round(Math.random() * BOUND);
        let j2 = Math.round(Math.random() * BOUND);
        //对调它们的位置
        let temp = num[i1][j1];
        num[i1][j1] = num[i2][j2];
        num[i2][j2] = temp;
      }
    };

    const drawCanvas = (path) => {
      Taro.createSelectorQuery()
        .select("#canvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          // 图片对象
          const image = canvas.createImage();
          // 图片加载完成回调
          image.onload = () => {
            // 将图片绘制到 canvas 上
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 300, 300);
            //使用双重for循环绘制3x3或者2x2的拼图
            for (let i = 0; i < ROW_COL_NUM; i++) {
              for (let j = 0; j < ROW_COL_NUM; j++) {
                if (num[i][j] !== LAST_NUM) {
                  //获取数值的十位数，即第几行
                  let row = parseInt(num[i][j] / 10) - 1;
                  //获取数组的个位数，即第几列
                  let col = (num[i][j] % 10) - 1;
                  //在画布的相关位置上绘图
                  ctx.drawImage(
                    image,
                    col * W,
                    row * W,
                    W,
                    W,
                    j * W,
                    (i * W) / 2,
                    W,
                    W / 2
                  );
                }
              }
            }
          };
          // 设置图片src
          image.src = require("../assets/images/image1.jpeg");
        });
    };

    const startDraw = () => {
      Taro.nextTick(() => {
        drawCanvas();
      });
    };

    useReady(async () => {
      generateNum();
      startDraw();
    });

    const reStart = () => {
      generateNum();
      startDraw();
    };

    const tapCanvas = (e) => {
      getTapBlock(e);
    };

    const detectBox = (i, j) => {
      //如果点击的方块不在最上面一行
      if (i > 0) {
        //检测空白区域是否在当前方块的正上方
        if (num[i - 1][j] == LAST_NUM) {
          //交换空白区域与当前方块的位置
          num[i - 1][j] = num[i][j];
          num[i][j] = LAST_NUM;
          return;
        }
      }
      //如果点击的方块不在最下面一行
      if (i < BOUND) {
        //检测空白区域是否在当前方块的正下方
        if (num[i + 1][j] == LAST_NUM) {
          //交换空白区域与当前方块的位置
          num[i + 1][j] = num[i][j];
          num[i][j] = LAST_NUM;
          return;
        }
      }
      //如果点击的方块不在最左边一列
      if (j > 0) {
        //检测空白区域是否在当前方块的左边
        if (num[i][j - 1] == LAST_NUM) {
          //交换空白区域与当前方块的位置
          num[i][j - 1] = num[i][j];
          num[i][j] = LAST_NUM;
          return;
        }
      }
      //如果点击的方块不在最右边一列
      if (j < BOUND) {
        //检测空白区域是否在当前方块的右边
        if (num[i][j + 1] == LAST_NUM) {
          //交换空白区域与当前方块的位置
          num[i][j + 1] = num[i][j];
          num[i][j] = LAST_NUM;
          return;
        }
      }
    };

    const checkWin = () => {
      for (let i = 0; i < numOrigin.length; i++) {
        const itemOrigin = numOrigin[i].join("-");
        const itemCurrent = num[i].join("-");
        if (itemOrigin !== itemCurrent) {
          return false;
        }
      }
      return true;
    };

    const getTapBlock = (e) => {
      let bound = Taro.createSelectorQuery()
        .select("#canvas")
        .boundingClientRect()
        .exec((res) => {
          const point = e.touches[0];
          const bound = res[0];
          let x = point.pageX - bound.left; //获取鼠标在画布上的坐标位置(x,y)
          let y = point.pageY - bound.top;
          let row = parseInt(y / W); //将x和y换算成几行几列
          let col = parseInt(x / W);
          if (num[row][col] !== LAST_NUM) {
            //如果当前点击的不是空白区域
            detectBox(row, col); //移动点击的方块
            drawCanvas(); //重新绘制画布
            let isWin = checkWin(); //检查游戏是否成功

            if (isWin) {
              //如果游戏成功
              Taro.createSelectorQuery()
                .select("#canvas")
                .fields({ node: true, size: true })
                .exec((res) => {
                  const canvas = res[0].node;
                  // 图片对象
                  const image = canvas.createImage();
                  // 图片加载完成回调
                  image.onload = () => {
                    // 将图片绘制到 canvas 上
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, 300, 300);
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                  };
                  // 设置图片src
                  image.src = require("../assets/images/image1.jpeg");
                });
            }
          }
        });
    };

    return { reStart, startDraw, tapCanvas };
  },
};
</script>

<style lang="scss" scope>
.canvas-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
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
</style>
