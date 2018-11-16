/**
* 调试操作类型
* @author confiner
*/
module core{
	export enum DebugType
	{
		DebugEntry = "entry", // 进入调试
        DebugContinue = "continue",  // 跳过继续
        DebugNext = "next",      // 单步执行
        DebugExit = "exit",      // 退出调试
		DebugAdd = "add",		// 添加断点
		DebugDelete = "delete"	// 删除断点
	}
}