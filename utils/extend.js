Object.defineProperty(Object.prototype, 'existsKey', {
	value: function(obj, key) {
		if (obj) {
			let keys = Object.keys(obj);
			return keys.indexOf(key) >= 0;
		} else
			throw Error("obj is not defined.")
	}
})

Object.defineProperty(Object.prototype, 'cover', {
	value: function(target, orgin) {
		if (target && orgin) {
			let target_keys = Object.keys(target);
			target_keys.forEach(key => {
				if (orgin[key] !== undefined && orgin[key] !== '')
					target[key] = orgin[key];
			})
			return target;
		} else
			throw Error("target or orgin is not defined.")
	}
})

Object.defineProperty(Array.prototype, 'remove', {
	value: function(callback) {
		if (!Array.isArray(this)) return;
		if (callback) {
			let old_array = this;
			let delete_array = [];
			for (let index = 0; index < old_array.length; index++) {
				if (callback(old_array[index])) {
					delete_array.push(old_array[index]);
				}
			}
			for (let item of delete_array) {
				this.splice(this.indexOf(item), 1);
			}
			return delete_array;
		} else
			throw Error("callback is not defined.")
	}
})

Object.defineProperty(Array.prototype, 'first', {
	value: function() {
		if (this.length > 0) {
			return this[0];
		} else
			return null;
	}
})

Object.defineProperty(Array.prototype, 'last', {
	value: function() {
		if (this.length > 0) {
			return this[this.length - 1];
		} else
			return null;
	}
})

const replaceAll = String.prototype.replaceAll;
Object.defineProperty(String.prototype, 'replaceAll', {
	value: function(searchValue, replaceValue) {
		if (replaceAll) {
			return replaceAll.apply(this, Array.from(arguments));
		} else { //表示当前环境不支持 replaceAll
			return String.prototype.replace.apply(this, [new RegExp(searchValue, 'g'), replaceValue]);
		}
	}
})

Object.defineProperty(Date.prototype, 'SetSeconds', {
	value: function(number = 0) {
		if (number) {
			return new Date(this.setSeconds(this.getSeconds() + number));
		} else
			return this;
	}
})

Object.defineProperty(Date.prototype, 'SetMinutes', {
	value: function(number = 0) {
		if (number) {
			return new Date(this.setMinutes(this.getMinutes() + number));
		} else
			return this;
	}
})

Object.defineProperty(Date.prototype, 'SetHours', {
	value: function(number = 0) {
		if (number) {
			return new Date(this.setHours(this.getHours() + number));
		} else
			return this;
	}
})

Object.defineProperty(Object.prototype, 'BindMine', {
	value: function(obj = null) {
		let that = obj || this;
		for(var prop in this){
			if(this[prop] instanceof Function){
				this[prop] = this[prop].bind(that);
			}
		}
	}
})