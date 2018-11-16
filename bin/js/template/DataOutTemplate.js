/**
* 执行输出描述
* @author confiner
*/
var template;
(function (template) {
    var SlotType = core.SlotType;
    class DataOutTemplate {
        constructor(config) {
            this.config = config;
            this.parse();
        }
        parse() {
            this._slotConfigs = this.config;
        }
        // 创建数据输出插槽
        createDataOutSlots() {
            let slots = new Array();
            let slotTemplate = null;
            let slot = null;
            for (let i = 0; i < this._slotConfigs.length; ++i) {
                slotTemplate = new template.SlotTemplate(this._slotConfigs[i]);
                slot = slotTemplate.createSlot();
                slot.setType(SlotType.DataOut);
                slots.push(slot);
            }
            return slots;
        }
    }
    template.DataOutTemplate = DataOutTemplate;
})(template || (template = {}));
//# sourceMappingURL=DataOutTemplate.js.map