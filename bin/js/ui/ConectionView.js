/**
* @desc 连接视图
* @author confiner
*/
var ui;
(function (ui) {
    var Sprite = Laya.Sprite;
    var Event = Laya.Event;
    var EventTyp = core.EventType;
    var EventManager = managers.EventManager;
    var GraphManager = managers.GraphManager;
    const LINE_SPACE = 20;
    const LINE_COLOR = "#b5b5b5";
    const LINE_SIZE = 2;
    class ConectionView extends Sprite {
        constructor() {
            super();
            this._texture = null;
            this._status = false;
            this._invalid = false;
            this._color = "#ffffff";
            this._lastColor = "#ffffff";
            this._textureChanged = true;
            this._selected = false;
            this._anchor = null;
            this._w = 0;
            this._h = 0;
            this._offsetX = 0;
            this._offsetY = 0;
            this.mouseEnabled = true;
            this._containers = new Array();
            this.name = "ConnectionView";
            EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.onDebugHandler);
            managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
            managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
            managers.EventManager.getInstance().on(core.EventType.CLICK, this, this.onClickLine);
            EventManager.getInstance().on(core.EventType.Reset_Texure, this, this.resetTexture);
            this.on(Event.CLICK, this, this.onDeleteLine);
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        setAnchor(anchor) {
            this._anchor = anchor;
        }
        resetTexture() {
            this._textureChanged = true;
        }
        testTexture() {
            //this.graphics.drawRect(0, 0, this.width, this.width, null, "#ff0000");
            // var htmlCanvas: Laya.HTMLCanvas = this.drawToCanvas(this.width, this.height, this.x, this.y);
            // let t:Laya.Texture = new Laya.Texture(htmlCanvas);
            let sp = new Sprite();
            sp.pos(310, 110);
            sp.graphics.drawTexture(this._texture);
            Laya.stage.addChild(sp);
            sp.graphics.drawRect(0, 0, this._texture.width, this._texture.height, null, "#00ff00");
        }
        onClickLine(type) {
            if (type == core.ClickTargetType.Line) {
                this.pixelCheck();
            }
            else {
                this._color = this._lastColor;
                this._invalid = true;
                this._selected = false;
                // if (this._texture != null) {
                // 	this._texture.destroy(true);
                // 	this._texture = null;
                // }
                this.draw();
            }
        }
        onDeleteLine(evt) {
            //this.pixelCheck();
            managers.EventManager.getInstance().event(core.EventType.CLICK, core.ClickTargetType.Line);
            evt.stopPropagation();
        }
        onDebugHandler() {
            let endPoint = this.data.getEnd();
            let isDebug = managers.DebugManager.getInstance().isInDebugStack(endPoint.getNodeId());
            let color = this.data.isExecution() ? "#008a5c " : "#ffb761";
            if (isDebug)
                color = "#ff0000";
            this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), color);
        }
        destroy(destoryChild) {
            this.off(Event.CLICK, this, this.onDeleteLine);
            super.destroy(destoryChild);
            EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.onDebugHandler);
            managers.EventManager.getInstance().off(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
            managers.EventManager.getInstance().off(core.EventType.CLICK, this, this.onClickLine);
            EventManager.getInstance().off(core.EventType.Reset_Texure, this, this.resetTexture);
        }
        onDebugOperationHandler(operationType) {
            if (operationType == core.DebugType.DebugExit.toString()) {
                this.update();
            }
        }
        onClickHandler(evt) {
            let sp = evt.target;
            this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), "#ff0000");
            Laya.stage.on(Event.KEY_DOWN, this, this.onDeleteHandler);
            EventManager.getInstance().event(EventTyp.CLICK, core.ClickTargetType.Line);
            evt.stopPropagation();
        }
        onDeleteHandler(evt) {
            Laya.stage.off(Event.KEY_DOWN, this, this.onDeleteHandler);
            if (evt.keyCode == Laya.Keyboard.DELETE && this._selected) {
                let graph = GraphManager.getInstance().getCurrent();
                if (graph)
                    graph.deleteAssociation(this.data);
                this.offAll();
                this.destroy(true);
            }
        }
        // 画曲线
        drawCurves(start, end, color) {
            this.graphics.clear();
            this._color = color;
            let posX = 0;
            let posY = 0;
            let offsetX = 0;
            let offsetY = 0;
            if (start.x == end.x) {
                start.x = start.x - 1;
            }
            if (start.y == end.y) {
                start.y = start.y - 1;
            }
            if (start.x < end.x && start.y < end.y) {
                // 1->3对角线
                this._w = end.x - start.x;
                this._h = end.y - start.y;
                offsetX = start.x;
                offsetY = start.y;
            }
            else if (start.x > end.x && start.y > end.y) {
                // 3->1对角线
                this._w = start.x - end.x;
                this._h = start.y - end.y;
                offsetX = end.x;
                offsetY = end.y;
                posX = this._w;
                posY = this._h;
            }
            else if (start.x < end.x && start.y > end.y) {
                // 4->2对角线
                this._w = end.x - start.x;
                this._h = start.y - end.y;
                offsetX = start.x;
                offsetY = end.y;
                posY = this._h;
            }
            else if (start.x > end.x && start.y < end.y) {
                // 2->4对角线
                this._w = start.x - end.x;
                this._h = end.y - start.y;
                offsetX = end.x;
                offsetY = start.y;
                posX = this._w;
            }
            this.size(this._w, this._h);
            this.pos(offsetX, offsetY);
            let middle = new Laya.Point((start.x + end.x) / 2, (start.y + end.y) / 2);
            let cp0 = new Laya.Point((middle.x + start.x) / 2, start.y);
            let cp1 = new Laya.Point((middle.x + end.x) / 2, end.y);
            this.graphics.drawCurves(posX, posY, [0, 0, cp0.x - start.x, cp0.y - start.y, middle.x - start.x, middle.y - start.y, cp1.x - start.x, cp1.y - start.y, end.x - start.x, end.y - start.y], color, LINE_SIZE);
            // this.graphics.drawRect(0, 0, this.width, this.height, null, "#fffff", 2);
            this._textureChanged = true;
        }
        getTexture() {
            let pos = new Laya.Point(this.x, this.y);
            pos = this._anchor.localToGlobal(pos);
            let viewportPos = new Laya.Point(303, 105);
            if (pos.x >= viewportPos.x + ui.GraphEditorView._VIEW_PORT.x || pos.x + this.width <= viewportPos.x || pos.y + this.height <= viewportPos.y || pos.y >= viewportPos.y + ui.GraphEditorView._VIEW_PORT.y)
                return null;
            let x0 = pos.x;
            this._offsetX = 0;
            this._offsetY = 0;
            if (pos.x < viewportPos.x) {
                x0 = viewportPos.x;
                this._offsetX = viewportPos.x - pos.x;
            }
            let x1 = pos.x + this.width;
            if (x1 > viewportPos.x + ui.GraphEditorView._VIEW_PORT.x) {
                x1 = viewportPos.x + ui.GraphEditorView._VIEW_PORT.x;
            }
            let y0 = pos.y;
            if (pos.y < viewportPos.y) {
                y0 = viewportPos.y;
                this._offsetY = viewportPos.y - pos.y;
            }
            let y1 = pos.y + this.height;
            if (y1 > viewportPos.y + ui.GraphEditorView._VIEW_PORT.y) {
                y1 = viewportPos.y + ui.GraphEditorView._VIEW_PORT.y;
            }
            let w = Math.abs(x1 - x0);
            let h = Math.abs(y1 - y0);
            let canvas = this.drawToCanvas(w, h, this.x - this._offsetX, this.y - this._offsetY);
            let texture = new Laya.Texture(canvas);
            return texture;
        }
        pixelCheck() {
            if (this._textureChanged) {
                if (this._texture) {
                    this._texture.destroy(true);
                }
                this._texture = this.getTexture();
            }
            if (!this._texture)
                return;
            //this.graphics.drawTexture(this._texture, this._offsetX, this._offsetY + 10);
            let pixelData = this._texture.getPixels(this.mouseX - this._offsetX, this.mouseY - this._offsetY, 1, 1);
            let isOver = (pixelData[0] != 0 || pixelData[1] != 0 || pixelData[2] != 0) && pixelData[3] != 0;
            if (isOver) {
                this._invalid = true;
                this._lastColor = this._color;
                this._color = "#ff0000";
                this._selected = true;
                Laya.stage.on(Event.KEY_DOWN, this, this.onDeleteHandler);
                this.graphics.drawRect(0, 0, this._texture.width, this._texture.height, null, "#00ff00");
            }
            else if (!isOver) {
                Laya.stage.off(Event.KEY_DOWN, this, this.onDeleteHandler);
                this._color = this._lastColor;
                this._invalid = true;
                this._selected = false;
                // if (this._texture != null) {
                // 	this._texture.destroy(true);
                // 	this._texture = null;
                // }
            }
            this.draw();
            this._textureChanged = false;
        }
        draw() {
            if (this._invalid && this.data) {
                this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), this._color);
                this._invalid = false;
            }
        }
        update() {
            let color = this.data.isExecution() ? "#008a5c " : "#ffb761";
            this._lastColor = color;
            this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), color);
        }
        clearLine() {
            this.graphics.clear();
            while (this._containers.length > 0) {
                let container = this._containers.pop();
                container.off(Event.CLICK, this, this.onClickHandler);
                container.graphics.clear();
                container.destroy();
            }
        }
    }
    ui.ConectionView = ConectionView;
})(ui || (ui = {}));
//# sourceMappingURL=ConectionView.js.map