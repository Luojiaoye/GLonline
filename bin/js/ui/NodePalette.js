/**
* @desc 节点树
* @author confiner
*/
var ui;
(function (ui) {
    var Utils = Laya.Utils;
    var Event = Laya.Event;
    var Dictionary = Laya.Dictionary;
    var Rectangle = Laya.Rectangle;
    var Label = Laya.Label;
    var EventType = core.EventType;
    var NodeManager = managers.NodeManager;
    var EventManager = managers.EventManager;
    class NodePalette extends ui.Editor.NodPaletteUI {
        constructor() {
            super();
            this._dragRegion = null; // 拖拽区域
            this.init();
        }
        add() {
        }
        switcher(data) {
            this.visible = data.open;
            if (data.open)
                managers.EventManager.getInstance().event(core.EventType.NODES_DETAIL);
            data.height = this.visible ? this.height : 0;
        }
        getContent() {
            return this;
        }
        init() {
            this.createDragRegion();
            this.addEvents();
            this.tree_nodes.mouseHandler = new Handler(this, this.onMouseClick);
            this.tree_nodes.renderHandler = new Handler(this, this.onItemRender);
            this.btn_close.clickHandler = new Handler(this, this.clickHandler);
            this.input_key.on(Event.INPUT, this, this.onInputHandler);
            let data = NodeManager.getInstance().getAllNodeTemplates();
            this.setData(data);
        }
        createDragRegion() {
            let pos = new Laya.Point(this.x, this.y);
            pos = this.localToGlobal(pos);
            this._dragRegion = new Rectangle(0, 160, 1920, 1000);
        }
        onInputHandler(evt) {
            let partten = this.input_key.text.trim();
            if (partten) {
                let matchs = NodeManager.getInstance().getMatchNodeTemplates(partten);
                if (matchs) {
                    this.setData(matchs);
                }
            }
        }
        clickHandler() {
            this.input_key.text = "";
            this.setData(NodeManager.getInstance().getAllNodeTemplates());
        }
        onItemRender(item, index) {
            item.setData(item.dataSource);
        }
        parseNodeTemplatesToTreeData() {
            let nodeTemplates = new Dictionary();
            for (let nodeTemplate of this.data.values()) {
                let categoryObj = nodeTemplates.get(nodeTemplate.category);
                if (!categoryObj) {
                    categoryObj = {};
                    nodeTemplates.set(nodeTemplate.category, categoryObj);
                }
                if (nodeTemplate.subCategory) {
                    // 处理子目录
                    let subCategoryObj = categoryObj["subs"];
                    if (!subCategoryObj) {
                        subCategoryObj = new Dictionary();
                        categoryObj["subs"] = subCategoryObj;
                    }
                    let leafs = subCategoryObj[nodeTemplate.subCategory];
                    if (!leafs) {
                        leafs = new Array();
                        subCategoryObj.set(nodeTemplate.subCategory, leafs);
                    }
                    leafs.push(nodeTemplate.name);
                }
                else {
                    // 处理叶子节点
                    let leafsArray = categoryObj["leafs"];
                    if (!leafsArray) {
                        leafsArray = new Array();
                        categoryObj["leafs"] = leafsArray;
                    }
                    leafsArray.push(nodeTemplate.name);
                }
            }
            let openStatus = this.input_key.text.trim() != "" ? 'true' : 'false';
            // 组合tree数据xml
            let treeData = "<data>";
            for (let index in nodeTemplates.keys) {
                let dirName = nodeTemplates.keys[index];
                treeData += "<dir label='" + dirName + "' isOpen='" + openStatus + "'>";
                // 处理子节点
                let categoryObj = nodeTemplates.get(dirName);
                let subCategoryObj = categoryObj["subs"];
                if (subCategoryObj) {
                    for (let idx in subCategoryObj.keys) {
                        let subName = subCategoryObj.keys[idx];
                        treeData += "<dir label='" + subName + "' isOpen='" + openStatus + "'>";
                        // 子节点中的叶子节点
                        let leafs = subCategoryObj.get(subName);
                        if (leafs) {
                            for (let i = 0; i < leafs.length; ++i) {
                                treeData += "<file label='" + leafs[i] + "' colorId='" + dirName + "'/>";
                            }
                        }
                        treeData += "</dir>";
                    }
                }
                // 处理当前节点的叶子节点
                let leafs = categoryObj["leafs"];
                if (leafs) {
                    for (let i = 0; i < leafs.length; ++i) {
                        treeData += "<file label='" + leafs[i] + "' colorId='" + dirName + "'/>";
                    }
                }
                treeData += "</dir>";
            }
            treeData += "</data>";
            return Utils.parseXMLFromString(treeData);
        }
        addEvents() {
            EventManager.getInstance().on(EventType.LOAD_GRAPH, this, this.updateNodes);
        }
        removeEvents() {
            EventManager.getInstance().off(EventType.LOAD_GRAPH, this, this.updateNodes);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.removeEvents();
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            if (!this.data)
                return;
            this.tree_nodes.fresh();
            this.tree_nodes.xml = this.parseNodeTemplatesToTreeData();
        }
        updateNodes() {
            let data = NodeManager.getInstance().getAllNodeTemplates();
            this.setData(data);
        }
        onMouseClick(evt, index) {
            let target = evt.target;
            if (evt.type == Event.MOUSE_DOWN) {
                if (target["dataSource"]) {
                    let hasChild = target.dataSource["hasChild"];
                    if (!hasChild) {
                        // 叶子节点
                        let item = new Label();
                        let nodeName = target["dataSource"]["label"];
                        item.text = nodeName;
                        item.width = target["width"];
                        item.height = target["height"];
                        item.x = evt.stageX;
                        item.y = evt.stageY;
                        Laya.stage.addChild(item);
                        item.startDrag(this._dragRegion);
                        Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [nodeName, item]);
                    }
                }
            }
        }
        onStageMouseUp(nodeName, item, evt) {
            let pos = new Laya.Point(this.x, this.y);
            pos = this.localToGlobal(pos);
            if (!this._dragRegion.contains(item.x, item.y)) {
                // 不在拖动区域内则不处理
            }
            else if (item.x < pos.x + this.width) {
            }
            else {
                EventManager.getInstance().event(EventType.ADD_NODE, [nodeName, item.x, item.y]);
            }
            Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
            item.destroy();
            item = null;
        }
    }
    ui.NodePalette = NodePalette;
})(ui || (ui = {}));
//# sourceMappingURL=NodePalette.js.map