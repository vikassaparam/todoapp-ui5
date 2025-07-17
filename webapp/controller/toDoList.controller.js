sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], (Controller, JSONModel, formatter, Filter, FilterOperator, Sorter ) => {
    "use strict";

    return Controller.extend("com.practise.todolist.todolist.controller.toDoList", {
        formatter : formatter,
        
        onInit() {
            // Initialize summary model
            const oSummaryModel = new JSONModel();
            this.getView().setModel(oSummaryModel, "summary");
            
            // Update summary when toDoItems model is available
            // Use a timeout to ensure the model is loaded from manifest
            setTimeout(() => {
                this.updateSummary();
            }, 100);
            
            // Subscribe to task added events from newTask controller
            const oEventBus = this.getOwnerComponent().getEventBus();
            oEventBus.subscribe("taskChannel", "taskAdded", this.updateSummary, this);
        },

        _formatDateToString(oDate) {
            // Format date to yyyy-MM-dd format to match JSON data
            const iYear = oDate.getFullYear();
            const iMonth = String(oDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const iDay = String(oDate.getDate()).padStart(2, '0');
            return `${iYear}-${iMonth}-${iDay}`;
        },

        updateSummary() {
            const oModel = this.getView().getModel("toDoItems");
            const aTasks = oModel.getData();
            
            if (aTasks && Array.isArray(aTasks)) {
                const iTotalTasks = aTasks.length;
                const iCompletedTasks = aTasks.filter(task => task.completed).length;
                const iPendingTasks = iTotalTasks - iCompletedTasks;
                
                const oSummaryModel = this.getView().getModel("summary");
                oSummaryModel.setData({
                    total: iTotalTasks,
                    pending: iPendingTasks,
                    completed: iCompletedTasks
                });
            }
        },

        onCloseDialog(){
            this.oDialog.close();
        },

        onUpdateTask(oEvent){
            // get dialog
            const oDialog = oEvent.getSource().getParent();
            // Get the dialog model with the current task data
            const oDialogModel = oDialog.getModel();
            const oTaskData = oDialogModel.getData().task;
            
            // // Get form controls to retrieve updated values
            const oForm = oDialog.getContent()[0].getContent(); // SimpleForm is the first content element
            
            // Extract values from form controls using Form's content
            const sTitle = oForm.find(control => control.getId().includes("titleInputForm")).getValue();
            const sDescription = oForm.find(control => control.getId().includes("descriptionTextForm")).getValue();
            const sPriority = oForm.find(control => control.getId().includes("priorityBoxForm")).getValue();
            const sCategory = oForm.find(control => control.getId().includes("categoryBoxForm")).getValue();
            const dDueDate = oForm.find(control => control.getId().includes("dueDateForm")).getDateValue();
            
            // Get the main toDoItems model
            const oMainModel = this.getView().getModel("toDoItems");
            const aTasks = oMainModel.getData();
            
            // Find the task in the main model using the task id
            const iTaskIndex = aTasks.findIndex(task => task.id === oTaskData.id);
            
            if (iTaskIndex !== -1) {
                // Update the task with new values
                aTasks[iTaskIndex].title = sTitle;
                aTasks[iTaskIndex].description = sDescription;
                aTasks[iTaskIndex].priority = sPriority;
                aTasks[iTaskIndex].category = sCategory;
                aTasks[iTaskIndex].dueDate = this._formatDateToString(dDueDate);
                
                // Update the model
                oMainModel.setData(aTasks);
                
                // Update summary
                this.updateSummary();
                
                // Show success message
                sap.m.MessageToast.show("Task updated successfully!");
            }
            
            this.oDialog.close();
        },

        onTaskStatusChange(oEvent) {
            // Update summary when checkbox status changes
            this.updateSummary();
        },

        onDeleteTask(oEvent){
            const index = oEvent.getSource().oPropagatedProperties.oBindingContexts.toDoItems.getPath().split("/").pop();
            const oModel = this.getView().getModel("toDoItems");
            const aTasks = oModel.getData();
            aTasks.splice(index, 1);
            oModel.setData(aTasks);
            this.updateSummary();
        },

        async onItemPress(oEvent){

            const sPath = oEvent.getSource().getBindingContextPath().split("/").pop();
            const oTask = this.getView().getModel("toDoItems").getData()[sPath];

            const oTaskModel = new JSONModel({ task : oTask });

            this.oDialog ??= await this.loadFragment({
                name: "com.practise.todolist.todolist.view.EditTask"
            });
            this.oDialog.setModel(oTaskModel);
            this.oDialog.open();
        },

        onCloseDialog(){
            this.oDialog.close();
        },

        async onFilter(oEvent) {
            this.oFilterDialog ??= await this.loadFragment({
                name: "com.practise.todolist.todolist.view.FilterDialog"
            });
            
            this.oFilterDialog.open();
        },

        onCloseFilterDialog() {
            if (this.oFilterDialog) {
                this.oFilterDialog.close();
            }
        },

        async onSort(oEvent) {
            this.oSortDialog ??= await this.loadFragment({
                name: "com.practise.todolist.todolist.view.SortDialog"
            });
            
            this.oSortDialog.open();
        },

        onCloseSortDialog() {
            if (this.oSortDialog) {
                this.oSortDialog.close();
            }
        },

        onApplyFilter(){

            // get status filter value
            const sStatusFilter = this.byId("statusFilterSegmentedButton").getSelectedKey();
            // get category filter value
            const aCategoryFilters = this.byId("categoryMultiSelect").getSelectedKeys();
            // get priority filter value
            const aPriorityFilters = this.byId("priorityMultiSelect").getSelectedKeys();
            // get date filter values
            const dFromDate = this.byId("fromDueDatePicker").getDateValue();
            const dToDate = this.byId("toDueDatePicker").getDateValue();
            const sDateFilter = this.byId("dateFilterSegmentedButton").getSelectedKey();

            // get item binding of list
            const oItems = this.byId("toDoList").getBinding("items");
            const aFilters = [];

            //apply status filter to the list items
            if(sStatusFilter!=null){
                switch(sStatusFilter){
                    case "showPending":
                        aFilters.push(new Filter({
                            path : "completed",
                            operator : FilterOperator.EQ,
                            value1 : false
                        }))
                        break;
                    case "showCompleted":
                        aFilters.push(new Filter({
                            path : "completed",
                            operator : FilterOperator.EQ,
                            value1 : true
                        }))
                }
            }

            // apply category filters to the list items
            if(aCategoryFilters && aCategoryFilters.length > 0){
                // Create individual filters for each selected category
                const aCategoryFilterArray = aCategoryFilters.map(sCategory => {
                    return new Filter({
                        path: "category",
                        operator: FilterOperator.EQ,
                        value1: sCategory
                    });
                });
                
                // Combine category filters with OR logic
                if(aCategoryFilterArray.length > 1) {
                    aFilters.push(new Filter({
                        filters: aCategoryFilterArray,
                        and: false // OR condition
                    }));
                } else {
                    aFilters.push(aCategoryFilterArray[0]);
                }
            }

            // apply priority filters to the list items
            if(aPriorityFilters && aPriorityFilters.length > 0){
                // Create individual filters for each selected priority
                const aPriorityFilterArray = aPriorityFilters.map(sPriority => {
                    return new Filter({
                        path: "priority",
                        operator: FilterOperator.EQ,
                        value1: sPriority
                    });
                });
                
                // Combine priority filters with OR logic
                if(aPriorityFilterArray.length > 1) {
                    aFilters.push(new Filter({
                        filters: aPriorityFilterArray,
                        and: false // OR condition
                    }));
                } else {
                    aFilters.push(aPriorityFilterArray[0]);
                }
            }

            // apply duedate filter to the list items
            if(dFromDate || dToDate){
                // Handle date range filtering
                if(dFromDate && dToDate) {
                    // Both dates selected - filter between range
                    const sFromDate = this._formatDateToString(dFromDate);
                    const sToDate = this._formatDateToString(dToDate);
                    
                    aFilters.push(new Filter({
                        path: 'dueDate',
                        operator: FilterOperator.BT, // Between
                        value1: sFromDate,
                        value2: sToDate
                    }));
                } else if(dFromDate) {
                    // Only from date selected
                    const sFromDate = this._formatDateToString(dFromDate);
                    aFilters.push(new Filter({
                        path: 'dueDate',
                        operator: FilterOperator.GE, // Greater than or equal
                        value1: sFromDate
                    }));
                } else if(dToDate) {
                    // Only to date selected
                    const sToDate = this._formatDateToString(dToDate);
                    aFilters.push(new Filter({
                        path: 'dueDate',
                        operator: FilterOperator.LE, // Less than or equal
                        value1: sToDate
                    }));
                }
            } else if(sDateFilter != null && sDateFilter !== ""){
                switch(sDateFilter){
                    case "today":
                        const sTodayDate = this._formatDateToString(new Date());
                        aFilters.push(new Filter({
                            path: 'dueDate',
                            operator: FilterOperator.EQ,
                            value1: sTodayDate
                        }));
                        break;
                    case "thisWeek":
                        const oToday = new Date();
                        const oStartOfWeek = new Date(oToday);
                        oStartOfWeek.setDate(oToday.getDate() - oToday.getDay()); // Start of week (Sunday)
                        const oEndOfWeek = new Date(oStartOfWeek);
                        oEndOfWeek.setDate(oStartOfWeek.getDate() + 6); // End of week (Saturday)
                        
                        aFilters.push(new Filter({
                            path: 'dueDate',
                            operator: FilterOperator.BT,
                            value1: this._formatDateToString(oStartOfWeek),
                            value2: this._formatDateToString(oEndOfWeek)
                        }));
                        break;
                    case "overdue":
                        aFilters.push(new Filter({
                            path: 'dueDate',
                            operator: FilterOperator.LT, // Less than today
                            value1: this._formatDateToString(new Date())
                        }));
                        break;
                }
            }

            oItems.filter(aFilters);

            this.oFilterDialog.close();
        },

        onResetFilters(){
            this.byId("statusFilterSegmentedButton").setSelectedKey("showAll");
            this.byId("categoryMultiSelect").setSelectedKeys([]);
            this.byId("priorityMultiSelect").setSelectedKeys([]);
            this.byId("fromDueDatePicker").setDateValue(null);
            this.byId("toDueDatePicker").setDateValue(null);
            this.byId("dateFilterSegmentedButton").setSelectedKey("allTime");
            // Reset all filters on the list
            const oItems = this.byId("toDoList").getBinding("items");
            oItems.filter([]); 
            this.oFilterDialog.close();
            this.updateSummary();
        },

        onApplySort() {
            const iSortBy = this.byId("sortByRadioButtonGroup").getSelectedIndex();
            let sSortBy = null;
            switch(iSortBy) {
                case 0:
                    sSortBy = "title";
                    break;
                case 1:
                    sSortBy = "dueDate";
                    break;
                case 2:
                    sSortBy = "priority";
                    break;
            }
            const sSortOrder = this.byId("sortOrderSegmentedButton").getSelectedKey();
            const oItems = this.byId("toDoList").getBinding("items");
            
            // Create sorters based on selected criteria
            const aSorters = [];
            if (sSortBy) {
                aSorters.push(new Sorter(sSortBy, sSortOrder === "desc"));
            }
            
            oItems.sort(aSorters);
            this.oSortDialog.close();
        },
    });
});