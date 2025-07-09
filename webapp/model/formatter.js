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
        }
    };
});