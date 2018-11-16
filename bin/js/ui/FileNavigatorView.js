/**
* 文件管理器导航
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var MenuType = core.MenuType;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    var GraphManager = managers.GraphManager;
    var GraphTabItemData = model.GraphTabItemData;
    class FileNavigatorView extends ui.Editor.FileNavigatorViewUI {
        constructor() {
            super();
            this.init();
        }
        setData(data) {
            this.input_path.text = "";
            this.data = data;
            this.update();
        }
        update(inner = false) {
            if (!this.data || !this.data.directory)
                return;
            this.txt_error.visible = false;
            this.box_alert.visible = false;
            this.box_dir.visible = false;
            this.btn_return.disabled = !this.data.directory.owner;
            if (this.isSearching) {
                if (this.data.directory.matchFiles) {
                    this.list_files.repeatY = this.data.directory.matchFiles.length;
                    this.list_files.array = this.data.directory.matchFiles;
                }
            }
            else {
                if (this.data.directory.files) {
                    this.list_files.repeatY = this.data.directory.files.length;
                    this.list_files.array = this.data.directory.files;
                }
            }
            if (this.data.type == MenuType.Open)
                this.btn_openOrSave.label = "Open";
            else if (this.data.type == MenuType.New)
                this.btn_openOrSave.label = "New";
            else if (this.data.type == MenuType.Save)
                this.btn_openOrSave.label = "Save";
            if (this.data.type == MenuType.Save && !inner)
                this.input_path.text = GraphManager.getInstance().getCurrent().name;
        }
        init() {
            this.name = "FileNavigatorView";
            this.list_files.renderHandler = new Handler(this, this.onRenderHandler);
            this.btn_return.on(Event.CLICK, this, this.onReturnHandler);
            this.btn_close.on(Event.CLICK, this, this.onCloseHandler);
            this.btn_openOrSave.on(Event.CLICK, this, this.onOpenOrSaveHandler);
            this.btn_cancel.on(Event.CLICK, this, this.onCloseHandler);
            this.btn_continue.on(Event.CLICK, this, this.onContinueHandler);
            this.btn_no.on(Event.CLICK, this, this.onNoHandler);
            this.btn_cncl.on(Event.CLICK, this, this.onCnClHandler);
            this.btn_ok.on(Event.CLICK, this, this.onOkHandler);
            this.on(Event.RIGHT_CLICK, this, this.onRightClickHandler);
            this.input_path.on(Event.INPUT, this, this.onInputHandler);
            EventManager.getInstance().on(EventType.OPEN_FILE, this, this.onOpenFileHandler);
        }
        onInputHandler(evt) {
            let partten = this.input_path.text.trim();
            if (partten) {
                this.data.directory.getMatchFiles(partten);
                this.isSearching = true;
            }
            else {
                this.isSearching = false;
            }
            this.update(true);
        }
        onRightClickHandler(evt) {
            if (evt.currentTarget.name == "FileNavigatorView") {
                let pos = new Laya.Point(evt.stageX, evt.stageY);
                pos = this.globalToLocal(pos);
                this.box_dir.visible = true;
                this.input_DirName.text = "";
                this.box_dir.pos(pos.x, pos.y);
            }
        }
        onOkHandler(evt) {
            if (evt.currentTarget == this.btn_ok) {
                let dirName = this.input_DirName.text.trim();
                if (!dirName)
                    return;
                // 创建新文件夹
                let dirFile = this.data.directory.createDir();
                if (dirFile) {
                    dirFile.name = dirName;
                    this.setData(this.data);
                    this.box_dir.visible = false;
                }
            }
        }
        onContinueHandler(evt) {
            this.box_alert.visible = false;
            this.visible = false;
            let graph = GraphManager.getInstance().getCurrent();
            GraphManager.getInstance().save(graph);
            EventManager.getInstance().event(EventType.UPDATE_TAB_ITEM_STATUS, [graph.name, graph.name, false]);
            let item = new model.GraphTabItemData();
            item.name = graph.name;
            EventManager.getInstance().event(EventType.DELETE_TAB_ITEM, [item]);
        }
        onNoHandler(evt) {
            this.box_alert.visible = false;
        }
        onCnClHandler(evt) {
            this.box_dir.visible = false;
        }
        onRenderHandler(item, index) {
            let fileInfo = item.dataSource;
            item.setData(fileInfo);
        }
        onOpenFileHandler(id, isDir) {
            let fileInfo = GraphManager.getInstance().getDirectory(id);
            if (!fileInfo) {
                console.error("error: not exist the file or directory!");
                return;
            }
            if (isDir) {
                this.data.directory = fileInfo;
                this.setData(this.data);
            }
            else {
                this.input_path.text = fileInfo.name;
            }
        }
        onOpenOrSaveHandler(evt) {
            switch (this.data.type) {
                case MenuType.Save:
                    let name = this.input_path.text.trim();
                    if (name == "") {
                        this.txt_error.visible = true;
                        this.txt_error.text = "error: file name must not empty!";
                    }
                    else {
                        let exist = GraphManager.getInstance().exist(name);
                        this.box_alert.visible = exist;
                        if (!exist) {
                            // 取名保存
                            let graph = GraphManager.getInstance().getCurrent();
                            EventManager.getInstance().event(EventType.UPDATE_TAB_ITEM_STATUS, [GraphManager.getInstance().getCurrent().name, name, false]);
                            GraphManager.getInstance().changeCurrentName(name);
                            GraphManager.getInstance().save(graph);
                            this.visible = false;
                        }
                    }
                    break;
                case MenuType.Open:
                    let fileName = this.input_path.text.trim();
                    if (fileName == "")
                        return;
                    let data = new GraphTabItemData();
                    data.name = fileName;
                    data.cache = false;
                    EventManager.getInstance().event(EventType.ADD_TAB_ITEM, [data]);
                    this.visible = false;
                    break;
            }
        }
        onCloseHandler(evt) {
            this.visible = false;
        }
        onReturnHandler(evt) {
            this.data.directory = GraphManager.getInstance().getDirectory(this.data.directory.owner);
            this.setData(this.data);
        }
    }
    ui.FileNavigatorView = FileNavigatorView;
})(ui || (ui = {}));
//# sourceMappingURL=FileNavigatorView.js.map