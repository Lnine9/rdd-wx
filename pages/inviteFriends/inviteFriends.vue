<template>
   <view>
	   <image src="../../static/邀请好友.png" class="imageBackground"></image>
	   <view class="invite">您的朋友{{account}} 邀请您加入人多多</view>
	   <view class="scan">扫描下方二维码，快来加入我们吧~ </view>
	   <image src="../../static/二维码.png" class="QRCode"></image>
	   <view class="million">您与百万车主之间只差一个人多多</view>
	   <button>分享给朋友</button>
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
            
        },
    }
</script>

<style>
   .imageBackground{
	   width: 750rpx;
	   height: 1200rpx;
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
	   width: 222rpx;
	   height: 220rpx;
	   margin-left: 264rpx;
   }
   
   .million{
	   font-size: 36rpx;
	   font-weight: bold;
	   color: #0086f1;
	   text-align: center;
	   /* margin-top: 238rpx */
	}
	
	button {
	    border-radius: 80rpx;
	    margin: 140rpx 40rpx 0 40rpx;
	    font-size: 35rpx;
		background-color: #0086f1;
		color: #FFFFFF;
	}
</style>