<template>
	<view>
		<button type="default" @click="nativetest()">打开或关闭蓝牙</button>
		<button type="default" @click="nativetest2()">监听蓝牙状态</button>
		<button type="default" @click="nativetest3()">已配对蓝牙列表</button>
		<button type="default" @click="searchDevices('')">搜索蓝牙列表</button>
		<view>
			未配对蓝牙设备
			<ul id="li2">
				<li v-for="(item, index) in vlist2" :key="index">
					<text v-if="item.flag=='searchDevices'"
						@click="searchDevices(item.id)">id:{{item.id}},name:{{item.name}}</text>
					<text v-else="item.flag=='print'" @click="print(item.id)">id:{{item.id}},name:{{item.name}}</text>
				</li>
			</ul>
		</view>
		<view>
			已配对蓝牙设备

			<ul id="li1">
				<li v-for="(item, index) in vlist1" :key="index">
					<text v-if="item.flag=='searchDevices'"
						@click="searchDevices(item.id)">id:{{item.id}},name:{{item.name}}</text>
					<text v-else="item.flag=='print'" @click="print(item.id)">id:{{item.id}},name:{{item.name}}</text>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				device: null,
				BAdapter: null,
				BluetoothAdapter: null,
				uuid: null,
				main: null,
				bluetoothSocket: null,
				vlist1: [],
				vlist2: []
			}
		},
		methods: {
			//打开
			nativetest: function() {
				console.info("打开或关闭蓝牙开始")
				let main = plus.android.runtimeMainActivity();
				console.info("第一步，main：", JSON.stringify(main))
				let Context = plus.android.importClass("android.content.Context");
				console.info("第二步，Context：", Context);
				console.info("第二步，Context：", Context.BLUETOOTH_SERVICE);
				let BManager = main.getSystemService(Context.BLUETOOTH_SERVICE);
				console.info("第三步，BManager：", JSON.stringify(BManager));
				plus.android.importClass(BManager); //引入相关的method函数
				let BAdapter = BManager.getAdapter();
				console.info("第四步，BManager：", JSON.stringify(BAdapter))
				plus.android.importClass(BAdapter); //引入相关的method函数，这样之后才会有isEnabled函数支持
				console.info("第五步，isEnabled：", JSON.stringify(BAdapter.isEnabled()))
				if (!BAdapter.isEnabled()) {
					BAdapter.enable(); //提示打开或者关闭蓝牙
				}
			},
			//监听蓝牙状态
			nativetest2: function() {
				var main = plus.android.runtimeMainActivity();
				var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
				console.info("监听蓝牙状态，第一步：BluetoothAdapter", JSON.stringify(BluetoothAdapter));
				var BAdapter = new BluetoothAdapter.getDefaultAdapter();
				console.info("监听蓝牙状态，第二步：BAdapter", JSON.stringify(BAdapter));
				var receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
					onReceive: function(context, intent) { //实现onReceiver回调函数  
						plus.android.importClass(intent);
						console.info("监听蓝牙状态，第四步：nAction", intent.getAction());
						main.unregisterReceiver(receiver);
					}
				});
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				console.info("监听蓝牙状态，第五步：IntentFilter", IntentFilter);
				var filter = new IntentFilter();
				console.info("监听蓝牙状态，第六步：IntentFilter", filter);
				filter.addAction(BAdapter.ACTION_STATE_CHANGED); //监听蓝牙开关  
				main.registerReceiver(receiver, filter); //注册监听  
				console.info("监听蓝牙状态，第七步：isEnabled", BAdapter.isEnabled());
				if (!BAdapter.isEnabled()) {
					BAdapter.enable(); //启动蓝牙  
				} else {
					BAdapter.disable();
				}
			},
			//已配对的蓝牙列表
			nativetest3: function() {
				var main = plus.android.runtimeMainActivity();
				var Context = plus.android.importClass("android.content.Context");
				var BManager = main.getSystemService(Context.BLUETOOTH_SERVICE);
				plus.android.importClass(BManager); //引入相关的method函数
				var BAdapter = BManager.getAdapter();
				plus.android.importClass(BAdapter); //引入相关的method函数，这样之后才会有isEna
				var lists = BAdapter.getBondedDevices();
				console.info("搜索蓝牙列表，第一步：蓝牙列表", JSON.stringify(lists));
				plus.android.importClass(lists);

				var iterator = lists.iterator();
				console.info("iterator", JSON.stringify(iterator));
				plus.android.importClass(iterator);
				while (iterator.hasNext()) {
					var d = iterator.next();
					console.info("搜索蓝牙列表，while:", JSON.stringify(d));
					plus.android.importClass(d);
					console.info("设备信息：", JSON.stringify(d));
					if (d.getAddress() == 'DC:E9:94:29:15:0E') {
						let device = BAdapter.getRemoteDevice('DC:E9:94:29:15:0E');
						console.info("找到了指定的设备", JSON.stringify(device));
						plus.bluetooth.getBLEDeviceServices({
							deviceId: d.getAddress(),
							success: function(e) {
								var services = e.services;
								console.log('get services success: ' + services.length);
								for (var i in services) {
									console.log(i + ': ' + JSON.stringify(services[i]));
								}
							},
							fail: function(e) {
								console.log('get services failed: ', JSON.stringify(e));
							}
						});
						// let device = BAdapter.getRemoteDevice('DC:E9:94:29:15:0E');
						// let UUID = plus.android.importClass("java.util.UUID"); 
						// let uuid = UUID.fromString("00001103-0000-1000-8000-00805F9B34FB");
						// plus.android.importClass(device);
						// let bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
						// console.info("bluetoothSocket", JSON.stringify(bluetoothSocket));
						// plus.android.importClass(bluetoothSocket);
						// if (!bluetoothSocket.isConnected()) {
						//  	console.info('检测到设备未连接，尝试连接....');
						// 	bluetoothSocket.connect();
						// 	console.info('设备连接状态：',bluetoothSocket.isConnected());
						// }



					}
				}
			},
			//address=""搜索蓝牙//address=设备mac地址，自动配对给出mac地址的设备  
			searchDevices: function(address) {
				//注册类  
				console.info("搜索蓝牙//address=设备mac地址，自动配对给出mac地址的设备，开始");
				var main = plus.android.runtimeMainActivity();
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
				var BluetoothDevice = plus.android.importClass("android.bluetooth.BluetoothDevice");
				var BAdapter = BluetoothAdapter.getDefaultAdapter();
				console.log("开始搜索设备");
				var filter = new IntentFilter();
				var bdevice = new BluetoothDevice();
				console.info(bdevice.BOND_NONE);
				this.vlist1 = []; //注册容器用来显示未配对设备   
				this.vlist2 = []; //注册容器用来显示未配对设备   
				var on = null;
				var un = null;
				BAdapter.startDiscovery(); //开启搜索  
				var receiver;
				receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
					onReceive: function(context, intent) { //实现onReceiver回调函数  
						plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作  
						console.info("第二步，获取action", intent.getAction()); //获取action  
						if (intent.getAction() == "android.bluetooth.adapter.action.DISCOVERY_FINISHED") {
							main.unregisterReceiver(receiver); //取消监听  
							console.info("搜索结束");
						} else {
							let BleDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
							console.info("第二步，BleDevice", BleDevice);
							console.info("第二步，getBondState", BleDevice.getBondState());
							//判断是否配对  
							if (BleDevice.getBondState() == bdevice.BOND_NONE) {
								console.info("未配对蓝牙设备：" + BleDevice.getName() + '    ' + BleDevice
									.getAddress());
								console.info("address：", address, '   ' + BleDevice.getAddress());
								//参数如果跟取得的mac地址一样就配对  
								if (address == BleDevice.getAddress()) {
									if (BleDevice.createBond()) { //配对命令.createBond()  
										console.info("配对成功");
										let temp = {
											id: BleDevice.getAddress(),
											flag: 'print',
											name: BleDevice.getName()
										};
										this.vlist2.push(temp);
									}

								} else {

									if (BleDevice.getName() != on) { //判断防止重复添加   
										on = BleDevice.getName();
										console.info("aaaa：", on);
										let temp = {
											id: BleDevice.getAddress(),
											flag: 'searchDevices',
											name: on
										};
										console.info("配对失败：", JSON.stringify(temp));
										this.vlist1.push(temp);
									} else {
										console.info("bbbb：");
									}

								}
							} else {
								if (BleDevice.getName() != un) { //判断防止重复添加  
									console.log("已配对蓝牙设备：" + BleDevice.getName() + '    ' + BleDevice
										.getAddress());
									un = BleDevice.getName();
									this.vlist2.push(new {
										id: BleDevice.getAddress(),
										flag: 'searchDevices',
										name: un
									});
								}
							}
						}
					}
				});

				filter.addAction(bdevice.ACTION_FOUND);
				filter.addAction(BAdapter
					.ACTION_DISCOVERY_STARTED);
				filter.addAction(BAdapter.ACTION_DISCOVERY_FINISHED);
				filter
					.addAction(BAdapter.ACTION_STATE_CHANGED);
				main.registerReceiver(receiver, filter); //注册监听  
			},


			print: function(mac_address) {
				if (!mac_address) {
					mui.toast('请选择蓝牙打印机');
					return;
				}
				main = plus.android.runtimeMainActivity();
				BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
				UUID = plus.android.importClass("java.util.UUID");
				uuid = UUID.fromString("00001103-0000-1000-8000-00805F9B34FB");
				BAdapter = BluetoothAdapter.getDefaultAdapter();
				let device = BAdapter.getRemoteDevice(mac_address);
				plus.android.importClass(device);
				let bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
				plus.android.importClass(bluetoothSocket);
				if (!bluetoothSocket.isConnected()) {
					console.info('检测到设备未连接，尝试连接....');
					bluetoothSocket.connect();
				}
				console.info('设备已连接');

				if (bluetoothSocket.isConnected()) {
					var outputStream = bluetoothSocket.getOutputStream();
					plus.android.importClass(outputStream);
					var string = "打印测试\r\n";
					var bytes = plus.android.invoke(string, 'getBytes', 'gbk');
					outputStream.write(bytes);
					outputStream.flush();
					device = null //这里关键  
					bluetoothSocket.close(); //必须关闭蓝牙连接否则意外断开的话打印错误  

				}

			}
		}
	}
</script>

<style>

</style>
