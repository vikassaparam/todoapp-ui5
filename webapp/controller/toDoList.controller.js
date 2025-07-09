sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], (Controller, JSONModel, formatter) => {
    "use strict";

    return Controller.extend("com.practise.todolist.todolist.controller.toDoList", {
        formatter : formatter,
        onInit() {
            const oModel = new JSONModel("../toDo.json", true);
            this.getView().setModel(oModel,"toDoItems");
        }
    });
});