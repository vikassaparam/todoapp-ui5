sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("com.practise.todolist.todolist.controller.newTask", {
        onInit() {
            // Models are already available from manifest.json
            // No need to create them manually
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
                const sDueDate = this._formatDateToString(dDueDate);
                aTasks.push({ id : this._generateNewId(aTasks),
                              title : sTaskTitle,
                              description : sTaskDescription,
                              completed: false,
                              priority : sTaskPriority,
                              category : sTaskCategory,
                              dueDate : sDueDate });
                oDataModel.setData(aTasks);
                MessageToast.show("Task has been added!");
                oView.byId("newTaskTitle").setValue("");
                oView.byId("newTaskDescription").setValue("");
                oView.byId("newTaskPriority").setSelectedItem(null);
                oView.byId("newTaskCategory").setSelectedItem(null);
                oView.byId("newTaskDueDate").setDateValue(null);
                    
                // Update the summary by calling the toDoList controller method
                this._updateSummaryInParent();
            }
        },

        _generateNewId(aTasks) {
            // Generate a unique ID that's higher than any existing ID
            if (!Array.isArray(aTasks) || aTasks.length === 0) {
                return 1; // If no tasks, start with ID 1
            }
            return aTasks.length + 1;
        },

        _updateSummaryInParent() {
            // Use event bus to notify the toDoList controller
            const oEventBus = this.getOwnerComponent().getEventBus();
            oEventBus.publish("taskChannel", "taskAdded", {});
        },

        _formatDateToString(oDate) {
            // Format date to yyyy-MM-dd format to match JSON data
            const iYear = oDate.getFullYear();
            const iMonth = String(oDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const iDay = String(oDate.getDate()).padStart(2, '0');
            return `${iYear}-${iMonth}-${iDay}`;
        },
    });
});