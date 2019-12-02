<template>
	<view class="main">
		<view class="head">
			<view class="subHead">
				<image class="photo" :src="user.photo"></image>
				<text class="name">{{user.name}}</text>
				<text class="account">{{user.account}}</text>
				<image class="scan" src="../../static/code/scan.png" @click="scanCode()" :style="{display:isShop == 1 ? 'block' : 'none' }"></image>
			</view>
		</view>	
		<view class="vip">
			<image class="vipPhoto" src="../../static/vip/icVipPrice.png"></image>
			<text class="applyVip" @click="getVip()" :style="{display: isVip == 0 ? 'block' :'none' }">申请会员</text>
			<text class="applyVip"  :style="{display:isVip == 1 ? 'block' :'none' }">囧途宝盒会员</text>
			<text class="freeVip"  @click="getVip()" :style="{display: isVip == 0 ? 'block' :'none' }">囧途宝盒会员免费申请啦！</text>
			<image class="more" src="../../static/vip/icVipMore.png" @click="getVip()" :style="{display: isVip == 0 ? 'block' :'none' }"></image>
		</view>	
		<view class="service">
			<text class="myService">我的服务</text>
			<view style="width: 700rpx;margin-left: 50rpx;">
				<view class="serciceList" v-for="item in service" :key="item" >
					<image class="servicePicture"  :src="item.savePath" @click="getRouter(item.androidPath)"></image>
					<text class="serciceFont" @click="getRouter(item.androidPath)">{{item.menuName}}</text>
				</view>
			</view>	
		</view>
		<view :style="{display:code == null ? 'none' :'block' }">
			<text class="myElectronicCode">我的电子码</text>
			<text class="lookMore" @click="codeLook()">查看更多</text>
			<image class="moreCode" src="../../static/code/moreCode.png" @click="codeLook()"></image>
			<view class="electronicCode">
				<view class="subElectronicCode">
					<image class="codePhoto" :src="code.commodityImgList[0]"></image>
					<text class="codeName" :style="{display:code.commodityType == 2 ? 'block' : 'none' }">电子码：{{code.electronicCode}}</text>
					<text class="codeAccount" :style="{display:code.commodityType == 2 ? 'block' : 'none' }">订单号码：{{code.orderId}}</text>
					<text class="codeName" :style="{display:code.commodityType == 1 ? 'block' : 'none' }" >
						快递单号：<text selectable="true" @longtap="copy(code.deliveryNum)">{{code.deliveryNum}}</text>
						</text>
					<button class="copy" :style="{display:code.commodityType == 1 ? 'block' : 'none' }" @click="copyBtu(code.deliveryNum)">复制</button>
					<text class="codeAccount" :style="{display:code.commodityType == 1 ? 'block' : 'none' }">邮寄状态：{{this.getdeliveryState()}}</text>
				</view>
				<view class="introduction">
					<view class="dottedLineOne"></view>
					<text class="codeInfo">{{code.commodityInfo}}</text>
					<view class="dottedLineTwo"></view>
				</view>
				<view class="bottom">
					<text class="shopName">{{code.commodityTitle}}</text>
					<button class="QR-Code" :style="{display:code.commodityType == 2 ? 'block' : 'none'}" @click="lookQRCode()"><text class="fontTwo">查看二维码</text></button>
					<button class="lookDetails" :style="{marginRight:code.commodityType == 2 ? '25rpx' : '0rpx'}" @click="lookDetails()"><text class="fontOne">查看详情</text></button>
					<uni-popup ref='popup' type="center" maskClick="true">
						<view class="popUp">
							<text class="popupCodeName" >电子码：{{code.electronicCode}}</text>
							<text class="popupCodeAccount">订单号码：{{code.orderId}}</text>
							<view class="dottedLineThree"></view>
							<image class="qrCode" :src="qr"></image>
							<text class="codeShopName">{{code.commodityTitle}}</text>
						</view>
						<view class="circle" @click="close()">
							<image src="../../static/popup/closePopUp.png" class="close"></image>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>	
		<view class="noCode" :style="{display:code == null ? 'block' :'none' }">
			<image class="noCodePicture" src="../../static/code/noCode.png"></image>
			<text class="noCodeText">暂无电子码</text>
		</view>
		<uni-popup ref='order' type="center" maskClick="true">
			<view class="orderPopUp">
				<!-- <image class="orderPicture" :src="order.commodityImgList[1]"></image> -->
				<image class="orderPicture" :src="code.commodityImgList[0]"></image>
				<view class="dottedLineThree"></view>
				<view>
					<text class="orderInfo">商品：{{orderInfo.commodityTitle}}</text>
					<text class="orderInfo">商品信息：{{orderInfo.commodityInfo}}</text>
					<text class="orderInfo">地址：{{orderInfo.addressDetail}}</text>
					<text class="orderInfo">收货人：{{orderInfo.receiver}}</text>
					<text class="orderInfo">联系电话：{{orderInfo.contactNumber}}</text>
				</view>
				<button class="cancle" @click="closeOrder()">取消</button>
				<button class="update" @click="comfirmOrder(order)">确定</button>
			</view>
		</uni-popup>
	</view>
	
</template>

<script>
	import {api} from './api.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"
	import Qr from "../utils/wxqrcode.js"
	    export default {
	        data() {
	            return {
					user:{
						name:'',
						account:'153897433204',
						photo:'',
					},
					service:[
					],
					code:[],
					orderInfo:[],
					order:[],
					qr:'',
					isVip:0,
					isShop:1,
	            };
	        },
			onShow() {
				this.wxGetUserInfo();
				this.getData();
				this.getCode();
				this.judgeVip();
				this.judgeScan()
			},
			components:{
				uniPopup,
			},
	        methods: {
				// 获取登录信息
				wxGetUserInfo() {
					console.log('...授权...')
				    let _this = this;
				    uni.getUserInfo({
				        provider: 'weixin',
				        success: function(infoRes) {
							// console.log(infoRes);
				           _this.user.name = infoRes.userInfo.nickName; //昵称
				           _this.user.photo = infoRes.userInfo.avatarUrl; //头像
				        },
				        fail(res) {
							uni.showModal({
								content: '失败了',
								showCancel: true
							});
						}
				    });
				},
				//获取菜单信息
				getData(){
					let p = {
						userType: 0,
						menuIdentityCode: 'WCPPersonCenter',
					};
					api.getList(p).then(res =>{
						this.service = res.data.data,
						console.log(this.service)
					}).catch(err => {
						console.log(err)
					})
				},
				//判断是否为vip
				judgeVip(){
					// console.log(11);
					try {
						// console.log(12);
					    let value = uni.getStorageSync('isVip');
					    if (value) {
					        console.log(value);
					    }
					} catch (e) {
					    console.log(e);
					}
				},
				//判断是否为商家
				judgeScan(){
					// console.log(11);
					try {
						// console.log(12);
					    let value = uni.getStorageSync('roleName');
					    if (value) {
					        console.log(value);
					    }
					} catch (e) {
					    console.log(e);
					}
				},
				//跳转申请vip
				getVip(){
					uni.navigateTo({
						url: `/pages/vipApply/vipApply`
					})
				},
				//跳转菜单路由
				getRouter(path){
					console.log(path),
					uni.navigateTo({
						url: `${path}`
					})
				},
				//获取电子码信息
				getCode(){
					api.getCodeInfo().then(res=>{
						this.code = res.data.data,
						console.log(this.code)
					})
				},
				//电子码查看更多
				codeLook(){
					uni.navigateTo({
						url:`/pages/orderDetail/orderDetail`
					})
				},
				//扫码二维码
				scanCode(){
					let _this = this;
					uni.scanCode({
					    success: function (res) {
							//截取二维码信息
							let str = res.result.slice(3);
							let subStr  = str.split('&&')
							let shopId = subStr[0].slice(7);
							let orderId = subStr[1].slice(8);
							let date = _this.getDate();
							let p = {
								orderId:orderId
							}
							let param = {
								shopId:shopId,
								orderId:orderId,
								time:date,
							}
							api.getOrderByShop(p).then(res=>{
								if(res.data.data !=null){
									console.log(res.data.data);
									_this.orderInfo = res.data.data;
									_this.order = param;
									_this.comfirmOrderPopUp();
								}else {
									console.log(123);
									uni.showToast({
									    title: '无订单',
									    duration: 2000,
										icon:'none'
									});
								}
							}).catch(err => {
								console.log(err)
							})
					    }
					});
				},
				//确认订单弹窗
				comfirmOrderPopUp(){
					this.$refs.order.open();					
				},
				//确认订单
				comfirmOrder(data){
					console.log(data)
					api.comfirmOrder(data).then(res=>{
						console.log(res);
						this.$refs.order.close();
					})
				},
				//取消订单
				closeOrder(){
					this.$refs.order.close();
				},
				//获取当前时间
				getDate(){
					var date=new Date();
					var year=date.getFullYear();
					/* 在日期格式中，月份是从0开始的，因此要加0
					 * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
					 * */
					var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
					var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
					var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
					var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
					var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
					// 拼接
					return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
				},
				//获取邮寄状态
				getdeliveryState(){
					if(this.code != null){
						let index = this.code.deliveryState
						if(index == 0){
							return '未邮寄'
						}	
						else if(index == 1){
							return '邮寄中'
						}	
						else if(index == 2){
							return '已发送'
						}
						else
							return '未知'
					}	
				},
				//长按复制
				copy(data){
					// var that = this;
					uni.setClipboardData({
					  data: data,
					  success: function (res) {
						console.log('复制成功')
					  }
					});
				},
				//一键复制
				copyBtu(data){
					console.log(data);
					var that = this;
					uni.setClipboardData({
					  data: data,
					  success: function (res) {
						  console.log('复制成功')
					  }
					});
					
				},
				//查看二维码
				lookQRCode(){
					this.$refs.popup.open()
					this.qr = Qr.createQrCodeImg(this.code.qrcode)
				},
				//查看详情
				lookDetails(){
					uni.navigateTo({
						url: `/pages/product/product`
					})
				},
				//关闭弹窗
				close(){
					this.$refs.popup.close()
				},
				//下拉刷新
				onPullDownRefresh(){
					this.wxGetUserInfo();
					this.getData();
					this.getCode();
					this.judgeVip();
					this.judgeScan();
					setTimeout(function(){
						uni.stopPullDownRefresh();
					},2000);
				}
			}
	           
	    }
</script>

<style>
	.main{
		overflow-x: hidden;
		width: 750rpx;
		height: 1479rpx;
		background-color: #F8F9FB;
	}
	.head{
		width: 750rpx;
		height: 263rpx;
		background-color: #313134;
	}
	.subHead{
		position: relative;
		width: 640rpx;
		left: 45.4rpx;
		top: 59.4rpx;	
	}
	.photo{
		width: 112rpx;
		height: 112rpx;	
	}
	.name{
		display: inline-block;
		color: #FFFFFF;
		position: absolute;
		top:17.6rpx;
		left: 148.6rpx;
		font-size: 32rpx;
	}
	.account{
		display: inline-block;
		color: #FFFFFF;
		position: absolute;
		bottom:17.6rpx;
		left: 149.6rpx;
		font-size: 26rpx;
	}
	.scan{
		position: absolute;
		right: 0rpx;
		top: 17.6rpx;
		width: 40rpx;
		height: 40rpx;
	}
	.vip{
		width: 690rpx;
		height: 108rpx;
		margin: auto;
		background-color: #FFF2DA;
		border-radius: 10rpx;
		position:relative ;
		bottom: 65rpx;
	}
	.vipPhoto{
		position: absolute;
		left: 42rpx;
		top: 32rpx;
		width: 44rpx;
		height: 44rpx;
	}
	.applyVip{
		position: absolute;
		left: 113rpx;
		color: #7E5611;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 108rpx;
	}
	.freeVip{
		position: absolute;
		left:338rpx;
		color: #BE8E39;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 108rpx;
	}
	.more{
		position: absolute;
		left: 637rpx;
		top: 42rpx;
		width: 11rpx;
		height: 22rpx;
	}
	.service{
		width: 690rpx;
		margin: auto;
		position: relative;
		top: -29rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
	}
	.myService{
		display: inline-block;
		margin-left: 41rpx;
		margin-top: 40rpx;
		font-weight: bold;
		color: #333333;
		font-size: 28rpx;
	}
	.serciceList{
		display: inline-block;
		margin-right: 60rpx;
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		width: 100rpx;
		height: 100rpx;
	}
	.servicePicture{
		display: inline-block;
		width: 60rpx;
		height: 60rpx;
		padding: 0 19rpx;
	}
	.serciceFont{
		display: inline-block;
		width:100rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:#333333;
		text-align: center;
	}
	.myElectronicCode{
		position: relative;
		top: 20rpx;
		left: 35rpx;
		font-weight: bold;
		color: #333333;
		font-size: 28rpx;
		
	}
	.lookMore{
		position: relative;
		top: 20rpx;
		left: 445rpx;
		font-weight: normal;
		color: #999999;
		font-size: 24rpx;
	}
	.moreCode{
		position: relative;
		top: 20rpx;
		left: 460rpx;
		width: 11rpx;
		height: 22rpx;
	}
	.electronicCode{
		width: 683rpx;
		margin: auto;
		position: relative;
		top: 60rpx;
		background-color: #FFFFFF;
	}
	.subElectronicCode{
		position: relative;
		display: inline-block;
		margin-left: 40rpx;
		margin-top: 50rpx;
		width: 642rpx;
		height: 80rpx;
	}
	.codePhoto{
		width: 80rpx;
		height: 80rpx;	
	}
	.codeName{
		display: inline-block;
		position: absolute;
		top:6rpx;
		left: 114rpx;
		font-size: 30rpx;
	}
	.codeAccount{
		display: inline-block;
		position: absolute;
		font-weight: normal;
		top:56rpx;
		left: 114rpx;
		font-size: 24rpx;
	}
	.copy{
		display: inline-block;
		position: absolute;
		border:1rpx solid rgba(6,193,174,1);
		border-radius:10rpx;
		width: 70rpx;
		height: 50rpx;
		font-size: 20rpx;
		right: 40rpx;
		top: 0rpx;
		padding: 0;
	}
	.introduction{
		display: inline-block;
		position: relative;
		left: 41rpx;
		width:601rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(153,153,153,1);
	}
	.dottedLineOne{
		display: inline-block;
		position: relative;
		top: 0rpx;
		width:602rpx;
		height:1rpx;
		border:1rpx dotted rgba(227,227,227,1);
	}
	.codeInfo{
		display: inline-block;
		text-decoration:underline;
		margin: 30rpx 0;
	}
	.dottedLineTwo{
		display: inline-block;
		position: relative;
		bottom: 0rpx;
		width:602rpx;
		height:1rpx;
		border:1rpx dotted rgba(227,227,227,1);
	}
	.bottom{
		display: inline-block;
		position: relative;
		width: 600rpx;
		height: 60rpx;
		left: 43rpx;
		top:15rpx;
		margin-bottom: 50rpx;
		
	}
	.shopName{
		display: inline-block;
		margin-top: 15rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:#CCCCCC;
	}
	.lookDetails{
		display: inline-block;
		float: right;
		width:160rpx;
		height:60rpx;
		border:1rpx solid rgba(204,204,204,1);
		border-radius:30rpx;
	}
	.QR-Code{
		display: inline-block;
		float: right;
		width:160rpx;
		height:60rpx;
		border:1rpx solid rgba(6,193,174,1);
		border-radius:30rpx;
	}
	.fontOne{
		position: absolute;
		left: 30rpx;
		width:100rpx;
		height:23rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:#999999;
	}
	.fontTwo{
		position: absolute;
		left: 18rpx;
		width:130rpx;
		height:23rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:#06C1AE;
	}
	.popUp{
		position: relative;
		width: 580rpx;
		height: 629rpx;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		border-style: dashed;
		border-width: 1rpx;
	}
	.popupCodeName{
		display: inline-block;
		height:28rpx;
		font-size:30rpx;
		font-family:PingFang SC;
		font-weight:bold;
		color:#333333;
		margin-left: 53rpx;
		margin-top: 50rpx;
	}
	.popupCodeAccount{
		display: inline-block;
		height:23rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:#999999;
		line-height:38rpx;
		margin-left: 53rpx;
		margin-top: 30rpx;
	}
	/* .halfCircle{
		position: absolute;
		width: 15rpx;
		height: 15rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 6px 10px 0px rgba(153,153,153,0.05);
	} */
	.dottedLineThree{
		display: inline-block;
		margin: 41rpx 49rpx;
		width:482rpx;
		height:1rpx;
		border:1rpx dotted rgba(227,227,227,1);
	}
	.circle{
		position: relative;
		left: 255rpx;
		top: 30rpx;
		width: 80rpx;
		height: 80rpx;
		background-color: #FFFFFF;
		border-radius: 80rpx;
	}
	.qrCode{
		width: 270rpx;
		height: 276rpx;
		margin: 0 156rpx;
	}
	.codeShopName{
		display: inline-block;
		margin-top: 20rpx;
		text-align: center;
	    width:580rpx;
		font-size:28rpx;
		color:rgba(204,204,204,1);
	}
	.close{
		width: 60rpx;
		height: 60rpx;
		padding: 6rpx 10rpx;
	}
	.noCode{
		width: 750rpx;
		height: 400rpx;
		margin-top: 120rpx;
	}
	.noCodePicture{
		width: 300rpx;
		height: 300rpx;
		margin: 0  225rpx;
	}
	.noCodeText{
		display: inline-block;
		color: #999999;
		font-size: 26rpx;
		margin-top: 10rpx;
		width: 750rpx;
		text-align: center;
	}
	.orderPopUp{
		position: relative;
		width: 580rpx;
		height: 720rpx;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		border-width: 1rpx;
	}
	.orderPicture{
		display: inline-block;
		margin: 20rpx  190rpx;
		width: 200rpx;
		height: 200rpx;
	}
	.orderInfo{
		display: inline-block;
		width: 482rpx;
		text-align: left;
		font-size: 28rpx;
		margin: 10rpx 49rpx;
	}
	.cancle{
		position: absolute;
		display: inline-block;
		bottom: 0;
		width: 290rpx;
		border-radius: 0;
	}
	.update{
		position: absolute;
		display: inline-block;
		background-color: #06C1AE;
		bottom: 0;
		width: 290rpx;
		left: 290rpx;
		color: #FFFFFF;
		border-radius: 0;
	}
</style>



















































































































































