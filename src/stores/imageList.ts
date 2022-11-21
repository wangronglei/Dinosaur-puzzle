import { defineStore } from 'pinia'

export const useImageList = defineStore('counter', {
  state: () => {
    return { imageList: [
      require('../assets/images/image-1.png'),
      require('../assets/images/image-2.png'),
      require('../assets/images/image-3.png'),
      require('../assets/images/image-4.png'),
      require('../assets/images/image-5.png'),
      require('../assets/images/image-6.png'),
      require('../assets/images/image-7.png'),
      require('../assets/images/image-8.png'),
      require('../assets/images/image-9.png'),
      require('../assets/images/image-10.png'),
      require('../assets/images/image-11.png'),
      require('../assets/images/image-12.png'),
      require('../assets/images/image-13.png'),
      require('../assets/images/image-14.png'),
      require('../assets/images/image-15.png'),
      require('../assets/images/image-16.png'),
      require('../assets/images/image-17.png'),
    ] }
  },
})
