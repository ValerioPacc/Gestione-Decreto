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
        this.callEsercizioEntity()
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


      onRegDIbozza: function (oEvent) {
        var that = this;


        var N_tipo_impegno = (this.getView().byId("TypeI").mProperties.value).split(":")[0]
        var N_es_decreto = this.getView().byId("es_decreto").mProperties.value;
        var N_Amm = this.getView().byId("AmministrazioneED").mProperties.value;
        var N_codiceUff = this.getView().byId("UffApp1").mProperties.value;
        var N_Datade = this.getView().byId("DataDE1").mProperties.dateValue
        var N_NprotAmm = this.getView().byId("numProtocolloAmma1").getValue();
        var N_DataprotAmm = this.getView().byId("dataProtocolloAmm1").mProperties.dateValue
        var N_CcConti = this.getView().byId("CcorteConti").getSelected();
        if (N_CcConti == true)
          var B_CcConti = "1"
        if (N_CcConti == false)
          var B_CcConti = "0"




        MessageBox.warning("Sei sicuro di voler preimpostare il Decreto?", {
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
              var dataNuova = new Date(N_DataprotAmm),
                mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                day = ("0" + dataNuova.getDate()).slice(-2);
              var nData = [dataNuova.getFullYear(), mnth, day].join("-");
              DecretoImpegnoSet.DataProtocolloAmm = new Date(nData)


              var newDate = new Date(N_Datade),
                mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
                day = ("0" + newDate.getDate()).slice(-2);
              var nData = [newDate.getFullYear(), mnth, day].join("-");
              DecretoImpegnoSet.DataDecreto = new Date(nData)
              //this.onSaveMessageDialogPress()

              oDataModel.create("/DecretoImpegnoSet", DecretoImpegnoSet, {
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