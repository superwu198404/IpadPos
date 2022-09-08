Object.defineProperty(Object.prototype, 'existsKey', {
	value: function(obj, key) {
		if (obj) {
			let keys = Object.keys(obj);
			return keys.indexOf(key) >= 0;
		} else
			throw Error("'obj' is not defined.")
	}
})
