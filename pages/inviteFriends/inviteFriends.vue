<template>
   <view>
	   <image src="../../static/邀请好友/ic-背景.png" class="imageBackground"></image>
	   <view class="invite"></view>
	   <view class="scan"></view>
	   <image src="../../static/二维码.png" class="QRCode"></image>
	   <image src="../../static/邀请好友/按钮.png" class="btn" @click="open"></image>
	   <uni-popup ref="popup" type="bottom">
		   <view class="share">
			   <view class="text">分享到</view>
			   <image src="../../static/share/wx.png" class="wx"></image>
			   <image src="../../static/share/pyq.png" class="wxpyq"></image>
			   <image src="../../static/share/qq.png" class="qq"></image>
			   <image src="../../static/share/qqkj.jpg" class="qqkj"></image>
			   <br/>
			   <text class="wxtext">微信</text>   
			   <text class="wxtext">朋友圈</text>    
			   <text class="wxtext">QQ</text>  
			   <text class="qqkjtext">QQ空间</text>
		   </view>
		   <view class="cancel" @click="cancel()">取消分享</view>
	   </uni-popup>
   </view>
</template>

<script>
	import uniPopup from "../components/uni-popup/uni-popup.vue"
    export default {
        data() {
            return {
               
            };
        },
		components: {
			uniPopup
		},
        methods: {
            open(){
				// 需要在 popup 组件，指定 ref 为 popup
				 this.$refs.popup.open();
            },
			cancel(){
				this.$refs.popup.close();
			}
        },
    }
</script>

<style>
   .imageBackground{
	   width: 750rpx;
	   height: 1230rpx;
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
	.share{
		width: 100%;
		height: 350rpx;
		background: #FFFFFF;
		padding-top: 20rpx;
	}
	
	.share image{
		width: 110rpx;
		height: 110rpx;
	}
	
	.share .text{
		margin-left: 320rpx;
		font-size: 30rpx;
		font-weight: 550;
	}
	
	.wx{
		margin: 40rpx 0 0 80rpx;
	}
	
	.wxpyq{
		margin: 40rpx 0 0 60rpx;
	}
	
	.qq{
		margin: 40rpx 0 0 60rpx;
	}
	
	.qqkj{
		margin: 40rpx 0 0 50rpx;
	}
	
	.wxtext{
		margin-left: 100rpx;
		font-size: 30rpx;
	}
	
	.qqkjtext{
		margin-left: 80rpx;
		font-size: 30rpx;
	}
	
	.cancel{
		width: 100%;
		height: 80rpx;
		background: #FFFFFF;
		padding-top: 20rpx;
		border-top: #555555 1rpx solid;
		text-align: center;
	}
</style>