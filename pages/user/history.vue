<template>
	<view class="content">
	    <view class="header">
	        <view class="title mtitle" :style="'color:'+template.color.color2">我的足迹
	        	<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
	        </view>
	    </view>
		<view class="noneGoodsBox" v-if="historyList.length==0">
		    <view class="none">暂无浏览足迹<icon type="crilce" size="8"></icon></view>
		</view>
		<view v-else class="goodsList" v-for="(item, index) in historyList" :key="index">
			<view class="gheader lineBottom">
				<view class="date" :style="'color:'+template.color.color3">{{item.days}}</view>
				<view class="btn" :style="'color:'+template.color.color5" @click="delHistoryAll(index)">删除当天记录</view>
			</view>
			<view class="list">
				<view class="goods" v-for="(itm, idx) in item.list" :key="idx" @click="getGoodsTap(index, idx)">
					<view class="left">
						<view class="image">
							<image :src="itm.pic" mode="aspectFit" lazy-load></image>
							<view class="text" v-if="!itm.shelve_status">已下架</view>
						</view>
					</view>
					<view class="right">
						<view class="name" :style="'color:'+template.color.color2">{{itm.title}}</view>
						<view class="price" :style="'color:'+template.color.color1">¥<text>{{itm.mini_price}}</text></view>
						<view class="box">
							<view class="time" :style="'color:'+template.color.color5">{{itm.update_time}}浏览</view>
							<view class="number" :style="'color:'+template.color.color5" @click.stop="delHistoryTap(index, idx)">删除记录</view>
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
				historyList: []
			}
		},
		onLoad() {
			let self = this;
			self.getHistoryList();
		},
		methods: {
			getHistoryList() {
				let self = this;
				self.Get(self.Url.historyList, {}).then(res => {
					if(res.code === 0){
						self.historyList = res.data;
					}else{
						self.historyList = [];
					}
				})
			},
			delHistoryAll(index) {
				let self = this;
				let data = self.historyList[index];
				uni.showModal({
					title: '删除浏览足迹',
					content: '是否删除当天全部浏览记录？',
					success(res) {
						if(res.confirm){
							let list = [];
							data.list.forEach(les => {
								list.push(les.id)
							});
							self.Post(self.Url.addHistory, {id: list, type: false, date: data.days}).then(his => {
								if(his.code === 0){
									uni.showToast({title: '记录删除成功'});
									self.getHistoryList();
								}else{
									uni.showModal({
										title: '删除提示',
										content: his.msg,
										showCancel: false
									})
								}
							})
						}
					}
				})
			},
			delHistoryTap(index, idx) {
				let self = this;
				let data = self.historyList[index];
				self.Post(self.Url.addHistory, {id: [data.list[idx].id], type: false, date: data.days}).then(his => {
					if(his.code === 0){
						uni.showToast({title: '删除成功'});
						self.getHistoryList();
					}else{
						uni.showModal({
							title: '删除提示',
							content: his.msg,
							showCancel: false
						})
					}
				})
			},
			getGoodsTap(index, idx) {
				let self = this;
				let data = self.historyList[index].list[idx];
				if(data.shelve_status){
					uni.navigateTo({url: '/pages/menu/detail?id='+data.id});
				}else{
					uni.showToast({title: '该商品已下架',icon: 'none'});
				}
			}
		}
	}
</script>

<style lang="less">
	.goodsList{
		width: 90%;
		margin: 0 auto;
		padding-top: 30rpx;
		.gheader{
			position: relative;
			display: flex;
			align-items: center;
			height: 70rpx;
			font-weight: 300;
			.date{
				flex: 0 0 70%;
			}
			.btn{
				flex: 0 0 30%;
				font-size: 26rpx;
				display: flex;
				justify-content: flex-end;
			}
		}
		.list{
			font-weight: 300;
			.goods{
				display: flex;
				align-items: center;
				padding: 16rpx 0;
				border-bottom: 1px dashed #f5f5f5;
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
						position: relative;
						image{
							width: 100%;
							height: 100%;
						}
						.text{
							position: absolute;
							top: 0;
							left: 0;
							background-color: rgba(0,0,0,.4);
							width: 100%;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							color: #fff;
							font-size: 26rpx;
						}
					}
				}
				.right{
					flex: 0 0 80%;
					.name{
						width: 90%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.box{
						width: 100%;
						display: flex;
						align-items: center;
						font-size: 24rpx;
						.time{
							flex: 0 0 80%;
						}
						.number{
							flex: 0 0 20%;
							display: flex;
							justify-content: flex-end;
						}
					}
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
</style>
