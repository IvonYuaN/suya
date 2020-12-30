<template>
	<view class="content">
	    <view class="header">
	        <view class="title mtitle" :style="'color:'+template.color.color2">发表评价
	        	<icon class="circular" type="crilce" size="10" :color="template.color.color1"></icon>
	        </view>
	    </view>
		<view class="goodsList">
			<view class="goodsBox lineBottom" v-for="(item, index) in evaluateOrder.goods" :key="index">
				<view class="goods">
					<view class="left">
						<view class="image">
							<image :src="item.goods_pic" mode="aspectFit" lazy-load></image>
						</view>
					</view>
					<view class="right">
						<view class="name" :style="'color:'+template.color.color2">{{item.goods_title}}</view>
						<view v-if="item.update_time" class="text" :style="'color:'+template.color.color5">
							<rate disabled :value="item.evtype" size="15" :active-color="template.color.color1" /> <text v-if="item.anonymous">(匿名评价)</text>
						</view>
						<view v-else class="text" :style="'color:'+template.color.color5">未发表评价</view>
					</view>
				</view>
				<view v-if="item.update_time" class="evaluate">
					<view class="time" :style="'color:'+template.color.color5">{{item.update_time}}</view>
					<view class="text" :style="'color:'+template.color.color2">{{item.contents}}</view>
					<view class="image" v-if="item.pics.length>0">
						<image v-for="(itm, idx) in item.pics" :key="idx" :src="itm.pic" mode="widthFix" lazy-load></image>
					</view>
				</view>
				<view v-else class="formBox">
					<view class="star">
						<view class="title" :style="'color:'+template.color.color3">评分</view>
						<rate :value="item.evtype" size="20" margin="5" @change="rateChange($event, index)" :active-color="template.color.color1" />
						<view class="niming">
							<switch @change="anonymousChange($event, index)" :color="template.color.color1"></switch>
							<text :style="'color:'+template.color.color5">匿名评价</text>
						</view>
					</view>
					<view class="text">
						<textarea v-model="evaluateOrder.goods[index].contents" placeholder="请输入评价内容，最少10字..."></textarea>
					</view>
					<view class="image">
						<view v-if="item.pics.length<=3" class="add" @click="selectImagesTap(index)">
							<icon type="jia" size="30" color="#e2e2e2"></icon>
						</view>
						<view class="img" v-for="(itm, idx) in item.pics" :key="idx">
							<image :src="itm.pic" mode="aspectFit" lazy-load></image>
							<icon type="jiaobiao1" size="26" @click.stop="delImageTap(index, idx)" color="#f82b45"></icon>
						</view>
					</view>
					<view class="button">
						<view class="btn" @click="submitEvaluate(index)" :style="'background-color:'+template.color.color1">提交评价</view>
					</view>
				</view>
			</view>
			
			
			
		</view>
		
		
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue";
	import Rate from "@/components/rate/rate.vue";
	export default {
		components: {Icon, Rate},
		data() {
			return {
				template: uni.getStorageSync('__suyaTemplateConfig'),
				evaluateOrder: [],
				id: ''
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getEvaluateOrder();
		},
		methods: {
			getEvaluateOrder() {
				let self = this;
				self.Get(self.Url.evaluateOrder, {id: self.id}).then(res => {
					if(res.code === 0){
						self.evaluateOrder = res.data;
					}
				})
			},
			anonymousChange(data, index) {
				this.evaluateOrder.goods[index].anonymous = data.detail.value;
			},
			rateChange(data, index) {
				this.evaluateOrder.goods[index].evtype = data.value;
			},
			selectImagesTap(index) {
				let self = this;
				uni.chooseImage({
				    count: 4, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    success: function (res) {
						let list = res.tempFilePaths;
						self.image = list;
						list.forEach(lis => {
							self.Upload(self.Url.uploadFile, lis).then(ups => {
								if(ups.code === 0){
									self.evaluateOrder.goods[index].pics.push({pic: ups.url});
								}else{
									uni.showModal({
										title: '上传失败',
										content: ups.msg,
										showCancel: false
									})
									return
								}
							})
						});
				    }
				});
			},
			delImageTap(index, idx) {
				let self = this;
				self.evaluateOrder.goods[index].pics.splice(idx, 1);
			},
			submitEvaluate(index) {
				let self = this;
				let postData = {
					order_id: self.evaluateOrder.order_id,
				}
				let data = self.evaluateOrder.goods[index];
				if(!data.contents){
					uni.showModal({
						title: '评价提示',
						content: '请输入评价内容，评价内容最少10字',
						showCancel: false
					})
					return
				}
				postData.goods_id = data.goods_id;
				postData.anonymous = data.anonymous;
				postData.evtype = data.evtype;
				postData.contents = data.contents;
				postData.pics = data.pics;
				self.Post(self.Url.evaluateAdd, postData).then(res => {
					if(res.code === 0){
						uni.showToast({title: '评价发表成功'});
						self.getEvaluateOrder();
					}
				})
			}
		}
	}
</script>

<style lang="less">
.goodsList{
	padding-top: 30rpx;
	.goodsBox{
		width: 90%;
		margin: 0 auto;
		position: relative;
		margin-bottom: 30rpx;
		.goods{
			display: flex;
			align-items: center;
			font-weight: 300;
			padding-bottom: 16rpx;
			border-bottom: 1px dashed #f5f5f5;
			.left{
				flex: 0 0 16%;
				display: flex;
				align-items: center;
				.image{
					width: 90rpx;
					height: 90rpx;
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
				flex: 0 0 84%;
				.name{
					width: 90%;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				.text{
					font-size: 26rpx;
					padding-top: 6rpx;
					display: flex;
					align-items: center;
					text{
						font-size: 24rpx;
						padding-left: 10rpx;
					}
				}
			}
		}
		.evaluate{
			padding: 10rpx 10rpx 20rpx;
			font-weight: 300;
			.time{
				font-size: 26rpx;
				padding-bottom: 4rpx;
			}
			.image{
				display: flex;
				align-items: center;
				width: 100%;
				padding-top: 6rpx;
				image{
					width: 200rpx;
					border: 1px solid #f5f5f5;
					margin: 6rpx;
				}
			}
		}
		.formBox{
			padding: 10rpx 10rpx 20rpx;
			font-weight: 300;
			.star{
				display: flex;
				align-items: center;
				padding: 10rpx 0 20rpx;
				position: relative;
				.title{
					flex: 0 0 10%;
				}
				.niming{
					position: absolute;
					right: 0;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					switch{
						zoom: .6;
					}
					text{
						font-size: 26rpx;
						padding-left: 4rpx;
					}
				}
			}
			.text{
				width: 98%;
				height: 100rpx;
				border: 1px solid #f5f5f5;
				padding: 10rpx;
				textarea{
					width: 100%;
					height:100%;
					font-weight: 300;
					font-size: 26rpx;
				}
			}
			.image{
				display: flex;
				align-items: center;
				padding: 20rpx 0 4rpx;
				.add{
					width: 152rpx;
					height: 152rpx;
					border: 1px solid #f5f5f5;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 6rpx;
				}
				.img{
					width: 152rpx;
					height: 152rpx;
					border: 1px solid #f5f5f5;
					margin-right: 6rpx;
					position: relative;
					icon{
						position: absolute;
						top: 0;
						right: 0;
					}
				}
			}
			.button{
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 16rpx;
				.btn{
					color: #FFFFFF;
					width: 90%;
					height: 70rpx;
					border-radius: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 300;
					font-size: 30rpx;
				}
			}
		}
	}
}
</style>
