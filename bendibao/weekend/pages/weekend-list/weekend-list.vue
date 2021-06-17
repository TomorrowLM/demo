<template>
	<div class="page">
		<div class="search">
			<img src="../../static/形状 1_2.png" alt="">
			<input type="text" placeholder="周末去哪儿玩"
				placeholder-style="color:#999999,font-size:0.28rem,font-weight:500,">
			<img src="../../static/矢量智能对象_1.png" alt="">
		</div>
		<div class="main">
			<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" tab-class="text-center text-black bg-white text-font" select-class="text-black text-xl"></wuc-tab>
			<swiper :current="TabCur" duration="300" class="preference-tab-container">
				<swiper-item v-for="(item,index) in allList" :key="index">
					<div>
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
					</div>
			
				</swiper-item>
				
			</swiper>

		</div>
	</div>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	export default {
		components: {
			WucTab
		},
		data() {
			return {
				TabCur: 0,
				tabList: [{
					name: '城市公园'
				}, {
					name: '高楼大厦'
				}, {
					name: '亲子同乐'
				}, {
					name: '赏花踏青'
				}, {
					name: '网红打开'
				}],
				allList: [
					[
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
					[
						[
							"../../static/图层 868.png",
							"【湾区之光摩天轮】128米亲海全景太空,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅 湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥",
							"118",
							"￥228"
						],
						[
							"../../static/图层 868.png",
							"【湾区之光摩天轮】128米亲海全景太空,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅 湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥",
							"118",
							"￥228"
						],
						[
							"../../static/图层 868.png",
							"【湾区之光摩天轮】128米亲海全景太空,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅 湾区之光摩天轮】128米亲海全景太空舱,360°通透玻璃浪漫天际与梦幻海湾尽收眼底,开启寻光之旅",
							"￥",
							"118",
							"￥228"
						]
					],
					
				],
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
				]
			}
		},
		methods: {
			tabChange(index) {
				this.TabCur = index;
			}
		}
	}
</script>

<style>
	@import url("@/css/weekend-list.css");
</style>
