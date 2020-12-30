<template>
	<view class="content">
	    <view class="header">
	        <open-data class="avatar" type="userAvatarUrl"></open-data>
	        <view class="name">
	            <open-data type="userNickName" :style="'color:'+template.color.color2"></open-data>
				<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
	        </view>
	        <view class="orderBox">
	            <view class="order" @click="getMenuListTap('/pages/order/list?id=0')">
					<image v-if="template.user.uicon3" :src="template.user.uicon3" mode="aspectFill"></image>
	                <icon v-else type="daifukuan" size="28" :color="template.color.color1"></icon>
	                <text>待付款</text>
	            </view>
	            <view class="order" @click="getMenuListTap('/pages/order/list?id=1')">
					<image v-if="template.user.uicon4" :src="template.user.uicon4" mode="aspectFill"></image>
	                <icon v-else type="daifahuo" size="28" :color="template.color.color1"></icon>
	                <text>待发货</text>
	            </view>
	            <view class="order" @click="getMenuListTap('/pages/order/list?id=2')">
					<image v-if="template.user.uicon5" :src="template.user.uicon5" mode="aspectFill"></image>
					<icon v-else type="yifahuo" size="28" :color="template.color.color1"></icon>
	                <text>待收货</text>
	            </view>
	            <view class="order" @click="getMenuListTap('/pages/order/list?id=4')">
					<image v-if="template.user.uicon6" :src="template.user.uicon6" mode="aspectFill"></image>
	                <icon v-else type="daipingjia" size="28" :color="template.color.color1"></icon>
	                <text>待评价</text>
	            </view>
	        </view>
	    </view>
		<view class="vipBox">
			<view class="huiyuan" :style="'background-color:'+ template.color.color1" @click="getMenuListTap('/pages/user/member')">
				<view class="vipIcon">
					<icon type="huiyuanlifttime" size="20" color="#fff"></icon>
				</view>
				<view v-if="userDetails.level_id" class="text" style="flex: 0 0 80%;">您是{{userDetails.level_title}}，购物可享{{userDetails.discount/10}}折优惠</view>
				<view v-else class="text">升级VIP会员，消费省的更多～</view>
				<icon v-if="userDetails.level_id" type="right" size="13" color="#fff"></icon>
				<view v-else class="button" :style="'color:'+template.color.color1">
					<view class="btn">查看权益 <icon type="right" size="13" :color="template.color.color1"></icon></view>
				</view>
			</view>
		</view>
	    <view class="menuList">
	        <view class="menu lineBottom" @click="getMenuListTap('/pages/user/favorite')">
	            <icon type="crilce" size="8" :color="template.color.color1"></icon>
				<view class="name" :style="'color:'+template.color.color2">收藏夹</view>
	            <icon type="right" size="16" :color="template.color.color5"></icon>
	        </view>
	        <view class="menu lineBottom" @click="getMenuListTap('/pages/user/coupons')">
	            <icon type="crilce" size="8" :color="template.color.color1"></icon>
				<view class="name" :style="'color:'+template.color.color2">优惠券</view>
	            <icon type="right" size="16" :color="template.color.color5"></icon>
	        </view>
	        <view class="menu lineBottom" @click="getMenuListTap('/pages/user/adslist')">
	            <icon type="crilce" size="8" :color="template.color.color1"></icon>
				<view class="name" :style="'color:'+template.color.color2">收货地址</view>
	            <icon type="right" size="16" :color="template.color.color5"></icon>
	        </view>
	        <view v-if="template.user.history" class="menu lineBottom" @click="getMenuListTap('/pages/user/history')">
	            <icon type="crilce" size="8" :color="template.color.color1"></icon>
				<view class="name" :style="'color:'+template.color.color2">浏览足迹</view>
	            <icon type="right" size="16" :color="template.color.color5"></icon>
	        </view>
			<view v-if="template.user.about" class="menu lineBottom" @click="aboutShow=true">
			    <icon type="crilce" size="8" :color="template.color.color1"></icon>
				<view class="name" :style="'color:'+template.color.color2">{{template.user.about}}</view>
			</view>
	    </view>
		<about />
		<view v-if="aboutShow" class="showContent">
			<view class="bg" @click="aboutShow=false"></view>
			<view class="showBox" :style="'color:'+template.color.color2">
				<icon type="jiaobiao1" size="25" @click="aboutShow=false" :color="template.color.color1"></icon>
				<view class="title">{{template.user.about}}</view>
				<view class="texts">
					<text>{{template.user.utext}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue"
	import About from "@/components/about/about.vue"
	const app = getApp()
	export default {
		components: {Icon, About},
		data() {
			return {
				template: uni.getStorageSync('__suyaTemplateConfig'),
				aboutShow: false,
				userDetails: ''
			}
		},
		onReady() {
			let self = this;
			self.Get(self.Url.userDetails, {}).then(res => {
				if(res.code === 0){
					self.userDetails = res.data;
				}
			});
		},
		methods: {
			getMenuListTap(url) {
				if(app.globalData.user){
					uni.navigateTo({url: url});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			}
		}
	}
</script>

<style lang="less">
	.header{
	    display:flex;
	    flex-direction:column;
	    align-items:center;
	    border-bottom:12rpx solid #f5f5f5;
	    .avatar{
	        width:160rpx;
	        height:160rpx;
	        border-radius:50%;
	        overflow: hidden;
	        display: block;
	        box-shadow:0 0 20rpx #f5f5f5;
	    }
	    .name{
	        color:#293539;
	        font-size:38rpx;
	        margin-top:20rpx;
	        position: relative;
	        font-weight:300;
	    }
	    .orderBox{
	        display:flex;
	        height:150rpx;
	        align-items:center;
	        justify-content:center;
	        width:100%;
	        margin:0 auto;
	        margin-top:26rpx;
	        font-weight:300;
	        .order{
	            flex:0 0 25%;
	            color:#293539;
	            display:flex;
	            flex-direction:column;
	            align-items:center;
	            justify-content:center;
				image{
					width: 60rpx;
					height: 60rpx;
				}
	            text{
	                font-size:28rpx;
	                padding-top:8rpx;
	            }
	        }
	    }
	}
	.vipBox{
		width: 100%;
		background-color: #f5f5f5;
		padding: 20rpx 0 0;
		.huiyuan{
			width: 90%;
			margin: 0 auto;
			height: 80rpx;
			display: flex;
			align-items: center;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			.vipIcon{
				flex: 0 0 13%;
				display: flex;
				justify-content: center;
			}
			.text{
				color: #fff;
				font-weight: 300;
				flex: 0 0 60%;
			}
			.button{
				flex: 0 0 27%;
				display: flex;
				justify-content: center;
				.btn{
					display: flex;
					background-color: #fff;
					border-radius: 100rpx;
					padding: 6rpx 10rpx;
					font-size: 24rpx;
					font-weight: 300;
					align-items: center;
				}
			}
		}
	}
	.menuList{
	
	    .menu{
	        width:100%;
	        height:110rpx;
	        //border-bottom:2rpx dashed #f5f5f5;
	        font-size:30rpx;
	        color:#293539;
	        position:relative;
	        font-weight:300;
	        display:flex;
	        align-items:center;
	        icon{
	            margin-left:30rpx;
	        }
	        .name{
	            width:600rpx;
	            margin-left:20rpx;
	        }
	    }
	}
	
	.showContent{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255,255,255,.5);
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all .5s;
		.bg{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 100;
		}
		.showBox{
			width: 65%;
			background-color: #fff;
			padding: 30rpx;
			font-weight: 300;
			box-shadow: 0 0 30rpx rgba(0,0,0,.1);
			border-radius: 10rpx;
			font-size: 30rpx;
			position: absolute;
			overflow: hidden;
			z-index: 101;
			margin-top: -50rpx;
			icon{
				position: absolute;
				top: 0;
				right: 0;
			}
			.title{
				text-align: center;
				padding: 20rpx 0 30rpx;
				font-size: 32rpx;
			}
			.texts{
				padding-bottom: 10rpx;
			}
		}
	}
</style>
