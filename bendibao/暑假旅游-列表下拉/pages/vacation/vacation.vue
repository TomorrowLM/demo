<template>
	<view>
		<div class="header">
			<img src="@/static/2020深圳暑假攻略.png" alt="">
			<div class="select-drop">
				<div class="selected" v-model="vacationCul" @click="vacationDrop">
					{{vacationCul}}
					<img src="@/static/路径 10.png" alt="">
				</div>
				<div class="vacation-list" :class="{show:vacationIsDrop}">
					<div v-for="(item,index) in vacationList" @click="vacationRise(item)">
						{{item}}
					</div>
				</div>
			</div>
		</div>

		<div class="menu">
			<div class="container">
				<div>切换城市:</div>
				<div class="province-drop">
					<div class="selected selected-area" v-model="provinceCul" @click="provinceDrop">
						{{provinceCul}}
						<img src="@/static/路径 10.png" alt="">
					</div>
					<div class="province-list" :class="{show:provinceIsDrop}">
						<div v-for="(item,index) in provinceList" @click="provinceRise(item)">
							{{item}}
						</div>
					</div>
				</div>
				<div class="city-drop">
					<div class="selected selected-area" v-model="cityCul" @click="cityDrop">
						{{cityCul}}
						<img src="@/static/路径 10.png" alt="">
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
			<div class="main-title">
				<img src="@/static/组 174.png" alt="">
				<span>暑假活动</span>
			</div>
			<div class="active" v-for="(item,index) in activeList" :key="index">
				<div @click="showActive(index)">
					<span>{{item[0]}}</span>
					<span>{{item[1]}}</span>
					<img src="@/static/路径 10@2x.png" alt="" ref="triangle"
						:class="triangleActive==index?'triangle-active':''">
				</div>
				<div :ref="index" v-show="item[9]" style="display: block;">
					<div class="active-info">
						<div>
							<span>{{item[2]}}</span>
							<span>{{item[3]}} &nbsp; &nbsp; {{item[4]}}</span>
						</div>
						<div>
							<span>{{item[5]}}</span>
							<span>{{item[6]}}</span>
						</div>
						<div>
							<span>{{item[7]}}</span>
							<span>{{item[8]}}</span>
						</div>
					</div>
					<div class="activeBtn">
						<div>活动详情</div>
						<div>购票入口</div>
					</div>
				</div>
			</div>
		</div>


		<div class="local">
			<div class="main-title">
				<img src="@/static/组 174.png" alt="">
				<span>暑假本地游</span>
			</div>
			<div>
				<div v-for="(item,index) in localList">
					{{item}}
				</div>
			</div>
		</div>
		<div class="local">
			<div class="main-title">
				<img src="@/static/组 174.png" alt="">
				<span>暑假周边游</span>
			</div>
			<div>
				<div v-for="(item,index) in localList">
					{{item}}
				</div>
			</div>
		</div>
		<div class="local">
			<div class="main-title">
				<img src="@/static/组 174.png" alt="">
				<span>暑假国内游</span>
			</div>
			<div>
				<div v-for="(item,index) in localList">
					{{item}}
				</div>
			</div>
		</div>

		<div class="link-list">
			<div class="link-title">
				<img src="@/static/组 174.png" alt="">
				<span>专题互链</span>
			</div>
			<div class="link-item">
				<div>
					<img src="@/static/组 171.png" alt="">
					<div>核酸检测</div>
				</div>
				<div>
					<img src="@/static/组 157.png" alt="">
					<div>隔离政策</div>
				</div>
				<div>
					<img src="@/static/组 172.png" alt="">
					<div>境外病例</div>
				</div>
				<div>
					<img src="@/static/组 135.png" alt="">
					<div>入学政策</div>
				</div>
				<div>
					<img src="@/static/组 171.png" alt="">
					<div>核酸检测</div>
				</div>
				<div>
					<img src="@/static/组 157.png" alt="">
					<div>隔离政策</div>
				</div>
				<div>
					<img src="@/static/组 172.png" alt="">
					<div>境外病例</div>
				</div>
				<div>
					<img src="@/static/组 135.png" alt="">
					<div>入学政策</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vacationCul: "全部",
				vacationList: [1, 2, 3],
				vacationIsDrop: false,
				provinceCul: "江苏",
				provinceList: [1, 2, 3],
				provinceIsDrop: false,
				cityCul: "苏州",
				cityList: [1, 2, 3],
				cityIsDrop: false,
				triangleActive: 0,
				activeList: [
					["活动名称", "欢乐谷电音节", "时间", "提前3日（自然日）", "", "地点", "武汉东湖生态旅游风景区欢乐大道196 号", "门票",
						"http://www.bendibao.com/index.htm",
						true
					],
					["活动名称", "玛雅水上乐园", "时间", "提前3日（自然日）", "", "地点", "武汉东湖生态旅游风景区欢乐大道196 号", "门票",
						"http://www.bendibao.com/index.htm",
						false
					],
					["活动名称", "欢乐谷电音节", "时间", "提前3日（自然日）", "", "地点", "武汉东湖生态旅游风景区欢乐大道196 号", "门票",
						"http://www.bendibao.com/index.htm",
						false
					],
				],
				localList: ["水上乐园", "沙滩", "游泳馆", "水上乐园", "水上乐园", "水上乐园", "水上乐园"],
			}
		},
		methods: {
			vacationDrop() {

				this.vacationIsDrop = !this.vacationIsDrop
			},
			provinceDrop() {
				this.provinceIsDrop = !this.provinceIsDrop
			},
			cityDrop() {
				this.cityIsDrop = !this.cityIsDrop
			},
			vacationRise(item) {
				this.vacationIsDrop = false
				let old = this.vacationCul
				this.vacationCul = item
			},
			provinceRise(item) {
				this.provinceIsDrop = false
				let old = this.provinceCul
				this.provinceCul = item
			},
			cityRise(item) {
				this.cityIsDrop = false
				let old = this.cityCul
				this.cityCul = item
			},
			allMenu() {
				this.menuActice = -1;
				this.menuAllActive = true;
			},
			selectMenu(index) {
				this.menuAllActive = false;
				this.menuActice = index;
			},
			showActive(index) {
				this.triangleActive = -1;
				console.log(this.$refs[index][0].style.display)
				if (this.$refs[index][0].style.display == "none") {
					console.log(index)
					this.$refs[index][0].style.display = "block"
					this.$refs.triangle[index].classList.add("triangle-animation")
					// this.triangle = true
				} else if (this.$refs[index][0].style.display == "block") {
					console.log(index)
					this.$refs[index][0].style.display = "none"
					// this.triangle = false
					this.$refs.triangle[index].classList.remove("triangle-animation")
				}
			},
			tabclick(index) {
				this.tabCul = index;
			}
		}
	}
</script>

<style>
	@import url("@/css/vacation.css");
</style>
