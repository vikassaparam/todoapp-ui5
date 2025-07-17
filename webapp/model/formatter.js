sap.ui.define([],function(){

    "use strict";
    return {
        priorityState: function(sPriority){
            switch(sPriority){
                case "High":
                    return "Error";
                case "Medium":
                    return "Warning";
                case "Low":
                    return "Success";
                default:
                    return "Information";
            }
        },

        priorityIcon: function(sPriority){
            switch(sPriority){
                case "High":
                    return "sap-icon://high-priority";
                case "Medium":
                    return "sap-icon://warning";
                case "Low":
                    return "sap-icon://message-information";
                default:
                    return "sap-icon://hint";
            }
        },

        isTaskCompleted: function(bCompleted){
            return bCompleted ? "completedTask" : "";
        },

        isTaskCompletedVisible: function(bCompleted){
            return bCompleted;
        },

        getCompletedState: function(bCompleted){
            return bCompleted ? "completed" : "pending";
        },

        formatTaskTitle: function(sTitle, bCompleted){
            if (bCompleted) {
                return '<span style="text-decoration: line-through; color: grey; opacity: 0.7;">' + sTitle + '</span>';
            }
            return sTitle;
        },

        titleTaskValueState: function(sTitle){
            if(sTitle===null || sTitle.length == 0){
                return "Error"
            }
        },

        titleTaskValueStateText: function(sTitle){
            if(sTitle === null || sTitle.length == 0){
                return "Title cannot be empty!";
            }
        },

        dueDateValueStateText: function(sDueDate){
             if (!sDueDate) {
                return "Due date cannot be empty!";
            }else{
                const currentDate = new Date();
                currentDate.setHours(0,0,0,0);
                const dueDate = new Date(sDueDate);
                if(currentDate > dueDate){
                    return "Due date cannot be in the past!"
                }
            }
        },

        dueDateValueState: function(sDueDate){
            if (!sDueDate) {
                return "Error";
            }else{
                const currentDate = new Date();
                currentDate.setHours(0,0,0,0);
                const dueDate = new Date(sDueDate);
                if(currentDate > dueDate){
                    return "Error"
                }
            }
        }
    };
});