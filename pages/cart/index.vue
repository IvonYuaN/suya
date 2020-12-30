<template>
	<view class="content">
		<view class="header">
		    <view class="title" :style="'color:'+template.color.color2">{{template.cart.ctitle}}
		    	<icon class="circular" type="crilce" size="14" :color="template.color.color1"></icon>
		    </view>
		</view>
		<view v-if="goodsList.list.length==0" class="noneGoodsBox">
		    <view class="none">购物车空空的<icon class="icon" type="crilce" size="8"></icon></view>
		</view>
		<view v-else class="goodsCartList">
			<view class="goods lineBottom" v-for="(item, index) in goodsList.list" :key="index" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-index="index" @click="selectGoods(index)" :style="item.left">
				<view class="left">	
					<view class="image">
						<image :src="item.pic" lazy-load />
						<view v-if="!item.shelve_status" class="none">已下架</view>
						<view v-if="item.stock_number==0" class="none">库存不足</view>
						<icon v-if="item.active" class="select" type="xuanzhong" size="32" :color="template.color.color1"></icon>
					</view>
					<view class="texts">
						<view class="title" :style="'color:'+template.color.color2">{{item.title}}</view>
						<view class="label" :style="'color:'+template.color.color5">
							<text v-for="(value, name) in item.spec_name" :key="name">{{name}}:{{value}}</text>
						</view>
						<view class="foobox">
							<view class="price" :style="'color:'+template.color.color1">¥<text>{{item.mini_price}}</text></view>
							<view class="numbox">
								<view v-if="item.shelve_status && item.stock_number>0" class="buy">
									<view class="btn" @click.stop="editGoods(index, 'jian')">
										<icon type="shuliangjian" size="25" :color="item.num==1?template.color.color5:template.color.color1"></icon>
									</view>
									<view class="input">
										<input type="number" disabled :value="item.num" :style="'color:'+template.color.color2" />
									</view>
									<view class="btn" @click.stop="editGoods(index, 'jia')">
										<icon type="shuliangjia" size="25" :color="item.num>=item.stock_number?template.color.color5:template.color.color1"></icon>
									</view>
								</view>
								<view v-else-if="item.shelve_status && item.stock_number==0" class="none">该商品已售罄</view>
								<view v-else class="none">该商品已下架</view>
							</view>
						</view>
					</view>
				</view>
				<view class="right" :style="'background-color:'+template.color.color1">
					<view class="del" @click.stop="delCartGoods(item.id, item.spec_id)">
						<icon type="shanchu" size="20" color="#fff"></icon>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="template.cart.random && goodsList.list.length==0" class="random" @click="goodsRandom()">
			<icon :type="randomNum==0?'wenhao':'touzi'+randomNum" size="50" :color="template.color.color1"></icon>
		    <text :style="'color:'+template.color.color1">{{randomNum!=0?'继续随机模式':'试试随机模式'}}</text>
		</view>
		<view class="footer" v-if="goodsList.list.length>0" :class="IphoneX>=0?'footerX':''">
			<view class="left">
				<view class="total">
					<view class="number" :style="'color:'+template.color.color1">共{{goodsList.totalNumber}}件，合计¥{{goodsList.totalPrice}}</view>
					<view class="text">商品合计不含运费</view>
				</view>
			</view>
			<view class="right" v-if="goodsList.selectGoods" @click="toPaypalTap()" :style="'background-color:'+template.color.color1">去结算</view>
			<view class="right" v-else :style="'background-color:'+template.color.color5">去结算</view>
		</view>
		<view v-if="template.cart.cgoods" class="goodsBox">
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
								<view class="icon" @click.stop="favGoodsTap(item.fav_status, item.id)">
									<icon v-if="item.fav_status" type="loveb" size="18" :color="template.color.color1"></icon>
									<icon v-else type="lovea" size="18" :color="template.color.color1"></icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
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
				randomNum: 0,
				goodsList: {
					totalPrice: 0,
					totalNumber: 0,
					selectGoods: false,
					list: []
				},
				IphoneX: this.IphoneX,
				allGoods: [],
				startX: 0,
				delBtnWidth: 120,
			}
		},
		onReady() {
			let self = this;
			let data = self.template;
			if(data.cart.cgoods){
				self.getGoodsList();
			}
			self.getCardList();
			self.initEleWidth();
		},
		methods: {
			getCardList() {
				let self = this;
				self.Get(self.Url.cartList, {}).then(res => {
					if(res.code === 0){
						let data = res.data;
						let list = [];
						data.forEach(res => {
							if(res.shelve_status && res.stock_number>0){
								res.active = true;
								list.push(res.id);
							}
						})
						self.goodsList.list = data;
						if(list.length>0){
							self.goodsList.selectGoods = true;
						}else{
							self.goodsList.selectGoods = false;
						}
						self.totalPrice();
						self.randomNum = 0;
					}
				})
			},
			totalPrice() {
				let self = this;
				let data = self.goodsList.list;
				let price = 0;
				let number = 0;
				let list = [];
				data.forEach(res => {
					if(res.active){
						number += res.num;
						price += res.num * res.mini_price;
						list.push(res.id);
					}
				})
				self.goodsList.totalPrice = price;
				self.goodsList.totalNumber = number;
				if(list.length>0){
					self.goodsList.selectGoods = true;
				}else{
					self.goodsList.selectGoods = false;
				}
			},
			initEleWidth() {
			    let delBtnWidth = this.getEleWidth(this.delBtnWidth);
				this.delBtnWidth = delBtnWidth;
			},
			getEleWidth (w) {
			    let real = 0;
			    try {
			        let res = this.windowWidth;
			        let scale = 750 / 2 / (w / 2);
			        real = Math.floor(res / scale);
			        return real;
			    }catch(e){
			        return false;
			    }
			},
			touchS(e) {
				if (e.touches.length == 1) {
					this.startX = e.touches[0].clientX;
				}
			},
			touchM(e) {
				let self = this;
				let index = e.currentTarget.dataset.index;
				if (e.touches.length == 1) {
				    let moveX = e.touches[0].clientX;
				    let disX = self.startX - moveX;
				    let delBtnWidth = self.delBtnWidth;
				    let left = "";
				    if (disX == 0 || disX < 0) {
				        left = "margin-left:0";
				    } else if (disX > 0) {
				        left = "margin-left:-120rpx";
				        if (disX >= delBtnWidth) {
							left = "margin-left:-120rpx";
				        }
				    }
				    self.goodsList.list[parseInt(index)].left = left;
				    self.$set(self.goodsList.list, parseInt(index), self.goodsList.list[parseInt(index)]);
				}
			},
			touchE(e) {
				let self = this;
				let index = e.currentTarget.dataset.index;
				if (e.changedTouches.length == 1) {
				    let endX = e.changedTouches[0].clientX;
				    let disX = self.startX - endX;
				    let delBtnWidth = self.delBtnWidth;
				    let left =
				        disX > delBtnWidth / 2
				        ? "margin-left:-60px"
				        : "margin-left:0px";
				    self.goodsList.list[parseInt(index)].left = left;
				    self.$set(self.goodsList.list, parseInt(index), self.goodsList.list[parseInt(index)]);
				}
			},
			getGoodsList() {
				let self = this;
				let data = self.template;
				let post = {};
				if(data.cart.cgoods==1){
					post.recom = true;
				}
				self.Get(self.Url.goodsList, post).then(res => {
					if(res.code === 0){
						self.allGoods = res.data.list;
					}
				})
			},
			goodsRandom() {
				let self = this;
				let number = Math.floor(Math.random() * 6);
				let random = number+1;
				self.Get(self.Url.cartRandom, {number: random}).then(res => {
					if(res.code === 0){
						self.getCardList();
					}else{
						uni.showModal({content: res.msg,showCancel: false});
					}
				})
			},
			editGoods(index, type) {
				let self = this;
				let data = self.goodsList.list[index];
				if(type=='jian'){
					if(data.num>1){
						self.editCartGoods(data.id, data.num-1, data.spec_id);
					}
				}else if(type=='jia'){
					if(data.num == data.stock_number){
						uni.showModal({
							title: '库存不足',
							content: '购买数量已经超过最大库存数量',
							showCancel: false
						})
						return
					}else{
						self.editCartGoods(data.id, data.num+1, data.spec_id);
					}
				}
			},
			delCartGoods(id, spec) {
				let self = this;
				uni.showModal({
					title: '删除商品',
					content: '是否删除购物车内的此商品？',
					success(ces) {
						if(ces.confirm){
							self.editCartGoods(id, 0, spec);
						}
					}
				})
			},
			editCartGoods(id, number, spec) {
				let self = this;
				let postData = {
					id: id, 
					number: number
				}
				if(spec){
					postData.spec = spec;
				}
				self.Get(self.Url.cartEdit, postData).then(res => {
					if(res.code === 0){
						self.getCardList();
					}else{
						uni.showModal({
							content: res.msg,
							showCancel: false
						});
					}
				})
			},
			selectGoods(index) {
				let self = this;
				let data = self.goodsList.list[index];
				if(data.shelve_status && data.stock_number>0){
					self.goodsList.list[index].active = !self.goodsList.list[index].active;
					self.totalPrice();
				}
			},
			favGoodsTap(status, id){
				let self = this;
				if(app.globalData.user){
					self.Get(self.Url.favoriteAdd, {id: id, type: !status}).then(res => {
						if(res.code == 0){
							if(status){
								uni.showToast({icon: 'none',title: '取消收藏'});
							}else{
								uni.showToast({icon: 'none',title: '收藏成功'});
							}
							self.getGoodsList();
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
									self.getCardList();
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
			getGoodsTap: function (id) {
				uni.navigateTo({
					url: '/pages/menu/detail?id='+id
				})
			},
			toPaypalTap() {
				let self = this;
				let list = [];
				let data = self.goodsList.list;
				data.forEach(res => {
					if(res.active){
						list.push(res)
					}
				})
				uni.setStorage({key: '__suyaShopCart',data: list});
				uni.navigateTo({url: '/pages/order/paypal'});
			}
		}
	}
</script>

<style lang="less">
	.noneGoodsBox{
	    width:100%;
	    height:300rpx;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    font-weight: 300;
	    .none{
	        font-size:38rpx;
	        color:#c5c9ca;
	        position: relative;
	        .icon{
	            position: absolute;
				margin-left: 6rpx;
	        }
	    }
	}
	.goodsCartList{
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 30rpx;
		overflow: hidden;
		.goods{
			display: flex;
			justify-content:space-between;
			width: 870rpx;
			box-sizing: border-box;
			transition: margin-left 0.2s ease-in-out;
			position: relative;
			//border-bottom: 1px dashed #f5f5f5;
			.left{
				display:flex;
				justify-content:space-between;
				width:750rpx;
				box-sizing:border-box;
				padding: 30rpx;
				.image{
					width:170rpx;
					height:170rpx;
					overflow:hidden;
					margin-right:20rpx;
					border-radius:6rpx;
					position: relative;
					border:1px solid #f9f9f9;
					image{
						width: 100%;
						height: 100%;
					}
					.select{
						position: absolute;
						right: 0;
						top: 0;
					}
					.none{
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						color: #fff;
						background-color: rgba(0,0,0,.4);
						font-weight: 300;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
				.texts{
					width: 500rpx;
					position: relative;
					font-weight: 300;
					.title{
						font-size:32rpx;
						color:#293529;
						text-overflow:ellipsis;
						white-space:nowrap;
						overflow:hidden;
					}
					.label{
						width: 100%;
						height: 50rpx;
						display: flex;
						align-items: center;
						text{
							padding-right: 10rpx;
						}
					}
					.foobox{
						display: flex;
						align-items: center;
						padding-top: 10rpx;
						.price{
							font-size:38rpx;
							color:#f59072;
							flex: 0 0 40%;
						}
						.numbox{
							flex: 0 0 60%;
							display: flex;
							align-items: center;
							justify-content: flex-end;
							.buy{
								display: flex;
								align-items: center;
								.btn{
									
								}
								.input{
									width: 90rpx;
									input{
										width: 100%;
										height: 50rpx;
										text-align: center;
										font-size: 30rpx;
									}
								}
							}
							.none{
								color: #999;
								font-size: 26rpx;
							}
						}
					}
				}
			}
			.right{
				width: 120rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				.del{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					text{
						color: #fff;
						font-weight: 300;
						font-size: 26rpx;
						padding-top: 12rpx;
					}
				}
			}
		}
	}
	.footer{
		display: flex;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 120rpx;
		height: 100rpx;
		align-items: center;
		z-index: 999;
		box-shadow: 0 10rpx 20rpx rgba(0,0,0,.1);
		.left{
			flex: 0 0 65%;
			height: 100%;
			display: flex;
			align-items: center;
			.total{
				display: flex;
				flex-direction: column;
				padding-left: 20rpx;
				justify-content: center;
				.number{
					font-weight: 300;
					font-size: 28rpx;
				}
				.text{
					color: #999;
					font-size: 24rpx;
					font-weight: 300;
				}
			}
		}
		.right{
			flex: 0 0 35%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 32rpx;
			font-weight: 300;
		}
	}
	.footerX{
		bottom: 146rpx;
	}
	.random{
	    display:flex;
	    flex-direction:column;
	    align-items:center;
	    justify-content:center;
	    width:100%;
	    margin:0 auto;
	    height:200rpx;
	    text{
	        color:#f59072;
	        font-size:28rpx;
	        padding-top:10rpx;
	        font-weight: 300;
	    }
	}
	.goodsBox{
		display: flex;
		flex-wrap: wrap;
		width: 95%;
		margin: 0 auto;
		padding-top: 50rpx;
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
</style>
