sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], (Controller, JSONModel, formatter) => {
    "use strict";

    return Controller.extend("com.practise.todolist.todolist.controller.toDoList", {
        formatter : formatter,
        // onInit() {
        //     const oModel = new JSONModel("../toDo.json", true);
        //     this.getView().setModel(oModel,"toDoItems");
        // }

        onDeleteTask(oEvent){
            const index = oEvent.getSource().oPropagatedProperties.oBindingContexts.toDoItems.getPath().split("/").pop();
            const oModel = this.getView().getModel("toDoItems");
            const aTasks = oModel.getData();
            aTasks.splice(index, 1);
            oModel.setData(aTasks);
        },

        onItemPress(){
            
        }
    });
});