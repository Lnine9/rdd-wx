<template>
	<view style="position: relative">
		
		<view style="background-color: #FFFFFF;height: 250rpx;">
			<view class='select_box'>
			    <view class='select' @click='selectTap'>
			        <text class='select_text'>请选择订单类型 ▼</text>
			    </view>
			    <view class='option_box' style='height: 200rpx;width: 200rpx;' v-show="selectShow">
			        <text class='option' v-for='(item, index) in selectData' :key='index' @click='optionTap(index)'>{{item}}</text>
			    </view>
			</view>
			
			<view class="money">
				<text style="color: #999999;font-size: 30rpx;">金额共为 (元)  
				<text style="font-size: 60rpx;margin-left: 20rpx;color: #333333;font-weight: bold;">{{total.toFixed(2)}}</text></text>
			</view>
			
		</view>
		<view style="width: 750rpx;position: absolute;top: 300rpx;background: #FFFFFF;">
			<view style="border-left: #BE8E39 5rpx solid;margin: 20rpx 0 0 20rpx;padding-left: 5rpx;">订单信息</view>
			<view class="details">
				<view class="detail">订单号:<text class="text"> {{orderId}}</text></view>
				<view class="detail">快递单号:<text class="text"> {{expressId}}</text></view>
				<view class="detail">电子码:<text class="text"> {{expressId}}</text></view>
				<view class="detail">快递状态:<text class="text"> {{state}}</text></view>
				<view class="detail">商品名:<text class="text"> {{name}}</text></view>
				<view class="detail">数量 (个):<text class="text"> {{number}}</text></view>
				<view class="detail">支付金额 (元):<text class="text"> {{pay.toFixed(2)}}</text></view>
				<view class="detail">时间:<text class="text"> {{time}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		  data() {
			  return {
				  orderId: "45454545454",
				  name: "玛蒂蒂",
				  expressId:"fsdfa45454545",
				  eleCode: "zdsfs454545sdf",
				  state: "运送中",
				  number: 20,
				  total:20,
				  pay:200,
				  time: "2019-11-12 23:02:12",
				  selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
				  selectData: ['未结算','已结算','全部'],//下拉列表的数据
				  indexs: 0,//选择的下拉列表下标
			  }
		    
		  },
		  methods: {
			// 点击下拉显示框
			selectTap() {
			    this.selectShow = !this.selectShow
			 
			},
			// 点击下拉列表
			optionTap(e) {
			  // let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
			  this.indexs = this.index;
			  this.selectShow = !this.selectShow;
			  console.log(e)
			}  
		  }
		
	}
</script>

<style>
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
</style>
