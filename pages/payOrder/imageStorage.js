//      图片缓存
//======================
export class ImageStorage {
	
	static image_cache(image_url, image_name, call_back) {
	
		uni.getStorage({
			key: image_name,
			success: function(res) {
				call_back(res.data)
			},
			fail: function(res) {
				// 本地没有缓存 需要下载 
				uni.downloadFile({
					url: image_url,
					success: (res) => {
						if (res.statusCode === 200) {
							call_back(res.data)
							uni.setStorage({
								key: image_name,
								data: res,
								success: function() {
	
								}
							})
						}
					}
				});
			}
		})
	}
	
}

