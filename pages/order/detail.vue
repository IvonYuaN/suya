<template>
	<view class="content">
	    <view class="header">
	        <view class="title mtitle" :style="'color:'+template.color.color2">订单详情
	        	<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
	        </view>
	    </view>
		<view class="detalisBox">
			<view class="addressBox lineBottom">
				<view class="aheader" :style="'color:'+template.color.color5">
					<text v-if="orderDetail.delivery_type==1">配送方式（快递物流）</text>
					<text v-if="orderDetail.delivery_type==2">配送方式（到店自提）</text>
					<text v-if="orderDetail.delivery_type==3">配送方式（无需配送）</text>
				</view>
				<view v-if="orderDetail.delivery_type==1" class="address">
					<view class="left">
						<view class="title" :style="'color:'+template.color.color2">{{orderDetail.address_data.cname}} / {{orderDetail.address_data.phone}}</view>
						<view class="text" :style="'color:'+template.color.color3">{{orderDetail.address_data.province.replace(/,/g,'')}}{{orderDetail.address_data.address}}</view>
					</view>
					<view class="right">
						<!--
						<view class="icon">
							<icon type="phone" size="20" color="#e2e2e2"></icon>
						</view>
						-->
					</view>
				</view>
				<view v-else class="address">
					<view class="left">
						<view class="title" :style="'color:'+template.color.color2">{{shopData.shop_name}}<text v-if="shopData.shop_phone"> / {{shopData.shop_phone}}</text></view>
						<view class="text" :style="'color:'+template.color.color3">{{shopData.shop_address}}</view>
					</view>
					<view class="right">
						<view v-if="shopData.shop_phone" class="icon" @click="getPhoneTap(shopData.shop_phone)">
							<icon type="phone" size="20" color="#e2e2e2"></icon>
						</view>
					</view>
				</view>
			</view>
			<view class="logistics lineBottom" v-if="orderDetail.logistics_time">
				<view class="lheader" :style="'color:'+template.color.color5">物流信息（{{orderDetail.logistics_time}}发货）</view>
				<view class="info">
					<view class="text" :style="'color:'+template.color.color3">物流公司：<text :style="'color:'+template.color.color2">{{orderDetail.logistics_name}}</text></view>
					<view class="text" :style="'color:'+template.color.color3">物流单号：<text :style="'color:'+template.color.color2">{{orderDetail.logistics_number}}</text></view>
				</view>
			</view>
			<view class="goodsList lineBottom">
				<view class="gheader" :style="'color:'+template.color.color5">商品列表（共{{orderDetail.goods_number}}件商品）</view>
				<view class="goods" v-for="(item, index) in orderDetail.goods_list" :key="index">
					<view class="left">
						<view class="image">
							<image :src="item.goods_pic" mode="aspectFit" lazy-load></image>
						</view>
					</view>
					<view class="right">
						<view class="name" :style="'color:'+template.color.color2">{{item.goods_title}}</view>
						<view class="label" :style="'color:'+template.color.color5">
							<text v-for="(value, name) in item.goods_spec_name" :key="name">{{name}}:{{value}}</text>
						</view>
						<view class="box">
							<view class="price" :style="'color:'+template.color.color1">¥<text>{{item.goods_price}}</text></view>
							<view class="number" :style="'color:'+template.color.color5">x{{item.buy_num}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="infoBox">
				<view class="iheader" :style="'color:'+template.color.color5">订单信息</view>
				<view class="label lineBottom">
					<view class="title" :style="'color:'+template.color.color3">订单状态</view>
					<view class="number" :style="'color:'+template.color.color2">
						<text v-if="orderDetail.order_status==0">待付款</text>
						<text v-if="orderDetail.order_status==1 && orderDetail.delivery_type==1">待发货</text>
						<text v-if="orderDetail.order_status==1 && orderDetail.delivery_type==2">待自提</text>
						<text v-if="orderDetail.order_status==1 && orderDetail.delivery_type==3">待确认</text>
						<text v-if="orderDetail.order_status==2">待收货</text>
						<text v-if="orderDetail.order_status==3 && orderDetail.evaluate_status">{{orderDetail.delivery_type==2?'已自提':'已完成'}}</text>
						<text v-if="orderDetail.order_status==3 && !orderDetail.evaluate_status">待评价</text>
						<text v-if="orderDetail.order_status==4 && !orderDetail.paypal_type">已过期</text>
						<text v-if="orderDetail.order_status==4 && orderDetail.paypal_type">已关闭</text>
					</view>
				</view>
				<view class="label lineBottom">
					<view class="title" :style="'color:'+template.color.color3">订单编号</view>
					<view class="number" :style="'color:'+template.color.color2">{{orderDetail.order_number}}</view>
				</view>
				<view class="label lineBottom">
					<view class="title" :style="'color:'+template.color.color3">下单时间</view>
					<view class="number" :style="'color:'+template.color.color2">{{orderDetail.create_time}}</view>
				</view>
				<view class="label lineBottom" v-if="orderDetail.paypal_time">
					<view class="title" :style="'color:'+template.color.color3">支付时间</view>
					<view class="number" :style="'color:'+template.color.color2">{{orderDetail.paypal_time}}</view>
				</view>
				<view class="label lineBottom" v-if="orderDetail.paypal_type">
					<view class="title" :style="'color:'+template.color.color3">支付方式</view>
					<view class="number" :style="'color:'+template.color.color2">
						<text v-if="orderDetail.paypal_type==1">微信支付</text>
						<text v-if="orderDetail.paypal_type==2">货到付款</text>
						<text v-if="orderDetail.paypal_type==3">余额支付</text>
						<text v-if="orderDetail.paypal_type==4">线下支付</text>
					</view>
				</view>
				<view class="label lineBottom">
					<view class="title" :style="'color:'+template.color.color3">商品合计<text>(共{{orderDetail.goods_number}}件商品)</text></view>
					<view class="number" :style="'color:'+template.color.color2">¥{{orderDetail.goods_total}}</view>
				</view>
				<view class="label lineBottom" v-if="orderDetail.coupons_money">
					<view class="title" :style="'color:'+template.color.color3">优惠抵扣<text>({{orderDetail.coupons_title}})</text></view>
					<view class="number" :style="'color:'+template.color.color2">-¥{{orderDetail.coupons_money}}</view>
				</view>
				<view class="label lineBottom" v-if="orderDetail.user_money">
					<view class="title" :style="'color:'+template.color.color3">会员折扣<text>({{orderDetail.user_level}}{{orderDetail.user_count*10}}折)</text></view>
					<view class="number" :style="'color:'+template.color.color2">-¥{{orderDetail.user_money}}</view>
				</view>
				<view class="label lineBottom" v-if="orderDetail.freight_money">
					<view class="title" :style="'color:'+template.color.color3">运费</view>
					<view class="number" :style="'color:'+template.color.color2">¥{{orderDetail.freight_money}}</view>
				</view>
				<view class="label">
					<view class="title" :style="'color:'+template.color.color3">合计</view>
					<view class="number" :style="'color:'+template.color.color1">¥{{orderDetail.total_money}}</view>
				</view>
			</view>
		</view>
		<view :style="'height:'+(IphoneX>=0?180:160)+'rpx;'"></view>
		<view class="footer" :class="IphoneX>=0?'footerX':''" v-if="!orderDetail.evaluate_status">
			<view class="buttonBox">
				<!--
				<view class="button" :style="'background-color:'+template.color.color1">支付订单</view>
				<view class="button" @click="getEvaluateTap()" :style="'background-color:'+template.color.color1">立即评价</view>
				-->
				<view v-if="orderDetail.order_status==0" class="button" @click="paypalPrderTap(orderDetail.id)" :style="'background-color:'+template.color.color1">
					立即支付 <countdown v-if="orderDetail.close_time_stamp" @callback="getOrderDetail()" :targetTime="orderDetail.close_time_stamp"></countdown>
				</view>
				<view v-if="orderDetail.order_status==1 && orderDetail.delivery_type==1" class="button" :style="'background-color:'+template.color.color5">待发货，点击联系客服<button open-type="contact"></button></view>
				<view v-if="orderDetail.order_status==1 && orderDetail.delivery_type==2" class="button" :style="'background-color:'+template.color.color1" @click="qrcodeTap(true)">出示提货码</view>
				<view v-if="orderDetail.order_status==1 && orderDetail.delivery_type==3" class="button" :style="'background-color:'+template.color.color5">待确认，点击联系客服<button open-type="contact"></button></view>
				<view v-if="orderDetail.order_status==2" class="button" :style="'background-color:'+template.color.color5" @click="copyOrderLogistics()">复制运单信息</view>
				<view v-if="orderDetail.order_status==2" class="button" :style="'background-color:'+template.color.color1" @click="confirmOrder()">确认收货</view>
				<view v-if="orderDetail.order_status==3 && !orderDetail.evaluate_status" class="button" :style="'background-color:'+template.color.color1" @click="evaluateGoods()">发表评价</view>
				<view class="button" :style="'color:#fff;background-color:'+template.color.color5+';border: none'" v-if="orderDetail.order_status===4" @click.stop="invalidOrder()">删除订单</view>
			</view>
		</view>
		
		
		<view class="showContent" :style="paypalShow?'bottom:0;':''">
			<view class="bg" @click="paypalPrderTap()"></view>
			<view class="showBox">
				<view class="pheader" :style="'color:'+template.color.color2">请选择支付方式</view>
				<view class="payTime" :style="'color:'+template.color.color3">
					剩余支付时间：<countdown v-if="orderDetail.close_time_stamp" :targetTime="orderDetail.close_time_stamp"></countdown>
				</view>
				<view class="paypalList">
					<view class="paypal lineBottom" v-for="(item, index) in shopData.shop_paypal" :key="index" v-if="item.lid!=5" @click="getPaypalOrder(item.lid)">
						<view class="left">
							<icon v-if="item.lid==1" type="weixinzhifu" size="30" color="#00c250"></icon>
							<icon v-if="item.lid==2" type="huodaofukuan" size="30" color="#ff9900"></icon>
							<icon v-if="item.lid==3" type="yuezhifu" size="30" :color="template.color.color1"></icon>
						</view>
						<view class="right">
							<view class="title" :style="'color:'+template.color.color2">{{item.cname}}</view>
							<view v-if="item.lid==1" class="info" :style="'color:'+template.color.color5">简单快捷，推荐使用</view>
							<view v-if="item.lid==2" class="info" :style="'color:'+template.color.color5">购物零风险，更安全</view>
							<view v-if="item.lid==3" class="info" :style="'color:'+template.color.color5">可用余额：¥{{userData.moneys}}</view>
						</view>
						<view class="icon">
							<icon type="right" size="18" color="#e2e2e2"></icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="showContent" :style="qrcodeShow?'bottom:0;':''">
			<view class="bg" @click="qrcodeTap(false)"></view>
			<view class="showBox" style="min-height: 550rpx;">
				<view class="pheader" :style="'color:'+template.color.color2">请向店员出示提货码</view>
				<view class="images">
					<image :src="imageQrPath" />
				</view>
				<view class="qrText" :style="'background-color:'+template.color.color4" @click="copyVerificationCode()">{{orderDetail.verification_code}}</view>
			</view>
		</view>
		<canvas canvas-id="canvas" style="position:fixed;left:-1000rpx;bottom:-1000rpx;width:200px;height:200px;opacity: 0;"></canvas>
	</view>
</template>

<script>
	import QRCode from '@/static/utils/qrcode.js'
	import Icon from "@/components/icon/icon.vue"
	import Countdown from "@/components/countdown/countdown.vue"
	export default {
		components: {Icon, Countdown},
		data() {
			return {
				IphoneX: this.IphoneX,
				template: uni.getStorageSync('__suyaTemplateConfig'),
				shopData: uni.getStorageSync('__suyaShopInfo'),
				orderId: 0,
				orderDetail: '',
				paypalShow: false,
				imageQrPath: '',
				qrcodeShow: false,
				userData: {
					moneys: 0,
					score: 0
				}
			}
		},
		onShow() {
			this.getOrderDetail();
		},
		onLoad(e) {
			let self = this;
			if(e.id){
				self.orderId = e.id;
			}
		},
		methods: {
			getUserDetails() {
				let self = this;
				self.Get(self.Url.userDetails, {}).then(res => {
					if(res.code === 0){
						self.userData = res.data;
					}
				});
			},
			getOrderDetail() {
				let self = this;
				self.Get(self.Url.orderDetail, {id: self.orderId}).then(res => {
					if(res.code === 0){
						self.orderDetail = res.data;
						self.getUserDetails();
					}
				})
			},
			qrcodeTap(status) {
				let self = this;
				if(status){
					let code = self.orderDetail.verification_code;
					QRCode.api.draw(code,'canvas',200,200);
					setTimeout(() => { self.canvasToQrTempImage();},300);
				}else{
					self.qrcodeShow = false;
				}
			},
			canvasToQrTempImage:function(){
			    let self = this;
			    wx.canvasToTempFilePath({
			        canvasId: 'canvas',
			        success: function (res) {
						self.imageQrPath = res.tempFilePath;
						self.qrcodeShow = true;
			        }
			    });
			},
			getPhoneTap(number) {
				uni.makePhoneCall({
				    phoneNumber: number
				});
			},
			paypalPrderTap(index) {
				if(index!=null){
					this.paypalShow = true;
				}else{
					this.paypalShow = false;
				}
			},
			getPaypalOrder(id) {
				let self = this;
				// 1 微信支付
				// 2 货到付款
				// 3 余额支付
				let postData = {
					pay_type: id,
					order_id: self.orderDetail.id,
					platform: 1,
				}
				if(id==3 && self.userData.moneys < self.orderDetail.total_money){
					uni.showModal({
						title: '余额支付提示',
						content: '您的可用余额不足以支付该订单，请更换其他支付方式',
						showCancel: false
					})
					return
				}
				self.Get(self.Url.orderPaypal, postData).then(res => {
					if(res.code === 0){
						if(id === 1){
							uni.requestPayment({
							    provider: 'wxpay',
							    timeStamp: res.data.wechat.timeStamp,
							    nonceStr: res.data.wechat.nonceStr,
							    package: res.data.wechat.package,
							    signType: res.data.wechat.signType,
							    paySign: res.data.wechat.paySign,
							    success: function (res) {
									uni.showToast({title: '微信支付成功'});
									self.getOrderDetail();
									self.paypalShow = false;
							    },
							    fail: function (err) {
							        uni.showModal({
							        	title: '支付失败',
										content: '订单支付失败，请重新进行支付。如针对订单金额有疑问请联系客服人员',
										showCancel: false
							        })
									return
							    }
							});
						}else if(id === 2){
							uni.showModal({
								title: '货到付款提示',
								content: '收货前请检查快递包装有无破损，如果需要拒收请先联系客服人员',
								showCancel: false
							})
							self.paypalShow = false;
							self.getOrderDetail();
							return
						}else if(id === 3){
							uni.showToast({title: '余额支付成功'});
							self.paypalShow = false;
							self.getOrderDetail();
						}
					}
				})
			},
			copyOrderLogistics() {
				let data = this.orderDetail;
				uni.setClipboardData({
				    data: data.logistics_name+'\r\n'+data.logistics_number,
				    success: function () {}
				});
			},
			copyVerificationCode() {
				let data = this.orderDetail;
				uni.setClipboardData({
				    data: data.verification_code,
				    success: function () {}
				});
			},
			invalidOrder() {
				let self = this;
				let id = self.orderDetail.id;
				uni.showModal({
					title: '删除确认',
					content: '删除订单后不可恢复，是否删除该订单？',
					success(ses) {
						if(ses.confirm){
							self.Get(self.Url.orderInvalid, {id: id}).then(res => {
								if(res.code === 0){
									uni.showToast({title: '订单删除成功'});
									setTimeout(function () {
										uni.navigateBack();
									}, 500);
								}
							});
						}
					}
				})
			},
			confirmOrder() {
				let self = this;
				self.Get(self.Url.orderConfirm, {id: self.orderDetail.id}).then(res => {
					if(res.code === 0){
						uni.showToast({title: '确认收货成功'});
						self.getOrderDetail();
					}
				});
			},
			evaluateGoods() {
				uni.navigateTo({url: '/pages/order/evaluate?id='+this.orderDetail.id});
			},
		}
	}
</script>

<style lang="less">
	.detalisBox{
		
		.addressBox{
			width: 90%;
			margin: 0 auto;
			padding-top: 30rpx;
			font-weight: 300;
			position: relative;
			padding-bottom: 20rpx;
			.aheader{
				font-size: 26rpx;
				padding-bottom: 10rpx;
			}
			.address{
				display: flex;
				align-items: center;
				.left{
					flex: 0 0 90%;
				}
				.right{
					flex: 0 0 10%;
					display: flex;
					justify-content: flex-end;
				}
			}
		}
		.logistics{
			width: 90%;
			margin: 0 auto;
			padding-top: 20rpx;
			font-weight: 300;
			position: relative;
			padding-bottom: 20rpx;
			.lheader{
				font-size: 26rpx;
				padding-bottom: 16rpx;
			}
			.info{
				.text{
					font-weight: 300;
					font-size: 26rpx;
					padding-bottom: 2rpx;
				}
			}
		}
		.goodsList{
			width: 90%;
			margin: 0 auto;
			padding-top: 20rpx;
			font-weight: 300;
			position: relative;
			padding-bottom: 2rpx;
			.gheader{
				font-size: 26rpx;
				padding-bottom: 16rpx;
			}
			.goods{
				display: flex;
				align-items: center;
				position: relative;
				padding: 0 0 16rpx;
				.left{
					flex: 0 0 20%;
					display: flex;
					align-items: center;
					.image{
						width: 110rpx;
						height: 110rpx;
						background-color: #f5f5f5;
						border: 1px solid #f5f5f5;
						border-radius: 6rpx;
						overflow: hidden;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				.right{
					flex: 0 0 80%;
					.name{
						font-weight: 300;
						font-size: 28rpx;
						width: 90%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.box{
						display: flex;
						align-items: center;
						padding-top: 10rpx;
						.price{
							font-size: 32rpx;
							font-weight: 300;
							flex: 0 0 50%;
						}
						.number{
							font-weight: 300;
							font-size: 30rpx;
							flex: 0 0 50%;
							display: flex;
							justify-content: flex-end;
						}
					}
				}
			}
		}
		.infoBox{
			width: 90%;
			margin: 0 auto;
			padding-top: 20rpx;
			font-weight: 300;
			position: relative;
			padding-bottom: 10rpx;
			.iheader{
				font-size: 26rpx;
				padding-bottom: 16rpx;
			}
			.label{
				display: flex;
				align-items: center;
				padding: 16rpx 0;
				position: relative;
				.title{
					flex: 0 0 40%;
					font-weight: 300;
					font-size: 26rpx;
					text{
						font-size: 24rpx;
						padding-left: 10rpx;
						color: #999;
					}
				}
				.number{
					flex: 0 0 60%;
					font-weight: 300;
					display: flex;
					justify-content: flex-end;
					font-size: 28rpx;
				}
			}
		}
	}
	.footer{
		display: flex;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		height: 100rpx;
		z-index: 999;
		box-shadow: 0 10rpx 20rpx rgba(0,0,0,.2);
		.buttonBox{
			display: flex;
			height: 100rpx;
			align-items: center;
			width: 100%;
			justify-content: center;
			.button{
				height: 60rpx;
				border-radius: 100rpx;
				color: #fff;
				align-items: center;
				justify-content: center;
				display: flex;
				font-weight: 300;
				margin: 0 10rpx;
				padding: 0 30rpx;
				position: relative;
				countdown{
					padding-left: 6rpx;
				}
				button{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}
	}
	.footerX{
		height: 130rpx;
	}
	
	.showContent{
		position: fixed;
		bottom: -2000rpx;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		transition: all .5s;
		.bg{
			position: absolute;
			z-index: 1001;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}
		.showBox{
			position: absolute;
			bottom: 0;
			width: 100%;
			min-height: 600rpx;
			z-index: 1002;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			box-shadow: 0 0 20rpx rgba(0,0,0,.08);
			.pheader{
				font-size: 32rpx;
				text-align: center;
				font-weight: 300;
				padding: 20rpx 0 10rpx;
			}
			.qrText{
				background-color: #CAB88F;
				width: 300rpx;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				border-radius: 6rpx;
				color: #fff;
				font-weight: 300;
				font-size: 30rpx;
			}
			.images{
				width: 400rpx;
				height: 350rpx;
				margin: 0 auto;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 400rpx;
					height: 400rpx;
				}
			}
			.payTime{
				text-align: center;
				padding: 20rpx 0 0;
				font-weight: 300;
			}
			.paypalList{
				padding-top: 20rpx;
				.paypal{
					display: flex;
					align-items: center;
					width: 90%;
					margin: 0 auto;
					position: relative;
					padding: 20rpx 0;
					.left{
						flex: 0 0 18%;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.right{
						flex: 0 0 75%;
						font-weight: 300;
						.info{
							font-size: 26rpx;
						}
					}
					.icon{
						flex: 0 0 7%;
					}
				}
			}
		}
	}
</style>
