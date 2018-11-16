/**
* 文件导航数据
* @author confiner
*/
module model
{
	import MenuType = core.MenuType;

	export class NavigatorData
	{
		public type:MenuType;	// 操作类型
		public directory:FileInfo;
		
		constructor()
		{

		}
	}
}