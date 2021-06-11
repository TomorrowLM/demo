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
				<div>全部</div>
				<div class="menu-list">
					<div v-for="(item,index) in menuList" class="menu-item">
						{{item}}
					</div>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="active" v-for="(item,index) in activeList" :key="index" >
				<div @click="showActive(index)">
					<img src="@/static/矩形 127.png" alt="">
					<span>{{item[0]}}</span>
					<img src="@/static/路径 10@2x.png" alt="">
				</div>
				<div :ref="index" v-show="item[8]" style="display: block;">
					<div class="active-info" >
						<div>
							<span>{{item[1]}}</span>
							<span>{{item[2]}} &nbsp; &nbsp; {{item[3]}}</span>
						</div>
						<div>
							<span>{{item[4]}}</span>
							<span>{{item[5]}}</span>
						</div>
						<div>
							<span>{{item[6]}}</span>
							<span>{{item[7]}}</span>
						</div>
					</div>
					<div class="activeBtn">
						<div>活动详情</div>
						<div>购票入口</div>
					</div>
				</div>
			</div>
		</div>
		<div class="line-1"></div>
		<div class="tab">
			<div class="tab-list">
				<div v-for="(item,index) in tabList" @click="tabclick(index)" :class="{'tab-active':tabCul==index}">{{item}}</div>
			</div>
			<div v-show="tabCul==0" class="tab-detail">		
				1
			</div>
			<div v-show="tabCul==1" class="tab-detail">
				<div>
					<img src="@/static/组 187.png" alt="">
					<span>水上乐园</span>
				</div>
				<div>
					<img src="@/static/组 187.png" alt="">
					<span>水上乐园</span>
				</div>
				<div>
					<img src="@/static/组 187.png" alt="">
					<span>水上乐园</span>
				</div>
				<div>
					<img src="@/static/组 187.png" alt="">
					<span>水上乐园</span>
				</div>
			</div>
			<div v-show="tabCul==2" class="tab-detail">		
				1
			</div>
		</div>
		<div class="line-1"></div>
		<div class="link-list">
			<div class="link-title">
				<img src="@/static/组 174.png" alt="">
				<span>专题互链</span>
			</div>
			<div class="link-item">
				<div>
					<img src="@/static/组 171.png" alt="">
				</div>
				<div>
					<img src="@/static/组 171.png" alt="">
				</div>
				<div>
					<img src="@/static/组 171.png" alt="">
				</div>
				<div>
					<img src="@/static/组 171.png" alt="">
				</div>
				<div>
					<img src="@/static/组 171.png" alt="">
				</div>
				<div>
					<img src="@/static/组 171.png" alt="">
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
				menuList: ["景区", "景区", "景区", "景区", "景区", "景区"],
				activeList: [
					["活动二", "时间", "2020-07-29", "13：00", "地点", "111111武汉东湖生态旅游风景区欢乐大道196 号", "门票", "武汉东湖生态旅游风景区欢乐大道",
						true
					],
					["活动三", "时间", "2020-07-29", "13：00", "地点", "111111武汉东湖生态旅游风景区欢乐大道196 号", "门票", "武汉东湖生态旅游风景区欢乐大道",
						false
					]
				],
				tabList:["暑假本地游","暑假周边游","暑假国内游"],
				tabCul:1
			}
		},
		methods: {
			vacationDrop() {

				this.vacationIsDrop = !this.vacationIsDrop
			},
			vacationRise(item) {
				this.vacationIsDrop = false
				let old = this.vacationCul
				this.vacationCul = item
			},
			showActive(index) {
				console.log(this.$refs[index][0].style.display)
				if (this.$refs[index][0].style.display == "none") {
					console.log(index)
					this.$refs[index][0].style.display = "block"
				} else if (this.$refs[index][0].style.display == "block") {
						console.log(index)
					this.$refs[index][0].style.display = "none"
				}
			},
			tabclick(index){
				this.tabCul = index;
			}
		}
	}
</script>

<style>
	@import url("@/css/vacation-1.css");
</style>
