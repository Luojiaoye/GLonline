/**
* name 主窗口界面
*/
var ui;
(function (ui) {
    var EventType = core.EventType;
    var Event = Laya.Event;
    var GraphManager = managers.GraphManager;
    var EventManager = managers.EventManager;
    var MenuType = core.MenuType;
    var NavigatorData = model.NavigatorData;
    var GraphTabItemData = model.GraphTabItemData;
    class MainWindow extends ui.Editor.MainWindowUI {
        constructor() {
            super();
            this._graphView = null;
            this._dragRegion = null;
            this.init();
        }
        init() {
            this.name = "MainWindow";
            this._tabContents = new Map();
            this._leftView = new ui.LeftContentView();
            this.addChild(this._leftView);
            this._tabContainer = new Sprite();
            this._tabContainer.pos(303, 105);
            this.addChild(this._tabContainer);
            this._tabView = new ui.GraphTabView();
            this.addChild(this._tabView);
            this._rightView = new ui.RightContentView();
            this.addChild(this._rightView);
            this._rightView.visible = false;
            this._debugOperationView = new ui.DebugOpeationView();
            this.addChild(this._debugOperationView);
            this._debugOperationView.visible = false;
            this._debugStackView = new ui.DebugStackView();
            this.addChild(this._debugStackView);
            this._debugStackView.visible = false;
            this.btn_file.on(Event.CLICK, this, this.onMouseHandler);
            Laya.stage.on(Event.CLICK, this, this.onMouseHandler);
            this.removeChild(this.img_last);
            this.addChild(this.img_last);
            this.onResizeHandler();
            EventManager.getInstance().on(EventType.OPEN_NAVIGATOR, this, this.onOpenNavigatorHandler);
            EventManager.getInstance().on(EventType.CHANGE_TAB, this, this.changeTabHandler);
            EventManager.getInstance().on(EventType.DELETE_TAB_ITEM, this, this.deleteTabHandler);
            EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
            EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.onDebugResultHandler);
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownHandler);
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
        }
        onResizeHandler() {
            this.img_last.width = window.innerWidth;
            this.bg.width = window.innerWidth;
            this.bg.height = window.innerHeight - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).y;
        }
        destroy(destoryChild) {
            super.destroy(destoryChild);
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
        }
        onDebugResultHandler() {
            let graphDebugInfo = managers.DebugManager.getInstance().getCurrent();
            if (graphDebugInfo) {
                let data = new GraphTabItemData();
                data.name = graphDebugInfo.getName();
                data.cache = false;
                EventManager.getInstance().event(EventType.ADD_TAB_ITEM, [data]);
            }
        }
        onKeyDownHandler(evt) {
            if (evt.keyCode == Laya.Keyboard.F6) {
                managers.DebugManager.getInstance().debugEntry();
                this._debugOperationView.visible = true;
                this._debugStackView.visible = true;
            }
            else if (evt.keyCode == Laya.Keyboard.F10) {
                managers.DebugManager.getInstance().debugNext();
            }
        }
        onDebugOperationHandler(operationType) {
            if (operationType == core.DebugType.DebugExit.toString()) {
                this._debugStackView.visible = false;
                this._debugOperationView.visible = false;
            }
        }
        deleteTabHandler(item) {
            managers.DebugManager.getInstance().deleteGraphBreapoints(item.name);
            if (this._tabContents.has(item.name)) {
                let tabView = this._tabContents.get(item.name);
                this._tabContainer.removeChild(tabView);
                tabView.destroy(true);
                this._tabContents.delete(item.name);
                tabView = null;
            }
        }
        changeTabHandler(data) {
            let graph = GraphManager.getInstance().getGraph(data.name);
            GraphManager.getInstance().setCurrent(graph);
            this.clearTabContainer();
            let editorView = this._tabContents.get(data.name);
            if (!editorView) {
                let exist = GraphManager.getInstance().exist(data.name);
                if (!exist) {
                    console.error("error: graph:" + data.name + " not created");
                    return;
                }
                editorView = this.createGraphEditorView(data.name);
            }
            editorView.visible = true;
            EventManager.getInstance().event(EventType.SELECT_TAB_ITEM, [data.name]);
        }
        clearTabContainer() {
            for (let view of this._tabContents.values()) {
                view.visible = false;
            }
        }
        createGraphEditorView(name) {
            let editorView = new ui.GraphEditorView();
            this._tabContainer.addChild(editorView);
            editorView.setData(name);
            this._tabContents.set(name, editorView);
            return editorView;
        }
        onOpenNavigatorHandler(type) {
            let navigator = new NavigatorData();
            navigator.type = type;
            navigator.directory = GraphManager.getInstance().getDirectory();
            if (!this._navigatorView) {
                this._navigatorView = new ui.FileNavigatorView();
                this.addChild(this._navigatorView);
            }
            this._navigatorView.pos((this.width - this._navigatorView.width) >> 1, (this.height - this._navigatorView.height) >> 1);
            if (!this._navigatorView.visible)
                this._navigatorView.visible = true;
            this._navigatorView.setData(navigator);
        }
        onMouseHandler(evt) {
            if (evt.type != Event.CLICK)
                return;
            if (evt.currentTarget.name == "file") {
                if (!this._menuView) {
                    this._menuView = new ui.MenuView();
                    this._menuView.x = 225;
                    this._menuView.y = 50;
                    let data = [MenuType.New, MenuType.Open, MenuType.Save];
                    this._menuView.setData(data);
                    this.addChild(this._menuView);
                    this._menuView.visible = false;
                }
                this._menuView.visible = !this._menuView.visible;
                evt.stopPropagation();
            }
            else {
                if (this._menuView)
                    this._menuView.visible = false;
            }
        }
        onClick(evt) {
            if (this._menuView)
                this._menuView.visible = false;
        }
    }
    ui.MainWindow = MainWindow;
})(ui || (ui = {}));
//# sourceMappingURL=MainWindow.js.map