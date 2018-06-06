var commonCityData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    provinces:[],
    citys:[],
    districts:[],
    selProvince:'请选择',
    selCity:'请选择',
    selDistrict:'请选择',
    selProvinceIndex:0,
    selCityIndex:0,
    selDistrictIndex:0,
		showCitys:false,
		showPDistrict:false
  },
  bindCancel:function () {
    wx.navigateBack({})
  },
  bindSave: function(e) {
    var that = this;
		console.log(that)
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

		if (!linkMan) {
			wx.showModal({
				title: '提示',
				content: '请填写联系人姓名',
				showCancel: false
			})
			return
		}
		if (linkMan.length < 2) {
			wx.showModal({
				title: '提示',
				content: '收货人姓名限制为2~15个字符',
				showCancel: false
			})
			return
		}
		if (mobile == "") {
			wx.showModal({
				title: '提示',
				content: '请填写手机号码',
				showCancel: false
			})
			return
		}
		// if (!/^1[3|4|5|7|8]\d{9}$/.test(mobile)) { 
		// 	wx.showModal({
		// 		title: '提示',
		// 		content: '手机格式有误，请重新输入',
		// 		showCancel: false
		// 	})
		// 	return; 
		// }
    if (this.data.selProvince == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
		if (this.data.selCity == "请选择") {
			wx.showModal({
				title: '提示',
				content: '请选择地区',
				showCancel: false
			})
			return
		}
		if (this.data.selDistrict == "请选择") {
			wx.showModal({
				title: '提示',
				content: '请选择地区',
				showCancel: false
			})
			return
		}
		if (!address) {
			wx.showModal({
				title: '提示',
				content: '请填写详细地址',
				showCancel: false
			})
			return
		}
		if (address.length < 5) {
			wx.showModal({
				title: '提示',
				content: '街道地址字数必须在5~60之间',
				showCancel: false
			})
			return
		}
		if (!code) {
			wx.showModal({
				title: '提示',
				content: '请填写邮编',
				showCancel: false
			})
			return
		}
    var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    var districtId;
    if (this.data.selDistrict == "请选择" || !this.data.selDistrict){
      districtId = '';
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }
    if (code == ""){
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel:false
      })
      return
    }
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }
    wx.request({
      url: app.globalData.RTHost + '/address/' + apiAddoRuPDATE,
      data: {
        token: app.globalData.token,
        id: apiAddid,
        provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
        cityId: cityId,
        districtId: districtId,
        linkMan:linkMan,
        address:address,
        mobile:mobile,
        code:code,
        isDefault:'true'
      },
      success: function(res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel:false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },
  initCityData:function(level, obj){
    if(level == 1){
      var pinkArray = [];
      for(var i = 0;i<commonCityData.cityData.length;i++){
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces:pinkArray
      });
    } else if (level == 2){
      var pinkArray = [];
      var dataArray = obj.cityList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys:pinkArray
      });
    } else if (level == 3){
      var pinkArray = [];
      var dataArray = obj.districtList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts:pinkArray
      });
    }
    
  },
  bindPickerProvinceChange:function(event){
    var selIterm = commonCityData.cityData[event.detail.value];
		console.log(selIterm)
    this.setData({
      selProvince:selIterm.name,
      selProvinceIndex:event.detail.value,
      selCity:'请选择',
      selCityIndex:0,
      selDistrict:'请选择',
      selDistrictIndex: 0,
			showCitys:true,
			showPDistrict: false
		
    })
    this.initCityData(2, selIterm)
		// console.log(this.data)
  },
  bindPickerCityChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
		// if(selIterm.districtLIst.length)
		// console.log(this.data)
		// console.log(selIterm.districtList.length)
		if (selIterm.districtList.length != 0) {
			this.setData({
				showPDistrict:true
			})
		}else{
			this.setData({
				showPDistrict: false
			})
		}
    this.setData({
      selCity:selIterm.name,
      selCityIndex:event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  onLoad: function (e) {
    var that = this;
		console.log(that)
    this.initCityData(1);
    var id = e.id;
		// console.log(id)
    if (id) {
      // 初始化原数据
      wx.showLoading();
      wx.request({
        url: app.globalData.RTHost + '/address/detail',
        data: {
          token: app.globalData.token,
          id: id
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.setData({
              id:id,
              addressData: res.data.data,
              selProvince: res.data.data.provinceStr,
              selCity: res.data.data.cityStr,
              selDistrict: res.data.data.areaStr
              });
            that.setDBSaveAddressId(res.data.data);
            return;
          } else {
            wx.showModal({
              title: '提示',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          }
        }
      })
    }
  },
  setDBSaveAddressId: function(data) {
    var retSelIdx = 0;
    for (var i = 0; i < commonCityData.cityData.length; i++) {
      if (data.provinceId == commonCityData.cityData[i].id) {
        this.data.selProvinceIndex = i;
        for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
          if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
            this.data.selCityIndex = j;
            for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
              if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
                this.data.selDistrictIndex = k;
              }
            }
          }
        }
      }
    }
   },
  selectCity: function () {
    
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.RTHost + '/address/delete',
            data: {
              token: app.globalData.token,
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx : function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        let provinceName = res.provinceName;
        let cityName = res.cityName;
        let diatrictName = res.countyName;
        let retSelIdx = 0;
				console.log(commonCityData)
				console.log(commonCityData.cityData.length)
        for (var i = 0; i < commonCityData.cityData.length; i++) {
          if (provinceName == commonCityData.cityData[i].name) {
            that.data.selProvinceIndex = i;
						// console.log(that.data.selProvinceIndex)
            for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
              if (cityName == commonCityData.cityData[i].cityList[j].name) {
                that.data.selCityIndex = j;
                for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
                  if (diatrictName == commonCityData.cityData[i].cityList[j].districtList[k].name) {
                    that.data.selDistrictIndex = k;
										console.log(that.data.selDistrictIndex)
                  }
                }
              }
            }
          }
        }
				if (that.data.selDistrictIndex != 0) {
					that.setData({
						showCitys: true,
						showPDistrict: true
					});
				}
        that.setData({
          wxaddress: res,
          selProvince: provinceName,
          selCity: cityName,
          selDistrict: diatrictName
        });
				console.log(that)
      }
    })
  }
})
