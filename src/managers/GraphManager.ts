/**
* 流图管理器
* @author confiner
*/
module managers
{
	import Graph = model.Graph;
	import FileInfo = model.FileInfo;
	//import GraphTemplate = template.GraphTemplate;

	export class GraphManager
	{
		private static _inst:GraphManager; //单例对象

		private _graphs:Map<string, Graph>;	// 流图列表

		private _graphConfig:Array<Object>;	// 流图配置对象列表

		private _guid:number = 0;

		private _curGraph:Graph;

		private _graphsDir:FileInfo;	// 文件列表

		private constructor()
		{
			this.initialize();
		}

		private initialize():void
		{
			this._graphs = new Map<string, Graph>();
			Laya.timer.frameLoop(1, this, this.postUpdate);
		}

		private postUpdate():void
		{
			// 只更新当前流图
			let graph:Graph = this.getCurrent();
			if(graph)
				graph.update();
		}

		// 创建流图[如果流图名称重复则创建失败]
		public createGraph(name?:string):Graph
		{
			if(!name)
				name = this.getDefaultName();

			if(this._graphs.has(name))
				return this._graphs.get(name);

			let graph:model.Graph = new model.Graph();
			graph.name = name;

			this._graphs.set(name, graph);

			return graph;
		}

		private getDefaultName():string
		{
			(++this._guid);
			return "untitle" + this._guid.toString();
		}


		// 获取所有断点
		public getBreakPoints():Map<string, Array<string>>
		{
			let breakPoints:Map<string, Array<string>> = new Map<string, Array<string>>();

			let nodeIds:Array<string> = null;
			for(let graph of this._graphs.values())
			{
				nodeIds = graph.getDebugNodeIds();
				if(nodeIds && nodeIds.length > 0)
				{
					breakPoints.set(graph.name, nodeIds);
				}
			}

			return breakPoints;
		}

		// 加载所有流图
		public loadGraphs(config:string):void
		{
			this._graphs.clear();
			this._curGraph = null;

			this._graphConfig = this.preProcessConfig(config);
			for(let i:number = 0; i < this._graphConfig.length; ++i)
			{
				this.loadGraph(this._graphConfig[i]);
			}

			this.parseGraphFiles();
			EventManager.getInstance().event(core.EventType.LOAD_GRAPH);
		}

		private parseGraphFiles():void
		{
			this._graphsDir = new FileInfo();
			this._graphsDir.files = new Array<FileInfo>();
			this._graphsDir.name = "flowGraphs";
			let file:FileInfo = null;
			for(let i:number = 0; i < this._graphConfig.length; ++i)
			{
				file = this._graphsDir.createFile();
				if(file)
				{
					file.name = this._graphConfig[i]["name"];
				}
			}
		}

		// 获取流图配置
		public getGraphConfig(name:string):Object
		{
			for(let graphCfg of this._graphConfig)
			{
				if(graphCfg["name"] == name)
					return graphCfg;
			}

			return null;
		}

		private preProcessConfig(config:string):Array<Object>
		{
			let children:Array<Object> = new Array<Object>();
			let main:Array<Object> = new Array<Object>();
			let graphs:Array<Object> = JSON.parse(config);
			for(let graph of graphs)
			{
				let graphObj:Object = JSON.parse(graph as string);
				if(graphObj["children_flow_graph_call"] && graphObj["children_flow_graph_return"])
				{
					children.push(graphObj);
				}
				else
				{
					main.push(graphObj);
				}
			}

			return children.concat(main);
		}


		// 获取流图文件目录
		public getDirectory(id?:string):FileInfo
		{
			if(id)
			{
				return this._graphsDir.getFile(id);
			}
			else
			{
				return this._graphsDir;
			}
		}

		public loadGraph(graphObj:Object):void
		{
			let graphTemplate:template.GraphTemplate = new template.GraphTemplate(graphObj);
			if(this._graphs.has(graphTemplate.name))
				return;

			let graph:Graph = graphTemplate.createGraph();
			this._graphs.set(graph.name, graph);
		}

		// 获取所有流图
		public getGraphs():Array<Graph>
		{
			let arr:Array<Graph> = new Array<Graph>();
			for(let graph of this._graphs.values())
			{
				arr.push(graph);
			}

			return arr;
		}

		// 通过名称获取流图
		public getGraph(name:string):Graph
		{
			return this._graphs.get(name);
		}

		public exist(name:string):boolean
		{
			if(this._graphs.has(name))
			{
				// 重复的名字
				return true;
			}

			return false;
		}

		public setCurrent(graph:Graph):void
		{
			this._curGraph = graph;
			EventManager.getInstance().event(core.EventType.CHANGE_GRAPH);
		}

		public getCurrent():Graph
		{
			return this._curGraph;
		}

		public 

		public changeCurrentName(newName:string):void
		{
			this._graphs.delete(this._curGraph.name);
			this._curGraph.name = newName;
			this._graphs.set(newName, this._curGraph);
		}

		public save(graph:Graph):void
		{
			if(DebugManager.getInstance().getDebug())
				return; // 调试状态无法保存

			if(graph)
				ServerManager.getInstance().sendGraph(graph.toJson());
		}

		public syncGraph(name:string):void
		{
			let graph:Graph = this._graphs.get(name);
			if(!graph)
			{
				console.error("error: the current graph:" + name + " is null to save!!!");
			}
			else
			{
				ServerManager.getInstance().sendGraph(graph.toJson());
			}	
		}

		// 获取单例接口
		public static getInstance():GraphManager
		{
			if(!GraphManager._inst)
			{
				GraphManager._inst = new GraphManager();
			}

			return GraphManager._inst;
		}
	}
}