<template>
  <view class="number-format">
    <text class="integer-part" :style="{ color: color || 'inherit' }">{{ integerPart }}</text>
    <text 
      v-if="decimalPart" 
      class="decimal-part" 
      :style="{ 
        color: color || 'inherit',
        fontSize: `${decimalScale * 100}%`  
      }"
    >.{{ decimalPart }}</text>
  </view>
</template>

<script>
export default {
  name: 'NumberFormat',
  props: {
    value: {
      type: [String, Number],
      required: true,
      default: 0
    },
    color: {
      type: String,
      default: ''
    },
    // 默认 1 → 对应 100% 正常大小
    decimalScale: {
      type: Number,
      default: 1
    }
  },
  computed: {
    formattedNumber() {
      const num = Number(this.value);
      if (isNaN(num)) return { integerPart: '0', decimalPart: '' };

      const scaled = Math.round(num * 100);
      const integerPart = Math.floor(scaled / 100);
      const decimalNum = Math.abs(scaled % 100);

      // 小数为 0 不显示，否则保留两位
      const decimalPart = decimalNum === 0 ? '' : decimalNum.toString().padStart(2, '0');

      const formatInteger = integerPart.toLocaleString('en-US');

      return {
        integerPart: formatInteger,
        decimalPart: decimalPart
      };
    },
    integerPart() {
      return this.formattedNumber.integerPart;
    },
    decimalPart() {
      return this.formattedNumber.decimalPart;
    }
  }
};
</script>

<style scoped>
.number-format {
  display: inline-flex;
  align-items: baseline;
}
.integer-part {
  font-size: inherit;
  font-weight: inherit;
}
.decimal-part {
  margin-left: 1rpx;
}
</style>