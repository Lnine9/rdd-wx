<template>
	<view>
		
		<view style="width: 500rpx;height: 150rpx; position: relative">
			<image :src="user.photo" class="img"></image>
			<view class="name">{{user.userName}}</view>
		</view>
		<view v-show="showType">
			<image src="../../static/teamNo.png" class="noImg"></image>
			<text class="noIncome">暂无下级</text>
		</view>
		<view class="list" v-if="item.amount!=0" v-for="(item, index) in team" :key="index" v-show="!showType">
			<view style="width: 500rpx;height: 186rpx;position: relative">
				<image :src="item.photo" class="img"></image>
				<view class="userName">{{item.userName}}</view>
				<view class="createAt">{{item.createAt}}</view>
			</view>
			<text class="remark">累积收益:</text>
			<text class="amount">{{item.amount}}</text>
		</view>
	</view>
</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				user:{
					userName:'马杰',
					photo:''
				},
				showType:false,
				team:[],
				}
			},
			onLoad() {
				this.wxGetUserInfo();
				this.getTeam();
				if(this.team.length==0){
					this.showType=true;
				}else{
					this.showType=false;
				}
				
			},
			methods:{
				getTeam(){
					api.getList({
						userId:this.user.userId
					}).then(res =>{
						this.team=res.data.data;
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
			}
		}
</script>

<style>
	page {
		padding-bottom: 50rpx;
		background:rgba(248,249,251,1);
	}
	.noImg {
		width: 200rpx;
		height: 200rpx;
		margin: 370rpx 0 0 270rpx;
	}
	
	.list {
		margin-top: 3rpx;
		width: 750rpx;
		height: 186rpx;
		background: rgba(255, 255, 255, 1);
	}
	
	.img {
		position: absolute;
		top: 45rpx;
		left: 40rpx;
		width: 90rpx;
		height: 90rpx;
	}
	.name{
		width: 320rpx;
		letter-spacing: 3rpx;
		font-size: 30rpx;
		color: #333333;
		position: absolute;
		top: 80rpx;
		left: 180rpx;
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
		color: red;
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
		display: flex;
		align-items: center;
		justify-content: center;
		color: #CCCCCC;
	}
</style>
