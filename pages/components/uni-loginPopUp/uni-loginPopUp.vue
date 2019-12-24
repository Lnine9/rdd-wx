<template>
	<uni-popup ref="loginPopup" type="center" :mask-click="false" >
		<view class="uni-tip">
			<text class="uni-tip-title">警告</text>
			<text class="uni-tip-content">检测到您目前未登录，是否立即登录？</text>
			<view class="uni-tip-group-button">
				<text class="uni-tip-button-cancle" @click="close()">取消</text>
				<text class="uni-tip-button-update" @click="loginUpdate()">确定</text>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from "../uni-popup/uni-popup.vue"
	export default {
		props:{
			
		},
		components:{
			uniPopup
		},
		methods:{
			//打开弹窗
			open(){
				this.$refs.loginPopup.open();
			},
			//关闭弹窗
			close(){
				this.$refs.loginPopup.close();
			},
			//确认登录
			loginUpdate(){
				this.$refs.loginPopup.close();
				uni.navigateTo({
					url: `/pages/index/index`
				})
			},
		}
	}
	
	
	
</script>


<style>
	.uni-tip {
		width: 580rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.uni-tip-title {
		display: inline-block;
		width: 580rpx;
		margin:20rpx 0;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
	}

	.uni-tip-content {
		display: inline-block;
		width: 580rpx;
		margin:10rpx 0;
		text-align: center;
		font-size: 30rpx;
	}
	.uni-tip-group-button {
		display: inline-block;
		width: 580rpx;
		height: 80rpx;
		border-width: 1rpx 0 0 0;
		border-style: dashed;
		border-color: #f3f3f3;
		margin-top: 40rpx;
	}
	.uni-tip-button-cancle {
		display: inline-block;
		text-align: center;
		border-width: 0 1rpx 0 0;
		border-style: dashed;
		border-color: #f3f3f3;
		height: 80rpx;
		width: 288rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #3b4144;
	}
	.uni-tip-button-update {
		display: inline-block;
		text-align: center;
		width: 290rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #06C1AE;
	}
</style>
