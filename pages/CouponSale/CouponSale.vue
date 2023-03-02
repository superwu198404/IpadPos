<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>
<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<view class="right right-correct">
			<!-- ���������� -->
			<Head :custom.sync="view.big_customer" :_ynDKF='view.enable_customer'></Head>
			<!-- ������ -->
			<view class="steps">
				<view class="listep curr">
					<text class="xuhao">01</text>
					<view class="setname"><label>¼�����ۿ�ȯ</label><text>ˢ����ɨȯ�����ֶ�¼��</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">02</text>
					<view class="setname"><label>ȷ���ۿۺͽ���</label><text>�Ƿ�ѡ���ͻ�������</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">03</text>
					<view class="setname"><label>֧��</label><text>��֧�����󼤻�/��ֵ</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">04</text>
					<view class="setname"><label>�ȴ�����/��ֵ</label><text>��֧������</text></view>
					<!-- <em>>>>>>></em> -->
				</view>
			</view>
			<view class="listof listof-correct">
				<view class="prolist prolist-correct zxpro " style="width: 92%;">
					<view class="choice">
						<view class="tab curr">
							<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
							<text>�ȯ����</text>
						</view>
					</view>
					<view class="module" style="height: 66%;">
						<view class="hh">�������� <em></em></view>
						<!-- ûˢ��ʱ��ʾ -->
						<view class="swipetip" v-if="view.swipe_tip">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>����ˢ��¼��</text>
						</view>
						<!-- ˢ������ʾ���б� -->
						<view class="cardlist">
							<view class="ulli" v-for="sales in source.sale2_union_sale6">
								<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
								<view class="h6">
									<label>��{{ sales.sale002.PRICE }}<text>/{{ sales.sale002.QTY }}��</text></label>
									<view class="zje">
										<view><text>�ܽ���</text>��{{ sales.sale002.NET }}</view>
										<button @click="remove_union(sales)">
											<image src="@/images/img2/ka-shanchu.png"></image>
										</button>
									</view>
								</view>
								<view class="card-num">
									<label>ʼ��<text>{{ sales.sale006.KQIDS }}</text></label>
									<label>�գ�<text>{{ sales.sale006.KQIDE }}</text></label>
								</view>
								<view class="statistic">
									<label><em>��</em><text>���ۿۣ�</text>567</label>
									<label><em>��</em><text>Ĭ���ۿۣ�</text>5</label>
									<label><em>��</em><text>��׼�ۿۣ�</text>54</label>
									<label><em>��</em><text>�����ۿۣ�</text>5</label>
								</view>
							</view>

						</view>
					</view>
					<view class="totals">
						<view>
							<em></em>
							<label>��������<text>{{ unpaid_total_quantity }}</text></label>
							<label>�ܽ��<text>��{{ unpaid_total_amount }}</text></label>
						</view>
						<button class="btn" @click="to_payment">ȷ��֧��</button>
					</view>
					<!-- ��ʼ���� -->
					<CardNumEntry :show.sync="view.no_input"></CardNumEntry>
				</view>
				<view class="operation operation-correct">
					<view class="sorting">
						<view class="a-z">
							<image src="../../images/img2/shuakalr.png" mode="widthFix" @click="view.no_input=true">
							</image>
						</view>
						<view class="a-z">
							<image src="../../images/VIP-dlu.png" mode="widthFix" @click="view.enable_special_discount=true"></image>
						</view>
						<view class="a-z">
							<image src="@/images/img2/chikaren.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<SpecialDisc v-if="view.enable_special_discount" :zkdatas="source.discount_infos" :product="source.sale002"></SpecialDisc>
				<!-- ���� -->
				<view class="canvasdiv" :style="'visibility:hidden;'">
					<canvas canvas-id="couponQrcode" class="canvas"
						:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
					<canvas canvas-id="canvasLogo" class="canvas"
						:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
					<canvas canvas-id="canvasXPEWM" class="canvas"
						:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue';
	
	import member from '@/api/hy/MemberInterfaces.js';
	import Sale from '@/utils/sale/card_coupon.js';
	import util from '@/utils/util.js';
	import sales from '@/utils/sale/saleClass.js';
	import main from '@/api/business/main.js';
	import PrinterPage from '@/pages/xprinter/receipt';
	import {
		RequestSend
	} from '@/api/business/da.js';
	import {
		Sale3Model,
		Sale3ModelAdditional
	} from '@/bll/PaymentBusiness/bll.js';
		
	var $ = null;
	export default {
		name: "CouponSale",
		components: {
			Head,
			PrinterPage,
		},
		data() {
			return {
				form: {
					start_coupon_no: "400000005787429980",
					end_coupon_no: "400000005787431313",
				},
				view: {
					select_coupon_segment: null,
					no_input: false,
					swipe_tip: false,
					big_customer: true,
					enable_customer: true,
					enable_special_discount: false
				},
				source: {
					enable_credit: false,
					sale001: null,
					sale002: [],
					sale003: [],
					sale006: [],
					sxsale001: null,
					sale2_union_sale6: [],
					coupon_active_success: false,
					big_customer_info: null,
					discount_infos: null
				},
				sale: null,
				container: null,
				//��ӡ����
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 256, //��ά����
				qrCodeHeight: 256, // ��ά����
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				FKDA_INFO: [], //������Ϣ
			}
		},
		onReady: function() {
			let that = this;
			//��ѯ���ʽ
			(util.callBind(that, async function() {
				try {
					await RequestSend(`SELECT FKID,SNAME,JKSNAME FROM FKDA`, util.callBind(that, function(res) {
						if (res.code) {
							that.FKDA_INFO = JSON.parse(res.data);
							util.setStorage('FKDA_INFO', that.FKDA_INFO)
							console.log("[GetSale]��ȡ֧����ʽ==========:", that.FKDA_INFO);
						} else {
							console.log("��ȡ���ʽʧ��!======",err);
						}
					}))
				} catch (err) {
					console.log("��ȡ���ʽʧ��!======",err);
				}
			}))()
		},
		computed: {
			unpaid_total_quantity() {
				return this.source.sale002.map(sale2 => sale2.QTY).reduce((prev_qty, next_qty) => prev_qty + next_qty, 0);
			},
			unpaid_total_amount() {
				return this.source.sale001?.TNET || 0;
			}
		},
		watch: {
			'form.start_coupon_no'(n, o) {
				console.log("[Watch-Coupon]ȯ�ŷ�������...");
			},
			'view.no_input'(n, o) {
				if (n === true) {
					uni.$once("GetCardNums", $(function(data) {
						console.log("[Watch-Number-Info]��ȡ��������Ϣ:", data);
						let added = this.source.sale006.find(sale6 => sale6.KQIDS === data.begin_num || sale6
							.KQIDE === data.begin_num || sale6.KQIDS === data.end_num || sale6.KQIDE ===
							data.end_num);
						if (added) { //�ж��Ƿ������غϵ�ȯ��
							util.simpleMsg('��ǰ��ʼ������ȯ���ѱ����ӣ�������¼��!')
							return;
						}
						this.form.start_coupon_no = data.begin_num;
						this.form.end_coupon_no = data.end_num || data.begin_num;
						this.coupon_sale();
					}));
				} else if (n === false) {
					uni.$off("GetCardNums");
				}
			},
			'source.sale002'(n, o) {
				let sale001 = this.source.sale001,
					total_amount = this.source.sale002.map(sale2 => sale2.NET).reduce((prev_net, next_net) => prev_net +
						next_net, 0);
				sale001.TNET = total_amount;
				sale001.ZNET = total_amount;
			}
		},
		methods: {
			remove_union(sales) {
				let remove_sale2_index = this.source.sale002.indexOf(sales.sale002),
					remove_sale6_index = this.source.sale006.indexOf(sales.sale006),
					remove_union_index = this.source.sale2_union_sale6.indexOf(sales);
				if (remove_sale2_index != -1)
					this.source.sale002.splice(remove_sale2_index, 1);
				if (remove_sale6_index != -1)
					this.source.sale006.splice(remove_sale6_index, 1);
				if (remove_union_index != -1)
					this.source.sale2_union_sale6.splice(remove_union_index, 1);
			},
			async get_discount_data(id){
				return await _main.GetZKDatasAll(id);
			},
			async get_payment_infos(){
				return await RequestSend(`SELECT FKID,SNAME,JKSNAME FROM FKDA`, $(function(res) {
					if (res.code) {
						this.FKDA_INFO = JSON.parse(res.data);
						util.setStorage('FKDA_INFO', this.FKDA_INFO)
						console.log("[GetPaymentInfos]��ȡ֧����ʽ:", this.FKDA_INFO);
					} else {
						console.log("[GetPaymentInfos]��ȡ���ʽʧ��!", res);
					}
				}))
			},
			async coupon_info_search() {
				return await member.coupon_sale.CouponInfoSearch({
					coupon_start: this.form.start_coupon_no
				})
			},
			async coupon_store_search(id) {
				return await member.coupon_sale.CouponStoreSearch({
					begin_num: this.form.start_coupon_no,
					end_num: this.form.end_coupon_no,
					material_id: id,
					khid: this.KHID
				})
			},
			async coupon_segment_valid() {
				return await member.coupon_sale.CouponValid({
					coupon_start: this.form.start_coupon_no,
					coupon_end: this.form.end_coupon_no,
					khid: this.KHID
				})
			},
			async coupon_segment_distribute() {
				return await member.coupon_sale.CouponDistribute({
					bill: this.source.sale001.BILL,
					disc: 0,
					khid: this.KHID,
					appid: getApp().globalData.appid,
					coupon_infos: this.source.sale2_union_sale6.map($(function(salas){
						return {
							start_no: salas.sale006.KQIDS,
							end_no: salas.sale006.KQIDE,
							count: salas.sale006.QTY,
							total_denomination: salas.sale002.NET
						}
					}))
				})
			},
			async coupon_segment_activate() {
				return member.coupon_sale.CouponActivation({
					bill: this.source.sale001.BILL,
					khid: this.KHID
				});
			},
			async coupon_sale() {
				console.log("[CouponSale]��ʼ��ȯ����...");
				var good_id = null;
				await this.coupon_info_search().then($(function(res) {
					console.log("[CouponSale]ȯ��Ϣ��ѯ:", res);
					if (res.code) {
						good_id = res.data.coupon_good_no;
						return this.coupon_store_search(good_id);
					} else {
						util.simpleMsg("ȯ��Ϣ��ѯ����!" + (res?.msg || ""), true)
					}
				})).then($(function(res) {
					console.log("[CouponSale]ȯ����У��:", res);
					let data = res.data;
					if (res.code && data?.length && data[0].CARDNUM != 0) {
						return this.coupon_segment_valid();
					} else {
						util.simpleMsg("ȯ����У���������������Ƿ��ڵ�ǰ�ŵ�ȯ����!" + (res?.msg || ""), true)
					}
				})).then($(async function(res) {
					console.log("[CouponSale]ȯ�ɷ��ۺŶ�У��:", res);
					if (res.code) {
						try {
							let product_info = await this.sale.MatchSP(good_id, res.data.coupon_count,
								res
								.data.coupon_value);
							if (this.source.sale001 === null) { //�ж��Ƿ����� sale001���������򴴽�
								this.source.sale001 = this.factory.get_sale001({
									ZNET: product_info.NET,
									TNET: product_info.NET,
								});
							}
							let sale002 = this.factory.get_sale002(this.source.sale001, product_info);
							let sale006 = this.factory.get_sale006(this.source.sale001, {
								QTY: res.data.coupon_count,
								SPID: good_id,
								KQIDS: this.form.start_coupon_no,
								KQIDE: this.form.end_coupon_no
							});
							this.source.sale002.push(sale002);
							this.source.sale006.push(sale006);
							this.source.sale2_union_sale6.push({
								sale002,
								sale006
							});
							console.log("[CouponSale]�Ѽ��뵽��֧���б�:", this.source);
						} catch (e) {
							console.log("[CouponSale]ȯ��Ʒ��Ϣ��ѯʧ��:", e);
						}
					} else {
						util.simpleMsg("ȯ�����ۺŶ�У������!" + (res?.msg || ""), true);
					}
				})).then($(function() {
					this.form = this.$options.data().form;
					console.log("[CouponSale]���ñ�����Ϣ����...");
				}));
			},
			async coupon_activate() {
				console.log("[CouponActivate]׼����ʼȯ�ż�������...");
				await this.coupon_segment_distribute().then($(function(res){
					console.log("[CouponActivate]ȯ�ż�����������:",res);
					if (res.code) {
						return this.coupon_segment_activate();
					} else {
						util.simpleMsg("ȯ��������ʧ��!" + (res?.msg || ""), true);
					}
				})).then($(function(res){
					console.log("[CouponActivate]ȯ�ż�������:",res);
					if (res.code) {
						util.simpleMsg("ȯ�����ɹ�!" , true);
					} else {
						this.source.sale001.STR1 = "����ʧ��";
						util.simpleMsg("ȯ����ʧ��!" + (res?.msg || ""), true);
					}
				}))
				console.log("[CouponActivate]ȯ�ż�������ִ������...");
				this.save_orders();//�������ɶ����������ɹ�������Ӱ�충�����ɣ�������Ҫ��¼�������������Ե�д�ڼ�������
			},
			async save_orders() {//��ΪĿǰ����Ϊ��������ִ�У����������굥�ݺ��������¶�����Ϣ
				console.log("[SaveOrders]׼����ʼ���ɶ��������ϴ�������Ϣ��������...");
				try{
					let created_sales_result = await this.sale.Completed({
						SALE001: this.source.sale001,
						SALE002: this.source.sale002,
						SALE003: this.source.sale003,
						SXSALE001: this.source.sxsale001
					});
					console.log("[SaveOrders]�ϴ����ϣ��ϴ�������", created_sales_result);
					this.receipt_printing(this.source);
					this.source = this.$options.data().source;
					util.simpleMsg(created_sales_result.msg, !created_sales_result.code);
				}catch(e){
					console.log("[SaveOrders]ִ���쳣:",e);
				}
			},
			receipt_printing(source){//��ӡ����д������
			    let that = this;
				//���ô�ӡ
				let printerPram = {
					"PRINTNUM": 1,
					"XSTYPE": "SQ",
				};
				
				let arr3 = that.source.sale003;
				let fkdaRes = that.FKDA_INFO;
				arr3.forEach(function(item, index) {
					try {
						item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
						item.balance = item.balance;
					} catch (e) {
						item.SNAME = "";
						item.balance = 0;
					}
				});
				that.$refs.printerPage.sksqBluePrinter(that.source.sale001, that.source.sale002,arr3,that.source.sale006, printerPram);
			},
			credit_sales_create() {
				console.log("[CreditSalesCreate]׼����ʼ�����������ݼ�¼...");
				this.source.sxsale001 = this.factory.get_sxsale001(this.source.sale001, {
					SX_STATUS: 1,
					DKFNAME: this.source.big_customer_info.NAME,
					DKFID: this.source.big_customer_info.DKHID,
				});
				console.log("[CreditSalesCreate]�����������ݼ�¼����...");
				console.log("[CreditSalesCreate]׼����ʼ������������֧����¼...");
				this.source.sale003.push(this.factory.get_sale003(this.source.sale001, {
					FKID: "ZG01",
					AMT: this.source.sale001.TNET
				}));
				console.log("[CreditSalesCreate]������������֧����¼����...");
				console.log("[CreditSalesCreate]��������:", this.source);
			},
			to_payment() {
				console.log("[ToPayment]׼����ʼ����֧���������ж��Ƿ�������������...", this.source.enable_credit);
				if (this.source.enable_credit) {
					this.credit_sales_create();
					this.coupon_activate();//��ʼȯ���뼤������
				} else
					this.sale.RedirectToPayment({
						sale001: this.source.sale001,
						sale002: this.source.sale002,
						paid: this.source.paid,
						action: 'Payment',
						complet: $(function(result) {
							console.log("[ToPayment]֧�����ɣ�֧������:", result);
							if (result.code) {
								let salas = result.data;
								this.source.sale001 = Object.cover(this.factory.get_sale001(), salas
								.sale1_obj);
								this.source.sale002 = salas.sale2_arr.map($(function(sale2) {
									return this.factory.get_sale002(this.source.sale001, sale2)
								}));
								this.source.sale003 = salas.sale3_arr.map($(function(sale3) {
									return this.factory.get_sale003(this.source.sale001, sale3)
								}));
								this.coupon_activate();//��ʼȯ���뼤������
							}
						})
					});
			},
			event_monitor(){
				this.event_register('close-tszk',$(function(data){
					console.log("[EventMonitor]�û�ѡ�����ۿ���Ϣ:",data);
					this.view.enable_special_discount = false;//�ر������ۿ۵���
				}));
				this.event_register("big-customer-close", $(function(data) {
					console.log("[Created]���ͻ��ص�:", data);
					if (data.exists_credit) {
						this.source.enable_credit = true; //��������
						this.source.big_customer_info = data;
						this.source.discount_infos = this.get_discount_data(data.DKHID);
						console.log("[Created]��ȡ��ǰ���ͻ��ۿ���Ϣ:", this.source.discount_infos);
					}
				}));
			},
			event_register(event_name, event_callback){
				uni.off(event_name);
				uni.$on(event_name, event_callback);
			}
		},
		created() {
			this.sale = new Sale.InitKQSale(this, uni, getApp().globalData.store, "GiftCoupon_Active");
			$ = util.callContainer(this);
			this.event_monitor();//�����¼�����
			this.get_payment_infos();//��ȡ֧����Ϣ
			//test code...
			this.KHID = "K200QTD006";
		},
		destroyed() {
			uni.off("big-customer-close");
		}
	}
</script>

<style>
	.right-correct {
		display: flex;
		flex-direction: column;
	}

	.listof-correct {
		width: auto;
		flex: 1;
		display: flex;
		align-items: center;
		padding-bottom: 60px;
		padding-top: 10px;
		box-sizing: border-box;
	}

	.prolist-correct {
		height: 100%;
	}

	.operation-correct {
		height: 100%;
	}
</style>
