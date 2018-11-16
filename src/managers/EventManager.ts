/**
* 事件管理器
*/
module managers
{
	export class EventManager extends Laya.EventDispatcher
	{
		private static _inst:EventManager; //单例对象
		private constructor()
		{
			super();
		}

		// 获取单例接口
		public static getInstance():EventManager
		{
			if(!EventManager._inst)
			{
				EventManager._inst = new EventManager();
			}

			return EventManager._inst;
		}
	}
}