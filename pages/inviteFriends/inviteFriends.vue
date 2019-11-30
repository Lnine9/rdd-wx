<template>
   <view>
	   <image src="../../static/邀请好友/ic-背景.png" class="imageBackground"></image>
	   <view class="invite"></view>
	   <view class="scan"></view>
	   <image class="QRCode" :src="QR"></image>
	   <image src="../../static/邀请好友/按钮.png" class="btn" @click="open"></image>
	   <uni-popup ref="popup" type="bottom">
		   <view class="share">
			   <view class="text">分享到</view>
			   <button  open-type='share' class="wxshare">
				   <image src="../../static/share/wx.png" class="wx"></image>
			   </button>
			   <button  open-type='share' class="wxpyqshare">
				   <image src="../../static/share/pyq.png" class="wxpyq" @click="save()"></image>
			   </button>
			   <button  open-type='share' class="qqshare">
				   <image src="../../static/share/qq.png" class="qq" @click="save()"></image>
			   </button>
			   <button  open-type='share' class="qqkjshare">
				   <image src="../../static/share/qqkj.jpg" class="qqkj" @click="save()"></image>
			   </button>
			   <text class="wxtext">微信</text>   
			   <text class="wxpyqtext">朋友圈</text>    
			   <text class="wxpyqtext">QQ</text> 
			   <text class="qqkjtext">QQ空间</text>
		   </view>
		   <view class="cancel" @click="cancel()">取消分享</view>
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
		onLoad:function(){
			api.getQR().then(res=>{
				var QR="data:image/jpeg|png|gif;base64,"+res.data.data
				uni.setStorageSync('QR',QR)
			}).catch(err=>{
				console.log(err)
			})
		},
		onReady() {
			this.QR=uni.getStorageSync("QR");
		},
        methods: {
            open(){
				// 需要在 popup 组件，指定 ref 为 popup
				 this.$refs.popup.open();
            },
			cancel(){
				this.$refs.popup.close();
			},
			save(){
				console.log(111);
				//保存图片到相册
				uni.showActionSheet({
					itemList:['保存图片到相册'],
					success: () => {
						plus.gallery.save('D:\Backup\桌面\软件工程', function() {
							uni.showToast({
								title:'保存成功',
								icon:'none'
							})
						}, function() {
							uni.showToast({
								title:'保存失败，请重试！',
								icon:'none'
							})
						});
					}
				})
				console.log(222);
			}
        }
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