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
				<text>商品介绍</text>
			</view>
			<rich-text :nodes="bottomImg"></rich-text>
		</view>
		<view class="bottom">
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

		<!-- 分享海报展示 -->
		<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px">
					<image :src="poster.finalPath" mode="widthFix" class="posterImage"></image>
				</view>
				<view class="flex_row marginTop2vh">
					<button class="primary-btn" size="mini" open-type='share'>分享好友</button>
					<button class="primary-btn" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
					<!-- <button type="primary" size="mini" @tap.prevent.stop="share()">分享图片</button> -->
				</view>
			</view>
		</view>
		<!-- <button type="primary" @tap="shareFc()">生成海报</button> -->
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
		</view>

		<view class="rebate-container" v-show="rebateShow">
			<view class="rebate-img-container" @tap="shareFc()">
				<image src="/static/product/ic-rebate-red-wallet.png" mode="" class="rebate-img"></image>

				<text class="rebate-text">{{rebateText}}</text>
			</view>

			<image src="/static/product/ic-close.png" mode="" class="rebate-close" @tap="closeRebate()"></image>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '../components/uni-number-box/uni-number-box.vue'
	// 分享海报的js文件
	import _app from '../components/QS-SharePoster/app.js';
	import getSharePoster from '../components/QS-SharePoster/QS-SharePoster.js';

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
				// 分享海报的使用的变量
				rebateText: '返￥2', // todo 返佣价格文字
				rebateShow: true,
				poster: {},
				qrShow: false,
				canvasId: 'default_PosterCanvasId'
			};
		},
		components: {
			uniNumberBox
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

					this.dataDic = res.data.data,
						this.dataDic.commodityNum = Number.parseInt(this.dataDic.commodityNum)
					this.dataDic.salePrice = Number.parseFloat(this.dataDic.salePrice)


					this.titleImg = this.dataDic.commodityImg.filter((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
						return index < 3
					})
					let bottomPicture = this.dataDic.commodityImg.filter((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
						return index >= 3
					})
					this.bottomImg = `<div style="width:100%">`
					this.dataDic.commodityImg.forEach((item, index, arr) => { // item为arr的元素，index为下标，arr原数组
						if (index >= 3) {
							this.bottomImg += `<img style="width:100%;display:block;" src="${item}"/>`
						}
					});
					this.bottomImg += `</div>`

					this.commodityImg = this.dataDic.commodityImg
					uni.hideLoading()
					this.showPage = true
				}).catch(err => {

					uni.hideLoading()
					uni.showToast({
						title: "网络错误，请稍后重试"
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
			async shareFc() {
				try {
					if (!this.poster.finalPath) {
						const d = await getSharePoster({
							type: 'testShareType',
							posterCanvasId: this.canvasId,
							backgroundImage: this.commodityImg[0], // todo 获取专门的海报图片路径	
							qrCodeArray: ({
								bgObj,
								type,
								bgScale
							}) => {
								return [{
									text: '你好，我是取舍',
									size: bgObj.width * 0.2,
									dx: bgObj.width * 0.05,
									dy: bgObj.height - bgObj.width * 0.25
								}]
							},
							imagesArray: ({
								bgObj,
								type,
								bgScale
							}) => { //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
								const dx = bgObj.width * 0.3;
								return [{
									url: '', // /static/logo.png
									dx,
									dy: bgObj.height - bgObj.width * 0.25,
									infoCallBack(imageInfo) {
										let scale = bgObj.width * 0.2 / imageInfo.height;
										return {
											circleSet: {
												x: imageInfo.width * scale / 2,
												y: bgObj.width * 0.2 / 2,
												r: bgObj.width * 0.2 / 2
											}, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
											dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width * 0.2,
											roundRectSet: { // 圆角矩形
												r: imageInfo.width * .1
											}
										}
									}
								}]
							},
							textArray: ({
								bgObj,
								type,
								bgScale
							}) => {
								const fontSize = bgObj.width * 0.045;
								const lineHeight = bgObj.height * 0.04;
								return [{
									fontStyle: 'italic',
									text: '取舍',
									size: fontSize,
									color: 'white',
									alpha: .5,
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										_app.log('index页面的text的infocallback ，textlength:' + textLength);
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight * 3
										}
									}
								}, {
									text: '取舍',
									fontWeight: 'bold',
									size: fontSize,
									color: 'white',
									alpha: .75,
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight * 2
										}
									}
								}, {
									text: '取舍',
									size: fontSize,
									color: 'white',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight
										}
									}
								}, ]
							},
							setCanvasWH: ({
								bgObj,
								type,
								bgScale
							}) => { // 为动态设置画布宽高的方法，
								this.poster = bgObj;
							},
							setDraw: ({
								Context,
								bgObj,
								type,
								bgScale
							}) => {
								Context.setFillStyle('black');
								Context.setGlobalAlpha(0.3);
								Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
							}
						});
						console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath)
						this.poster.finalPath = d.poster.tempFilePath;
					}
					this.qrShow = true;
				} catch (e) {
					_app.hideLoading();
					_app.showToast(JSON.stringify(e));
					console.log(JSON.stringify(e));
				}
			},
			saveImage: function() {
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_app.showToast('保存成功');
						// 隐藏
						this.hideQr();
					},
					fail(err) {
						// 解决存储图片的权限遭到拒绝的情况
						console.log(err)

						if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
							console.log("打开设置窗口");
							wx.openSetting({
								success(settingdata) {
									console.log(settingdata)
									if (settingdata.authSetting["scope.writePhotosAlbum"]) {
										console.log("获取权限成功，再次点击图片保存到相册")
									} else {
										console.log("获取权限失败")
									}
								}
							})
						} else if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
							console.log("打开设置窗口");
							wx.openSetting({
								success(settingdata) {
									console.log(settingdata)
									if (settingdata.authSetting["scope.writePhotosAlbum"]) {
										console.log("获取权限成功，再次点击图片保存到相册")
									} else {
										console.log("获取权限失败")
									}
								}
							})
						}
					}
				})
				// #endif
				// #ifdef H5
				_app.showToast('保存了');
				// #endif
			},
			share: function() {
				// #ifdef APP-PLUS
				_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
				// #endif

				// #ifndef APP-PLUS
				_app.showToast('分享了');
				// #endif				
			},
			hideQr: function() {
				this.qrShow = false;
			},
			// 关闭分享返佣的图片
			closeRebate: function() {
				this.rebateShow = false;
			}
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
					imageUrl: this.poster.finalPath
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
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	.pop-class {}

	// 海报图片背景样式设置
	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(3);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 999;
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}

	.backgroundColor-white {
		background-color: white;
	}

	.border_radius_10px {
		border-radius: 10px;
	}

	.padding1vh {
		padding: 1vh;
	}

	.posterImage {
		width: 60vw;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.marginTop2vh {
		margin-top: 2vh;
	}

	.primary-btn {
		background: #06C1AE;
		color: #FFFFFF;
	}

	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
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
