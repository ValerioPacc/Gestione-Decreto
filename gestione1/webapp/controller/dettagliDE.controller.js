sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
        "./BaseController",
        "sap/m/MessageBox",
        //"sap/m/iconTabBar",
        

    ],
    function(BaseController, MessageBox, ) {
      "use strict";
  
      return BaseController.extend("gestione1.controller.dettagliDE", {
        onInit() {
          //this.getRouter().getRoute("iconTabBar").attachPatternMatched(this._onObjectMatched, this);
          
          // var open = iconTabBar.getItems()[1]; // retruning 2nd Item
          // open.setExpanded(true);
        
        },
        _onObjectMatched: function (oEvent) {
          this.getView().bindElement(
              "/DecretoImpegnoSet('Esercizio='" + oEvent.getParameters().arguments.campo +
              "',Amministrazione='" + oEvent.getParameters().arguments.campo1 +
              "',UfficioLiv1='" + oEvent.getParameters().arguments.campo2 +
              "',UfficioLiv2='" + oEvent.getParameters().arguments.campo3 +
              "',NumeroDecreto='" + oEvent.getParameters().arguments.campo4 +
              "',DataDecreto='" + oEvent.getParameters().arguments.campo5 + 
              "',Ragioneria='" + oEvent.getParameters().arguments.campo6 + 
              "',TipologiaImpegno='" + oEvent.getParameters().arguments.campo7 + 
              "',CodiceStato='" + oEvent.getParameters().arguments.campo8 + "')"
          );

      },

        onSelect: function (oEvent) {
          var key = oEvent.getParameters().key;
          if (key === "ListaIPE") {
              // var oProprietà = this.getView().getModel();
              // oProprietà.setProperty("/TableVisible", true)
              this.getView().byId("IconTabBar").destroyContent()

          }
        },

        onConfirmationCancelMessageBoxPress: function () {
          MessageBox.confirm("Vuoi cancellare il Decreto in provvisorio?", {
            actions: ["OK", "Annulla"],
            emphasizedAction: "Annulla",
            title:"Cancellazione",
            onClose: function (sAction) {
             
              if (sAction === "OK") {
                MessageBox.success("Decreto cancellato con successo");
              }
              else{
                sAction.close();
              }
            }
          })
        },

        navToRegistraIPE: function (oEvent) {
          this.getOwnerComponent().getRouter().navTo("registraIPE");
      },

      navToWizard: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo("wizard");
    },

        onBackButton: function () {
          this.getOwnerComponent().getRouter().navTo("View1");
      },
      });
      
    }
  );
  