/**
* @desc 连接视图
* @author confiner
*/
module ui {
	import Sprite = Laya.Sprite;
	import Point = Laya.Point;
	import IData = core.IData;
	import Event = Laya.Event;
	import Rectangle = Laya.Rectangle;
	import EventTyp = core.EventType;
	import Association = model.Association;
	import EventManager = managers.EventManager;
	import GraphManager = managers.GraphManager;

	const LINE_SPACE: number = 20;
	const LINE_COLOR: string = "#b5b5b5";
	const LINE_SIZE: number = 2;

	export class ConectionView extends Sprite implements IData {

		data: Association;
		private _containers: Array<Sprite>;
		private _texture: Laya.Texture = null;
		private _status: boolean = false;
		private _invalid: boolean = false;
		private _color: string = "#ffffff";
		private _lastColor: string = "#ffffff";
		private _textureChanged: boolean = true;
		private _selected: boolean = false;
		private _anchor: Sprite = null;
		private _w: number = 0;
		private _h: number = 0;
		private _offsetX: number = 0;
		private _offsetY: number = 0;

		setData(data: Association): void {
			this.data = data;
			this.update();
		}

		public setAnchor(anchor: Sprite): void {
			this._anchor = anchor;
		}

		constructor() {
			super();
			this.mouseEnabled = true;
			this._containers = new Array<Sprite>();
			this.name = "ConnectionView";
			EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.onDebugHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			managers.EventManager.getInstance().on(core.EventType.CLICK, this, this.onClickLine);
			EventManager.getInstance().on(core.EventType.Reset_Texure, this, this.resetTexture);
			this.on(Event.CLICK, this, this.onDeleteLine);
		}

		private resetTexture(): void {
			this._textureChanged = true;
		}

		private testTexture(): void {
			//this.graphics.drawRect(0, 0, this.width, this.width, null, "#ff0000");
			// var htmlCanvas: Laya.HTMLCanvas = this.drawToCanvas(this.width, this.height, this.x, this.y);
			// let t:Laya.Texture = new Laya.Texture(htmlCanvas);

			let sp: Sprite = new Sprite();
			sp.pos(310, 110);
			sp.graphics.drawTexture(this._texture);
			Laya.stage.addChild(sp);
			sp.graphics.drawRect(0, 0, this._texture.width, this._texture.height, null, "#00ff00");
		}

		private onClickLine(type: core.ClickTargetType): void {
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

		private onDeleteLine(evt: Laya.Event): void {
			//this.pixelCheck();
			managers.EventManager.getInstance().event(core.EventType.CLICK, core.ClickTargetType.Line);
			evt.stopPropagation();
		}

		private onDebugHandler(): void {
			let endPoint: model.EndPoint = this.data.getEnd();
			let isDebug: boolean = managers.DebugManager.getInstance().isInDebugStack(endPoint.getNodeId());
			let color: string = this.data.isExecution() ? "#008a5c " : "#ffb761";
			if (isDebug)
				color = "#ff0000";
			this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), color);
		}

		public destroy(destoryChild: boolean): void {
			this.off(Event.CLICK, this, this.onDeleteLine);
			super.destroy(destoryChild);
			EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.onDebugHandler);
			managers.EventManager.getInstance().off(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			managers.EventManager.getInstance().off(core.EventType.CLICK, this, this.onClickLine);
			EventManager.getInstance().off(core.EventType.Reset_Texure, this, this.resetTexture);
		}

		private onDebugOperationHandler(operationType: string): void {
			if (operationType == core.DebugType.DebugExit.toString()) {
				this.update();
			}
		}

		private onClickHandler(evt: Event): void {
			let sp: Sprite = evt.target as Sprite;
			this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), "#ff0000");
			Laya.stage.on(Event.KEY_DOWN, this, this.onDeleteHandler);
			EventManager.getInstance().event(EventTyp.CLICK, core.ClickTargetType.Line);
			evt.stopPropagation();
		}

		private onDeleteHandler(evt: Event): void {
			Laya.stage.off(Event.KEY_DOWN, this, this.onDeleteHandler);
			if (evt.keyCode == Laya.Keyboard.DELETE && this._selected) {
				let graph: model.Graph = GraphManager.getInstance().getCurrent();
				if (graph)
					graph.deleteAssociation(this.data);
				this.offAll();
				this.destroy(true);
			}
		}

		// 画曲线
		public drawCurves(start: Laya.Point, end: Laya.Point, color: any): void {
			this.graphics.clear();
			this._color = color;
			let posX: number = 0;
			let posY: number = 0;
			let offsetX: number = 0;
			let offsetY: number = 0;
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

			let middle: Laya.Point = new Laya.Point((start.x + end.x) / 2, (start.y + end.y) / 2);
			let cp0: Laya.Point = new Laya.Point((middle.x + start.x) / 2, start.y);
			let cp1: Laya.Point = new Laya.Point((middle.x + end.x) / 2, end.y);
			this.graphics.drawCurves(posX, posY, [0, 0, cp0.x - start.x, cp0.y - start.y, middle.x - start.x, middle.y - start.y, cp1.x - start.x, cp1.y - start.y, end.x - start.x, end.y - start.y], color, LINE_SIZE);
			// this.graphics.drawRect(0, 0, this.width, this.height, null, "#fffff", 2);
			this._textureChanged = true;
		}

		private getTexture(): Laya.Texture {
			let pos: Laya.Point = new Laya.Point(this.x, this.y);
			pos = this._anchor.localToGlobal(pos);
			let viewportPos: Laya.Point = new Laya.Point(303, 105);
			if (pos.x >= viewportPos.x + GraphEditorView._VIEW_PORT.x || pos.x + this.width <= viewportPos.x || pos.y + this.height <= viewportPos.y || pos.y >= viewportPos.y + GraphEditorView._VIEW_PORT.y)
				return null;

			let x0: number = pos.x;
			this._offsetX = 0;
			this._offsetY = 0;
			if (pos.x < viewportPos.x) {
				x0 = viewportPos.x;
				this._offsetX = viewportPos.x - pos.x;
			}

			let x1: number = pos.x + this.width;
			if (x1 > viewportPos.x + GraphEditorView._VIEW_PORT.x) {
				x1 = viewportPos.x + GraphEditorView._VIEW_PORT.x;
			}

			let y0: number = pos.y;
			if (pos.y < viewportPos.y) {
				y0 = viewportPos.y;
				this._offsetY = viewportPos.y - pos.y;
			}

			let y1: number = pos.y + this.height;
			if (y1 > viewportPos.y + GraphEditorView._VIEW_PORT.y) {
				y1 = viewportPos.y + GraphEditorView._VIEW_PORT.y;
			}

			let w: number = Math.abs(x1 - x0);
			let h: number = Math.abs(y1 - y0);
			let canvas: Laya.HTMLCanvas = this.drawToCanvas(w, h, this.x - this._offsetX, this.y - this._offsetY);
			let texture: Laya.Texture = new Laya.Texture(canvas);
			return texture;
		}

		private pixelCheck(): void {
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
			let isOver: boolean = (pixelData[0] != 0 || pixelData[1] != 0 || pixelData[2] != 0) && pixelData[3] != 0;
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

		private draw(): void {
			if (this._invalid && this.data) {
				this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), this._color);
				this._invalid = false;
			}
		}

		public update(): void {
			let color: string = this.data.isExecution() ? "#008a5c " : "#ffb761";
			this._lastColor = color;
			this.drawCurves(this.data.getStart().transform.getAnchorPosition(), this.data.getEnd().transform.getAnchorPosition(), color);
		}

		public clearLine(): void {
			this.graphics.clear();
			while (this._containers.length > 0) {
				let container: Sprite = this._containers.pop();
				container.off(Event.CLICK, this, this.onClickHandler);
				container.graphics.clear();
				container.destroy();
			}
		}

	}
}