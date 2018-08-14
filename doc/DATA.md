## 点读数据说明

各个点读点的数据结构参考 `DATA.js`, 这里讲一下大体的设计结构。

主要是点读点的数据，因为点读点的类型有很多。

```javascript
const DATA = {
  x: 0.5152777777777777, // 点读点坐标
  y: 0.4266666666666667,
  width: 0.3,
  height: 0.2,
  pointSize: 50, // 点读点圆的大小
  type: 'video', // 点读点类型
  data: {
    // 点读点数据(不同的点读点数据字段不一样))
    src: '../uploads/d91e4de9a9cc9f2470cfca39c2c97898.mp4',
    name: 'baozi.mp4'
  },
  format_config: {
    // 点读点格式设置（点读点的样式）
    background_color: '#10d636',
    color: '#0f0d04',
    font_family: 3,
    fontWeight: true
  }
}
```

> 这里主要分为 点读点的位置，大小。 点读点的展示数据， 点读点的样式。
