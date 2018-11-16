/**
* @desc 所有流图界面
* @author confiner
*/
var ui;
(function (ui) {
    var GraphManager = managers.GraphManager;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    class GraphsView extends ui.Editor.GraphsViewUI {
        constructor() {
            super();
            this.init();
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            this.list_graphs.array = this.data;
            this.list_graphs.repeatY = this.data.length;
            this.list_graphs.renderHandler = new Laya.Handler(this, this.onListRender);
        }
        init() {
            let names = new Array();
            let graphs = GraphManager.getInstance().getGraphs();
            for (let graph of graphs) {
                names.push(graph.name);
            }
            this.setData(names);
        }
        onListRender(cell, index) {
            let labl = cell.getChildByName("graphName");
            labl.text = this.list_graphs.array[index];
            labl.on(Laya.Event.CLICK, this, this.onClickHandler, [this.list_graphs.array[index]]);
        }
        onClickHandler(graphName, evt) {
            EventManager.getInstance().event(EventType.RELOAD_GRAPH, [graphName]);
            evt.target.off(Laya.Event.CLICK, this, this.onClickHandler);
            this.destroy();
        }
    }
    ui.GraphsView = GraphsView;
})(ui || (ui = {}));
//# sourceMappingURL=GraphsView.js.map