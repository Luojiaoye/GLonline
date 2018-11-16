var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var Editor;
    (function (Editor) {
        class AlertUI extends Dialog {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.AlertUI.uiView);
            }
        }
        AlertUI.uiView = { "type": "Dialog", "props": {}, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 457, "var": "bg", "skin": "editor/file_title_bg.png", "sizeGrid": "27,60,0,60", "height": 145 } }, { "type": "Label", "props": { "y": 10, "x": 180, "width": 100.751953125, "text": "Waring!", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ff0000", "bold": true } }, { "type": "Label", "props": { "y": 42, "x": 41, "wordWrap": true, "width": 382, "var": "txt_content", "text": "file is existed, continue to override the file?", "leading": 8, "fontSize": 16, "font": "Microsoft YaHei", "color": "#b5b5b5 " } }, { "type": "Button", "props": { "y": 101, "x": 93, "var": "btn_ok", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Continue" } }, { "type": "Button", "props": { "y": 101, "x": 277, "var": "btn_cancel", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Cancel" } }] }] };
        Editor.AlertUI = AlertUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class CustomCreateViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.CustomCreateViewItem", ui.CustomCreateViewItem);
                super.createChildren();
                this.createView(ui.Editor.CustomCreateViewUI.uiView);
            }
        }
        CustomCreateViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 295 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 295, "var": "img_bg", "skin": "editor/varBg.png", "sizeGrid": "5,5,5,5", "height": 159 } }, { "type": "List", "props": { "y": 5, "x": 0, "var": "list_customs", "spaceY": 3 }, "child": [{ "type": "CustomCreateViewItem", "props": { "runtime": "ui.CustomCreateViewItem", "renderType": "render", "name": "render" } }] }] };
        Editor.CustomCreateViewUI = CustomCreateViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class CustomDescriptorViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.CustomDescriptorViewUI.uiView);
            }
        }
        CustomDescriptorViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 379, "height": 148 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 379, "height": 148 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 379, "skin": "editor/dibu_bg.png", "height": 148 } }, { "type": "Box", "props": { "y": 21, "x": 28 }, "child": [{ "type": "CheckBox", "props": { "y": 44, "x": 153, "var": "check_bind", "stateNum": 3, "skin": "editor/checkbox.png", "selected": true, "labelSize": 18, "labelFont": "Microsoft YaHei", "labelColors": "#b5b5b5", "labelAlign": "left" } }, { "type": "TextInput", "props": { "y": 1, "x": 153, "width": 161, "var": "input_varValue", "type": "text", "skin": "editor/textinput.png", "padding": "-2", "height": 22, "fontSize": 16, "font": "Microsoft YaHei", "color": "#000000" } }, { "type": "Label", "props": { "text": "Node Name:", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Label", "props": { "y": 44, "x": 0, "text": "Bind :", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Label", "props": { "y": 88, "x": 0, "text": "Type:", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "ComboBox", "props": { "y": 88, "x": 153, "width": 125, "var": "cbx_types", "skin": "editor/combobox.png", "labels": "label1,label2", "labelSize": 18, "labelFont": "Microsoft YaHei", "labelColors": "#000000,#ffffff,#ffffff", "itemSize": 18, "height": 24 } }] }] }] };
        Editor.CustomDescriptorViewUI = CustomDescriptorViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class CustomSlotViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.CustomSlotViewItem", ui.CustomSlotViewItem);
                super.createChildren();
                this.createView(ui.Editor.CustomSlotViewUI.uiView);
            }
        }
        CustomSlotViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 379, "height": 91 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 379, "var": "bg", "skin": "editor/dibu_bg.png", "height": 91 } }, { "type": "List", "props": { "y": 10, "x": 21, "var": "list_slots", "spaceY": 3 }, "child": [{ "type": "CustomSlotViewItem", "props": { "runtime": "ui.CustomSlotViewItem", "renderType": "render", "name": "render" } }] }] };
        Editor.CustomSlotViewUI = CustomSlotViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class DebugOperationUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.DebugOperationUI.uiView);
            }
        }
        DebugOperationUI.uiView = { "type": "View", "props": { "y": 20, "x": 840 }, "child": [{ "type": "Box", "props": {}, "child": [{ "type": "Image", "props": { "skin": "editor/debug_operaBg.png" } }, { "type": "Button", "props": { "y": 16, "x": 92, "var": "btn_break", "stateNum": 3, "skin": "editor/debug_continue.png" } }, { "type": "Button", "props": { "y": 16, "x": 29, "var": "btn_stop", "stateNum": 3, "skin": "editor/debug_stop.png" } }, { "type": "Button", "props": { "y": 16, "x": 146, "var": "btn_next", "stateNum": 3, "skin": "editor/debug_next.png" } }] }] };
        Editor.DebugOperationUI = DebugOperationUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class DebugStackViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.DebugStackViewItem", ui.DebugStackViewItem);
                super.createChildren();
                this.createView(ui.Editor.DebugStackViewUI.uiView);
            }
        }
        DebugStackViewUI.uiView = { "type": "View", "props": {}, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Image", "props": { "y": 48, "x": -1, "width": 1921, "skin": "editor/debug_two_bg.png", "sizeGrid": "5,5,5,5", "height": 188 } }, { "type": "Image", "props": { "y": 2, "x": 0, "width": 1920, "skin": "editor/debug_title_bg.png", "sizeGrid": "0,10,0,10" } }, { "type": "Clip", "props": { "y": -16, "x": 846, "var": "clip_upDown", "skin": "editor/debug_clip.png", "clipY": 2 } }, { "type": "Button", "props": { "y": 17, "x": 61, "width": 94, "var": "btn_stack", "stateNum": 3, "skin": "editor/debug_tabBtn.png", "sizeGrid": "10,50,10,50", "labelSize": 20, "labelPadding": "-3", "labelFont": "Microsoft YaHei", "labelColors": "#b5b5b5", "label": "Stack", "height": 36 } }, { "type": "Button", "props": { "y": 17, "x": 158, "width": 94, "var": "btn_logs", "stateNum": 3, "skin": "editor/debug_tabBtn.png", "sizeGrid": "10,50,10,50", "labelSize": 20, "labelPadding": "-3", "labelFont": "Microsoft YaHei", "labelColors": "#b5b5b5", "label": "Logs", "height": 36 } }, { "type": "List", "props": { "y": 49, "x": 0, "width": 1920, "var": "list_stack", "vScrollBarSkin": "editor/vscroll.png", "height": 186 }, "child": [{ "type": "DebugStackViewItem", "props": { "runtime": "ui.DebugStackViewItem", "renderType": "render", "name": "render" } }] }, { "type": "TextArea", "props": { "y": 48, "x": -1, "wordWrap": true, "width": 1920, "var": "txt_logs", "vScrollBarSkin": "editor/vscroll.png", "text": "teast eafe", "skin": "editor/debug_two_bg.png", "sizeGrid": "5,5,5,5", "padding": "5,5,10,10", "multiline": true, "leading": 8, "height": 188, "fontSize": 16, "font": "Microsoft YaHei", "editable": false, "color": "#b5b5b5" } }, { "type": "VScrollBar", "props": { "y": 49, "x": 1908, "width": 12, "var": "vsbar", "skin": "editor/vscroll.png", "height": 187 } }] }] };
        Editor.DebugStackViewUI = DebugStackViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class ContentMenuItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.ContentMenuItemUI.uiView);
                }
            }
            ContentMenuItemUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 399 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 399, "height": 43 }, "child": [{ "type": "Image", "props": { "y": 0, "x": -5, "width": 399, "var": "bg", "skin": "editor/titleBg2.png", "sizeGrid": "18,25,0,25", "height": 43 } }, { "type": "Clip", "props": { "y": 17, "x": 19, "var": "btn_switch", "skin": "editor/jiantou_2.png", "clipY": 2 } }, { "type": "Label", "props": { "y": 11, "x": 40, "var": "txt_name", "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }, { "type": "Button", "props": { "y": 12, "x": 285, "var": "btn_add", "stateNum": 3, "skin": "editor/var_add.png" } }] };
            Elements.ContentMenuItemUI = ContentMenuItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class CustomCreateViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.CustomCreateViewItemUI.uiView);
                }
            }
            CustomCreateViewItemUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 297, "mouseEnabled": true, "height": 26 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 297, "var": "img_over", "skin": "editor/treeSelectBg.png", "height": 26 } }, { "type": "Label", "props": { "y": 0, "x": 0, "width": 251, "var": "txt_name", "text": "label", "height": 26, "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "center" } }, { "type": "Button", "props": { "y": 6, "x": 272, "visible": false, "var": "btn_delete", "stateNum": 2, "skin": "editor/close_btn.png" } }] };
            Elements.CustomCreateViewItemUI = CustomCreateViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class CustomSlotViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.CustomSlotViewItemUI.uiView);
                }
            }
            CustomSlotViewItemUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 340, "height": 27 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 340, "height": 27 }, "child": [{ "type": "Button", "props": { "y": 0, "x": 251, "var": "btn_up", "skin": "editor/up.png", "sizeGrid": "0,0,0,0" } }, { "type": "TextInput", "props": { "y": 0, "x": 0, "width": 116, "var": "input_varValue", "type": "text", "skin": "editor/textinput.png", "padding": "-2", "height": 22, "fontSize": 18, "font": "Microsoft YaHei", "color": "#000000", "align": "left" } }, { "type": "ComboBox", "props": { "y": 0, "x": 119, "width": 125, "var": "cmb_types", "skin": "editor/combobox.png", "labels": "label1,label2", "labelSize": 18, "labelFont": "Microsoft YaHei", "labelColors": "#000000,#ffffff,#ffffff", "itemSize": 18, "height": 24 } }, { "type": "Button", "props": { "y": 0, "x": 279, "var": "btn_down", "skin": "editor/down.png", "sizeGrid": "0,0,0,0" } }, { "type": "Button", "props": { "y": 6, "x": 319, "var": "btn_delete", "stateNum": 2, "skin": "editor/close_btn.png", "sizeGrid": "0,0,0,0" } }] }] };
            Elements.CustomSlotViewItemUI = CustomSlotViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class DebugStackViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.DebugStackViewItemUI.uiView);
                }
            }
            DebugStackViewItemUI.uiView = { "type": "View", "props": {}, "child": [{ "type": "Image", "props": { "width": 1920, "var": "img_one", "skin": "editor/debug_one_bg.png", "sizeGrid": "5,5,5,5", "height": 23 } }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 1920, "var": "img_two", "skin": "editor/debug_two_bg.png", "sizeGrid": "5,5,5,5", "height": 23 } }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 1920, "var": "img_select", "skin": "editor/debug_select_bg.png", "sizeGrid": "5,5,5,5", "height": 23 } }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 1920, "var": "img_over", "skin": "editor/debug_over_bg.png", "sizeGrid": "5,5,5,5", "height": 23 } }, { "type": "Image", "props": { "y": 0, "x": 18, "var": "icon_cur", "skin": "editor/debug_cur.png" } }, { "type": "Image", "props": { "y": 2, "x": 39, "var": "icon_select", "skin": "editor/debug_select.png" } }, { "type": "Label", "props": { "y": 1, "x": 56, "var": "txt_nodeInfo", "text": "TestNodeName:Id", "fontSize": 16, "font": "Microsoft YaHei", "color": "#adadad" } }] };
            Elements.DebugStackViewItemUI = DebugStackViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class FileNavigatorViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.FileNavigatorViewItemUI.uiView);
                }
            }
            FileNavigatorViewItemUI.uiView = { "type": "View", "props": { "width": 835, "height": 37 }, "child": [{ "type": "Clip", "props": { "y": 0, "x": 6, "width": 830, "skin": "editor/fileClip.png", "name": "selectBox", "height": 37, "clipY": 2 } }, { "type": "Image", "props": { "y": 0, "x": 6, "width": 830, "visible": false, "var": "img_over", "skin": "editor/dangqian_over.png", "height": 37 } }, { "type": "Image", "props": { "y": 6, "x": 115, "var": "icon_dir", "skin": "editor/file_dir.png" } }, { "type": "Label", "props": { "y": 9, "x": 225, "var": "txt_name", "text": "File Name XXX", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Image", "props": { "y": 5, "x": 115, "var": "icon_file_over", "skin": "editor/file_over.png" } }, { "type": "Image", "props": { "y": 5, "x": 115, "var": "icon_file_normal", "skin": "editor/file_normal.png" } }] };
            Elements.FileNavigatorViewItemUI = FileNavigatorViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class GraphTabViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.GraphTabViewItemUI.uiView);
                }
            }
            GraphTabViewItemUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 173, "height": 36 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 173, "var": "img_down", "skin": "editor/ktab_down.png", "sizeGrid": "25,69,15,63", "height": 36 } }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 173, "var": "img_normal", "skin": "editor/ktab_normal.png", "sizeGrid": "17,60,14,65", "height": 36 } }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 173, "var": "img_over", "skin": "editor/ktab_over.png", "sizeGrid": "20,40,18,29", "height": 36 } }, { "type": "Label", "props": { "y": 5, "x": 18, "width": 125, "var": "txt_name", "text": "label", "padding": "-2", "overflow": "hidden", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "center" } }, { "type": "Button", "props": { "y": 10, "x": 148, "var": "btn_close", "stateNum": 2, "skin": "editor/close_btn.png" } }, { "type": "Label", "props": { "y": 7, "x": -2, "width": 24, "var": "txt_new", "text": "*", "height": 26, "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "center" } }] };
            Elements.GraphTabViewItemUI = GraphTabViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class MenuViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.MenuViewItemUI.uiView);
                }
            }
            MenuViewItemUI.uiView = { "type": "View", "props": { "width": 256, "height": 30 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 256, "visible": false, "var": "img_over", "skin": "editor/dangqian_over.png", "sizeGrid": "5,5,5,5", "height": 30 } }, { "type": "Label", "props": { "y": 5, "x": 0, "width": 256, "var": "txt_name", "valign": "middle", "text": "label", "padding": "-2", "height": 20, "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "center" } }] };
            Elements.MenuViewItemUI = MenuViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class NodePaletteItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.NodePaletteItemUI.uiView);
                }
            }
            NodePaletteItemUI.uiView = { "type": "View", "props": { "width": 306, "height": 20 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 306, "var": "img_over", "skin": "editor/treeSelectBg.png", "height": 20 } }, { "type": "Label", "props": { "y": 0, "x": 20, "var": "txt_name", "valign": "middle", "text": "label", "padding": "-1", "name": "label", "height": 20, "fontSize": 18, "font": "Microsoft YaHei", "color": "#758294" } }, { "type": "Clip", "props": { "y": 3, "x": 0, "var": "clip_arrow", "skin": "editor/clip_tree_arrow.png", "name": "arrow", "clipY": 2 } }, { "type": "Clip", "props": { "y": 5, "x": 0, "visible": false, "var": "img_node", "skin": "editor/nodeIcon.png", "clipX": 11 } }] };
            Elements.NodePaletteItemUI = NodePaletteItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class NodeViewUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.NodeViewUI.uiView);
                }
            }
            NodeViewUI.uiView = { "type": "View", "props": {}, "child": [{ "type": "Box", "props": { "y": -11, "x": -14, "var": "box_right" }, "child": [{ "type": "Image", "props": { "width": 497, "var": "img_select", "skin": "editor/nodeSelectBg.png", "sizeGrid": "87,78,75,78", "height": 304 } }, { "type": "Image", "props": { "width": 497, "var": "img_status", "skin": "editor/debug_status.png", "sizeGrid": "87,78,75,78", "height": 304 } }, { "type": "Image", "props": { "width": 497, "var": "img_old", "skin": "editor/debug_old.png", "sizeGrid": "87,78,75,78", "height": 304 } }, { "type": "Image", "props": { "y": 11, "x": 7, "width": 258, "var": "bg", "skin": "editor/nodeViewBg.png", "height": 283, "sizeGrid": "40,40,40,40" } }, { "type": "Image", "props": { "y": 11, "x": 14, "width": 243, "var": "img_title", "skin": "editor/0.png", "height": 47, "sizeGrid": "0,20,0,20" } }, { "type": "Label", "props": { "y": 16, "x": 34, "var": "txt_nodeName", "text": "Get Agent Speed", "fontSize": 14, "font": "Microsoft YaHei", "color": "#ffffff" } }, { "type": "Label", "props": { "y": 39, "x": 42, "var": "txt_category", "text": "Get Agent Speed", "fontSize": 10, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "left" } }, { "type": "CheckBox", "props": { "y": 11, "x": 14, "var": "check_exit", "stateNum": 3, "skin": "editor/flag.png" }, "child": [{ "type": "Label", "props": { "y": 0, "x": -28, "text": "Exit", "fontSize": 14, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }, { "type": "CheckBox", "props": { "y": 11, "x": 14, "var": "check_entry", "stateNum": 3, "skin": "editor/flag.png" }, "child": [{ "type": "Label", "props": { "y": 0, "x": 24, "text": "Entry", "fontSize": 14, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }, { "type": "CheckBox", "props": { "y": 19, "x": 14, "var": "cbx_debug", "stateNum": 3, "skin": "editor/debug_check.png" } }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 298, "var": "box_error", "height": 154 }, "child": [{ "type": "Image", "props": { "skin": "editor/nodeError.png" } }] }] };
            Elements.NodeViewUI = NodeViewUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class SlotInItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.SlotInItemUI.uiView);
                }
            }
            SlotInItemUI.uiView = { "type": "View", "props": { "height": 24 }, "child": [{ "type": "TextInput", "props": { "y": 1, "x": 0, "width": 100, "var": "input_slotValue", "valign": "middle", "skin": "editor/slotInputbg.png", "sizeGrid": "0,37,0,41", "padding": "-1", "height": 24, "fontSize": 14, "font": "Microsoft YaHei", "editable": true, "color": "#b5b5b5", "align": "center" } }, { "type": "Label", "props": { "x": 33, "var": "txt_slotName", "top": 2, "text": "In", "fontSize": 14, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Label", "props": { "x": 49, "var": "txt_type", "top": 5, "text": ":Number", "fontSize": 10, "color": "#b5b5b5" } }, { "type": "Button", "props": { "y": 4, "x": 13, "var": "btn_dataInput", "stateNum": 3, "skin": "editor/data.png" } }, { "type": "Button", "props": { "y": 4, "x": 13, "var": "btn_executionIn", "stateNum": 3, "skin": "editor/execution.png" } }] };
            Elements.SlotInItemUI = SlotInItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class SlotOutItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.SlotOutItemUI.uiView);
                }
            }
            SlotOutItemUI.uiView = { "type": "View", "props": { "height": 24 }, "child": [{ "type": "Button", "props": { "y": 4, "x": 78, "var": "btn_executionOut", "top": 4, "stateNum": 3, "skin": "editor/execution.png", "right": 13 } }, { "type": "Button", "props": { "y": 4, "x": 72, "var": "btn_dataOut", "top": 4, "stateNum": 3, "skin": "editor/data.png", "right": 13 } }, { "type": "Label", "props": { "x": -62, "var": "txt_type", "top": 5, "text": "Number:", "fontSize": 10, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Label", "props": { "y": 2, "x": 42, "var": "txt_slotName", "top": 2, "text": "Out", "right": 33, "fontSize": 14, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 100, "height": 24 } }] };
            Elements.SlotOutItemUI = SlotOutItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class SlotsViewUI extends View {
                constructor() { super(); }
                createChildren() {
                    View.regComponent("ui.SlotInItem", ui.SlotInItem);
                    View.regComponent("ui.SlotOutItem", ui.SlotOutItem);
                    super.createChildren();
                    this.createView(ui.Editor.Elements.SlotsViewUI.uiView);
                }
            }
            SlotsViewUI.uiView = { "type": "View", "props": { "width": 196, "height": 20 }, "child": [{ "type": "List", "props": { "y": 0, "var": "list_slotsIn", "spaceY": 20, "repeatX": 1, "left": 5 }, "child": [{ "type": "SlotInItem", "props": { "y": 0, "x": 0, "runtime": "ui.SlotInItem", "renderType": "render", "name": "render" } }] }, { "type": "List", "props": { "y": 0, "x": 171, "var": "list_slotsOut", "spaceY": 20, "repeatX": 1 }, "child": [{ "type": "SlotOutItem", "props": { "y": 0, "x": 0, "runtime": "ui.SlotOutItem", "renderType": "render", "name": "render" } }] }] };
            Elements.SlotsViewUI = SlotsViewUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class VariableCreateViewItemUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.VariableCreateViewItemUI.uiView);
                }
            }
            VariableCreateViewItemUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 297, "mouseEnabled": true, "height": 26 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 297, "var": "img_over", "skin": "editor/treeSelectBg.png", "height": 26 } }, { "type": "Label", "props": { "y": 0, "x": 0, "width": 251, "var": "txt_name", "text": "label", "height": 26, "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "center" } }, { "type": "Button", "props": { "y": 6, "x": 272, "visible": false, "var": "btn_delete", "stateNum": 2, "skin": "editor/close_btn.png" } }] };
            Elements.VariableCreateViewItemUI = VariableCreateViewItemUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        var Elements;
        (function (Elements) {
            class VariableViewUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ui.Editor.Elements.VariableViewUI.uiView);
                }
            }
            VariableViewUI.uiView = { "type": "View", "props": { "width": 127, "height": 101 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 127, "skin": "editor/rightBg.png", "sizeGrid": "20,20,20,20", "height": 101 } }, { "type": "Label", "props": { "y": 3, "x": 6, "width": 115, "var": "txt_varName", "text": "Variable1", "height": 21, "fontSize": 16, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "center" } }, { "type": "Button", "props": { "y": 55, "x": 11, "width": 105, "var": "btn_set", "stateNum": 1, "skin": "editor/cbslect_bg.png", "sizeGrid": "5,10,5,10", "labelColors": "#ffffff", "label": "SetVariable1", "height": 29 } }, { "type": "Button", "props": { "y": 25, "x": 11, "width": 105, "var": "btn_get", "stateNum": 1, "skin": "editor/cbslect_bg.png", "sizeGrid": "5,10,5,10", "labelColors": "#ffffff", "label": "GetVariable1", "height": 29 } }] }] };
            Elements.VariableViewUI = VariableViewUI;
        })(Elements = Editor.Elements || (Editor.Elements = {}));
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class FileNavigatorViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.FileNavigatorViewItem", ui.FileNavigatorViewItem);
                super.createChildren();
                this.createView(ui.Editor.FileNavigatorViewUI.uiView);
            }
        }
        FileNavigatorViewUI.uiView = { "type": "View", "props": { "width": 900, "height": 900 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 835, "height": 55 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 835, "skin": "editor/file_title_bg.png", "sizeGrid": "27,60,0,60", "height": 55 } }, { "type": "Label", "props": { "y": 12, "x": 41, "visible": false, "var": "txt_tile", "text": "Open file...", "fontSize": 24, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "Button", "props": { "y": 26, "x": 799, "var": "btn_close", "stateNum": 2, "skin": "editor/close_btn.png" } }, { "type": "Image", "props": { "y": 55, "x": 0, "width": 835, "skin": "editor/file_bottom_bg.png", "sizeGrid": "8,20,41,20", "height": 473 } }, { "type": "Image", "props": { "y": 55, "x": 0, "width": 835, "skin": "editor/file_content_bg.png", "sizeGrid": "20,20,20,20", "height": 381 } }, { "type": "Button", "props": { "y": 15, "x": 55, "var": "btn_return", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Back" } }, { "type": "List", "props": { "y": 55, "x": 0, "width": 829, "var": "list_files", "vScrollBarSkin": "editor/vscroll.png", "height": 379 }, "child": [{ "type": "FileNavigatorViewItem", "props": { "runtime": "ui.FileNavigatorViewItem", "renderType": "render", "name": "render" } }] }, { "type": "Label", "props": { "y": 462, "x": 25, "width": 100.751953125, "text": "File Name:", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5 " } }, { "type": "TextInput", "props": { "y": 457, "x": 133, "width": 401, "var": "input_path", "skin": "editor/input_bg.png", "padding": "-1", "height": 34, "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5", "align": "left", "sizeGrid": "10,10,10,10" } }, { "type": "Button", "props": { "y": 459, "x": 555, "var": "btn_openOrSave", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Open" } }, { "type": "Button", "props": { "y": 458, "x": 685, "var": "btn_cancel", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Cancel" } }, { "type": "Label", "props": { "y": 495, "x": 137, "width": 100.751953125, "var": "txt_error", "text": "error:file name is exist in other path", "height": 20, "fontSize": 14, "font": "Microsoft YaHei", "color": "#ff0000" } }] }, { "type": "Box", "props": { "y": 164, "x": 295, "visible": false, "var": "box_alert" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 281, "skin": "editor/file_title_bg.png", "sizeGrid": "27,60,0,60", "height": 145 } }, { "type": "Label", "props": { "y": 10, "x": 96, "width": 100.751953125, "text": "Waring!", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ff0000", "bold": true } }, { "type": "Label", "props": { "y": 42, "x": 41, "wordWrap": true, "width": 203, "text": "file is existed, continue to override the file?", "leading": 8, "height": 20, "fontSize": 16, "font": "Microsoft YaHei", "color": "#b5b5b5 " } }, { "type": "Button", "props": { "y": 101, "x": 39, "var": "btn_continue", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Continue" } }, { "type": "Button", "props": { "y": 101, "x": 151, "var": "btn_no", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Cancel" } }] }, { "type": "Box", "props": { "y": 168, "x": 284, "visible": false, "var": "box_dir" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 311, "skin": "editor/file_title_bg.png", "sizeGrid": "27,60,0,60", "height": 145 } }, { "type": "Label", "props": { "y": 6, "x": 84, "width": 100.751953125, "text": "New Directory", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#758294", "bold": true } }, { "type": "Label", "props": { "y": 56, "x": 17, "wordWrap": false, "width": 124, "text": "Diectory Name:", "leading": 8, "height": 20, "fontSize": 16, "font": "Microsoft YaHei", "color": "#b5b5b5 " } }, { "type": "Button", "props": { "y": 101, "x": 49, "var": "btn_ok", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Submit" } }, { "type": "Button", "props": { "y": 101, "x": 161, "var": "btn_cncl", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Cancel" } }, { "type": "TextInput", "props": { "y": 57, "x": 142, "width": 150, "var": "input_DirName", "skin": "editor/input_bg.png", "padding": "-1", "height": 22, "fontSize": 14, "font": "Microsoft YaHei", "color": "#ffffff", "align": "left", "sizeGrid": "10,10,10,10" } }] }] };
        Editor.FileNavigatorViewUI = FileNavigatorViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class GraphEditorViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.GraphEditorViewUI.uiView);
            }
        }
        GraphEditorViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Image", "props": { "var": "bg", "skin": "editor/editorBg.png" } }] };
        Editor.GraphEditorViewUI = GraphEditorViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class GraphsViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.GraphsViewUI.uiView);
            }
        }
        GraphsViewUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "child": [{ "type": "List", "props": { "y": 0, "x": 0, "var": "list_graphs", "spaceY": 5 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 168, "renderType": "render", "height": 12 }, "child": [{ "type": "Label", "props": { "underlineColor": "#010101", "underline": true, "name": "graphName", "color": "#030303" } }] }] }] };
        Editor.GraphsViewUI = GraphsViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class GraphTabItemCloseAlertUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.GraphTabItemCloseAlertUI.uiView);
            }
        }
        GraphTabItemCloseAlertUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 281, "height": 145 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "visible": true }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 281, "skin": "editor/file_title_bg.png", "sizeGrid": "27,60,0,60", "height": 145 } }, { "type": "Label", "props": { "y": 10, "x": 96, "width": 100.751953125, "text": "Waring!", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ff0000", "bold": true } }, { "type": "Label", "props": { "y": 42, "x": 41, "wordWrap": true, "width": 203, "text": "file is not saved, please to save the file?", "leading": 8, "height": 20, "fontSize": 16, "font": "Microsoft YaHei", "color": "#b5b5b5 " } }, { "type": "Button", "props": { "y": 101, "x": 39, "var": "btn_save", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Save" } }, { "type": "Button", "props": { "y": 101, "x": 151, "var": "btn_cancel", "stateNum": 3, "skin": "editor/file_return_btn.png", "labelSize": 18, "labelPadding": "-2", "labelFont": "Microsoft YaHei", "label": "Cancel" } }] }] };
        Editor.GraphTabItemCloseAlertUI = GraphTabItemCloseAlertUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class GraphTabViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.GraphTabViewItem", ui.GraphTabViewItem);
                super.createChildren();
                this.createView(ui.Editor.GraphTabViewUI.uiView);
            }
        }
        GraphTabViewUI.uiView = { "type": "View", "props": { "y": 60, "x": 305 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1620, "var": "bg", "skin": "editor/editor_bg.png", "sizeGrid": "5,5,5,5", "height": 45 } }, { "type": "List", "props": { "y": 9, "x": 12, "var": "list_menu", "spaceX": 5, "repeatY": 1 }, "child": [{ "type": "GraphTabViewItem", "props": { "runtime": "ui.GraphTabViewItem", "renderType": "render", "name": "render" } }] }, { "type": "Button", "props": { "y": 16, "x": 17, "var": "btn_add", "stateNum": 3, "skin": "editor/addFile.png" } }] };
        Editor.GraphTabViewUI = GraphTabViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class LeftContentViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.LeftContentViewUI.uiView);
            }
        }
        LeftContentViewUI.uiView = { "type": "View", "props": { "height": 900 }, "child": [{ "type": "Box", "props": { "y": 68, "x": 0 }, "child": [{ "type": "Image", "props": { "y": 35, "x": 0, "width": 304, "var": "bg", "skin": "editor/contentTileBg.png", "sizeGrid": "5,5,5,5", "height": 982 } }, { "type": "Image", "props": { "y": 33, "x": 0, "width": 304, "skin": "editor/jianbian.png", "sizeGrid": "0,5,0,5", "height": 38 } }] }, { "type": "Box", "props": { "y": 69, "x": 6 }, "child": [{ "type": "Image", "props": { "width": 195, "skin": "editor/contentTile.png", "sizeGrid": "0,40,0,40", "height": 35 } }, { "type": "Image", "props": { "y": 7, "x": 6, "skin": "editor/myGraph.png" } }, { "type": "Label", "props": { "y": 6, "x": 46, "text": "MyGraph", "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }] };
        Editor.LeftContentViewUI = LeftContentViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class LoginViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.LoginViewUI.uiView);
            }
        }
        LoginViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 1920, "height": 1080 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1920, "skin": "editor/dibu_bg.png", "sizeGrid": "5,5,5,5", "height": 1080 } }, { "type": "Box", "props": { "y": 427, "x": 734, "var": "boxIP" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "editor/shurukuang_bg.png", "sizeGrid": "10,60,10,60" } }, { "type": "Label", "props": { "y": 13, "x": 25, "text": "Server:", "fontSize": 20, "color": "#ffffff", "bold": true } }, { "type": "TextInput", "props": { "y": 11, "x": 120, "width": 257, "var": "inputIP", "promptColor": "#c0c0c0", "prompt": "172.16.1.100", "multiline": false, "height": 27, "fontSize": 24, "color": "#ffffff", "bold": false, "align": "center" } }] }, { "type": "Box", "props": { "y": 501, "x": 734 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "editor/shurukuang_bg.png", "sizeGrid": "10,60,10,60" } }, { "type": "Label", "props": { "y": 13, "x": 25, "text": "Name :", "fontSize": 20, "color": "#ffffff", "bold": true } }, { "type": "TextInput", "props": { "y": 10, "x": 120, "width": 257, "valign": "middle", "type": "text", "promptColor": "#c0c0c0", "prompt": "zhang san", "multiline": false, "leading": 5, "height": 27, "fontSize": 24, "color": "#ffffff", "bold": false, "align": "center" } }] }, { "type": "Box", "props": { "y": 578, "x": 734 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "editor/shurukuang_bg.png", "sizeGrid": "10,60,10,60" } }, { "type": "Label", "props": { "y": 13, "x": 25, "text": "Password:", "fontSize": 20, "color": "#ffffff", "bold": true } }, { "type": "TextInput", "props": { "y": 10, "x": 130, "width": 247, "valign": "middle", "type": "password", "text": "172.16.1.100", "multiline": false, "leading": 5, "height": 27, "fontSize": 24, "color": "#ffffff", "bold": false, "align": "center" } }] }, { "type": "Button", "props": { "y": 679, "x": 843, "var": "btn_login", "skin": "editor/login_btn.png", "labelSize": 24, "labelColors": "#ffffff", "labelBold": true, "label": "Login" } }, { "type": "Image", "props": { "y": 229, "x": 771, "skin": "editor/logo.png" } }] };
        Editor.LoginViewUI = LoginViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class MainWindowUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.MainWindowUI.uiView);
            }
        }
        MainWindowUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "renderType": "instance", "name": "MainWindow" }, "child": [{ "type": "Image", "props": { "y": 60, "x": 0, "width": 1920, "var": "bg", "skin": "editor/top_bg.png", "sizeGrid": "5,5,5,5", "height": 1020 } }, { "type": "Box", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Button", "props": { "y": 14, "x": 304, "var": "btn_file", "stateNum": 3, "skin": "editor/title_btn.png", "sizeGrid": "15,20,15,20", "name": "file", "labelPadding": "0", "labelColors": "#ffffff", "labelBold": true, "labelAlign": "center", "label": "File" } }, { "type": "Image", "props": { "y": 20, "x": 25, "skin": "editor/logo_small.png" } }, { "type": "Image", "props": { "y": 60, "x": 0, "width": 1920, "var": "img_last", "skin": "editor/yinying_bg.png", "mouseEnabled": false, "height": 16, "sizeGrid": "0,5,0,5" } }] }] };
        Editor.MainWindowUI = MainWindowUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class MenuViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.MenuViewItem", ui.MenuViewItem);
                super.createChildren();
                this.createView(ui.Editor.MenuViewUI.uiView);
            }
        }
        MenuViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 267, "height": 317 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 267, "var": "img_bg", "skin": "editor/xialacaidan_bg.png", "sizeGrid": "36,40,27,75", "height": 60 } }, { "type": "List", "props": { "y": 26, "x": 6, "width": 256, "var": "list_Items", "spaceY": 5, "height": 0 }, "child": [{ "type": "MenuViewItem", "props": { "y": 0, "x": 0, "runtime": "ui.MenuViewItem", "renderType": "render", "name": "render" } }] }] };
        Editor.MenuViewUI = MenuViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class NodPaletteUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.NodePaletteItem", ui.NodePaletteItem);
                super.createChildren();
                this.createView(ui.Editor.NodPaletteUI.uiView);
            }
        }
        NodPaletteUI.uiView = { "type": "View", "props": { "width": 306, "height": 350 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 300, "var": "background", "skin": "editor/treeBg.png", "sizeGrid": "5,5,5,5", "height": 329 } }, { "type": "Box", "props": { "y": 23, "x": 14, "var": "box_search" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 276, "skin": "editor/searchBg.png", "sizeGrid": "0,30,0,30", "height": 40 } }, { "type": "TextInput", "props": { "y": 10, "x": 38, "width": 202, "var": "input_key", "promptColor": "#c7c7cd", "prompt": "Search...", "height": 20, "fontSize": 16, "color": "#c7c7cd" } }, { "type": "Button", "props": { "y": 13, "x": 242, "var": "btn_close", "stateNum": 2, "skin": "editor/close_btn.png" } }, { "type": "Image", "props": { "y": 9, "x": 10, "skin": "editor/search_icon.png" } }] }, { "type": "Tree", "props": { "y": 81, "x": 0, "width": 295, "var": "tree_nodes", "spaceLeft": 20, "spaceBottom": 5, "scrollBarSkin": "editor/vscroll.png", "height": 249 }, "child": [{ "type": "NodePaletteItem", "props": { "runtime": "ui.NodePaletteItem", "renderType": "render", "name": "render" } }] }] };
        Editor.NodPaletteUI = NodPaletteUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class RightContentViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.RightContentViewUI.uiView);
            }
        }
        RightContentViewUI.uiView = { "type": "View", "props": { "x": 1530, "width": 389, "height": 900 }, "child": [{ "type": "Box", "props": { "y": 68, "x": 0, "width": 389 }, "child": [{ "type": "Image", "props": { "y": 35, "x": 0, "width": 389, "var": "bg", "skin": "editor/contentTileBg.png", "sizeGrid": "5,5,5,5" } }, { "type": "Image", "props": { "y": 33, "x": 0, "width": 389, "skin": "editor/jianbian.png", "sizeGrid": "0,5,0,5", "height": 38 } }] }, { "type": "Box", "props": { "y": 69, "x": 6 }, "child": [{ "type": "Image", "props": { "width": 195, "skin": "editor/contentTile.png", "sizeGrid": "0,40,0,40", "height": 35 } }, { "type": "Image", "props": { "y": 2, "x": 9, "skin": "editor/details.png" } }, { "type": "Label", "props": { "y": 6, "x": 46, "text": "Details", "fontSize": 20, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }] };
        Editor.RightContentViewUI = RightContentViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class VariableCreateViewUI extends View {
            constructor() { super(); }
            createChildren() {
                View.regComponent("ui.VariableCreateViewItem", ui.VariableCreateViewItem);
                super.createChildren();
                this.createView(ui.Editor.VariableCreateViewUI.uiView);
            }
        }
        VariableCreateViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 295 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 295, "var": "img_bg", "skin": "editor/varBg.png", "sizeGrid": "5,5,5,5", "height": 159 } }, { "type": "List", "props": { "y": 10, "x": 0, "width": 297, "var": "list_varibles", "spaceY": 3 }, "child": [{ "type": "VariableCreateViewItem", "props": { "runtime": "ui.VariableCreateViewItem", "renderType": "render", "name": "render" } }] }] };
        Editor.VariableCreateViewUI = VariableCreateViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class VariableDefaultValueViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.VariableDefaultValueViewUI.uiView);
            }
        }
        VariableDefaultValueViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 379, "height": 68 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 379, "var": "box_valueContent", "height": 68 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 379, "skin": "editor/dibu_bg.png", "height": 68 } }, { "type": "Box", "props": { "y": 21, "x": 28, "var": "txt_varName" }, "child": [{ "type": "TextInput", "props": { "y": 1, "x": 153, "width": 161, "var": "input_varValue", "type": "text", "skin": "editor/textinput.png", "padding": "-2", "height": 22, "fontSize": 16, "font": "Microsoft YaHei", "color": "#000000" } }, { "type": "Label", "props": { "text": "Variable Value:", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }] }] };
        Editor.VariableDefaultValueViewUI = VariableDefaultValueViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var Editor;
    (function (Editor) {
        class VariableSetViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.Editor.VariableSetViewUI.uiView);
            }
        }
        VariableSetViewUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 379, "height": 91 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 379, "var": "bg_varContent", "skin": "editor/dibu_bg.png", "height": 91 } }, { "type": "Box", "props": { "y": 46, "x": 37, "var": "combox_types" }, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "text": "Variable Type:", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }, { "type": "ComboBox", "props": { "y": 2, "x": 153, "var": "cbox_types", "skin": "editor/combobox.png", "labels": "label1,label2", "labelSize": 18, "labelFont": "Microsoft YaHei", "labelColors": "#000000,#ffffff,#ffffff", "itemSize": 18 } }] }, { "type": "Box", "props": { "y": 14, "x": 37 }, "child": [{ "type": "TextInput", "props": { "y": 1, "x": 153, "width": 161, "var": "input_varName", "type": "text", "skin": "editor/textinput.png", "padding": "-2", "height": 22, "fontSize": 16, "font": "Microsoft YaHei", "color": "#000000" } }, { "type": "Label", "props": { "text": "Variable Name:", "fontSize": 18, "font": "Microsoft YaHei", "color": "#b5b5b5" } }] }] };
        Editor.VariableSetViewUI = VariableSetViewUI;
    })(Editor = ui.Editor || (ui.Editor = {}));
})(ui || (ui = {}));
(function (ui) {
    var test;
    (function (test) {
        class TestPageUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ui.test.TestPageUI.uiView);
            }
        }
        TestPageUI.uiView = { "type": "View", "child": [{ "props": { "x": 0, "y": 0, "skin": "comp/bg.png", "sizeGrid": "30,4,4,4", "width": 600, "height": 400 }, "type": "Image" }, { "props": { "x": 41, "y": 56, "skin": "comp/button.png", "label": "点我赋值", "width": 150, "height": 37, "sizeGrid": "4,4,4,4", "var": "btn" }, "type": "Button" }, { "props": { "x": 401, "y": 56, "skin": "comp/clip_num.png", "clipX": 10, "var": "clip" }, "type": "Clip" }, { "props": { "x": 220, "y": 143, "skin": "comp/combobox.png", "labels": "select1,select2,selecte3", "selectedIndex": 1, "sizeGrid": "4,20,4,4", "width": 200, "height": 23, "var": "combobox" }, "type": "ComboBox" }, { "props": { "x": 220, "y": 96, "skin": "comp/tab.png", "labels": "tab1,tab2,tab3", "var": "tab" }, "type": "Tab" }, { "props": { "x": 259, "y": 223, "skin": "comp/vscroll.png", "height": 150 }, "type": "VScrollBar" }, { "props": { "x": 224, "y": 223, "skin": "comp/vslider.png", "height": 150 }, "type": "VSlider" }, { "type": "List", "child": [{ "type": "Box", "child": [{ "props": { "skin": "comp/label.png", "text": "this is a list", "x": 26, "y": 5, "width": 78, "height": 20, "fontSize": 14, "name": "label" }, "type": "Label" }, { "props": { "x": 0, "y": 2, "skin": "comp/clip_num.png", "clipX": 10, "name": "clip" }, "type": "Clip" }], "props": { "name": "render", "x": 0, "y": 0, "width": 112, "height": 30 } }], "props": { "x": 452, "y": 68, "width": 128, "height": 299, "vScrollBarSkin": "comp/vscroll.png", "repeatX": 1, "var": "list" } }, { "props": { "x": 563, "y": 4, "skin": "comp/btn_close.png", "name": "close" }, "type": "Button" }, { "props": { "x": 41, "y": 112, "skin": "comp/button.png", "label": "点我赋值", "width": 150, "height": 66, "sizeGrid": "4,4,4,4", "labelSize": 30, "labelBold": true, "var": "btn2" }, "type": "Button" }, { "props": { "x": 220, "y": 188, "skin": "comp/checkbox.png", "label": "checkBox1", "var": "check" }, "type": "CheckBox" }, { "props": { "x": 220, "y": 61, "skin": "comp/radiogroup.png", "labels": "radio1,radio2,radio3", "var": "radio" }, "type": "RadioGroup" }, { "type": "Panel", "child": [{ "props": { "skin": "comp/image.png" }, "type": "Image" }], "props": { "x": 299, "y": 223, "width": 127, "height": 150, "vScrollBarSkin": "comp/vscroll.png" } }, { "props": { "x": 326, "y": 188, "skin": "comp/checkbox.png", "label": "checkBox2", "labelColors": "#ff0000" }, "type": "CheckBox" }, { "type": "Box", "child": [{ "props": { "y": 70, "skin": "comp/progress.png", "width": 150, "height": 14, "sizeGrid": "4,4,4,4", "name": "progress" }, "type": "ProgressBar" }, { "props": { "y": 103, "skin": "comp/label.png", "text": "This is a Label", "width": 137, "height": 26, "fontSize": 20, "name": "label" }, "type": "Label" }, { "props": { "y": 148, "skin": "comp/textinput.png", "text": "textinput", "width": 150, "name": "input" }, "type": "TextInput" }, { "props": { "skin": "comp/hslider.png", "width": 150, "name": "slider" }, "type": "HSlider" }, { "props": { "y": 34, "skin": "comp/hscroll.png", "width": 150, "name": "scroll" }, "type": "HScrollBar" }], "props": { "x": 41, "y": 197, "var": "box" } }], "props": { "width": 600, "height": 400 } };
        test.TestPageUI = TestPageUI;
    })(test = ui.test || (ui.test = {}));
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map