<template>
	<view class="container">
		 <view>
		        <navigator url="/pages/about/about"><button type="default">通过navigator组件跳转到about页面</button></navigator>
		        <button type="default" @click="goto('/pages/about/about')">通过方法跳转到about页面</button>
		        <button type="default" @click="navigateTo('/pages/about/about')">跳转到about页面</button><!-- 这种写法只有h5平台支持，不跨端，不推荐使用 -->
		    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		methods: {

		}
	}
</script>

<style>
	div{
		background-color: red;
		width: 100px;
		height: 100px;
	}
</style>
