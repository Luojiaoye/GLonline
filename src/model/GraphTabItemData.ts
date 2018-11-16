/**
* 流图tabItem数据模型
* @author confiner
*/
module model
{
	export class GraphTabItemData
	{
		public name:string;	// 当前文件名称
		public cache:boolean;	// 是否缓存文件 需要被保存
		
		constructor()
		{

		}
	}
}