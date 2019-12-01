<template>
   <view>
	   <image src="/static/inviteFriends/background.png" class="imageBackground"></image>
	   <view class="invite"></view>
	   <view class="scan"></view>
	   <image class="QRCode" :src="QR"></image>
	   <image src="/static/inviteFriends/button.png" class="btn" @tap="togglePopup('bottom')"></image>
	   <uni-popup ref="popup" type="bottom" @change="change">
		   <view class="share">
			   <view class="text">分享到</view>
			   <button  open-type='share' class="wxshare">
				   <image src='/static/share/wx.png' class="wx"></image>
			   </button>
			   <button  open-type='share' class="wxpyqshare">
				   <image src="/static/share/pyq.png" class="wxpyq"></image>
			   </button>
			   <button  open-type='share' class="qqshare">
				   <image src="/static/share/qq.png" class="qq"></image>
			   </button>
			   <button  open-type='share' class="qqkjshare">
				   <image src="/static/share/qqkj.jpg" class="qqkj"></image>
			   </button>
			   <text class="wxtext">微信</text>   
			   <text class="wxpyqtext">朋友圈</text>    
			   <text class="wxpyqtext">QQ</text> 
			   <text class="qqkjtext">QQ空间</text>
		   </view>
		   <view class="cancel" @tap="cancel()">取消分享</view>
	   </uni-popup>
   </view>
</template>

<script>
	import {api} from	'./api.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"
    export default {
        data() {
            return {
               QR:""
            };
        },
		components: {
			uniPopup
		},
		onShareAppMessage:function(res){
			if(res.from==='menu'){
				console.log(res.target)
			}
			return{
				title:'快来跟我一起开宝盒哇',
			}
		},
		onLoad:function(){
			api.getQR().then(res=>{
				var QR="data:image/jpeg|png|gif;base64,"+res.data.data
				var QR1=res.data.data
				uni.setStorageSync('QR',QR)
			}).catch(err=>{
				console.log(err)
			})
		},
		onReady() {
			this.QR=uni.getStorageSync("QR");
		},
        methods: {
			togglePopup(type) {
				this.type = type
				this.$nextTick(() => {
					this.$refs["popup"].open();
				})
			},
			change(e) {
				console.log('是否打开:' + e.show)
			},
			cancel(){
				this.$refs["popup"].close();
			}
        }
    }
</script>

<style>
   .imageBackground{
	   width: 750rpx;
	   height: 1250rpx;
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
	
	.content-image {
		width: 60rpx;
		height: 60rpx;
	}
	
	.uni-share-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}
	
	.uni-share-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}
	
	.vh{
		width: 100%;
		height: 430rpx;
		padding-top: 20rpx;
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
	.wxshare{
		width: 110rpx;
		height: 110rpx;
		margin: 40rpx 0 0 60rpx;
		background-color: white;
	}
	
	.wxpyqshare{
		width: 110rpx;
		height: 110rpx;
		margin: -110rpx 0 0 240rpx;
		background-color: white;
	}
	
	.qqshare{
		width: 110rpx;
		height: 110rpx;
		margin: -110rpx 0 0 420rpx;
		background-color: white;
	}
	
	.qqkjshare{
		width: 110rpx;
		height: 110rpx;
		margin: -110rpx 0 0 600rpx;
		background-color: white;
	}
	
	.wx{
		margin: 0 0 0 -30rpx;
	}
	
	.wxpyq{
		margin: 0 0 0 -30rpx;
	}
	
	.qq{
		margin: 0 0 0 -30rpx;
	}
	
	.qqkj{
		margin: 0 0 0 -30rpx;
	}
	
	.wxtext{
		margin: 50rpx 0 0 80rpx;
		font-size: 30rpx;
	}
	
	.wxpyqtext{
		margin: 50rpx 0 0 110rpx;
		font-size: 30rpx;
	}
	
	.qqkjtext{
		margin: 50rpx 0 0 105rpx;
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