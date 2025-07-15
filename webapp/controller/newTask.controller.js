sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageBox, MessageToast) => {
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
            let message = "";
            const sTaskTitle = this.getView().byId("newTaskTitle").getValue();
            if(sTaskTitle ===null | sTaskTitle.length == 0)
                message = message + "Task title cannot be empty!";
            
            const dDueDate = this.getView().byId("newTaskDueDate").getDateValue();
            if (!dDueDate) {
                message += " Due date cannot be empty!";
            }else{
                const currentDate = new Date();
                currentDate.setHours(0,0,0,0);
                if(currentDate > dDueDate){
                    message += " Due date cannot be in the past!"
                }
            }

            if (message) {
                MessageBox.error(message);
            }else{
                // validations passed
                const oView = this.getView();
                const oDataModel = oView.getModel("toDoItems");
                const aTasks = oDataModel.getData();
                const sTaskDescription = oView.byId("newTaskDescription").getValue();
                const sTaskPriority = oView.byId("newTaskPriority").getProperty("value");
                const sTaskCategory = oView.byId("newTaskCategory").getProperty("value");
                const dDueDate = oView.byId("newTaskDueDate").getValue();
                aTasks.push({ title : sTaskTitle,
                              description : sTaskDescription,
                              priority : sTaskPriority,
                              category : sTaskCategory,
                              dueDate : dDueDate });
                oDataModel.setData(aTasks);
                MessageToast.show("Task has been added!");
                oView.byId("newTaskTitle").setValue("");
                oView.byId("newTaskDescription").setValue("");
                oView.byId("newTaskPriority").setSelectedItem(null);
                oView.byId("newTaskCategory").setSelectedItem(null);
                oView.byId("newTaskDueDate").setDateValue(null)
                
            }
        }
    });
});