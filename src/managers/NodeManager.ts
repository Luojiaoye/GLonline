/**
* 节点管理器
*  @author confiner
*/
module managers
{
	import Node = model.Node;
	import Utils = Laya.Utils;
	import GUID = utils.GUID;
	//import NodeTemplate = template.NodeTemplate;
	//import NodeType = core.NodeType;

	export class NodeManager
	{
		private static _inst:NodeManager; //单例对象

		private _nodeTemplates:Map<string, NodeTemplate>;	// 节点模板列表

		private _nodeColors:Array<string>;	// 颜色列表

		private constructor()
		{
			this._nodeTemplates = new Map<string, NodeTemplate>();
			this._nodeColors = new Array<string>();
		}

		// 创建指定名称的node
		public createNode(nodeTemplateName:string, id?:string):Node
		{
			let nodeTemplate:NodeTemplate = this._nodeTemplates.get(nodeTemplateName);
			if(!nodeTemplate)
			{
				console.log("log: Not exist the node tempalte: " + nodeTemplateName);
			}
			else
			{
				let node:Node = nodeTemplate.createNode(id);
				return node;
			}

			return null;
		}

		// 解析节点模板数据
		public parseNodesTemplate(nodeTemplates:Array<Object>):void
		{
			for(let i:number = 0; i < nodeTemplates.length; ++i)
			{
				this.createNodeTemplate(nodeTemplates[i]);
			}
			EventManager.getInstance().event(core.EventType.NODES_READY);
		}

		// 创建节点模板
		public createNodeTemplate(config:Object):NodeTemplate
		{
			let nodeTemplate:NodeTemplate = new NodeTemplate(config);
			this._nodeTemplates.set(nodeTemplate.name, nodeTemplate);
			return nodeTemplate;
		}

		// 获取节点模板对象
		public getNodeTemplate(templateName:string):NodeTemplate
		{
			if(this._nodeTemplates.has(templateName))
			{
				return this._nodeTemplates.get(templateName);
			}

			return null;
		}

		// 获取模式匹配的节点模板
		public getMatchNodeTemplates(partten):Map<string, NodeTemplate>
		{
			let matchs:Map<string, NodeTemplate> = null;
			let upperKey:string = null;
			for(let key of this.getAllNodeTemplates().keys())
			{
				upperKey = key.toUpperCase();
				if(upperKey.indexOf(partten.toUpperCase()) >= 0)
				{
					if(!matchs)
					{
						matchs = new Map<string, NodeTemplate>();
					}

					matchs.set(key, this.getAllNodeTemplates().get(key));
				}
			}

			return matchs;
		}

		public GetColorId(category:string):number
		{
			let colorId:number = this._nodeColors.indexOf(category);
			if(colorId < 0)
			{
				colorId = this._nodeColors.length;
				this._nodeColors.push(category);
			}
			
			return colorId;
		}

		// 获取所有模板
		public getAllNodeTemplates():Map<string, NodeTemplate>
		{
			let templates:Map<string, NodeTemplate> = new Map<string, NodeTemplate>();
			let tmp:NodeTemplate = null;
			for(let tmpName of this._nodeTemplates.keys())
			{
				tmp = this._nodeTemplates.get(tmpName);
				if(tmp && tmp.type == core.NodeType.Variable.toString())
					continue;

				templates.set(tmpName, tmp);
			}

			return templates;
		}
		



		// 获取单例接口
		public static getInstance():NodeManager
		{
			if(!NodeManager._inst)
			{
				NodeManager._inst = new NodeManager();
			}

			return NodeManager._inst;
		}
	}
}