sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";

    return Controller.extend("com.practise.todolist.todolist.controller.newTask", {
        onInit() {
            const oModel = new JSONModel("../toDo.json", true);
            const oValueHelpModel = new JSONModel("../valueHelp.json");
            const oView = this.getView();
            oView.setModel(oModel, "toDolist");
            oView.setModel(oValueHelpModel, "valueHelp");
        },

        onAddTask(oEvent){
            const sTaskTitle = this.getView().byId("newTaskTitle").getValue();
            if(sTaskTitle ===null | sTaskTitle.length == 0)
                MessageToast.show("Task title cannot be empty");
        }
    });
});