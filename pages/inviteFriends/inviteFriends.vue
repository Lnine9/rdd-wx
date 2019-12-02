<template>
   <view>
	   <image src="/static/inviteFriends/background.png" class="imageBackground"></image>
	   <view class="invite"></view>
	   <view class="scan"></view>
	   <image class="QRCode" :src="QR"></image>
	   <button class="btnimage" open-type='share'>
		<image src="/static/inviteFriends/button.png" class="btn"></image>
	   </button>
	   <!-- <text class="save" @click="createCanvasImageEvn">保存图片到相册</text> -->
	   <!-- <uni-popup ref="popup" type="bottom" @change="change">
		   <view class="share">
			   <view class="text">分享到</viewl>
			   <button  open-type='share' class="wxshare">
				   <image src='/static/share/wx.png'></image>
			   </button>
			   <button  open-type='share' class="wxpyqshare">
				   <image src="/static/share/pyq.png"></image>
			   </button>
			   <button  open-type='share' class="qqshare">
				   <image src="/static/share/qq.png"></image>
			   </button>
			   <button  open-type='share' class="qqkjshare">
				   <image src="/static/share/qqkj.jpg"></image>
			   </button>
			   <text class="wxtext">微信</text>   
			   <text class="wxpyqtext">朋友圈</text>    
			   <text class="wxpyqtext">QQ</text> 
			   <text class="qqkjtext">QQ空间</text>
		   </view>
		   <view class="cancel" @tap="cancel()">取消分享</view>
	   </uni-popup> -->
	   <hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
	   <view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
	   	<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
	   </view>
   </view>
</template>

<script>
	import {api} from	'./api.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"
	import hchPoster from '../components/wxcomponents/hch-poster/hch-poster.vue'
    export default {
        data() {
            return {
               QR:"",
			   deliveryFlag: false,
			   canvasFlag: true,
			   posterData:{}
            };
        },
		components: {
			hchPoster,
			uniPopup
		},
		onShareAppMessage:function(res){
			if(res.from==='button'){
				console.log(res.target)
			}
			return{
				title:'快来跟我一起开宝盒哇',
				path: '/pages/index/index'
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
			},
			createCanvasImageEvn(){
				// 以下是根据后端接口动态生成小程序码
				let code="https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png";
				console.log(this.codeImg())
				this.codeImg().then((res)=>{
					code = res;
					console.log('aaa')
					Object.assign(this.posterData,
					{
						url:'./background.png',
						code:code,//小程序码
					})
					this.$forceUpdate();//强制渲染数据
					setTimeout(()=>{
						this.canvasFlag=false;//显示canvas海报
						this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
					},500)
				})
			},
			
			// 获取海报的小程序码
			codeImg(){
				return new Promise((resolve,reject)=>{
					api.getQR().then((res)=>{
						if (res.data.code==200) {
						const fsm = wx.getFileSystemManager();
							const FILE_BASE_NAME = 'tmp_img_src';
							let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;
							fsm.writeFile({
								filePath,
								data: "data:image/jpeg|png|gif;base64,"+res.data.data,
								encoding: 'binary',
								success() {
									resolve(filePath)
								},
								fail() {
									this.canvasFlag=true;
									uni.showToast({title:'图片生成失败',duration:2000,icon:'none'});
								},
							});
						} else {
							uni.showToast({title: res.data.message, icon: 'none',duration: 2000,icon:'none'})
						}
					}).catch(()=>{
						this.canvasFlag=true;
						uni.showToast({title:'图片生成失败',duration:2000,icon:'none'});
					})
				})
			},
			
			// 取消图片
			canvasCancel(val){
				this.canvasFlag=val;
			}
        }
    }
</script>

<style lang="scss">
	
	.canvas{
	    position: fixed !important;
	    top: 0 !important;
	    left: 0 !important;
	    display: block !important;
	    width: 100% !important;
	    height: 100% !important;
	    z-index: 10;
	}
	
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
	
	.btn{
	    width: 469rpx;
		height: 124rpx;
		margin: -5rpx 0 0 -15rpx;
	}
	
	.btnimage{
		width: 440rpx;
		height: 100rpx;
		padding: 0;
		background-color: #ffb600;
		border-radius: 62rpx;
		margin: 100rpx 40rpx 0 170rpx;
		color: #a1450c;
		font-size: 35rpx;
	}
	
	.save{
		font-size: 24rpx;
		color: #a1450c;
		margin-left: 300rpx;
	}
	
	.content-image {
		width: 60rpx;
		height: 60rpx;
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
		padding: 0;
	}
	
	.wxpyqshare{
		width: 110rpx;
		height: 110rpx;
		margin: -110rpx 0 0 240rpx;
		background-color: white;
		padding: 0;
	}
	
	.qqshare{
		width: 110rpx;
		height: 110rpx;
		margin: -110rpx 0 0 420rpx;
		background-color: white;
		padding: 0;
	}
	
	.qqkjshare{
		width: 110rpx;
		height: 110rpx;
		margin: -110rpx 0 0 600rpx;
		background-color: white;
		padding: 0;
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