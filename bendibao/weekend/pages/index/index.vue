<template>
	<div class="page" @scroll="onScroll()">
		<div class="header">
			<div class="search">
				<div class="header-address" @click="switchCity()">
					<img src="@/static/形状 1358.png" alt="">
					<span>{{cityCul}}</span>
					<div>
						<img src="@/static/矢量智能对象.png" alt="">
					</div>
				</div>
				<input type="text" placeholder="周末去哪儿玩"
					placeholder-style="color:#999999,font-size:0.28rem,font-weight:500," @click="goToSearch()">
			</div>
			<div>
				<img src="@/static/形状 2.png" alt="">
			</div>
		</div>
		<div class="main">
			<div class="main-header">
				<img src="@/static/图层 548_1.png" alt="">
			</div>
			<div class="nav">
				<div v-for="(item,index) in navList" class="nav-list">
					<img :src="item[0]" alt="">
					<div>{{item[1]}}</div>
				</div>
			</div>
			<div class="line-1"></div>
		</div>
		<div class="section">
			<div class="scenic-spot">
				<div class="scenic-title">
					<div>人气景点</div>
					<div @click="goToScenic()">
						查看全部
						<img src="@/static/形状 13.png" alt="">
					</div>
				</div>
				<div class="scenic-swiper">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						:duration="duration">
						<swiper-item v-for="(item,index) in scenicList" class="swiper-item" ref="swiperItem"
							:style="{marginLeft:(index*0.3+'rem')}">
							<img :src="item[0]" alt="">
							<div class="scenic-info">
								<div>{{item[1]}}</div>
								<div>
									<span>{{item[2]}}</span>
									<span>{{item[3]}}</span>
									<span>{{item[4]}}</span>
								</div>
							</div>
						</swiper-item>
					</swiper>
				</div>
			</div>
			<div class="city">
				<div class="city-title">
					周边城市
				</div>
				<div class="city-img flex">
					<div v-for="(item,index) in cityList" class="city-container">
						<img :src="item[0]" alt="">
						<span>{{item[1]}}</span>
					</div>
				</div>
				<div class="city-other flex">
					<div v-for="(item,index) in otherCityList">
						{{item}}
					</div>
				</div>
			</div>
			<div class="preference">
				<div class="preference-title">
					今日特惠
				</div>
				<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
				<swiper :current="TabCur" duration="300" @change="swiperChange" class="preference-tab-container">
					<swiper-item v-for="(item,index) in allList" :key="index">
						<div class="card" v-for="(item,index) in item">
							<div class="card-container">
								<img :src="item[0]" alt="">
								<div class="card-info">
									<div>
										{{item[1]}}
									</div>
									<div class="card-price">
										<span>{{item[2]}}</span>
										<span>{{item[3]}}</span>
										<span>{{item[4]}}</span>
										<del>{{item[5]}}</del>
									</div>
								</div>
							</div>
						</div>
					</swiper-item>
				</swiper>
			</div>
		</div>
	</div>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	export default {
		components: {
			WucTab
		},
		mounted() {
			window.addEventListener('scroll', this.onScroll, true)
			// this.boxTop = this.$refs.tabList.offsetTop;
		},
		// 从当前页面实例中获取定位城市
		onLoad(option) {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1]; // 当前页的实例
			console.log(currPage)
			this.cityCul = currPage.$vm.cityCul
		},
		data() {
			return {
				//当前城市
				cityCul: "深圳",
				//导航列表
				navList: [
					["../../static/组 4.png", "景点门票"],
					["../../static/组 6.png", "亲子活动"],
					["../../static/形状 6.png", "动植物园"],
					["../../static/组 8.png", "自然风光"],
					["../../static/组 4.png", "主题酒店"],
					["../../static/形状 11.png", "特色美食"],
					["../../static/形状 12.png", "跟团旅游"],
					["../../static/矢量智能对象2.png", "展馆展览"],
				],
				//景点列表
				scenicList: [
					["../../static/图层 548.png", "深圳欢乐谷", "￥", "198", "起"],
					["../../static/图层 549.png", "深圳欢乐谷", "￥", "198", "起"],
					["../../static/图层 548.png", "深圳欢乐谷", "￥", "198", "起"],
				],
				//swiper动画效果
				indicatorDots: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				//城市列表
				cityList: [
					["../../static/图层 31.png", "广州"],
					["../../static/图层 32.png", "惠州"],
					["../../static/图层 36.png", "东莞"],
				],
				//其他 城市列表
				otherCityList: [
					"东莞", "佛山", "肇庆", "河源", "潮汕", "梅州"
				],
				//当前tab的index
				TabCur: 0,
				//选项卡列表
				tabList: [{
					name: '全部'
				}, {
					name: '景点'
				}, {
					name: '美食'
				}, {
					name: '酒店'
				}, {
					name: '玩乐'
				}],
				//选项卡所有数据
				allList: [
					[
						["../../static/图层 43.png",
							"【湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥", "198", "起", "￥298"
						],
						["../../static/图层 43.png",
							"【湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥", "198", "起", "￥298"
						],
						["../../static/图层 43.png",
							"【湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥", "198", "起", "￥298"
						],
						["../../static/图层 43.png",
							"【湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥", "198", "起", "￥298"
						],
						["../../static/图层 43.png",
							"【湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥", "198", "起", "￥298"
						],
					]
				],

			}
		},
		methods: {
			// onScroll() {
			// 	console.log(1)
			// },
			//tab切换
			tabChange(index) {
				this.TabCur = index;
			},
			//跳转到切换城市
			switchCity() {
				console.log(1)
				uni.navigateTo({
					url: '../switchCity/switchCity',
					animationType: 'pop-in',
					animationDuration: 700
				});
			},
			//跳转到搜索页面
			goToSearch() {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			//跳转到景点页面
			goToScenic() {
				console.log(1)
				uni.navigateTo({
					url: '../weekend-list/weekend-list'
				});
			}
		}
	}
</script>

<style scoped>
	@import url("@/css/index.css");
</style>
