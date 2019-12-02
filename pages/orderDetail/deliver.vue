<template>
	<view>
	</view>
</template>

<script>
	import '../../hybrid/html/KDNWidget/KDNWidget.css'
	import '../../hybrid/html/KDNWidget/KDNWidget.js'

	export default {
		data() {
			return {
				// url: 'https://laravelcode.cn/posts/87/solutions-to-the-problems-of-jumping-and-communicating-between-web-view-pages-in-uni-app'
			}
		},
		onLoad: function(params) {
			console.log(params);

			window.onload = function() {
				KDNWidget.run({
					serviceType: "A",
					expCode: "ZTO",
					expNo: "453428852106",
				})
			}
			// this.url = this.url + '&a=' + params.expCode + '&b=' + params.expNo;
			// this.url = '/hybrid/html/deliver.html?expCode=ZTO&expNo=453428852106';

		},
		methods: {
			handleMessage(evt) {
				console.log('接收到的消息：' + JSON.stringify(evt.detail.data));
			}
		}
	}
</script>

<style>

</style>
