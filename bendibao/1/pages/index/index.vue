<template>
	<view>
		<div class="header">
			<img src="../../static/全国限行规定查询.png" alt="">
			<div class="select-drop">
				<div class="selected" v-model="addressCul" @click="addressDrop">
					{{addressCul}}
					<img src="@/static/路径 10.png" alt="">
				</div>
				<div class="address-list" :class="{show:addressIsDrop}">
					<div v-for="(item,index) in addressList" @click="addressRise(item)">
						{{item}}
					</div>
				</div>
			</div>
			<div class="nav">
				<div class="nav-text">
					北京限行
				</div>
				<div class="select-drop">
					<div class="selected" v-model="carCul" @click="carDrop">
						{{carCul}}
						<img src="@/static/路径 10.png" alt="">
					</div>
					<div class="address-list" :class="{show:carIsDrop}">
						<div v-for="(item,index) in carList" @click="carRise(item)">
							{{item}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tab">
			<span>本地</span>
			<span>外地</span>
		</div>
		<div class="local">
			<div class="container">
				<div>
					<div class="day">
						<div>今日限行</div>
						<div>07月22日(周三)</div>
						<div>2，7</div>
					</div>
					<div class="line"></div>
					<div class="tomorrow">
						<div>明日限行</div>
						<div>07月22日(周三)</div>
						<div>2，7</div>
					</div>
				</div>
				<hr>
				<div class="bar">
					<uni-notice-bar scrollable="true" single="true" text="本周尾号限行（2020年07月13日~2020年07月19日）">
					</uni-notice-bar>
				</div>

				<div class="calendar">

					<div class="swiper-container">
						<div class="swiper-wrapper">
							<div class="swiper-slide">
								<div class="date" v-for="(item,index) in date1">
									<div>{{item[0]}}</div>
									<div>{{item[1]}}</div>
								</div>
							</div>
							<div class="swiper-slide">
								<div class="date" v-for="(item,index) in date2">
									<div>{{item[0]}}</div>
									<div>{{item[1]}}</div>
								</div>
							</div>
						</div>
						<!-- Add Pagination -->
						<div class="swiper-pagination" slot="pagination"></div>
					</div>
				</div>
				<hr>
				<div class="info" v-for="(item,index) in info" :key="index">
					<div class="title">{{item.title}}</div>
					<div>
						<div class="info-time info-style">{{item.timeTitle}}</div>
						<div class="time-detail info-style">{{item.timeDetail}}</div>
					</div>
					<div>
						<div class="info-area info-style">{{item.areaTitle}}</div>
						<div class="area-detail info-style">{{item.areaDetail}}</div>
					</div>
					<div>
						<div class="info-rule info-style">{{item.ruleTitle}}</div>
						<div class="rule-detail info-style">{{item.ruleDetail}}</div>
					</div>
				</div>
			</div>
		</div>
		<hr>
		<div class="footer">
			
			<div>
				<img src="@/static/组 203.png" alt="">
				<div>限行日历</div>
			</div>
			<div>
				<div><img src="@/static/组 205.png" alt="">
				<div>处罚标题</div></div>
			</div>
			<div>
				<div><img src="@/static/组 204.png" alt="">
				<div>常见问题</div></div>
			</div>
		</div>
	</view>
</template>

<script>
	import Swiper from '@/common/swiper-bundle.min.js'
	export default {
		mounted() {
			new Swiper('.swiper-container', {
				loop: true,
				// 如果需要分页器
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				// 如果需要前进后退按钮
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				// 如果需要滚动条
				// scrollbar: '.swiper-scrollbar',
				//如果需要自动切换海报
				// autoplay: {
				//   delay: 1000,//时间 毫秒
				//   disableOnInteraction: false,//用户操作之后是否停止自动轮播默认true
				// },
			})
		},
		data: () => {
			return {
				addressCul: "北京",
				addressList: ["北京", "成都", "上海"],
				addressIsDrop: false,
				carCul: "新能源车",
				carList: ["新能源车", "1", "2"],
				carIsDrop: false,
				date1: [
					["周一", "2,7"],
					["周一", "2,7"],
					["周一", "2,7"],
					["周一", "2,7"],
					["周一", "2,7"],
					["周一", "2,7"],
					["周一", "2,7"],
				],
				date2: [
					["周三", "2,7"],
					["周三", "2,7"],
					["周三", "2,7"],
					["周三", "2,7"],
					["周三", "2,7"],
					["周三", "2,7"],
					["周三", "2,7"],
				],
				info: [{
						title: "限行一",
						timeTitle: "限行时间",
						timeDetail: "限行时间限行时间限行时间限行时间限行时间限行时间限 限行时间限行时间行时间",
						areaTitle: "限行区域",
						areaDetail: "限行时间限行时间限行时间限行时间限行时间限行时间限 限行时间限行时间行时间",
						ruleTitle: "限行规则",
						ruleDetail: "限行时间限行时间限行时间限行时间限行时间限行时间限 限行时间限行时间行时间",
					},
					{
						title: "限行二",
						timeTitle: "限行时间",
						timeDetail: "限行时间限行时间限行时间限行时间限行时间限行时间限 限行时间限行时间行时间",
						areaTitle: "限行区域",
						areaDetail: "限行时间限行时间限行时间限行时间限行时间限行时间限 限行时间限行时间行时间",
						ruleTitle: "限行规则",
						ruleDetail: "限行时间限行时间限行时间限行时间限行时间限行时间限 限行时间限行时间行时间",
					}
				]
			}
		},
		methods: {
			addressDrop() {

				this.addressIsDrop = !this.addressIsDrop
			},
			addressRise(item) {
				this.addressIsDrop = false
				let old = this.addressCul
				this.addressCul = item
			},
			carDrop() {
				this.carIsDrop = !this.carIsDrop
			},
			carRise(item) {
				this.carIsDrop = false
				let old = this.carCul
				this.carCul = item
			}
		}
	}
</script>

<style scoped>
	@import url("@/css/index.css");
	@import url("@/common/swiper-bundle.min.css");
</style>
