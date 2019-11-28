<template>
	<view>
		<view class="orderList" v-for="(item,index) in shopList" :key="index">
			<view class="shopContainer">
				<view class="shopTitle">
				<image class="shopPic" src="../../static/myOrder/shop.png"></image>
				<text class="shopName">{{item.shopName}}</text>
				<text class="status">{{item.status}}</text>
				</view>
				<view class="goodsMessageContainer" >
					<view class="goodsPicContainer">
					<image class="goodsPic" src="../../static/myOrder/shop.png">
					</image>
					</view>
					<view class="goodsMessage">
						
						<text class="goodsName">{{item.goods.goodName}}</text>
						<view style="display: flex;flex-direction: row;margin-top: 40rpx;align-items: center;width: 67.5vw;">
						<text class="actualPrice">{{"￥"+item.goods.actualPrice}}</text>
						<text class="originPrice">{{"￥"+item.goods.originPrice}}</text>
						<text class="number">{{"x"+item.goods.number}}</text>
						</view>
						
					</view>
						
				</view>
				<view class="orderMessage">
					<view class="item">
					<text class="title">订单编号</text>
					<text class="value">{{item.orderID}}</text>
					</view>
					<view class="item">
					<text class="title">下单时间</text>
					<text class="value">{{item.orderTime}}</text>
					</view>
				</view>
				<view class="bottom" >
					<view class="total">
					<text class="actualPrice">{{"合计：￥"+item.goods.actualPrice * item.goods.number}}</text>
					</view>
					<view class="buttonContainer">
					<button class="button buttonDetail"  @click="toDetail(item.orderID)"> 查看详情</button>
					<button class="button buttonCheck" @click="checkQRCode(item.orderID)">查看二维码</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shopList: [
					{
						shopName: '国家航天局',
						status:"商家已发货",
						orderID:123432521,
						orderTime:"2019-11-11",
						goods:
							{
								goodName:'飞机打了卡飞机上的来看房价来看撒谎flash发生了飞机撒来看的撒发快了点设计福利卡时间翻了会计分录卡萨丁解放路',
								actualPrice: 1000111111,
								originPrice:10000,
								number:1,},
							
					},{
						shopName: '国家航天局',
						status:"商家未发货",
						orderID:12421342,
						orderTime:"2019-11-11",
						goods:
							{
								goodName:'飞机',
								actualPrice: 1000,
								originPrice:10000,
								number:1,},
					}
				]
			}
			
		},
		onLoad: function (options) {
		        setTimeout(function () {
		            console.log('start pulldown');
		        }, 1000);
		        uni.startPullDownRefresh();
		    },
		    onPullDownRefresh() {
		        console.log('refresh');
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
		    },
		methods: {
			toDetail(orderID){
				console.log(orderID)
			},
			checkQRCode(orderID){
				console.log(orderID)
			}
		}
	}
</script>

<style>
	.orderList{
		padding-top: 20rpx;
		background-color: #F8F9FB;
		height: 560rpx;
		width: 100%;
		
		}
	.shopContainer{
		position: relative;
		width: 100%;
		font-weight:bold;
		height: 560rpx;
		background-color: #FFFFFF;
	}
	.shopPic{
		padding-top: 36rpx;
		padding-left: 30rpx;
		height: 29rpx;
		width: 30rpx;
		
	}
	.shopName{
		position: absolute;
		padding-top: 40rpx;
		margin-top: -10rpx;
		margin-left: 10rpx;
		font-size:28rpx;
		font-family:PingFang SC;
		color: #303038;
	}
	.status{
		position: absolute;
		right: 2.5vw;
		top: 32rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color: #06C1AE;
	}
	.shopTitle{
		position: relative;
		height: 95rpx;
		
	}
	.goodsMessageContainer{
		display:flex;
		padding-top: 15rpx;
		position: relative;
		width:100%;
		height:182rpx;
		
	}
	.goodsPic{
		position: absolute;
		top: 2.5vw;
		left: 2.5vw;
		height: 15vw;
		width: 15vw;
	}
	.goodsPicContainer{
		position: relative;
		left: 5vw;
		height: 20vw;
		width: 20vw;
		border:1px solid rgba(227,227,227,1);
		border-radius:10px;
	}
	.goodsMessage{
		position: relative;
		left: 5vw;
		width: 67.5vw;
		height: 182rpx;
		margin-left: 30rpx;
	}
	.goodsName{
		height: 60rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp:2;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		line-height:30rpx ;
		width: 67.5vw;
		position: relative;
		top: 30rpx;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(48,48,56,1);
	}
	.actualPrice{
		
		font-size:32rpx;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(255,126,48,1);
	}
	.originPrice{
		margin-left: 2.5vw;
		font-size:26rpx;
		font-family:PingFang SC;
		font-weight:500;
		text-decoration:line-through;
		color:rgba(153,153,153,1);
	}
	.number{
		position: absolute;
		right: 0vw;
		
		font-size: 26rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(153,153,153,1);
	}
	.title{
		margin-left:5vw ;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(48,48,56,1);
	}
	.value{
		margin-left: 12.5vw;
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(153,153,153,1);
	}
	.orderMessage{
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		height: 90rpx;
		border-width: 1px 0 1px 0;
		border-style: solid;
		border-color: #FFF3F3F3;
		
	}
	.item{
		display: flex;
	}
	.bottom{
		text-align: right;
		position: relative;
		height: 180rpx;
		width: 100%;
	}
	.button{
		margin-left: 5vw;
		font-size: 20rpx;
		font-family:PingFang SC;
		color:rgba(153,153,153,1);
		height:60rpx;
		border:1px solid rgba(204,204,204,1);
		border-radius:30rpx;
	}
	.buttonDetail{
		flex: 1;
		border:1px solid rgba(204,204,204,1);
		color:rgba(153,153,153,1);
	}
	.buttonCheck{
		border:1px solid rgba(6,193,174,1);
		color:rgba(6,193,174,1);
	}
	.total{
		margin-top: 2.5vw;
		padding-right: 2.5vw;
	}
	.buttonContainer{
		padding-right: 2.5vw;
		position: absolute;
		right: 0;
		width: 55vw;
		display: flex;
		align-items: flex-end;
		margin-top: 2.5vw;
		
		
	}
</style>
