<template>
	<view class="main-container">
		<!-- 商品展示 -->
		<view class="commodity-container">
			<view class="commodity-img-container">
				<image src="../../static/payOrder/ic-地址.png" mode="" class="commodity-img"></image>
			</view>

			<view class="commodity-content-container">
				<!-- 商品名 -->
				<text class="commodity-title">谈谈烧烤</text>

				<!-- 价格展示 与 数量 -->
				<view class="commodity-price-container">
					<text class="commodity-actual-price">￥0</text>

					<text class="commodity-primary-price">￥0</text>

					<text class="commodity-num">x1</text>
				</view>
			</view>
		</view>

		<!-- 地址展示 -->
		<view 
			v-if="takeWay === 1"
			class="address-container"
			@tap="chooseAddress">
			<view class="addres-img-container">
				<image src="../../static/payOrder/ic-地址.png" mode="" class="addres-img"></image>
			</view>

			<view class="address-content-container">
				<view class="address-user-info-container">
					<text class="address-user-name">
						张三
					</text>

					<text class="address-user-account">
						182321312312
					</text>
				</view>

				<view class="address-user-address-detail">
					江苏省 南京市 市辖区 江南大道花园小区 1栋5-10
				</view>
			</view>

			<view class="address-more-address-container">
				<image src="../../static/payOrder/ic-更多电子码.png" mode="" class="address-more-address-img"></image>
			</view>
		</view>

		<!-- 输入备注 -->
		<view class="remark-container">
			<text class="remark-text">备注</text>
			<input class="remark-input" placeholder="选填,输入备注" v-model="remark" />
		</view>

		<!-- 支付按钮与价格 -->
		<view class="pay-btn-container">
			<view class="pay-btn-price-container">
				<text class="pay-btn-price-total">合计:</text>
				<text class="pay-btn-price-text">￥{{totalPrice}}</text>
			</view>

			<view class="pay-btn" @tap="payOrder" data-test="123">
				<text class="pay-btn-text">立即支付</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		PayOrderAPI
	} from './api.js'

	export default {
		data() {
			return {
				commodityId: '',
				commodity: {
					imageUrl: '',
					commodityTitle: '',
				},
				imageUrl: '',
				takeWay: 1, // 默认为核销(不显示选择地址信息)
				// 支付价格
				// 原价
				// 件数

				// 地址栏
				addressId: '', // 默认地址的id
				remark: '',
				totalPrice: 0,
			}
		},
		// mounted() {
		// 	console.log('mounted');
		// 	this.getCommodityInfo();
		// },
		methods: {
			onLoad: function(params) {
				console.log(params);
				this.commmodityId = params.commodityId
				
				this.getCommodityInfo();
			},
			getCommodityInfo: function() {
				// 获取商品信息
				console.log(this.commmodityId);
				if (this.commodityId != null && this.commodityId != undefined) {
					console.log("开始请求");
					PayOrderAPI.getCommodityInfo({
						commodityId: this.commodityId
					}).then(res => {
						console.log(res);
					}).catch(err => {
						uni.showToast({title: '商品信息获取失败，刷新试试'})
						console.log(err);
					})
				} else {
					console.log("返回上一个页面");
					uni.navigateBack();
				}
			},
			getDefaultAddress: function() {
				// todo获取默认地址，如果没有数据，更改样式，要求用户选择地址or
			},
			chooseAddress: function() {
				// 跳转到选择地址页面，并且标明是从支付订单页面跳转
				uni.navigateTo({
					url: '../address/address?payOrder=true'
				})
			},
			payOrder: function(item) {
				// todo 支付订单，，传递commodityId, commodityNum, remark
				console.log(item);
				
				// uni.navigateTo({
				// 	url: './imageTest/imageTest'
				// });
				this.commmodityId = 1;
				this.getCommodityInfo();
				// let params = {
				// 	commodityId: this.commmodityId,
				// 	commodityNum: this.commmodityNum
				// }
				// let params = {
				// 	commodityId: 1,
				// 	commodityNum: 1,
				// 	userPhone: '1593528693'
				// };
				// PayOrderAPI.payOrder(params).then(res => {
				// 	console.log(res);
				// }).catch(err => {
				// 	console.log(err);
				// });
			},
			imgStorage: function() {
				console.log('test')
			}
		}
	}
</script>

<style>
	.main-container {
		height: 100%;
		background: #F8F9FB;
	}

	.commodity-container {
		display: flex;
		width: 100%;
		height: 230rpx;
		background: #FFFFFF;
	}

	.commodity-img-container {
		margin: 30rpx;
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
		margin-top: 60rpx;
		margin-bottom: 60rpx;
		width: 520rpx;
	}

	.commodity-title {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		color: #303038;
		font-size: 34rpx;
		font-weight: bold;
	}

	.commodity-price-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
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
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		width: 600rpx;
		display: flex;
		flex-direction: column;
	}

	.address-user-info-container {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
	}

	.address-user-name {
		color: #303038;
		font-size: 30rpx;
	}

	.address-user-account {
		margin-left: 15rpx;
		color: #999999;
		font-size: 30rpx;
	}

	.address-user-address-detail {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		color: #333333;
		font-size: 26rpx;
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

	.remark-container {
		display: flex;
		flex-direction: row;
		margin-top: 15rpx;
		width: 100%;
		height: 115rpx;
		background: #FFFFFF;
		font-size: 30rpx;
	}

	.remark-text {
		flex: 20%;
		margin: auto 10rpx auto 30rpx;
		color: #303038;
	}

	.remark-input {
		flex: 80%;
		font-size: 30rpx;
		text-align: right;
		margin: auto 20rpx auto 0;
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
</style>
