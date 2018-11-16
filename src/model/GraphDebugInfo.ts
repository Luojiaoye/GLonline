/**
* 流图调试信息
* @author confiner
*/
module model
{
	export class GraphDebugInfo implements core.ISerializeable
	{
		private _name:string;	// 流图名称
		private _curNodeId:string;	// 当前节点Id
		private _nodes:Map<string, NodeDebugInfo>;	// 节点信息列表[节点id对应节点调试信息]
		private _variables:Map<string, any>;	// 变量列表[变量名称对应变量值]

		constructor()
		{
			this._nodes = new Map<string, NodeDebugInfo>();
			this._variables = new Map<string, any>();
		}

		public getLog():string
		{
			let log:string = "";
			for(let node of this._nodes.values())
			{
				if(node.getLog() == "")
					continue;

				log += "[" + this._name + ":" + node.getNodeName() + "(" + node.getNodeId() + ")]->\n"
				log += node.getLog() + "\n\n";
				//log += this.addLineString() + "\n";
			}

			return log;
		}

		private addLineString():string
		{
			let str:string = "";
			for(let i:number = 0; i < 100; ++i)
			{
				str += "-";
			}

			return str;
		}

		public getName():string
		{
			return this._name;
		}

		// 获取当前断点击中的节点id
		public getHitNodeId():string
		{
			return this._curNodeId;
		}

		// 获取插槽数据
		public getDatum(nodeId:string, slotName:string):Datum
		{
			if(this._nodes.has(nodeId))
			{
				let nodeInfo:NodeDebugInfo = this._nodes.get(nodeId);
				if(nodeInfo)
				{
					let value:any = nodeInfo.getData(slotName);
					if(value)
					{
						let graph:Graph = managers.GraphManager.getInstance().getCurrent();
						if(graph)
						{
							let node:Node = graph.getNodeById(nodeId);
							if(node)
							{
								let slot:Slot = node.getSlotByName(slotName);
								if(slot)
								{
									let data:Datum = slot.getData();
									let datum:Datum = data.clone();
									datum.setValue(value);
									return datum;
								}
							}
						}
					}
				}
			}
			return null;
		}

		public deserialize(obj:Object):void
		{
			let propValue:Object = null;
			for(let propName in obj)
			{
				propValue = obj[propName];
				if(propName == "Graph")
				{
					this._name = String(propValue);
				}
				else if(propName == "currNode")
				{
					this._curNodeId = String(propValue);
				}
				else if(propName == "vars" && propValue.hasOwnProperty("length"))
				{
					this._variables.set(propName.toString(), propValue);
				}
				else if(propName == "nodes")
				{
					let info:Object = null;
					for(let nodeId in propValue)
					{
						info = propValue[nodeId];
						let nodeDebugInfo:NodeDebugInfo = new NodeDebugInfo();
						nodeDebugInfo.setNodeId(nodeId);
						nodeDebugInfo.deserialize(info);
						this._nodes.set(nodeId.toString(), nodeDebugInfo);
					}
				}
			}
		}

		public serialize():Object
		{
			return null;
		}
	}
}