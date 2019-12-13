<template>
		<view v-show="flag" class="main">
			<view class="head">
				<view class="subHead">
					<image :style="{display:loginState == true ? 'block' :'none' }" class="photo" :src="user.photo"></image>
					<text :style="{display:loginState == true ? 'block' :'none',top:bindingIdState == true ? '10rpx' :'30rpx' }" class="name">{{user.name}}</text>
					<text :style="{display:bindingIdState == true ? 'block' :'none' }" class="bindAccount">{{user.account}}</text>
					<image :style="{display:loginState == true ? 'none' :'block' }" class="photo" :src="logn.photo" @click="getLogin()"></image>
					<text :style="{display:loginState == true ? 'none' :'block' }" class="loginName" @click="getLogin()">{{logn.name}}</text>
					<view class="scan" :style="{display:isShop == 1 ? 'block' : 'none' }">
						<image class="scanBut" src="../../static/code/scanBut.png" @click="scanCode()" ></image>
						<text class="scanOrder">扫一扫</text>
					</view>
				</view>
			</view>
			<view class="vip">
				<image class="vipPhoto" src="../../static/vip/icVipPrice.png"></image>
				<text class="applyVip" @click="getVip()" :style="{display: isVip == false ? 'block' :'none' }">申请会员</text>
				<text class="applyVip"  :style="{display:isVip == true ? 'block' :'none' }">囧途宝盒会员</text>
				<text class="freeVip"  @click="getVip()" :style="{display: isVip == false ? 'block' :'none' }">囧途宝盒会员免费申请啦！</text>
				<image class="more" src="../../static/vip/icVipMore.png" @click="getVip()" :style="{display: isVip == false ? 'block' :'none' }"></image>
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
			<view :style="{display:codeState == true ? 'block' :'none' }" style="margin-bottom: 250rpx;">
				<view class="codeTitle">
					<text class="myElectronicCode">我的电子码</text>
					<view>
					<text class="lookMore" @click="codeLook()">查看更多</text>
					<image class="moreCode" src="../../static/code/moreCode.png" @click="codeLook()"></image>
					</view>
				</view>
				<view class="electronicCode">
					<view class="subElectronicCode">
						<image class="codePhoto" src="../../static/code/scan.png"></image>
						<text class="codeName" :style="{display:code.commodityType == 2 ? 'block' : 'none' }">电子码：{{code.electronicCode}}</text>
						<text class="codeAccount" :style="{display:code.commodityType == 2 ? 'block' : 'none' }">订单状态：{{this.getorderState()}}</text>
						<text class="codeName" :style="{display:code.commodityType == 1 ? 'block' : 'none' }" >
							快递单号：<text selectable="true" >{{code.deliveryNum}}</text>
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
						<text class="shopName" :style="{width:code.commodityType == 2 ? '250rpx' : '400rpx'}">{{code.commodityTitle}}</text>
						<button class="QR-Code" :style="{display:code.commodityType == 2 ? 'block' : 'none'}" @click="lookQRCode()"><text class="fontTwo">查看二维码</text></button>
						<button class="lookDetails" :style="{marginRight:code.commodityType == 2 ? '25rpx' : '0rpx'}" @click="lookDetails()"><text class="fontOne">查看详情</text></button>
					</view>
				</view>
			</view>
			<uni-popup ref="popup"  type="center" maskClick="true">
				<view class="popUp">
					<text class="popupCodeName" >电子码：{{code.electronicCode}}</text>
						<view class="dottedLineThree"></view>
						<image class="qrCode" :src="qr"></image>
						<text class="codeShopName">{{code.commodityTitle}}</text>
					</view>
					<view class="circle" @click="close()">
						<image src="../../static/popup/closePopUp.png" class="close"></image>
					</view>
			</uni-popup>
			<view class="noCode" :style="{display:code == null ? 'block' :'none' }">
				<image class="noCodePicture" src="../../static/code/noCode.png"></image>
				<text class="noCodeText">暂无电子码</text>
			</view>
			<uni-popup ref="scanPopup"  type="center" maskClick="true">
				<view class="orderPopUp">
					<view class="orderTitle">
						<image class="orderPicture" :src="orderInfo.commodityImgList[0]"></image>
						<text class="orderName">{{orderInfo.commodityTitle}}</text>
						<text class="orderPrice">￥{{orderInfo.actualPrice}}</text>
					</view>
					<view class="dottedLineFour"></view>
					<view class="orderMenu">
						<text class="orderInfo">电子码：<text style="font-size: 28rpx; color: #666666;">{{orderInfo.qrcode}}</text></text>
						<text class="orderInfo">联系电话：<text style="font-size: 28rpx; color: #666666;">{{orderInfo.phone}}</text></text>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button-cancle" @click="closeOrder()">取消</text>
						<text class="uni-tip-button-update" @click="comfirmOrder(order)">确定提交</text>
					</view>
				</view>	
			</uni-popup>
			<uni-loginPopup ref="loginPopUp"></uni-loginPopUp>
			<tabBar :currentPage="currentPage"></tabBar>
		</view>
</template>

<script>
	import {api} from './api.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"
	import loginPopup from "../components/uni-loginPopUp/uni-loginPopUp.vue"
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	import Qr from "../utils/wxqrcode.js"
	    export default {
	        data() {
	            return {
					logn:{
						name:'点击登录',
						photo:'../../static/user/logo.png'
					},
					user:{
						name:'',
						photo:'',
						account:'',
					},
					service:[
					],
					code:[],
					codeState:false,
					orderInfo:[],
					order:[],
					qr:'',
					isVip:false,
					isShop:0,
					currentPage:'mine',
					screenHeight: 951,
					subScreenHeight: 1200,
					loginState:false,
					bindingIdState:false,
					flag: true, // 标识当前页面是否显示
	            };
	        },
			onShow() {
				let payOrder = getApp().globalData.payOrder;
				let bindingId = uni.getStorageSync('bindingId');
				console.log(bindingId)
				if (payOrder) {
					this.flag = false;
					getApp().globalData.payOrder = false;
					uni.navigateTo({
						url: '/pages/myOrder/myOrder'
					});
				} else {
					this.flag = true;
					this.wxGetLogin();
					this.getCode();
					this.judgeVip();
					this.judgeScan();
					if(bindingId!=null && bindingId!=''){
						this.getMenu();
					}else{
						this.getSubMenu();
					}
				}
			},
			//下拉刷新
			onPullDownRefresh(){
				this.wxGetLogin();
				this.getCode();
				this.judgeVip();
				this.judgeScan();
				if(bindingId!=null && bindingId!=''){
					this.getMenu();
				}else{
					this.getSubMenu();
				}
				setTimeout(function(){
					uni.stopPullDownRefresh();
				},2000);
			},
			components:{
				'uni-popup':uniPopup,
				'tabBar':tabBar,
				'uni-loginPopup':loginPopup
			},
	        methods: {
				//判断是否登录
				wxGetLogin(){
					this.loginState = uni.getStorageSync('loginState');
					let _this = this
					if(this.loginState == true){
						_this.wxGetUserInfo();
					}
				},
				//跳转登录
				getLogin(){
					uni.navigateTo({
						url: `/pages/index/index`
					})
				},
				// 获取登录信息
				wxGetUserInfo() {
					console.log('...授权...')
				    let _this = this;
					let bindingId = uni.getStorageSync('bindingId');
					if(bindingId!=null && bindingId!=''){
					   this.bindingIdState = true;
					}else{
					   this.bindingIdState = false;
					}
					console.log(this.bindingIdState)
				    uni.getUserInfo({
				        provider: 'weixin',
				        success: function(infoRes) {
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
				//获取已绑定菜单信息
				getMenu(){
					let p = {
						userType: 2,
						menuIdentityCode: 'WCPPersonCenter',
						bindingType:0,
					};
					api.getList(p).then(res =>{
						this.service = res.data.data,
						console.log(this.service)
					}).catch(err => {
						console.log(err)
					})
				},
				//获取未菜单信息
				getSubMenu(){
					let p = {
						userType: 2,
						menuIdentityCode: 'WCPPersonCenter',
						bindingType:1,
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
					if(this.loginState == true){
						let value = uni.getStorageSync('isVip');
						this.isVip = value;
					}else{
						this.isVip = 0;
					}
					
				},
				//判断是否为商家
				judgeScan(){
					if(this.loginState == true){
						let value = uni.getStorageSync('roleNameList');
						if(value != null ){
							for (var i = 0; i < value.length; i++) {
								if(value[i].roleName === "微信商家"){
									this.isShop = 1;
									this.user.account = '微信商家';
								}else{
									this.isShop = 0;
									this.user.account = uni.getStorageSync('bindingAccount');
								}
							}
						}else{
							this.isShop = 0
						}
					}else{
						this.isShop = 0
					}
				},
				//跳转申请vip
				getVip(){
					if(this.loginState == false){
						this.$refs.loginPopUp.open();
					}else{
						uni.navigateTo({
							url: `/pages/vipApply/vipApply`
						})
					}
				},
				//跳转菜单路由
				getRouter(path){
					if(this.loginState == false){
						console.log(path)
						this.$refs.loginPopUp.open();
					}else{
						uni.navigateTo({
							url: `${path}`
						})
					}
				},
				//获取电子码信息
				getCode(){
					if(this.loginState == true){
						api.getCodeInfo().then(res=>{
							this.code = res.data.data
							console.log(res.data.data)
							if(res.data.data != null){
								this.codeState = true
								console.log(this.codeState)
								if(res.data.data.electronicCode == null || res.data.data.electronicCode == ''){
									this.code.electronicCode = '暂无'
								}
								if(res.data.data.deliveryNum == null || res.data.data.deliveryNum == ''){
									this.code.deliveryNum = '暂无'
								}
							}else{
								this.codeState = false	
								console.log(this.codeState)
							}
						})
					}else{
						this.codeState = false
					}
				},
				//电子码查看更多
				codeLook(){
					uni.navigateTo({
						url:`/pages/myOrder/myOrder`
					})
				},
				//扫码二维码
				scanCode(){
					let _this = this;
					uni.scanCode({
					    success: function (res) {
							//截取二维码信息
							console.log(res.result.slice(0,10))
							if(res.result != null && res.result.slice(0,10) === 'wx:shopId='){
								let str = res.result.slice(3);
								let subStr  = str.split('&')
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
										_this.judgeOrderInfo(_this.orderInfo)
										_this.order = param;
										_this.comfirmOrderPopUp();
									}else {
										uni.showToast({
											title: '无订单',
											duration: 2000,
											icon:'none'
										});
									}
								}).catch(err => {
									console.log(err)
								})
							}else{
								console.log(res.result)
								uni.showToast({
									title: '二维码错误',
									duration: 2000,
									icon:'none'
								});
							}	
						},
						fail: function (res) {
							console.log(res.result)
							uni.showToast({
								title: '二维码错误',
								duration: 2000,
								icon:'none'
							});
						}
					});
				},
				//判断信息是否为空
				judgeOrderInfo(data){
					if(data.commodityTitle == null || data.commodityTitle == ""){
						this.orderInfo.commodityTitle = '无'
					}
					if(data.commodityInfo == null || data.commodityInfo == ""){
						this.orderInfo.commodityInfo = '无'
					}
					if(data.addressDetail == null || data.addressDetail == ""){
						this.orderInfo.addressDetail = '无'
					}
					if(data.receiver == null || data.receiver == ""){
						this.orderInfo.receiver = '无'
					}
					if(data.contactNumber == null || data.contactNumber == ""){
						this.orderInfo.contactNumber = '无'
					}
				},
				//确认订单弹窗
				comfirmOrderPopUp(){
					this.$refs.scanPopup.open();
				},
				//确认订单
				comfirmOrder(data){
					console.log(data)
					api.comfirmOrder(data).then(res=>{
						console.log(res);
						this.$refs.scanPopup.close();
						if(res.data.data == true){
							uni.showToast({
							    title: '提交成功',
							    duration: 2000,
								icon:'success'
							});
							setTimeout(() => {
								// 设置全局变量标识支付成功
								// getApp().globalData.payOrder = true;
								// 购买成功去往个人中心
								uni.switchTab({
									url: '/pages/shopOrder/shopOrder'
								});
							
								// uni.showToast({
								// 	title: '请稍后',
									// 	icon: 'loading'
								// });
							}, 2000);
						}else{
							uni.showToast({
							    title: '提交失败',
							    duration: 2000,
								icon:'none'
							});
						}
					})
				},
				//取消订单
				closeOrder(){
					this.$refs.scanPopup.close();
				},
				//取消登录
				loginCancle(){
					this.$refs.loginPopup.close();
				},
				//确认登录
				loginUpdate(){
					this.$refs.loginPopup.open();
					this.getLogin();
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
				//获取订单状态
				getorderState(){
					if(this.code != null){
						let index = this.code.orderState
						if(index == 1){
							return '未完成'
						}
						else
							return '未知'
					}else{
							return '未知'
					}
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
					}else{
							return '未知'
					}
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
					this.$refs.popup.open();
					this.qr = Qr.createQrCodeImg(this.code.qrcode)
				},
				//查看详情
				lookDetails(){
					let _this = this
					uni.navigateTo({
						url: `/pages/orderDetail/orderDetail?orderid=`+ _this.code.orderId
					})
				},
				//关闭弹窗
				close(){
					this.$refs.popup.close();
				},
			}
	           
	    }
</script>

<style>
	.main{
		overflow-x: hidden;
		width: 750rpx;
		padding-bottom: 200upx;
		/* height: 1600rpx; */
		background-color: #F8F9FB;
	}
	.head{
		width: 750rpx;
		height: 263rpx;
		background-image: url('../../static/user/userBackground.png');
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
		border-radius: 100rpx;
	}
	.name{
		display: inline-block;
		color: #FFFFFF;
		position: absolute;
		/* top:30rpx; */
		left: 148.6rpx;
		font-size: 32rpx;
	}
	.loginName{
		display: inline-block;
		color: #FFFFFF;
		position: absolute;
		top:30rpx; 
		left: 148.6rpx;
		font-size: 32rpx;
	}
	.bindAccount{
		display: inline-block;
		color: #FFFFFF;
		position: absolute;
		top:60rpx;
		left: 148.6rpx;
		font-size: 28rpx;
	}
	.scan{
		position: absolute;
		font-size: 0;
		width: 120rpx;
		height: 80rpx;
		right: 0rpx;
		top: 0rpx;
	}
	.scanBut{
		display: inline-block;
		float: right;
		width: 60rpx;
		height: 60rpx;
	}
	.scanOrder{
		display: inline-block;
		position: absolute;
		top: 80rpx;
		left: 30rpx;
		font-size: 26rpx;
		width: 120rpx;
		text-align: center;
		color: #FFFFFF;
	
	}
	.vip{
		width: 690rpx;
		height: 108rpx;
		margin: auto;
		background-image: url('../../static/vip/vipBackground.png');
		background-position: 50%  0;
		border-radius: 10rpx;
		position:relative ;
		bottom: 65rpx;
	}
	.vipPhoto{
		position: absolute;
		left: 42rpx;
		top: 32rpx;
		width: 48rpx;
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
		margin-bottom: 40rpx;
		width: 100rpx;
		height: 100rpx;
	}
	.servicePicture{
		display: inline-block;
		width: 60rpx;
		height: 60rpx;
		padding: 0 30rpx;
	}
	.serciceFont{
		display: inline-block;
		width:120rpx;
		font-size:26rpx;
		font-weight:500;
		color:#333333;
		text-align: center;
	}
	.codeTitle{
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		top: 15rpx;
		width: 683rpx;
		margin: auto;
	}
	.myElectronicCode{
		font-weight: bold;
		color: #333333;
		font-size: 28rpx;
	}
	.lookMore{
		margin-right: 20rpx;
		font-weight: normal;

		color: #999999;
		font-size: 28rpx;
	}
	.moreCode{

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
		font-size: 28rpx;
	}
	.codeAccount{
		display: inline-block;
		position: absolute;
		font-weight: normal;
		top:56rpx;
		left: 114rpx;
		font-size: 28rpx;
	}
	.copy{
		display: inline-block;
		position: absolute;
		border:1rpx solid #06C1AE;
		color: #06C1AE;
		width: 60rpx;
		height: 40rpx;
		font-size: 20rpx;
		right: 30rpx;
		top: 6rpx;
		line-height: 40rpx;
		padding: 0;
	}
	.introduction{
		display: inline-block;
		position: relative;
		left: 41rpx;
		width:601rpx;
		font-size:24rpx;
		font-weight:500;
		color:rgba(153,153,153,1);
	}
	.dottedLineOne{
		display: inline-block;
		position: relative;
		top: 0rpx;
		width:602rpx;
		/* height:1rpx; */
		border:1rpx dotted rgba(227,227,227,1);
	}
	.codeInfo{
		display: inline-block;
		text-decoration:underline;
		font-weight: 400;
		margin: 30rpx 0;
		font-size: 24rpx;
	}
	.dottedLineTwo{
		display: inline-block;
		position: relative;
		bottom: 0rpx;
		width:602rpx;
		/* height:1rpx; */
		border:1rpx dotted rgba(227,227,227,1);
	}
	.maxWidth{
		max-height: 30%;
	}
	.bottom{
		display: inline-block;
		position: relative;
		width: 600rpx;
		height: 66rpx;
		left: 43rpx;
		top:15rpx;
		margin-bottom: 50rpx;

	}
	.shopName{
		display: inline-block;
		position: absolute;
		line-height: 66rpx;
		font-size: 28rpx;
		font-weight:545;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
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
		font-weight:500;
		color:#999999;
	}
	.fontTwo{
		position: absolute;
		left: 18rpx;
		width:130rpx;
		height:23rpx;
		font-size:24rpx;
		font-weight:500;
		color:#06C1AE;
	}
	.popUpShow{
		position: absolute;
		background-color: rgba(0, 0, 0, 0.4);
		top: 0;
		width: 750rpx;
		padding-bottom: 100rpx;
	}
	.popUp{
		display: fixed;
		margin: auto;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
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
		font-weight:bold;
		color:#333333;
		margin-left: 53rpx;
		margin-top: 50rpx;
	}
	.popupCodeAccount{
		display: inline-block;
		height:23rpx;
		font-size:24rpx;
		font-weight:500;
		color:#999999;
		line-height:38rpx;
		margin-left: 53rpx;
		margin-top: 30rpx;
	}
	.dottedLineThree{
		display: inline-block;
		margin: 41rpx 49rpx;
		width:482rpx;
		border:1rpx dotted rgba(227,227,227,1);
	}
	.dottedLineFour{
		display: inline-block;
		position: relative;
		bottom: 50rpx;
		left: 50rpx;
		width:482rpx;
		border:1rpx dotted rgba(227,227,227,1);
	}
	.circle{
		display: fixed;
		margin: auto;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: -720rpx;
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
		margin: 20rpx  50rpx;
		text-align: center;
	    width:480rpx;
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
		height: 600rpx;
		margin-top: 120rpx;
	}
	.noCodePicture{
		width: 200rpx;
		height: 200rpx;
		margin: 0  275rpx;
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
		width: 580rpx;
		/* height: 720rpx; */
		position: relative;
		background-image: url('../../static/code/popup.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border-radius: 15rpx;
		border-width: 1rpx;
	}
	.orderTitle{
		position: relative;
		width: 580rpx;
		height: 250rpx;
	}
	.orderPicture{
		display: inline-block;
		margin: 40rpx 40rpx;
		width: 150rpx;
		height: 150rpx;
	}
	.orderName{
		position: absolute;
		top: 70rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	.orderPrice{
		position: absolute;
		top: 140rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #FF7E30;
	}
	.orderMenu{
		display: inline-block;
		width: 580rpx;
	}
	.orderInfo{
		display: inline-block;
		width: 482rpx;
		white-space: normal;
		word-break: break-all;
		text-align: left;
		font-size: 32rpx;
		margin: 10rpx 49rpx;
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



















































































































































