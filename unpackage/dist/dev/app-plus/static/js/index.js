/**
 * author:G brother
 * date:20200430
 * Thank:chunLei所提供的思路和参照
 * **/
export class show_model{
	constructor(option={}) {
	
		this.bodyModel=null;
		this.cancelModel=null;
		this.confirmModel=null;
		let pageHeight=uni.getSystemInfoSync().screenHeight;
		let opacity = option.opacity || 0.4;
		let model_tit=option.title||'温馨提示';
		let model_concent=option.concent||"请输入内容~"
		let clickEvent=option.IsclickEvent||false;
		let cancelVal=option.cancelVal||'取消';
		let confirmVal=option.confirmVal||'确认';
		let otherVal=option.otherVal||'其它';
		let cancelColor=option.cancelColor||'#0F7EF5';
		let confirmColor=option.confirmColor||'#0F7EF5';
		let otherColor=option.otherColor||'#0F7EF5';
		let showCancel=option.showCancel||false;
		let showOther=option.showOther||false;
		let align=option.align||"center"
		let fn = ()=>{}
		this.$event = option.$event || fn
		
		//#ifdef APP-PLUS
		this.creatView({height:`${pageHeight}px`,top:0},opacity,
		clickEvent,
		{'tit':model_tit,'concent':model_concent,cancelVal,confirmVal,confirmColor,cancelColor,showCancel,otherVal,otherColor,showOther,align})
		//#endif
	}

	//生成提示框view
	creatView(style,opa,clickEvent,modelInfo){
		style = {
			left:'0px',
			width:'100%',
			...style
		}
		
		let view = new plus.nativeObj.View('showModalView',style);
		let butnums=modelInfo.showCancel||modelInfo.showOther?(modelInfo.showCancel&&modelInfo.showOther?3:2):1;
		view.draw([
			{tag:'rect',id:'modal',color:`rgba(0,0,0,${opa})`,position:{top:'0px',left:'0px',width:'100%',height:'100%'}},
		    {tag:'rect',id:'concent',color:`rgb(255,255,255)`,rectStyles:{borderWidth:'2px',radius:'5px'},position:{top:'40%',left:'10%',width:'80%',height:'21%'}},
		    {tag:'font',id:'title',text:modelInfo.tit,textStyles:{size:'20px',color:'#000'},position:{top:'42%',left:'10%',width:'80%',height:'3%'}},
		    {tag:'font',id:'text',text:modelInfo.concent,textStyles:{size:'16px',color:'#666',whiteSpace:'normal',align:modelInfo.align},position:{top:'43%',left:'14%',width:'72%',height:'11%'}},
		    {tag:'rect',id:'line',color:'#dcdcdc',position:{top:'54%',left:'10%',width:'80%',height:'1px'}},
			{tag:'rect',id:'line2',color:'#dcdcdc',position:{top:'54%',left:butnums==2?'50%':'36%',width:!modelInfo.showCancel?'0px':'1px',height:!modelInfo.showCancel?'0px':'7%'}},
			{tag:'rect',id:'line3',color:'#dcdcdc',position:{top:'54%',left:butnums==2?'50%':'65%',width:!modelInfo.showOther?'0px':'1px',height:!modelInfo.showOther?'0px':'7%'}}
		]);

	   //取消
		if(modelInfo.showCancel){
			let canWith= modelInfo.showCancel&&modelInfo.showOther?'20%':'30%';
			// console.info('showCancel:',canWith);
			let canleft=  modelInfo.showCancel&&modelInfo.showOther?'40%':'50%';
			// console.info('showCancel:',canleft);
			// 取消	
			let viewCancel=new plus.nativeObj.View('cancel',{width:canWith,height:'5%',top:'55%',left:canleft,backgroundColor:'#ffffff'});
			    viewCancel.draw([
				  {tag:'font',id:'cancel',text:modelInfo.cancelVal,textStyles:{color:modelInfo.cancelColor,size:'18px'}},
				]);
				
				viewCancel.addEventListener("click",(e)=>{
					this.$event({res:false,types:'cancel'});
					this.hide()
				},false);
				this.cancelModel=viewCancel;
		}
		if(modelInfo.showOther){
			let othWith= modelInfo.showOther&&modelInfo.showCancel?'20%':'30%';
			// console.info('showOther:',othWith);
			let othleft=  modelInfo.showOther&&modelInfo.showCancel?'68%':'50%';
			// console.info('showOther:',othleft);
			// 取消	
			let viewOther=new plus.nativeObj.View('other',{width:othWith,height:'5%',top:'55%',left:othleft,backgroundColor:'#ffffff'});
			    viewOther.draw([
				  {tag:'font',id:'other',text:modelInfo.otherVal,textStyles:{color:modelInfo.otherColor,size:'18px'}},
				]);
				
				viewOther.addEventListener("click",(e)=>{
					this.$event({res:false,types:'other'});
					this.hide()
				},false);
				this.otherModel=viewOther;
		}
		let conWith= modelInfo.showCancel||modelInfo.showOther?(modelInfo.showCancel&&modelInfo.showOther?'23%':'30%'):'80%';
		// console.info(conWith);
		let conleft= modelInfo.showCancel||modelInfo.showOther?(modelInfo.showCancel&&modelInfo.showOther?'10%':'20%'):'10%';
		// console.info(conleft);
		// 确认
		let viewconfirm=new plus.nativeObj.View('confirm',{width:conWith,height:'5%',top:'55%',left:conleft,backgroundColor:'#ffffff'});
	        viewconfirm.draw([
			  {tag:'font',id:'confirm',text:modelInfo.confirmVal,textStyles:{color:modelInfo.confirmColor,size:'18px'}},
			]);
		
			viewconfirm.addEventListener("click",(e)=>{
				this.$event({res:true,types:'confirm'});
				this.hide();
			},false);	
		  //点击蒙布
		  if(clickEvent){
			 view.addEventListener("click", (e) => {
				this.$event({res:false,types:'cover'});
				this.hide()
			}, false);
		}
	   this.bodyModel=view;
	   this.confirmModel=viewconfirm;
	}
    showModalAnimationClose(){
		var options = {type:'pop-out',duration:300};
			plus.nativeObj.View.startAnimation(options,{bitmap:this.bodyModel},{bitmap:this.cancelModel},{bitmap:this.viewconfirm},{bitmap:this.otherModel},function(){
				console.log('plus.nativeObj.View.startAnimation动画结束');
				// 关闭原生动画
				plus.nativeObj.View.clearAnimation();
			});
	}
	showModalAnimationOpen(){
		var options = {type:'pop-in',duration:300};
			plus.nativeObj.View.startAnimation(options,{bitmap:this.bodyModel},{bitmap:this.cancelModel},{bitmap:this.viewconfirm},{bitmap:this.otherModel},function(){
				console.log('plus.nativeObj.View.startAnimation动画结束');
				// 关闭原生动画
				plus.nativeObj.View.clearAnimation();
			});
	}
	show(){
		this.showModalAnimationOpen();
		this.bodyModel.show();
		if(this.cancelModel){
			this.cancelModel.show();
		}
		if(this.otherModel){
		  this.otherModel.show();	
		}
		this.confirmModel.show();
	
	}
	hide(){
		this.showModalAnimationClose();
		this.bodyModel.hide();
		if(this.cancelModel){
	      this.cancelModel.hide();	
		}
		if(this.otherModel){
		  this.otherModel.hide();	
		}
		this.confirmModel.hide();
		
		
	}
}

export default show_model