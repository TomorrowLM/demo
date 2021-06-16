<template>
	<div class="page" ref="page">
		<div class="header">
			<img src="@/static/3.9——MDSK音乐节专题banner.png" alt="">
			<div class="select-drop">
				<div class="selected" v-model="areaCul" @click="areaDrop">
					{{areaCul}}
					<img src="@/static/形状 1 拷贝.png" alt="">
				</div>
				<div class="area-list" :class="{show:areaIsDrop}">
					<div v-for="(item,index) in areaList" @click="areaRise(item)">
						{{item}}
					</div>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="card">
				<div class="container">
					<div class="card-header">
						<div>
							{{cardList[0][0]}}
						</div>
						<div>
							<span @click="showArea()">{{cardList[0][1]}}</span>
							<img :src="cardList[0][2]" alt="">
							<ul class="card-address" :class="{'show':cardAreaIsDrop}">
								<li v-for="(item,index) in cardAddress" @click="selectArea(item)">
									{{item}}
								</li>
							</ul>
						</div>
					</div>
					<div class="card-body flex">
						<div>{{cardList[1][0]}}</div>
						<div><img :src="cardList[1][1]" alt=""></div>
					</div>
					<div class="card-tip">
						{{cardList[2][0]}}
					</div>
					<div class="card-position">
						{{cardAreaCul}}
					</div>
				</div>
			</div>
			<div class="notification">
				<div class="container">
					{{notification}}
				</div>
			</div>
			<div class="tab">
				<div>
					<div class="tab-list flex" ref="tabList">
						<div v-for="(item,index) in tabList">
							<div @click="tabSwitch(index,item[1])">
								{{item[0]}}
								<div class="tab-bar animated bounceInLeft" v-show="index==tabCul"></div>
							</div>
						</div>
					</div>
					<!-- <div :style="{'height':topHeight}" class="tab-list-1">
					        
					 </div> -->
				</div>
				<div class="tab-info">
					<div class="tab-detail">
						<div class="flex">
							<div>购票指南</div>
							<div>
								购票详情
								<img src="../../static/形状 4.png" alt="">
							</div>
						</div>
						<div class="buy-card">
							<div v-for="(item,index) in buyCardList" class="container">
								<div class="flex">
									<div>{{item[0]}}</div>
									<div>{{item[1]}}</div>
								</div>
								<div class="">
									{{item[2]}}
								</div>
								<div class="flex">
									<div>{{item[3]}}</div>
									<div :class="!item[5]?'':'card-status-1'" @click="showBuyInfo(item[5])">{{item[4]}}
									</div>
								</div>
								<hr v-show="index!==(buyCardList.length-1)">
							</div>
						</div>
						<div class="tab-footer">
							<div class="tab-footer-container">
								<div v-for="(item,index) in tabFooterList">
									<img src="../../static/对.png" alt="">
									{{item[0]}}
									<div>{{item[1]}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
			<div class="introduce">
				<div class="introduce-title">
					节目介绍
				</div>
				<div class="introduce-info">
					<div v-for="(item,index) in introduceInfo" class=" animated fadeInLeft">
						{{item}}
					</div>
				</div>
				<div class="introduce-btn" @click="showIntroduceInfo()">
					{{introduceBtn}}
				</div>
				<div class="line"></div>
				<div class="whole-team">
					<div class="title">
						全阵容
					</div>
					<div class="whole-team-detail">

					</div>
				</div>
				<div class="whole-team">
					<div class="title">
						时间表
					</div>
					<div class="whole-team-detail">

					</div>
				</div>
			</div>
			<div class="notice">
				<div class="notice-title">
					入场须知
				</div>
				<div class="notice-body">
					<div class="notice-body-container">
						<div v-for="(item,index) in noticeList">
							<img src="../../static/对.png" alt="">
							{{item[0]}}
							<div>{{item[1]}}
							</div>
						</div>
					</div>
				</div>
				<div class="question">
					<div class="question-title">
						常见问题
					</div>
					<div class="questionBar">
						<div v-for="(item,index) in questionBarList">
							<div>{{item}}</div>
						</div>
					</div>
					<div class="line-1"></div>
					<div class="show-question">
						更多问题
					</div>
				</div>
			</div>
			<div class="volunteer">
				<div class="volunteer-title">
					志愿者招募
				</div>
				<div class="volunteer-btn">
					2021MDSK音乐节志愿者招募
				</div>
				<div class="volunteer-title">
					交通指南
				</div>
				<div class="volunteer-btn">
					2021MDSK音乐节交通及接驳车信息
				</div>
			</div>
			<div class="recommend">
				<div class="tab-recommend flex">
					<div v-for="(item,index) in recommendList" @click="recommendSwitch(index)">
						{{item}}

					</div>
					<div class="progress animated fadeInLeft" ref="progress"></div>
				</div>
				<div class="line-2">

				</div>
				<div class="music-news" v-show="recommendCul== 0">
					<div v-for="(item,index) in musicNewsList">
						<div>
							<img src="../../static/椭圆 1.png" alt="">
							{{item[0]}}
						</div>
						<div>{{item[1]}}</div>
						<div class="line-2"></div>
					</div>
					<div class="news-btn" @click="showMoreNews()">{{newsBtn}}</div>
				</div>
				<div v-show="recommendCul==1">1</div>
			</div>
		</div>
		<uni-popup ref="popup" type="center" background-color="#333">不在购票时间内</uni-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				areaCul: "武汉",
				areaList: ["成都", "长沙", "上海"],
				areaIsDrop: false,
				cardAddress: ["1区", "2区", "3区"],
				cardAreaCul: "1区",
				cardAreaIsDrop: false,
				cardList: [
					["M_DSK", "武汉", "../../static/形状 1 拷贝@3x.png"],
					["2021.04.07 周六 13:30", "../../static/形状 4.png"],
					["以现场为准"],
					["地点地点地点地点地点地点"]
				],
				notification: "2021苏州MDSK最新通知（持续更新）",
				boxTop: 0,
				tabList: [
					["详情", "tab-info"],
					["须知", "notice"],
					["推荐", "recommend"]
				],
				tabCul: 0,
				buyCardList: [
					["音乐节名称", "￥260", "门票类型", "2021.05.25", "购票", 0],
					["音乐节名称", "￥260", "门票类型", "2021.05.25", "购票", 1],
					["音乐节名称", "￥260", "门票类型", "2021.05.25", "已售空", 2]
				],
				buyStatus: ['card-status-1', 'card-status-2'],
				tabFooterList: [
					["关于票面价", "个别节目票纸上体现的价格与详情页选择的【票面价】可能存在差别（通常会低于票面价），但该票对应的实际价格档位座位均不受影响，如介意请谨慎购买。"],
					["条件退款", "项目销售业有“条件退款”标签的项目，如因买家原因无法正常观演，在扣除实际支付金额一定比例的手续费后，可以进行退票。"]
				],
				introduceInfo: [
					"1. 音乐节将依照要求严格控制每日观众入场人数。",
					" 2. 检票入场时需要出示本人身份证，通过核实验证有效后方可入场，非入场人本人身份证会被谢绝入场。",
					" 3. 请配合现场工作人员的其他相关防疫检查，同时您 需要佩戴好口罩，配合测量体温合格后方可入场，活动全程也请佩戴好口罩，并保持安全距离。"
				],
				introduceBtn: "展开更多",
				noticeList: [
					["节目时长", "以现场为准"],
					["入场时间", "以现场为准"],
					["条件退款", "演出现场禁止携带违禁食品、管制刀具、打火机、旗杆、冷焰火、宠物、各类瓶装饮料、含酒精制品、航拍飞行器、帐篷、充气沙发等物品。"],
					["寄存说明", "以现场为准"]
				],
				questionBarList: ["购票需要登记身份证吗？", "购票需要登记身份证吗？", "有没有现场电话号码？", "没有大陆身份证怎么订票？", "有座位图可以查看吗？", "上门取票地址在哪里？"],
				recommendCul: 0,
				recommendList: ["音乐节", "赏花咨讯", "踏青资讯", "春游资讯", "疫情资讯"],
				musicNewsList: [
					["武汉音乐节2021时间表（持续更新）", "2021-04-08 13:56"],
					["2021武汉MDSK音乐节嘉宾阵容名单一览", "2021-05-13 13:41"],
					["2021武汉MDSK音乐节嘉宾阵容名单一览", "2021-05-13 13:41"],
					["2021武汉MDSK音乐节嘉宾阵容名单一览", "2021-05-13 13:41"],
					["2021武汉MDSK音乐节嘉宾阵容名单一览", "2021-05-13 13:41"],
				],
				newsBtn: "查看更多"
			}
		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll, true)
			this.boxTop = this.$refs.tabList.offsetTop;
		},
		methods: {
			areaDrop() {
				this.areaIsDrop = !this.areaIsDrop
			},
			areaRise(item) {
				this.areaIsDrop = false
				let old = this.areaCul
				this.areaCul = item
			},
			showArea() {
				this.cardAreaIsDrop = !this.cardAreaIsDrop
			},
			selectArea(item) {
				this.cardAreaIsDrop = false
				let old = this.cardAreaCul
				this.cardAreaCul = item
			},
			tabSwitch(index, location) {
				this.tabCul = index;
				document.querySelector('.' + location).scrollIntoView(true);
			},
			showBuyInfo(item) {
				if (item == 1) {
					this.$refs.popup.open('center')
					setTimeout(() => {
						this.$refs.popup.close()
					}, 1000)
				}
			},

			handleScroll(e) {
				var scrollTop = e.target.documentElement.scrollTop || e.target.body.scrollTop; // 执行代码
				var boxTop = this.boxTop
				if (scrollTop > boxTop) {
					this.$refs.tabList.classList.add("fixed");
				} else {
					this.$refs.tabList.classList.remove("fixed");
				}
			},
			recommendSwitch(index) {
				this.$refs.progress.style.left = index * 1.5 + "rem"
				if (index == 0) {
					this.$refs.progress.style.left = 0.3 + "rem"
				}
				this.recommendCul = index;
			},
			showIntroduceInfo() {
				if (this.introduceInfo.length <= 5) {
					this.introduceInfo.push("4. 音乐节将依照要求严格控制每日观众入场人数。")
				} else
					this.introduceBtn = "没有了"
			},
			showMoreNews() {
				setTimeout(() => {
					if (this.musicNewsList.length < 10) {
						console.log(1)
						let old = this.musicNewsList
						old.forEach((val) => {
							this.musicNewsList.push(val)
						})
					} else
						this.newsBtn = "没有了"

				}, 1000)
			}
		}
	}
</script>

<style>
	@import url("@/css/index.css");
</style>
