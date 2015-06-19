///<reference path="../.d.ts"/>
"use strict";

export class UsbLivesyncCommand implements ICommand {
	constructor(private $usbLiveSyncService: IUsbLiveSyncService,
		private $logger: ILogger) { }

	execute(args: string[]): IFuture<void> {
		return (() => {
			this.$usbLiveSyncService.liveSync(args[0]).wait();
			this.$logger.info("Successfully executed livesync command!!!");
		}).future<void>()();
	}
	
	canExecute(args: string[]): IFuture<boolean> {
		return (() => {
			return true;
		}).future<boolean>()();
	}
	
	allowedParameters: ICommandParameter[] = [];
}
$injector.registerCommand("livesync", UsbLivesyncCommand);