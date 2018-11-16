/**
* 流图编辑窗口拖动滚动背景
* @author confiner
*/
var ui;
(function (ui) {
    var Sprite = Laya.Sprite;
    var Event = Laya.Event;
    class GraphEditorBgView extends Sprite {
        constructor() {
            super();
            this.zoom = 1.0;
            this.scaleValue = 1.0;
            this.initialize();
        }
        initialize() {
            this.name = "EditorBg";
            this._texture = Laya.loader.getRes("res/bg_wenli.png");
            this._bg = new Sprite();
            this.addChild(this._bg);
            this.drawBg();
            this._bg.pivot(this.width >> 1, this.height >> 1).pos(this.width >> 1, this.height >> 1);
            this.on(Event.MOUSE_WHEEL, this, this.onZoomHandler);
            this.on(Event.MOUSE_DOWN, this, this.onStartDragBgHandler);
            this.on(Event.MOUSE_UP, this, this.onStopDragBgHandler);
        }
        addGraphContainer(container) {
            this._container = container;
            this.addChild(this._container);
            this.updateCenter();
        }
        updateCenter() {
            if (!this._container)
                return;
            this._container.size(this.width, this.height);
            this._container.pivot(this._container.width >> 1, this._container.height >> 1).pos(this.width >> 1, this.height >> 1);
        }
        onZoomHandler(evt) {
            let delta = evt.delta * GraphEditorBgView._SPEED;
            this.zoom += delta;
            this.zoom = Math.min(this.zoom, GraphEditorBgView._MAX);
            this.scaleValue += delta;
            this.zoom = Math.max(this.zoom, GraphEditorBgView._MIN);
            if (this.width * this.scaleValue < 2048 || this.scaleValue >= GraphEditorBgView._MAX) {
                this.scaleValue = 1.0;
            }
            this.scale(this.zoom, this.zoom);
            //this._bg.scale(this.scaleValue, this.scaleValue);
            //this._container.scale(this.zoom, this.zoom);
            console.log("container: w:" + this._container.width + " h:" + this._container.height);
        }
        // 拖拽背景
        onStartDragBgHandler(evt) {
            evt.target.startDrag();
        }
        onStopDragBgHandler(evt) {
            evt.target.stopDrag();
        }
        drawBg() {
            if (!this._texture) {
                console.error("error: background texture is null!");
                return;
            }
            this._bg.graphics.clear();
            let wCnt = GraphEditorBgView._CNT;
            let hCnt = GraphEditorBgView._CNT;
            for (let w = 0; w < wCnt; ++w) {
                for (let h = 0; h < hCnt; ++h) {
                    this._bg.graphics.drawTexture(this._texture, w * this._texture.width, h * this._texture.height);
                }
            }
            this.size(GraphEditorBgView._CNT * this._texture.width, GraphEditorBgView._CNT * this._texture.height);
        }
    }
    GraphEditorBgView._CNT = 3;
    GraphEditorBgView._MAX = 1.0;
    GraphEditorBgView._MIN = 0.4;
    GraphEditorBgView._SPEED = 0.05;
    ui.GraphEditorBgView = GraphEditorBgView;
})(ui || (ui = {}));
//# sourceMappingURL=GraphEditorBgView.js.map