<template>
<!--	<view>-->
<!--		<view class="row topRow">-->
<!--			<input class="input" -->
<!--			type="text" -->
<!--			v-model="user.userAccount" -->
<!--			placeholder="请输入电话" -->
<!--			placeholder-class="placeholder"  />-->
<!--		</view>-->
<!--		<view class="row">-->
<!--			<input class="input" -->
<!--			v-show="!isShowEye"-->
<!--			v-model="user.userName" -->
<!--			type="password"-->
<!--			password="true"-->
<!--			placeholder="请输入密码" -->
<!--			placeholder-class="placeholder"  />-->
<!--			-->
<!--			<input class="input"-->
<!--			v-show="isShowEye"-->
<!--			v-model="user.userName" -->
<!--			type="text"-->
<!--			placeholder="请输入密码" -->
<!--			placeholder-class="placeholder"  />-->
<!--			<image class="eyes" src="../../static/hidePassword.png" v-show="isShowEye" @click="changeEye"></image>-->
<!--			<image class="eyes" src="../../static/showPassword.png" v-show="!isShowEye" @click="changeEye"></image>-->
<!--		</view>-->
<!--		<view class="warning">-->
<!--			<text class="warning">{{warning}}</text>-->
<!--		<button class="add-btn" @click="confirm">确认绑定</button>-->
<!--		</view>-->
<!--		<view class="register-section">-->
<!--			还没有账号?-->
<!--			<text class="regist" @click="toRegist">马上注册</text>-->
<!--		</view>-->
<!--	</view>-->
  <button class="contact" open-type="contact">
  	<view class="buyView" style="background-color: #06C1AE;color: white;">
  		<image style="width: 31rpx;height: 30rpx;margin-right: 10rpx;" src="../../static/product/server.png"></image>
  		<text style="font-size: 30rpx;margin-left: 0.5rem;">联系客服</text>
  	</view>
  </button>
  
</template>

<script>
	import {api} from'./api.js'
	export default{
		data() {
			return{
				warning:'',
				isShowEye:false,
				user:{
					userAccount:'',
					userName:''
				}
			}
		},
		methods:{
			confirm(){
				if(this.user.userAccount==''||this.user.userName==''){
					wx.showToast({
					  title: '账号或者密码不能为空！！！',
					  icon:'none',
					  duration: 3000
					})
				}
				else if(!/(^1[1|2|3|4|5|6|7|8|9][0-9]{9}$)/.test(this.user.userAccount)){
					wx.showToast({
					  title: '请输入正确的手机号码！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				else if(this.user.userName<6){
					wx.showToast({
					  title: '密码长度大于6位！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				else{
					api.bindingUser(this.user).then(res=>{
						console.log(res.data.data)
						if(res.data.data=="绑定成功"){
							uni.switchTab({
								url: '/pages/homePage/homePage'
							});
							wx.showToast({
							  title: '绑定成功',
							  icon: 'success',
							  duration: 3000
							})
						}
						else{
							wx.showToast({
							  title: res.data.data,
							  icon:'none',
							  duration: 3000
							})
						}
					}).catch(err=>{
						console.log(err)
					})
				}
			},
			changeEye(){
				this.isShowEye=!this.isShowEye;
			},
			toRegist(){
				uni.navigateTo({
					url: `/pages/userBind/regist`
				})
			}
		}
	}
</script>

<style>
	page{
		background: #f8f9fb;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding: 30rpx 30rpx 30rpx 30rpx;
		position: relative;
		margin-top: 5rpx;
		border-color: #CCCCCC;
		background: #FFFFFF;
	}
	.topRow{
		margin-top: 20rpx;
	}
	.input{
		flex: 1;
		text-align: left;
		font-size: 30rpx;
	}
	.add-btn{
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 670rpx;
		height: 80rpx;
		font-size: 30rpx;
		color: #FFFFFF;
		background-color: #06C1AE;
		border-radius: 40rpx;	
	}
	.warning{
		margin-top: 40rpx;
		color: red;
		width: 100%;
		font-size: 26rpx;
		text-align: center;
	}
	.register-section{
		position:absolute;
		right: 42rpx;
		margin-top: 10rpx;
		width: 100%;
		font-size: 24rpx;
		color: #CCCCCC;
		text-align: right;
	}
	.regist{
		color: #06C1AE;
		margin-left: 10rpx;
	}
	.eyes{
		width: 40rpx;
		height: 25rpx;
	}
	.contact{
		position: absolute;
		padding: 0 2rem;
		background-color: #06C1AE;
		color: white;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
</style>
