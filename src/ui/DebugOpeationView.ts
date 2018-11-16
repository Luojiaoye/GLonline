/**
* 调试操作界面
* @author confiner
*/
module ui
{
	export class DebugOpeationView extends Editor.DebugOperationUI
	{
		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this.btn_break.on(Laya.Event.CLICK, this, this.onClickHandler);	
			this.btn_stop.on(Laya.Event.CLICK, this, this.onClickHandler);	
			this.btn_next.on(Laya.Event.CLICK, this, this.onClickHandler);	
		}

		private onClickHandler(evt:Laya.Event):void
		{
			switch(evt.currentTarget)
			{
				case this.btn_break:
					managers.DebugManager.getInstance().debugContinue();
					break;
				case this.btn_next:
					managers.DebugManager.getInstance().debugNext();
					break;
				case this.btn_stop:
					managers.DebugManager.getInstance().debugExit();
					break;
			}
		}
	}
}