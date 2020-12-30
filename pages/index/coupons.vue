<template>
	<view class="content">
		<view class="header">
			<view class="title mtitle" :style="'color:'+template.color.color2">领取优惠
				<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
			</view>
		</view>
		<view class="couponsBox">
			<view class="title" :style="'color:'+template.color.color2">{{couponsInfo.title}}</view>
				<view class="line" :style="'background-color:'+template.color.color1"></view>
				<view class="libao" style="background-color: #f5f5f5;">
					<icon type="libaocaidai" size="60" :color="template.color.color1"></icon>
					<view class="a" :style="'background-color:'+template.color.color1"></view>
					<view class="b" :style="'background-color:'+template.color.color1"></view>
				</view>
				<view class="price">¥<text>{{couponsInfo.moneys}}</text></view>
				<view class="text">消费满{{couponsInfo.min_money}}元可使用</view>
			<view class="booter">
				<view class="left"></view>
				<view class="right"></view>
				<view class="lines"></view>
			</view>
			<view class="footer">
				<view class="time" :style="'color:'+template.color.color1">使用条件</view>
				<view class="text" :style="'color:'+template.color.color5">
					<text v-if="couponsInfo.goods_type==1">购买全场商品可用</text>
					<text v-if="couponsInfo.goods_type==2">限购买指定商品可用</text>
				</view>
			</view>
		</view>
		<view class="button" v-if="couponsInfo.user_status" :style="'background-color:'+template.color.color1" @click="getCouponsTap()">立即领券</view>
		<view class="button" v-else :style="'background-color:'+template.color.color4" @click="getHomeTap()">已经领取，去首页看看</view>
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue"
	const app = getApp();
	export default {
		components: {
			Icon
		},
		data() {
			return {
				template: uni.getStorageSync('__suyaTemplateConfig'),
				couponsInfo: ''
			}
		},
		onLoad(e) {
			let self = this;
			self.Post(self.Url.couponsGoods, {coupons_id: e.id}).then(res => {
				if(res.code === 0) {
					self.couponsInfo = res.data[0];
				}
			})
		},
		methods: {
			getCouponsTap() {
				let self = this;
				let id = self.couponsInfo.id;
				self.Get(self.Url.couponsUserAdd , {id: id}).then(res => {
					if(res.code === 0){
						uni.showToast({title: '领取成功'});
						setTimeout(function () {
							uni.navigateBack();
						}, 500);
					}
				})
			},
			getHomeTap() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
	}

	.header {
		background-color: #fff;
		padding-bottom: 30rpx;

		.title {
			font-size: 66rpx;
			margin-left: 40rpx;
			color: #293539;
			font-weight: 300;
			position: relative;

			text {
				width: 14rpx;
				height: 14rpx;
				position: absolute;
				border: 4rpx solid #f59072;
				border-radius: 50%;
			}
		}
	}

	.couponsBox {
		width: 600rpx;
		height: 780rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		border-radius: 19rpx;
		overflow: hidden;
		background-color: #fff;

		.title {
			color: #293539;
			display: flex;
			width: 100%;
			height: 90rpx;
			align-items: center;
			justify-content: center;
			margin-top: 60rpx;
			font-size: 42rpx;
			font-weight: 300;
		}

		.line {
			width: 80rpx;
			height: 4rpx;
			background-color: #c5c9ca;
			margin: 0 auto;
		}

		.libao {
			width: 290rpx;
			height: 140rpx;
			margin: 0 auto;
			margin-top: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
			position: relative;
			.a{
				position: absolute;
				width: 100%;
				height: 10rpx;
				margin-top: 2rpx;
			}
			.b{
				position: absolute;
				width: 10rpx;
				height: 100%;
			}
		}

		.price {
			width: 100%;
			font-size: 36rpx;
			font-weight: 300;
			text-align: center;
			margin-top: 20rpx;
			color: #293539;

			text {
				font-size: 76rpx;
				padding-left: 6rpx;
			}
		}

		.text {
			color: #293539;
			text-align: center;
			font-size: 30rpx;
			font-weight: 300;
			margin-bottom: 20rpx;
		}

		.booter {
			position: relative;
			width: 100%;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.left {
				width: 60rpx;
				height: 60rpx;
				background-color: #f5f5f5;
				border-radius: 100%;
				position: absolute;
				left: -30rpx;
			}

			.right {
				width: 60rpx;
				height: 60rpx;
				background-color: #f5f5f5;
				border-radius: 100%;
				position: absolute;
				right: -30rpx;
			}

			.lines {
				width: 100%;
				height: 4rpx;
				background-color: #f5f5f5;
			}
		}

		.footer {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			flex-direction: column;

			.time {
				color: #f59072;
				font-size: 30rpx;
				font-weight: 300;
				margin-bottom: 10rpx;
			}

			.text {
				color: #293539;
				font-size: 30rpx;
				font-weight: 300;
				margin-bottom: 0;
			}
		}
	}

	.button {
		width: 600rpx;
		height: 80rpx;
		background-color: #f59072;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		border-radius: 100rpx;
		margin-top: 80rpx;
		color: #fff;
		font-size: 30rpx;
		font-weight: 300;
	}
</style>
