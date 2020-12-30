<template>
	<view class="content">
	    <view class="header">
	        <view class="title mtitle" :style="'color:'+template.color.color2">我的优惠
	        	<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
	        </view>
			<view class="menu lineBottom" :style="'color:'+template.color.color2">
				<view class="label" :class="current==1?'active':''" @click="selectMenuTap(1)">
					<text :style="current==1?'color:'+template.color.color1+';border-color:'+template.color.color1:''">未使用</text>
				</view>
				<view class="label" :class="current==2?'active':''" @click="selectMenuTap(2)">
					<text :style="current==2?'color:'+template.color.color1+';border-color:'+template.color.color1:''">已使用</text>
				</view>
				<view class="label" :class="current==3?'active':''" @click="selectMenuTap(3)">
					<text :style="current==3?'color:'+template.color.color1+';border-color:'+template.color.color1:''">已失效</text>
				</view>
			</view>
	    </view>
		<view style="height: 172rpx;"></view>
	    <view class="noneGoodsBox" v-if="couponList.length==0">
	        <view class="none">暂无相关优惠券<icon type="crilce" size="8"></icon></view>
	    </view>
	    <view class="coupons-list" v-else>
	        <view class="coupons-item" v-for="(item, index) in couponList" :key="index">
	            <view class="infoBox">
	                <view class="moneyLeft" :style="'color:'+template.color.color1">{{item.moneys}}<text>元</text></view>
	                <view class="moneyRight">
	                    <view class="name" :style="'color:'+template.color.color2">{{item.title}}</view>
	                    <view class="hold" :style="'color:'+template.color.color3">消费满{{item.min_money}}元使用</view>
	                </view>
	            </view>
	            <view class="footer" :style="'color:'+template.color.color5">
	                <view class="text">
						<text>{{item.end_time}}前有效</text>
					</view>
	                <view class="home">
						<text>{{item.goods_type==1?'全场商品可用':'限指定商品可用'}}</text>
					</view>
	            </view>
	        </view>
	    </view>
	    <!--
	    <view class="addBottom" bindtap="newCouponsTap">领取更多优惠券</view>
	    -->
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue"
	export default {
		components: {Icon},
		data() {
			return {
				template: uni.getStorageSync('__suyaTemplateConfig'),
				current: 1,
				couponList: []
			}
		},
		onLoad() {
			this.getCouponsUserList();
		},
		methods: {
			getCouponsUserList() {
				let self = this;
				self.Get(self.Url.couponsUserList, {status: self.current}).then(res => {
					if(res.code === 0){
						self.couponList = res.data;
					}else{
						self.couponList = [];
					}
				})
			},
			selectMenuTap(id) {
				this.current = id;
				this.getCouponsUserList();
			},
		}
	}
</script>

<style lang="less">
	.header{
		width: 100%;
		height: 172rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 1000;
		.menu{
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0 0;
			position: relative;
			.label{
				flex: 0 0 33.33333%;
				display: flex;
				align-items: center;
				justify-content: center;
				text{
					border-bottom: 4rpx solid #fff;
					padding: 0 10rpx;
					padding-bottom: 14rpx;
					font-weight: 300;
					font-size: 30rpx;
				}
			}
		}
	}
	.noneGoodsBox{
	    width:100%;
	    height:600rpx;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    .none{
	        font-size:38rpx;
	        color:#c5c9ca;
	        display:flex;
	        align-items:center;
	        justify-content:center;
	        position: relative;
	        font-weight: 300;
	        icon{
	            position: absolute;
	            right:-20rpx;
	        	top: 0;
	        }
	    }
	}
	.coupons-list{
	    width:90%;
	    margin:0 auto;
	    margin-top:50rpx;
	    .coupons-item{
	        background-color:#fff;
	        margin-bottom:40rpx;
	        border-radius:6rpx;
	        position:relative;
	        border:2rpx solid #f5f5f5;
	        display:flex;
	        flex-direction:column;
	        justify-content:center;
	        .infoBox{
	            display:flex;
	            padding: 22rpx 0;
	            align-items:center;
	            .moneyLeft{
	                width:180rpx;
	                align-items:center;
	                justify-content:center;
	                display:flex;
	                color:#f59072;
	                font-size:50rpx;
	                font-weight:300;
	                text{
	                    font-size:32rpx;
	                    padding-left:4rpx;
	                }
	            }
	            .moneyRight{
	                display:flex;
	                flex-direction:column;
	                width:480rpx;
	                justify-content:center;
	                .name{
	                    color:#293539;
	                    font-size:32rpx;
	                    font-weight:300;
						width: 90%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
	                }
	                .hold{
	                    color:#6a7275;
	                    font-size:28rpx;
	                    font-weight:300;
	                    padding-top:6rpx;
	                }
	            }
	        }
	        .footer{
	            display:flex;
	            align-items:center;
				font-size: 26rpx;
	            border-top:2rpx dashed #f5f5f5;
	            .text{
	                flex:0 0 60%;
	                height:60rpx;
	                align-items:center;
	                display:flex;
	                font-weight:300;
					text{
						padding-left: 20rpx;
					}
	            }
	            .home{
	                flex:0 0 40%;
	                display:flex;
	                align-items:center;
	                height:60rpx;
	                justify-content:flex-end;
	                padding-right:20rpx;
	                font-weight:300;
					text{
						padding-right: 20rpx;
					}
	            }
	        }
	    }
	}
	.addBottom{
	    background-color:#f59072;
	    width:300rpx;
	    height:70rpx;
	    margin:0 auto;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    color:#fff;
	    border-radius:100rpx;
	    margin-top:100rpx;
	    margin-bottom:100rpx;
	}
</style>
