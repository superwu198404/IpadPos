function formatDate (date){
	let dateNew = new Date(date.replace(/-/g,'/'));
	const year = dateNew.getFullYear();
	const month = dateNew.getMonth() + 1;
	const day = dateNew.getDate();
	//yyyy-MM-dd HH:mm:ss
	return year + '-' + month + '-' + day;
}

function formatDateNew (date){
	try{
		let dateNew = new Date(date.replace(/-/g,'/'));
		const year = dateNew.getFullYear();
		const month = dateNew.getMonth() + 1;
		const day = dateNew.getDate();
		//yyyy-MM-dd HH:mm:ss
		return year + '/' + month + '/' + day;
	}catch(e){
		console.log("formatDateNew err",e)
	}
	return "";
}

function getTime(type) {
	let date = new Date(),
		currentDate,
		currentTime,
		seperator = "-", // 如果想要其他格式 只需 修改这里 
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		weex = date.getDay(),
		day = date.getDate(),
		hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
		minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
		second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	month >= 1 && month <= 9 ? (month = "0" + month) : "";
	day >= 0 && day <= 9 ? (day = "0" + day) : "";
	//当前 日期
	currentDate = year + seperator + month + seperator + day;
	//当前 时间
	currentTime = hour + ":" + minute + ":" + second;
	// 输出格式 为 2018-8-27 14:45:33
	// console.log(currentDate +" "+ currentTime);
	if (type == 0) {
		return currentDate
	} else if (type == 1) {
		return currentTime;
	} else if (type == 2) {
		if (weex == 1) {
			return '星期一'
		}
		if (weex == 2) {
			return '星期二'
		}
		if (weex == 3) {
			return '星期三'
		}
		if (weex == 4) {
			return '星期四'
		}
		if (weex == 5) {
			return '星期五'
		}
		if (weex == 6) {
			return '星期六'
		}
		if (weex == 7) {
			return '星期日'
		}
	} else if (type == 10) {
		return weex;
	} else {
		return currentDate + " " + currentTime;
	}
}

const snvl = function(pb_obj, pm_default) {
	let new_obj = "";
	if (pb_obj == null || pb_obj == "" || pb_obj == undefined || isNaN(pb_obj)) {
		new_obj = pm_default;
	} else {
		new_obj = pb_obj.toString();
	}
	return new_obj;
}

const ynToBool = function(pm_str) {
	let new_obj = false;
	if (pm_str == "Y") {
		new_obj = true;
	} else {
		new_obj = false;
	}
	return new_obj;
}

const dnvl = function(pb_obj, pm_default) {
	let new_obj = "";

	var dates = [];
	dates.push(new Date(snvl(pm_default,"").replace(/-/g,'/')))
	var minDate = new Date(Math.min.apply(null, dates));

	if (pb_obj == null || pb_obj == "" || pb_obj == undefined) {
		new_obj = minDate;
	} else {
		new_obj = new Date(snvl(pb_obj,"").replace(/-/g,'/'));
	}
	return new_obj;
}

//返回string类型
const defStr = function(pb_obj, pm_default){
	let new_obj = "";
	if (pb_obj == null || pb_obj == "" || pb_obj == undefined || pb_obj == NaN) {
		new_obj = pm_default;
	} else {
		try {
			new_obj = pb_obj;
		} catch (e) {
			new_obj = "";
		}
	}
	return new_obj;
}

const nnvl = function(pb_obj, pm_default) {
	let new_obj = 0;
	if (pb_obj == null || pb_obj == "" || pb_obj == undefined || isNaN(pb_obj)) {
		new_obj = pm_default;
	} else {
		try {
			new_obj = parseFloat(pb_obj);
		} catch (e) {
			new_obj = -1;
		}
	}
	//console.log(pb_obj + ",nnvl new_obj",new_obj)
	return new_obj;
}

const timeTodec = function(dtime, minValue) {
	let new_obj = 0;
	if (dtime == minValue) {
		new_obj = 0;
	} else {
		let dttime1 = new Date(snvl(dtime,"").replace(/-/g,'/'));
		let sd = Math.floor(dttime1.getHours());
		let ff = Math.floor(dttime1.getMinutes()) / 60;
		ff = Math.round(ff * 100) / 100;
		new_obj = sd + ff;
	}
	return new_obj;
}

///销售方式 None = 0, Sale = 1, SaleTh=2, SaleYd=3, SaleYdqx=4, SaleYdtq=5, SxSale=6, SxSaleTh=7, SaleWebtq=8, KqSale=9
const xsType = function(type) {
	switch (type) {
		case 0:
			return "None";
			break;
		case 1:
			return "Sale";
			break;
		case 2:
			return "SaleTh";
			break;
		case 3:
			return "SaleYd";
			break;
		case 4:
			return "SaleYdqx";
			break;
		case 5:
			return "SaleYdtq";
			break;
		case 6:
			return "SxSale";
			break;
		case 7:
			return "SxSaleTh";
			break;
		case 8:
			return "SaleWebtq";
			break;
		case 9:
			return "KqSale";
			break;
	}
}

///根据条件过滤出需要的datatable
const retDtforConditions = function(data, where_al, where_val) {
	let inputSoArr = data.filter((ev) => {
		switch (where_al) {
			case "BILL":
				return ev.BILL.indexOf(where_val) != -1;
				break;
			case "SPID":
				//console.log("ev",ev.SPID.toString().indexOf(where_val));
				//return parseInt(ev.SPID).toString().indexOf(where_val) != -1;
				return ev.SPID.toString().indexOf(where_val) != -1;
				break;
		}
	});
	return inputSoArr;
}

///所有人 会员或者非会员
const ryType = function(type) {
	switch (type) {
		case 1:
			return "all";
			break;
		case 2:
			return "Hy";
			break;
		case 3:
			return "Nhy";
			break;
	}
}

///促销折扣方式  新增加最小售价免单  免单数量为MJ_NET   JfSales:积分促销
const cxZkType = function(type) {
	switch (type) {
		case 1:
			return "Subnet";
			break;
		case 2:
			return "Subdisc";
			break;
		case 3:
			return "zjprice";
			break;
		case 4:
			return "MinFree";
			break;
		case 5:
			return "JfSales";
			break;
	}
}

///促销条件
const cxZkTj = function(type) {
	switch (type) {
		case 1:
			return "Qty";
			break;
		case 2:
			return "Net";
			break;
	}
}

///转成string类型
const toStr = function(data) {
	if (data == null || data == undefined) {
		return "";
	} else {
		return data.toString();
	}
}

const TryParse = function(BALANCE){
	let hyjfnum = 0;
	try{
		hyjfnum = parseFloat(BALANCE);
	}catch(e){
		hyjfnum = -1;
	}		
	return hyjfnum;
}

const DefaultNull = function(data,dataNull){
	let strNull = "";
	try{
		if(data == null){
			return strNull;
		}else if(dataNull == null || dataNull == undefined){
			return strNull;
		}else{
			return dataNull;
		}
	}catch(e){
		strNull = "";
	}
	return strNull;
}

module.exports = {
	getTime: getTime,
	snvl: snvl,
	ynToBool: ynToBool,
	dnvl: dnvl,
	timeTodec: timeTodec,
	xsType: xsType,
	ryType: ryType,
	retDtforConditions: retDtforConditions,
	nnvl: nnvl,
	cxZkType: cxZkType,
	cxZkTj: cxZkTj,
	toStr: toStr,
	TryParse: TryParse,
	defStr: defStr,
	formatDate: formatDate,
	DefaultNull: DefaultNull,
	formatDateNew: formatDateNew,
};
