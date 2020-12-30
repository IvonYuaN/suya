<template>
	<view class="content">
	    <view class="header">
	        <view class="title mtitle" :style="'color:'+template.color.color2">我的收藏
	        	<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
	        </view>
	    </view>
	    <view class="noneGoodsBox" v-if="favoriteList.length==0">
	        <view class="none">没有收藏过商品<icon type="crilce" size="8"></icon></view>
	    </view>
	    <view v-else class="goodsList">
	        <view class="listBox" v-for="(item, index) in favoriteList" :key="index">
	            <view class="list" @click="getGoodsTap(index)">
	                <view class="image">
	                    <image :src="item.pic" />
						<view class="none" v-if="!item.shelve_status">该商品已下架</view>
	                </view>
	                <view class="info">
	                    <view class="name" :style="'color:'+template.color.color2">{{item.title}}</view>
	                    <view class="priceBox">
	                        <view class="price" :style="'color:'+template.color.color1">¥<text>{{item.mini_price}}</text></view>
	                        <view class="sales" @click.stop="delFavoriteTap(item.id)">取消收藏</view>
	                    </view>
	                </view>
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
				favoriteList: []
			}
		},
		onShow() {
			this.getFavoriteList();
		},
		methods: {
			getFavoriteList() {
				let self = this;
				self.Get(self.Url.favoriteList, {}).then(res => {
					if(res.code === 0){
						self.favoriteList = res.data;
					}
				})
			},
			getGoodsTap(index) {
				let data = this.favoriteList[index];
				if(data.shelve_status){
					uni.navigateTo({url: '/pages/menu/detail?id='+data.id});
				}else{
					uni.showToast({title: '该商品已下架',icon: 'none'});
				}
			},
			delFavoriteTap(id) {
				let self = this;
				self.Get(self.Url.favoriteAdd, {id: id, type: false}).then(res => {
					if(res.code == 0){
						uni.showToast({icon: 'none',title: '取消收藏'});
						self.getFavoriteList();
					}
				});
			}
		}
	}
</script>

<style lang="less">
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
	            border:2rpx solid #f9f9f9;
	            border-radius:10rpx;
	            overflow:hidden;
	            box-shadow:0px 6rpx 20rpx rgba(207, 201, 201, 0.1);
	            margin-bottom:40rpx;
	            font-weight:300;
				padding: 10rpx;
	            .image{
	                width:300rpx;
	                height:300rpx;
	                background-color: #f5f5f5;
					position: relative;
					.none{
						position: absolute;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.3);
						top: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						font-size: 30rpx;
					}
	            }
	            .info{
					width: 100%;
	                .name{
	                    color:#293539;
	                    font-size:32rpx;
						line-height: 70rpx;
	                    width:95%;
	                    margin:0 auto;
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
</style>
