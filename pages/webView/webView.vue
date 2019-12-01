<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'https://www.baidu.com',
			}
		},
		onLoad(data) {
			this.src = data.src
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
