<template>
	<view class="main-container">
		<!-- 订单状态 -->
		<view class="order-state-container">
			<view class="order-state-text-container">
				<text class="order-state" >{{takeWay === 1? order.deliveryStateShow : order.orderStateShow}}</text>
				<text class="order-state-notice">{{getDeliverNoticeText()}}</text>
			</view>

			<view class="order-state-img-container">
				<image :src="getDeliveryStateImg()" mode="" class="order-state-img"></image>
			</view>
		</view>

		<!-- 物流信息 -->
		<view v-if="takeWay === 1 && hasLogistics" class="commodity-logistics-container" @tap="lookLogistics">
			<image src="/static/orderDetail/ic-logistics.png" mode="" class="commodity-logistics-img"></image>

			<view class="commodity-logistics-text-container">
				<text class="commodity-logistics-text">{{deliveryInfoShow}}</text>
			</view>

			<image src="/static/orderDetail/ic-more-el-code.png" mode="" class="commodity-logistics-more-img"></image>
		</view>

		<!-- 地址信息 -->
		<view v-if="takeWay === 1" class="address-container">
			<image src="/static/orderDetail/ic-address.png" mode="" class="addres-img"></image>

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
				<image src="/static/orderDetail/ic-shop.png" mode="" class="shop-img"></image>

				<text class="shop-name">{{order.shopName}}</text>

				<text class="shop-receive-text" :style="statusStyle">{{takeWay === 1? order.deliveryStateShow : order.orderStateShow}}</text>
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
<!-- 				<view>
					<text class="order-text">商家电话</text>
					<text class="order-value">{{order.shopPhone}}</text>
				</view> -->

				<view class="attr-info-container" v-show="order.attrInfo != null && order.attrInfo != undefined">
					<view class="order-text">
						商品规格
					</view>

					<view class="attr-info">
						{{order.attrInfo}}
					</view>
				</view>

				<view class="attr-info-container">
					<view class="order-text">订单编号</view>
					<view class="order-value">{{order.orderId}}</view>
				</view>

				<view class="attr-info-container">
					<view class="order-text">下单时间</view>
					<view class="order-value">{{order.createAt}}</view>
				</view>

				<view v-if="takeWay === 2" class="attr-info-container">
					<view class="order-text">电子码<text style="color: #FFFFFF;">白</text></view>
					<view class="order-value">{{order.electronicCode}}</view>
				</view>

				<view v-if="takeWay === 2" class="qr-code-container">
					<text class="order-text">二维码</text>
					<image :src="qrImageUrl" mode="" class="qr-code-img"></image>
				</view>
				
				<view v-if="takeWay === 3&&order.electronicCode!=null" class="attr-info-container">
					<view class="order-text">电子码<text style="color: #FFFFFF;">白</text></view>
					<view class="order-value">{{order.electronicCode}}</view>
				</view>
				
				<view v-if="takeWay === 3&&order.qrcode!=null" class="qr-code-container">
					<text class="order-text">二维码</text>
					<a class="qr-code" :href="order.qrcode">{{order.qrcode}}</a>
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
			<!-- 暂时不显示 -->
			<button v-if="false" class="bottom-btn-look-logistics" @click="lookLogistics">
				<text class="bottom-btn-look-logistics-text">查看物流</text>
			</button>

			<button class="bottom-btn-look-logistics" @click="contactShop">
				<text class="bottom-btn-look-logistics-text">联系商家</text>
			</button>

			<button v-if="takeWay === 1" class="bottom-btn-sure-receive" @click="confirmDelivery" :style="{display:order.deliveryState== 2 || order.deliveryState== 0 ? 'none' :'flex'}">
				<text class="bottom-btn-sure-receive-text">{{sureBtnText}}</text>
			</button>
		</view>

		<uni-popup ref="popup" type="center" maskClick="true">
				<view class="phoneCell">
					<text style="font-size: 40rpx; margin-left: 40rpx; font-weight: bold;">拨打电话</text>
				</view>
				<view v-for="(index, item) in phones" :key="index">
					<view class="phoneCell">
						<text class="phoneCell-text" @click="callToShop(item)">{{item}}</text>
					</view>
				</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		OrderDetailAPI
	} from './api.js'
	import qr from '../utils/wxqrcode.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"

	export default {
		data() {
			return {
				orderId: '',
				hasLogistics: false,
				phones: [],
				takeWay: 1, // 1:寄送,2:核销,3:库存
				order: {
					orderId: '',
					createAt: '',
					commodityTitle: '',
					commodityImgList: [],
					commodityNum: '',
					deliveryState: '',
					deliveryStateShow: '',
					actualPrice: '',
					originalPrice: '',
					shopName: '',
					deliveryCompany: '',
					deliveryNum: '',
					commodityType: 2, // 1:寄送,2:核销,3:库存
					orderState: '',
					orderStateShow: '',
					electronicCode: '', // 电子码
					receiver: '',
					contactNumber: '',
					addressDetail: ''
				},
				imageUrl: '',
				totalPrice: '',
				sureBtnText: '确认收货',
				qrImageUrl: '', // 二维码图片
				statusStyle: '', // 订单or发货状态样式
				deliveryInfoShow: '', // 显示在物流信息的文字
			}
		},
		components:{
			'uni-popup':uniPopup
		},
		onLoad: function(params) {
			this.orderId = params.orderid;

			this.getOrderInfo();
		},
		onPullDownRefresh: function() {
			this.getOrderInfo();
		},
		methods: {
			getOrderInfo: function() {
				OrderDetailAPI.getOrderDetail({
					orderId: this.orderId
				}).then(res => {
					this.order = res.data.data;
					console.info(this.order)
					this.phones = this.order.shopPhone.split(",");
					if (this.order.attrInfo != undefined && this.order.attrInfo != null && this.order.attrInfo != '') {
						// 商品属性信息json->string
						let map = JSON.parse(this.order.attrInfo);
						this.order.attrInfo = '';
						for(var key in map) {
							console.log('kkkkkk');
							this.order.attrInfo += map[key] + '，';
						}
						this.order.attrInfo = this.order.attrInfo.slice(0, this.order.attrInfo.length - 1);
					}

					console.log(this.order);
					this.takeWay = Number(this.order.commodityType);
					if (this.takeWay === 2) {
						// 核销类型显示物流信息
						this.hasLogistics = false;
						// 按钮文字显示
						this.sureBtnText = '确认完成';
						// 核销类型的商品生成二维码
						this.getQRCodeImage();
						// 订单状态(核销类型的订单显示)
						switch (Number(this.order.orderState)) {
							case 1:
								this.order.orderStateShow = '待处理';
								this.statusStyle = "color: #06C1AE";
								break;
							case 2:
								this.order.orderStateShow = '已完成';
								break;
							default:
								this.order.orderStateShow = '待处理';
								this.statusStyle = "color: #06C1AE";
								break;
						}
					} else if(this.takeWay === 3){
						if (this.order.electronicCode != undefined && this.order.electronicCode != null && this.order.electronicCode != '') {
							var strs = this.order.electronicCode.split(",");
							console.info(strs);
							
							this.order.electronicCode = "";
							this.order.qrcode = "";
							// 商品属性信息json->string
							for(var i = 0; i < strs.length; i++){
								if(i === 0 && i !== strs.length - 1){
									strs[i] += "}";
								}
								else if(i === strs.length - 1 && i !== 0){
									strs[i] = "{" + strs[i];
								}
								else if(i !== strs.length - 1 && i !== 0){
									strs[i] = "{" + strs[i] + "}";
								}
								console.info(strs[i]);
								let map = JSON.parse(strs[i]);
								console.log(map);
								for(var key in map) {
									console.log(key);
									if(key === "电子码"){
										this.order.electronicCode += map[key] + '\n';
									}
									else if(key === "二维码"){
										this.order.qrcode += map[key] + '\n';
									}
								}
							}	
							if(this.order.electronicCode !== "" && this.order.electronicCode !== null){
								this.order.electronicCode = this.order.electronicCode.slice(0, this.order.electronicCode.length - 1);
							}	
							else{
								this.order.electronicCode = null;
							}
							if(this.order.qrcode !== null && this.order.qrcode !== ""){
								this.order.qrcode = this.order.qrcode.slice(0, this.order.qrcode.length - 1);
							}
							else{
								this.order.qrcode = null;
							}
						}
						
						// 核销类型显示物流信息
						this.hasLogistics = false;
						// 按钮文字显示
						this.sureBtnText = '确认完成';
						// 订单状态(核销类型的订单显示)
						switch (Number(this.order.orderState)) {
							case 1:
								this.order.orderStateShow = '待处理';
								this.statusStyle = "color: #06C1AE";
								break;
							case 2:
								this.order.orderStateShow = '已完成';
								break;
							default:
								this.order.orderStateShow = '待处理';
								this.statusStyle = "color: #06C1AE";
								break;
						}
					}else {
						// 按钮文字显示
						this.sureBtnText = '确认收货';
								this.hasLogistics = true;
						switch (Number(this.order.deliveryState)) {
							case 0:
								this.order.deliveryStateShow = '未发货';
								this.statusStyle = "color: #06C1AE";
								this.getLastDeliveryInfo();
								break;
							case 1:
								this.order.deliveryStateShow = '已发货';
								this.statusStyle = "color: #06C1AE";
								this.getLastDeliveryInfo();
								break;
							case 2:
								this.order.deliveryStateShow = '已收货';
								this.statusStyle = '';
								this.hasLogistics = false;
								break;
							default:
								this.order.deliveryStateShow = '--';
								this.statusStyle = '';
								this.hasLogistics = false;
								break;
						}

					}

					// 总价格
					this.totalPrice = Number(this.order.actualPrice) * Number(this.order.commodityNum);
					// 图片地址
					if (this.order.commodityImgList.length > 0) {
						this.imageUrl = this.order.commodityImgList[0];
					}
					// 格式化下单时间
					// this.order.createAt = this.getFormatDate(this.order.createAt);
					uni.stopPullDownRefresh();
				}).catch(err => {
					uni.showToast({
						title: '获取订单信息失败，刷新试试',
						icon: 'none'
					});
					uni.stopPullDownRefresh();
				});
			},
			lookLogistics: function() {
				uni.navigateTo({
					url: '/pages/orderDetail/deliver?deliveryNum=' + this.order.deliveryNum +
						'&deliveryCompany=' + this.order.deliveryCompany + '&orderId=' + this.orderId
				});
			},
			// 联系商家
			contactShop: function() {
				this.$refs.popup.open();
			},
			callToShop: function(item){
				uni.makePhoneCall({
					// 手机号
					phoneNumber: item,
					success: (res) => {
						console.log('调用成功!')
					},
					fail: (res) => {
						console.log('调用失败!')
						uni.showToast({
							title: '拨号功能失效，\n请联系客服微信：cqrdd2019',
							icon: 'none'
						})
					}
				});
			},
			confirmDelivery: function() {
				if (this.order.commodityType === '1') {
					console.log(this.order.orderId);
					OrderDetailAPI.confirmDelivery({
						orderId: this.order.orderId
					}).then(res => {
						console.log(res.data.data);
						if (res.data.data) {
							uni.showToast({
								title: '确认收货成功',
								icon: 'success'
							});
							// 刷新订单状态
							this.getOrderInfo();
						} else {
							uni.showToast({
								title: '确认收货失败',
								icon: 'none'
							});
						}
					}).catch(err => {
						
						uni.showToast({
							title: '确认收货失败',
							icon: 'none'
						});
					});
				}
			},
			getQRCodeImage: function() {
				// 二维码内容
				let content = this.order.qrcode;
				this.qrImageUrl = qr.createQrCodeImg(content);
			},
			getLastDeliveryInfo: function() {

				if (this.order.deliveryState === 1 || this.order.deliveryState === 2) {
					this.deliveryInfoShow = '查看物流信息';
				} else {
					this.deliveryInfoShow = '暂时没有物流信息';
				}

				// if (this.order.deliveryCompany === null || this.order.deliveryNum === null) {
				// 	this.deliveryInfoShow = '暂时没有物流信息';
				// 	return;
				// }

				// let params = {
				// 	deliveryNum: this.order.deliveryNum,
				// 	deliveryCompany: this.order.deliveryCompany
				// };

				// 测试
				// params.deliveryNum = '75311669293386';
				// params.deliveryCompany = '中通快递';
				// 获取最近一次的物流数据
				
				// OrderDetailAPI.getDeliverInfo(params).then(res => {
				// 	// 要显示的文字
				// 	if (res.data.data) {
				// 		let data = res.data.data.Traces;
				// 		this.deliveryInfoShow = data[data.length - 1].AcceptStation;
				// 	} else {
				// 		this.deliveryInfoShow = '暂时没有物流信息';
				// 	}
				// }).catch(err => {
				// 	this.deliveryInfoShow = '暂时没有物流信息';
				// });
			},
			getDeliverNoticeText: function() {
				if (this.takeWay === 1) {
					if (this.order.deliveryState ===1) {
						return '您的快递正在路上，请耐心等候发货';
					} else if (this.order.deliveryState === 2) {
						return '您的快递已签收，感谢您的使用';
					} else {
						return '您的快递正在打包，请耐心等候发货';
					}
				} else {
					if (this.order.orderState === 2) {
						return '您的订单已完成，感谢您的使用';
					} else { // 完成
						return '您的订单待处理，感谢您的使用';
					}
				}
			},
			getDeliveryStateImg: function() {
				if (this.takeWay === 1) {
					if (this.order.deliveryState === 1) {
						return '/static/orderDetail/ic-shipped.png';
					} else if (this.order.deliveryState === 2) {
						return '/static/orderDetail/ic-received.png';
					} else {
						return '/static/orderDetail/ic-no-shipped.png';
					}
				} else {
					if (this.order.orderState === 2) {
						return '/static/orderDetail/ic-el-complete.png';
					} else { // 完成
						return '/static/orderDetail/ic-el-pending.png';
					}
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
		width: 100%;
		height: 100vh;
		background: #F8F9FB;
	}

	.order-state-container {
		display: flex;
		justify-content: space-between;
		background: #06C1AE;
		width: 100%;
		height: 220rpx;
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
		font-size: 32rpx;
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
		height: 145rpx;
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
		padding-right: 20rpx;
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
		margin-top: 20rpx;
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
		margin-top: 20rpx;
		padding-bottom: 98rpx;
		display: flex;
		flex-direction: column;
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
		flex: 70%;
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
		height: 220rpx;
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

	.attr-info-container {
		display: flex;
		flex-direction: row;
	}

	.attr-info {
		max-width: 590rpx;
		color: #999999;
		font-size: 26rpx;
		word-break: break-all;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		margin-right: 30rpx;
	}

	.order-text {
		color: #303038;
		min-width: 200rpx;
		font-size: 26rpx;
		margin: 10rpx 0 10rpx 30rpx;
	}

	.order-value {
		color: #999999;
		font-size: 26rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		margin-right: 30rpx;
	}

	.qr-code-container {
		display: flex;
		flex-direction: column;
	}

	.qr-code-img {
		margin: 10rpx 220rpx 0 230rpx;
		width: 300rpx;
		height: 300rpx;
	}
	
	.qr-code {
		margin: -40rpx 220rpx 0 230rpx;
		width: 300rpx;
		height: 300rpx;
		color: #999999;
		font-size: 20rpx;
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
		background: 'rgba(0,0,0,0)';
		display: flex;
		justify-content: center;
		border-radius: 50rpx;
		border: #999999 2rpx solid;
		margin: auto 30rpx auto 0;
		width: 180rpx;
		height: 60rpx;
	}

	.bottom-btn-look-logistics-text {
		color: #999999;
		font-size: 24rpx;
		margin: auto;
	}

	.bottom-btn-sure-receive {
		background: 'rgba(0,0,0,0)';
		/* display: flex; */
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
	.phoneCell{
		display:flex;
		align-items: center;
		width: 580rpx;
		height: 100rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	.phoneCell-text{
		margin-left: 40rpx;
		font-weight: lighter;
	}
</style>
