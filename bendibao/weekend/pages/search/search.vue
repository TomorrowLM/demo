<template>
	<div class="page">
		<div class="search">		
				<img src="../../static/矢量智能对象_1.png" alt="">
			<input type="text" placeholder="周末去哪儿玩" placeholder-style="color:#999999,font-size:0.28rem,font-weight:500,">			
			<img src="../../static/X.png" alt="">
			<span>取消</span>
		</div>
		<div class="recommend">
			<div class="title">
				热门推荐
			</div>
			<div class="recommend-list">
				<div v-for="(item,index) in recommendList" class='btn'>
					<img src="../../static/形状 1@2x.png" alt="" v-show="index<3">
					<span style="vertical-align: text-bottom;">{{item}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
recommendList:["Boss直播推荐 大牌酒店钜惠","火车票","酒店","汽车票","特价机票","民宿","一日游","一日游","自由行","邮轮"]
			}
		},
		methods: {

		}
	}
</script>

<style>
@import url("@/css/search.css");
</style>
