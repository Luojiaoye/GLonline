/**
* 执行输出描述
* @author confiner
*/
var template;
(function (template) {
    var SlotType = core.SlotType;
    class DataInTemplate {
        constructor(config) {
            this.config = config;
            this.parse();
        }
        parse() {
            this._slotConfigs = this.config;
        }
        // 创建数据输入插槽
        createDataInSlots() {
            let slots = new Array();
            let slotTemplate = null;
            let slot = null;
            for (let i = 0; i < this._slotConfigs.length; ++i) {
                slotTemplate = new template.SlotTemplate(this._slotConfigs[i]);
                slot = slotTemplate.createSlot();
                slot.setType(SlotType.DataIn);
                slots.push(slot);
            }
            return slots;
        }
    }
    template.DataInTemplate = DataInTemplate;
})(template || (template = {}));
//# sourceMappingURL=DataInTemplate.js.map