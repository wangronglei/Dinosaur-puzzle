import Taro from "@tarojs/taro";
const drawCanvas = async ({
  height,
  width,
  index,
  imageUrl,
  W,
  isDisplay = false,
  completeBlockArr,
}) => {
  return new Promise(async (resolve) => {
    const type = "2d";
    // 把图片画到离屏 canvas 上
    const canvas = Taro.createOffscreenCanvas({
      type,
      width,
      height,
    });
    const ctx = canvas.getContext(type);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 创建一个图片
    const image = canvas.createImage();
    // 等待图片加载
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imageUrl; // 要加载的图片 url, 可以是base64
    });

    if (isDisplay) {
      for (const i of completeBlockArr) {
        //获取数值的十位数，即第几行
        const row = parseInt(i / 10) - 1;
        //获取数组的个位数，即第几列
        const col = (i % 10) - 1;
        //在画布的相关位置上绘图
        ctx.drawImage(image, col * W, row * W, W, W, col * W, row * W, W, W);
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
    const url = ctx.canvas.toDataURL();
    resolve(url);
  });
};

const generateNum = ({ num, BOUND }) => {
  //循环进行拼图打乱
  for (let i = 0; i < 20; i++) {
    //随机抽取其中一个数据
    const i1 = Math.round(Math.random() * BOUND);
    const j1 = Math.round(Math.random() * BOUND);
    //再随机抽取其中一个数据
    const i2 = Math.round(Math.random() * BOUND);
    const j2 = Math.round(Math.random() * BOUND);
    //对调它们的位置
    const temp = num[i1][j1];
    num[i1][j1] = num[i2][j2];
    num[i2][j2] = temp;
    return num;
  }
};

export { drawCanvas, generateNum };
