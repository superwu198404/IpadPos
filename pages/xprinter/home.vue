<template>
<view>
<button class="button" hover-class="hover" @tap="blueTooth"> 蓝牙设备 </button>
<button class="button" hover-class="hover" @tap="recipt"> 小票打印 </button>
<PrinterPage ref="bPage" style="display: none;"/>
</view>
</template>

<script>
var app = getApp();
import PrinterPage  from '../xprinter/receipt';

export default {
  data() {
    return {
      list: []
    };
  },

  components: {PrinterPage},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.BLEInformation.platform = app.globalData.getPlatform();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // uni.closeBLEConnection({
    //   deviceId: app.globalData.BLEInformation.deviceId,
    //   success: function (res) {
    //     console.log("关闭蓝牙成功");
    //   }
    // });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
	methodA() { //调用其他页面打印
	    //调用页面BPage的方法
	    this.$refs.bPage.receiptPrinter();
	},
    blueTooth: function () {
      uni.navigateTo({
        url: '../xprinter/bleConnect'
      });
    },
    //小票案例
    recipt: function () {
      uni.navigateTo({
        url: '../xprinter/receipt'
      });
    }
  }
};
</script>
<style>

.button {
  margin-top: 20px;
  width: 90%;
  background-color: #54bec2;
  color: white;
  border-radius: 98rpx;
  background: bg_red;
}
 
/* 按下变颜色 */
.hover {
  background:  #DCDCDC;
}

</style>