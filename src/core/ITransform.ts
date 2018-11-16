/**
* transform组件接口
* @author confiner
*/
module core
{
	import Point = Laya.Point;
	import Sprite = Laya.Sprite;

	export interface ITransform
	{
		anchor:Sprite;	// 锚点

		// 获取描点位置
		getAnchorPosition():Point;

		// 设置锚点
		setAnchor(anchor:Sprite):void;

		// 获取舞台位置
		getStagePosition():Point;
	}
}