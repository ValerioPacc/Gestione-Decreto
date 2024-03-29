sap.ui.define(
  [
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/library",
    "sap/m/MessageBox",
    'gestione1/model/DateFormatter'
  ],
  function (BaseController, Spreadsheet, CoreLibrary, MessageBox, DateFormatter) {
    "use strict";

    return BaseController.extend("gestione1.controller.Decreto", {
      formatter: DateFormatter,
      onInit() {
        this.callTipoImpEntity()
        this.callEsercizioDeEntity()
        this.callStatoDecrEntity()
        this.callCurrentUserParamEntity()
        this.valueDate()
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

      valueDate: function () {
       
        var dataNuova = new Date,
        mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
        day = ("0" + dataNuova.getDate()).slice(-2);
      var nData = [dataNuova.getFullYear(), mnth, day].join("-");
      
        this.getView().byId("DataDE1").setValue(nData)
      },


      // navToRegistraIPE: function (oEvent) {
      //     this.getOwnerComponent().getRouter().navTo("registraIPE");
      // },
      onBackButton: function () {
        var that = this;
        MessageBox.warning("Sei sicuro di voler tornare indietro?", {
          title: "Attenzione",
          actions: ["Continuare", "Indietro"],
          emphasizedAction: "Continuare",
          onClose: function (oAction) {
            if (oAction === "Continuare") {
              that.navToHome()
            }
      }
    })
  },
      callTipoImpEntity: function () {
        var that = this;
        var oMdl = new sap.ui.model.json.JSONModel();
        this.getOwnerComponent().getModel().read("/TipologiaImpegnoSet", {
          filters: [],
          urlParameters: "",
          success: function (data) {
            oMdl.setData(data.results);
            that.getView().getModel("temp").setProperty('/TipologiaImpegnoSet', data.results)
          },
          error: function (error) {
            //that.getView().getModel("temp").setProperty(sProperty,[]);
            //that.destroyBusyDialog();
            var e = error;
          }
        });


      },

      callStatoDecrEntity: function () {
        var that = this;
        var oMdl = new sap.ui.model.json.JSONModel();
        this.getOwnerComponent().getModel().read("/StatoDecretoSet", {
          filters: [],
          urlParameters: "",
          success: function (data) {
            oMdl.setData(data.results);
            that.getView().getModel("temp").setProperty('/StatoDecretoSet', data.results)
          },
          error: function (error) {
            //that.getView().getModel("temp").setProperty(sProperty,[]);
            //that.destroyBusyDialog();
            var e = error;
          }
        });


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

    callCurrentUserParamEntity: function () {
      var that = this;
      var oModel = that.getOwnerComponent().getModel()
      var ammin = []
      var path = oModel.createKey("/CurrentUserParamSet", {
          Name:'/PRA/PN_DN_FUNC_AREA'

      })
      oModel.read(path, {
          filters: [],
          urlParameters: "",
          success: function (data) {
              var amm = data.Value.split(".")[0]
              data.Value = amm
              ammin.push(data)
              var oModelJson = new sap.ui.model.json.JSONModel();
              oModelJson.setData(data);
              that.getView().getModel("temp").setProperty('/CurrentUserParamSet', ammin)
              console.log("Test")
              //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
          },
          error: function (error) {
              //that.getView().getModel("temp").setProperty(sProperty,[]);
              //that.destroyBusyDialog();
              var e = error;
          }
      });


  },

///// registrazione Decreto in bozza /////
      onRegDIbozza: function (oEvent) {
        // var that = this;
        // var oTempModel = that.getView().getModel("temp");
        //var tipImp = oTempModel.getProperty('/TipologiaImpegnoSet')
        // var uno = _.findWhere(oTempModel.getProperty('/TipologiaImpegnoSet'), {Descrizione: that.getView().byId("TypeI").mProperties.value})
        // var tre = _.findWhere(oTempModel.getProperty('/TipologiaImpegnoSet'), {id: uno.Descrizione})
        // var due = uno.Codice
        var N_tipo_impegno = this.getView().byId("TypeI").mProperties.selectedKey
        var N_es_decreto = this.getView().byId("es_decreto").mProperties.value;
        var N_Amm = this.getView().byId("AmministrazioneED").mProperties.value;
        var N_codiceUff = this.getView().byId("UffApp1").mProperties.value;
        var N_Datade = this.getView().byId("DataDE1").getDateValue()
        var N_NprotAmm = this.getView().byId("numProtocolloAmma1").getValue();
        var N_DataprotAmm = this.getView().byId("dataProtocolloAmm1").getDateValue()
        var N_CcConti = this.getView().byId("CcorteConti").getSelected();
        if (N_CcConti == true)
          var B_CcConti = "1"
        if (N_CcConti == false)
          var B_CcConti = "0"



var that = this;
        MessageBox.warning("Procedere con la registrazione del Decreto?", {
          title: "Attenzione",
          actions: ["Si", "No"],
          emphasizedAction: "Si",
          onClose: function (oAction) {
            if (oAction === "Si") {
              var oDataModel = that.getOwnerComponent().getModel();

              var DecretoImpegnoSet = {
                ChiaveGiustificativo: '',
                AreaFinanziaria: '',
                Ente: '',
                RegistratoBozza: '',
                UfficioLiv1: '',
                UfficioLiv2: '',
                CodiceStato: '',
                Ragioneria: '',
                TipologiaImpegno: N_tipo_impegno,
                Esercizio: N_es_decreto,
                Amministrazione: N_Amm,
                DataDecreto: N_Datade,
                NProtocolloAmm: N_NprotAmm,
                DataProtocolloAmm: N_DataprotAmm,
                CodiceUfficio: N_codiceUff,
                ControlloCorteConti: B_CcConti
              };
            
              
              if (N_DataprotAmm != null) {
                
              
              var dataNuova = new Date(N_DataprotAmm),
                mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                day = ("0" + dataNuova.getDate()).slice(-2);
              var nData = [dataNuova.getFullYear(), mnth, day].join("-");
              DecretoImpegnoSet.DataProtocolloAmm = new Date(nData)
              }
              if (N_Datade != null) {
              var newDate = new Date(N_Datade),
                mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
                day = ("0" + newDate.getDate()).slice(-2);
              var nData = [newDate.getFullYear(), mnth, day].join("-");
              DecretoImpegnoSet.DataDecreto = new Date(nData)
              //this.onSaveMessageDialogPress()
            }
              oDataModel.create("/DecretoImpegnoSet", DecretoImpegnoSet, {
                success: function (result, response) {
                  console.log('SUCCESS')
                  MessageBox.success("Decreto "  +  result.ChiaveGiustificativo +  " creato correttamente", {
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


                              


                              var oTempModel = that.getView().getModel("temp");
                              oTempModel.setProperty("/draft", "x");
                              oTempModel.setProperty("/SelectedDecree", result)
                              var Decr = result;
                              that.getOwnerComponent().getRouter().navTo("registraIPE" , { campo: Decr.Amministrazione, campo1: Decr.AreaFinanziaria, campo2: Decr.ChiaveGiustificativo, campo3: Decr.Ente, campo4: Decr.Esercizio, campo5: Decr.NumeroDecreto, campo6: Decr.RegistratoBozza, campo7: Decr.UfficioLiv1, campo8: Decr.UfficioLiv2 });


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

                error: function (err) {
                  console.log(err);
                  MessageBox.error("Decreto non creato correttamente", {
                    title: "Errore",
                    actions: ["Chiudi"]
                  })
                },
                async: true,
                urlParameters: {}
              });





            }
          }
        })
      },
      // controllo campi obbligatori //
      checkFields: function (fields) {
        var self = this,
          check = true,
          sTipologia = this.getView().byId("TypeI"),
          sEsercizio = this.getView().byId("es_decreto"),
          sAmministrazione = this.getView().byId("AmministrazioneED"),
          sDataDe = this.getView().byId("DataDE1");


        var checksTipologia = sTipologia.getSelectedItem() !== null ? true : false;
        var checksEsercizio = sEsercizio.getSelectedItem() !== null ? true : false;
        var checksAmministrazione = sAmministrazione.getSelectedItem() !== null ? true : false;
        var checksDataDe = sDataDe.getValue() !== "" ? true : false;


        if (!checksTipologia) {
          check = false;
        }

        if (!checksEsercizio) {
          check = false;
        }
        if (!checksAmministrazione) {
          check = false;
        }

        if (!checksDataDe) {
          check = false;
        }


        return check;
      },
      onSaveMessageDialogPress: function (oEvent) {

        var sDecreto = oEvent.getSource().data("Decreto"),
          check = this.checkFields(sDecreto);

        if (!check) {
          sap.m.MessageBox.warning("Compilare i campi obbligatori!", {
            title: "Attenzione",                                   // default
            actions: [sap.m.MessageBox.Action.CLOSE],
            styleClass: "",                                      // default
            customIcon: "../img/kOnzy.gif",               // default
            textDirection: sap.ui.core.TextDirection.Inherit,

          })

        }
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
     callEsercizioEntity: function () {
        var that = this;
        var oMdl = new sap.ui.model.json.JSONModel();
        this.getOwnerComponent().getModel().read("/EsercizioDecretoSet", {
            filters: [],
            urlParameters: "",
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
      
    });

  }
);