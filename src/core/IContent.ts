/**
* 内容接口
* @author confiner
*/
module core
{
	export interface IContent extends core.IData
	{
		switcher(data:model.ContentMenuItemData):void;
		add():void;
		// getWidth():number;
		// getHeight():number;
		getContent():Laya.Sprite;
	}
}