sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
        "./BaseController",
        'sap/ui/export/Spreadsheet',
        "sap/ui/core/library",
        "sap/m/MessageBox",
        'gestione1/model/DateFormatter'
    ],
    function(BaseController,Spreadsheet,CoreLibrary,MessageBox,DateFormatter) {
      "use strict";
  
      return BaseController.extend("gestione1.controller.Decreto", {
        formatter: DateFormatter,
        onInit() {
        //  var draft= this.getView().getModel("temp").getProperty("/draft");
        //  if (draft === "x") {
        //   oDataModel.read(sObjectPath, {
        //     success: function(data, oResponse){
        //         var oModelJson = new sap.ui.model.json.JSONModel();
        //         oModelJson.setData(data);
        //         self.getView().setModel(oModelJson,"DecretoImpegnoSet");
        //             self.HandleTabSelect("DecretoImpegnoSet");
        //         IconTabBar.setSelectedKey("DecretoImpegnoSet");
        //         self.getView().setBusy(false);
        //     },
        //     error: function(error){
        //         self.getView().setBusy(false);
        //     }
        // });
        //  }
         


          
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
    

        var N_tipo_impegno = this.getView().byId("TypeI").mProperties.value; 
        var N_es_decreto = this.getView().byId("es_decreto").mProperties.value; 
        var N_Amm = this.getView().byId("AmministrazioneED").mProperties.value;  
        var N_codiceUff = this.getView().byId("UffApp1").mProperties.value;  
        var N_Datade = this.getView().byId("DataDE1").mProperties.dateValue  
        var N_NprotAmm = this.getView().byId("numProtocolloAmma1").getValue();   
        var N_DataprotAmm = this.getView().byId("dataProtocolloAmm1").mProperties.dateValue  
        var N_CcConti = this.getView().byId("CcorteConti").getSelected();
        if (N_CcConti==true) 
        var B_CcConti = "1" 
        if (N_CcConti==false) 
        var B_CcConti = "0" 

        MessageBox.warning("Sei sicuro di voler preimpostare il DI?", {
            actions: ["Si", "No"],
            emphasizedAction: "Si",
            onClose: function (oAction) {
                if (oAction === "Si") {
                  var oDataModel = self.getOwnerComponent().getModel();
                 
                    var DecretoImpegnoSet = {
                      ChiaveGiustificativo: '12345',
                        AreaFinanziaria:'1234',
                        Ente:'0001',
                        RegistratoBozza:'B',
                        UfficioLiv1:'UFF',
                        UfficioLiv2:'UFF',
                        CodiceStato: '01',
                        Ragioneria: '0840',
                        TipologiaImpegno: N_tipo_impegno,
                        Esercizio: N_es_decreto,
                        Amministrazione: N_Amm,
                        DataDecreto: N_Datade,
                        NProtocolloAmm: N_NprotAmm,
                        DataProtocolloAmm: N_DataprotAmm,
                        CodiceUfficio: N_codiceUff,
                        ControlloCorteConti:B_CcConti
                     };

                     oDataModel.create("/DecretoImpegnoSet",DecretoImpegnoSet,{
                       success: function(result,response){ 
                        console.log('SUCCESS')
                        MessageBox.success("Decreto Impegno creato correttamente", {
                            actions: ["Si"],
                            emphasizedAction: "Si",
                            onClose: function (oAction) {
                                if (oAction === "Si") {
                                    self.getOwnerComponent().getRouter().navTo("View1")
                                    location.reload();
                                }
                            }
                        }) 
                    }, 

                        error: function(err){
                           console.log(err); 
                           MessageBox.error("Decreto Impegno non creato correttamente")
                          },
                            async: true, 
                             urlParameters: {}  });
                             

                    

                 
                }
            }
        })
    },
    
     
    //  checkFields: function (view) {
    //    var self = this,
    //    check = false;
      
  //       if(vie === "Anagrafica"){
  //         var oForm = self.__dialog.getContent()[0].getFormContainers()[0],
  //         oForm2 = self.__dialog.getContent()[1].getFormContainers()[0],
  //         sPaese = oForm.getFormElements()[0].getFields()[0].getValue() !== "" ? true : false,
  //         sPaeseD = oForm.getFormElements()[0].getFields()[1].getValue() !== "" ? true : false,
  //         sCatBen = oForm.getFormElements()[1].getFields()[0].getSelectedKey() !== "" ? true : false,
  //         sDocBen = oForm.getFormElements()[2].getFields()[0].getValue() !== "" ? true : false,
  //         sNome = oForm.getFormElements()[3].getFields()[0].getValue() !== "" ? true : false,
  //         sCogn = oForm.getFormElements()[4].getFields()[0].getValue() !== "" ? true : false,
  //         sVia = oForm.getFormElements()[5].getFields()[0].getValue() !== "" ? true : false,
  //         sCiv = oForm.getFormElements()[5].getFields()[1].getValue() !== "" ? true : false,
  //         sLoc = oForm.getFormElements()[6].getFields()[0].getValue() !== "" ? true : false,
  //         sReg = oForm.getFormElements()[6].getFields()[1].getValue() !== "" ? true : false,
  //         sRegD = oForm.getFormElements()[6].getFields()[2].getValue() !== "" ? true : false,
  //         sCap = oForm.getFormElements()[7].getFields()[0].getValue() !== "" ? true : false,
  //         sCF = oForm2.getFormElements()[0].getFields()[0].getValue() !== "" ? true : false;

  //         if (sPaese && sPaeseD && sCatBen && sDocBen && sNome && sCogn && sVia && sCiv 
  //           && sLoc && sReg && sRegD && sCap && sCF) {
  //             check = true;
  //         }

  //       }else{
  //         var ben = sap.ui.getCore().byId("RegBen").getValue() !== "" ? true : false,
  //         mod = sap.ui.getCore().byId("RegModPag").getSelectedKey() !== "" ? true : false,
  //         iban = sap.ui.getCore().byId("iban").getValue() !== "" ? true : false;

  //         if (ben && mod && iban) {
  //             check = true;
  //         }

  //       }
      

  //     return check;
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