<template>
<div>
	<div class="box2">
		<div class="box1 animated bounce infinite" >
			1
		</div>
	</div>
</div>

</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		methods: {

		}
	}
</script>

<style>
	@import url("@/common/animate/animate.min.css");
	.box2{
		background-color: red;
		width: 100px;
		height: 100px;
		margin:auto;
		position: relative;
		animation-duration: 500ms
	}
	.box1{
		animation-duration: 500ms;
		position: initial;
	}
</style>
