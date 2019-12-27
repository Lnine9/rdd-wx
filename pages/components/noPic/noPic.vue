<template>
	<view>
		<image :src="picSrc" class="noImg"></image>
		<text class="nodataText">{{noText}}</text>
	</view>
</template>

<script>
	export default {
		props: ["picSrc","noText"],
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.noImg {
		width: 200rpx;
		height: 200rpx;
		margin: 250rpx 0 0 270rpx;
	}
	.nodataText{
		font-size: 28rpx;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #CCCCCC;
	}
</style>
