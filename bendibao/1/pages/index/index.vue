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
		</div>
	</view>
</template>

<script>
	export default {
		data: () => {
			return {
				addressCul: "北京",
				addressList: ["北京", "成都", "上海"],
				addressIsDrop: false,
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
			}
		}
	}
</script>

<style>
	@import url("@/css/index.css");
</style>
