/**
* 流图编辑窗口拖动滚动背景
* @author confiner
*/
var ui;
(function (ui) {
    var Sprite = Laya.Sprite;
    class GraphContainerBgView extends Sprite {
        constructor() {
            super();
        }
        initialize() {
            this.name = "EditorBg";
            this._texture = Laya.loader.getRes("editor/nodeViewBg.png");
            this._bg = new Sprite();
            this.addChild(this._bg);
            this.drawBg();
        }
        drawBg() {
            if (!this._texture) {
                console.error("error: background texture is null!");
                return;
            }
            this._bg.graphics.clear();
            let wCnt = GraphContainerBgView._CNT;
            let hCnt = GraphContainerBgView._CNT;
            for (let w = 0; w < wCnt; ++w) {
                for (let h = 0; h < hCnt; ++h) {
                    this._bg.graphics.drawTexture(this._texture, w * this._texture.width, h * this._texture.height);
                }
            }
            this.size(GraphContainerBgView._CNT * this._texture.width, GraphContainerBgView._CNT * this._texture.height);
            this._bg.pivot(this.width >> 1, this.height >> 1).pos(this.width >> 1, this.height >> 1);
        }
    }
    GraphContainerBgView._CNT = 3;
    ui.GraphContainerBgView = GraphContainerBgView;
})(ui || (ui = {}));
//# sourceMappingURL=GraphContainerBgView.js.map