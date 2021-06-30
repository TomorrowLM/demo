<template>
	<div class="page">
		<div class="header">
			<img src="@/static/hearder.png" alt="">
			<div class="select-drop">
				<div class="selected" v-model="cityCul" @click="cityDrop">
					{{cityCul}}
					<img src="@/static/形状 7_1.png" alt="">
				</div>
				<div class="city-list" :class="{show:cityIsDrop}">
					<div v-for="(item,index) in cityList" @click="cityRise(item)">
						{{item}}
					</div>
				</div>
			</div>
		</div>
		<div class="line-1">
		</div>
		<div class="main">
			<div class="platform">
				<div class="platform-title">
					<img src="@/static/椭圆 1_1.png" alt="">
					本地区查询平台
				</div>
				<div class="platform-card" v-for="(item,index) in platformList">
					<div class="platform-card-container">
						<div>
							<span>{{item[0]}}</span>
							<span>{{item[1]}}</span>
						</div>
						<div class="line-2"></div>
						<div>
							<div>{{item[2]}}</div>
							<div>{{item[3]}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="other-platform">
				<div class="platform-title">
					<img src="@/static/椭圆 1_1.png" alt="">
					其他地区查询平台
				</div>
				<div class="search">
					<input type="text" placeholder="请输入查询省份" v-model:value="searchVal">
					<ul class="search-list animated fadeInUp" :class="{'search-list-show':searchList.length !== 0}">
						<li v-for="(item,index) in searchList" @click="selectProvince(item)">{{item}}</li>
					</ul>
					<div>
						<img src="@/static/搜索@3x.png" alt="" @click="searchProvince">
					</div>
				</div>
				<div class="other-card" v-for="(item,index) in otherList" v-show="provinceCul==''">
					<div class="other-card-container">
						<div class="other-card-header flex">
							<div>
								<span>{{item[0]}}</span>
								<span>{{item[1]}}</span>
							</div>
							<div>
								<img src="@/static/形状 4 拷贝@2x.png" alt="">
							</div>
						</div>
						<div class="other-card-body" v-for="(item,index) in otheAreaList">

							<div>
								<div>
									<img src="@/static/圆角矩形 16.png" alt="">
									{{item[0]}}
								</div>
								<div>
									{{item[1]}}
								</div>
								<div>
									{{item[2]}}

								</div>
							</div>
							<hr v-show="index!==(otheAreaList.length-1)">

						</div>
					</div>
				</div>

				<div class="other-card" v-show="provinceCul==provinceCulList[0]">
					<div class="other-card-container">
						<div class="other-card-header flex">
							<div>
								<span>{{provinceCulList[0]}}</span>
								<span>{{provinceCulList[1]}}</span>
							</div>
							<div>
								<img src="@/static/形状 4 拷贝@2x.png" alt="">
							</div>
						</div>
						<div class="other-card-body" v-for="(item,index) in otheAreaList">

							<div>
								<div>
									<img src="@/static/圆角矩形 16.png" alt="">
									{{item[0]}}
								</div>
								<div>
									{{item[1]}}
								</div>
								<div>
									{{item[2]}}

								</div>
							</div>
							<hr v-show="index!==(otheAreaList.length-1)">

						</div>
					</div>
				</div>
				<div v-show="provinceCul=='no information'" class="selected-false">
					抱歉，没有该城市的信息
				</div>
			</div>
			<div class="module">
				导粉模块
			</div>
		</div>
		<div class="footer">
			<div class="footer-container">
				<div>
					<div  class="btn">
						<div>分享</div>
						<img src="@/static/分 享.png" alt="">
					</div>
				</div>
				<div>
					跳转到医疗资讯页
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				cityCul: "武汉",
				cityList: [1, 2, 3],
				cityIsDrop: false,
				// 本地平台列表
				platformList: [
					["湖北疾控", "微信公众号", "查询入口", "查询指南"],
					["湖北健康码", "支付宝", "查询入口", "查询指南"],
					["鄂惠办", "微信小程序", "查询入口", "查询指南"],
					["武汉战疫", "微信小程序", "查询入口", "查询指南"],
				],
				//展示其他平台列表
				otherList: [
					["广州", "共3个查询平台"],
					["北京", "共3个查询平台"],
					["上海", "共3个查询平台"]
				],
				//其他平台总的列表
				otherList1: [
					["广州", "共3个查询平台"],
					["广西", "共3个查询平台"],
					["北京", "共3个查询平台"],
					["上海", "共3个查询平台"],
					["成都", "共3个查询平台"],
					["北京", "共3个查询平台"],
					["武汉", "共3个查询平台"]
				],
				//其他地区的列表
				otheAreaList: [
					["广州疾控", "查询入口", "查询指南"],
					["广州疾控", "查询入口", "查询指南"],
					["广州疾控", "查询入口", "查询指南"]
				],
				//输入框的值
				searchVal: "",
				// 检索输入框的字符，得到的其他省份的列表
				searchList: [],
				//选中省份的值
				provinceCul: "",
				// 选中省份列表
				provinceCulList: [],
				
			}
		},
		// 监听searchVal变化，将searchList展示
		watch: {
			searchVal(curVal, oldVal) {
				this.searchList = []
				let otherList1 = []
				this.otherList1.forEach((value, index) => {
					otherList1.push(value[0])
				})
				let reg = new RegExp(this.searchVal)
				otherList1.forEach((value, index) => {
					if (reg.test(value) && !reg.test("")) {
						this.searchList.push(value)
					}
				})
			}
		},
		methods: {
			cityDrop() {
				this.cityIsDrop = !this.cityIsDrop
			},
			cityRise(item) {
				this.cityIsDrop = false
				let old = this.cityCul
				this.cityCul = item
			},
			// 选择searchList中的某个省份，展示provinceCulList
			selectProvince(item) {
				console.log(this.provinceCul)
				this.searchVal = ""
				this.provinceCul = item
				this.otherList1.forEach((value, index) => {
					if (value[0].indexOf(this.provinceCul) !== -1) {
						this.provinceCulList = value
					}
				})
			},
			//点击搜索按钮，展示provinceCulList
			searchProvince() {
				console.log(this.provinceCul)
				let otherList1 = []
				this.searchList = []
				this.provinceCul = ""
				this.provinceCulList = []
				this.otherList1.forEach((value, index) => {
					otherList1.push(value[0])
				})
				let reg = new RegExp(this.searchVal)
				otherList1.forEach((value, index) => {
					if (value == this.searchVal) {
						console.log(1)
						this.provinceCul = value
						this.provinceCulList = this.otherList1[index]
					}
				})
				if (this.provinceCulList.length == 0) {
					console.log(2)
					this.provinceCul = "no information"
				}
				this.searchVal = ""
			}
		}
	}
</script>

<style>
	@import url("@/css/index.css");
	@import url("@/common/animate/animate.min.css");
</style>
