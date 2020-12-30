<template>
	<view class="content">
	    <view class="header">
	        <view class="title" :style="'color:'+template.color.color2">登录
	        	<icon class="circular" type="crilce" size="14" :color="template.color.color1"></icon>
	        </view>
	    </view>
	    <view class="login">
	        <image class="logo" :src="shopData.shop_logo" />
	        <view class="title" :style="'color:'+template.color.color2">{{shopData.shop_name}}</view>
	        <view class="text" :style="'color:'+template.color.color3">首次进入需要授权才能使用哦</view>
	        <button class="userlogin" :style="'background-color:'+template.color.color1" open-type="getUserInfo" @getuserinfo="userlogin">授权登录</button>
	        <button class="userlogin navigateBack" @click="navigateBack()">暂不登陆</button>
	    </view>
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue";
	const app = getApp();
	export default {
		components: {Icon},
		data() {
			return {
				template: uni.getStorageSync('__suyaTemplateConfig'),
				shopData: uni.getStorageSync('__suyaShopInfo'),
			}
		},
		onLoad() {

		},
		methods: {
			userlogin(e) {
				let self = this;
				let user = e.detail;
				if(user.iv){
					uni.login({
					    success: function(wxs) {
							provider: 'weixin',
							self.Post(self.Url.wechatDetail, {
								iv: user.iv,
								code: wxs.code,
								raw_data: user.rawData,
								signature: user.signature,
								encrypted_data: user.encryptedData
							}).then(res => {
								if(res.code === 0){
									app.globalData.user = true;
									uni.showToast({title: '授权登陆成功'});
									uni.setStorage({key: '__suyaUserInfo',data: res.data});
									setTimeout(function () {
										uni.navigateBack();
									}, 500);
								}else{
									uni.showModal({
									  title: '授权失败',
									  content: '获取授权信息失败，请重新授权登录',
									  showCancel: false
									});
								}
							});
					    }
					})
				}else{
					uni.showModal({
					  title: '授权失败',
					  content: '获取授权信息失败，请重新授权登录',
					  showCancel: false
					});
				}
			},
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="less">
	.login{
	    height:60vh;
	    width:100%;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    flex-direction:column;
	    .logo{
	        width:120rpx;
	        height:120rpx;
	        border-radius:100%;
	    }
	    .title{
	        color:#27323f;
	        font-size:38rpx;
	        padding-top:20rpx;
			font-weight: 300;
	    }
	    .text{
	        color:#27323f;
	        padding-top:20rpx;
	        font-size:28rpx;
	        padding-bottom:60rpx;
			font-weight: 300;
	    }
	    .userlogin{
	        background-color:#f59072;
	        width:250rpx;
	        height:70rpx;
	        font-size:28rpx;
	        display:flex;
	        align-items:center;
	        justify-content:center;
	        padding:0;
	        color:#fff;
	        border-radius:6rpx;
	        margin-bottom:20rpx;
			font-weight: 300;
	    }
	    .navigateBack{
	        background-color:#f8f8f8;
	        color:#979d9f;
	        margin-top:10rpx;
	    }
	    button::after{
	        border: 0;
	    }  
	}
</style>
