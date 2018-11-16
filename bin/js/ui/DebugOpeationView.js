/**
* 调试操作界面
* @author confiner
*/
var ui;
(function (ui) {
    class DebugOpeationView extends ui.Editor.DebugOperationUI {
        constructor() {
            super();
            this.init();
        }
        init() {
            this.btn_break.on(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_stop.on(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_next.on(Laya.Event.CLICK, this, this.onClickHandler);
        }
        onClickHandler(evt) {
            switch (evt.currentTarget) {
                case this.btn_break:
                    managers.DebugManager.getInstance().debugContinue();
                    break;
                case this.btn_next:
                    managers.DebugManager.getInstance().debugNext();
                    break;
                case this.btn_stop:
                    managers.DebugManager.getInstance().debugExit();
                    break;
            }
        }
    }
    ui.DebugOpeationView = DebugOpeationView;
})(ui || (ui = {}));
//# sourceMappingURL=DebugOpeationView.js.map