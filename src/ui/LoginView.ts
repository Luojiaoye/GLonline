/**
* @desc 登陸界面
* @author confiner
*/
module ui{
	import ServerManager = managers.ServerManager;
	import Event = Laya.Event;
	import EventManager = managers.EventManager;

	export class LoginView extends Editor.LoginViewUI
	{
		constructor()
		{
			super();
			this.init();
		}

		private init(): void
		{
			this.x = (Laya.stage.width - this.width) >> 1;
			this.y = (Laya.stage.height - this.height) >> 1;
			this.btn_login.on(Event.CLICK, this, this.onLoginHandler);
			EventManager.getInstance().on(ServerManager.CONNECT_SUCCESS, this, this.onConnectSuccess);
		}
		
		private onConnectSuccess():void
		{
			let mainWindow:MainWindow = new MainWindow();
			Laya.stage.addChild(mainWindow);
			this.destroy();
		}

		private onLoginHandler():void
		{
			let url:string = this.inputIP.text.trim();
			//url = "172.16.1.100";
			ServerManager.getInstance().connect("ws://" + url + ":1788/Nodes");
		}

		public destroy():void
		{
			this.btn_login.off(Event.CLICK, this, this.onLoginHandler);
			super.destroy();
		}
	}
}