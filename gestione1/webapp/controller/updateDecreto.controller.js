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
  
      return BaseController.extend("gestione1.controller.updateDecreto", {
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
      
      onModDIbozza: function (oEvent) {
        var that = this;
        var url = location.href
        var sUrl = url.split("/updateDecreto/")[1]
        var aValori = sUrl.split(",")

        var Amministrazione = aValori[0]
        var AreaFinanziaria = aValori[1]
        var ChiaveGiustificativo = aValori[2]
        var Ente = aValori[3]
        var Esercizio = aValori[4]
        var NumeroDecreto = aValori[5]
        var RegistratoBozza = aValori[6]
        var UfficioLiv1 = aValori[7]
        var UfficioLiv2 = aValori[8]
       
        
        var header = this.getView().getModel("temp").getData().DecretoImpegnoSet.oData
        for (var i = 0; i < header.length; i++) {
            if (header[i].Amministrazione == Amministrazione &&
                header[i].AreaFinanziaria == AreaFinanziaria &&
                header[i].ChiaveGiustificativo == ChiaveGiustificativo &&
                header[i].Ente == Ente &&
                header[i].Esercizio == Esercizio &&
                header[i].NumeroDecreto == NumeroDecreto &&
                header[i].RegistratoBozza == RegistratoBozza &&
                header[i].UfficioLiv1 == UfficioLiv1 &&
                header[i].UfficioLiv2 == UfficioLiv2) {
                var indice = i
                MessageBox.warning("Sei sicuro di voler modificare il Decreto?", {
                    title:"Attenzione",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            
                            // var oModel = that.getOwnerComponent().getModel("temp");
                            var oModel = that.getView().getModel();
                            

                            var path = oModel.createKey("/DecretoImpegnoSet", {
                                Amministrazione: header[indice].Amministrazione,
                                AreaFinanziaria: header[indice].AreaFinanziaria,
                                ChiaveGiustificativo: header[indice].ChiaveGiustificativo,
                                Ente: header[indice].Ente,
                                Esercizio: header[indice].Esercizio,
                                NumeroDecreto: header[indice].NumeroDecreto,
                                RegistratoBozza: header[indice].RegistratoBozza,
                                UfficioLiv1: header[indice].UfficioLiv1,
                                UfficioLiv2: header[indice].UfficioLiv2,
                            });
                             
                            
                                
                                var editDecreto = {
                                    TipologiaImpegno: that.getView().byId("TypeI").getSelectedKey(),
                                    DataDecreto: new Date(that.getView().byId("DataDE1").getValue()),
                                    NProtocolloAmm: that.getView().byId("numProtocolloAmma1").getValue(),
                                    DataProtocolloAmm: new Date(that.getView().byId("dataProtocolloAmm1").getValue()),
                                    ControlloCorteConti: that.getView().byId("CcorteConti").getSelected() === true ? '1' : '0'
                                };

                                var dataNuova = new Date(editDecreto.DataProtocolloAmm),
            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
            day = ("0" + dataNuova.getDate()).slice(-2);
           var nData= [dataNuova.getFullYear(), mnth, day].join("-");
           editDecreto.DataProtocolloAmm= new Date(nData)
           
           
           var newDate = new Date(editDecreto.DataDecreto),
           mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
           day = ("0" + newDate.getDate()).slice(-2);
          var nData= [newDate.getFullYear(), mnth, day].join("-");
          editDecreto.DataDecreto= new Date(nData)

                                oModel.update(path, editDecreto,  {
                                    success: function (data) {
                                        console.log("success");
                                        MessageBox.success("Operazione Eseguita con successo", {
                                            title:"Esito Operazione",
                                            actions: [sap.m.MessageBox.Action.OK],
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === sap.m.MessageBox.Action.OK) {
                                                    that.getOwnerComponent().getRouter().navTo("View1");
                                                    location.reload();
                                                }
                                            }
                                        })
                                    },
                                    error: function (e) {
                                        //console.log("error");
                                               MessageBox.error("Operazione non eseguita",{
                                            title : "Errore",
                                            actions: ["Chiudi"]
                                            })
                                }
                            });
                        
                        }
                    }
                });
                }
            }
        
    },
    
      });
      
    }
  );