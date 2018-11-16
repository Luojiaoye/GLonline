/**
* 描述接口
*/
module core
{
	export interface ITemplate
	{
		config:Object; // 配置

		// 解析配置
		parse():void;
	}
}