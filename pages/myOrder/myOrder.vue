<template>
	<view v-bind:style="noDataCenter">
		<view v-if="isNodata" class="nodataText">
		
		<image src="../../static/myOrder/myOrderNoData.png" class="noDataPic"></image>
		<text class="nodataText smallFontSize" >暂无订单</text>
		
		</view>
		<view v-if="!isNodata" class="orderList" v-for="(item,index) in shopList" :key="index">
			<view class="shopContainer normalFontWeight">
				<view class="shopTitle boldFontWeight">
					<view style="display: flex;align-items: center;margin-left: 5vw;">
					<image class="shopPic" src="../../static/myOrder/shop.png"></image>
					<text class="shopName normalFontDark bigFontSize">{{item.shopName}}</text>
					</view>
					<text class="status smallFontSize" v-bind:style="statusStyle[index]">{{judgeOrderState(index)}}</text>
				</view>
				<view class="goodsMessageContainer">
					<view class="goodsPicContainer">
						<image class="goodsPic" :src="item.commodityImgList[0]">
						</image>
					</view>
					<!-- 商品信息 -->
					<view class="goodsMessage">
											
						<text class="goodsName normalFontDark bigFontSize">{{item.commodityTitle}}</text>
						<view style="display: flex;flex-direction: row;margin-top: 40rpx;align-items: center;width: 67.5vw;">
							<text class="actualPrice boldFontWeight largeFontSize">{{"￥"+item.actualPrice}}</text>
							<text class="originPrice normalGray midalFontSize">{{"￥"+item.originalPrice}}</text>
							<text class="number normalGray midalFontSize">{{"x"+item.commodityNum}}</text>
						</view>

					</view>

				</view>
				<!-- 订单信息 -->
				<view class="orderMessage">
					<view class="item">
						<text class="title normalFontDark smallFontSize">订单编号</text>
						<text class="value normalGray smallFontSize">{{item.orderId}}</text>
					</view>
					<view class="item">
						<text class="title normalFontDark smallFontSize">下单时间</text>
						<text class="value normalGray smallFontSize">{{item.createAt|formatDate}}</text>
					</view>
				</view>
				<!-- 底部 -->
				<view class="bottom">
					<view class="totalText bigFontSize">
						<text>合计：</text>
						<text class="totalPrice boldFontWeight">{{"￥"+item.actualPrice * item.commodityNum}}</text>
					</view>

					<button class="button  normalGray smallFontSize" @click="toDetail(item.orderId)"> 查看详情</button>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from './api.js'
	export default {
		data() {
			return {
				
				isNodata: false,
				statusStyle: [],

				shopList: []
			}

		},
		// 时间转换
		filters: {
			formatDate: function(value) {
				let date = new Date(value);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + " " + h + ':' + m + ":" + s ;
			}
		},

		computed: {
			noDataCenter() {
				if (this.isNodata) {
					return "text-align:center"
				}

			}
		},

		methods: {
			// 跳转到详情
			toDetail: function(orderID) {
				console.log(orderID);
				
				uni.navigateTo({
					url: '/pages/orderDetail/orderDetail?orderid=' + orderID
				})
			},

			// 判断邮寄状态
			judgeOrderState: function(index) {
				if (this.shopList.length == 0) {
					return ""
				}
				let item = this.shopList[index]

				if (item.commodityType == "1") {
					if (item.deliveryState == 0) {
						this.statusStyle[index] = "color:#06C1AE;"
						return "未发货"
					} else if (item.deliveryState == 1) {
						this.statusStyle[index] = "color:#06C1AE;"
						return "卖家已发货"
					} else if (item.deliveryState == 2) {
						this.statusStyle = "color:#CCCCCC"
						return "已签收"
					} else
						this.statusStyle[index] = "#CCCCCC"
					return "暂无信息"
				} else {
					if (item.orderState == 0) {
						this.statusStyle[index] = "color:#CCCCCC"
						
						return "订单已完成"

					} else {
						this.statusStyle[index] = "color:#06C1AE;"
						return "订单未完成"
					}
				}


			},
			// 加载数据
			getData: function() {
				api.getComidityList().then(res => {

					if (res.statusCode == "200") {
						this.shopList = res.data.data
						this.isNodata = this.shopList.length == 0
						uni.stopPullDownRefresh()
					} else {
						this.isNodata = true
						uni.stopPullDownRefresh()
						
					}
				}).catch(() => {
					uni.showModal({
						title: "出错啦！",
						content: '刷新失败',
						showCancel: false
					});
					if (this.shopList.length == 0){
						this.isNodata = true
					}
					uni.stopPullDownRefresh()
				})
			},
		},

		onShow: function(options) {

			uni.startPullDownRefresh({
				success: function(res) {
					console.log("刷新成功"); //success 返回参数说明
				},
				fail: function(res) {
					console.log("刷新失败")
				}
			});
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.getData()
		},
	}
</script>

<style>
	.smallFontSize {
		font-size: 24rpx;
	}

	.midalFontSize {
		font-size: 26rpx;
	}

	.bigFontSize {
		font-size: 28rpx;
	}

	.largeFontSize {
		font-size: 32rpx;
	}

	.normalFontDark {
		color: #303038;
	}

	.deepFontDark {
		color: #333333;
	}

	.normalFontWeight {
		font-weight: 400;
	}

	.boldFontWeight {
		font-weight: 500;
	}

	.normalGray {
		color: #999999;
	}

	.orderList {
		padding-top: 20rpx;
		background-color: #F8F9FB;
		height: 500rpx;
		width: 100%;

	}

	.shopContainer {
		font-family:  ;
		position: relative;
		width: 100%;
		height: 500rpx;
		background-color: #FFFFFF;
	}

	.shopPic {
		margin-right: 15rpx;
		height: 29rpx;
		width: 30rpx;

	}

	

	.status {
		margin-right: 5vw;
	}

	.shopTitle {
		justify-content: space-between;
		display: flex;
		align-items: center;
		position: relative;
		height: 95rpx;
	}

	.goodsMessageContainer {
		display: flex;
		padding-top: 15rpx;
		position: relative;
		width: 100%;
		height: 182rpx;
	}

	.goodsPic {
		height: 20vw;
		width: 20vw;
		border: 1px solid rgba(227, 227, 227, 1);
		border-radius: 10px;
	}

	.goodsPicContainer {
		position: relative;
		left: 5vw;
		height: 20vw;
		width: 20vw;
	}

	.goodsMessage {
		position: relative;
		left: 5vw;
		width: 65vw;
		height: 182rpx;
		margin-left: 30rpx;
	}

	.goodsName {
		height: 60rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		line-height: 30rpx;
		width: 67.5vw;
		position: relative;
		top: 30rpx;
	}

	.actualPrice {
		color: rgba(255, 126, 48, 1);
	}

	.originPrice {
		margin-left: 2.5vw;
		text-decoration: line-through;
	}

	.number {
		position: absolute;
		right: 0vw;
	}

	.title {
		margin-left: 5vw;
	}

	.value {
		margin-left: 12.5vw;
	}

	.orderMessage {
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		height: 90rpx;
		border-width: 1px 0 1px 0;
		border-style: solid;
		border-color: rgba(243, 243, 243, 1);

	}

	.item {
		display: flex;
	}

	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: relative;
		left: 5vw;
		
		height: 100rpx;
		width: 90vw;
	}

	.button {
		height: 60rpx;
		width: 160rpx;
		border: 1rpx solid rgba(204, 204, 204, 1);
		border-radius: 30rpx;
	}

	.totalText {
		flex: 1;
		display: block;
	}

	.totalPrice {
		color: #FF7E30;
	}

	.noDataPic {
		width: 200rpx;	
		height: 200rpx;	
		padding-top: 20vh;
	}
	.nodataText{
		margin-top: 20rpx;
		display: flex;	
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #CCCCCC;
	}
</style>
