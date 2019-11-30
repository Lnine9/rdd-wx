<template>
	<view class="main-container">
		<!-- 订单状态 -->
		<view
			v-if="order.deliveryState === 2"
			class="order-state-container">
			<view class="order-state-text-container">
				<text class="order-state">已签收</text>
				<text class="order-state-notice">您的订单已签收，感谢您的使用</text>
			</view>

			<view class="order-state-img-container">
				<image src="../../static/orderDetail/ic-已签收.png" mode="" class="order-state-img"></image>
			</view>
		</view>

		<!-- 物流信息 -->
		<view v-if="takeWay === 1 && hasLogistics" class="commodity-logistics-container">
			<image src="../../static/orderDetail/ic-物流.png" mode="" class="commodity-logistics-img"></image>

			<view class="commodity-logistics-text-container">
				<text class="commodity-logistics-text">快件从【江苏昆山公司】发往【上海航空】</text>
			</view>

			<image src="../../static/orderDetail/ic-更多电子码.png" mode="" class="commodity-logistics-more-img"></image>
		</view>

		<!-- 地址信息 -->
		<view v-if="takeWay === 1" class="address-container">
			<image src="../../static/orderDetail/ic-地址.png" mode="" class="addres-img"></image>

			<view class="address-content-container">
				<view class="address-user-info-container">
					<text class="address-user-name">
						{{order.receiver}}
					</text>

					<text class="address-user-account">
						{{order.contactNumber}}
					</text>
				</view>

				<view class="address-user-address-detail">
					{{order.addressDetail}}
				</view>
			</view>

		</view>

		<!-- 商品信息 -->
		<view class="commodity-container">
			<view class="shop-container">
				<image src="../../static/orderDetail/ic-店铺.png" mode="" class="shop-img"></image>

				<text class="shop-name">{{order.shopName}}</text>

				<text class="shop-receive-text">{{order.deliveryStateShow}}</text>
			</view>

			<!-- 商品展示 -->
			<view class="commodity-inner-container">
				<view class="commodity-img-container">
					<image :src="imageUrl" mode="" class="commodity-img"></image>
				</view>

				<view class="commodity-content-container">
					<!-- 商品名 -->
					<text class="commodity-title">
						{{order.commodityTitle}}
					</text>

					<!-- 价格展示 与 数量 -->
					<view class="commodity-price-container">
						<text class="commodity-actual-price">
							￥{{order.actualPrice}}
						</text>

						<text class="commodity-primary-price">
							￥{{order.originalPrice}}
						</text>

						<text class="commodity-num">
							x{{order.commodityNum}}
						</text>
					</view>
				</view>
			</view>

			<view class="commodity-line"></view>

			<!-- 订单信息 -->
			<view class="order-info-container">
				<view>
					<text class="order-text">订单编号</text>
					<text class="order-value">{{order.orderId}}</text>
				</view>

				<view>
					<text class="order-text">下单时间</text>
					<text class="order-value">{{order.createAt}}</text>
				</view>
			</view>

			<view class="bottom-price-container">
				<text class="total-commodity-num">
					共{{order.commodityNum}}件商品
				</text>
				<text class="total-commodity-text">合计：</text>
				<text class="total-commodity-price">
					￥{{totalPrice}}
				</text>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-btn-container">
			<button 
				v-if="this.order.commodityType === '1'"
				class="bottom-btn-look-logistics">
				<text class="bottom-btn-look-logistics-text" @click="lookLogistics">查看物流</text>
			</button>

			<button class="bottom-btn-sure-receive" @click="confirmDelivery">
				<text class="bottom-btn-sure-receive-text">{{sureBtnText}}</text>
			</button>
		</view>

	</view>
</template>

<script>
	import {
		OrderDetailAPI
	} from './api.js'

	export default {
		data() {
			return {
				orderId: '',
				hasLogistics: false,
				takeWay: 1, // 1,寄送，2,核销
				order: {
					orderId: '',
					createAt: '',
					commodityTitle: '',
					commodityImgList: [],
					commodityNum: '',
					deliveryState: '',
					deliveryStateShow: '',
					actualPrice: '',
					shopName: '',
					deliveryCompany: '',
					deliveryNum: '',
					commodityType: 2, // 1，寄送，2，核销
				},
				imageUrl: '',
				totalPrice: '',
				sureBtnText: '确认收货'
			}
		},
		methods: {
			onLoad: function(params) {
				console.log(params);
				this.orderId = params.orderId;

				this.orderId = '8';
				this.getOrderInfo();
			},
			getOrderInfo: function() {
				OrderDetailAPI.getOrderDetail({
					orderId: this.orderId
				}).then(res => {
					console.log(res);

					this.order = res.data.data;
					switch (Number(this.order.deliveryState)) {
						case 0:
							this.order.deliveryStateShow = '未寄送';
							break;
						case 1:
							this.order.deliveryStateShow = '未寄送';
							break;
						case 0:
							this.order.deliveryStateShow = '已收货';
							break;
					}
					// 总价格
					this.totalPrice = Number(this.order.actualPrice) * Number(this.order.commodityNum);
					// 图片地址
					if (this.order.commodityImgList.length > 0) {
						this.imageUrl = this.order.commodityImgList[0];
					}
					// 格式化下单时间
					this.order.createAt = this.getFormatDate(this.order.createAt);
					// 按钮文字显示问题
					if (this.order.commodityType === '1') {
						this.sureBtnText = '确认收货';
					} else {
						this.sureBtnText = '确认完成';
					}
					
				}).catch(err => {
					console.log(err);
				});
			},
			lookLogistics: function() {
				// todo 查看物流
			},
			confirmDelivery: function() {
				if (this.order.commodityType === 1) {
					OrderDetailAPI.confirmDelivery({orderId: this.order.orderId}).then(res => {
						console.log(res);
						if (res.data.data) {
							uni.showToast({
								title: '确认收货成功',
							});
							this.getOrderInfo();
						} else {
							uni.showModal({
								title: '提示',
								content: '确认收货失败',
								showCancel: false
							});
						}
					}).catch(err => {
						console.log(err);
						uni.showModal({
							title: '提示',
							content: '确认收货失败',
							showCancel: false
						});
					});
				} else {
					// todo
				}
			},
			getFormatDate: function(str) {
				let oDate = new Date(str);
				let oYear = oDate.getFullYear();
				let oMonth = oDate.getMonth() + 1;
				let oDay = oDate.getDate();

				let oHour = oDate.getHours();
				let oMin = oDate.getMinutes();
				let oSec = oDate.getSeconds();
				return oYear +
					'-' + (oMonth.toString().length === 1 ? '0' + oMonth : oMonth) +
					'-' + (oDay.toString().length === 1 ? '0' + oDay : oDay) +
					' ' + (oHour.toString().length === 1 ? '0' + oHour : oHour) +
					':' + (oMin.toString().length === 1 ? '0' + oMin : oMin) +
					':' + (oSec.toString().length === 1 ? '0' + oSec : oSec);
			},
		}
	}
</script>

<style>
	.main-container {
		background: #F8F9FB;
	}

	.order-state-container {
		display: flex;
		justify-content: space-between;
		background: #06C1AE;
		width: 100%;
		height: 200rpx;
	}

	.order-state-text-container {
		margin: auto 0 auto 0;
		display: flex;
		flex-direction: column;
		margin-left: 73rpx;
		color: #FFFFFF;
	}

	.order-state {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		font-size: 30rpx;
		font-weight: bold;
	}

	.order-state-notice {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}

	.order-state-img-container {
		/* 	display: flex;
		justify-content: center;
		flex-direction: column; */
	}

	.order-state-img {
		width: 154rpx;
		height: 126rpx;
		margin-right: 85rpx;
		margin-top: 43rpx;
	}

	.commodity-logistics-container {
		display: flex;
		flex-direction: row;
		margin-top: 20rpx;
		width: 100%;
		height: 106rpx;
		background: #FFFFFF;
	}


	.commodity-logistics-img {
		width: 62rpx;
		height: 62rpx;
		margin: auto 0 auto 40rpx;
	}

	.commodity-logistics-text-container {
		flex: 80%;
		margin: auto 0 auto 37rpx;
	}

	.commodity-logistics-text {
		font-size: 28rpx;
		color: #333333;
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.commodity-logistics-more-img {
		width: 13rpx;
		height: 26rpx;
		margin: auto 21rpx auto 0;
	}

	.address-container {
		margin-top: 15rpx;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 180rpx;
		background: #FFFFFF;
	}

	.addres-img {
		width: 62rpx;
		height: 62rpx;
		margin: auto 0 auto 40rpx;
	}

	.address-content-container {
		display: flex;
		margin: auto 0 auto 37rpx;
		padding-right: 21rpx;
		flex: 80%;
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
		-webkit-line-clamp: 1;
	}

	.commodity-container {
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
		background: #FFFFFF;
	}

	.shop-container {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
	}

	.shop-img {
		margin: 30rpx 16rpx 30rpx 30rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.shop-name {
		flex: 80%;
		font-size: 28rpx;
		font-weight: bold;
		margin: auto 0;
	}

	.shop-receive-text {
		width: 100rpx;
		text-align: right;
		font-size: 24rpx;
		color: #CCCCCC;
		margin: auto 30rpx auto 0;
	}

	.commodity-inner-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 200rpx;
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

	.commodity-line {
		background: #F3F3F3;
		height: 2rpx;
		width: 690rpx;
		margin: 30rpx 30rpx 20rpx 30rpx;
	}

	.order-info-container {
		display: flex;
		flex-direction: column;
	}

	.order-text {
		color: #303038;
		font-size: 24rpx;
		margin: 10rpx 0 10rpx 30rpx;
	}

	.order-value {
		color: #999999;
		font-size: 24rpx;
		margin: 10rpx 0 10rpx 93rpx;
	}

	.bottom-price-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 30rpx;
		margin-bottom: 40rpx;
	}

	.total-commodity-num {
		color: #303038;
		font-size: 24rpx;
		margin: auto 23rpx auto 0;
	}

	.total-commodity-text {
		color: #333333;
		font-size: 28rpx;
		margin: auto 0;
	}

	.total-commodity-price {
		color: #FF7E30;
		font-size: 28rpx;
		margin: auto 20rpx auto 0;
		font-weight: bold;
	}

	.bottom-btn-container {
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 98rpx;
		display: flex;
		justify-content: flex-end;
		flex-direction: row;
	}

	.bottom-btn-look-logistics {
		display: flex;
		justify-content: center;
		border-radius: 50rpx;
		border: #999999 2rpx solid;
		margin: auto 30rpx auto 0;
		width: 160rpx;
		height: 60rpx;
	}

	.bottom-btn-look-logistics-text {
		color: #999999;
		font-size: 24rpx;
		margin: auto;
	}

	.bottom-btn-sure-receive {
		display: flex;
		justify-content: center;
		border-radius: 50rpx;
		border: #06C1AE 2rpx solid;
		margin: auto 30rpx auto 0;
		width: 160rpx;
		height: 60rpx;
	}

	.bottom-btn-sure-receive-text {
		color: #06C1AE;
		font-size: 24rpx;
		margin: auto;
	}
</style>
