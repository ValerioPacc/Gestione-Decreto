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
     
      
        // navToRegistraIPE: function (oEvent) {
        //     this.getOwnerComponent().getRouter().navTo("registraIPE");
        // },
        onBackButton: function () {
          this.getOwnerComponent().getRouter().navTo("View1");
      },
      
 


      onRegDIbozza: function (oEvent) {
        var self = this;
    

        var N_tipo_impegno = this.getView().byId("TypeI").getSelectedKey(); 
        var N_es_decreto = this.getView().byId("es_decreto").getSelectedKey(); 
        var N_Amm = this.getView().byId("AmministrazioneED").getSelectedKey();  
        var N_codiceUff = this.getView().byId("UffApp1").mProperties.text;  
        var N_Datade = this.getView().byId("DataDE1").mProperties.dateValue  
        var N_NprotAmm = this.getView().byId("IdnumProtocolloAmma").mProperties.text;  
        var N_DataprotAmm = this.getView().byId("dataProtocolloAmm1").mProperties.dateValue  
        var N_CcConti = this.getView().byId("CcorteConti").getSelected();
        if (N_CcConti==true) 
        var B_CcConti = "1" 
        if (N_CcConti==false) 
        var B_CcConti = "0" 

        MessageBox.warning("Sei sicuro di voler preimpostare il DI?", {
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            emphasizedAction: sap.m.MessageBox.Action.YES,
            onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  var oDataModel = self.getOwnerComponent().getModel();
                  var entity = {
                     ChiaveGiustificativo: '12345', 
                     DecretoImpegnoSet:{},
                      IpeEntitySet: []
                     };
                    entity.DecretoImpegnoSet = {
                      ChiaveGiustificativo: '12345',
                        AreaFinanziaria:'1234',
                        Ente:'0000',
                        RegistratoBozza:'B',
                        UfficioLiv1:'UFF',
                        UfficioLiv2:'UFF',
                        CodiceStato: '01',
                        TipologiaImpegno: N_tipo_impegno,
                        Esercizio: N_es_decreto,
                        Amministrazione: N_Amm,
                        DataDecreto: N_Datade,
                        NProtocolloAmm: N_NprotAmm,
                        DataProtocolloAmm: N_DataprotAmm,
                        CodiceUfficio: N_codiceUff,
                        ControlloCorteConti:B_CcConti
                     };

                     oDataModel.create("/DeepEntitySet", entity,{
                       success: function(result){ 
                        console.log('SUCCESS') }, 
                        error: function(err){
                           console.log(err);  
                          },
                            async: true, 
                             urlParameters: {}  });

                    // var deepEntity = {
                    //   ChiaveGiustificativo: '123324235', 
                    //     DecretoImpegnoSet: null,
                    //     IpeEntitySet: []
                      
                    // }
                    // deepEntity.DecretoImpegnoSet = {
                    //   ChiaveGiustificativo: '123324235',
                    //   AreaFinanziaria:'1234',
                    //   Ente:'0000',
                    //   RegistratoBozza:'1',
                    //   UfficioLiv1:'UFF',
                    //   UfficioLiv2:'UFF',
                    //   TipologiaImpegno: N_tipo_impegno,
                    //   Esercizio: N_es_decreto,
                    //   Amministrazione: N_Amm,
                    //   DataDecreto: N_Datade,
                    //   NProtocolloAmm: N_NprotAmm,
                    //   DataProtocolloAmm: N_DataprotAmm,
                    //   CodiceUfficio: N_codiceUff,
                    //   ControlloCorteConti:B_CcConti
                    // };

                    // oDataModel.create("/DeepEntitySet",deepEntity, {
                    //     success: function (result) {
                    //         console.log(result.Message)
                    //         console.log('success');

                    //     },
                    //     error: function (err) {
                    //         console.log(err);
                    //     },
                    //     async: true,  // execute async request to not stuck the main thread
                    //     urlParameters: {}  // send URL parameters if required 
                    // });

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