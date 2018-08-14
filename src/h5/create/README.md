> 2018-03-07 10:28:02  
> zhongxia

数据的结构是最重要的，功能可以慢慢的扩展，但是数据结构需要能够方便的扩容。

## 一、创建页面状态管理规则

点读创建页面的状态（数据）是使用 rc-form 来进行管理。

可以理解为，所有的状态在根组件管理，根组件如何需要更新状态，则使用 下面状态管理的方法

## 二、状态管理

```javascript
const { getFieldValue, setFieldsValue, validateFields } = this.props.form
// 如何获取状态,  根据key名获取状态
let pagesData = getFieldValue('pages') || []

// 如何设置、更新状态
setFieldsValue({ pages: pagesData })

// 如何获取所有状态    会校验是否通过验证，并且获取所有状态
validateFields((error, data) => {
  console.log(error, data)
})
```

## 三、目录结构

创建页面分为两个部分

- 常规设置部分（简单表单,加一个图片截图）
- 点读页部分（主要工作量部分）

## 四、TODO

- 需要重新整理下目录结构, 区分开点读点，页面结构
