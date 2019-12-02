<template>
   <view>
	   <image src="/static/inviteFriends/background.png" class="imageBackground"></image>
	   <image class="QRCode" :src="QR"></image>
	   <button class="btnimage" open-type='share'>
		<image src="/static/inviteFriends/button.png" class="btn"></image>
	   </button>
	   <!-- <text class="save" @click="createCanvasImageEvn">保存图片到相册</text> -->
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
			   posterData:{},
			   width:'',
			   height:''
            };
        },
		components: {
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
			
			uni.getSystemInfo({
				success(res) {
					// 获取手机屏幕宽，高
					var width=res.screenWidth;
					var height=res.screenHeight
					uni.setStorageSync('width',width)
					uni.setStorageSync('height',height)
				}
			});
		},
		onReady() {
			this.QR=uni.getStorageSync("QR");
			this.width=uni.getStorageSync("width");
			this.height=uni.getStorageSync("height");
		},
        methods: {
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
	page{
		width: 100%;
		height: 100%;
	}
	
   .imageBackground{
	   position: absolute;
	   width: 100%;
	   height: 100%;
   }
   
   .QRCode{
	   width: 250rpx;
	   height: 250rpx;
	   position: absolute;
	   bottom: 22%;
	   left: 35%;
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
		color: #a1450c;
		font-size: 35rpx;
		position: absolute;
		left: 20%;
		bottom: 2%;
	}
	
	.save{
		font-size: 24rpx;
		color: #a1450c;
		margin-left: 300rpx;
	}
</style>