# qiao-select 搜索下拉选择框

一个支持搜索过滤的下拉选择框组件，适用于 uni-app 项目，兼容 Vue2 和 Vue3。

## 特性

- 支持输入搜索过滤下拉选项
- 支持 v-model 双向绑定
- 支持自定义显示字段和搜索字段
- 支持禁用、清空等功能
- 兼容 Vue2 / Vue3

## 安装使用

### 1. 引入组件

```javascript
import qiaoSelect from '@/uni_modules/qiao-select/components/qiao-select/qiaoSelect.vue'
```

### 2. 注册组件

**Vue2** 需要手动注册：

```javascript
export default {
  components: {
    qiaoSelect
  }
}
```

**Vue3** 引入后可直接使用，无需注册。

### 3. 基础用法

```html
<view style="width: 300rpx;">
  <qiaoSelect
    :keyId="1"
    :dataList="orgArray"
    phText="选择机构名称"
    showKey="name"
    searchKey="name"
    v-model="value"
    @change="selectChange"
  />
</view>
```

```javascript
// 数据示例
const orgArray = [
  { id: 1, name: '机构A' },
  { id: 2, name: '机构B' },
  { id: 3, name: '机构C' }
]

// 选择回调
function selectChange(e) {
  if (e) {
    console.log('选中：', e)
  } else {
    console.log('已清空')
  }
}
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| dataList | Array | [] | 下拉数据列表 |
| v-model | Object/String | - | 绑定选中的值 |
| keyId | Number/String | - | 唯一标识，用于多个组件互斥关闭 |
| showKey | String | 'name' | 列表中显示的字段名 |
| searchKey | String | 'name' | 搜索匹配的字段名，不设置则使用 showKey |
| phText | String | - | 输入框占位提示文字 |
| phColor | String | '#999999' | 占位文字颜色 |
| showBorder | Boolean | true | 是否显示边框 |
| disabled | Boolean | false | 是否禁用 |
| fontSize | String | '26rpx' | 字体大小 |
| align | String | 'left' | 文字对齐方式 |
| showIcon | Boolean | true | 是否显示下拉图标 |
| clearable | Boolean | true | 是否可清空 |
| searchable | Boolean | true | 是否支持搜索（false 时点击不弹出键盘，适合纯选择场景） |
| popupPosition | String | 'bottom' | 弹窗显示位置：'bottom'（下方）、'top'（上方） |
| multiple | Boolean | false | 是否开启多选模式 |
| multipleLimit | Number | 0 | 多选时最大可选数量，0 表示不限制 |
| onlyChoose | Boolean | false | 仅选择模式，选中后不在输入框显示 |
| returnType | String | 'object' | 返回类型：'object' 返回整个对象，'key' 返回指定字段值 |
| returnKey | String | - | returnType 为 'key' 时，指定返回的字段名（必填） |

## 事件说明

| 事件 | 参数 | 说明 |
|------|------|------|
| @change | item \| null | 选中项变化时触发，清空时返回 null |
| @input | Array | 搜索时触发，返回过滤后的结果列表 |

## 方法

通过 `ref` 调用组件方法：

```html
<qiaoSelect ref="selectRef" ... />
```

```javascript
// 清空选中值
this.$refs.selectRef.clickClear()
```

## 设置默认值

通过 `v-model` 绑定默认值：

```javascript
// returnType = 'object' 时，传入完整对象
this.value = { id: 1, name: '机构A' }

// returnType = 'key' 时，传入对应字段的值
this.value = 1  // 假设 returnKey = 'id'
```

## 清空组件

两种方式：

```javascript
// 方式1：通过 v-model 赋值 null
this.value = null

// 方式2：通过 ref 调用方法
this.$refs.selectRef.clickClear()
```

## 多选模式

```html
<qiaoSelect
  :dataList="list"
  v-model="selectedValues"
  :multiple="true"
  :multipleLimit="3"
  phText="请选择（最多3项）"
/>
```

```javascript
// 多选时 v-model 绑定数组
data() {
  return {
    selectedValues: []  // 或预设值 [obj1, obj2] / [id1, id2]
  }
}
```

**多选特性：**
- 点击选项切换选中状态，不会关闭弹窗
- 已选项显示勾选图标
- 显示区域用顿号分隔多个选中项
- `multipleLimit` 可限制最大选择数量

## 插槽

### option 插槽

自定义选项列表项的显示：

```html
<qiaoSelect :dataList="list" v-model="value">
  <template #option="{ item, index, selected }">
    <view class="custom-option">
      <image :src="item.icon" class="icon" />
      <text>{{ item.name }}</text>
      <text v-if="item.desc" class="desc">{{ item.desc }}</text>
    </view>
  </template>
</qiaoSelect>
```

**插槽参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| item | Object | 当前选项数据 |
| index | Number | 当前选项索引 |
| selected | Boolean | 是否已选中 |

### selected 插槽

自定义已选中内容的显示（仅在 `searchable=false` 或 `multiple=true` 时生效）：

```html
<qiaoSelect :dataList="list" v-model="value" :searchable="false">
  <template #selected="{ value, items, text }">
    <view class="custom-selected">
      <image v-if="value && value.icon" :src="value.icon" />
      <text>{{ text || '请选择' }}</text>
    </view>
  </template>
</qiaoSelect>
```

**插槽参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| value | Object/Array | 当前选中的值（多选时为数组） |
| items | Array | 多选时的选中项数组 |
| text | String | 默认显示文本 |

## 注意事项

1. 组件外层需要设置宽度，否则会自动撑满父容器
2. 多个组件同时使用时，建议设置不同的 `keyId` 以实现互斥关闭
3. 使用 `returnType: 'key'` 时，`returnKey` 为必填项
4. 多选模式下，`v-model` 绑定的是数组
5. 使用 `option` 插槽时，多选的勾选图标仍会自动显示
