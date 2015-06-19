///<reference path="../.d.ts"/>
"use strict";

import androidLiveSyncServiceLib = require("../common/mobile/android/android-application-livesync-service");
import usbLivesyncServiceBaseLib = require("../common/services/usb-livesync-service-base");
import path = require("path");

export class UsbLiveSyncService extends usbLivesyncServiceBaseLib.UsbLiveSyncServiceBase implements IUsbLiveSyncService {
	private excludedProjectDirsAndFiles = [
		"app_resources"
	];
	
	constructor(private $commandsService: ICommandsService,
		$devicesServices: Mobile.IDevicesServices,
		$fs: IFileSystem,
		$mobileHelper: Mobile.IMobileHelper,
		$localToDevicePathDataFactory: Mobile.ILocalToDevicePathDataFactory,
		$options: IOptions,
		private $platformsData: IPlatformsData,
		private $projectData: IProjectData,
		$deviceAppDataFactory: Mobile.IDeviceAppDataFactory,
		$logger: ILogger,
		private $injector: IInjector) {
			super($devicesServices, $mobileHelper, $localToDevicePathDataFactory, $logger, $options, $deviceAppDataFactory, $fs); 
	}
	
	public liveSync(platform: string): IFuture<void> {
		return (() => {
			
			// TODO: Add validation
			
			// TODO: Consider to move usbLiveSyncService to platformData
			
			this.$options.justlaunch = true;
			
			let restartAppOnDeviceAction = (device: Mobile.IDevice, deviceAppData: Mobile.IDeviceAppData): IFuture<void> => {
				let platformSpecificUsbLiveSyncService: any = null;
				if(platform.toLowerCase() === "android") {
					platformSpecificUsbLiveSyncService = this.$injector.resolve(AndroidUsbLiveSyncService, {device: device});
				} else if(platform.toLowerCase() === "ios") {
					platformSpecificUsbLiveSyncService = this.$injector.resolve(IOSUsbLiveSyncService, {device: device});
				}
				
				return platformSpecificUsbLiveSyncService.restartApplication(deviceAppData);
			}
			
			this.sync(platform, this.$projectData.projectId, this.$projectData.projectDir, path.join(this.$projectData.projectDir, "app"), this.excludedProjectDirsAndFiles, restartAppOnDeviceAction).wait();
			this.$logger.info("Successfully synced");
						
		}).future<void>()();
	}
}
$injector.register("usbLiveSyncService", UsbLiveSyncService);

export class IOSUsbLiveSyncService {
	constructor(private _device: Mobile.IDevice) { }
	
	private get device(): Mobile.IIOSDevice {
		return <Mobile.IIOSDevice>this._device;
	}
	
	public restartApplication(deviceAppData: Mobile.IDeviceAppData): IFuture<void> {
		return this.device.restartApplication(deviceAppData.appIdentifier);
	} 
}

export class AndroidUsbLiveSyncService extends androidLiveSyncServiceLib.AndroidApplicationLiveSyncService {
	constructor(_device: Mobile.IDevice,
		$fs: IFileSystem) {
		super(<Mobile.IAndroidDevice>_device, $fs);
	}
	
	public restartApplication(deviceAppData: Mobile.IDeviceAppData): IFuture<void> {
		return (() => {
			let	commands = [ this.liveSyncCommands.SyncFilesCommand() ];			
			this.livesync(deviceAppData.appIdentifier, deviceAppData.deviceProjectRootPath, commands).wait();
			
			this.device.stopApplication(deviceAppData.appIdentifier).wait();			
			this.device.runApplication(deviceAppData.appIdentifier).wait();
		}).future<void>()();
	}
}
