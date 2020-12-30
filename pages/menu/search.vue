<template>
	<view class="content">
		<view class="header">
		    <view class="title mtitle" :style="'color:'+template.color.color2">搜索
		    	<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
		    </view>
		</view>
		<view class="search">
			<input placeholder="搜索商品" v-model="keywords" confirm-type="search" @confirm="getGoodsList()" :style="'color:'+template.color.color2" />
			<icon class="del" v-if="keywords" type="shanchu1" size="23" @click="delKeywprds()" :color="template.color.color1"></icon>
		</view>
		<view class="goodsList">
		    <view class="listBox" v-for="(item, index) in goodsList" :key="index">
		        <view class="list" @click="getGoodsTap(item.id)">
		            <view class="image">
		                <image lazy-load mode="aspectFit" :src="item.pic" />
		            </view>
		            <view class="info">
		                <view class="name" :style="'color:'+template.color.color2">{{item.title}}</view>
		                <view class="priceBox">
		                    <view class="price" :style="'color:'+template.color.color1">¥<text>{{item.mini_price}}</text></view>
		                    <view class="sales" :style="'color:'+template.color.color5">已售{{item.views_see}}</view>
		                </view>
		            </view>
		        </view>
		    </view>
		    <view class="noneGoodsList" v-if="goodsList.length==0">
		        <view class="none" :style="'color:'+template.color.color5">
					暂无相关商品<icon class="icon" type="crilce" size="8"></icon>
				</view>
		    </view>
		</view>
		
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue"
	export default {
		components: {Icon},
		data() {
			return {
				template: uni.getStorageSync('__suyaTemplateConfig'),
				keywords: '',
				goodsList: []
			}
		},
		onLoad(e) {
			let self = this;
			self.keywords = e.key;
			self.getGoodsList();
		},
		methods: {
			getGoodsList() {
				let self = this;
				uni.showLoading({title: '加载中...'});
				self.Get(self.Url.goodsList, {keywords: self.keywords}).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						self.goodsList = res.data.list;
					}
				})
			},
			delKeywprds() {
				this.keywords = '';
				this.getGoodsList();
			},
			getGoodsTap: function (id) {
				uni.navigateTo({
					url: '/pages/menu/detail?id='+id
				})
			}
		}
	}
</script>

<style lang="less">
	.search{
		width: 92%;
		margin: 0 auto;
		border: 1px solid #f2f2f2;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100rpx;
		margin-top: 30rpx;
		position: relative;
		input{
			width: 80%;
			height: 100%;
			text-align: center;
			font-weight: 300;
		}
		.del{
			position: absolute;
			right: 20rpx;
		}
	}
	.goodsList{
	    display:flex;
	    flex-wrap:wrap;
	    width:95%;
	    margin:0 auto;
	    margin-top:30rpx;
	    .listBox{
	        flex: 0 0 50%;
	        .list{
	            width:300rpx;
	            display:flex;
	            flex-direction:column;
	            margin:0 auto;
	            border:1px solid #f9f9f9;
	            border-radius:10rpx;
	            overflow:hidden;
	            box-shadow:0px 6rpx 20rpx rgba(207, 201, 201, 0.1);
	            margin-bottom:36rpx;
	            font-weight:300;
				padding: 10rpx;
	            .image{
	                width:300rpx;
	                height:300rpx;
	                background-color: #f5f5f5;
	            }
	            .info{
	
	                .name{
	                    color:#293539;
	                    font-size:30rpx;
	                    height:60rpx;
						line-height: 60rpx;
	                    width:95%;
	                    margin:0 auto;
	                    padding-top:6rpx;
	                    white-space: nowrap;
	                    overflow: hidden;
	                    text-overflow: ellipsis;
	                }
	                .priceBox{
	                    display:flex;
	                    height:50rpx;
	                    width:95%;
	                    margin:0 auto;
	                    align-items:flex-start;
	                    .price{
	                        width:50%;
	                        color:#f59072;
	                        font-size:32rpx;
	                        text{
	                            font-size:36rpx;
	                            padding-left:4rpx;
	                        }
	                    }
	                    .sales{
	                        width:50%;
	                        color:#979d9f;
	                        font-size:26rpx;
	                        height:50rpx;
	                        display:flex;
	                        align-items:center;
	                        justify-content:flex-end;
	                    }
	                }
	            }
	        }
	    }
	}
	.noneGoodsList{
	    width:100%;
	    height:600rpx;
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
</style>
