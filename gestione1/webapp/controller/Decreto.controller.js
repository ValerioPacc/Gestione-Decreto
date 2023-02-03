sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "./BaseController",
        'sap/ui/export/Spreadsheet',
        "sap/ui/core/library"
    ],
    function(BaseController,Spreadsheet,CoreLibrary) {
      "use strict";
  
      return BaseController.extend("gestione1.controller.Decreto", {
        onInit() {

         

          
           // error: getItems(...)[1].setExpanded is not a function
          
        },
     
      
        navToRegistraIPE: function (oEvent) {
            this.getOwnerComponent().getRouter().navTo("registraIPE");
        },
        onBackButton: function () {
          this.getOwnerComponent().getRouter().navTo("View1");
      },
      
      });
      
    }
  );