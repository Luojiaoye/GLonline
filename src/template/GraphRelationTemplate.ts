/**
* 流图节点模板类(包含关系)
* @author confiner 
*/
module template {
	import Node = model.Node;
	import NodeManager = managers.NodeManager;
	import NodeTemplate = template.NodeTemplate;
	import Association = model.Association;
	import Relation = model.Relation;
	import GraphManager = managers.GraphManager;
	import Variable = model.Variable;
	import Custom = model.Custom;

	export class GraphRelationTemplate implements core.ITemplate {
		config: Object;

		public name: string;	// 节点名称
		public input: Object;	// 数据输入关联
		public next: Object;	// 执行输出关联
		public nodeId: string;	// 节点id
		public variables: Array<Variable>;	// 变量列表
		public customs: Array<Custom>;	// 自定义节点列表
		public ownerGrahpName: string;	// 所属流图名称 
		public position: Array<number>;	// 所在位置
		public varName: string;	// 变量名称
		public type: string;	// 节点类型
		public subGraphTemplateBaks: Map<string, Node>; // 子流图备份列表

		constructor(config: Object) {
			this.config = config;
			this.parse();
		}

		parse(): void {
			this.name = this.config["name"];
			this.input = this.config["input"];
			this.next = this.config["next"];
			this.ownerGrahpName = this.config["children_flow_graph_name"];
			this.position = this.config["ui_position"];
			this.varName = this.config["varName"];
			this.type = this.config["type"];
		}

		// 创建关联组合
		public createRelation(): Relation {
			let relation: Relation = new Relation();
			let nodeName: string = this.ownerGrahpName ? this.ownerGrahpName : this.name;
			let node: Node = null;
			if (this.type == core.NodeType.Variable.toString() && this.variables)	// 解析变量类型节点
			{
				let variable: Variable = null;
				for (let vari of this.variables) {
					if (vari.getName() == this.varName) {
						variable = vari;
						break;
					}
				}

				if (variable) {
					if (this.input) {
						// set 变量节点
						node = variable.createSetNode();
					}
					else {
						// get变量节点
						node = variable.createGetNode();
					}

					node.setId(this.nodeId);
					node.setOwnerId(variable.getId());
				}
			}
			else if (this.type == core.NodeType.Custom.toString() && this.customs)	// 解析自定义类型节点
			{
				let custom: Custom = null;
				for (let csm of this.customs) {
					if (csm.getName() == nodeName) {
						custom = csm;
						break;
					}
				}

				if (custom) {
					node = new Node();
					node.copyFrom(custom.getNode());
					node.setId(this.nodeId);
				}
			}
			else if (this.type == core.NodeType.Graph.toString()) {
				let graphCfg: Object = GraphManager.getInstance().getGraphConfig(nodeName);
				GraphManager.getInstance().loadGraph(graphCfg);
				node = NodeManager.getInstance().createNode(nodeName, this.nodeId);
				if (this.subGraphTemplateBaks) {
					let nodeBak: model.Node = this.subGraphTemplateBaks.get(nodeName);
					if (!node.same(nodeBak)) {
						//node = nodeBak;
						node.isBak = true;
						console.log(node.id + "--->bak");
					}
				}
			}
			else {
				node = NodeManager.getInstance().createNode(nodeName, this.nodeId);
			}

			node.x = this.position[0];
			node.y = this.position[1];
			relation.node = node;

			let input: GraphInputTemplate = new GraphInputTemplate(this.input);
			input.node = node;
			let inputAssociations: Array<Association> = input.createAssociations();

			let next: GraphNextTemplate = new GraphNextTemplate(this.next);
			next.nodeId = this.nodeId;
			let nextAssociations: Array<Association> = next.createAssociations();

			let allAssociation: Array<Association> = null;
			if (inputAssociations) {
				allAssociation = inputAssociations;
			}

			if (nextAssociations) {
				if (allAssociation)
					allAssociation = allAssociation.concat(nextAssociations);
				else
					allAssociation = nextAssociations;
			}

			relation.associations = allAssociation;

			return relation;
		}
	}
}