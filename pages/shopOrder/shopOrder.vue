<template>
	<view>
		<view class="QS-tabs-box">
			<QSTabs 
			ref="tabs" 
			:tabs="tabs" 
			animationMode="line3" 
			:current="current" 
			@change="change"
			activeColor="#adadad"
			lineColor="#f1505c"
			swiperWidth="750">
			</QSTabs>
		</view>
		<swiper 
		:style="{'height': '1200rpx'}" 
		:current="swiperCurrent" 
		@transition="transition"
		@animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
				<scroll-view scroll-y style="height: 100%;width: 100%;" >
					<view class="scroll-items">
						<view style="position: relative">
							<view style="background-color: #FFFFFF;height: 250rpx;">
								<image class="pic" src="../../static/withdraw/withdraw.png"></image>
								<text style="font-size: 23rpx;color: #999999;position: relative;top: 28rpx;left: 270rpx;">
									金额共为 （元）
								</text>
								<view style="width: 700rpx;text-align: center;font-weight: bold;font-size: 60rpx;position: relative;top: 40rpx;left: 20rpx;">
								{{total.toFixed(2)}}
								</view>
								
							</view>
							<view style="width: 750rpx;background: #FFFFFF;">
								<view style="border-left: #BE8E39 5rpx solid;margin: 20rpx 0 0 20rpx;padding-left: 20rpx;">订单信息</view>
								<view>
									<view class="theType" v-show="commodityType==1">
										<view class="detail">订单号:<text class="text"> {{orderId}}</text></view>
										<view class="detail">电子码:<text class="text"> {{eleCode}}</text></view>
									</view>
									<view class="theType" v-show="commodityType==2">
										<view class="detail">快递单号:<text class="text"> {{expressId}}</text></view>
										<view class="detail">快递状态:<text class="text"> {{state}}</text></view>
									</view>
									<view class="details">
										<view class="detail">商品名:<text class="text"> {{name}}</text></view>
										<view class="detail">数量 (个):<text class="text"> {{number}}</text></view>
										<view class="detail">支付金额 (元):<text class="text"> {{pay.toFixed(2)}}</text></view>
										<view class="detail">时间:<text class="text"> {{time}}</text></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import QSTabs from '../../components/QS-tabs/QS-tabs.vue';
	const Sys = uni.getSystemInfoSync();
	const wH = Sys.windowHeight;
	let n = 1;
	const tabs = Array(10).fill('').map(()=> 'tab' + Array(n).fill('s').join('') + n++);
	export default {
		components: {
			QSTabs
		},
		data() {
			return {
				commodityType: 2,
				orderId: "45454545454",
				name: "玛蒂蒂",
				expressId:"fsdfa45454545",
				eleCode: "zdsfs454545sdf",
				state: "运送中",
				number: 20,
				total:20,
				pay:200,
				time: "2019-11-12 23:02:12",
				tabs:["全部","未确认","已确认"],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0
			}
		},
		methods: {
			change(index) {
				this.swiperCurrent = index;
			},
			transition({ detail: { dx } }) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({detail: { current }}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	}
</script>

<style scoped>
	page {
		background:rgba(248,249,251,1);
	}
	.pic {
		position: relative;
		top: 40rpx;
		left: 240rpx;
		width: 43rpx;
		height: 43rpx;
	}
	.QS-tabs-box{
		width: 100%;
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: white;
	}

	.scroll-items{
		display: flex;
		flex-direction: column;
		width: 750rpx;
	}
	.scroll-item{
		margin-top: 15rpx;
		padding: 25rpx;
		background-color: white;
		border-radius: 8rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		border: 1px solid #f8f8f8;
	}
	.scroll-item-image-box{
		flex-grow: 0;
	}
	.scroll-item-text-box{
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 28rpx;
		font-weight: bold;
		margin-left: 15rpx;
	}
	.scroll-item-image{
		border-radius: 4rpx;
		width: 180rpx;
		height: 150rpx;
	}
	page {
		background:rgba(248,249,251,1);
	}
	.select_box{
	  position: relative;
	 left: 10rpx;
	 top: 10rpx;
	}
	.select_box .select{
	  width: 300rpx;
	  height: 50rpx;
	  background:rgba(255,255,255,1);
	  border: 1px solid black;
	  border-radius: 20rpx;
	  display: flex;
	  align-items: center;
	  text-align: center;
	}
	.select_box .select .select_text{
	  font-size: 26rpx;
	  color: #333333;
	  line-height: 28rpx;
	  flex: 1;
	}
	.select_box .select .select_img{
	  width: 30rpx;
	  height: 30rpx;
	  display: block;
	  transition:transform 0.3s;
	}
	.select_box .select .select_img_rotate{
	  transform:rotate(180deg); 
	}
	.select_box .option_box{
		z-index: 100;
	  position: absolute;
	  top: 55rpx;
	  width: 200rpx;
	}
	.select_box .option_box .option{
	  display: block;
	   border-radius: 20rpx;
	  text-align: center;
	  color: #999999;
	  width: 300rpx;
	  height: 50rpx;
	  line-height: 50rpx; 
	  font-size: 26rpx;
	  border: 1px solid black;
	}
	.money {
		position: absolute;
		top: 100rpx;
		left: 180rpx;
	}
	.details {
		padding-bottom: 20rpx;
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
	}
	.detail {
		margin-top: 20rpx;
		width: 350rpx;
		font-size: 35rpx;
	}
	.text {
		
		color: #999999;
		margin-left: 15rpx;
		font-size: 25rpx;
	}
	.theType {
		margin-left: 29rpx;
	}
</style>
