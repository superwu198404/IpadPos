// 自定义值
const popup = {
	namespaced: true,
	state: {
		// 自定义的值
		customPopup: null,
		cache: []
	},
	mutations: {
		SET_POPUP(state, arr) {
			let _customPopup = {}
			arr.forEach(item => {
				if (item.type == 'customPopup') {
					_customPopup = item.data;
				}
			})
			state.customPopup = _customPopup;
		},
		REMOVE_POPUP(state) {
			state.customPopup = null;
		},
		SET_CACHE(state, type = 1) {
			if (type == 1) state.cache.push(1);
			else state.cache = [];
		}
	},
	actions: {
		// 设置自定义弹窗
		setPopup({ commit }, arr) {
			commit('SET_POPUP', arr);
		},
		// 删除弹窗配置
		removePopup({ commit }) {
			return new Promise((resolve, reject) => {
				commit('REMOVE_POPUP');
				resolve();
			})
		},
		// 记录连续打开的次数
		setCache({ commit }, type) {
			commit('SET_CACHE', type);
		},
		/**
		 * 打开弹窗参数说明
		 * @param {string} title 提示标题，默认没内容就不显示
		 * @param {string} titleColor 标题颜色，默认'#222'
		 * @param {string} content 提示内容，默认无
		 * @param {string} contentColor 内容颜色，默认'#222'
		 * @param {string} confirmText 确认按钮内容，默认'确认'
		 * @param {Boolean} showCancel 是否显示取消按钮，默认true
		 * @param {string} cancelText 确认按钮内容，默认'取消'
		 * @param {string} confirmColor 确认按钮颜色，默认'#2878FF'
		 * @param {string} cancelColor 取消按钮颜色，默认'#222'
		 * @param {Number} btnType 取消按钮颜色，默认1 1-左取消，右确认 2-与1相反
		 * @param {Boolean} maskClick 是否允许点蒙层关闭，默认true
		 * @param {Fnction} confirm 确认回调
		 * @param {Fnction} cancel 取消回调
		 */
		open({ commit }, param) {
			let {
				title,
				titleColor,
				titleIco,
				showTitleIco,
				content,
				contentColor, 
				showConfirm,
				showConfirmIco,
				confirmText,
				confirmColor,
				confirmIco, 
				showCancel,
				cancelColor,
				cancelText,
				cancelIco,
				showCancelIco, 
				showOther,
				otherColor,
				otherText,
				otherIco,
				showOtherIco,
				btnType,
				maskClick,
				confirm,
				cancel,
				other,
				refresh
			} = param;
			let data = {
				title,
				titleColor: titleColor ? titleColor : '#222',
				titleIco:(titleIco&&showTitleIco)?titleIco:"../../static/icons/badge.png",
				showTitleIco:showTitleIco==false?showTitleIco:true,
				content,
				contentColor: contentColor ? contentColor : '#222',
				showConfirm: showConfirm == false ? showConfirm : true,
				showConfirmIco:confirmIco?true:false,
				confirmText: confirmText ? confirmText : '确认',
				confirmColor: confirmColor ? confirmColor : '#2878FF',
				confirmIco:confirmIco ?confirmIco:null,
				showCancel: showCancel == true ? showCancel : false,
				cancelColor: cancelColor ? cancelColor : '#222',
				cancelText: cancelText ? cancelText : '取消',
				cancelIco:cancelIco?cancelIco:null,
				showCancelIco:showCancelIco?true:false,
				showOther: showOther == true ? showOther : false,
				otherColor: otherColor ? otherColor : '#ffaa00',
				otherText: otherText ? otherText : '其它自定义',
				otherIco:otherIco?otherIco:null,
				showOtherIco:otherIco?true:false,
				btnType: btnType ? btnType : 1,
				maskClick: maskClick == false ? maskClick : true,
				confirm,
				cancel,
				other,
				refresh:false,
				random: new Date().getTime()
			};
			
			// this.dispatch('popup/removePopup').then(() => {
			// 	this.dispatch('popup/setPopup', [{ type: 'customPopup', data: data }]);	
			// 	uni.navigateTo({
			// 		url: '/pages/lipan-popup/lipan-popup'
			// 	})
			// })
			
			this.dispatch('popup/removePopup').then(() => {
				this.dispatch('popup/setPopup', [{ type: 'customPopup', data: data }])
				uni.navigateTo({
					url: '/pages/popup/ShowPopup'
				})
			})
		}
	}
};
export default popup;
