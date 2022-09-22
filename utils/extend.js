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
		if (callback) {
			let old_array = this;
			let delete_array = [];
			for (let index = 0; index < old_array.length; index++) {
				if(callback(old_array[index])){
					delete_array.push(old_array[index]);
				}
			}
			for(let item of delete_array){
				this.splice(this.indexOf(item),1);
			}
			return delete_array;
		} else
			throw Error("callback is not defined.")
	}
})

Object.defineProperty(Array.prototype, 'first', {
	value: function() {
		if(this.length > 0){
			return this[0];
		}
		else
			return null;
	}
})