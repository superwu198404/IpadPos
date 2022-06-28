import sj_show_modal from './show_modal.js'
const g_show_modal = {
	install: function(Vue) {
      Vue.prototype.$showModal=function(op={}){
		 return	new Promise((resolve, reject)=>{
		    				new sj_show_modal({
		    					...op,
		    					$event:function(e){
		    						let fn = ()=>{};
		    						if(e.res){
		    							if(e.types=='confirm'&&!!op.$confirm){
		    								this.$confirm=op.$confirm||fn;
		    								this.$confirm(op);
		    								
		    							}
		    							 if(e.types=='cancel'&&!!op.$cancel){
		    							 	this.$cancel=op.$cancel||fn;
		    							 	this.$cancel(op);
		    							 }
		    							 if(e.types=='other'&&!!op.$other){
		    							 	this.$other=op.$other||fn;
		    							 	this.$other({op});
		    							 }
		    							if(e.types=='cover'&&!!op.$cover){
		    								this.$cover=op.$cover||fn;
		    								this.$cover({op});
		    							}
		    							resolve(e);
		    						}else{
		    							reject(e);
		    						}
		    					 }
		    					}).show();
		    			})
		 }
	}
};

export default g_show_modal
