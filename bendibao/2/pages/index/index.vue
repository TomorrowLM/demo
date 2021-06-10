<template>
	<view>
		<div class="header">
			<img src="../../static/全国限行规定查询.png" alt="">
			<div class="select-drop">
				<div class="selected" v-model="addressCul"></div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data: ()=>{
			return {
				addressCul:"北京",
				addressList:["成都"]
			}
		},
		methods: {

		}
	}
</script>

<style>
	.header {
		position: relative;
	}

	.select-drop {
		position: absolute;
		right: 0;
		top: 0;
	}
	option{
		margin:5px;
	}
</style>
