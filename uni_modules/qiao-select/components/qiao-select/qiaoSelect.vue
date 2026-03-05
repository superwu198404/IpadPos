<template>
  <view class="qiaoSelect">
    <view class="flex1 row-me row-center radius10" :class="{'input-border':showBorder}" @tap="open">
      <!-- 可搜索模式且非多选：使用 input -->
      <input v-if="searchable && !multiple" type="text" class="input" @input="watchInput" @focus="focus"
             :style="{'font-size':fontSize,'text-align':align}" @blur="blur" :placeholder="phText"
             :placeholder-style="'color:'+phColor" :disabled="disabled"
             :cursor-spacing="50" v-model="inputText"/>
      <!-- 不可搜索模式或多选模式：使用 view -->
      <view v-else class="input display-text" :style="{'font-size':fontSize,'text-align':align}">
        <!-- 已选内容插槽：自定义已选项显示 -->
        <slot name="selected" :value="multiple ? selectedItems : inputText" :items="selectedItems" :text="displayText">
          <!-- 默认显示 -->
          <text v-if="displayText">{{ displayText }}</text>
          <text v-else class="placeholder" :style="{'color':phColor}">{{ phText }}</text>
        </slot>
      </view>
      <view class="icon">
        <uni-icons type="close" size="15" color="#515151" class="img-close" @click.stop="clickClear"
                   v-if="hasSelection&&!disabled&&clearable"></uni-icons>
        <uni-icons v-show="popupShow" type="bottom" size="15" color="#515151" v-if="showIcon"></uni-icons>
        <uni-icons v-show="!popupShow" type="right" size="15" color="#515151" v-if="showIcon"></uni-icons>
      </view>
    </view>
    <view class="select" :class="'position-'+popupPosition" v-show="popupShow">
      <view class="box">
        <view style="color: #515151;font-size: 30rpx;" v-if="dataList.length===0">{{ t.noData }}</view>
        <view style="color: #515151;font-size: 30rpx;" v-if="filPersons.length===0&&dataList.length!==0">
          {{ t.noData }}
        </view>
        <view @touchstart="touchst" v-for="(item,index) in filPersons" :key="index">
          <view @click.stop="Check(item)" class="li row-me row-center"
                :class="{'selected': isSelected(item)}" :style="{'font-size':fontSize}">
            <!-- 选项插槽：自定义选项显示 -->
            <slot name="option" :item="item" :index="index" :selected="isSelected(item)">
              <!-- 默认显示 -->
              <text class="li-text">{{ item[showKey] }}</text>
            </slot>
            <uni-icons v-if="multiple && isSelected(item)" type="checkmarkempty" size="16" color="#55aaff" class="check-icon"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <view class="popup" v-show="popupShow" @click="close">
      <view>

      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: "qiao-select",
  props: {
    value: {
      type: [String, Object, Array],
      default: null
    },
    modelValue: {
      type: [String, Object, Array],
      default: null
    },
    //下拉数据
    dataList: {
      type: Array,
      default() {
        return []
      }
    },
    //唯一键，用于多个关闭
    keyId: Number | String,
    //提示语
    phText: String,
    //提示语颜色
    phColor: {
      type: String,
      default: '#999999',
    },
    //指定搜索的属性
    searchKey: {
      type: String,
      default: 'name'
    },
    //是否显示边框
    showBorder: {
      type: Boolean,
      default: true,
    },
    //展示的字段
    showKey: {
      type: String,
      default: 'name'
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    //字体大小
    fontSize: {
      type: String,
      default: '26rpx'
    },
    //仅用于选择不展示
    onlyChoose: {
      type: Boolean,
      default: false,
    },
    //返回类型object或者key
    returnType: {
      type: String,
      default: 'object'
    },
    //返回字段
    returnKey: {
      type: String,
      default: ''
    },
    //显示位置
    align: {
      type: String,
      default: 'left'
    },
    //是否显示下拉图标
    showIcon: {
      type: Boolean,
      default: true,
    },
    //是否可以清空
    clearable: {
      type: Boolean,
      default: true,
    },
    //是否支持搜索（false时不弹出键盘）
    searchable: {
      type: Boolean,
      default: true,
    },
    //弹窗显示位置：bottom（下方）、top（上方）
    popupPosition: {
      type: String,
      default: 'bottom',
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    //多选时最大可选数量，0表示不限制
    multipleLimit: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      timer: '', //定时器
      popupShow: false,
      inputText: '',
      isInput: true, //是否输入，如果输入开始模糊查询
      selectedItems: [], //多选时存储选中项
      // 多语言文本
      i18n: {
        'zh-Hans': {
          noData: '暂无数据',
          returnKeyRequired: 'returnKey参数未配置',
          selectedCount: '已选 {n} 项',
          limitReached: '最多选择 {n} 项'
        },
        'zh-Hant': {
          noData: '暫無資料',
          returnKeyRequired: 'returnKey參數未配置',
          selectedCount: '已選 {n} 項',
          limitReached: '最多選擇 {n} 項'
        },
        'en': {
          noData: 'No data',
          returnKeyRequired: 'returnKey is required',
          selectedCount: '{n} selected',
          limitReached: 'Select up to {n} items'
        },
        'fr': {
          noData: 'Aucune donnée',
          returnKeyRequired: 'returnKey est requis',
          selectedCount: '{n} sélectionné(s)',
          limitReached: 'Sélectionnez jusqu\'à {n} éléments'
        },
        'es': {
          noData: 'Sin datos',
          returnKeyRequired: 'returnKey es requerido',
          selectedCount: '{n} seleccionado(s)',
          limitReached: 'Seleccione hasta {n} elementos'
        }
      }
    }
  },
  computed: {
    // 获取当前语言文本
    t() {
      const locale = uni.getLocale() || 'zh-Hans'
      return this.i18n[locale] || this.i18n['zh-Hans']
    },
    // 显示文本（支持单选和多选）
    displayText() {
      if (!this.multiple) {
        return this.inputText
      }
      // 多选模式
      if (this.selectedItems.length === 0) {
        return ''
      }
      // 获取所有选中项的显示文本
      const texts = this.selectedItems.map(item => {
        if (typeof item === 'object') {
          return item[this.showKey]
        }
        // returnType 为 key 时，需要从 dataList 中查找
        const found = this.dataList.find(d => d[this.returnKey] == item)
        return found ? found[this.showKey] : item
      })
      return texts.join('、')
    },
    // 是否有选中项（用于显示清空按钮）
    hasSelection() {
      if (this.multiple) {
        return this.selectedItems.length > 0
      }
      return this.inputText !== ''
    },
    filPersons: {
      get() {
        // 不可搜索模式或未输入时，显示全部
        if (!this.searchable || !this.isInput) {
          return this.dataList
        }
        // 搜索过滤
        return this.dataList.filter((item) => {
          if (item.qiaoSelectKey) {
            return item.qiaoSelectKey.indexOf(this.inputText) !== -1
          }
          return false
        })
      },
      set(val) {
      }
    }

  },
  watch: {
    dataList: {
      immediate: true,
      handler(val) {
        if (this.dataList.length > 0) {
          // 为每个数据项添加搜索键
          this.dataList.forEach(item => {
            if (item[this.searchKey]) {
              item.qiaoSelectKey = item[this.searchKey].toString()
            } else if (item[this.showKey]) {
              // 没有指定搜索字段，默认搜索展示字段
              item.qiaoSelectKey = item[this.showKey].toString()
            }
          })
          this.inputText = ''
          if (this.returnType === 'key') {
            // #ifndef VUE3
            let itemObj = this.dataList.find(item => item[this.returnKey] == this.value)
            if (itemObj) {
              this.inputText = itemObj[this.showKey]
            }
            // #endif
            // #ifdef VUE3
            let itemObj1 = this.dataList.find(item => item[this.returnKey] == this.modelValue)
            if (itemObj1) {
              this.inputText = itemObj1[this.showKey]
            }
            // #endif
          }
        }
      }
    },
    // #ifndef VUE3
    value: {
      handler(newVal) {
        this.handleValueChange(newVal)
      },
      immediate: true,
      deep: true,
    },
    // #endif
    // #ifdef VUE3
    modelValue: {
      handler(newVal) {
        this.handleValueChange(newVal)
      },
      immediate: true,
      deep: true,
    }
    // #endif
  },
  methods: {
    // 处理 value/modelValue 变化
    handleValueChange(newVal) {
      if (this.multiple) {
        // 多选模式
        if (Array.isArray(newVal)) {
          this.selectedItems = [...newVal]
        } else {
          this.selectedItems = []
        }
      } else {
        // 单选模式
        if (newVal && newVal !== '') {
          if (!this.onlyChoose) {
            if (this.returnType === 'object') {
              this.inputText = newVal[this.showKey]
            } else if (this.returnType === 'key') {
              let item = this.dataList.find(item => item[this.returnKey] == newVal)
              if (item) {
                this.inputText = item[this.showKey]
              }
            }
          }
        } else {
          if (!this.onlyChoose) {
            this.inputText = ''
          }
        }
      }
    },
    // 判断项是否已选中（多选模式）
    isSelected(item) {
      if (!this.multiple) {
        return item[this.showKey] === this.inputText
      }
      const key = this.returnType === 'key' ? this.returnKey : this.showKey
      return this.selectedItems.some(selected => {
        if (typeof selected === 'object') {
          return selected[key] == item[key]
        }
        return selected == item[this.returnKey]
      })
    },
    clickClear() {
      if (this.multiple) {
        // 多选清空
        this.selectedItems = []
        // Vue3 v-model
        this.$emit('update:modelValue', [])
        // Vue2 v-model
        this.$emit('input', [])
        this.$emit('change', [])
      } else {
        // 单选清空
        if (!this.onlyChoose) {
          this.inputText = ''
        }
        // Vue3 v-model
        this.$emit('update:modelValue', null)
        // Vue2 v-model
        this.$emit('input', null)
        this.$emit('change', null)
      }
    },
    touchst() {
      if (this.disabled) return;
      this.popupShow = true
    },
    focus() {
      this.isInput = false
    },
    watchInput(e) { //键盘输入
      this.isInput = true
      // 搜索时触发 search 事件，返回过滤后的列表
      if (this.inputText) {
        this.$emit('search', this.filPersons)
      }
      // 清空搜索框时，单选模式下清空选中值
      if (this.inputText === '') {
        if (this.multiple) {
          // 多选模式下清空输入不影响已选项
        } else {
          // Vue3 v-model
          this.$emit('update:modelValue', null)
          // Vue2 v-model
          this.$emit('input', null)
          this.$emit('change', null)
        }
      }
    },
    Check(item) { //选择选项
      if (this.multiple) {
        // 多选模式
        this.handleMultipleSelect(item)
      } else {
        // 单选模式
        if (!this.onlyChoose) {
          this.inputText = item[this.showKey]
        }
        this.isInput = false
        this.close()
        if (this.returnType === 'object') {
          // Vue3 v-model
          this.$emit('update:modelValue', item)
          // Vue2 v-model
          this.$emit('input', item)
          this.$emit('change', item)
        } else if (this.returnType === 'key') {
          if (this.returnKey === '') {
            uni.showToast({
              title: this.t.returnKeyRequired,
            })
            return
          }
          // Vue3 v-model
          this.$emit('update:modelValue', item[this.returnKey])
          // Vue2 v-model
          this.$emit('input', item[this.returnKey])
          this.$emit('change', item[this.returnKey])
        }
      }
    },
    // 处理多选
    handleMultipleSelect(item) {
      const key = this.returnType === 'key' ? this.returnKey : this.showKey
      const isCurrentlySelected = this.isSelected(item)
      
      if (isCurrentlySelected) {
        // 取消选中
        this.selectedItems = this.selectedItems.filter(selected => {
          if (typeof selected === 'object') {
            return selected[key] != item[key]
          }
          return selected != item[this.returnKey]
        })
      } else {
        // 检查是否达到限制
        if (this.multipleLimit > 0 && this.selectedItems.length >= this.multipleLimit) {
          uni.showToast({
            title: this.t.limitReached.replace('{n}', this.multipleLimit),
            icon: 'none'
          })
          return
        }
        // 添加选中
        if (this.returnType === 'object') {
          this.selectedItems.push(item)
        } else if (this.returnType === 'key') {
          if (this.returnKey === '') {
            uni.showToast({
              title: this.t.returnKeyRequired,
            })
            return
          }
          this.selectedItems.push(item[this.returnKey])
        }
      }
      
      // 触发事件
      const emitValue = [...this.selectedItems]
      // Vue3 v-model
      this.$emit('update:modelValue', emitValue)
      // Vue2 v-model
      this.$emit('input', emitValue)
      this.$emit('change', emitValue)
    },
    open() {
      if (this.disabled) return;
      uni.setStorageSync('keyId', this.keyId)
      this.popupShow = true
    },
    close() { //关闭
      this.popupShow = false
    },
    blur() {
      // 延迟检查，用于处理多个选择框互斥
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (this.popupShow && uni.getStorageSync('keyId') !== this.keyId) {
          this.popupShow = false
        }
      }, 200)
    },
  }
}
</script>

<style lang="scss" scoped>
$height: 60rpx;

.row-me {
  display: flex;
  flex-direction: row;
}

.row-center {
  align-items: center;
}

.radius10 {
  border-radius: 10rpx !important;
}

.pLR20 {
  padding-left: 20rpx;
  padding-right: 20rpx;
}

.ban {
  background: #F7F7F6;
}

.flex1 {
  flex: 1;
}

.qiaoSelect {
  margin: 0;
  padding: 0;
  position: relative;
  height: $height;
  display: flex;
  align-items: center;

  .img-close {
    margin: 0 10rpx;
  }

  .icon {
    z-index: 99;
    margin-left: 10rpx;
  }

  .input {
    flex: 1;
    border-radius: 10rpx;
    height: $height;
    padding: 0;
    font-size: 26rpx;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .display-text {
    display: flex;
    align-items: center;
    line-height: $height;

    .placeholder {
      color: #999999;
    }
  }

  .input-border {
    border: 1rpx solid #ECECEC;
    padding-left: 20rpx;
  }

  .select {
    padding: 20rpx;
    color: #515151;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 99999;
    border: 2px #f3f3f3 solid;
    font-size: 30rpx;
    background-color: #fff;
    border-radius: 10rpx;

    .box {
      max-height: 300rpx;
      overflow: scroll;
    }

    .li {
      padding: 10rpx 0;
      text-align: left;
      justify-content: space-between;
      
      .li-text {
        flex: 1;
      }
      
      .check-icon {
        margin-left: 10rpx;
      }
    }

    .li.selected {
      color: #55aaff;
    }
  }

  // 弹窗在下方
  .select.position-bottom {
    top: calc(#{$height} + 30rpx);
  }

  .select.position-bottom::after {
    width: 0px;
    height: 0px;
    position: absolute;
    bottom: 100%;
    left: 10%;
    padding: 0;
    border: 16rpx solid transparent;
    border-color: transparent transparent #fff transparent;
    content: '';
  }

  .select.position-bottom::before {
    width: 0px;
    height: 0px;
    position: absolute;
    bottom: 100%;
    left: 10%;
    padding: 0;
    border: 20rpx solid transparent;
    border-color: transparent transparent #f3f3f3 transparent;
    transform: translate(-4rpx, 0);
    content: '';
  }

  // 弹窗在上方
  .select.position-top {
    bottom: calc(#{$height} + 30rpx);
  }

  .select.position-top::after {
    width: 0px;
    height: 0px;
    position: absolute;
    top: 100%;
    left: 10%;
    padding: 0;
    border: 16rpx solid transparent;
    border-color: #fff transparent transparent transparent;
    content: '';
  }

  .select.position-top::before {
    width: 0px;
    height: 0px;
    position: absolute;
    top: 100%;
    left: 10%;
    padding: 0;
    border: 20rpx solid transparent;
    border-color: #f3f3f3 transparent transparent transparent;
    transform: translate(-4rpx, 0);
    content: '';
  }

  .popup {
    position: absolute;
    z-index: 9;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    view {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }

}
</style>
