<script>
	import Vue from 'vue';
	import Links from 'static/utils/links.js';
	import Request from 'static/utils/request.js';
	export default {
		onLaunch: function() {
			let self = this;
			Vue.prototype.Url = Links.links;
			Vue.prototype.Get = Request.get;
			Vue.prototype.Post = Request.post;
			Vue.prototype.Upload = Request.upload;
			Vue.prototype.Config = Request.config;
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.windowWidth = e.windowWidth;
					Vue.prototype.WindowHeight = e.windowHeight;
					Vue.prototype.IphoneX = e.model.search("iPhone X");
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.StatusBarHeight = e.statusBarHeight+custom.height;
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.SafeHeight = e.safeArea.height;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
				}
			});
			// #ifdef MP-WEIXIN
				self.$options.wechatLogin();
				self.$options.getShopInfo();
			// #endif
		},
		templateConfig() {
			let promise = new Promise((resolve) => {
				Vue.prototype.Get(Vue.prototype.Url.templateConfig, {}).then(res => {
					resolve(res);
				});
			});
			return promise;
		},
		getShopInfo() {
			let self = this;
			Vue.prototype.Get(Vue.prototype.Url.shopInfo, {}).then(res => {
				if (res.code === 0) {
					uni.setStorage({key: '__suyaShopInfo',data: res.data});
				}else{
					uni.removeStorageSync('__suyaShopInfo');
				}
			});
		},
		wechatLogin() {
			let self = this;
			let token = uni.getStorageSync('__suyaUserInfo').token;
			if(token){
				Vue.prototype.Get(Vue.prototype.Url.checkToken, {}).then(res => {
					if (res.code === 0) {
						self.globalData.user = true;
					}else{
						uni.removeStorageSync('__suyaUserInfo');
						self.wechatLogin();
					}
				});
			}else{
				uni.login({
				    success: function(wes) {
						provider: 'weixin',
						Vue.prototype.Get(Vue.prototype.Url.wechatLogin, {code: wes.code}).then(res => {
							if(res.code === 1e4){
								self.globalData.user = false;
								uni.removeStorageSync('__suyaUserInfo');
								return
							}
							if(res.code === 0){
								self.globalData.user = true;
								uni.setStorage({key: '__suyaUserInfo',data: res.data});
							}
						});
				    }
				});
			}
		},
		globalData: {
			user: false
		}
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		.content {
			height: 100%;
		}
		.circular{
			position: absolute;
			margin-left: 10rpx;
		}
	}

	image {
		width: 100%;
		height: 100%;
		display: block;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	
	.lineTop:after{
		position: absolute;
		content: '';
		width: 100%;
		left: 0;
		top: 0;
		height: 1px;
		background-color: #f5f5f5;
		transform: scale(1, 0.5);
		transform-origin: center bottom;
	}
	
	.lineBottom:after{
		position: absolute;
		content: '';
		width: 100%;
		left: 0;
		bottom: 0;
		height: 1px;
		background-color: #f5f5f5;
		transform: scale(1, 0.5);
		transform-origin: center bottom;
	}
	
	.header{
	    .title{
	        font-size: 88rpx;
	        margin-left: 40rpx;
	        color: #293539;
	        font-weight: 300;
	        position: relative;
	    }
		.text {
			margin-left: 50rpx;
			color: #293539;
			font-size: 38rpx;
			margin-top: 10rpx;
			font-weight: 300;
		}
		.mtitle{
			font-size: 66rpx;
		}
	}
	
	.loadingBox{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 999999;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		.loading {
		    width: 100rpx;
		    height: 100rpx;
		    background-size: 100%;
		    background-image: url("data:image/svg+xml,%3Csvg width='74' height='74' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='lds-infinity'%3E%3Cpath fill='none' d='M24 30C11 30 5 43 5 50s6 20 19 20c20 0 32-40 52-40 13 0 19 13 19 20s-6 20-19 20c-20 0-32-40-52-40z' stroke='%23ff7c81' stroke-width='7' stroke-dasharray='159.08513549804687 97.50379272460938'%3E%3Canimate attributeName='stroke-dashoffset' calcMode='linear' values='0;256.58892822265625' keyTimes='0;1' dur='1' begin='0s' repeatCount='indefinite'/%3E%3C/path%3E%3C/svg%3E");
		 }
	}
</style>
