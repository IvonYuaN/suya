<template>
	<view class="content">
		<block v-if="loading">
			<view class="loadingBox">
				<view class="loading"></view>
			</view>
		</block>
		<block v-else>
			<block v-if="template">
				<index v-if="current==0"></index>
				<menus v-if="current==1"></menus>
				<cart v-if="current==2"></cart>
				<user v-if="current==3"></user>
				<view :style="'height:'+(IphoneX>=0?'160rpx':'130rpx')"></view>
				<view class="tabbarBox lineTop" :class="IphoneX>=0?'tabbarX':''">
					<view class="list" :class="current==0?'active':''" @click="selectTabbar(0)">
						<image v-if="template.home.hicon1" :src="current==0?template.home.hicon1:template.home.hicon2" mode="aspectFill"></image>
						<icon v-else :type="current==0?'loveb':'lovea'" size="25" :color="current==0?template.color.color1:template.color.color5"></icon>
						<view class="name" :style="'color:'+(current==0?template.color.color1:template.color.color5)">{{template.home.title1}}</view>
					</view>
					<view class="list" :class="current==1?'active':''" @click="selectTabbar(1)">
						<image v-if="template.menu.micon1" :src="current==1?template.menu.micon1:template.menu.micon2" mode="aspectFill"></image>
						<icon v-else :type="current==1?'menub':'menua'" size="25" :color="current==1?template.color.color1:template.color.color5"></icon>
						<view class="name" :style="'color:'+(current==1?template.color.color1:template.color.color5)">{{template.menu.mtitle}}</view>
					</view>
					<view class="list" :class="current==2?'active':''" @click="selectTabbar(2)">
						<image v-if="template.cart.cicon1" :src="current==2?template.cart.cicon1:template.cart.cicon2" mode="aspectFill"></image>
						<icon v-else :type="current==2?'cartb':'carta'" size="25" :color="current==2?template.color.color1:template.color.color5"></icon>
						<view class="name" :style="'color:'+(current==2?template.color.color1:template.color.color5)">{{template.cart.ctitle}}</view>
					</view>
					<view class="list" :class="current==3?'active':''" @click="selectTabbar(3)">
						<image v-if="template.user.uicon1" :src="current==3?template.user.uicon1:template.user.uicon2" mode="aspectFill"></image>
						<icon v-else :type="current==3?'userb':'usera'" size="25" :color="current==3?template.color.color1:template.color.color5"></icon>
						<view class="name" :style="'color:'+(current==3?template.color.color1:template.color.color5)">{{template.user.utitle}}</view>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="noneBox">
					<view class="noneText">
						<view class="title">模版出现异常</view>
						<view class="text">可能出现的问题有：</view>
						<view class="text">1、没有该模版的使用权限</view>
						<view class="text">2、小程序appID密钥信息未配置</view>
						<view class="text">3、后台填写的appID和当前小程序不一致</view>
						<view class="text">4、后台余额不足导致账单扣费失败，请先充值</view>
						<view class="text">5、如果以上均为解决您的问题请联系模版开发人员</view>
						<view class="tips dev">调试信息：</view>
						<view class="tips">brand：{{wxinfos.brand}}</view>
						<view class="tips">model：{{wxinfos.model}}</view>
						<view class="tips">system：{{wxinfos.system}}</view>
						<view class="tips">version：{{wxinfos.version}}</view>
						<view class="tips">SDKVersion：{{wxinfos.SDKVersion}}</view>
						<view class="tips">appId：{{wxappid}}</view>
					</view>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	import Index from './index/index.vue'
	import Menus from './menu/index.vue'
	import Cart from './cart/index.vue'
	import User from './user/index.vue'
	import Icon from "@/components/icon/icon.vue"
	const app = getApp();
	export default {
		components: {
			Index,Menus,Cart,User,Icon
		},
		data() {
			return {
				loading: true,
				active: false,
				current: -1,
				IphoneX: this.IphoneX,
				wxinfos: uni.getSystemInfoSync(),
				wxappid: uni.getAccountInfoSync().miniProgram.appId,
				template: '',
			}
		},
		onLoad(e) {
			let self = this;
			if(e.scene){
				let scene = decodeURIComponent(e.scene);
				let goods = scene.split('=')[1];
				uni.navigateTo({url: '/pages/menu/detail?id='+goods});
			}
			self.Config().then(res => {
				if(res.code === 0){
					self.template = res.data;
					self.loading = false;
					if(e.goods){
						uni.navigateTo({url: '/pages/menu/detail?id='+e.goods});
					}
					if(e.order){
						uni.navigateTo({url: '/pages/order/list?id='+e.order});
					}
					if(e.cid){
						self.current = e.cid;
					}else{
						self.current = 0;
					}
					uni.setStorageSync('__suyaTemplateConfig', res.data);
				}else{
					self.loading = false;
					uni.removeStorageSync('__suyaTemplateConfig');
				}
			});
		},
		methods: {
			selectTabbar(id) {
				let self = this;
				if(id>=2){
					if(app.globalData.user){
						self.current = id;
					}else{
						uni.navigateTo({url: '/pages/user/login'});
					}
				}else{
					self.current = id;
				}
			}
		}
	}
</script>

<style lang="less">
	.tabbarBox {
		position: fixed;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		bottom: 0;
		background-color: #fff;
		//box-shadow: 0 0 10rpx rgba(0,0,0,.01);
		z-index: 1000;

		.list {
			flex: 0 0 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 16rpx;
			transition: all 0.3s;
			
			image{
				width: 52rpx;
				height: 52rpx;
			}
			
			.name {
				color: #6e6d6b;
				font-size: 24rpx;
				padding-top: 4rpx;
				font-weight: 300;
			}
		}

		.active {
			.name {
				color: #e64340;
			}
		}
	}

	.tabbarX {
		height: 146rpx;
	}
	
	.noneBox{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80vh;
		.noneText{
			font-size: 24rpx;
			border: 1px solid #f2f2f2;
			background-color: #FFFFFF;
			width: 550rpx;
			margin: 0 auto;
			padding: 20rpx;
			box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
			.title{
				font-weight: bold;
				padding-bottom: 20rpx;
				text-align: center;
			}
			.text{
				color: #999;
				line-height: 50rpx;
			}
			.tips{
				color: #4CD964;
				padding-top: 6rpx;
			}
			.dev{
				padding-top: 20rpx;
			}
		}
	}
</style>
