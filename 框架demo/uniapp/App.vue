<script>
	export default {
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
	@import "@/wxcomponents/vant/dist/common/index.wxss";

	@media only screen and (max-width: 360px) and (min-width: 320px) {
		html {
			font-size: 13.65px;
		}
	}

	@media only screen and (max-width: 375px) and (min-width: 360px) {
		html {
			font-size: 23.4375px;
		}
	}

	@media only screen and (max-width: 390px) and (min-width: 375px) {
		html {
			font-size: 23.4375px;
		}
	}

	@media only screen and (max-width: 414px) and (min-width: 390px) {
		html {
			font-size: 17.64px;
		}
	}

	@media only screen and (max-width: 640px) and (min-width: 414px) {
		html {
			font-size: 17.664px;
		}
	}

	@media screen and (min-width: 640px) {
		html {
			font-size: 27.31px;
		}
		}
</style>
