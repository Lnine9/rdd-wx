<template>
   <view>
	   <image src="../../static/邀请好友/ic-背景.png" class="imageBackground"></image>
	   <view class="invite"></view>
	   <view class="scan"></view>
	   <image src="../../static/二维码.png" class="QRCode"></image>
	   <image src="../../static/邀请好友/按钮.png" class="btn"></image>
	   
   </view>
</template>

<script>
	
    export default {
        data() {
            return {
               account:'18223525462'
            };
        },
		
        methods: {
            share(){
				uni.navigateTo({
					url:`
				})
			}
        },
    }
</script>

<style>
   .imageBackground{
	   width: 750rpx;
	   height: 1240rpx;
   }
   
   .invite{
	   font-size: 24rpx;
	   font-weight: bold;
	   color: white;
	   text-align: center;
	   margin: -610rpx 0 0 0;
   }
   
   .scan{
	   font-size: 24rpx;
	   font-weight: bold;
	   color: white;
	   text-align: center;
	   margin: 10rpx 0 0 0;
   }
   
   .QRCode{
	   width: 250rpx;
	   height: 250rpx;
	   margin-left: 265rpx;
	   margin-top: 70rpx;
   }
	
	.btn {
	    width: 469rpx;
		height: 124rpx;
	    margin: 100rpx 40rpx 0 152rpx;
	}
</style>