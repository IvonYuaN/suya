<template>
	<view class="content">
		<block v-if="loading">
			<view class="loadingBox">
				<view class="loading"></view>
			</view>
		</block>
		<block v-else>
			<Navigation :config="config" style="position: absolute;" />
			<view class="swiper">
				<swiper circular autoplay :interval="8000">
					<swiper-item v-for="(item, index) in goodsDetail.pic_list" :key="index">
						<image :src="item.pic" mode="aspectFit" lazy-load/>
					</swiper-item>
				</swiper>
			</view>
			<view class="goodsDetail">
				<view class="goodsTitle lineBottom">
					<view class="price" :style="'color:'+template.color.color1">¥{{selectSizePrice}} 
						<text :style="'color:'+template.color.color5" v-if="selectMaxPrice>0">¥{{selectMaxPrice}}</text>
					</view>
					<view class="title" :style="'color:'+template.color.color2">{{goodsDetail.title}}</view>
					<view class="intro" :style="'color:'+template.color.color3" v-if="goodsDetail.introduce">{{goodsDetail.introduce}}</view>
				</view>
				<view class="store lineBottom">
					<view class="left" :style="'color:'+template.color.color5">
						<view class="text" style="flex: 0 0 50%;">已售：{{goodsDetail.views_sale}}</view>
						<view class="text">库存：{{buyNumMax}}</view>
					</view>
					<view class="right">
						<view class="icon">
							<icon v-if="goodsDetail.fav_status" @click="favGoodsTap(goodsDetail.fav_status, goodsDetail.id)" type="loveb" size="22" :color="template.color.color1"></icon>
							<icon v-else type="lovea" size="22" @click="favGoodsTap(goodsDetail.fav_status, goodsDetail.id)" :color="template.color.color1"></icon>
						</view>
						<view class="icon" @click="shareShow=true">
							<icon type="share" size="23" :color="template.color.color1" style="margin-left: 20rpx;"></icon>
						</view>
					</view>
				</view>
				<view class="coupons lineBottom" v-if="couponsList.length>0" @click="couponsShow=true">
					<view class="left">
						<view class="tag" :style="'background-color:'+template.color.color1">优惠券</view>
					</view>
					<view class="right">
						<view class="text" :style="'color:'+template.color.color3">有{{couponsList.length}}张优惠券可领取使用</view>
					</view>
				</view>
				<view class="texts">
					<view class="menu lineBottom" :style="'color:'+template.color.color2">
						<view class="title" :class="menuActive==0?'active':''" :style="menuActive==0?'color:'+template.color.color1+';border-color:'+template.color.color1:''" @click="menuActive=0" style="margin-right: 20rpx;">商品介绍</view>
						<view class="title" :class="menuActive==1?'active':''" :style="menuActive==1?'color:'+template.color.color1+';border-color:'+template.color.color1:''" @click="menuActive=1">用户评价<text :style="'color:'+template.color.color5" v-if="evaluateList.total>0">({{evaluateList.total}}条评价)</text></view>
					</view>
					<view v-if="menuActive==0" class="parserBox">
						<parser v-if="goodsDetail.contents" :lazy-load="true" :autopreview="false" :tag-style="tagStyle" img-mode="widthFix" show-with-animation animation-duration="500" :html="goodsDetail.contents" />
					</view>
					<view v-if="menuActive==1" class="parserBox">
						<view class="evaluate lineBottom" v-for="(item, index) in evaluateList.list" :key="index">
							<view class="left">
								<view class="avatar">
									<image v-if="item.anonymous" src="../../static/images/icon/avatar.png" mode="aspectFit" lazy-load></image>
									<image v-else :src="item.user_avatar" mode="aspectFit" lazy-load></image>
								</view>
							</view>
							<view class="right">
								<view class="user">
									<view class="info">
										<view class="name" :style="'color:'+template.color.color2">{{item.anonymous?'匿名用户':item.user_nickname}}</view>
										<view class="time" :style="'color:'+template.color.color5">{{item.update_time}}</view>
									</view>
									<view class="number" :style="'color:'+template.color.color1">{{item.evtype}}分</view>
								</view>
								<view class="contents" :style="'color:'+template.color.color2">{{item.contents}}</view>
								<view class="iamges" v-if="item.pics.length>0">
									<view class="img" v-for="(itm, idx) in item.pics" :key="idx" @click="previewImage(index, idx)">
										<image :src="itm.pic" mode="widthFix" lazy-load></image>
									</view>
								</view>
							</view>
						</view>
						<view class="noneGoodsBox" v-if="evaluateList.list.length==0">
							<view class="none">暂无用户评价<icon type="crilce" size="8"></icon></view>
						</view>
					</view>
				</view>
				<view :style="'height:'+(IphoneX>=0?150:100)+'rpx;'"></view>
			</view>
			<view class="footer" :class="IphoneX>=0?'footerX':''">
				<view class="label">
					<view class="left">
						<view class="icon" @click="favGoodsTap(goodsDetail.fav_status, goodsDetail.id)" style="margin-right: 50rpx;">
							<icon v-if="goodsDetail.fav_status" type="loveb" size="22" :color="template.color.color1"></icon>
							<icon v-else type="lovea" size="22" :color="template.color.color1"></icon>
						</view>
						<view class="icon" @click="getShopCart()">
							<icon type="carta" size="22" :color="template.color.color1"></icon>
							<text :style="'background-color:'+template.color.color1" v-if="shopCartNum>0">{{shopCartNum}}</text>
						</view>
					</view>
					<view class="right">
						<block v-if="buyNumMax>0">
							<view class="button buy" :style="'border: 1px solid'+template.color.color1+';color:'+template.color.color1" @click="[buyShow=true, buyType=1]">立即购买</view>
							<view class="button cart" :style="'background-color:'+template.color.color1+';border: 1px solid'+template.color.color1" @click="[buyShow=true, buyType=2]">加入购物车</view>
						</block>
						<block v-else>
							<view class="button none">该商品已售罄</view>
						</block>
					</view>
				</view>
			</view>
			
			<view v-if="couponsShow" class="showContent" :style="couponsShow?'bottom:0;':''">
				<view class="bg" @click="couponsShow=false"></view>
				<view class="showBox">
					<view class="couponsBox">
						<view class="cheader" :style="'color:'+template.color.color2">领取优惠券</view>
						<view class="list">
							<view class="coupons" v-for="(item, index) in couponsList" :key="index" @click="addCouponsTap(index)">
								<view class="top">
									<view class="left" :style="'color:'+template.color.color1">
										<text>¥</text>{{item.moneys}}
									</view>
									<view class="right">
										<view class="title" :style="'color:'+template.color.color2">{{item.title}}</view>
										<view class="intro" :style="'color:'+template.color.color3">消费满¥{{item.min_money}}可使用，每人最多领取{{item.max_number}}张</view>
										<view class="info" :style="'color:'+template.color.color5">已有{{item.user_number}}人领取，还剩余{{item.numbers-item.user_number}}张</view>
									</view>
								</view>
								<icon v-if="item.user_status" class="status" type="weilingqu" size="42" color="#19be6b"></icon>
								<icon v-else class="status" type="yilingqu" size="42" :color="template.color.color5"></icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="buyShow" class="showContent" :style="buyShow?'bottom:0;':''">
				<view class="bg" @click="buyShow=false"></view>
				<view class="showBox" :style="goodsDetail.specs_list?'min-height: 850rpx;':''" style="overflow-y: scroll;">
					<view class="goods lineBottom">
						<view class="image">
							<image :src="goodsDetail.pic_list[0].pic"></image>
						</view>
						<view class="info">
							<view class="title" :style="'color:'+template.color.color2">{{goodsDetail.title}}</view>
							<view class="price" :style="'color:'+template.color.color1">¥{{selectSizePrice}} 
								<text :style="'color:'+template.color.color5" v-if="selectMaxPrice>0">¥{{selectMaxPrice}}</text>
							</view>
							<view v-if="childProductData" class="stock" :style="'color:'+template.color.color3">库存仅剩{{childProductData.child_product_stock}}件</view>
							<view v-else class="stock" :style="'color:'+template.color.color3">库存仅剩{{buyNumMax}}件</view>
						</view>
					</view>
					<view class="labelBox">
						<view class="label" v-for="(item, index) in goodsDetail.specs_list.specification" :key="index">
							<view class="title"><text :style="'color:'+template.color.color1">{{item.name}}</text></view>
							<view class="specBox">
								<view class="spec" :style="itm.active?'background-color:'+template.color.color1+';border-color:'+template.color.color1:''" :class="itm.active?'active':''" @click="selectSpecsTap(index, idx)" v-for="(itm, idx) in item.value" :key="idx">{{itm.name}}</view>
							</view>
						</view>
					</view>
					<view class="picker">
						<view class="title"><text :style="'color:'+template.color.color1">数量</text></view>
						<view class="buy">
							<view class="btn" @click="editGoods('jian')" :style="'background-color:'+(buyNumber<=1?template.color.color5:template.color.color1)">
								<icon type="jian" size="18" color="#fff"></icon>
							</view>
							<view class="input">
								<input type="number" disabled :value="buyNumber" :style="'color:'+template.color.color2" />
							</view>
							<view class="btn" @click="editGoods('jia')" :style="'background-color:'+(buyNumber==buyNumMax?template.color.color5:template.color.color1)">
								<icon type="jia" size="20" color="#fff"></icon>
							</view>
						</view>
					</view>
					<view v-if="buyType==1 && buyActive" class="button" :class="IphoneX>=0?'buttonX':''" @click="getBuyShopCart('buy')" :style="'background-color:'+template.color.color1">立即购买</view>
					<view v-if="buyType==1 && !buyActive" class="button" :class="IphoneX>=0?'buttonX':''" :style="'background-color:'+template.color.color5">立即购买</view>
					<view v-if="buyType==2 && buyActive" class="button" :class="IphoneX>=0?'buttonX':''" @click="getBuyShopCart('cart')" :style="'background-color:'+template.color.color1">加入购物车</view>
					<view v-if="buyType==2 && !buyActive" class="button" :class="IphoneX>=0?'buttonX':''" :style="'background-color:'+template.color.color5">加入购物车</view>
				</view>
			</view>
			
			<view v-if="shareShow" class="showShare">
					<view class="bg" @click="[haibaoStu=false,shareShow=false]"></view>
					<view class="share">
						<view class="title">{{haibaoStu?'预览分享海报':'选择分享方式'}}</view>
						<view v-if="haibaoStu" class="haibao">
							<image @click="previewHaiImage()" :src="haibaoImg" mode="aspectFill"></image>
							<view class="save" @click="saveImageToPhotosAlbum()" :style="'background-color:'+template.color.color1">保存海报到本地</view>
						</view>
						<view v-else class="box">
							<view class="label">
								<icon type="weixin" size="42" color="#07c160"></icon>
								<view class="text" :style="'color:'+template.color.color5">微信好友</view>
								<button open-type="share"></button>
							</view>
							<view class="label" @click="getGoodsHaibao()">
								<icon type="haibao" size="42" :color="template.color.color1"></icon>
								<view class="text" :style="'color:'+template.color.color5">生成海报</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			
			<canvas canvas-id="goodsHaibao" style="width:600px;height:1000px;opacity:0;position:fixed;left:-1000px;top:-1000px;"></canvas>
		</block>
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue";
	import Parser from "@/components/parser/index.vue";
	import Navigation from "@/components/navigation/navigation.vue";
	const app = getApp();
	export default {
		components: {Icon, Parser, Navigation},
		data() {
			return {
				id: '',
				loading: true,
				shopCartNum: 0,
				buyNumber: 1,
				scrollTop: 0,
				menuActive: 0,
				buyType: 1,
				buyShow: false,
				couponsShow: false,
				IphoneX: this.IphoneX,
				template: uni.getStorageSync('__suyaTemplateConfig'),
				shopData: uni.getStorageSync('__suyaShopInfo'),
				userData: uni.getStorageSync('__suyaUserInfo'),
				config:{
					fontcolor:"#000", //文字颜色，默认白色
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent:true, //是否背景透明 默认白色
					linear:false, //是为开启下滑渐变
					share:false, //是否将主页按钮显示为分享按钮
				},
				tagStyle: {
					img: 'display:block'
				},
				page: {
					page: 1,
					sizes: 50
				},
				goodsDetail: '',
				evaluateList: {
					page: 1,
					total: 0,
					list: []
				},
				couponsList: [],
				buyNumMax: 0,
				canSubmit: false,
				selectMaxPrice: 0,
				selectSizePrice: 0,
				propertyChildIds: '',
				propertyChildNames: '',
				childProductData: '',
				buyActive: false,
				haibaoStu: false,
				haibaoImg: '',
				shareShow: false
			}
		},
		onPageScroll(e) {
			let top = e.scrollTop;
			let bar = 342 - this.StatusBarHeight;
			this.scrollTop = top;
			if(top>bar){
				this.config.title = this.goodsDetail.title;
				this.config.transparent = false;
				uni.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: '#000000'
				})
			}else{
				this.config.title = '';
				this.config.transparent = true;
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: '#007AFF'
				})
			}
		},
		onLoad(e) {
			let self = this;
			self.id = e.id;
			self.getGoodsDetail();
		},
		onShow() {
			this.getCartList();
		},
		onShareAppMessage() {
			return {
			  title: this.goodsDetail.title,
			  path: '/pages/tabbar?goods='+this.goodsDetail.id,
			  imageUrl: this.goodsDetail.pic_list[0].pic
			}
		},
		methods: {
			getGoodsDetail() {
				let self = this;
				self.Get(self.Url.goodsDetail, {id: self.id}).then(res => {
					if(res.code === 0){
						self.loading = false;
						self.goodsDetail = res.data;
						self.buyNumMax = res.data.stock_number;
						self.selectMaxPrice = res.data.max_price;
						self.selectSizePrice = res.data.mini_price;
						if(res.data.stock_number>0){
							self.buyActive = true;
						}
						if(res.data.specs_list){
							self.canSubmit = true;
						}
						self.getEvaluateList();
						self.getCouponsGoods();
						if(self.template.user.history){
							self.getAddHistory();
						}
					}else{
						uni.showModal({
						  content: '商品已经下架，下次要早点来哟～',
						  showCancel: false,
						  success(uns) {
						  	if(uns.confirm){
								uni.reLaunch({url: '/pages/tabbar'});
							}
						  }
						});
					}
				})
			},
			getAddHistory() {
				let self = this;
				if(app.globalData.user){
					self.Post(self.Url.addHistory, {id: [self.id], type: true}).then(res => {
						if(res.code === 0){
							console.log('Add History Success！')
						}
					});
				}
			},
			getCouponsGoods() {
				let self = this;
				self.Post(self.Url.couponsGoods, {goods_id : self.id}).then(res => {
					if(res.code === 0){
						self.couponsList = res.data;
					}else{
						self.couponsList = [];
					}
				})
			},
			getCartList() {
				let self = this;
				if(app.globalData.user){
					let number = 0;
					self.Get(self.Url.cartList, {}).then(res => {
						if(res.code === 0){
							let data = res.data;
							data.forEach(res => {
								number += res.num;
							});
							self.shopCartNum = number;
						}
					});
				}
			},
			getEvaluateList() {
				let self = this;
				let postData = {
					id: self.id,
					page: self.page.page,
					sizes: self.page.sizes
				}
				self.Get(self.Url.evaluateList, postData).then(res => {
					if(res.code === 0){
						self.evaluateList = res.data;
					}
				});
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
							self.goodsDetail.fav_status = !status;
						}
					});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			editGoods(type){
				let self = this;
				let number = self.buyNumMax;
				if(type=='jian'){
					if(self.buyNumber>1){
						self.buyNumber--;
					}
				}else if(type=='jia'){
					if(self.buyNumber == number){
						uni.showToast({
							icon: 'none',
							title: '商品库存不足'
						});
					}else{
						self.buyNumber++;
					}
				}
			},
			previewImage(index, idx){
				let self = this;
				let data = self.evaluateList.list[index].pics;
				let list = [];
				data.forEach(res => {
					list.push(res.pic);
				})
				uni.previewImage({
					urls: list,
					current: data[idx].pic
				});
			},
			getShopCart() {
				if(app.globalData.user){
					uni.reLaunch({url: '/pages/tabbar?cid=2'});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getBuyShopCart(type) {
				let self = this;
				if(app.globalData.user){
					if(self.canSubmit){
						uni.showModal({
							title: '商品提示',
							content: '请选择要购买的商品规格',
							showCancel: false
						})
						return
					}
					let postData = {
						id: self.id,
						number: self.buyNumber
					}
					if(self.goodsDetail.specs_list){
						postData.spec = self.childProductData.child_product_id;
					}
					self.Get(self.Url.cartAdd, postData).then(res => {
						if(res.code == 0){
							if(type=='cart'){
								uni.showToast({title: '加入成功'});
								self.buyShow = false;
								self.getCartList();
							}else if(type=='buy'){
								let resData = {
									id: self.goodsDetail.id,
									num: self.buyNumber,
									pic: self.goodsDetail.pic_list[0].pic,
									shelve_status: self.goodsDetail.shelve_status,
									stock_number: self.buyNumMax,
									title: self.goodsDetail.title,
									active: true
								}
								if(self.goodsDetail.specs_list){
									resData.spec_id = self.childProductData.child_product_id;
									resData.spec_name = self.propertyChildNames;
									resData.mini_price = self.childProductData.child_product_price;
								}else{
									resData.mini_price = self.goodsDetail.mini_price;
								}
								self.buyShow = false;
								uni.setStorage({key: '__suyaShopCart',data: [resData]});
								uni.navigateTo({url: '/pages/order/paypal'});
							}
						}else{
							uni.showModal({content: res.msg, showCancel: false});
						}
					});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			selectSpecsTap(index, idx) {
				let self = this;
				let specification = self.goodsDetail.specs_list.specification;
				for(let i = 0; i < specification.length; i++){
					if(i == index) {
						specification[i].active = true;
						for(let s = 0; s < specification[i].value.length; s++){
							if(s == idx) {
								specification[i].value[s].active = true;
							}else{
								specification[i].value[s].active = false
							}
						}
					}
				}
				self.$set(self.goodsDetail.specs_list.specification, index, self.goodsDetail.specs_list.specification[index])
				let curSelectNum = 0;
				let propertyChildIds = '';
				let propertyChildNames = '';
				let selectSpecification = {};
				for(let i = 0; i < specification.length; i++){
					if(specification[i].active){
						curSelectNum++
						for(let s = 0; s < specification[i].value.length; s++){
							if(specification[i].value[s].active){
								selectSpecification[specification[i].name] = specification[i].value[s].name;
							}
						}
					}
				}
				if(curSelectNum==specification.length){
					self.canSubmit = false;
				}else{
					self.canSubmit = true;
				}
				let childProductArray = self.goodsDetail.specs_list.childProductArray;
				for(let i = 0; i < childProductArray.length; i++){
					if(!self.canSubmit && Object.keys(selectSpecification).every(key => childProductArray[i].child_product_spec[key] === selectSpecification[key])){
						self.buyActive = true;
						self.childProductData = childProductArray[i];
						self.buyNumber = 1;
						self.buyNumMax = childProductArray[i].child_product_stock;
						self.selectMaxPrice = childProductArray[i].child_product_cost;
						self.selectSizePrice = childProductArray[i].child_product_price;
						self.propertyChildNames = childProductArray[i].child_product_spec;
						if(childProductArray[i].child_product_stock==0){
							self.buyActive = false;
							self.buyNumber = 0;
							uni.showToast({
								title: '该商品库存不足',
								icon: 'none'
							})
						}
					}
				}
			},
			addCouponsTap(index) {
				let self = this;
				let data = self.couponsList[index];
				if(app.globalData.user){
					if(data.user_status){
						self.Get(self.Url.couponsUserAdd , {id: data.id}).then(res => {
							if(res.code === 0){
								uni.showToast({title: '领取成功'});
								self.getCouponsGoods();
							}
						})
					}else{
						uni.showToast({
							title: '已领取过该优惠券',
							icon: 'none'
						})
					}
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getGoodsHaibao() {
				let self = this;
				let data = self.goodsDetail;
				let pics = data.pic_list[0].pic.replace(/http:/g,'https:');
				if(self.haibaoImg){
					self.haibaoStu = true;
					return
				}
				let postData = {
					scene: 'g='+data.id,
					page: 'pages/tabbar',
					dtime: 10
				}
				uni.showLoading({title: '海拔绘制中'});
				self.Post(self.Url.qrcodeWechat, postData).then(res => {
					if(res.code === 0){
						wx.downloadFile({
							url: res.url,
							success (qrcode) {
								uni.showLoading({title: '海报绘制中'});
								wx.downloadFile({
									url: pics,
									success (pic) {
										let sics = self.shopData.shop_logo.replace(/http:/g,'https:');
										wx.downloadFile({
											url: sics,
											success (sic) {
												let ctxs = wx.createCanvasContext('goodsHaibao');
												let postData = {
													pic: pic.tempFilePath,
													color: self.template.color,
													shop_logo: sic.tempFilePath,
													max_price: '¥'+data.max_price,
													mini_price: '¥'+data.mini_price,
													stock_number: '库存：'+data.stock_number,
													shop_name: self.shopData.shop_name,
													qrcode: qrcode.tempFilePath,
													nikename: self.userData.nikename
												};
												//商品标题
												if(data.title.split('').length >= 16){
													postData.title = data.title.substr(0,16)+'...';
												}else{
													postData.title = data.title;
												}
												//商品介绍
												if(data.introduce.split('').length >= 18){
													postData.introduce = data.introduce.substr(0,18)+'...';
												}else{
													postData.introduce = data.introduce;
												}
												ctxs.setFillStyle('#FFFFFF')
												ctxs.fillRect(0, 0, 600, 1000)
												ctxs.setFillStyle(postData.color.color1)
												ctxs.setFontSize(30)
												ctxs.setTextAlign('left')
												ctxs.fillText(postData.shop_name, 105, 73)
												ctxs.save()
												ctxs.setFillStyle('#ffffff')
												self.roundRect(ctxs, 30, 30, 60, 60, 6)
												ctxs.drawImage(postData.shop_logo, 30, 30, 60, 60)
												ctxs.restore()
												ctxs.save()
												self.roundRect(ctxs, 30, 120, 540, 610, 10)
												ctxs.setFillStyle(postData.color.color5)
												ctxs.fillRect(30, 120, 540, 540)
												ctxs.drawImage(postData.pic, 30, 120, 540, 540)
												ctxs.setFillStyle(postData.color.color1)
												ctxs.fillRect(30, 650, 540, 80)
												ctxs.setFillStyle('#ffffff')
												ctxs.setFontSize(42)
												ctxs.setTextAlign('left')
												ctxs.fillText(postData.mini_price, 45, 705)
												const minrics = ctxs.measureText(postData.mini_price)
												ctxs.setFontSize(30)
												ctxs.setTextAlign('left')
												ctxs.fillText(postData.max_price, 55+minrics.width, 703)
												const maxrics = ctxs.measureText(postData.max_price)
												ctxs.beginPath()
												ctxs.setStrokeStyle('#FFFFFF')
												ctxs.setLineWidth(2)
												ctxs.moveTo(55+minrics.width, 695)
												ctxs.lineTo(55+minrics.width+maxrics.width, 695)
												ctxs.setFontSize(24)
												ctxs.setTextAlign('right')
												ctxs.fillText(postData.stock_number, 550, 700)
												ctxs.stroke()
												ctxs.restore()
												ctxs.setFillStyle(postData.color.color3)
												ctxs.setFontSize(32)
												ctxs.setTextAlign('left')
												ctxs.fillText(postData.title, 30, 775)
												ctxs.setFillStyle(postData.color.color5)
												ctxs.setFontSize(28)
												ctxs.setTextAlign('left')
												ctxs.fillText(postData.introduce, 30, 820)
												ctxs.drawImage(postData.qrcode, 430, 850, 120, 120)
												ctxs.setFillStyle(postData.color.color5)
												ctxs.setFontSize(22)
												ctxs.setTextAlign('right')
												ctxs.fillText('长按扫描二维码查看详情', 400, postData.nikename?940:920)
												ctxs.fillText('来自'+postData.nikename+'的推荐', 400, 910)
												ctxs.restore()
												ctxs.save()
												ctxs.draw()
												setTimeout(function () {
													uni.canvasToTempFilePath({
														x: 0,y: 0,width: 600,height: 1000,
														canvasId: 'goodsHaibao',
														success: function (res) {
															uni.hideLoading();
															self.haibaoImg = res.tempFilePath;
															self.haibaoStu = true;
														},
														fail: function(){
															uni.hideLoading();
															uni.showToast({title: '海拔绘制失败', icon:'none'});
														}
													})
												}, 500);
											}
										})
									}
								});
							}
						})
					}else{
						uni.hideLoading();
						uni.showModal({
							title: '绘制失败',
							content: res.msg,
							showCancel: false
						})
					}
				});
			},
			roundRect(ctx, x, y, w, h, r) {
			  ctx.beginPath()
			  ctx.setFillStyle('transparent')
			  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
			  ctx.moveTo(x + r, y)
			  ctx.lineTo(x + w - r, y)
			  ctx.lineTo(x + w, y + r)
			  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
			  ctx.lineTo(x + w, y + h - r)
			  ctx.lineTo(x + w - r, y + h)
			  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
			  ctx.lineTo(x + r, y + h)
			  ctx.lineTo(x, y + h - r)
			  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
			  ctx.lineTo(x, y + r)
			  ctx.lineTo(x + r, y)
			  ctx.fill()
			  ctx.closePath()
			  ctx.clip()
			},
			previewHaiImage() {
				let self = this;
				uni.previewImage({
					urls: [self.haibaoImg],
					current: self.haibaoImg,
					success() {
						uni.saveImageToPhotosAlbum({
							filePath: self.haibaoImg,
							success: function () {}
						});
					}
				});
			},
			saveImageToPhotosAlbum() {
				let self = this;
				uni.saveImageToPhotosAlbum({
					filePath: self.haibaoImg,
					success: function () {
						uni.showToast({title: '海报保存成功'});
					}
				});
			},
		}
	}
</script>

<style lang="less">
	.swiper{
	    width: 100%;
	    height: 750rpx;
	    background-color: #f5f5f5;
		position: fixed;
		z-index: 1;
		swiper{
			width: 100%;
			height: 750rpx;
			background-color: #f5f5f5;
			image{
				width: 100%;
				height: 750rpx;
			}
		}
	}
	.goodsDetail{
		position: absolute;
		z-index: 99;
		width: 96%;
		top: 700rpx;
		background-color: #fff;
		min-height: 300rpx;
		padding-top: 20rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		margin: 0 auto;
		left: 0;
		right: 0;
		box-shadow: 0 0 20rpx rgba(0,0,0,.08);
		.goodsTitle{
			width: 95%;
			margin: 0 auto;
			font-weight: 300;
			position: relative;
			padding-bottom: 20rpx;
			.price{
				font-size: 46rpx;
				display: flex;
				align-items: center;
				text{
					font-size: 36rpx;
					text-decoration: line-through;
					margin-left: 12rpx;
				}
			}
			.title{
				font-size: 38rpx;
				padding-top: 6rpx;
			}
			.intro{
				font-size: 32rpx;
				padding-top: 6rpx;
			}
		}
		.store{
			display: flex;
			align-items: center;
			padding: 16rpx 20rpx;
			position: relative;
			min-height: 60rpx;
			.left{
				display: flex;
				flex: 0 0 70%;
				align-items: center;
				font-weight: 300;
			}
			.right{
				flex: 0 0 30%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.icon{
					width: 50rpx;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					margin-right: 10rpx;
					button{
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						opacity: 0;
					}
				}
			}
		}
		.coupons{
			display: flex;
			align-items: center;
			padding: 16rpx 20rpx;
			position: relative;
			min-height: 60rpx;
			.left{
				flex: 0 0 20%;
				display: flex;
				font-weight: 300;
				.tag{
					color: #fff;
					padding: 2rpx 10rpx;
					font-size: 26rpx;
				}
			}
			.right{
				flex: 0 0 80%;
				display: flex;
				font-weight: 300;
			}
		}
		.texts{
			padding: 20rpx 20rpx 16rpx;
			.menu{
				position: relative;
				display: flex;
				align-items: center;
				.title{
					font-weight: 300;
					font-size: 30rpx;
					border-bottom: 2rpx solid #fff;
					padding: 20rpx 10rpx;
					position: relative;
					text{
						position: absolute;
						font-size: 24rpx;
						white-space: nowrap;
						margin-left: 12rpx;
						margin-top: 4rpx;
					}
				}
			}
			.parserBox{
				padding: 30rpx 0;
				.evaluate{
					display: flex;
					width: 95%;
					margin: 0 auto;
					position: relative;
					padding-bottom: 20rpx;
					margin-bottom: 20rpx;
					.left{
						flex: 0 0 15%;
						display: flex;
						justify-content: center;
						.avatar{
							width: 66rpx;
							height: 66rpx;
							border-radius: 100%;
							overflow: hidden;
							margin-top: 4rpx;
						}
					}
					.right{
						flex: 0 0 85%;
						.user{
							width: 100%;
							display: flex;
							align-items: center;
							.info{
								flex: 0 0 80%;
								font-weight: 300;
								.name{
									width: 90%;
									white-space: nowrap;
									text-overflow: ellipsis;
									overflow: hidden;
									font-size: 26rpx;
								}
								.time{
									font-size: 24rpx;
								}
							}
							.number{
								flex: 0 0 20%;
								display: flex;
								justify-content: flex-end;
								font-weight: 300;
							}
						}
						.contents{
							padding-top: 10rpx;
							font-weight: 300;
						}
						.iamges{
							display: flex;
							align-items: center;
							flex-wrap: wrap;
							padding-top: 20rpx;
							.img{
								flex: 0 0 40%;
								margin: 4rpx;
							}
						}
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
		bottom: 0;
		height: 100rpx;
		z-index: 999;
		box-shadow: 0 10rpx 20rpx rgba(0,0,0,.2);
		.label{
			display: flex;
			width: 95%;
			height: 100rpx;
			margin: 0 auto;
			align-items: center;
			.left{
				display: flex;
				justify-content: center;
				flex: 0 0 35%;
				.icon{
					width: 66rpx;
					height: 66rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f5f5f5;
					border-radius: 100%;
					position: relative;
					text{
						position: absolute;
						right: -20rpx;
						top: -8rpx;
						width: 38rpx;
						height: 38rpx;
						border-radius: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						font-weight: 300;
						font-size: 24rpx;
					}
				}
			}
			.right{
				flex: 0 0 65%;
				display: flex;
				align-items: center;
				justify-content: center;
				.button{
					color: #fff;
					padding: 10rpx 38rpx;
					font-weight: 300;
					min-height: 40rpx;
				}
				.buy{
					border-top-left-radius: 100rpx;
					border-bottom-left-radius: 100rpx;
				}
				.cart{
					border-top-right-radius: 100rpx;
					border-bottom-right-radius: 100rpx;
				}
				.none{
					background-color: #bbb;
					border-radius: 100rpx;
					border: 1px solid #bbb;
					width: 70%;
					text-align: center;
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
			.goods{
				width: 95%;
				margin: 0 auto;
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				position: relative;
				margin-bottom: 20rpx;
				.image{
					width: 180rpx;
					height: 180rpx;
					background-color: #f5f5f5;
					border-radius: 6rpx;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.info{
					padding-left: 20rpx;
					width: 510rpx;
					font-weight: 300;
					.price{
						font-size: 38rpx;
						display: flex;
						align-items: center;
						padding-top: 10rpx;
						text{
							font-size: 32rpx;
							text-decoration: line-through;
							margin-left: 12rpx;
						}
					}
					.title{
						font-size: 38rpx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.stock{
						font-size: 28rpx;
						padding-top: 8rpx;
					}
				}
			}
			.labelBox{
				width: 95%;
				margin: 0 auto;
				.label{
					padding-bottom: 20rpx;
					.title{
						padding: 0 0 20rpx;
						text{
							font-weight: 300;
							font-size: 26rpx;
						}
					}
					.specBox{
						display: flex;
						flex-wrap: wrap;
						.spec{
							border: 1px solid #eee;
							padding: 10rpx 30rpx;
							margin-right: 20rpx;
							font-size: 28rpx;
							font-weight: 300;
							color: #999999;
						}
						.active{
							color: #FFFFFF;
						}
					}
				}
			}
			.picker{
				width: 95%;
				margin: 0 auto;
				.title{
					padding: 0 0 20rpx;
					text{
						font-weight: 300;
						font-size: 26rpx;
					}
				}
				.buy{
					display: flex;
					align-items: center;
					.btn{
						display: flex;
						align-items: center;
						justify-content: center;
						width: 50rpx;
						height: 50rpx;
						border-radius: 4rpx;
					}
					.input{
						width: 100rpx;
						height: 50rpx;
						background-color: #f5f5f5;
						margin: 0 10rpx;
						border-radius: 4rpx;
						input{
							width: 100%;
							height: 50rpx;
							text-align: center;
							font-size: 30rpx;
						}
					}
				}
			}
			.button{
				position: absolute;
				bottom: 20rpx;
				width: 95%;
				margin: 0 auto;
				left: 0;
				right: 0;
				height: 80rpx;
				border-radius: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-weight: 300;
				font-size: 30rpx;
				z-index: 999;
			}
			.buttonX{
				bottom: 30rpx;
			}
			.couponsBox{
				
				.cheader{
					font-size: 32rpx;
					text-align: center;
					font-weight: 300;
					padding: 20rpx 0 10rpx;
				}
				.list{
					padding-top: 20rpx;
					max-height: 500rpx;
					overflow-y: scroll;
					.coupons{
						width: 90%;
						margin: 0 auto;
						margin-bottom: 20rpx;
						position: relative;
						.top{
							display: flex;
							align-items: center;
							font-weight: 300;
							padding: 20rpx 0;
							.left{
								flex: 0 0 25%;
								display: flex;
								justify-content: center;
								font-size: 38rpx;
								text{
									font-size: 28rpx;
								}
							}
							.right{
								flex: 0 0 75%;
								.title{
									width: 90%;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								.intro{
									font-size: 24rpx;
									width: 90%;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								.info{
									font-size: 24rpx;
								}
							}
						}
						.status{
							position: absolute;
							top: 0;
							right: 6rpx;
						}
					}
					.coupons::before{
						content: '';
						position: absolute;
						width: 200%;
						height: 200%;
						border: 1px solid #f2f2f2;
						border-radius:10rpx;
						transform-origin: 0 0;
						transform: scale(0.5, 0.5);
						box-sizing: border-box;
					}
				}
			}
		}
	}
	.noneGoodsBox{
	    width:100%;
	    height:300rpx;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    .none{
	        font-size:32rpx;
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
	
	.showShare{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,.1);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		.bg{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 1000;
		}
		.share{
			position: absolute;
			width: 500rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			z-index: 1001;
			transition: all 0.6s;
			.title{
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 38rpx 0 30rpx;
			}
			.box{
				display: flex;
				align-items: center;
				justify-content: center;
				padding-bottom: 38rpx;
				.label{
					flex: 0 0 45%;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					position: relative;
					.text{
						font-size: 24rpx;
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
			.haibao{
				width: 90%;
				margin: 0 auto;
				display: flex;
				flex-direction: column;
				align-items: center;
				image{
					width: 396rpx;
					height: 660rpx;
					border: 1px solid #f5f5f5;
					border-radius: 6rpx;
				}
				.save{
					color: #FFFFFF;
					width: 280rpx;
					height: 60rpx;
					border-radius: 100rpx;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 30rpx 0;
				}
			}
		}
	}
</style>
