<script>
	import pageAnimation from './components/page-animation'
	import "@/common/rem.js"
	export default {
		mixins: [pageAnimation],
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("@/common/normalize.css");
	@import url("@/common/animate/animate.min.css");
	@import url("@/common/common.css");
</style>
