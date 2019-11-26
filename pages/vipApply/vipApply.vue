<template>
    <view>
        <view v-if="isCanUse">
			<view class='header'>
				<view class="vipApplyLogo">
					<image src='../../static/会员卡片.png'></image>
					<text class="text1">囧途宝盒会员</text>
					<text class="text2">免费申请啦！</text>
					<text class="text3">名额有限！时间有限！快快报名申请吧！！</text>
				</view>
				<view class="exclusive">专属权益</view>
				<view class="legalRight">
					<view class="recommend">
						<image src="../../static/ic-返佣.png"></image>
						<view class="referee">推荐人返佣</view>
					</view>
					<!-- <view class="vip">
						<image src="../../static/ic-会员价购买.png"></image>
						<view class="VIPprice">会员价购买</view>
					</view> -->
				</view>
			</view>
			<view class='applyInformation'>
				<text>姓名</text>
				<input placeholder="请输入姓名" class="inputName" v-model="applyInformation.name"/>
			</view>
			<view class='applyInformation'>
				<text>联系电话</text>
				<input placeholder="请输入电话号码" class="inputPhoneAndRemarks" v-model="applyInformation.phone"/>
			</view>
			<view class='applyInformation'>
				<text>备注</text>
				<input placeholder="请输入备注信息" class="inputPhoneAndRemarks" v-model="applyInformation.remarks"/>
			</view>
			<button @click ="recommend">立即申请</button>
        </view>
    </view>
</template> 

<script>
	import {api} from	'./api.js'
    export default {
        data() {
            return {
                isCanUse: uni.getStorageSync('isCanUse')||true,//默认为true,
				applyInformation:{
					name:'',
					phone:'',
					remarks:''
				}
            };
        },
        methods: {
            recommend:function(options){
				
				console.log(this.applyInformation.name);
				// wx.navigateTo({
				//   url: '../index/index?id=1',
				//   events: {
				//     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
				//     acceptDataFromOpenedPage: function(data) {
				//       console.log(data)
				//     },
				//     someEvent: function(data) {
				//       console.log(data)
				//     }
				    
				//   },
				//   success: function(res) {
				//     // 通过eventChannel向被打开页面传送数据
				//     console.log("success");
				//   }
				// })
			}
        },
    }
</script>

<style>
	page{
		background: #F8F9FB;
	}
    .header {
        margin: 0 auto;
		margin-bottom: 20rpx;
		padding: 31rpx 10rpx 0 11rpx;
        width: 750rpx;
        height: 579rpx;
        line-height: 450rpx;
		background-color: #FFFFFF;
    }

    .header .vipApplyLogo {
        width: 729rpx;
        height: 359rpx;
		position: relative;
    }
	
	.vipApplyLogo image{
		width: 729rpx;
		height: 359rpx;
		margin-bottom: 50rpx;
	}
	
	.vipApplyLogo .text1{
		font-weight: Bold;
		font-size: 36rpx;
		position: absolute;
		color: #7E5611;
		top: -110rpx;
		left: 73rpx;
	}
	
	.vipApplyLogo .text2{
		font-weight: Medium;
		font-size: 28rpx;
		color: #7E5611;
		position: absolute;
		top: -50rpx;
		left: 73rpx;
	}
	
	.vipApplyLogo .text3{
		font-weight: Medium;
		font-size: 24rpx;
		color: #BE8E39;
		position: absolute;
		top: 60rpx;
		left: 73rpx;
	}
	
	.exclusive{
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin: -180rpx 0 0 31rpx;
	}
	
	.legalRight{
		width: 729rpx;
		height: 160rpx;
	}
	
	.legalRight image{
		width: 90rpx;
		height: 90rpx;
	}
	
	.legalRight .recommend{
		margin: -320rpx 0 0 31rpx;
	}
	
	.recommend .referee{
		margin: -485rpx 0 0 110rpx;
		font-size: 30rpx;
	}
	
	.legalRight .vip{
		margin: -420rpx 0 0 401rpx;
	}
	
	.vip .VIPprice{
		margin: -485rpx 0 0 110rpx;
		font-size: 30rpx;
	}

    .applyInformation {
		background: #FFFFFF;
        width: 729rpx;
		height: 60rpx;
		padding: 25rpx;
		margin-top: 2rpx;
    }
	
	.applyInformation text {
		margin-top: 20rpx;
	    display: block;
	    color: #303038;
	    margin-left: 10rpx;
		font-size: 30rpx;
	}
	
	.applyInformation .inputName{
		margin-left: 530rpx;
		margin-top: -40rpx;
		font-size: 30rpx;
		color: #CCCCCC;
		text-align: center;
	}
	
	.applyInformation .inputPhoneAndRemarks{
		margin-left: 470rpx;
		margin-top: -40rpx;
		font-size: 30rpx;
		color: #CCCCCC;
		text-align: center;
	}

    button {
        border-radius: 80rpx;
        margin: 140rpx 40rpx 0 40rpx;
        font-size: 35rpx;
		background-color: #313134;
		color: #FFFFFF;
    }
</style>