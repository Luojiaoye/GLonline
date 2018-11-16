/**
* @author confiner
* @desc 节点类型
*/
module core{
	export enum NodeType
	{
		Data = "data",	// 数据类型没有In插槽Out插槽
		Ctrl = "ctrl",	// 功能类型具有In和Out插槽
		Event = "event",	// 事件类型无In插槽
		Variable = "variable",	// 变量类型
		Graph = "graph",	// 流图类型节点
		Custom = "custom",	// 自定义节点类型
		Logic = "logic",		// 逻辑节点
		Start = "start",		// 流图开始节点
		End = "end",			// 流图结束节点
	}
}