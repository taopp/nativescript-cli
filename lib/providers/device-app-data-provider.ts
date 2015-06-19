///<reference path="../.d.ts"/>
"use strict";
import deviceAppDataBaseLib = require("../common/mobile/device-app-data/device-app-data-base");
import constantsLib = require("../common/mobile/constants");
import Future = require("fibers/future");

export class IOSAppIdentifier extends deviceAppDataBaseLib.DeviceAppDataBase implements Mobile.IDeviceAppData  {
	private static DEVICE_PROJECT_ROOT_PATH = "Library/Application Support/LiveSync";
	
	constructor(_appIdentifier: string) {
		super(_appIdentifier); 
	}
	
	public get deviceProjectRootPath(): string {
		return this.getDeviceProjectRootPath(IOSAppIdentifier.DEVICE_PROJECT_ROOT_PATH);
	}
	
	public isLiveSyncSupported(device: Mobile.IDevice): IFuture<boolean> {
		return Future.fromResult(true);
	}
}

export class AndroidAppIdentifier extends deviceAppDataBaseLib.DeviceAppDataBase implements Mobile.IDeviceAppData {
	constructor(_appIdentifier: string) {
		super(_appIdentifier); 
	}
	
	public get deviceProjectRootPath(): string {
		return this.getDeviceProjectRootPath(`/mnt/sdcard/Android/data/${this.appIdentifier}/files/12590FAA-5EDD-4B12-856D-F52A0A1599F2`);
	}
	
	public isLiveSyncSupported(device: Mobile.IDevice): IFuture<boolean> {
		return (() => {
			let broadcastResult = (<Mobile.IAndroidDevice>device).sendBroadcastToDevice(constantsLib.CHECK_LIVESYNC_INTENT_NAME, {"app-id": this.appIdentifier}).wait();
			return broadcastResult !== 0;
		}).future<boolean>()();
	}
}

export class DeviceAppDataProvider implements Mobile.IDeviceAppDataProvider {
	public createFactoryRules(): IDictionary<Mobile.IDeviceAppDataFactoryRule> {
		return {
			iOS: {
				vanilla: IOSAppIdentifier
			},
			Android: {
				vanilla: AndroidAppIdentifier
			}
		}
	}
}
$injector.register("deviceAppDataProvider", DeviceAppDataProvider);