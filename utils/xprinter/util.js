
const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(
		':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

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
	} else {
		return currentDate + " " + currentTime;
	}
}

// 获取字节的个数
function getComputedByteLen(content, totalleng) {
	let contentLength = content.replace(/[^\x00-\xff]/g, '01').length;
	let data = "";
	let nbspStr = "";
	//如果长度超出最大占位，则截取字符显示
	if (contentLength > totalleng) {
		data = content.substr(0, totalleng / 2).PadRight(totalleng - 1, '\u0020');
	} else {
		data = content;
		let subLength = totalleng - contentLength;
		for (var i = 0; i < subLength; i++) {
			nbspStr += "\u0020";
		}
	}
	return data + nbspStr;
}

//方法一扩展（C#中PadLeft、PadRight）
String.prototype.PadLeft = function(len, charStr) {
	var s = this + '';
	return new Array(len - s.length + 1).join(charStr, '') + s;
}
String.prototype.PadRight = function(len, charStr) {
	var s = this + '';
	return s + new Array(len - s.length + 1).join(charStr, '');
}

function inArray(arr, key, val) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === val) {
			return i;
		}
	}
	return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
	var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
		return ("00" + bit.toString(16)).slice(-2);
	});
	return hexArr.join("");
}

function convertToGrayscale(data) {
	let g = 0;

	for (let i = 0; i < data.length; i += 4) {
		g = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
		data[i] = g;
		data[i + 1] = g;
		data[i + 2] = g;
	}
	return data;
}

function setPixel(data, offset, value) {
	data[offset] = value;
	data[offset + 1] = value;
	data[offset + 2] = value;
}

function adjustPixel(data, offset, value) {
	data[offset] += value;
}

// 彩色图转成单色图
function convertToMonoImage(width, height, data, shake) {
	let g = 0;
	let e = 0;

	for (let i = 0; i < data.length; i += 4) {
		data[i] = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let dataOffset = (width * y + x) * 4;
			g = data[dataOffset];

			if (g >= 150) {
				// 灰色转黑白的阈值, 可以调整打印效果
				e = g - 255;
				setPixel(data, dataOffset, 255);
			} else {
				e = g;
				setPixel(data, dataOffset, 0);
			}

			if (!shake) continue;

			if (x < width - 1 && y < height - 1) {
				//右边像素处理
				data[(width * y + x + 1) * 4] += (7 * e) / 16; //下

				data[(width * (y + 1) + x) * 4] += (5 * e) / 16; //右下

				data[(width * (y + 1) + x + 1) * 4] += e / 16; //左下

				if (x > 0) {
					data[(width * (y + 1) + x - 1) * 4] += (3 * e) / 16;
				}
			} else if (x == width - 1 && y < height - 1) {
				//下方像素处理
				data[(width * (y + 1) + x) * 4] += (5 * e) / 16;
			} else if (x < width - 1 && y == height - 1) {
				//右边像素处理
				data[(width * y + x + 1) * 4] += (7 * e) / 16;
			}
		}
	}
	return data;
}

module.exports = {
	formatTime: formatTime,
	getTime: getTime,
	getComputedByteLen: getComputedByteLen,
	inArray: inArray,
	ab2hex: ab2hex,
	convertToGrayscale: convertToGrayscale,
	adjustPixel: adjustPixel,
	convertToMonoImage: convertToMonoImage
};
