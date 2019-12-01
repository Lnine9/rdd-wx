<template>
	<view id="whole">
		<view v-show="showTypeImg" style="background: #FFFFFF;">
			<image src="../../static/income/返佣收益缺省图_icon.png" class="noImg"></image>
			<text class="noIncome">暂无收益</text>
		</view>
		<view v-for="(income, index1) in incomes" :key="index1" v-show="showTypeIncome">
			<view style="height: 88rpx;">
				<text class="theDate">{{date[index1]}}</text>
			</view>

			<view class="list" v-if="item.amount!=0" v-for="(item, index) in income" :key="index">
				<image src="../../static/income/ic-返利.png" class="img"></image>
				<text class="remark">{{item.remark}}</text>
				<text class="number">{{item.userAccount}}</text>
				<text class="updateAt">{{item.createAt}}</text>
				<text class="amount">+{{item.amount}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from './api.js'
	export default {
		data() {
			return {
				showTypeImg: true,
				showTypeIncome: false,
				type: 1,
				income: [],
				incomes: [],
				date: []
			}
		},
		onLoad(option) {
			let title = '收益';
			this.type = option.type;
			console.log(option.type)
			if (option.type == 0) {
				title = '返佣收益'
			}
			if (option.type == 1) {
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
			this.getIncome();
		},
		methods: {
			getIncome() {
				api.getData({
					type: this.type
				}).then(res => {
					console.log(res.data);
					this.income = res.data.data;
					this.formatDate(this.income);

				}).catch(_ => {
					console.log("数据未获取")
				})
			},
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
	.noImg {
		width: 200rpx;
		height: 200rpx;
		margin: 370rpx 0 0 270rpx;
	}

	#whole {
		width: 750rpx;
		background: rgba(248, 249, 251, 1);
	}

	.list {
		margin-top: 3rpx;
		width: 750rpx;
		height: 186rpx;
		background: rgba(255, 255, 255, 1);
	}

	.img {
		position: relative;
		top: 45rpx;
		left: 60rpx;
		width: 70rpx;
		height: 70rpx;
	}

	.remark {
		letter-spacing: 3rpx;
		margin: 0 0 0 70rpx;
		font-size: 28rpx;
		position: relative;
		color: #333333;
		left: 20rpx;
	}

	.amount {
		float: right;
		padding: 60rpx 50rpx 0 0;
		font-size: 32rpx;
		color: #FF7E30;
		font-weight: bold;
	}

	.updateAt {
		position: relative;
		top: 80rpx;
		right: 287rpx;
		font-size: 24rpx;
		color: #CCCCCC;
	}

	.number {
		font-size: 24rpx;
		position: relative;
		top: 40rpx;
		right: 150rpx;
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
