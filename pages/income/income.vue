<template>
	<view id="whole">
		
	</view>
</template>

<script>
	export default {
		onLoad(option){
			let title = '收益';
			console.log(option.type)
			if(option.type == 0){
				title = '返佣收益'
			}
			if(option.type == 1){
				title = '提现记录'
			}
			if(option.type == 4){
				title = '其他收益'
			}
			if(option.type == 3){
				title = '推荐收益'
			}
			uni.setNavigationBarTitle({
				title
			})
		}
	}
</script>

<style>
	#whole {
		width:750rpx;
		height:1206rpx;
		background:rgba(248,249,251,1);
	}
</style>
