/**
* 流图模板类
* @author confiner
*/
module template
{
	import Graph = model.Graph;
	import Node = model.Node;
	import Association = model.Association;
	import NodeManager = managers.NodeManager;
	import NodeType = core.NodeType;
	import Relation = model.Relation;
	import Variable = model.Variable;
	import Custom = model.Custom;

	export class GraphTemplate implements core.ITemplate
	{
		config:Object;

		public name:string; // 流图名字
		public _event:Map<string, string>; // 事件类型节点列表
		public nodes:Map<string, Object>; // 节点数据对象
		public childStartNodeId:string;		// 启动节点id(如果是子流图)
		public childEndNodeId:string;	// 退出节点id(如果是子流图)
		public variables:Map<string, Object>;	// 变量列表
		public customs:Array<Object>;	// 自定义节点列表
		public subGraphTemplateBaks:Array<Object>;	// 子流图模板备份列表

		constructor(config:Object)
		{
			this.config = config;
			this.nodes = new Map<string, Object>();
			this._event = new Map<string, string>();
			this.parse();
		}

		parse():void
		{
			this.name = this.config["name"];
			let variablesObj:Object = this.config["variables"];
			if(variablesObj)
			{
				for(let varName in variablesObj)
				{
					if(!this.variables)
						this.variables = new Map<string, Object>();
					
					this.variables.set(varName, variablesObj[varName]);
				}
			}

			let customsObj:Array<Object> = this.config["custom_nodes"];
			if(customsObj)
			{
				for(let custom of customsObj)
				{
					if(!this.customs)
						this.customs = new Array<Object>();
					
					this.customs.push(custom);
				}
			}

			let subGraphTemplateBaksObj:Array<Object> = this.config["sub_graphs"];
			if(subGraphTemplateBaksObj){
				for(let subGraphTemplateBak of subGraphTemplateBaksObj){
					if(!this.subGraphTemplateBaks)
						this.subGraphTemplateBaks = new Array<Object>();

					this.subGraphTemplateBaks.push(subGraphTemplateBak);
				}
			}

			if(this.config["children_flow_graph_call"])
				this.childStartNodeId = String(this.config["children_flow_graph_call"]);
			
			if(this.config["children_flow_graph_return"])
				this.childEndNodeId = String(this.config["children_flow_graph_return"]);

			let nodeObj:Object = null;
			let nodeName:string = null;
			for(let nodeId in this.config)
			{
				nodeObj = this.config[nodeId];
				nodeName = nodeObj["name"];
				if(nodeName && nodeName != "")
				{
					this.nodes.set(nodeId, nodeObj);
				}
			}

			let event:Object = this.config["event"];
			if(event)
			{
				let nodeId:string = null;
				for(let nName in event)
				{
					nodeId = event[nName];
					this._event.set(nodeId, nName);
				}
			}
		}

		public createGraph():Graph
		{
			let graph:Graph = managers.GraphManager.getInstance().createGraph(this.name);

			if(this.subGraphTemplateBaks){
				graph.subGraphTemplateBaks = new Map<string, model.Node>();
				let subGraphTemplateBak:model.Node = null;
				for(let subGraphTemplateBakObj of this.subGraphTemplateBaks)
				{
					subGraphTemplateBak = new Node();
					subGraphTemplateBak.readFrom(subGraphTemplateBakObj);
					graph.subGraphTemplateBaks.set(subGraphTemplateBak.getName(), subGraphTemplateBak);
				}
			}

			if(this.variables)
			{
				let datumTemplate:DatumTemplate = null;
				let variable:Variable = null;
				let data:model.Datum = null;
				for(let varName of this.variables.keys())
				{
					variable = graph.createVariable();
					variable.setName(varName);
					datumTemplate = new DatumTemplate(this.variables.get(varName));
					data = datumTemplate.createDatum();
					variable.setType(data.getType());
					variable.setValue(data.getValue());
				}
			}

			if(this.customs)
			{
				graph.customs = new Array<Custom>();
				let custom:Custom = null;
				for(let customObj of this.customs)
				{
					custom = new Custom();
					custom.readFrom(customObj);
					graph.customs.push(custom);
				}
			}

			graph.childNodeCall = this.childStartNodeId;
			graph.childNodeReturn = this.childEndNodeId;
			let nodeObj:Object = null;
			let graphRelationTemplate:GraphRelationTemplate = null;
			let node:Node = null;
			let relation:Relation = null;
			let associations:Array<Association> = null;
			if(this.childEndNodeId && this.childStartNodeId)
			{
				graph.isChildGraph = true;
			}

			for(let nodeId of this.nodes.keys())
			{
				nodeObj = this.nodes.get(nodeId);
				if(nodeObj)
				{
					graphRelationTemplate = new GraphRelationTemplate(nodeObj);
					graphRelationTemplate.subGraphTemplateBaks = graph.subGraphTemplateBaks;
					graphRelationTemplate.nodeId = nodeId;
					graphRelationTemplate.variables = graph.variables;
					graphRelationTemplate.customs = graph.customs;
					relation = graphRelationTemplate.createRelation();
					node = relation.node;
					if(this._event && this._event.has(node.id))
					{
						node.type = core.NodeType.Event;
					}

					node.setType(nodeObj["type"]);
					graph.addNode(node);

					associations = relation.associations;
					graph.associations = graph.associations.concat(associations);
				}
			}

			// 子流图逻辑
			if(graph.isChildGraph)
			{
				graph.isChildGraph = true;
				let childGraphNodeConfig:Object = {};
				childGraphNodeConfig["name"] = this.name;
				childGraphNodeConfig["type"] = NodeType.Graph.toString();
				let nodeTemplate:NodeTemplate = null;
				if(!graph.nodes.has(this.childStartNodeId))
				{
					console.error("error: children_flow_graph_call id :" + this.childStartNodeId + " not exist in the graph:" + this.name);
				}
				else
				{
					let startNode:Node = graph.nodes.get(this.childStartNodeId);
					if(startNode.type == core.NodeType.Variable || startNode.type == core.NodeType.Custom)
					{
						 startNode.writeBefore(childGraphNodeConfig);
						 startNode.writeInputs(childGraphNodeConfig);
					}
					else
					{
						nodeTemplate = NodeManager.getInstance().getNodeTemplate(startNode.getName());
						if(!nodeTemplate)
						{
							console.error("error: the node template:" + startNode.getName() + " is not exist!");
						}
						else
						{
							childGraphNodeConfig["input"] = nodeTemplate.input;
							if(nodeTemplate.before)
								childGraphNodeConfig["before"] = nodeTemplate.before;
						}
					}
					

					if(!graph.nodes.has(this.childEndNodeId))
					{
						console.error("error: children_flow_graph_return id :" + this.childEndNodeId + " not exist in the graph:" + this.name);
					}
					let endNode:Node = graph.nodes.get(this.childEndNodeId);
					if(endNode.type == core.NodeType.Variable || endNode.type == core.NodeType.Custom)
					{
						endNode.writeNexts(childGraphNodeConfig);
						endNode.writeOutputs(childGraphNodeConfig);
					}
					else
					{
						nodeTemplate = NodeManager.getInstance().getNodeTemplate(endNode.getName());
						if(!nodeTemplate)
						{
							console.error("error: the node template:" + endNode.getName() + " is not exist!");
						}
						else
						{
							childGraphNodeConfig["output"] = nodeTemplate.output;
							childGraphNodeConfig["next"] = nodeTemplate.next;
						}
					}

					childGraphNodeConfig["category"] = Node.GRAPH_CATEGORY;
				}

				// 创建子流图节点模板
				let graphNodeTemplate:NodeTemplate = NodeManager.getInstance().createNodeTemplate(childGraphNodeConfig);
				graphNodeTemplate.isGraphNodeTemplate = true;
			}

			graph.postProcess();

			return graph;
		}
	}
}