const templateKey = 'JP200202174424061714';
const domainLinks = uni.getSystemInfoSync().platform==='devtools'?'https://open3.api.ddyy.top':'https://api.ddyy.top';//API后台地址，这个不用修改

function serverGet(url, data) {
    let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__suyaUserInfo').token;
		let headers = {
			'template-key': templateKey, //模版服务码
			'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
		};
		if(token){
			headers.authorization = token;
		}
        let postData = data;
        uni.request({
            url: domainLinks+url,
            data: postData,
            method: 'GET',
			header: headers,
            success: function (res){
				if(res.data.code === 111){
					getApp().$vm.$options.wechatLogin();
				}
                resolve(res.data);
            }
        })
    });
    return promise;
}

function serverPost(url, data) {
    let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__suyaUserInfo').token;
		let headers = {
			'template-key': templateKey, //模版服务码
			'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
		};
		if(token){
			headers.authorization = token;
		}
        let postData = data;
        uni.request({
            url: domainLinks+url,
            data: postData,
            method: 'POST',
            header: headers,
            success: function (res){
				if(res.data.code === 111){
					getApp().$vm.$options.wechatLogin();
				}
                resolve(res.data);
            }
        })
    });
    return promise;
}

function serverUpload(url,data) {
    let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__suyaUserInfo').token;
		let headers = {
			'template-key': templateKey, //模版服务码
			'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
			authorization: token
		};
		uni.uploadFile({
			url: domainLinks+url,
			filePath: data,
			name: 'file',
			header: headers,
			success: (res) => {
				let json = JSON.parse(res.data);
				resolve(json);
			}
		});
    });
    return promise;
}

function templateConfig() {
    let promise = new Promise((resolve) => {
        uni.request({
            url: domainLinks+'/api/template/suya',
            method: 'GET',
            header: {
				'template-key': templateKey, //模版服务码
				'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
			},
            success: function (res){
                resolve(res.data);	
            }
        })
    });
    return promise;
}

module.exports = {
    get: serverGet,
    post: serverPost,
	upload: serverUpload,
	config: templateConfig
}
