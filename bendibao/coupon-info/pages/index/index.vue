<template>
	<div class="page">
		<div class="header">
			<img src="@/static/1.png" alt="">
			<div class="header-select">
				<div class="select-drop">
					<div class="selected" v-model="headerSelectCul" @click="headerSelectDrop()">
						{{headerSelectCul}}
						<img src="@/static/形状 1 拷贝.png" alt="">
					</div>
					<div class="headerSelect-list" :class="{show:headerSelectIsDrop}">
						<div v-for="(item,index) in headerSelectList" @click="headerSelectRise(item)">
							{{item}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="select-card">
			<div class="title">
				切换城市:
			</div>
			<div class="select-province">
				<div class="select-drop">
					<div class="selected" v-model="provinceCul" @click="provinceDrop">
						{{provinceCul}}
						<img src="@/static/形状 1 拷贝.png" alt="">
					</div>
					<div class="province-list" :class="{show:provinceIsDrop}">
						<div v-for="(item,index) in provinceList" @click="provinceRise(item)">
							{{item}}
						</div>
					</div>
				</div>
			</div>
			<div class="select-city">
				<div class="select-drop">
					<div class="selected" v-model="cityCul" @click="cityDrop">
						{{cityCul}}
						<img src="@/static/形状 1 拷贝.png" alt="">
					</div>
					<div class="city-list" :class="{show:cityIsDrop}">
						<div v-for="(item,index) in cityList" @click="cityRise(item)">
							{{item}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="news">
				<div class="title">
					<img src="@/static/矩形 5 拷贝.png" alt="">
					<span>最新情报</span>
				</div>
				<div class="info">
					<img src="@/static/纸业.png" alt="">
					<span>杭州九价宫颈癌疫苗预约公告（持续更新）</span>
				</div>
			</div>
			<div class="tab">
				<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
				<swiper :current="TabCur" duration="300">
					<swiper-item v-for="(item,index) in tabList" :key="index" @touchstart="touchStart($event,index)"
						@touchend="touchEnd($event,index)">
						<div v-show="index==0">
							<div class="subsidy-1">
								<div v-for="(item,index) in subsidyList1">
									<div class="header"  @click="selectList1(index)">
										<div>
											<img src="@/static/矩形 5 拷贝.png" alt="">
											<p>{{item[0]}}</p>
										</div>
										<img src="@/static/形状 2.png" alt=""  :class="[SubsidyCul1[index]?'rotate':'']">
									</div>
									<div class="body animated fadeInDown" v-show="SubsidyCul1[index]" :class="[!SubsidyCul1[index]?'fadeOutDown':'']">
										<div>{{item[1]}}</div>
										<div>{{item[2]}}</div>	
										<div>{{item[3]}}</div>
										<div>{{item[4]}}</div>
										<div class="footer">
											<div>
												<img src="@/static/时 间.png" alt="">
												{{item[5]}}
											</div>
											<div>
												<img src="@/static/纸业.png" alt="">
												{{item[6]}}
											</div>
										</div>
										<div class="line">
											
										</div>
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
	import WucTab from '@/common/uniapp/wuc-tab/wuc-tab.vue';
	export default {
		components: {
			WucTab
		},
		data() {
			return {
				headerSelectCul: "深圳",
				headerSelectList: [1, 2, 3],
				headerSelectIsDrop: false,
				provinceCul: "浙江",
				provinceList: ["四川", "云南", "广东"],
				provinceIsDrop: false,
				cityCul: "杭州",
				cityList: [1, 2, 3],
				cityIsDrop: false,
				TabCur: 0,
				tabList: [{
					name: '生活补贴'
				}, {
					name: '生活落户'
				}],
				touchStartX: 0, // 触屏起始点x  
				touchStartY: 0, // 触屏起始点y  
				subsidyList1: [
					[
						"应届毕业生生活补贴","人员范围：","北京中高风险地区来深人员","隔离要求：",
						"1.对近14天内有高风险地区旅居史的来粤返粤人 员实施14天集中隔离医学观察，加大对5月30日 以来有北京新发地批发市场活动史的高风险人员 及其密切接触者的协查追踪力度。",
						"领取入口","常见问题"
					],
					[
						"应届毕业生生活补贴","人员范围：","北京中高风险地区来深人员","隔离要求：",
						"1.对近14天内有高风险地区旅居史的来粤返粤人 员实施14天集中隔离医学观察，加大对5月30日 以来有北京新发地批发市场活动史的高风险人员 及其密切接触者的协查追踪力度。",
						"领取入口","常见问题"
					],
					[
						"应届毕业生生活补贴","人员范围：","北京中高风险地区来深人员","隔离要求：",
						"1.对近14天内有高风险地区旅居史的来粤返粤人 员实施14天集中隔离医学观察，加大对5月30日 以来有北京新发地批发市场活动史的高风险人员 及其密切接触者的协查追踪力度。",
						"领取入口","常见问题"
					]
				],
				SubsidyCul1: [true,false,false],
			}
		},
		methods: {
			headerSelectDrop() {
				this.headerSelectIsDrop = !this.headerSelectIsDrop
			},
			headerSelectRise(item) {
				this.headerSelectIsDrop = false
				let old = this.headerSelectCul
				this.headerSelectCul = item
			},
			provinceDrop() {

				this.provinceIsDrop = !this.provinceIsDrop
			},
			provinceRise(item) {
				this.provinceIsDrop = false
				let old = this.provinceCul
				this.provinceCul = item
			},
			cityDrop() {
				this.cityIsDrop = !this.cityIsDrop
			},
			cityRise(item) {
				this.cityIsDrop = false
				let old = this.cityCul
				this.cityCul = item
			},
			tabChange(index) {
				this.TabCur = index;
			},
			touchStart(e, index) {
				// console.log("触摸开始")
				this.touchStartX = e.touches[0].clientX;
				this.touchStartY = e.touches[0].clientY;
			},
			touchEnd(e, index) {
				// console.log("触摸结束")

				let deltaX = e.changedTouches[0].clientX - this.touchStartX;
				let deltaY = e.changedTouches[0].clientY - this.touchStartY;
				if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
					if (deltaX >= 0) {
						// console.log("左滑")
						this.TabCur = index - 1;
					} else {
						// console.log("右滑")

						this.TabCur = index + 1;

					}
				} else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < Math.abs(deltaY)) {
					if (deltaY < 0) {
						// console.log("上滑")
					} else {
						// console.log("下滑")
					}
				} else {
					// console.log("可能是误触！")
				}
				if (this.TabCur == -1) {
					this.TabCur = 0
				}
			},
			selectList1(index){
				this.$set(this.SubsidyCul1,index,!this.SubsidyCul1[index]);
				//第一个参数为数组，第二个参数为数组下标，第三个参数为设置的值，
			}
		}
	}
</script>

<style scoped lang="scss" src="@/css/index.scss">
</style>
