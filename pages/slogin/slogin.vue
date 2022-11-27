<template>
	<view>
		<view class="sun-index" v-if="needbind">
			<view class="sun-logo-box">
				<view class="sun-logo">
					<image class="sun-icon-img" src="@/static/code/scan.png" />
				</view>
			</view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 28rpx;height:39rpx;" />
					<text class="label-text">学号</text>
				</view>
				<view class="sun-input-box">
					<input v-model="state.no" type="text" placeholder="请输入学号" placeholder-class="placeholder-class" />
				</view>
			</view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 29rpx;height:37rpx;" />
					<text class="label-text">姓名</text>
				</view>
				<view class="sun-input-box">
					<input v-model="state.name" type="text" placeholder="请输入姓名" placeholder-class="placeholder-class" />
				</view>
			</view>
			<view class="login-btn-box">
				<view class="login-btn" @click="handleSubmit">确认</view>
			</view>
		</view>
		<view class="pop" v-if="success">
			<view class="notiico">
				<icon type="success" size="130"></icon>
				<text class="notimsg" style="font-size: 24px;font-weight: bold;">{{building}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{no}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{name}}</text>
				<text class="notimsg" style="color:#16d897;">{{msg}}</text>
			</view>
		</view>
		<view class="pop" v-if="fails">
			<view class="notiico">
				<icon type="warn" size="130"></icon>
				<text class="notimsg" style="font-size: 24px;font-weight: bold;">{{building}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{no}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{name}}</text>
				<text class="notimsg" style="color:#c8214e;">{{msg}}</text>
			</view>
		</view>
		<view class="pop" v-if="needlogin">
			<view>
				<view class="sun-logo-box">
					<view class="sun-logo">
						<image class="sun-icon-img" src="@/static/code/scan.png" />
					</view>
				</view>
				<view class='loginmsg'>
					<view>请先进行微信授权登录</view>
				</view>
				<view class="login-btn-box" style="bottom: 300rpx;">
					<view class="login-btn" @click="wxlogin">授权登录</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				no: '',
				name: '',
				building: '',
				success: false,
				fails: false,
				msg: '',
				wxcode: '',
				wxid: undefined,
				needlogin: false,
				needbind: false,
				historyId: undefined,
			}
		},
		onLoad(params) {
			console.log('初始参数');
			console.log(params);
			if (params.scene) { // 二维码解析进入
				// 获取scene中的数据
				let scene = decodeURIComponent(params.scene);
				console.log(scene);
				this.historyId = scene
				if (!this.historyId) {
					uni.showToast({
						icon: 'error',
						title: '二维码信息错误，请重新扫码',
						duration: 2000
					})
					return
				}
			}
			
		},
		onShow() {
			console.log('loading cache wxid');
			const that = this
			uni.getStorage({
			    key: 'swxid',
			    success: function (res) {
			        console.log(res.data);
			        let cachewxid = res.data;
					if (cachewxid) {
						that.wxid = cachewxid
						that.needlogin = false
					} else {
						that.needlogin = true
					}
					that.scan()
			    },
				fail: function (err) {
					console.log(err);
					that.needlogin = true
					that.scan()
				},
			});
		},
		methods: {
			scan() {
				console.log('scaning');
				console.log(this.historyId);
				uni.showLoading({
					title: '正在查询信息...',
				})
				const that = this
				if (this.historyId) {
					if (!this.wxid){
						this.needlogin = true;
						uni.hideLoading()
						return
					}
					api.scan({
						wechatId: that.wxid,
						historyId: that.historyId,
					}).then(res => {
						if (res.data.code == 200) {
							that.success = true
							that.msg = "已完成确认"
							that.no = res.data.data.studentId
							that.name = res.data.data.studentName
						} else {
							if (res.data.message == '用户未绑定！'){
								uni.showToast({
									title: "请绑定信息",
									icon: 'none'
								})
								that.needbind = true
							} else {
								that.fails = true
								that.msg = '确认失败，请重新扫码'
								if (res.data.data){
									that.no = res.data.data.studentId
									that.name = res.data.data.studentName
									that.msg = res.data.message
								}
							}
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							title: "确认失败，请重新扫码",
							icon: 'none'
						})
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '信息有误，请重新扫码',
						duration: 3000
					})
					that.fails = true
					that.msg = '信息有误，请重新扫码'
				}
				uni.hideLoading()
			},
			bind() {
				console.log('bind');
				const that = this
				api.bind({
					studentName: this.name,
					studentId: this.no,
					wechatId: this.wxid,
					historyId: this.historyId,
				}).then(res => {
					console.log(res);
					if (res.data.code == 200) {
						uni.showToast({
							title: '绑定成功',
							icon: 'success',
							duration: 1000
						})
						this.scan()
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 3000,
							icon: 'none',
						})
					}
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: "网络错误，请稍后重试",
						icon: 'none'
					})
				})
			},
			handleSubmit() {
				if (!this.no) return uni.showToast({
					title: '请输入学号',
					icon: 'none',
					duration: 1500
				})
				if (!this.name) return uni.showToast({
					title: '请输入姓名',
					icon: 'none',
					duration: 1500
				})
				const that = this
				uni.showModal({
					title: '请确认信息',
					content: `学号：${this.no}\n姓名：${this.name}`,
					success() {
						that.bind()
					}
				})
			},
			wxlogin() {
				let that = this
				//调用微信小程序的登录接口
				uni.login({
					provider: "weixin",
					success(res) {
						console.log(res);
						that.wxcode = res.code 
						api.getWxid({
							code: res.code
						}).then(res => {
							console.log(res);
							if(res.data){
								that.wxid = res.data
								uni.setStorage({
									key: 'swxid',
									data: res.data,
								})
								that.needlogin = false
								uni.showToast({
									icon:'none',
									title: '登录成功，等待确认信息',
									duration: 1000
								})
								setTimeout(that.scan, 1000)
							} else {
								uni.showToast({
									icon:'error',
									title: '登录失败',
									duration: 1000
								})
							}
						})
					},
					fail(e) {
						console.log('fail', e)
						uni.showToast({
							title: '网络异常',
							duration: 1000
						})
						return
					}
				})
			}
		}
	}
</script>

<style scoped>
	.sun-logo-box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750rpx;
		height: 300rpx;
	}

	.sun-logo {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
		box-shadow: 5rpx 5rpx 30rpx rgba(167, 200, 190, 0.5);
	}

	.close-icon {
		width: 36rpx;
		height: 34rpx;
	}

	.sun-icon-img {
		width: 100%;
		height: 100%;
	}

	.sun-login-box {
		padding: 20rpx 60rpx;
	}

	.sun-label {
		display: flex;
		align-items: center;
	}

	.label-text {
		margin-left: 16rpx;
		font-weight: 500;
		color: #272e2d;
		font-size: 30rpx;
	}

	.sun-input-box {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-bottom: 1rpx solid #eee;
		padding: 0px 20rpx;
		margin: 0px 15rpx;
	}

	.sun-input-box input {
		flex: 1;
	}

	.placeholder-class {
		font-size: 30rpx;
		color: #C0C0C0;
	}

	.sun-tip {
		display: flex;
		justify-content: space-between;
		padding: 0rpx 68rpx;
	}

	.sun-tip-text {
		color: #30C6B3;
	}

	.login-btn-box {
		position: absolute;
		bottom: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 500rpx;
		padding: 50rpx 68rpx 0rpx;
	}

	.login-btn {
		height: 82rpx;
		border-radius: 41rpx;
		background-color: #12C8B9;
		box-shadow: -1px 12px 11px 0px rgba(16, 170, 157, 0.4);
		text-align: center;
		line-height: 82rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #fff;
	}

	.pop {
		position: absolute;
		z-index: 10000;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: white;
		transition: all .5s linear;
	}

	.notiico {
		position: absolute;
		top: 25%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70%;
	}

	.notimsg {
		margin-top: 30rpx;
		font-size: 18px;
	}

	.loginmsg {
		position: absolute;
		font-size: 18px;
		top: 50%;
		left: 50%;
		transform: translateX(-50%);
		color: #3f3f3f;
	}
	uni-modal .uni-modal__bd{      
	    white-space: pre-wrap;      
	}
</style>
