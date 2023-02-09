sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
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
      
 


      onRegDIbozza: function (oEvent) {
        var self = this;
    

        var N_tipo_impegno = this.getView().byId("TypeI").getSelectedKey(); //header
        var N_es_decreto = this.getView().byId("es_decreto").getSelectedKey(); //header
        var N_Amm = this.getView().byId("AmministrazioneED").getSelectedKey();  //position
        var N_codiceUff = this.getView().byId("UffApp1").mProperties.text;  //position
        var N_Datade = this.getView().byId("DataDE1").mProperties.value  //position
        var N_NprotAmm = this.getView().byId("IdnumProtocolloAmma").mProperties.text;  //header
        var N_DataprotAmm = this.getView().byId("dataProtocolloAmm1").mProperties.value  //header
        var N_CcConti = this.getView().byId("CcorteConti").getSelected();  //header
          

        MessageBox.warning("Sei sicuro di voler preimpostare il DI?", {
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            emphasizedAction: sap.m.MessageBox.Action.YES,
            onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {

                  var oDataModel = self.getModel()

                    var deepEntity = {
                      ChiaveGiustificativo: '01', 
                        DecretoImpegnoSet: null,
                      
                    }
                    deepEntity.DecretoImpegnoSet = {
                      ChiaveGiustificativo: '01',
                      TipologiaImpegno: N_tipo_impegno,
                        Esercizio: N_es_decreto,
                        Amministrazione: N_Amm,
                        DataDecreto: N_Datade,
                        NProtocolloAmm: N_NprotAmm,
                        DataProtocolloAmm: N_DataprotAmm,
                        CodiceUfficio: N_codiceUff,
                        ControlloCorteConti:N_CcConti
                    };

                    oDataModel.create("/DeepDecretoEntitySet",deepEntity, {
                        success: function (result) {
                            console.log(result.Message)
                            console.log('success');

                        },
                        error: function (err) {
                            console.log(err);
                        },
                        async: true,  // execute async request to not stuck the main thread
                        urlParameters: {}  // send URL parameters if required 
                    });

                    MessageBox.success("Decreto Impegno creato correttamente", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                self.getOwnerComponent().getRouter().navTo("View1");
                            }
                        }
                    })
                }
            }
        })
    },
     
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