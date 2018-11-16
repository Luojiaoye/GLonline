/**
* @author confiner
* @desc 事件类型
*/
var core;
(function (core) {
    class EventType {
    }
    EventType.LINE_START = "line_start"; // 开始画线
    EventType.LINE_END = "line_end"; // 结束画线
    EventType.NODE_DRAG_START = "node_drag_start"; // 拖拽節點開始
    EventType.NODE_DRAG_END = "node_drag_end"; // 拖拽節點結束	
    EventType.ADD_NODE = "add_node"; // 添加节点
    EventType.REMOVE_NODE = "remove_node"; // 移除节点
    EventType.NODES_READY = "nodes_ready"; // 节点描述准备完毕
    EventType.VARIABLES_READY = "variables_ready"; // 变量描述准备完毕
    EventType.REMOVE_CONNECTION = "remove_connection"; // 删除连接
    EventType.RELOAD_GRAPH = "reload_graph"; // 重新加载流图
    EventType.LOAD_GRAPH = "sync_grahp"; // 同步流图
    EventType.CLICK = "click"; // 点击事件
    EventType.OPEN_FILE = "open_file"; // 打开目录或者文件
    EventType.OPEN_NAVIGATOR = "open_navigator"; // 打开文件资源浏览器
    EventType.CLOSE_ALERT = "close_alert";
    EventType.CHANGE_TAB = "change_tab";
    EventType.ADD_TAB_ITEM = "add_tab_item";
    EventType.DELETE_TAB_ITEM = "delete_tab_item";
    EventType.UPDATE_TAB_ITEM_STATUS = "update_tab_item_status";
    EventType.SELECT_TAB_ITEM = "select_tab_item"; // 选中tab的item
    EventType.VARIABLE_DETAIL = "variable_detail";
    EventType.CUSTOM_DETAIL = "custom_detail";
    EventType.NODES_DETAIL = "nodes_detail";
    EventType.HIDE_DETAIL = "hide_detail";
    EventType.DELETE_SLOT = "delete_slot";
    EventType.CHANGE_SLOT_NAME = "change_slot_name";
    EventType.CHANGE_SLOT_TYPE = "change_slot_type";
    EventType.ADD_CUSTOM_NODE = "add_custom_node";
    EventType.CHANGE_CUSTOM_TYPE = "change_custom_type";
    EventType.ADD_VARIABLE_VIEW = "add_variable_view";
    EventType.DELETE_VARIABLE_VIEW = "delete_variable_view";
    EventType.ADD_VARIABLE_SET = "add_variable_set";
    EventType.ADD_VARIABLE_GET = "add_variable_get";
    EventType.CHANGE_GRAPH = "change_graph"; // 流图改变
    EventType.UPDATE_VIEW = "update_view"; // 更新视图
    EventType.RESIZE = "myResize";
    EventType.RESORT = "resort";
    EventType.DEBUG_OPERATION = "debug_operation"; // 调试操作
    EventType.DEBUG_RESULT = "debug_result"; // 调试返回结果
    EventType.DEBUG_ITEM_SELECT = "debug_item_select";
    EventType.Content_Menu_UPDATE = "content_menu_update";
    EventType.Reset_Texure = "reset_texure";
    core.EventType = EventType;
})(core || (core = {}));
//# sourceMappingURL=EventType.js.map