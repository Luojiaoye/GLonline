/**
* 左边内容区域
* @author confiner
*/
module ui{
	export class LeftContentView extends Editor.LeftContentViewUI
	{
		private _content:ContentMenuView;

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this._content = new ContentMenuView();
			this._content.space = 10;
			this._content.y = 121;
			this.addChild(this._content);
			this.addNodePlatte();
			this.addVariable();
			this.addCustom();

			this.onResizeHandler();
			Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
		}

		private onResizeHandler():void{
			this.bg.height = window.innerHeight - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).y;
		}

		public destroy(destoryChild:boolean):void{
			super.destroy(destoryChild);
			Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
		}

		private addNodePlatte():void
		{
			let nodesItemData:model.ContentMenuItemData = new model.ContentMenuItemData();
			nodesItemData.add = false;
			nodesItemData.name = "Nodes";
			nodesItemData.open = false;
			nodesItemData.width = 310;
			let nodesView:NodePalette = new NodePalette();
			nodesView.visible = false;
			this._content.addContent(nodesItemData, nodesView);
		}

		private addVariable():void
		{
			let variableItemData:model.ContentMenuItemData = new model.ContentMenuItemData();
			variableItemData.add = true;
			variableItemData.name = "Variables";
			variableItemData.open = false;
			variableItemData.width = 310;
			let variableView:VariableCreateView = new VariableCreateView();
			this._content.addContent(variableItemData, variableView);
		}

		private addCustom():void
		{
			let customItemData:model.ContentMenuItemData = new model.ContentMenuItemData();
			customItemData.add = true;
			customItemData.name = "Custom";
			customItemData.open = false;
			customItemData.width = 310;
			let customView:CustomCreateView = new CustomCreateView();
			this._content.addContent(customItemData, customView);
		}
	}
}