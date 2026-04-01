<template>
  <view class="number-format">
    <!-- 整数部分：支持自定义颜色 -->
    <text class="integer-part" :style="{ color: color || 'inherit' }">{{ integerPart }}</text>
    <!-- 小数部分：缩小字号 + 支持自定义颜色 -->
    <text 
      v-if="decimalPart" 
      class="decimal-part" 
      :style="{ color: color || 'inherit' }"
    >.{{ decimalPart }}</text>
  </view>
</template>

<script>
export default {
  name: 'NumberFormat',
  props: {
    // 1. 传入的原始数字（支持字符串/数字）
    value: {
      type: [String, Number],
      required: true,
      default: 0
    },
    // 2. 自定义颜色（支持十六进制/英文/渐变，默认继承父元素颜色）
    color: {
      type: String,
      default: '' // 空值表示继承父元素颜色
    },
    // 3. 可选：小数部分缩小比例（默认0.6倍）
    decimalScale: {
      type: Number,
      default: 0.6
    }
  },
  computed: {
    // 格式化数字：千分位分隔 + 拆分整数/小数
    formattedNumber() {
      // 处理空值/非数字
      const num = Number(this.value);
      if (isNaN(num)) return { integerPart: '0', decimalPart: '' };
      
      // 千分位格式化（保留所有小数位）
      const numStr = num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 20
      });
      
      // 拆分整数和小数部分
      const [integerPart, decimalPart = ''] = numStr.split('.');
      return { integerPart, decimalPart };
    },
    // 整数部分 
    integerPart() {
      return this.formattedNumber.integerPart;
    },
    // 小数部分
    decimalPart() {
      return this.formattedNumber.decimalPart;
    }
  }
};
</script>

<style scoped>
.number-format {
  display: inline-flex;
  align-items: baseline; /* 保证整数和小数基线对齐 */
}
/* 整数部分：继承父元素字号/权重 */
.integer-part {
  font-size: inherit;
  font-weight: inherit;
}
/* 小数部分：按比例缩小 + 紧凑排版 */
.decimal-part {
  font-size: 80%;
  margin-left: 1rpx; 
}
</style>