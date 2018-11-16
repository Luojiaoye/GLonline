/**
* 调试栈界面
* @author confiner
*/
var ui;
(function (ui) {
    class DebugStackView extends ui.Editor.DebugStackViewUI {
        constructor() {
            super();
            this.init();
        }
        init() {
            this.y = Laya.stage.height - 230;
            this.clip_upDown.on(Laya.Event.CLICK, this, this.upDownHandler);
            this.list_stack.renderHandler = new Handler(this, this.onRenderHandler);
            this.btn_stack.on(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_logs.on(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_stack.selected = true;
            this.list_stack.visible = false;
            this.txt_logs.visible = false;
            this.btn_logs.selected = false;
            managers.EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.update);
            //this.test_txt.text = "hedafda\n" + "dddfdafd";
        }
        onSelectHandler(item, index) {
            managers.EventManager.getInstance().event(core.EventType.DEBUG_ITEM_SELECT);
            item.setSelect();
            managers.DebugManager.getInstance().setCurrent(index);
        }
        update() {
            let graphs = managers.DebugManager.getInstance().getGraphDebugInfoList();
            this.list_stack.visible = false;
            if (graphs && graphs.length > 0) {
                this.list_stack.visible = true;
                this.list_stack.array = graphs;
                this.list_stack.repeatY = graphs.length;
                let log = "";
                let isDebug = false;
                for (let i = graphs.length - 1; i >= 0; --i) {
                    isDebug = managers.DebugManager.getInstance().isInDebugStack(graphs[i].getHitNodeId());
                    if (!isDebug)
                        continue;
                    if (graphs[i].getLog() == "")
                        continue;
                    log += graphs[i].getLog() + "\n"; //+ this.addLineString() + "\n";
                }
                this.txt_logs.text = log;
            }
        }
        addLineString() {
            let str = "";
            for (let i = 0; i < 100; ++i) {
                str += "=";
            }
            return str;
        }
        destroy(destoryChild) {
            managers.EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.update);
            this.offAll();
            super.destroy(destoryChild);
        }
        onClickHandler(evt) {
            if (evt.currentTarget == this.btn_stack) {
                this.btn_stack.selected = true;
                this.btn_logs.selected = false;
                this.list_stack.visible = true;
                this.txt_logs.visible = false;
            }
            else if (evt.currentTarget == this.btn_logs) {
                this.btn_stack.selected = false;
                this.btn_logs.selected = true;
                this.list_stack.visible = false;
                this.txt_logs.visible = true;
            }
        }
        onRenderHandler(item, index) {
            if (index % 2 == 0) {
                item.img_one.visible = true;
                item.img_two.visible = false;
            }
            else {
                item.img_one.visible = false;
                item.img_two.visible = true;
            }
            item.on(Laya.Event.CLICK, this, this.onSelectHandler, [item, index]);
            item.setData(item.dataSource);
        }
        upDownHandler() {
            if (this.clip_upDown.index == 0) {
                this.clip_upDown.index = 1;
                this.y = Laya.stage.height - 30;
                this.btn_logs.visible = false;
                this.btn_stack.visible = false;
            }
            else {
                this.clip_upDown.index = 0;
                this.y = Laya.stage.height - 230;
                this.btn_logs.visible = true;
                this.btn_stack.visible = true;
            }
        }
    }
    ui.DebugStackView = DebugStackView;
})(ui || (ui = {}));
//# sourceMappingURL=DebugStackView.js.map