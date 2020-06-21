<template>
    <view>
        <view v-if="isCanUse">
			<view class='header'>
				<view class="vipApplyLogo" v-if="money === 0">
					<image src='/static/vip.png'></image>
					<text class="text1">囧途宝盒会员</text>
					<text class="text2">免费申请啦！</text>
					<text class="text3">名额有限！时间有限！快快报名申请吧！！</text>
				</view>
				<view class="vipApplyLogo" v-if="money !== 0">
					<image src='/static/vip.png'></image>
					<text class="text1">囧途宝盒会员</text>
					<text class="text2">永久性购买！</text>
					<text class="text3">名额有限！时间有限！快快报名购买吧！！</text>
				</view>
				<view class="exclusive">专属权益</view>
				<view class="legalRight">
					<view class="recommend">
						<image src="/static/return.png"></image>
						<view class="referee">分享下单赚钱</view>
					</view>
					<!-- <view class="vip">
						<image src="../../static/honor.png"></image>
						<view class="VIPprice">会员价购买</view>
					</view> -->
				</view>
			</view>
			<view class='applyInformation'>
				<text>姓名</text>
				<input placeholder="请输入姓名" class="inputName" v-model="applyInformation.name"/>
			</view>
			<view class='applyInformation'>
				<text>联系电话</text>
				<input placeholder="请输入电话号码" class="inputPhoneAndRemarks" v-model="applyInformation.phone"/>
			</view>
			<view class='applyInformation'>
				<text>备注</text>
				<input placeholder="请输入备注信息" class="inputPhoneAndRemarks" v-model="applyInformation.remarks"/>
			</view>
			<button @click ="recommend">购买会员<span v-if="money !== 0">({{money}}元)</span></button>
        </view>
    </view>
</template>

<script>
	import {api} from	'./api.js'
    export default {
        data() {
            return {
                isCanUse: uni.getStorageSync('isCanUse')||true,//默认为true,
				applyInformation:{
					name:'',
					phone:'',
					remarks:''
				},
				money:'',
				userId:'',
				area:''
            };
        },
		onLoad(query){
			this.userId = query.userId;
			this.area = query.area;
		    console.log(query)
		},
		mounted() {
			this.getMoney();
		},
        methods: {
			getMoney(){
				api.getVipMoney().then(res=>{
					this.money = res.data.data
					console.info(this.money)
				})
			},
			/**
			 *申请会员
			 * @param {Object} options
			 */
            recommend:function(options){
				var parms = {
					userName:this.applyInformation.name,
					phoneNum:this.applyInformation.phone,
					remark:this.applyInformation.remarks,
					userId:this.userId,
					area:this.area
				}
				console.log(parms)
				if(this.applyInformation.name==''){
					wx.showToast({
					  title: '请输入姓名',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}
				if(this.applyInformation.phone==''){
					wx.showToast({
					  title: '请输入电话号码',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}else{
					 if(!(/^1[345678]\d{9}$/).test(this.applyInformation.phone)){
						wx.showToast({
						  title: '请输入正确的电话号码',
						  icon: 'none',
						  duration: 3000
						})
						return null;
					}
				}
				if(money === 0){
					api.sendData(parms).then(res=>{
						this.getUserMes();
						uni.showToast({
						  title: '购买成功',
						  icon: 'success',
						  duration: 3000
						})
					})
				}
				else{
					console.log('开始请求');
					api.buyVIP(parms).then(res => {
						console.log(res);
						if (res.data.data != null) { 
							let data = res.data.data;
							console.log(data.jsonObject.prepayid);
							// 起调支付接口
							wx.requestPayment({
								'timeStamp': data.jsonObject.timestamp,
								'nonceStr': data.jsonObject.noncestr,
								'package': 'prepay_id=' + data.jsonObject.prepayid,
								'signType': 'MD5',
								'paySign': data.paySignStr,
								'success': function(res) {
									uni.showToast({
										title: '购买成功!',
										icon: 'success',
									});
									setTimeout(() => {
										this.getUserMes();
									}, 2000);
								},
								'fail': function(res) {
									uni.showToast({
										title: '支付失败',
										icon: 'none'
									});
								},
								'complete': function(res) {}
							});
						}else{
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
						}
					}).catch(err => {
						uni.showToast({
							title: '支付请求失败，刷新试试',
							icon: 'none'
						});
					});
				}
			},
			/**
			 * 获取用户信息
			 */
			getUserMes(){
				let user = {
					// 此处默认传入重庆市
					// 用户信息和地区无关
					area:'重庆市'
				};
				api.getUserInfo(user).then(res =>{
					this.service = res.data.data,
					// userType 说明
					// 0: app
					// 1: 企业
					// 2: 小程序
					uni.setStorageSync('userId', this.service.userId),
					console.log("id")
					console.log(this.service.userId)
					uni.setStorageSync('userType', this.service.userType),
					// 默认重庆（debug）
					uni.setStorageSync('location', "重庆市"),
					// 存储角色信息
					uni.setStorageSync('roleNameList', this.service.roleNameList),
					// 当前用户是否为VIP
					uni.setStorageSync('isVip', this.service.isVip==0?false:true)
					// 当前地区是否有VIP业务
					uni.setStorageSync('haveVip', this.service.haveVip==0?false:true)
					uni.navigateBack({
						delta:1
					})
				}).catch(err => {
					console.log(err)
				});
			},
        },
    }
</script>

<style>
	page{
		background: #F8F9FB;
	}
    .header {
        margin: 0 auto;
		margin-bottom: 20rpx;
		padding: 31rpx 10rpx 0 11rpx;
        width: 750rpx;
        height: 579rpx;
        line-height: 450rpx;
		background-color: #FFFFFF;
    }

    .header .vipApplyLogo {
        width: 729rpx;
        height: 359rpx;
		position: relative;
    }

	.vipApplyLogo image{
		width: 729rpx;
		height: 359rpx;
		margin-bottom: 50rpx;
	}

	.vipApplyLogo .text1{
		font-weight: Bold;
		font-size: 36rpx;
		position: absolute;
		color: #7E5611;
		top: -110rpx;
		left: 73rpx;
	}

	.vipApplyLogo .text2{
		font-weight: Medium;
		font-size: 28rpx;
		color: #7E5611;
		position: absolute;
		top: -50rpx;
		left: 73rpx;
	}

	.vipApplyLogo .text3{
		font-weight: Medium;
		font-size: 24rpx;
		color: #BE8E39;
		position: absolute;
		top: 60rpx;
		left: 73rpx;
	}

	.exclusive{
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin: -180rpx 0 0 31rpx;
	}

	.legalRight{
		width: 729rpx;
		height: 160rpx;
	}

	.legalRight image{
		width: 90rpx;
		height: 90rpx;
	}

	.legalRight .recommend{
		margin: -320rpx 0 0 31rpx;
	}

	.recommend .referee{
		margin: -485rpx 0 0 110rpx;
		font-size: 30rpx;
	}

	.legalRight .vip{
		margin: -420rpx 0 0 401rpx;
	}

	.vip .VIPprice{
		margin: -485rpx 0 0 110rpx;
		font-size: 30rpx;
	}

    .applyInformation {
		background: #FFFFFF;
        width: 699rpx;
		height: 60rpx;
		padding: 25rpx;
		margin-top: 2rpx;
    }

	.applyInformation text {
		margin-top: 20rpx;
	    display: block;
	    color: #303038;
	    margin-left: 10rpx;
		font-size: 30rpx;
	}

	.applyInformation .inputName{
		/* margin-left: -30rpx; */
		margin-top: -40rpx;
		font-size: 30rpx;
		color: black;
		text-align: right;
	}

	.applyInformation .inputPhoneAndRemarks{
		margin-left: 470rpx;
		margin-top: -40rpx;
		font-size: 30rpx;
		color: black;
		text-align: right;
	}

    button {
        border-radius: 80rpx;
        width: 670rpx;
		height: 88rpx;
		position: absolute;
		left: 40rpx;
		bottom: 50rpx;
        font-size: 35rpx;
		background-color: #313134;
		color: #FFFFFF;
    }
</style>
