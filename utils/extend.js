Object.defineProperty(Object.prototype, 'existsKey', {
	value: function(obj, key) {
		if (obj) {
			let keys = Object.keys(obj);
			return keys.indexOf(key) >= 0;
		} else
			throw Error("param_1 is not defined.")
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
