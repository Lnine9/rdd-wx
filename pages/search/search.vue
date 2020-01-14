<template>
	<view class="searchHead">
		<view class="searchBorder">
			<image class="searchImg" src="../../static/search.png"></image>
			<input class="searchFont" placeholder="请输入要搜索的商品" placeholder-style="color:#FFFFFF" />
		</view>
		<text class="cancel">取消</text>
	</view>
</template>

<script>
</script>

<style>
.searchHead{
	display: inline-block;
	width: 750rpx;
	height: 110rpx;
	background-color: #de2032;
}
.searchBorder{
	position: relative;
	left: 30rpx ;
	top: 10rpx;
	width: 600rpx;
	height: 76rpx;
	background-color: #ed8794;
	border-radius: 30rpx;
}
.cancel{
	position: absolute;
	right: 50rpx;
	top: 30rpx;
	color: #FFFFFF;
}
.searchImg{
	position: absolute;
	left: 23rpx;
	top: 18rpx;
	width: 40rpx;
	height: 40rpx;
}
.searchFont{
	position: absolute;
	left: 85rpx;
	top: 18rpx;
	color: #FFFFFF;
	font-size: 28rpx;
}
</style>

