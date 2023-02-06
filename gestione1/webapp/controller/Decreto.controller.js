sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "./BaseController",
        'sap/ui/export/Spreadsheet',
        "sap/ui/core/library",
        "sap/m/MessageBox"
    ],
    function(BaseController,Spreadsheet,CoreLibrary,MessageBox) {
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
      
    //   onRegDIbozza: function (oEvent) {
    //     var self = this;
    

    //     var N_es_gestione = this.getView().byId("TypeI1").getSelectedKey(); //header
    //     var N_Mese = this.getView().byId("es_decreto1").getSelectedKey(); //header
    //     var N_Tipologia = this.getView().byId("amministrazioneED1").getSelectedKey();  //position
    //     var N_Sottotipologia = this.getView().byId("UffApp1").getValue().mProperties.text;  //position
    //     //var N_CR = this.getView().byId("DataDE1").mProperties.value  //position
    //     var N_ImportoTot = this.getView().byId("IdnumProtocolloAmma").getValue().mProperties.text;  //header
    //     //var N_oggSpesa = this.getView().byId("dataProtocolloAmm1").getValue();  //header
    //     var N_esercizioPF = this.getView().byId("CcorteConti").getState();  //header
          

    //     MessageBox.warning("Sei sicuro di voler preimpostare il DI?", {
    //         actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
    //         emphasizedAction: MessageBox.Action.YES,
    //         onClose: function (oAction) {
    //             if (oAction === sap.m.MessageBox.Action.YES) {

    //                 var oDataModel = self.getOwnerComponent().getModel();

    //                 var deepEntity = {
    //                     Mandt: '', 
    //                     DecretoImpegnoSet: null,
                      
    //                 }
    //                 deepEntity.HeaderNISet = {
    //                     Esercizio: '2023',
    //                     Amministrazione: '000',
    //                     TipologiaImpegno: 'C',
    //                     DataDecreto: '',
    //                     NProtocolloAmm: '',
    //                     DataProtocolloAmm: '',
    //                     CodiceUfficio,
    //                     ControlloCorteConti
    //                 };

    //                 oDataModel.create("/DeepZNIEntitySet", deepEntity, {
    //                     success: function (result) {
    //                         console.log(result.Message)
    //                         console.log('success');

    //                     },
    //                     error: function (err) {
    //                         console.log(err);
    //                     },
    //                     async: true,  // execute async request to not stuck the main thread
    //                     urlParameters: {}  // send URL parameters if required 
    //                 });

    //                 MessageBox.success("Decreto Impegno creato correttamente", {
    //                     actions: [sap.m.MessageBox.Action.OK],
    //                     emphasizedAction: MessageBox.Action.OK,
    //                     onClose: function (oAction) {
    //                         if (oAction === sap.m.MessageBox.Action.OK) {
    //                             self.getOwnerComponent().getRouter().navTo("View1");
    //                         }
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // },
     
      // onBackMessageBoxPress: function (oEvent) {
      //   MessageBox.success("Registrazione Bozza Decreto d'Impegno", {
      //     actions: ["Continuare", "Indietro"],
      //     emphasizedAction: "Annulla",
      //     onClose: function (sAction) {
           
      //       if (sAction === "Indietro") {
      //         // this.getOwnerComponent().getRouter().navTo("View1");
      //       }
      //       else{
      //         sAction.close();
      //       }
      //     }
      //   })
      // },
    
      });
      
    }
  );