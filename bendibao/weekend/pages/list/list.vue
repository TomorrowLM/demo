<template>
	<div class="page">
		<div class="search">
			<img src="../../static/形状 1_2.png" alt="" @click="goBack()">
			<div class="search-btn">
				{{searchVal}}
				<img src="../../static/X.png" alt="">
			</div>
			<input type="text" placeholder="" placeholder-style="color:#999999,font-size:0.28rem,font-weight:500,">
			<img src="../../static/矢量智能对象_1.png" alt="">
		</div>
		<div class="main">
			<div class="card" v-for="(item,index) in cardList">
				<img :src="item[0]" alt="">
				<div class="card-info">
					{{item[1]}}
				</div>
				<div class="card-price">
					<span>{{item[2]}}</span>
					<span>{{item[3]}}</span>
					<span>{{item[4]}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		onLoad(option) {
			console.log(option)
			this.searchVal = option.searchVal
		},
		data() {
			return {
				cardList: [
					[
						"../../static/图层 549.png",
						"【湾区之光摩天轮】128米亲海全景太空,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅 湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
						"￥",
						"118",
						"￥228"
					],
					[
						"../../static/图层 549.png",
						"【湾区之光摩天轮】128米亲海全景太空,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅 湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
						"￥",
						"118",
						"￥228"
					],
					[
						"../../static/图层 549.png",
						"【湾区之光摩天轮】128米亲海全景太空,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅 湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
						"￥",
						"118",
						"￥228"
					]
				],
				//input框的value值
				searchVal: ""
			}
		},
		methods: {
			goBack() {
				//跳转到搜索页面
				uni.navigateBack({
					url: "../search/search"
				});
			}
		}
	}
</script>

<style>
	@import url("@/css/list.css");
</style>
