<template>
	<view class="main-container">
		<!-- 商品展示 -->
		<view class="commodity-container">
			<view class="commodity-img-container">
				<image :src="showSaleImageUrl" mode="" class="commodity-img"></image>
			</view>

			<view class="commodity-content-container">
				<!-- 商品名 -->
				<text class="commodity-title">{{commodity.commodityTitle}}</text>

				<text class="select-commodity-attr">{{selectedAttr}}</text>
				
				<!-- 价格展示 与 数量 -->
				<view class="commodity-price-container">
					<text class="commodity-actual-price">￥{{showSalePrice}}</text>

					<text class="commodity-primary-price">￥{{commodity.originalPrice}}</text>

					<text class="commodity-num">x{{commodityNum}}</text>
				</view>
			</view>
		</view>

		<!-- 地址展示 -->
		<view v-if="commodity.takeWay === 1 && hasDefaultAddress" class="address-container" @tap="chooseAddress">
			<view class="addres-img-container">
				<image src="/static/payOrder/ic-address.png" mode="" class="addres-img"></image>
			</view>

			<view class="address-content-container">
				<view class="address-user-info-container">
					<text class="address-user-name">
						{{address.receiver}}
					</text>

					<text class="address-user-account">
						{{address.contactNumber}}
					</text>
				</view>

				<view class="address-user-address-detail">
					{{wholeAddress}}
				</view>
			</view>

			<view class="address-more-address-container">
				<image src="/static/payOrder/ic-more-el-code.png" mode="" class="address-more-address-img"></image>
			</view>
		</view>

		<!-- 新增地址 -->
		<view v-if="commodity.takeWay === 1 && !hasDefaultAddress" class="address-container" @tap="addAddress">
			<view class="addrees-add-container">
				<view class="addrees-add-content-container">
					<image src="/static/payOrder/ic-add-address.png" mode="" class="addrees-add-img"></image>

					<text class="address-add-text">新增地址</text>
				</view>
			</view>
		</view>

		<!-- 输入联系电话 -->
		<view v-if="commodity.takeWay === 2" class="remark-container">
			<text class="remark-text">联系电话</text>
			<input class="remark-input" placeholder="请输入联系电话" v-model="userPhone" />
		</view>

		<!-- 输入备注 -->
		<view class="remark-container">
			<text class="remark-text">备注</text>
			<textarea rows="3" class="remark-input" placeholder="选填，输入订单相关的备注" v-model="remark" />
		</view>

		<!-- 支付按钮与价格 -->
		<view class="pay-btn-container">
			<view class="pay-btn-price-container">
				<text class="pay-btn-price-total">合计:</text>
				<text class="pay-btn-price-text">￥{{showSalePrice}}</text>
			</view>

			<view class="pay-btn" @tap="payOrder">
				<text class="pay-btn-text">立即支付</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		PayOrderAPI
	} from './api.js'

	import md5 from '../utils/md5.js'

	export default {
		data() {
			return {
				commodityId: '',
				commodityNum: '',
				commodity: {
					commodityId: '',
					commmodityTitle: '',
					commodityImg: [],
					salePrice: '',
					originalPrice: '',
					commodityTitle: '',
					takeWay: 2,
				},
				// imageUrl: '',
				addressId: '', // 外部传递过来的id（暂时未使用）
				address: {},
				wholeAddress: '', // 完整路径(上方字符串的拼接)
				hasDefaultAddress: false,
				userPhone: '', // 核销类型的商品需要填写电话号码
				remark: '',
				totalPrice: 0,
				
				selectedValueId: '',
				selectedAttr: '',
				showSalePrice: 0, // 商品详情页面获取的价格
				showSaleImageUrl: '', // 商品详情页面获取的图片
			}
		},

		onLoad: function(params) {
			console.log(params);
			this.commodityId = params.commodityId;
			this.commodityNum = params.commodityNum;
			// 已选择的商品属性id(请求)与属性名(展示)
			this.selectedValueId = params.selectedValueId;
			this.selectedAttr = params.selectedAttr;
			// 展示的价格
			this.showSalePrice = params.showSalePrice;
			console.log('商品图片');
			console.log(params.imageUrl);
			// 商品图片
			this.showSaleImageUrl = decodeURIComponent(params.imageUrl);
		},

		onShow: function() {
			this.address = uni.getStorageSync("chooseAddress")
			uni.removeStorageSync('chooseAddress');
			console.log(this.address)
			this.getCommodityInfo();
		},
		// uni.startPullDownRefresh();


		// onPullDownRefresh: function() {
		// 	this.getCommodityInfo();

		// },
		methods: {

			// 判断对象是不是空的
			isEmptyObject(obj) {
				for (var key in obj) {
					return false;
				}
				return true;
			},

			getCommodityInfo: function() {
				// 获取商品信息
				if (this.commodityId != null && this.commodityId != undefined) {
					PayOrderAPI.getCommodityInfo({
						commodityId: this.commodityId
					}).then(res => {
						this.commodity = res.data.data;
						this.commodity.salePrice = Number(this.commodity.salePrice);
						this.commodity.originalPrice = Number(this.commodity.originalPrice);
						// // 设置显示的图片
						// if (this.commodity.commodityImg.length > 0) {
						// 	this.imageUrl = this.commodity.commodityImg[0];
						// }
						// // 获取总价格
						// this.totalPrice = Number(this.showSalePrice) * Number(this.commodityNum);

						// 寄送，请求默认地址
						if (this.commodity.takeWay === 1) {

							if (this.isEmptyObject(this.address)) {
								console.log("地址是空的")
								this.getDefaultAddress();
							}

						}


					}).catch(err => {
						uni.showToast({
							title: '商品信息获取失败，刷新试试',
							icon: 'none'
						});

					})
				} else {
					uni.navigateBack();
				}
			},
			getDefaultAddress: function() {
				// todo获取默认地址，如果没有数据，更改样式，要求用户选择地址or
				PayOrderAPI.getDefaultAddress().then(res => {
					if (res.data.data != null && res.data.data != undefined) {
						this.hasDefaultAddress = true;
						this.address = res.data.data;
						this.wholeAddress = this.address.province +
							' ' + this.address.city +
							' ' + this.address.area +
							' ' + this.address.detail;
					} else {
						this.hasDefaultAddress = false;
					}
				}).catch(err => {
					uni.showToast({
						title: '默认地址获取失败，刷新试试',
						icon: 'none'
					});
				});
			},
			chooseAddress: function() {
				// 跳转到选择地址页面，并且标明是从支付订单页面跳转
				uni.navigateTo({
					url: '/pages/address/address?choose=true'
				})
			},
			addAddress: function() {
				// 跳转到选择地址页面，并且标明是从支付订单页面跳转
				uni.navigateTo({
					url: '/pages/address/address'
				})
			},
			payOrder: function() {
				if (this.commodity.takeWay === 1) { // 寄送类型的商品
					if (this.address.addressId === null || this.address.addressId === undefined || this.address.addressId === '') {
						uni.showToast({
							title: '请选择收货地址',
							icon: 'none'
						});
						// this.showNotice('请选择收货地址');
						return;
					}
				} else if (this.commodity.takeWay === 2) { // 核销类型的商品
					if (this.userPhone === '') {
						uni.showToast({
							title: '请输入联系电话',
							icon: 'none'
						});
						// this.showNotice('请输入联系电话');
						return;
					}
					if (!this.checkPhone(this.userPhone)) {
						return;
					}
				}

				// 支付参数
				let params = {
					commodityId: this.commodityId,
					commodityNum: this.commodityNum,
					userPhone: this.userPhone,
					remark: this.remark,
					addressId: this.address.addressId,
					commodityAttrIds: this.selectedValueId
				};

				console.log('开始请求');
				PayOrderAPI.payOrder(params).then(res => {
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
									// 购买成功去往个人中心
									uni.switchTab({
										url: '/pages/mine/mine'
									});
						
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
							title: '库存不够',
							icon: 'none'
						});
					}
				}).catch(err => {
					uni.showToast({
						title: '支付请求失败，刷新试试',
						icon: 'none'
					});
				});
			},
			checkPhone: function(phone) {
				if (!(/^1[3456789]\d{9}$/.test(phone))) {
					uni.showToast({
						title: '手机号码格式有误，请重填',
						icon: 'none'
					});
					// this.showNotice('手机号码格式有误，请重填')
					return false;
				} else {
					return true;
				}
			},
			showNotice: function(content) {
				uni.showModal({
					title: '提示',
					content: content,
					showCancel: false
				});
			},
			imgStorage: function() {}
		}
	}
</script>

<style>
	.main-container {
		width: 100%;
		height: 100vh;
		background: #F8F9FB;
	}

	.commodity-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 230rpx;
		background: #FFFFFF;
	}

	.commodity-img-container {
		margin: auto 30rpx auto 30rpx;
		border: #E3E3E3 1px solid;
		border-radius: 10rpx;
		width: 170rpx;
		height: 170rpx;
	}

	.commodity-img {
		padding: 18rpx;
		width: 140rpx;
		height: 140rpx;
	}

	.commodity-content-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: auto 0 auto 0;
		width: 520rpx;
		height: 170rpx;
	}

	.commodity-title {
		margin: auto 20rpx auto 0;
		color: #303038;
		font-size: 34rpx;
		font-weight: bold;
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	.select-commodity-attr {
		margin: auto 20rpx auto 0;
		color: #333333;
		font-size: 25rpx;
		font-weight: bold;
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.commodity-price-container {
		display: flex;
		justify-content: flex-end;
		margin: auto 0 auto 0;
	}

	.commodity-actual-price {
		flex-direction: row;
		color: #FF7E30;
		font-size: 30rpx;
		font-weight: bold;
	}

	.commodity-primary-price {
		flex-direction: row;
		margin-left: 15rpx;
		text-decoration: line-through;
		color: #999999;
		font-size: 28rpx;
	}

	.commodity-num {
		margin-right: 20rpx;
		flex: 100%;
		text-align: right;
		color: #999999;
		font-size: 28rpx;
	}

	.address-container {
		margin-top: 15rpx;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 180rpx;
		background: #FFFFFF;
	}

	.addres-img-container {
		/* position: relative;
		left: 35rpx;
			width: 100rpx; */
		/* height: 100rpx;
		margin: 40rpx; */
	}

	.addres-img {
		width: 70rpx;
		height: 70rpx;
		margin-top: 55rpx;
		margin-left: 35rpx;
		;
		margin-right: 30rpx;
	}

	.address-content-container {
		display: flex;
		margin: auto 0 auto 0;
		justify-content: center;
		width: 600rpx;
		display: flex;
		flex-direction: column;
	}

	.address-user-info-container {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row;
	}

	.address-user-name {
		font-weight: 500;
		color: #303038;
		font-size: 30rpx;
	}

	.address-user-account {
		font-weight: 500;
		margin: auto 0 auto 15rpx;
		color: #999999;
		font-size: 30rpx;
	}

	.address-user-address-detail {
		font-weight: 500;
		margin: auto 0 auto 0;
		color: #333333;
		font-size: 24rpx;
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.address-more-address-container {
		width: 215rpx;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		flex-direction: row;
	}

	.address-more-address-img {
		width: 13rpx;
		height: 26rpx;
		margin: auto 20rpx auto 0;
	}

	.addrees-add-container {
		display: flex;
		width: 100%;
	}

	.addrees-add-content-container {
		display: flex;
		justify-content: center;
		margin: auto;
	}

	.addrees-add-img {
		width: 40rpx;
		height: 40rpx;
	}

	.address-add-text {
		margin-left: 20rpx;
		color: #333333;
		font-size: 30rpx;
		text-line-through: 40rpx;
	}

	.remark-container {
		margin-top: 15rpx;
		width: 100%;
		background: #FFFFFF;
		font-size: 30rpx;
	}

	.remark-text {
		font-weight: 500;
		display: block;
		margin: 10rpx 10rpx 20rpx 40rpx;
		color: #303038;
	}

	.remark-input {
		font-size: 30rpx;
		width: auto;
		margin: 0 30rpx 0 30rpx;
		display: block;
		box-sizing: border-box;
		padding: 15rpx 20rpx;
		background: #f3f3f3;
	}

	.pay-btn-container {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		width: 100%;
		height: 110rpx;
		font-size: 28rpx;
	}

	.pay-btn-price-container {
		flex: 100%;
		display: flex;
		justify-content: center;
		flex-direction: row;
		background: #FFFFFF;
	}

	.pay-btn-price-total {
		margin: auto 0 auto 0;
		color: #333333;
	}

	.pay-btn-price-text {
		font-weight: bold;
		margin: auto 0 auto 0;
		color: #FF5730;
	}

	.pay-btn {
		display: flex;
		justify-content: center;
		flex-direction: row;
		flex: 100%;
		background: #06C1AE;
	}

	.pay-btn-text {
		margin: auto;
		color: #FFFFFF;
	}

	::-webkit-input-placeholder {
		color: #CCCCCC;
	}

	:-moz-placeholder {
		/* Firefox 18- */
		color: #CCCCCC;
	}

	::-moz-placeholder {
		/* Firefox 19+ */
		color: #CCCCCC;
	}

	:-ms-input-placeholder {
		color: #CCCCCC;
	}
</style>
