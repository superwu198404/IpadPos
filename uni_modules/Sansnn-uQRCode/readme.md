# uQRCode

uQRCode 生成方式简单，可扩展性高，如有复杂需求可通过自定义组件或修改源码完成需求。已测试H5、微信小程序、iPhoneXsMax真机、华为P20Pro真机。

支持自定义二维码渲染规则，可通过 `getModules` 方法得到矩阵信息后，自行实现canvas或view+css渲染二维码，如随机颜色、圆点、方块、块与块之间的间距等。

### 示例预览
[https://static-c15f4b57-ef97-4d2b-b939-f580f910d7e2.bspapp.com](https://static-c15f4b57-ef97-4d2b-b939-f580f910d7e2.bspapp.com)

### 二维码
**什么是QR码**

QR码属于矩阵式二维码中的一个种类，由DENSO(日本电装)公司开发，由JIS和ISO将其标准化。

**QR码的特点**

一是高速读取(QR就是取自“Quick Response”的首字母)，通过摄像头从拍摄到解码到显示内容也就三秒左右，对摄像的角度也没有什么要求；

二是高容量、高密度，理论上内容经过压缩处理后可以存7089个数字，4296个字母和数字混合字符，2953个8位字节数据，1817个汉字；

三是支持纠错处理，按照QR码的标准文档说明，QR码的纠错分为4个级别，分别是：
- level L : 最大 7% 的错误能够被纠正；
- level M : 最大 15% 的错误能够被纠正；
- level Q : 最大 25% 的错误能够被纠正；
- level H : 最大 30% 的错误能够被纠正；

四是结构化，看似无规则的图形，其实对区域有严格的定义。

更多二维码介绍及原理：[https://blog.csdn.net/jason_ldh/article/details/11801355](https://blog.csdn.net/jason_ldh/article/details/11801355)

### 简单使用

在 `template` 中创建 `<uqrcode/>`，并指定生成内容 `text`

```html
<uqrcode ref="uQRCode" text="uQRCode 3.0" />
```

### 属性说明

|属性名						|类型					|可选值					|默认值		|是否必填	|说明																																						|
|---							|---					|---						|---			|---			|:---																																						|
|id								|String				|-							|随机生成	|否				|组件标识/canvasId																															|
|mode							|String				|canvas/view		|canvas		|否				|生成模式																																				|
|text							|String				|-							|-				|是				|二维码内容																																			|
|size							|Number				|-							|256			|否				|二维码大小，单位px																															|
|margin						|Number				|-							|0				|否				|填充边距，单位px																																|
|backgroundColor	|String				|-							|#FFFFFF	|否				|背景色																																					|
|foregroundColor	|String				|-							|#000000	|否				|前景色																																					|
|errorCorrectLevel|String/Number|L/M/Q/H/1/0/3/2|H				|否				|纠错等级L/M/Q/H分别对应1/0/3/2																									|
|typeNumber				|Number				|-							|-1				|否				|版本																																						|
|fileType					|String				|png/jpg				|png			|否				|导出的文件类型																																	|
|complete					|EventHandle	|								|					|否				|二维码生成完成时触发，一般用于刚加载完页面就生成二维码并需要导出临时文件的情况	|

### 方法说明

|方法名|说明|
|---|:---|
|[toTempFilePath](#totempfilepathobject)|导出临时文件路径|
|[save](#saveobject)|保存二维码|

### toTempFilePath(OBJECT)

导出临时文件路径

**OBJECT参数说明**

|参数			|类型			|必填	|默认值	|说明																							|
|---			|---			|---	|---		|:---																							|
|success	|Function	|否		|-			|方法调用成功的回调函数														|
|fail			|Function	|否		|-			|方法调用失败的回调函数														|
|complete	|Function	|否		|-			|方法调用结束的回调函数（调用成功、失败都会执行）	|

#### 示例

```html
<template>
  <view>
    <uqrcode ref="uQRCode" text="uQRCode 3.0" />
    <button @click="toTempFilePath">导出临时文件路径</button>
  </view>
</template>
```

```javascript
export default {
  methods: {
    toTempFilePath() {
      this.$refs.uQRCode.toTempFilePath({
        success: res => {
          console.log(res)
        }
      })
    }
  }
}
```

### save(OBJECT)

保存二维码

**OBJECT参数说明**

|参数			|类型			|必填	|默认值	|说明																							|
|---			|---			|---	|---		|:---																							|
|success	|Function	|否		|-			|方法调用成功的回调函数														|
|fail			|Function	|否		|-			|方法调用失败的回调函数														|
|complete	|Function	|否		|-			|方法调用结束的回调函数（调用成功、失败都会执行）	|

#### 示例

```html
<template>
  <view>
    <uqrcode ref="uQRCode" text="uQRCode 3.0" />
    <button @click="save">保存二维码</button>
  </view>
</template>
```

```javascript
export default {
  methods: {
    save() {
      this.$refs.uQRCode.save({
        success: res => {
          console.log(res)
        }
      })
    }
  }
}
```

### 高级使用

在 `template` 中创建 `<canvas/>` 并设置 `id`，画布宽高

```html
<canvas id="qrcode" canvas-id="qrcode" :style="{'width': `${size}px`, 'height': `${size}px`}" />
```

在 `script` 中引用js文件并调用方法生成矩阵

```javascript
import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode.js'

export default {
  data() {
    return {
      size: 256,
      margin: 10,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000'
    }
  },
  onReady() {
    let modules = uQRCode.getModules({
      text: 'uQRCode 3.0',
      errorCorrectLevel: uQRCode.errorCorrectLevel.H
    })
    let tileSize = (this.size - this.margin * 2) / modules.length
    // 获取绘图所需的上下文
    let ctx = uni.createCanvasContext('qrcode', this)
    // 开始绘制
    ctx.setFillStyle(this.backgroundColor)
    ctx.fillRect(0, 0, this.size, this.size)
    for (var row = 0; row < modules.length; row++) {
      for (var col = 0; col < modules.length; col++) {
        // 计算每一个小块的位置
        var x = col * tileSize + this.margin
        var y = row * tileSize + this.margin
        var w = tileSize
        var h = tileSize
    
        var style = modules[row][col] ? this.foregroundColor : this.backgroundColor
        ctx.setFillStyle(style)
        ctx.fillRect(x, y, w, h)
      }
    }
    ctx.draw()
  }
}
```

### uqrcode.js 方法说明

|方法名|说明|
|---|:---|
|[getModules](#getmodulesoptions)|可以得到二维码矩阵信息，可根据返回的矩阵信息自行实现二维码生成|

### getModules(options)

根据内容得到二维码矩阵信息

|参数							|类型		|必填	|默认值	|说明															|
|---							|---		|---	|---		|:---															|
|text							|String	|是		|-			|二维码内容												|
|errorCorrectLevel|Number	|否		|2			|纠错等级，1/0/3/2分别对应L/M/Q/H	|
|typeNumber				|Number	|否		|-1			|版本															|

### 常见问题
**导出空白**

如果是页面刚加载完毕就在onLoad、mounted等页面生命周期中调用导出临时文件或者保存，这时画布还未绘制完毕，那么导出肯定是空白的。正确做法是在`complete`中导出，二维码绘制完毕后会触发`complete`，所以在这里导出能保证画布不会空白。如果是其他情况，请联系作者说明。

**关于高级使用二维码生成不完整**

size的单位是px，请尽量避免使用rpx，如果canvas的单位是rpx，那么不同设备屏幕分辨率不一样，rpx转换成px后的画布尺寸不足以放下全部内容，实际绘制图案超出，就会出现不完整或者没有填充完整画布的情况。

**如何扫码跳转指定网页**

text参数直接放入完整的网页地址即可，例如：`https://ext.dcloud.net.cn/plugin?id=1287`。微信客户端不能是ip地址。

**H5长按识别**

canvas无法长按识别，长按识别需要是图片才行，所以需要先调用`toTempFilePath`方法得到临时路径，再用image组件显示即可。

**nvue打包后生成失败**

Canvas是作为独立的模块，打包时需要选择使用Canvas模块才能正常使用相关的功能。 需要在manifest.json的代码视图中配置如下（暂时还不支持可视化界面操作）：
```javascript
"app-plus" : {
  /* 模块配置 */
  "modules" : {
    "Canvas" : "nvue canvas"    //使用Canvas模块
  },
  //...
},
//...
```
保存好提交云端打包。
