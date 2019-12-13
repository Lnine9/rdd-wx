<template>
	<view>
		<view class="row topRow">
			<input class="input" 
			type="text" 
			v-model="user.userAccount" 
			placeholder="请输入RenDuoDuo账号" 
			placeholder-class="placeholder"  />
		</view>
		<view class="row">
			<input class="input" 
			v-show="!isShowEye"
			v-model="user.userName" 
			type="password"
			password="true"
			placeholder="请输入RenDuoDuo密码" 
			placeholder-class="placeholder"  />
			
			<input class="input"
			v-show="isShowEye"
			v-model="user.userName" 
			type="text"
			placeholder="请输入RenDuoDuo密码" 
			placeholder-class="placeholder"  />
			<image class="eyes" src="../../static/hidePassword.png" v-show="isShowEye" @click="changeEye"></image>
			<image class="eyes" src="../../static/showPassword.png" v-show="!isShowEye" @click="changeEye"></image>
		</view>
		<view class="warning">
			<text class="warning">{{warning}}</text>
		<button class="add-btn" @click="confirm">确认绑定</button>
		</view>
		<view class="register-section">
			还没有账号?
			<text class="regist" @click="toRegist">马上注册</text>
			
		</view>
	</view>
</template>

<script>
	import {api} from	'./api.js'
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
					this.warning='账号或者密码不能为空！！！'
				}
				else{
					api.bindingUser(this.user).then(res=>{
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
							this.warning=res.data.data;
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
</style>
