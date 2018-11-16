/**
* @desc IItem接口數據
* @author confiner 
*/
module core{
	import Sprite = Laya.Sprite;
	import Point = Laya.Point;

	export interface IItem{
		anchor:Sprite;
		
		// 設置transform
		setAnchor(anchor:Sprite):void;

		// 獲取偏移點
		getOffset():Point;
	}
}