<template>
   <view>
	   <image src="/static/inviteFriends/background.png" class="imageBackground"></image>
	   <view class="invite"></view>
	   <view class="scan"></view>
	   <image class="QRCode" :src="QR"></image>
	   <image src="/static/inviteFriends/button.png" class="btn" @click="open"></image>
	   <uni-popup ref="popup" type="bottom">
		   <view class="share">
			   <view class="text">分享到</view>
			   <button  open-type='share' class="wxshare">
				   <image src='/static/share/wx.png' class="wx"></image>
			   </button>
			   <button  open-type='share' class="wxpyqshare">
				   <image src="/static/share/pyq.png" class="wxpyq" @click="save()"></image>
			   </button>
			   <button  open-type='share' class="qqshare">
				   <image src="/static/share/qq.png" class="qq" @click="save()"></image>
			   </button>
			   <button  open-type='share' class="qqkjshare">
				   <image src="/static/share/qqkj.jpg" class="qqkj" @click="save()"></image>
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
               QR:"",
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
            open(){
				console.log(111)
				// 需要在 popup 组件，指定 ref 为 popup
				 this.$refs.popup.open();
				 console.log(222)
			
            },
			cancel(){
				this.$refs.popup.close();
			},
			//点击保存图片
			save () {
			  let that = this
			  //若二维码未加载完毕，加个动画提高用户体验
			  wx.showToast({
			   icon: 'loading',
			   title: '正在保存图片',
			   duration: 1000
			  })
			  //判断用户是否授权"保存到相册"
			  wx.getSetting({
			   success (res) {
			    //没有权限，发起授权
			    if (!res.authSetting['scope.writePhotosAlbum']) {
			     wx.authorize({
			      scope: 'scope.writePhotosAlbum',
			      success () {//用户允许授权，保存图片到相册
			       that.savePhoto();
			      },
			      fail () {//用户点击拒绝授权，跳转到设置页，引导用户授权
			       wx.openSetting({
			        success () {
			         wx.authorize({
			          scope: 'scope.writePhotosAlbum',
			          success() {
			           that.savePhoto();
			          }
			         })
			        }
			       })
			      }
			     })
			    } else {//用户已授权，保存到相册
			     that.savePhoto()
			    }
			   }
			  })
			 },
			//保存图片到相册，提示保存成功
			 savePhoto() {
			  let that = this
			  wx.getImageInfo({
			   url: that.$data.QR,
			   success: function (res) {
			    wx.saveImageToPhotosAlbum({
			     filePath: res.tempFilePath,
			     success(res) {
			      wx.showToast({
			       title: '保存成功',
			       icon: "success",
			       duration: 1000
			      })
			     }
			    })
			   }
			  })
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