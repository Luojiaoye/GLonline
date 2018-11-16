/**
* 调试管理器
* @author confiner
*/
module managers
{
	export class DebugManager
	{
		private _isDebug:boolean;	// 是否调试中
		private _graphs:Array<model.GraphDebugInfo>;	// 运行时流图调试栈
		//private _currentGraph:model.GraphDebugInfo;	// 当前运行时流图调试信息
		private _index:number = -1; //当前运行时流图调试信息索引

		private static _inst:DebugManager; //单例对象
		private constructor()
		{
			this.init();
		}

		private init():void
		{
			
		}

		public getStackHead():model.GraphDebugInfo
		{
			if(this._graphs && this._graphs.length > 0)
				return this.getGraphDebugInfoList()[0];

			return null;
		}

		public getGraphDebugInfoList():Array<model.GraphDebugInfo>
		{
			return this._graphs;
		}

		public parseGraphStackInfo(jsonStr:string):void
		{
			let obj:Object = JSON.parse(jsonStr);
			let graphObjs:Array<Object> = obj["stacks"];
			this._graphs = new Array<model.GraphDebugInfo>();
			graphObjs = graphObjs.reverse();
			let graph:model.GraphDebugInfo = null;
			for(let i:number = 0, len:number = graphObjs.length; i < len; ++i)
			{
				graph = new model.GraphDebugInfo();
				graph.deserialize(graphObjs[i]);
				this._graphs.push(graph);
			}

			this.setCurrent(0);
		}

		// 获取当前运行时流图调试信息
		public getCurrent():model.GraphDebugInfo
		{
			if(!this._graphs || this._index >= this._graphs.length)
				return null;

			return this._graphs[this._index];
		}

		// 是否在调试栈中
		public isInDebugStack(nodeId:string):boolean
		{
			if(!this._graphs || this._graphs.length <= this._index)
				return false;

			for(let i:number = this._index, len:number = this._graphs.length; i < len; ++i)
			{
				if(this._graphs[i].getHitNodeId() == nodeId)
					return true;
			}

			return false;
		}


		// 设置当前运行时流图调试信息
		public setCurrent(index:number):void
		{
			if(!this._graphs || this._graphs.length <= index)
				return;

			this._index = index;
			EventManager.getInstance().event(core.EventType.DEBUG_RESULT);
		}

		public getDebug():boolean
		{
			return this._isDebug;
		}

		// 开始调试
		public debugEntry():void
		{
			if(!this._isDebug)
			{
				let breakpoints:Map<string, Array<string>> = GraphManager.getInstance().getBreakPoints();
				if(breakpoints && breakpoints.size > 0)
				{
					let msg:Object = {};
					msg["debug_type"] = core.DebugType.DebugEntry.toString();
					let graphs:Array<Object> = new Array<Object>();
					let nodeIds:Object = null;
					for(let graphName of breakpoints.keys())
					{
						nodeIds = {};
						nodeIds[graphName] = breakpoints.get(graphName);
						graphs.push(nodeIds);
					}

					msg["breakpoints"] = graphs;
					ServerManager.getInstance().sendDebugInfo(msg);
					this._isDebug = true;
				}
			}
			else
			{
				this.debugContinue();
			}
		}

		// 跳出继续
		public debugContinue():void
		{
			if(!this._isDebug)
				return;

			let data:Object = {"debug_type": core.DebugType.DebugContinue.toString()};
			ServerManager.getInstance().sendDebugInfo(data);
		}

		// 执行下一步
		public debugNext():void
		{
			if(!this._isDebug)
				return;

			let data:Object = {"debug_type": core.DebugType.DebugNext.toString()};
			ServerManager.getInstance().sendDebugInfo(data);
		}

		// 添加断点
		public debugAdd(nodeId:string):void
		{
			if(!this._isDebug)
				return;

			let breakpoints:Object = {};
			let graph:model.Graph = GraphManager.getInstance().getCurrent();
			if(graph)
			{
				breakpoints[graph.name] = [nodeId];
			}
			
			let data:Object = {
					"debug_type": core.DebugType.DebugAdd.toString(),
					"breakpoints":[breakpoints]
					};
			ServerManager.getInstance().sendDebugInfo(data);
		}

		public deleteGraphBreapoints(graphName:string):void
		{
			let graph:model.Graph = managers.GraphManager.getInstance().getGraph(graphName);
			if(graph)
			{
				let breakpoints:Object = {};
				breakpoints[graphName] = graph.getDebugNodeIds();
				let data:Object = {
					"debug_type": core.DebugType.DebugDelete.toString(),
					"breakpoints":[breakpoints]
					};
				ServerManager.getInstance().sendDebugInfo(data);
				graph.deleteDebugNodeIds();
			}	
		}

		// 删除断点
		public debugDelete(nodeId:string):void
		{
			if(!this._isDebug)
				return;

			let breakpoints:Object = {};
			let graph:model.Graph = GraphManager.getInstance().getCurrent();
			if(graph)
			{
				breakpoints[graph.name] = [nodeId];
			}
			let data:Object = {
					"debug_type": core.DebugType.DebugDelete.toString(),
					"breakpoints":[breakpoints]
					};
			ServerManager.getInstance().sendDebugInfo(data);
		}

		// 调试结束
		public debugExit():void
		{
			if(this._isDebug)
			{
				let data:Object = {"debug_type": core.DebugType.DebugExit.toString()};
				ServerManager.getInstance().sendDebugInfo(data);
				EventManager.getInstance().event(core.EventType.DEBUG_OPERATION, [core.DebugType.DebugExit.toString()]);
				this._isDebug = false;
				this._graphs = null;
			}
		}

		// 获取单例接口
		public static getInstance():DebugManager
		{
			if(!DebugManager._inst)
			{
				DebugManager._inst = new DebugManager();
			}

			return DebugManager._inst;
		}
	}
}