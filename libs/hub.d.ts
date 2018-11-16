declare class client
{
    constructor(arg:string);

    add_event_listen(event:string, mothed:Function) : void;
    connect_server(url:string) : void;
    call_hub(module_name:string, func_name:string, args?:any):void;
    poll():void;
}

/**
     * @private
     * @author ...
     */
   declare class EventManager 
    {
        static getInstance():EventManager;
        Test():void;
    }  





