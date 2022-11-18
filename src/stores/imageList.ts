import { defineStore } from 'pinia'

export const useImageList = defineStore('counter', {
  state: () => {
    return { imageList: [
      require('../assets/images/image0.jpeg'),
      require('../assets/images/image1.jpeg'),
      require('../assets/images/image2.jpeg'),
      require('../assets/images/image3.jpeg'),
      require('../assets/images/image4.jpeg'),
      require('../assets/images/image5.jpeg'),
      require('../assets/images/image6.jpeg'),
      require('../assets/images/image7.jpeg'),
    ] }
  },
})
