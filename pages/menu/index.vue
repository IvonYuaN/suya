<template>
	<view class="content">
		<view class="header">
		    <view class="title" :style="'color:'+template.color.color2">{{template.menu.mtitle}}
		    	<icon class="circular" type="crilce" size="14" :color="template.color.color1"></icon>
		    </view>
		</view>
		<view class="search">
			<input placeholder="搜索商品" v-model="keywords" confirm-type="search" @confirm="searchKeywords()" :style="'color:'+template.color.color2" />
		</view>
		<view v-if="template.menu.mstyle==1" class="menuBox">
		    <view class="menu" v-for="(item, index) in categories" :key="index">
		        <view class="title" :class="cateNum==index?'hover':''" :style="cateNum==index?'color:'+template.color.color1:'color:'+template.color.color2" @click="getCategories(index)">
					<icon v-if="cateNum==index" class="l" type="crilce" size="6" :color="template.color.color1"></icon>
		            {{item.title}}
					<icon v-if="cateNum==index" class="r" type="crilce" size="6" :color="template.color.color1"></icon>
		        </view>
		        <view class="goodsList" v-if="cateNum==index">
		            <view class="goods" v-for="(itm, idx) in item.list" :key="idx" @click="getMenuList(itm.id, itm.title)">
		                <image lazy-load mode="aspectFit" :src="itm.icon" />
		                <text :style="'color:'+template.color.color3">{{itm.title}}</text>
		            </view>
		        </view>
		    </view>
		</view>
		<view v-if="template.menu.mstyle==2" class="moreMenuBox" :style="'height:'+(template.menu.msearch?WindowHeight-50:WindowHeight)+'px;'">
			<view class="left">
				<view class="menu" :class="cateNum==index?'hover':''" v-for="(item, index) in categories" :key="index" @click="getCategories(index)">
					<icon v-if="cateNum==index" class="l" type="crilce" size="6" :color="template.color.color1"></icon>
					<text :style="cateNum==index?'color:'+template.color.color1:'color:'+template.color.color2">{{item.title}}</text>
					<icon v-if="cateNum==index" class="r" type="crilce" size="6" :color="template.color.color1"></icon>
				</view>
			</view>
			<scroll-view class="right" scroll-y :style="'height:'+(template.menu.msearch?WindowHeight-50:WindowHeight)+'px;'">
				<view class="goodsList">
					<view class="goods" v-for="(item, index) in categories[cateNum].list" :key="index" @click="getMenuList(item.id, item.title)">
						<image lazy-load mode="aspectFit" :src="item.icon" />
						<text :style="'color:'+template.color.color3">{{item.title}}</text>
					</view>
				</view>
				<view style="height: 100rpx;"></view>
			</scroll-view>
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
				WindowHeight: this.WindowHeight-62-(this.IphoneX>=0?73:60),
				template: uni.getStorageSync('__suyaTemplateConfig'),
				cateNum: 0,
				categories: [],
				keywords: ''
			}
		},
		onReady() {
			this.getCategoryList();
		},
		methods: {
			getCategoryList() {
				let self = this;
				uni.showLoading({title: '加载中...'});
				self.Get(self.Url.categoryList, {}).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						self.categories = res.data;
					}
				})
			},
			getCategories(index) {
				this.cateNum = index;
			},
			getMenuList(id, title) {
				uni.navigateTo({url: '/pages/menu/list?id='+id+'&name='+title});
			},
			searchKeywords() {
				let self= this;
				if(self.keywords){
					uni.navigateTo({url: '/pages/menu/search?key='+self.keywords})
				}else{
					uni.showToast({title: '请输入搜索信息', icon: 'none'});
				}
			}
		}
	}
</script>

<style lang="less">
	.menuBox{
	    width:85%;
	    margin:0 auto;
	    text-align:center;
	    margin-top:50rpx;
	    .menu{
	        margin-top: 40rpx;
	        .title{
	            color:#293539;
	            font-size:36rpx;
	            font-weight:300;
	            letter-spacing:10rpx;
	            position: relative;
	        }
	        .hover{
	            color:#f59072;
	            .l{
	                position:absolute;
	                margin-left:-34rpx;
	                margin-top:20rpx;
	            }
	            .r{
	                position:absolute;
	                margin-left:6rpx;
	                margin-top:20rpx;
	            }
	        }
	        .goodsList{
	            overflow-x: scroll;
	            margin-top: 30rpx;
	            white-space:nowrap;
	            text-overflow:ellipsis;
	            -webkit-overflow-scrolling: touch;
	            .goods{
	                width:130rpx;
	                height:200rpx;
	                display:inline-block;
	                margin-right:20rpx;
					position: relative;
					image{
					    width:130rpx;
					    height:130rpx;
					    margin:0 auto;
					    //border-radius:10rpx;
						position: relative;
					    //border:2rpx solid #f5f5f5;
					}
					image::before{
						content: '';
						position: absolute;
						left: 0;
						top: 0;
						width: 200%;
						height: 200%;
						border: 1px solid #f2f2f2;
						border-radius:10rpx;
						transform-origin: 0 0;
						transform: scale(0.5, 0.5);
						box-sizing: border-box;
					}
	                text{
	                    height:60rpx;
	                    display:flex;
	                    align-items:center;
	                    justify-content:center;
	                    font-size:28rpx;
	                    color:#979d9f;
	                    font-weight:300;
	                    white-space: nowrap;
	                    overflow: hidden;
	                    text-overflow: ellipsis;
	                }
	            }
	        }
	    }
	}
	.search{
		width: 85%;
		margin: 0 auto;
		border: 1px solid #f2f2f2;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100rpx;
		margin-top: 30rpx;
		input{
			width: 90%;
			height: 100%;
			text-align: center;
			font-weight: 300;
		}
	}
	.moreMenuBox{
		width: 100%;
		display: flex;
		overflow: hidden;
		.left{
			flex: 0 0 30%;
			padding-top: 30rpx;
			overflow-x: scroll;
			-webkit-overflow-scrolling: touch;
			.menu{
				padding: 24rpx 0;
				font-size: 32rpx;
				text-align: center;
				font-weight: 300;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				position: relative;
				.l{
				    margin-top: 16rpx;
				    position: absolute;
				    margin-left: -20rpx;
				}
				.r{
				    position: absolute;
				    margin-left: 8rpx;
				    margin-top: 16rpx;
				}
			}
		}
		.right{
			flex: 0 0 70%;
			padding-top: 30rpx;
			.goodsList{
				width: 92%;
				margin: 0 10rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				.goods{
				    width:140rpx;
				    height:220rpx;
				    display:inline-block;
					position: relative;
				    image{
				        width:136rpx;
				        height:136rpx;
				        margin:0 auto;
				        //border-radius:10rpx;
						position: relative;
				        //border:2rpx solid #f5f5f5;
				    }
					image::before{
						content: '';
						position: absolute;
						left: 0;
						top: 0;
						width: 200%;
						height: 200%;
						border: 1px solid #f2f2f2;
						border-radius:10rpx;
						transform-origin: 0 0;
						transform: scale(0.5, 0.5);
						box-sizing: border-box;
					}
				    text{
				        height:60rpx;
				        display:flex;
				        align-items:center;
				        justify-content:center;
				        font-size:28rpx;
				        color:#979d9f;
				        font-weight:300;
				        white-space: nowrap;
				        overflow: hidden;
				        text-overflow: ellipsis;
				    }
				}
			}
		}
	}
</style>
