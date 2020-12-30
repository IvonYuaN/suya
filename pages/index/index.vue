<template>
	<view v-if="template" class="content">
		<view class="header">
			<view class="title" :style="'color:'+template.color.color2">{{template.home.title2}}
				<icon class="circular" type="crilce" size="14" :color="template.color.color1"></icon>
			</view>
			<view class="text" :style="'color:'+template.color.color2">{{template.home.title3}}</view>
			<!-- // 优惠券功能待开发 -->
			<view class="couponsBox" v-if="couponsInfo" @click="getNewCouponsTap(couponsInfo.id)">
				<view class="couponsLine">
					<view class="coupons" :style="'border-color:'+template.color.color2">
						<view class="box">
							<view class="price" :style="'color:'+template.color.color2">¥<text>{{couponsInfo.moneys}}</text></view>
							<view class="name" :style="'color:'+template.color.color2">{{couponsInfo.title}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="goodsContent" :style="'height:'+WindowHeight+'px;'">
			<view v-if="template.home.hrecommend" class="swiper">
				<swiper :circular="true" :autoplay="template.home.swiper" :interval="template.home.times" :duration="500" :previous-margin="windowWidth/4+'rpx'" :next-margin="windowWidth/4+'rpx'">
					<swiper-item v-for="(item, index) in hotGoods" :key="index">
						<view class="goodsBox" @click="getGoodsTap(item.id)">
							<view class="image">
								<image lazy-load mode="aspectFit" :src="item.pic" />
							</view>
							<view class="info">
								<view class="name" :style="'color:'+template.color.color2">{{item.title}}</view>
								<view class="text" :style="'color:'+template.color.color3">{{item.introduce}}</view>
								<view class="boxs">
									<view class="price" :style="'color:'+template.color.color1">¥<text>{{item.mini_price}}</text></view>
									<view class="iconBox">
										<view class="icon">
											<icon @click.stop="addShopCar(hotGoods[index])" type="cart2" size="24" :color="template.color.color1"></icon>
										</view>
										<view class="icon" @click.stop="favGoodsTap(item.fav_status, item.id, 1)">
											<icon v-if="item.fav_status" type="loveb" size="23" :color="template.color.color1"></icon>
											<icon v-else type="lovea" size="23" :color="template.color.color1"></icon>
										</view>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view v-if="template.home.hgoods" class="goods">
				<view class="listBox" v-for="(item, index) in allGoods" :key="index">
					<view class="list" @click="getGoodsTap(item.id)">
						<view class="image">
							<image lazy-load mode="aspectFit" :src="item.pic" />
						</view>
						<view class="info">
							<view class="name" :style="'color:'+template.color.color2">{{item.title}}</view>
							<view class="boxs">
								<view class="price" :style="'color:'+template.color.color1">¥<text>{{item.mini_price}}</text></view>
								<view class="iconBox">
									<view class="icon">
										<icon @click.stop="addShopCar(allGoods[index])" type="cart2" size="19" :color="template.color.color1"></icon>
									</view>
									<view class="icon" @click.stop="favGoodsTap(item.fav_status, item.id, 2)">
										<icon v-if="item.fav_status" type="loveb" size="18" :color="template.color.color1"></icon>
										<icon v-else type="lovea" size="18" :color="template.color.color1"></icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue"
	const app = getApp();
	export default {
		components: {Icon},
		data() {
			return {
				windowWidth: this.windowWidth,
				WindowHeight: this.WindowHeight-100-(this.IphoneX>=0?73:60),
				template: uni.getStorageSync('__suyaTemplateConfig'),
				couponsInfo: '',
				hotGoods: [],
				allGoods: []
			}
		},
		onReady() {
			let self = this;
			let data = self.template;
			//展示推荐商品
			if(data.home.hrecommend){
				self.getHotGoodsList();
			}
			//展示全部商品
			if(data.home.hgoods){
				self.getAllGoodsList();
			}
			//展示优惠券
			if(data.home.coupons){
				self.getCouponsGoods();
			}
		},
		methods: {
			getCouponsGoods(){
				let self = this;
				let id = self.template.home.coupons;
				self.Post(self.Url.couponsGoods, {coupons_id: id}).then(res => {
					if(res.code === 0) {
						self.couponsInfo = res.data[0];
					}
				})
			},
			getHotGoodsList() {
				let self = this;
				self.Get(self.Url.goodsList, {recom: true}).then(res => {
					if(res.code === 0){
						self.hotGoods = res.data.list;
					}
				})
			},
			getAllGoodsList() {
				let self = this;
				self.Get(self.Url.goodsList, {}).then(res => {
					if(res.code === 0){
						self.allGoods = res.data.list;
					}
				})
			},
			getGoodsTap(id) {
				if(app.globalData.user){
					uni.navigateTo({url: '/pages/menu/detail?id='+id});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			favGoodsTap(status, id, type){
				let self = this;
				if(app.globalData.user){
					self.Get(self.Url.favoriteAdd, {id: id, type: !status}).then(res => {
						if(res.code == 0){
							if(status){
								uni.showToast({icon: 'none',title: '取消收藏'});
							}else{
								uni.showToast({icon: 'none',title: '收藏成功'});
							}
							if(type==1){
								self.getHotGoodsList();
							}else{
								self.getAllGoodsList();
							}
						}
					});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			addShopCar(data) {
				let self = this;
				if(app.globalData.user){
					if(data.specs_status){
						uni.navigateTo({url: '/pages/menu/detail?id='+data.id});
					}else{
						if(data.stock_number==0){
							uni.showToast({
								title: '商品库存不足',
								icon: 'none'
							})
							return
						}else{
							self.Get(self.Url.cartAdd, {id: data.id, number: 1}).then(res => {
								if(res.code == 0){
									uni.showToast({title: '加入成功'});
								}else{
									uni.showModal({content: res.msg, showCancel: false});
								}
							});
						}
					}
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getNewCouponsTap(id) {
				if(app.globalData.user){
					uni.navigateTo({url: '/pages/index/coupons?id='+id});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			}
		}
	}
</script>

<style scoped lang="less">
	page {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.header {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 200rpx;
		justify-content: center;

		.couponsBox {
			position: absolute;
			width: 160rpx;
			height: 160rpx;
			right: 30rpx;
			//border: 2rpx solid rgba(41, 53, 57, 0.4);
			top: 20rpx;
			background-color: #fff;

			.couponsLine {
				//border: 2rpx solid rgba(41, 53, 57, .4);
				width: 160rpx;
				height: 160rpx;
				margin-top: -8rpx;
				margin-left: -8rpx;
				background-color: #fff;
				position: relative;

				.coupons {
					width: 160rpx;
					height: 160rpx;
					//border: 2rpx solid rgba(41, 53, 57, .8);
					margin-top: -8rpx;
					margin-left: -8rpx;
					background-color: #fff;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.box{
						position: absolute;
						width: 100%;
						height: 100%;
						top: -8rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.price {
							width: 90%;
							margin: 0 auto;
							color: #293539;
							font-weight: 300;
							font-size: 30rpx;
							text-align: center;
							margin-bottom: -4rpx;
							text {
								font-size: 60rpx;
								padding-left: 4rpx;
							}
						}
						.name {
							width: 90%;
							margin: 0 auto;
							color: #293539;
							font-weight: 300;
							display: flex;
							align-items: center;
							justify-content: center;
							padding-bottom: 10rpx;
						}
					}
				}
				.coupons::before{
					content: '';
					position: absolute;
					width: 200%;
					height: 200%;
					top: -8rpx;
					border: 1px solid rgba(41, 53, 57, .8);
					transform-origin: 0 0;
					transform: scale(0.5, 0.5);  
					box-sizing: border-box;
					background-color: #fff;
				}
			}
			.couponsLine::before{
				content: '';
				position: absolute;
				width: 200%;
				height: 200%;
				border: 1px solid rgba(41, 53, 57, 0.4);
				transform-origin: 0 0;
				transform: scale(0.5, 0.5);  
				box-sizing: border-box;
			}
		}
		.couponsBox::before{
			content: '';
			position: absolute;
			width: 200%;
			height: 200%;
			border: 1px solid rgba(41, 53, 57, 0.4);
			transform-origin: 0 0;
			transform: scale(0.5, 0.5);  
			box-sizing: border-box;
		}
	}
	.goodsContent{
		width: 100%;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		.swiper {
			width: 100%;
			height: 840rpx;
			display: flex;
			align-items: center;
			justify-content: cebter;
		
			swiper {
				width: 100%;
				height: 100%;
		
				.goodsBox {
					width: 500rpx;
					margin: 0 auto;
					position: relative;
					height: 760rpx;
					box-shadow: 0 10rpx 20rpx 0 rgba(207, 201, 201, 0.5);
					margin-top: 36rpx;
					border-radius: 10rpx;
		
					.image {
						width: 500rpx;
						height: 500rpx;
						border-top-left-radius: 10rpx;
						border-top-right-radius: 10rpx;
						overflow: hidden;
						background-color: #f8f8f8;
					}
		
					.info {
						.name {
							color: #293539;
							font-size: 36rpx;
							width: 90%;
							margin: 0 auto;
							height: 80rpx;
							line-height: 80rpx;
							padding-top: 6px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-weight: 300;
						}
		
						.text {
							color: #6a7275;
							width: 90%;
							margin: 0 auto;
							font-size: 30rpx;
							font-weight: 300;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
		
						.boxs {
							display: flex;
							height: 126rpx;
							align-items: center;
							width: 90%;
							margin: 0 auto;
		
							.price {
								width: 50%;
								color: #f59072;
								font-size: 36rpx;
								font-weight: 300;
		
								text {
									font-size: 42rpx;
									padding-left: 4rpx;
								}
							}
		
							.iconBox {
								display: flex;
								height: 100rpx;
								align-items: center;
								justify-content: center;
								width: 50%;
		
								.icon {
									width: 80rpx;
									height: 80rpx;
									background-color: #f5f5f5;
									border-radius: 100%;
									display: flex;
									align-items: center;
									justify-content: center;
									margin-left: 26rpx;
								}
							}
						}
					}
		
				}
			}
		}
		.goods{
			display: flex;
			flex-wrap: wrap;
			width: 95%;
			margin: 0 auto;
			padding-top: 30rpx;
			padding-bottom: 36rpx;
			.listBox{
				flex: 0 0 50%;
				display: flex;
				overflow: hidden;
				justify-content: center;
				.list{
					width: 300rpx;
					border-radius: 10rpx;
					overflow: hidden;
					border:1px solid #f9f9f9;
					margin-bottom: 36rpx;
					padding: 10rpx;
					position: relative;
					box-shadow:0px 6rpx 20rpx rgba(207, 201, 201, 0.1);
					.image{
						width: 300rpx;
						height: 300rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background-color: #f8f8f8;
					}
					.info{
						.name {
							color: #293539;
							font-size: 30rpx;
							line-height: 70rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-weight: 300;
						}
						.boxs {
							display: flex;
							align-items: center;
								
							.price {
								width: 50%;
								color: #f59072;
								font-size: 36rpx;
								font-weight: 300;
								
								text {
									font-size: 32rpx;
								}
							}
								
							.iconBox {
								width: 50%;
								display: flex;
								align-items: center;
								justify-content: flex-end;
								.icon {
									width: 50rpx;
									height: 50rpx;
									//background-color: #f5f5f5;
									border-radius: 100%;
									display: flex;
									align-items: center;
									justify-content: center;
									margin-left: 16rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
