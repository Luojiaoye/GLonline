/**
* 节点调试信息
* @author confiner
*/
module model
{
	export class NodeDebugInfo implements core.ISerializeable
	{
		private _nodeId:string;	// 节点id
		private _slots:Map<string, any>;	// 插槽名称对应插槽数据
		private _logs:Array<string>;	// 日志信息
		constructor()
		{
			this._slots = new Map<string, any>();
		}

		public getLog():string
		{
			if(!this._logs)
				return "";

			let str:string = "";
			for(let i:number = 0; i < this._logs.length; ++i)
			{
				str += this._logs[i].toString() + "\n";
			}

			return str;
		}

		// 设置节点id
		public setNodeId(nodeId:string):void
		{	
			this._nodeId = nodeId;
		}

		// 获取节点id
		public getNodeId():string
		{
			return this._nodeId;
		}

		// 获取插槽调试数据
		public getData(slotName:string):any
		{
			return this._slots.get(slotName);
		}

		// 获取节点名称
		public getNodeName():string
		{
			let graph:Graph = managers.GraphManager.getInstance().getCurrent();
			if(graph)
			{
				let node:Node = graph.getNodeById(this._nodeId);
				return node.getName();
			}

			return "unknow";
		}


		public serialize():Object
		{
			return null;
		}

		public deserialize(obj:Object):void
		{
			let propValue:Object = null;
			for(let propName in obj)
			{
				propValue = obj[propName];
				if(propName == "logs" && propValue.hasOwnProperty("length") && propValue["length"] > 0)
				{
					this._logs = obj[propName];
				}
				else
				{
					this._slots.set(propName.toString(), propValue);
				}
			}
		}
	}
}