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
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("updateDecreto").attachPatternMatched(this._onObjectMatched, this);
            this.callEsercizioEntity()
            this.callEsercizioDeEntity()
            
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
      callEsercizioDeEntity: function () {
        var that = this;
        var TipImp=that.getView().byId("TypeI").getValue().split(":")
        var oMdl = new sap.ui.model.json.JSONModel();
        this.getOwnerComponent().getModel().read("/EsercizioDecretoSet", {
            filters: [],
            urlParameters: {"TipoImpegno": TipImp[0]},
            success: function (data) {
                oMdl.setData(data.results);
                that.getView().getModel("temp").setProperty('/EsercizioDecretoSet', data.results)
                //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
            },
            error: function (error) {
                //that.getView().getModel("temp").setProperty(sProperty,[]);
                //that.destroyBusyDialog();
                var e = error;
            }
        });


    },

      callEsercizioEntity: function () {
        var that = this;
        var oMdl = new sap.ui.model.json.JSONModel();
        this.getOwnerComponent().getModel().read("/FiltroEsercizioSet", {
            filters: [],
            urlParameters: "",
            success: function (data) {
                oMdl.setData(data.results);
                that.getView().getModel("temp").setProperty('/FiltroEsercizioSet', data.results)
                //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
            },
            error: function (error) {
                //that.getView().getModel("temp").setProperty(sProperty,[]);
                //that.destroyBusyDialog();
                var e = error;
            }
        });


    },

    _onObjectMatched: function (oEvent) {

        var self = this;
        var oDataModel = self.getOwnerComponent().getModel();
        var path = oDataModel.createKey("/DecretoImpegnoSet", {
            Amministrazione: oEvent.getParameters().arguments.campo,
            AreaFinanziaria: oEvent.getParameters().arguments.campo1,
            ChiaveGiustificativo: oEvent.getParameters().arguments.campo2,
            Ente: oEvent.getParameters().arguments.campo3,
            Esercizio: oEvent.getParameters().arguments.campo4,
            NumeroDecreto: oEvent.getParameters().arguments.campo5,
            RegistratoBozza: oEvent.getParameters().arguments.campo6,
            UfficioLiv1: oEvent.getParameters().arguments.campo7,
            UfficioLiv2: oEvent.getParameters().arguments.campo8,
        });

        
        //oDataModel.metadataLoaded().then( function() { 
           oDataModel.read(path, {
             success: function(data, oResponse){
                 self.getView().getModel("temp").setProperty('/SelectedDecree', data); 
                 
                 
                },
                 error: function(error){
                var e = error;
            }
        });
    //});

        
        
    },

    onBackButton: function () {
        window.history.go(-1);
        //this.getOwnerComponent().getRouter().navTo("DettagliDE");
        
    },
      
      onModDIbozza: function (oEvent) {
        var that = this
        var data = that.getView().getModel("temp").oData.SelectedDecree    
        // var url = location.href
        // var sUrl = url.split("/dettagliDE/")[1]
        // var aValori = sUrl.split(",")

        var Amministrazione = data.Amministrazione
        var AreaFinanziaria = data.AreaFinanziaria
        var ChiaveGiustificativo = data.ChiaveGiustificativo
        var Ente = data.Ente
        var Esercizio = data.Esercizio
        var NumeroDecreto = data.NumeroDecreto
        var RegistratoBozza = data.RegistratoBozza
        var UfficioLiv1 = data.UfficioLiv1
        var UfficioLiv2 = data.UfficioLiv2
       
        
        // var header = this.getView().getModel("temp").getData().DecretoImpegnoSet.oData
        // for (var i = 0; i < header.length; i++) {
            if (data.Amministrazione == Amministrazione &&
                data.AreaFinanziaria == AreaFinanziaria &&
                data.ChiaveGiustificativo == ChiaveGiustificativo &&
                data.Ente == Ente &&
                data.Esercizio == Esercizio &&
                data.NumeroDecreto == NumeroDecreto &&
                data.RegistratoBozza == RegistratoBozza &&
                data.UfficioLiv1 == UfficioLiv1 &&
                data.UfficioLiv2 == UfficioLiv2) {
                MessageBox.warning("Sei sicuro di voler modificare il Decreto?", {
                    title:"Attenzione",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            
                            // var oModel = that.getOwnerComponent().getModel("temp");
                            var oModel = that.getView().getModel();
                            

                            var path = oModel.createKey("/DecretoImpegnoSet", {
                                Amministrazione: data.Amministrazione,
                                AreaFinanziaria: data.AreaFinanziaria,
                                ChiaveGiustificativo: data.ChiaveGiustificativo,
                                Ente: data.Ente,
                                Esercizio: data.Esercizio,
                                NumeroDecreto: data.NumeroDecreto,
                                RegistratoBozza: data.RegistratoBozza,
                                UfficioLiv1: data.UfficioLiv1,
                                UfficioLiv2: data.UfficioLiv2,
                            });
                             
        //                     var dataNuova = new Date(data.DataProtocolloAmm),
        //                      mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
        //                      day = ("0" + dataNuova.getDate()).slice(-2);
        //                     var nData = [dataNuova.getFullYear(), mnth, day].join("-");
        //                     var nDate = nData.split("-").reverse().join(".");
        //    data.DataProtocolloAmm= new Date(nDate)
           
           
        //    var newDate = new Date(data.DataDecreto),
        //    mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
        //    day = ("0" + newDate.getDate()).slice(-2);
        //   var nData1= [newDate.getFullYear(), mnth, day].join("-");
        //   var nDate1 = nData1.split("-").reverse().join(".");
        //   data.DataDecreto= new Date(nDate1)
                                
                                var editDecreto = {
                                    TipologiaImpegno: that.getView().byId("TypeI").getSelectedKey(),
                                    DataDecreto: that.getView().byId("DataDE1").getDateValue(),
                                    NProtocolloAmm: that.getView().byId("numProtocolloAmma1").getValue(),
                                    DataProtocolloAmm: that.getView().byId("dataProtocolloAmm1").getDateValue(),
                                    ControlloCorteConti: that.getView().byId("CcorteConti").getSelected() === true ? '1' : '0'
                                };
                         var dataNuova = editDecreto.DataProtocolloAmm,
                             mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                             day = ("0" + dataNuova.getDate()).slice(-2);
                            var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                            //var nDate = nData.split("-").reverse().join(".");
                            editDecreto.DataProtocolloAmm= nData + "T00:00:00";
           
           
           var newDate = editDecreto.DataDecreto,
           mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
           day = ("0" + newDate.getDate()).slice(-2);
          var nData1= [newDate.getFullYear(), mnth, day].join("-");
          //var nDate1 = nData1.split("-").reverse().join(".");
          editDecreto.DataDecreto= nData1 + "T00:00:00";

//                                 var dataNuova = editDecreto.DataProtocolloAmm.split(".")
//                                 var date1 = dataNuova[1] + "/" +  dataNuova[0] + "/" + dataNuova[2]
//                             //     mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
//                             //     day = ("0" + dataNuova.getDate()).slice(-2);
//                             // var nData = [dataNuova.getFullYear(), mnth, day].join("-");
//                             // var nDate = nData.split("-").reverse().join(".");
//            editDecreto.DataProtocolloAmm= new Date(date1)
           
           
//            var newDate =  editDecreto.DataDecreto.split(".")
//            var date = newDate[1] + "/" +  newDate[0] + "/" + newDate[2]
//            //     mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
//            //     day = ("0" + dataNuova.getDate()).slice(-2);
//            // var nData = [dataNuova.getFullYear(), mnth, day].join("-");
//            // var nDate = nData.split("-").reverse().join(".");
// editDecreto.DataDecreto= new Date(date)
          

                                oModel.update(path, editDecreto, {
                                    success: function (result, response) {
                                        console.log('SUCCESS')
                                        MessageBox.success("Decreto creato correttamente", {
                                          actions: ["OK", "Indietro"],
                                          emphasizedAction: "OK",
                                          onClose: function (oAction) {
                                            if (oAction === "OK") {
                                              MessageBox.warning("Vuoi procedere alla registrazione dell'Ipe?", {
                                                title: "Attenzione",
                                                actions: ["OK", "Indietro"],
                                                emphasizedAction: "OK",
                                                onClose: function (oAction) {
                                                  if (oAction === "OK") {
                      
                                                    oModel.read(path, {
                                                        success: function(data, oResponse){
                                                            that.getView().getModel("temp").setProperty('/SelectedDecree', data);
                                                            that.getView().getModel("temp").setProperty('/draft', 'x' );
                                                            var Decr = data;
                                                            that.getOwnerComponent().getRouter().navTo("registraIPE" , { campo: Decr.Amministrazione, campo1: Decr.AreaFinanziaria, campo2: Decr.ChiaveGiustificativo, campo3: Decr.Ente, campo4: Decr.Esercizio, campo5: Decr.NumeroDecreto, campo6: Decr.RegistratoBozza, campo7: Decr.UfficioLiv1, campo8: Decr.UfficioLiv2 });
                                                            
                                                           },
                                                            error: function(error){
                                                           var e = error;
                                                       }
                                                   });
                                                    
                      
                      
                                                 
                      
                                                  }
                      
                                                  else {
                                                    that.navToHome();
                                                    
                      
                                                  }
                      
                                                }
                                              })
                      
                                            }
                                            else {
                                              that.navToHome();
                                             
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
            //}
        
    },
    
      });
      
    }
  );