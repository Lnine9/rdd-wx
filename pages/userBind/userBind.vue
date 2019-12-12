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
			v-model="user.userName" 
			password="true"
			placeholder="请输入RenDuoDuo密码" 
			placeholder-class="placeholder"  />
		</view>
		<button class="add-btn" @click="confirm">确认绑定</button>
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
				user:{
					userAccount:'',
					userName:''
				}
			}
		},
		methods:{
			confirm(){
				api.modifyAddress(this.user).then(res=>{
					console.log(res.data)
				}).catch(err=>{
					console.log(err)
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
		position: fixed;
		left: 24rpx;
		right: 30rpx;
		margin-top: 40rpx;
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
	.register-section{
		position:absolute;
		right: 42rpx;
		margin-top: 140rpx;
		width: 100%;
		font-size: 24rpx;
		color: #CCCCCC;
		text-align: right;
	}
	.regist{
		color: #06C1AE;
		margin-left: 10rpx;
	}
</style>
