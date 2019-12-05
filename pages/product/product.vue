<template>
	<view v-bind:style="noDataCenter" v-if="showPage" class="container">
		<view v-if="!showPage" class="nodataText">

			<image src="../../static/myOrder/myOrderNoData.png" class="noDataPic"></image>
			<text class="nodataText">暂无数据</text>

		</view>
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in titleImg" :key="index">
					<view @click="checkPicture(titleImg ,index)" class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{dataDic.commodityTitle}}</text>
			<view class="price-box">
				<view style="display: block;">
					<text class="price">{{"￥" + dataDic.salePrice}}</text>
					<text class="m-price">{{"￥" + dataDic.originalPrice}}</text>
				</view>
				<view style="color: #999999;">
					<text style="margin-right: 40rpx;">销量: {{dataDic.salesVolume}}</text>
					<text style="display: inline-block;">库存: {{dataDic.commodityNum}}</text>
				</view>
			</view>

		</view>
		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list">
					<view style="display: flex;align-items: center;">
						<image style="width: 24rpx;height: 28rpx;margin-right: 10rpx;" src="../../static/product/location.png"></image>
						<text style="font-size:28rpx;font-weight:500;color:rgba(51,51,51,1);">{{dataDic.shopName}}</text>
					</view>
					<text style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(204,204,204,1);margin-left: 34rpx;">{{dataDic.shopAddress}}</text>
				</view>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list" style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(153,153,153,1);padding-left: 30rpx;
padding-right: 30rpx;
">
					<template>{{dataDic.commodityInfo}}</template>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<view class="line">
				</view>
				<text>商品介绍</text>
			</view>
			<rich-text :nodes="bottomImg"></rich-text>
		</view>
		<view class="bottom" v-show="!deliveryFlag">
			<view @click="makeCall()" class="buyView" style="background-color: #FFFFFF;">
				<image style="width: 31rpx;height: 30rpx;margin-right: 10rpx;" src="../../static/product/server.png"></image>
				<text style="color:rgba(51,51,51,1);">联系客服</text>
			</view>
			<view @click="reayToBuy()" class="buyView">
				<text>立即购买</text>
			</view>
		</view>
		<!-- 选择购买数量 -->

		<view v-show="isBuy" style="background-color: rgba(0,0,0,0.5); z-index: 3;position: fixed;bottom: 0rpx;right: 0rpx;width: 100vw;height: 100vh;"></view>
		<view v-show="isBuy" class="cart-item">
			<view class="image-wrapper">
				<image :src="titleImg[0]" style="width: 200rpx;height: 200rpx;"></image>
			</view>
			<view class="item-right">
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<text class=" title" style="font-weight: 500;">{{dataDic.commodityTitle}}</text>
					<text class="del-btn" @click="cancel">取消</text>
				</view>
				<text class="price">¥{{buyNum * dataDic.salePrice}}</text>
				<view style="display: flex;justify-content: space-between;margin-top: 40rpx;align-items: center;">
					<uniNumberBox :min="1" :max="dataDic.commodityNum" :value="buyNum>dataDic.commodityNum?dataDic.commodityNum:buyNum"
					 @change="numberChange()"></uniNumberBox>
					<button class="buyButton" @click="buy()">立即购买</button>
				</view>
			</view>
		</view>
		
		<view class="rebate-container" v-show="rebateShow">
			<view class="rebate-img-container" @tap="shareEvn">
				<image src="/static/product/ic-rebate-red-wallet.png" mode="" class="rebate-img"></image>

				<text class="rebate-text">返￥{{rebateValue}}</text>
			</view>

			<image src="/static/product/ic-close.png" mode="" class="rebate-close" @tap="closeRebate()"></image>
		</view>
		
		<!-- 分享弹窗-->
		<view class="share-pro">
			<view class="share-pro-mask" v-if="deliveryFlag"></view>
			<view class="share-pro-dialog" :class="deliveryFlag?'open':'close'">
				<view class="close-btn" @tap="closeShareEvn">
					<span class="font_family">&#xe6e6;</span>
				</view>
				<view class="share-pro-title">分享</view>
				<view class="share-pro-body">
					<view class="share-item">
						<button open-type="share" class="share-btn-common">
							<view class="font_family share-icon">&#xe6fa;</view>
							<view>分享给好友</view>
						</button>
					</view>
					<view class="share-item" @tap="createCanvasImageEvn">
						<view class="font_family share-icon">&#xe6f9;</view>
						<view>生成分享图片</view>
					</view>
				</view>
		
			</view>
		</view>
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData" />
		<view :hidden="canvasFlag">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas><!-- 海报 -->
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '../components/uni-number-box/uni-number-box.vue'

	// 海报
	import hchPoster from '../components/hch-poster/hch-poster.vue'
	
	import {
		api
	} from "./api.js"

	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				showPage: false,
				buyNum: 1,
				isBuy: false,
				dataDic: {},
				commodityImg: [],
				specClass: 'none',
				titleImg: [],
				shareList: [],
				bottomImg: [],
				imgList: [],
				// 通过各种形式推荐该用户进入该页面的推荐人(上级)
				superiorUser: '',
				commodityId: '', // 当前商品页的商品id
				// 右侧分享返佣
				rebateValue: 0,
				rebateShow: true,
				// 分享海报的使用的变量
				deliveryFlag: false,
				canvasFlag: true,
				posterData: {}
			};
		},
		components: {
			uniNumberBox,
			hchPoster
		},
		computed: {
			noDataCenter() {
				if (!this.showPage) {
					return "text-align:center"
				} else {
					return ""
				}
			},
			...mapState(['token'])
		},

		methods: {
			createCanvasImageEvn() {
				// 这个是固定写死的小程序码
				// Object.assign(this.posterData, {
				// 	// url: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg', //商品主图
				// 	url: this.commodityImg[0], //商品主图
				// 	// icon: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png', //醉品价图标
				// 	icon: 'none', //优惠价图标
				// 	// title: "诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g", //标题
				// 	title: this.dataDic.commodityTitle + ' ' + this.dataDic.commodityInfo.split(" ").join(""), //标题
				// 	discountPrice: this.dataDic.salePrice, //折后价格
				// 	orignPrice: this.dataDic.originalPrice, //原价
				// 	// code: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png', // 小程序码
				// 	code: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png', //todo 二维码
				// })
				// this.$forceUpdate(); //强制渲染数据
				// setTimeout(() => {
				// 	this.canvasFlag = false; //显示canvas海报
				// 	this.deliveryFlag = false; //关闭分享弹窗
				// 	this.$refs.hchPoster.createCanvasImage(); //调用子组件的方法
				// }, 500)
				// 这个是固定写死的小程序码 end
				// 以下是根据后端接口动态生成小程序码
				let code="";
				
				api.getQRCodeImg({commodityId: 1}).then((res)=>{
					code = res.data.data;
					console.log('二维码图片');
					console.log(code);
					console.log('海报');
					console.log(this.dataDic.posterImg);
					Object.assign(this.posterData, {
						url: this.dataDic.posterImg, //商品海报图片
						icon: 'none', //优惠价图标
						title: this.dataDic.commodityTitle + ' ' + this.dataDic.commodityInfo.split(" ").join(""), //标题
						discountPrice: this.dataDic.salePrice, //折后价格
						orignPrice: this.dataDic.originalPrice, //原价
						code:code,//商品二维码
					});
					this.$forceUpdate();//强制渲染数据
					setTimeout(()=>{
						this.canvasFlag=false;//显示canvas海报
						this.deliveryFlag = false;//关闭分享弹窗
						this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
					},500)
				}).catch(err => {
					console.log(err);
				})
				// 以下是根据后端接口动态生成小程序码 end
			},
			// 分享弹窗
			shareEvn() {
				this.deliveryFlag = true;
			},
			// 关闭分享弹窗
			closeShareEvn() {
				this.deliveryFlag = false;
			},
			// 取消海报
			canvasCancel(val) {
				this.canvasFlag = val;
			},
			
			
			
			// -------
			/**
			 * 获取商品详细信息
			 * @param {Object} commodityId
			 */
			numberChange: function(data) {

				this.buyNum = data;

			},
			cancel: function() {
				this.isBuy = false
			},

			getData: function(commodityId) {
				uni.showLoading({
					title: "正在加载"
				})
				api.getList({
					commodityId: commodityId
				}).then(res => {
					console.log(res);
					this.dataDic = res.data.data;
					this.dataDic.commodityNum = Number.parseInt(this.dataDic.commodityNum);
					this.dataDic.salePrice = Number.parseFloat(this.dataDic.salePrice);

					this.titleImg = this.dataDic.recommendImgs;
					let bottomPicture = this.dataDic.guessImgs;
					this.bottomImg += `<div style="width:100%">`
					bottomPicture.forEach((item, index, arr) => { // item为arr的元素，index为下标，arr原数组
						// if (index >= 3) {
							this.bottomImg += `<img style="width:100%;display:block;" src="${item}"/>`
						// }
					});
					this.bottomImg += `</div>`

					// this.commodityImg = this.dataDic.commodityImg
					uni.hideLoading()
					this.showPage = true;

					console.log('返佣金额显示：' + this.dataDic.fyMoney);
					if (this.dataDic.fyMoney != undefined && this.dataDic.fyMoney != null) {
						this.rebateShow = true;
						this.rebateValue = this.dataDic.fyMoney;
					} else {
						this.rebateShow = false;
					}
				}).catch(err => {

					console.log(err);
					uni.hideLoading()
					uni.showToast({
						title: "网络错误，请稍后重试",
						icon: 'none'
					})
				})
			},
			// 放大查看图片
			checkPicture: function(url, index) {
				uni.previewImage({
					current: index,
					urls: url,
					indicator: "default",
					loop: true,

					// longPressActions: {
					//     itemList: ['发送给朋友', '保存图片', '收藏'],
					//     success: function(data) {
					//         console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					//     },
					//     fail: function(err) {
					//         console.log(err.errMsg);
					//     }
					// }
				});
			},
			makeCall: function() {
				uni.makePhoneCall({
					// 手机号
					phoneNumber: this.dataDic.shopPhone,
					success: (res) => {
						console.log('调用成功!')
					},
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			reayToBuy: function() {

				this.isBuy = true
			},

			buy: function() {
				uni.navigateTo({
					url: `/pages/payOrder/payOrder?commodityId=${this.dataDic.commodityId}&commodityNum=${this.buyNum}&remark = ${this.dataDic.remark}&addressId=${this.dataDic.addressId}`
				})
			},
			...mapMutations(['login']),
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo: function() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						_this.nickName = nickName;
						console.log('用户名' + nickName)
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						console.log(infoRes)
						_this.avatarUrl = avatarUrl;
						uni.base
						try {
							uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
							_this.loginWx();
						} catch (e) {
							console.error(e)
						}
					},
					fail(res) {
						uni.showModal({
							content: '失败了',
							showCancel: true
						});
					}
				});
			},
			//登录
			loginWx: function() {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes)
						if (!_this.isCanUse) {
							//非第一次授权获取用户信息
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {

									console.log(infoRes);
									//获取用户信息后向调用信息更新方法
									let nickName = infoRes.userInfo.nickName; //昵称
									_this.nickName = nickName;
									let avatarUrl = infoRes.userInfo.avatarUrl; //头像
									_this.avatarUrl = avatarUrl;
								}
							});
						}
						//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						console.log('请求后台');
						let loginParam = {
							code: loginRes.code,
							nickName: _this.nickName,
							avatarUrl: _this.avatarUrl,
							superiorUser: _this.superiorUser
						}
						console.log(loginParam)
						api.getData(loginParam).then(res => {
							console.log(res)
							_this.loginSuccess(res.data.token)
							console.info('awewe' + uni.getStorageSync('token'))
						}).catch(err => {
							console.log(err)
						})
					},
				});
			},
			//登录成功后跳转到首页
			loginSuccess: function(data) {
				this.login(data);
				// 开始获取商品信息
				this.getData(this.commodityId);
			},


			// 关闭分享返佣的图片
			closeRebate: function() {
				this.rebateShow = false;
			},
		},
		onLoad: function(params) {
			console.log(params);
			this.commodityId = params.id;
			if (params.superiorUser === undefined) {
				this.superiorUser = null;
				this.getData(this.commodityId);
			} else {
				this.superiorUser = params.superiorUser;
				uni.showToast({
					title: '正在加载中',
					icon: 'loading'
				})
				this.wxGetUserInfo();
			}
		},
		onShareAppMessage: function(res) {
			// todo path通过拼接商品id与superiorUser(需要进行多次测试)
			let path = '/pages/product/product?superiorUser=' + uni.getStorageSync('userId') + '&id=' + this.commodityId;
			if (res.from === 'button') { // 如果通过点击按钮进行分享
				console.log('通过点击按钮进行分享');
				console.log(res.target)
				return {
					title: this.dataDic.commodityTitle,
					path: path,
					imageUrl: this.dataDic.posterImg
				}
			} else { // 通过小程序上方的操作栏进行分享
				return {
					title: this.dataDic.commodityTitle,
					path: path
				}
			}
		},
	}
</script>

<style lang='scss'>
	// 海报
	/*每个页面公共css 放app.vue页面的 */
	@font-face {
		font-family: 'font_family';
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot');
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff') format('woff'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family') format('svg');
	}
	
	.font_family {
		font-family: "font_family" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	
	/* 按钮去掉边框 */
	.share-btn-common::after {
		border: none;
	}
	
	.share-btn-common {
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: 1;
		color: #1c1c1c;
		font-size: 28rpx;
		background: none;
	}
	
	.button-hover {
		color: #1c1c1c;
		background: none;
	}
	
	/*每个页面公共css */
	.content {
		text-align: center;
		height: 100%;
	}
	
	/* .share-btn {
		padding: 30upx 60upx;
		background-color: $uni-btn-color;
		color: $uni-text-color-inverse;
	} */
	
	.share-pro {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-direction: column;
		z-index: 5;
		line-height: 1;
		box-sizing: border-box;
	
		.share-pro-mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
		}
	
		.share-pro-dialog {
			width: 750rpx;
			height: 310rpx;
			overflow: hidden;
			background-color: #fff;
			border-radius: 24rpx 24rpx 0px 0px;
			position: relative;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
	
			.close-btn {
				padding: 20rpx 15rpx;
				position: absolute;
				top: 0rpx;
				right: 29rpx;
			}
	
			.share-pro-title {
				font-size: 28rpx;
				color: #1c1c1c;
				padding: 28rpx 41rpx;
				background-color: #f7f7f7;
			}
	
			.share-pro-body {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				font-size: 28rpx;
				color: #1c1c1c;
	
				.share-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					justify-content: space-around;
	
					.share-icon {
						text-align: center;
						font-size: 70rpx;
						margin-top: 39rpx;
						margin-bottom: 16rpx;
						color: #42ae3c;
					}
	
					&:nth-child(2) {
						.share-icon {
							color: #ff5f33;
						}
					}
				}
			}
		}
	
		/* 显示或关闭内容时动画 */
	
		.open {
			transition: all 0.3s ease-out;
			transform: translateY(0);
		}
	
		.close {
			transition: all 0.3s ease-out;
			transform: translateY(310rpx);
		}
	
	}
	
	.canvas {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}
	
	
	
	
	
	page {
		background: $page-color-base;
		padding-bottom: 98rpx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 400upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(48, 48, 56, 1);
			color: $font-color-dark;
			padding: 10rpx;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			height: 64upx;
			padding: 10rpx 0;
			font-size: 26rpx;
			font-weight: 400;
			color: $uni-color-primary;
		}

		.price {
			font-size: 32rpx;
			font-weight: 800;
			color: #FF7E30;
		}

		.m-price {

			margin: 0 12upx;
			color: #999999;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	.c-list {
		border-width: 1rpx 0 1rpx 0;
		border-style: solid;
		border-color: rgba(243, 243, 243, 0.7);
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	.buyView {
		display: inline-block;
		background-color: #06C1AE;
		height: 98rpx;
		width: 50vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bottom {
		z-index: 2;
		box-shadow: 0px -6px 10px 0px rgba(116, 116, 116, 0.06);
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		display: flex;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		background-color: #06C1AE;
	}

	.cart-item {
		background-color: #FFFFFF;
		width: 100vw;
		z-index: 4;
		display: flex;
		position: fixed;
		bottom: 0rpx;
		padding-top: 30rpx;
		padding-left: 20rpx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;

			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				font-size: 28rpx;

				font-weight: 500;
				color: rgba(255, 126, 48, 1);
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			position: relative;
			width: 100rpx;
			right: 20rpx;
			font-size: 28rpx;

			color: $font-color-light;
		}
	}

	.noDataPic {
		width: 200rpx;
		height: 200rpx;
		padding-top: 20vh;
	}

	.nodataText {
		font-size: 24rpx;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #CCCCCC;
	}

	.buyButton {
		background-color: #FFFFFF;
		color: rgba(6, 193, 174, 1);
		font-size: 24rpx;
		height: 63rpx;
		width: 180rpx;
		border: 1rpx solid rgba(6, 193, 174, 1);

		margin-left: 100rpx;
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			flex-direction: row;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				position: absolute;
				padding: 0 20upx;
				background: #fff;
				position: relative;
				/* z-index: 1; */
			}

		/* 	&:after {
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			} */
			
			.line {
				position: absolute;
				height: 1rpx;
				background: #CCCCCC;
				width: 400rpx;
			}
		}
	}
	


	/* 分享返佣样式 */
	.rebate-container {
		position: fixed;
		bottom: 300rpx;
		right: 26rpx;
		width: 180rpx;
		height: 250rpx;
		display: flex;
	}

	.rebate-img-container {
		position: absolute;
		margin: 18rpx 15rpx 0 0;
		width: 165rpx;
		height: 235rpx;
	}

	.rebate-img {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.rebate-close {
		position: absolute;
		right: 0;
		top: 0;
		width: 40rpx;
		height: 40rpx;
	}

	.rebate-text {
		position: absolute;
		left: 0;
		width: 100%;
		font-weight: bold;
		line-height: 200rpx;
		font-size: 28rpx;
		color: #FFF3DB;
		margin-bottom: 45rpx;
		text-align: center;
	}

</style>
