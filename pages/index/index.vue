<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="isCanUse">
			<view>
				<view class='header'>
					<image src='../../static/logo.png'></image>
				</view>
				<view class='content'>
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>

				<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
					授权登录
				</button>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		api
	} from './api.js'
	import {
		auth
	} from '../../Config/auth.js'
	export default {
		data() {
			return {
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
				code: '',
				sessionkey: '',
			};
		},
		computed: {
			...mapState(['token'])
		},
		methods: {
			...mapMutations(['login']),
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				console.log('...授权...')
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						_this.nickName = nickName;
						console.log('用户名' + nickName)
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						_this.avatarUrl = avatarUrl;
						console.log(infoRes)
						uni.base
						try {
							uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
							_this.loginWx();
						} catch (e) {
							console.error(e)
						}
					},
					fail(res) {
						uni.showModal({
							content: '失败了',
							showCancel: true
						});
					}
				});
			},

			//登录
			loginWx() {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes)
						if (!_this.isCanUse) {
							//非第一次授权获取用户信息
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									//获取用户信息后向调用信息更新方法
									let nickName = infoRes.userInfo.nickName; //昵称
									_this.nickName = nickName;
									let avatarUrl = infoRes.userInfo.avatarUrl; //头像
									_this.avatarUrl = avatarUrl;
									// todo 19.12.04 更新信息
								}
							});
						}
						//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						console.log('请求后台');
						let loginParam = {
							code: loginRes.code,
							nickName: _this.nickName,
							avatarUrl: _this.avatarUrl,
							superiorUser: uni.getStorageSync('superiorUser') || null
						}
						console.log(loginParam)
						api.getData(loginParam).then(res => {
							console.log(res)
							_this.loginSuccess(res.data.token)
							console.info('awewe' + uni.getStorageSync('token'))
						}).catch(err => {
							console.log(err)
						})
					},
				});
			},

			//登录成功后跳转到首页
			loginSuccess(data) {
				console.info(data)
				this.login(data);

				uni.reLaunch({
					url: '/pages/homePage/homePage'
				})
			},
			onLoad(options) {
				console.log('父级' + options)
				console.log(options)
				if (options.scene) {
					console.log("has scene");
					uni.setStorageSync('superiorUser', options.scene);
				}
			},
		},
	}
</script>

<style>
	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}
</style>
