module.exports = function(RED) {

	function division_compareNode(config) {
		RED.nodes.createNode(this,config);
		this.compare_select = config.compare_select;
		this.numerator = config.numerator;
		this.denominator = config.denominator;
		this.maxValue = config.maxValue;
		this.minValue = config.minValue;
		var node = this;
		
		node.on('input', function(msg) {
			var _compare = {};
			var globalContext = node.context().global;
			var currentMode = globalContext.get("currentMode");
			var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            
			if (node.compare_select == "interval") _compare = { value: {">=": parseFloat(node.minValue), "<=": parseFloat(node.maxValue)} } 
			if (node.compare_select == "maxValue") _compare = { value: {">=": null, "<=": parseFloat(node.maxValue)} }
            if (node.compare_select == "minValue") _compare = { value: {">=": parseFloat(node.minValue), "<=": null} }
            
			var command =  {
				type: "processing_modular_V1_0",
				slot: 1,
				compare: _compare,
				method: "division_compare",
				numerator: node.numerator,
				denominator: node.denominator,
				get_output: {}
			};
			
			if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                }
            }
			globalContext.set("exportFile", file);
			
			node.send(msg);
		});
	}
	RED.nodes.registerType("division_compare", division_compareNode);
}