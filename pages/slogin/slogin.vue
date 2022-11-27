<template>
	<view>
		<view class="sun-index">
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
				wxid: '',
				needlogin: true,
				batchId: null,
				historyId: null,
			}
		},
		methods: {
			onload(params) {
				if (params.scene) { // 二维码解析进入
					// 获取scene中的数据
					let scene = decodeURIComponent(params.scene);
					let arrPara = scene.split("&");
					let arr = [];
					for (let i in arrPara) {
						arr = arrPara[i].split("=");
						if (arr[0] === "batchId") { // 商品id
							this.batchId = arr[1];
						} else if (arr[0] === "historyId") { // 分享码中的推荐人id
							this.historyId = arr[1];
						}
					}
					if (!this.batchId || !this.historyId) {
						uni.showToast({
							icon: 'error',
							title: '二维码信息错误，请重新扫码',
							duration: 2000
						})
					}
				}
				
				const cachewxid = localStorage.getItem('s_wxid')
				if (cachewxid) {
					this.wxid = cachewxid
					this.needlogin = false
				}
				
			},
			scan() {
				if (this.batchId && this.historyId) {
					if (!this.wxid){
						this.needlogin = true;
						return
					}
					api.scan({
						wechatId: this.wxid,
						batchId: this.batchId,
						historyId: this.historyId,
					}).then(res => {
						if (res.data.code == 200) {
							this.success = true
						} else {
							this.fails = true
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							title: "网络错误，请稍后重试",
							icon: 'none'
						})
					})
				} else {
					uni.showToast({
						icon: 'error',
						title: '信息有误，请重新扫码',
						duration: 2000
					})
				}
			},
			bind() {
				console.log('bind');
				api.bind({
					studentName: this.name,
					studetnId: this.no,
					wechatId: this.wxid,
					batchId: this.batchId,
					history: this.historyId,
				}).then(res => {
					console.log(res);
					if (res.data.code == 200) {
						uni.showToast({
							title: '绑定成功',
							icon: 'success',
							duration: 1000
						})
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
						that.wxcode = res.code //拿到的code存储在data中
						that.needlogin = false
						uni.showToast({
							title: '登录成功',
							duration: 1000
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
