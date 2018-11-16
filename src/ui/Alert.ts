/**
* 弹窗
* @author confiner
*/
module ui
{
	import Sprite = Laya.Sprite;
	//import AlertType = core.AlertType;
	//import EventManager = managers.EventManager;
	//import EventType = core.EventType;

	export class Alert
	{
		private static modeBg:Sprite;
		private static view:Sprite;

		public static alert(type:core.AlertType, data?:any):void
		{
			if(!managers.EventManager.getInstance().hasListener(core.EventType.CLOSE_ALERT))
				managers.EventManager.getInstance().on(core.EventType.CLOSE_ALERT, Alert, Alert.onCloseHandler)
			
			switch(type)
			{
				case core.AlertType.CLOSE_GRAPH_TAB_ITEM:
					Alert.view = new GraphTabItemCloseView();
					(Alert.view as GraphTabItemCloseView).setData(data);
				break;
			}

			Alert.show();
		}

		private static onCloseHandler():void
		{
			if(Alert.modeBg)
			{
				Laya.stage.removeChild(Alert.modeBg);
				Alert.modeBg = null;
			}

			if(Alert.view)
			{
				Laya.stage.removeChild(Alert.view);
				Alert.view = null;
			}
		}

		private static show():void
		{
			if(!Alert.modeBg)
			{
				Alert.modeBg = new Sprite();
				Alert.modeBg.mouseEnabled = true;
				Alert.modeBg.size(Laya.stage.width, Laya.stage.height);
				Laya.stage.addChild(Alert.modeBg);
			}
				
			if(Alert.view)
			{
				Alert.modeBg.addChild(Alert.view);
				Alert.view.pos((Alert.modeBg.width - Alert.view.width) >> 1, (Alert.modeBg.height - Alert.view.height) >> 1);
			}
		}

		private constructor()
		{

		}
	}
}