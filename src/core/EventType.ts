/**
* @author confiner
* @desc 事件类型
*/
module core{
	export class EventType
	{
		static readonly LINE_START:string = "line_start";	// 开始画线
		static readonly LINE_END:string = "line_end";	// 结束画线
		static readonly NODE_DRAG_START:string = "node_drag_start";	// 拖拽節點開始
		static readonly NODE_DRAG_END:string = "node_drag_end";		// 拖拽節點結束	
		static readonly ADD_NODE:string = "add_node";	// 添加节点
		static readonly REMOVE_NODE:string = "remove_node";	// 移除节点
		static readonly NODES_READY:string = "nodes_ready"; // 节点描述准备完毕
		static readonly VARIABLES_READY:string = "variables_ready"; // 变量描述准备完毕
		static readonly REMOVE_CONNECTION:string = "remove_connection"; // 删除连接
		static readonly RELOAD_GRAPH:string = "reload_graph";	// 重新加载流图
		static readonly LOAD_GRAPH:string = "sync_grahp";	// 同步流图
		static readonly CLICK:string = "click";	// 点击事件
		static readonly OPEN_FILE:string = "open_file";	// 打开目录或者文件
		static readonly OPEN_NAVIGATOR:string = "open_navigator";	// 打开文件资源浏览器
		static readonly CLOSE_ALERT:string = "close_alert";
		static readonly CHANGE_TAB:string = "change_tab";
		static readonly ADD_TAB_ITEM:string = "add_tab_item";
		static readonly DELETE_TAB_ITEM:string = "delete_tab_item";
		static readonly UPDATE_TAB_ITEM_STATUS:string = "update_tab_item_status";

		static readonly SELECT_TAB_ITEM:string = "select_tab_item";	// 选中tab的item

		static readonly VARIABLE_DETAIL:string = "variable_detail";
		static readonly CUSTOM_DETAIL:string = "custom_detail";
		static readonly NODES_DETAIL:string = "nodes_detail";
		static readonly HIDE_DETAIL:string = "hide_detail";

		static readonly DELETE_SLOT:string = "delete_slot";
		static readonly CHANGE_SLOT_NAME:string = "change_slot_name";
		static readonly CHANGE_SLOT_TYPE:string = "change_slot_type";
		static readonly ADD_CUSTOM_NODE:string = "add_custom_node"; 
		static readonly CHANGE_CUSTOM_TYPE:string = "change_custom_type"; 

		static readonly ADD_VARIABLE_VIEW:string = "add_variable_view";
		static readonly DELETE_VARIABLE_VIEW:string = "delete_variable_view";
		static readonly ADD_VARIABLE_SET:string = "add_variable_set";
		static readonly ADD_VARIABLE_GET:string = "add_variable_get";

		static readonly CHANGE_GRAPH:string = "change_graph";	// 流图改变

		static readonly UPDATE_VIEW:string = "update_view"; // 更新视图

		static readonly RESIZE:string = "myResize";
		static readonly RESORT:string = "resort";

		static readonly DEBUG_OPERATION:string = "debug_operation"; // 调试操作
		static readonly DEBUG_RESULT:string = "debug_result";	// 调试返回结果

		static readonly DEBUG_ITEM_SELECT:string = "debug_item_select";

		static readonly Content_Menu_UPDATE:string = "content_menu_update";

		static readonly Reset_Texure:string = "reset_texure";
 	}
}