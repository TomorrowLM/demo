<template>
	<div class="page">
		<div class="leave" @click="leave()">
			<img src="@/static/形状 1_4.png" alt="">
			<span>返回</span>
		</div>
		<div class="now-city">
			<div>当前城市</div>
			<div class="now-btn">{{CityCul}}</div>
		</div>
		<div class="allCity now-city">
			<div>所有城市</div>
		</div>
		<div class="all-city-btn">
			<div v-for="(item,index) in cityList" @click="selectCity(item)">
				{{item}}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//城市列表
				cityList: [
					"深圳", "海口", "厦门", "上海", "顺德", "苏州", "北京", "黑龙江", "北京", "桂林", "邵阳", "成都", "萍乡", "每周", "贵阳"
				],
				//当前城市
				CityCul: "深圳"
			}
		},
		methods: {
			//返回上一个页面
			leave() {
				let pages = getCurrentPages()
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				console.log(prevPage)
				prevPage.$vm.cityCul = this.CityCul
				uni.navigateBack({
					url: "../index/index?city=" + this.CityCul

				});
			},
			//设置当前城市定位
			selectCity(item) {
				this.CityCul = item
			}
		}
	}
</script>

<style>
	.leave {
		margin: 0.4rem 0.3rem;
	}

	.leave img {
		width: 0.17rem;
		height: 0.29rem;
		opacity: 1;
		vertical-align: auto;
		margin-right: 0.2rem;
	}

	.leave span {
		opacity: 1;
		font-size: 0.32rem;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: left;
		color: #ff6600;
		line-height: 0.06rem;
	}

	.now-city {
		margin: 0 0 0.5rem 0.4rem;
	}

	.now-city div:first-of-type {
		opacity: 1;
		font-size: 0.32rem;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		text-align: left;
		color: #000000;
	}

	.now-btn {
		width: 1.9rem;
		height: 0.62rem;
		opacity: 1;
		background: #ff6600;
		border-radius: 0.3rem;
		text-align: center;
		line-height: 0.62rem;

		opacity: 1;
		font-size: 0.3rem;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		color: #ffffff;
		margin-top: 0.2rem;
	}

	.all-city-btn {
		display: flex;
		flex-wrap: wrap;
		margin: auto
	}

	.all-city-btn div {
		width: 1.9rem;
		height: 0.62rem;
		opacity: 1;
		background: #f6f6f6;
		border-radius: 0.3rem;
		opacity: 1;
		background: #f6f6f6;
		border-radius: 0.3rem;
		margin: 0.1rem 0.3rem;
		text-align: center;
		line-height: 0.62rem;


		font-size: 0.3rem;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		color: #333333;
	}
</style>
