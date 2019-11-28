<template>
	<view class="main">
		<view class="head">
			<view class="subHead">
				<image class="photo" :src="user.photo"></image>
				<text class="name">{{user.name}}</text>
				<text class="account">{{user.account}}</text>
			</view>
		</view>	
		<view class="vip">
			<image class="vipPhoto" src="../../static/vip/ic-会员价购买.png"></image>
			<text class="applyVip" @click="getVip()">申请会员</text>
			<text class="freeVip"  @click="getVip()">囧途宝盒会员免费申请啦！</text>
			<image class="more" src="../../static/vip/ic-更多.png" @click="getVip()"></image>
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
		<text class="myElectronicCode">我的电子码</text>
		<text class="lookMore">查看更多</text>
		<image class="moreCode" src="../../static/code/ic-更多电子码.png"></image>
		<view class="electronicCode">
			<view class="subElectronicCode">
				<image class="codePhoto" :src="code.commodityImgList[0]"></image>
				<text class="codeName" :style="{display:code.commodityType == 2 ? 'block' : 'none' }">电子码：{{code.electronicCode}}</text>
				<text class="codeAccount" :style="{display:code.commodityType == 2 ? 'block' : 'none' }">订单号码：{{code.orderId}}</text>
				<text class="codeName" :style="{display:code.commodityType == 1 ? 'block' : 'none' }">快递单号：{{code.deliveryNum}}</text>
				<button class="copy" :style="{display:code.commodityType == 1 ? 'block' : 'none' }">复制</button>
				<text class="codeAccount" :style="{display:code.commodityType == 1 ? 'block' : 'none' }">邮寄状态：{{this.getdeliveryState(code.deliveryState)}}</text>
			</view>
			<view class="introduction">
				<view class="dottedLineOne"></view>
				<text class="codeInfo">{{code.commodityInfo}}</text>
				<view class="dottedLineTwo"></view>
			</view>
			<view class="bottom">
				<text class="shopName">{{code.commodityTitle}}</text>
				<button class="QR-Code" :style="{display:code.commodityType == 2 ? 'block' : 'none'}"><text class="fontTwo">查看二维码</text></button>
				<button class="lookDetails" :style="{marginRight:code.commodityType == 2 ? '25rpx' : '0rpx'}"><text class="fontOne">查看详情</text></button>
				
			</view>
		</view>
	
	</view>
	
</template>

<script>
	import {api} from './api.js'
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
					codes:{
						codeName:'乌拉拉',
						codeAccount:'153897433204',
						codeIntroduction:'电子电子码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介电子码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介电子码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介电子码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介电子码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介电子码简介电子码简介电子码简介简介电子介简介电子码简介简介电子码简介电子码简介简介电子码简介',
						shopName:'水晶玻璃纸',
						photo:'../../static/code/logo.png',
					},
					code:[],
	            };
	        },
			onShow() {
				this.wxGetUserInfo();
				this.getData();
				this.getCode();
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
					}
					api.getList(p).then(res =>{
						this.service = res.data.data,
						console.log(this.service)
					}).catch(err => {
						console.log(err)
					})
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
				//获取邮寄状态
				getdeliveryState(index){
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
	           
	    }
</script>

<style>
	.main{
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
</style>



















































































































































