<template>
	<view>
		<view v-show="showTypeImg">
			<noPic :picSrc="picSrc" :noText="noText"></noPic>
		</view>
		<view v-for="(income, index1) in incomes" :key="index1" v-show="showTypeIncome">
			<view style="height: 88rpx;">
				<text class="theDate">{{date[index1]}}</text>
			</view>
			
				<view class="list" v-if="item.amount!=0" v-for="(item, index) in income" :key="index">
					<view style="width: 500rpx;height: 186rpx;position: relative">
						<image src="../../static/income/fanIncome.png" class="img"></image>
						<view class="remark">{{item.remark || '--'}}</view>
						<view class="number">{{item.userName}}</view>
						<view class="updateAt">{{item.createAt}}</view>
					</view>
					<text class="amount">{{symbol}} {{item.amount.toFixed(2)}}</text>
				</view>
		
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
		data() {
			return {
				picSrc: "../../../static/income/noIncome.png",
				noText: "暂无收益",
				showTypeImg: true,
				showTypeIncome: false,
				type: 1,
				income: [],
				incomes: [],
				date: [],
				symbol: "+"
			}
		},
		
		// 上页面传来的数据
		onLoad(option) {
			let title = '收益';
			this.type = option.type;
			console.log(this.type)
			if (option.type == 0) {
				title = '分享下单收益'
			}
			if (option.type == 1) {
				this.symbol="-"
				title = '提现记录'
			}
			if (option.type == 4) {
				title = '其他收益'
			}
			if (option.type == 3) {
				title = '推荐收益'
			}
			uni.setNavigationBarTitle({
				title
			})
			// this.formatDate(this.income);
			this.getIncome();
		},
		methods: {
			
			// 访问后端接口
			getIncome() {
				console.log(this.symbol)
				api.getData({
					type: this.type
				}).then(res => {
					console.log(res.data);
					this.income = res.data.data;
					console.log(this.income)
					this.changeDate(this.income)
				}).catch(_ => {
					wx.showToast({
						title: '网络繁忙！',
						icon: 'none',
						duration: 1500
					})
					this.showTypeImg = true;
					this.showTypeIncome = false;
				})
			},
			changeDate(income){
				console.log(income.length)
				for(let i=0;i<income.length;i++){
					var date = new Date(income[i].createAt);
					console.log(date)
					let Y = date.getFullYear() + '-';
					console.log(Y)
					let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
					console.log(M)
					let D = date.getDate() + ' ';
					console.log(D)
					let h = date.getHours() + ':';
					console.log(h)
					let m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
					console.log(m)
					let s = date.getSeconds();
					console.log(s)
					income[i].createAt=Y+M+D+h+m+s;
					console.log(income[i].createAt)
				}
				console.log(income)
				this.formatDate(income);
			},
			// 分类后端数据
			formatDate(income) {
				// 数据分类存放数组
				let theDate = [];
				let count = 0;
				let length = 0;
				// 时期分类数组
				let formatDate1 = [];
				console.log('长度是', income.length);

				// 判断记录是否为空
				if (this.income.length > 0) {
					this.showTypeImg = false;
					this.showTypeIncome = true;

					// 截取当前记录的年月

					let ymDate = income[0].createAt.substring(0, 7);
					formatDate1[count++] = ymDate;

					// 循环记录
					for (let i = 0; i < income.length; i++) {

						// 循环日期数组
						if (income[i].createAt.substring(0, 7) === ymDate) { // 2019-11 = 2019-11
							// 大数组添加数据
							// theDate[theDate.length -1 ].add(income[i])
							theDate[length++] = income[i];


						} else {
							this.incomes[--count] = theDate;
							count++;
							ymDate = income[i].createAt.substring(0, 7);
							formatDate1[count++] = ymDate;
							theDate = [];
							length = 0;
							theDate[length++] = income[i];
						}
						if (i === income.length - 1) {
							this.incomes[--count] = theDate;
							this.date = formatDate1;
						}

					}

					console.log(this.incomes);
					console.log(this.date)
					// console.log('formatDate是',formatDate);
				} else if(this.income.length == 0){
					this.showTypeImg = true;
					this.showTypeIncome = false;
				}
			}
		}


	}
</script>

<style>
	page {
		padding-bottom: 50rpx;
		background:rgba(248,249,251,1);
	}

	.list {
		margin-top: 3rpx;
		width: 750rpx;
		height: 186rpx;
		background: rgba(255, 255, 255, 1);
	}

	.img {
		position: absolute;
		top: 50rpx;
		left: 40rpx;
		width: 70rpx;
		height: 70rpx;
	}

	.remark {
		width: 320rpx;
		letter-spacing: 3rpx;
		font-size: 30rpx;
		color: #333333;
		position: absolute;
		top: 40rpx;
		left: 140rpx;
	}

	.amount {
		float: right;
		margin: -120rpx 50rpx 0 0;
		font-size: 32rpx;
		color: #FF7E30;
		font-weight: bold;
	}

	.updateAt {
		width: 320rpx;
		position: relative;
		top: 97rpx;
		left: 140rpx;
		font-size: 24rpx;
		color: #CCCCCC;
	}

	.number {
		width: 320rpx;
		color: #CCCCCC;
		font-size: 24rpx;
		position: relative;
		top: 87rpx;
		left: 140rpx;
	}

	.theDate {
		margin-left: 30rpx;
		line-height: 88rpx;
		font-size: 24rpx;
		color: #CCCCCC;
	}

	.noIncome {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #CCCCCC;
	}
</style>
