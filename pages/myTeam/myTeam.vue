<template>
	<view>
		
		<view class="recomendView" v-show="showRecomend">
			<view style="display: flex;align-items: center;">
				<image :src="recomend.avatarUrl" style="margin-left: 60rpx;width: 90rpx;height: 90rpx;border-radius: 10rpx;"></image>
				<view class="name">{{recomend.userName}}</view>
			</view>
			<view class="recomendTag">我的推荐人</view>
		</view>
		<view v-show="showType">
			<noPic :picSrc="picSrc" :noText="noText"></noPic>
		</view>
		<view class="list"  v-for="(item, index) in team" :key="index" v-show="!showType">
			<view style="width: 500rpx;height: 186rpx;position: relative; margin-left: 20rpx;">
				<image :src="item.avatarUrl" class="img"></image>
				<view class="userName">{{item.userName | ellipsis}}</view>
				<view class="createAt">{{item.createAt}}</view>
			</view>
			<text class="remark">累积收益:</text>
			<text class="amount">{{item.amount}}</text>
		</view>
	</view>
</template>

<script>
	import {api} from './api.js'
	import noPic from '../components/noPic/noPic.vue'
	export default {
		components: {
			noPic
		},
		filters: {
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 7) {
					return value.slice(0, 7) + '...'
				}
				return value
			}
		},
		data() {
			return {
				recomend:{

				},
				user:{
					userName:'',
					photo:''
				},
				picSrc: "../../../static/teamNo.png",
				noText:"暂无好友",
				showType:true,
				showRecomend: false,
				team:[],
				}
			},
			
		onLoad(option) {
			this.wxGetUserInfo();
			if (option.type == 3) {
				this.showTypeText = "暂无收益";
				let title = '分享下单收益';
				uni.setNavigationBarTitle({
					title
				})
			} else {
				this.getRecomend();
			}
			this.getTeam();
		},

		methods: {
			getTeam() {
				api.getList().then(res => {
					this.team = res.data.data;
					if (this.team.length == 0) {
						this.showType = true;
						return;
					} else {
						this.showType = false;
					}

					this.team.forEach(item => {
						if (item.amount == null) {
							item.amount = '0.00'
						}
					});
				}).catch(err => {
					console.log(err)
				})
			},
			getRecomend() {
				api.getRecomend().then(res => {
					console.log('我的推荐人');
					console.log(res);
					if (res.data.data != null) {
						this.recomend = res.data.data;
						this.showRecomend = true;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取登录信息
			wxGetUserInfo() {
				console.log('...授权...')
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.user.userName = infoRes.userInfo.nickName; //昵称
						_this.user.photo = infoRes.userInfo.avatarUrl; //头像
					},
					fail(res) {
						uni.showModal({
							content: '失败了',
							showCancel: true
						});
					}
				});
			},
		},
		}
	
</script>

<style>
	page {
		padding-bottom: 50rpx;
		background: rgba(248, 249, 251, 1);
	}

	.list {
		margin-top: 3rpx;
		width: 750rpx;
		height: 186rpx;
		background: rgba(255, 255, 255, 1);
	}

	.img {
		border-radius: 10rpx;
		position: absolute;
		top: 45rpx;
		left: 40rpx;
		width: 90rpx;
		height: 90rpx;
	}
	.name{
		margin-left: 10rpx;
		width: 320rpx;
		letter-spacing: 3rpx;
		font-size: 30rpx;
		color: #333333;
	}
	
	.remark{
		
		float: right;
		margin: -110rpx 150rpx 0 0;
		font-size: 24rpx;
	}
	.amount {
		float: right;
		margin: -113rpx 40rpx 0 0;
		font-size: 32rpx;
		color: rgba(6,193,174,1);
		font-weight: bold;
	}
	
	.createAt {
		width: 320rpx;
		position: relative;
		top: 100rpx;
		left: 140rpx;
		font-size: 24rpx;
		color: #CCCCCC;
	}
	
	.userName {
		width: 320rpx;
		letter-spacing: 3rpx;
		font-size: 30rpx;
		color: #333333;
		position: absolute;
		top: 40rpx;
		left: 140rpx;
	}

	.noIncome {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #CCCCCC;
	}

	.recomendTag {
		margin-right: 30rpx;
		color: #FDBE3D;
		border: 1rpx solid #FDBE3D;
		width: 200rpx;
		border-radius: 15rpx;
		font-size: 28rpx;
		text-align: center;
	}

	.recomendView {

		width: 100vw;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
