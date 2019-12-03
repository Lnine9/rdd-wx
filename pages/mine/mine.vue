<template>
	<view class="main">
		<view class="head">
			<view class="subHead">
				<image class="photo" :src="user.photo"></image>
				<text class="name">{{user.name}}</text>
				<image class="scan" src="../../static/code/scanBut.png" @click="scanCode()" :style="{display:isShop == 1 ? 'block' : 'none' }"></image>
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
		<view :style="{display:code == null ? 'none' :'block' }">
			<view class="codeTitle">
				<text class="myElectronicCode">我的电子码</text>
				<text class="lookMore" @click="codeLook()">查看更多</text>
				<image class="moreCode" src="../../static/code/moreCode.png" @click="codeLook()"></image>
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
					<!-- <uni-popup ref="popup" type="center" maskClick="true">
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
					</uni-popup> -->

				</view>
			</view>
		</view>
		<view class="popUpShow" :style="{display:popShow == true ? 'block' :'none'}">
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
		</view>
		<view class="noCode" :style="{display:code == null ? 'block' :'none' }">
			<image class="noCodePicture" src="../../static/code/noCode.png"></image>
			<text class="noCodeText">暂无电子码</text>
		</view>
		<!-- <uni-popup ref='order' type="center" maskClick="true">
			<view class="orderPopUp">
				<image class="orderPicture" :src="order.commodityImgList[1]"></image>
				<view class="dottedLineThree"></view>
				<view>
					<text class="orderInfo">商品：{{orderInfo.commodityTitle}}</text>
					<text class="orderInfo">商品信息：{{orderInfo.commodityInfo}}</text>
					<text class="orderInfo">地址：{{orderInfo.addressDetail}}</text>
					<text class="orderInfo">收货人：{{orderInfo.receiver}}</text>
					<text class="orderInfo">联系电话：{{orderInfo.contactNumber}}</text>
				</view>
				<button class="cancle" @click="closeOrder()">取消</button>
				<button class="update" @click="comfirmOrder(order)">确认提交</button>
			</view>
		</uni-popup> -->
		<view class="popUpShow" :style="{display:scanPopShow == true ? 'block' :'none'}">
			<view class="orderPopUp">
				<image class="orderPicture" :src="order.commodityImgList[1]"></image>
				<view class="dottedLineThree"></view>
				<view class="orderMenu">
					<text class="orderInfo">商品：{{orderInfo.commodityTitle}}</text>
					<text class="orderInfo">商品信息：{{orderInfo.commodityInfo}}</text>
					<text class="orderInfo">地址：{{orderInfo.addressDetail}}</text>
					<text class="orderInfo">收货人：{{orderInfo.receiver}}</text>
					<text class="orderInfo">联系电话：{{orderInfo.contactNumber}}</text>
				</view>
				<view class="orderBut">
					<button class="cancle" @click="closeOrder()">取消</button>
					<button class="update" @click="comfirmOrder(order)">确认提交</button>
				</view>
			</view>
		</view>
		<tabBar :currentPage="currentPage"></tabBar>
	</view>
</template>

<script>
	import {api} from './api.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	import Qr from "../utils/wxqrcode.js"
	    export default {
	        data() {
	            return {
					user:{
						name:'',
						photo:'',
					},
					service:[
					],
					code:[],
					orderInfo:[],
					order:[],
					qr:'',
					isVip:false,
					isShop:0,
					popShow:false,
					scanPopShow:false,
					currentPage:'main'
	            };
	        },
			onShow() {
				this.wxGetUserInfo();
				this.getData();
				this.getCode();
				this.judgeVip();
				this.judgeScan()
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
			},
			components:{
				uniPopup,
				tabBar
			},
	        methods: {
				// 获取登录信息
				wxGetUserInfo() {
					console.log('...授权...')
				    let _this = this;
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
					let value = uni.getStorageSync('isVip');
					this.isVip = value;
				},
				//判断是否为商家
				judgeScan(){
					let value = uni.getStorageSync('roleNameList');
					console.log(value)
					if(value != null){
						for (var i = 0; i < value.length; i++) {
							if(value[i].roleName === "微信商家"){
								this.isShop = 1;
							}else{
								this.isShop = 0
							}
						}
					}else{
						this.isShop = 0
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
					console.log(path)
					// if(this.isVip == false && path === '/pages/inviteFriends/inviteFriends'){
					// 	uni.navigateTo({
					// 		url:`/pages/vipApply/vipApply`
					// 	})
					// }else{
						uni.navigateTo({
						url: `${path}`
						})
					// }

				},
				//获取电子码信息
				getCode(){
					api.getCodeInfo().then(res=>{
						this.code = res.data.data
						if(res.data.data != null){
							if(res.data.data.electronicCode == null || res.data.data.electronicCode == ''){
								this.code.electronicCode = '暂无'
							}
							if(res.data.data.deliveryNum == null || res.data.data.deliveryNum == ''){
								this.code.deliveryNum = '暂无'
							}
						}
						console.log(this.code)
					})
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
				//确认订单弹窗
				comfirmOrderPopUp(){
					this.scanPopShow = true
				},
				//确认订单
				comfirmOrder(data){
					console.log(data)
					api.comfirmOrder(data).then(res=>{
						console.log(res);
						this.scanPopShow = false;
						if(res.data.data == true){
							uni.showToast({
							    title: '提交成功',
							    duration: 2000,
								icon:'success'
							});
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
					this.scanPopShow = false
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
					this.popShow = true
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
					this.popShow = false
				},
			}
	           
	    }
</script>

<style>
	.main{
		overflow-x: hidden;
		width: 750rpx;
		height: 1600rpx;
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
		top:30rpx;
		left: 148.6rpx;
		font-size: 32rpx;
	}
	.scan{
		position: absolute;
		right: 0rpx;
		top: 30rpx;
		width: 40rpx;
		height: 40rpx;
	}
	.vip{
		width: 690rpx;
		height: 108rpx;
		margin: auto;
		background-image: url('../../static/vip/vipBackground.png');
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
		font-size: 32rpx;
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
		font-size: 32rpx;
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
		position: relative;
		top: 15rpx;
		width: 683rpx;
		margin: auto;
	}
	.myElectronicCode{
		position: relative;
		font-weight: bold;
		color: #333333;
		font-size: 32rpx;

	}
	.lookMore{
		position: absolute;
		font-weight: normal;
		right: 30rpx;
		color: #999999;
		font-size: 28rpx;
	}
	.moreCode{
		position: absolute;
		top: 8rpx;
		right: 0;
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
		margin: 30rpx 0;
		font-size: 28rpx;
	}
	.dottedLineTwo{
		display: inline-block;
		position: relative;
		bottom: 0rpx;
		width:602rpx;
		/* height:1rpx; */
		border:1rpx dotted rgba(227,227,227,1);
	}
	.bottom{
		display: inline-block;
		position: relative;
		width: 600rpx;
		/* height: 60rpx; */
		left: 43rpx;
		top:15rpx;
		margin-bottom: 50rpx;

	}
	.shopName{
		display: inline-block;
		position: absolute;
		margin-top: 15rpx;
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
		height: 1600rpx;
	}
	.popUp{
		position: relative;
		width: 580rpx;
		height: 629rpx;
		background-color: #FFFFFF;
		left: 85rpx;
		top: 300rpx;
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
		/* height:1rpx; */
		border:1rpx dotted rgba(227,227,227,1);
	}
	.circle{
		position: relative;
		left: 340rpx;
		top: 330rpx;
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
		left: 85rpx;
		top: 150rpx;
		/* height: 720rpx; */
		background-color: #FFFFFF;
		border-radius: 15rpx;
		border-width: 1rpx;
	}
	.orderMenu{
		display: inline-block;
		width: 580rpx;

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
		font-size: 32rpx;
		margin: 10rpx 49rpx;
	}
	.orderBut{
		position: flex;
		display: inline-block;
		left: 0;
		bottom: 0;
		width: 580rpx;
		height: 100rpx;
	}
	.cancle{
		position: absolute;
		display: inline-block;
		bottom: 0;
		width: 290rpx;
		/* border-radius: 0; */
	}
	.update{
		position: absolute;
		display: inline-block;
		background-color: #06C1AE;
		bottom: 0;
		width: 290rpx;
		left: 290rpx;
		color: #FFFFFF;
		/* border-radius: 0; */
	}
</style>



















































































































































