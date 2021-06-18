# page-animation

H5端页面动画插件

## 使用方式

在 App.vue 文件内 mixins 引入 page-animation 组件即可

```js
import pageAnimation from './components/page-animation'
export default {
	mixins: [pageAnimation],
	onLaunch: function() {
		console.log('App Launch')
	}
}
```

## 注意事项

* 当前页面动画仅支持H5端
* 当前动画使用了 transform，会导致页面内元素的 fixed 定位失效，尽管在动画完毕后会移除，但仍然会在页面动画期间产生影响。