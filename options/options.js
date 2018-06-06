// pages/options/options.js
Page({
	data: {
		//数据结构：以一组一组的数据来进行设定 
		PriceLabel: "-",
		commodityAttr: [],
		attrValueList: [],
		option_values: [
			{
				"pic": "catalog\/201804121523503787f8301e50.jpg",
				"stock": "11",
				"oriPrice": "11",
				"price": "11",
				"attrValueList": [{
					"attrKey": "内存",
					"attrValue": "3G"
				}, {
					"attrKey": "颜色",
					"attrValue": "白色"
				}, {
					"attrKey": "大小",
					"attrValue": "大"
				}]
			}, {
				"pic": "catalog\/201804121523503889e0a1fdbd.jpg",
				"stock": "22",
				"oriPrice": "22",
				"price": "22",
				"attrValueList": [{
					"attrKey": "内存",
					"attrValue": "3G"
				}, {
					"attrKey": "颜色",
					"attrValue": "白色"
				}, {
					"attrKey": "大小",
					"attrValue": "小"
				}]
			}, {
				"pic": "catalog\/201804121523502f712e77a047.jpg",
				"stock": "33",
				"oriPrice": "33",
				"price": "33",
				"attrValueList": [{
					"attrKey": "内存",
					"attrValue": "8G"
				}, {
					"attrKey": "颜色",
					"attrValue": "白色"
				}, {
					"attrKey": "大小",
					"attrValue": "大"
				}]
			}, {
				"pic": "catalog\/201804121523502f712e77a047.jpg",
				"stock": "0",
				"oriPrice": "0",
				"price": "0",
				"attrValueList": [{
					"attrKey": "内存",
					"attrValue": "8G"
				}, {
					"attrKey": "颜色",
					"attrValue": "白色"
				}, {
					"attrKey": "大小",
					"attrValue": "大"
				}]
			}]
	},


	onShow: function () {
		var that = this;
		// console.log(that.data.commodityAttr)
		var option_values = that.data.option_values
		for (var i = 0; i < option_values.length; i++) {
			if (option_values[i].oriPrice == "0"
				&& option_values[i].price == "0"
				&& option_values[i].stock == "0") {
				option_values.splice(i, 1)
			}
		}


		that.setData({
			commodityAttr: option_values,
			includeGroup: option_values
		});
		that.distachAttrValue(that.data.commodityAttr);

		// 只有一个属性组合的时候默认选中 
		// console.log(this.data.attrValueList); 
		if (that.data.commodityAttr.length == 1) {
			for (var i = 0; i < that.data.commodityAttr[0].attrValueList.length; i++) {
				that.data.attrValueList[i].selectedValue = that.data.commodityAttr[0].attrValueList[i].attrValue;
			}
			that.setData({
				attrValueList: that.data.attrValueList
			});
		}
		this.reDrawOptionStatus(this.data.attrValueList, 0);
	},
	/* 获取数据 */
	distachAttrValue: function (commodityAttr) {
    /** 
    将后台返回的数据组合成类似 
    { 
    attrKey:'型号', 
    attrValueList:['1','2','3'] 
    } 
    */
		// 把数据对象的数据（视图使用），写到局部内 
		var attrValueList = this.data.attrValueList;
		// console.log("-----------------");
		// 遍历获取的数据 
		for (var i = 0; i < commodityAttr.length; i++) {
			for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
				var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
				// console.log('属性索引', attrIndex);

				// 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置 
				if (attrIndex >= 0) {
					// 如果属性值数组中没有该值，push新值；否则不处理 
					if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
						attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
					}
				} else {
					attrValueList.push({
						attrKey: commodityAttr[i].attrValueList[j].attrKey,
						attrValues: [commodityAttr[i].attrValueList[j].attrValue],
						selectedValue: ''
					});
				}
			}
		}
		// console.log('result', attrValueList) ;return; 
		for (var i = 0; i < attrValueList.length; i++) {
			for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
				if (attrValueList[i].attrValueStatus) {
					attrValueList[i].attrValueStatus[j] = true;
				} else {
					attrValueList[i].attrValueStatus = [];
					attrValueList[i].attrValueStatus[j] = true;
				}
			}
		}
		this.setData({
			attrValueList: attrValueList
		});
	},
	getAttrIndex: function (attrName, attrValueList) {
		// 判断数组中的attrKey是否有该属性值 
		for (var i = 0; i < attrValueList.length; i++) {
			if (attrName == attrValueList[i].attrKey) {
				break;
			}
		}
		return i < attrValueList.length ? i : -1;
	},
	isValueExist: function (value, valueArr) {
		// 判断是否已有属性值 
		for (var i = 0; i < valueArr.length; i++) {
			if (valueArr[i] == value) {
				break;
			}
		}
		return i < valueArr.length;
	},
	/* 选择属性值事件 */
	selectAttrValue: function (e) {
    /* 
    点选属性值，联动判断其他属性值是否可选 
    { 
    attrKey:'型号', 
    attrValueList:['1','2','3'], 
    selectedValue:'1', 
    attrValueStatus:[true,true,true] 
    } 
    console.log(e.currentTarget.dataset); 
    */
		var attrValueList = this.data.attrValueList;
		var index = e.currentTarget.dataset.index;//属性索引 
		var key = e.currentTarget.dataset.key;
		var value = e.currentTarget.dataset.value;
		if (e.currentTarget.dataset.status || index == this.data.firstIndex) {

			attrValueList[index].selectedValue = value;

			if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
				// 取消选中 
				console.log("取消选中")
				attrValueList[index].selectedValue = '';
				this.reDrawOptionStatus(attrValueList, index);
				return;
				this.disSelectValue(attrValueList, index, key, value);
			} else {
				// 选中 
				console.log("选中")
				attrValueList[index].selectedValue = value;
				this.reDrawOptionStatus(attrValueList, index);
				return;
				this.selectValue(attrValueList, index, key, value);
			}

		}
	},
	reDrawOptionStatus: function (attrValueList, index) {
		var selCnt = 0;
		//全部禁用
		for (var i = 0; i < attrValueList.length; i++) {
			if (attrValueList[i].selectedValue != '') {
				// console.log(attrValueList[i].selectedValue);
				selCnt++;
				
			}
			
			for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
				attrValueList[i].attrValueStatus[j] = false;
			}
		}
		// console.log("selCnt", selCnt);
		var min = 0, max = 0, PriceLabel;

		var diffAttr = -1;
		for (var n = 0; n < this.data.commodityAttr.length; n++) {
			// console.log(this.data.commodityAttr[n]);

			var price = this.data.commodityAttr[n].price;
			var sameCnt = 0;
			
			if (selCnt == 0) {
				if (price > max) max = price;
				if (min == 0 || min > price) min = price;
				if (min == max) {
					PriceLabel = max;
				} else {
					PriceLabel = min + "-" + max
				}
			}


			for (var i = 0; i < attrValueList.length; i++) {
				for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
					//console.log("sameCnt++", sameCnt, this.data.commodityAttr[n].attrValueList[i].attrValue, attrValueList[i].selectedValue);
					if (this.data.commodityAttr[n].attrValueList[i].attrValue == attrValueList[i].attrValues[j]
						&& this.data.commodityAttr[n].attrValueList[i].attrValue == attrValueList[i].selectedValue
					) {
						// console.log("sameCnt++", this.data.commodityAttr[n].attrValueList[i].attrValue, attrValueList[i].attrValues[j]);
						sameCnt++;
					}
					else if (this.data.commodityAttr[n].attrValueList[i].attrValue != attrValueList[i].selectedValue && attrValueList[i].selectedValue != '') {
						// console.log("diffAttr?", this.data.commodityAttr[n].attrValueList[i].attrValue, ",", attrValueList[i].selectedValue, ".");
						diffAttr = i;

					}
				}
			}

			// console.log("diffAttr=", diffAttr);
			//console.log(sameCnt, "<", selCnt - 1);
			if (sameCnt < selCnt - 1) continue;




			//console.log("====>>>skp");
			//console.log(this.data.commodityAttr[n]);

			for (var i = 0; i < attrValueList.length; i++) {
				for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
					if (sameCnt == selCnt) {
						if (attrValueList[i].selectedValue == this.data.commodityAttr[n].attrValueList[i].attrValue && attrValueList[i].selectedValue == attrValueList[i].attrValues[j]) {

							attrValueList[i].attrValueStatus[j] = true;

							//修改min max
							console.log("price??", sameCnt, attrValueList.length)
							if (selCnt == attrValueList.length) {
								console.log(this.data.commodityAttr[n])
								
							}
							if (price > max) max = price;
							if (min == 0 || min > price) min = price;
							if (min == max) {
								PriceLabel = max;
							}else{
								PriceLabel = min + "-" + max
							}
						}
						else if (attrValueList[i].selectedValue == '' && this.data.commodityAttr[n].attrValueList[i].attrValue == attrValueList[i].attrValues[j]) {
							attrValueList[i].attrValueStatus[j] = true;
						}
					} else {
						// console.log(i);
						// console.log(this.data.commodityAttr[n]);
						// console.log(attrValueList[i].selectedValue != '', sameCnt == selCnt - 1, diffAttr == i, attrValueList[i].attrValues[j], this.data.commodityAttr[n].attrValueList[i].attrValue);

						if (sameCnt == selCnt && attrValueList[i].selectedValue == this.data.commodityAttr[n].attrValueList[i].attrValue && attrValueList[i].selectedValue == attrValueList[i].attrValues[j]) {
							// console.log(this.data.commodityAttr[n]);
							// console.log("第1情况", i, j, true);
							attrValueList[i].attrValueStatus[j] = true;
						}
						//已选项的规则其他选项
						else if (attrValueList[i].selectedValue != '' && sameCnt == selCnt - 1 && diffAttr == i && attrValueList[i].attrValues[j] == this.data.commodityAttr[n].attrValueList[i].attrValue) {
							// console.log("第2情况", i, j, true);
							attrValueList[i].attrValueStatus[j] = true;
						} else {
							//console.log(sameCnt, selCnt , attrValueList[i].selectedValue == '');
							//未选中的规格项，其他规格想必须相同
							if (sameCnt == selCnt && attrValueList[i].selectedValue == '' && this.data.commodityAttr[n].attrValueList[i].attrValue == attrValueList[i].attrValues[j]) {
								// console.log("第三情况", i, j, true);
								attrValueList[i].attrValueStatus[j] = true;
							}
						}
					}

				}
			}
		}
		//console.log("====>>>skp", attrValueList);
		this.setData({
			attrValueList: attrValueList,
			PriceLabel: PriceLabel
		});
	},


})