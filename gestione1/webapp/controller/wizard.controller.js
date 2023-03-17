sap.ui.define(
  [
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/core/library",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/SearchField",
    'gestione1/model/DateFormatter'


  ],
  function (BaseController,CoreLibrary,JSONModel,MessageBox,syncStyleClass,Fragment,Filter,FilterOperator,SearchField,DateFormatter) {
    "use strict";
    var iTimeoutId;
    var ValueState = CoreLibrary.ValueState,
            oData = {
                FilterSwitch1: false,
                FilterSwitch2: true,
                header1Visible: true,
                 HeaderNIWstep3Visible: true
            };

    return BaseController.extend("gestione1.controller.wizard", {

      onInit() {
        this.callIpeEntity();
        this.callNaturaAttoEntity();
        
       
        
         var oProprietà = new JSONModel(),
                oInitialModelState = Object.assign({}, oData);
                oProprietà.setData(oInitialModelState);
                 this.getView().setModel(oProprietà);
                 this._iSelectedStepIndex = 0;
         this.controlSwitch();
         this.controlHeader();
        var oModel = new sap.ui.model.json.JSONModel("../mock/comboBox.json");
        this.getView().setModel(oModel, "comboBox");
        var UIStateModel= new JSONModel();
        var UIStateData= {
          visible: false
        };
        UIStateModel.setData(UIStateData);
        this.getView().setModel(UIStateModel, "UIState");


        this.checkStep1Fields;

      },

      onListSelect: function (event) {
        var oSelectedKey = this.getView().byId('comboBox').getSelectedKey();
        
        this.getView().getModel("IpeEntitySet").setProperty('/Zwels' ,oSelectedKey); 

        if(oSelectedKey === '2'){
          this.getView().byId('labelCS').setRequired(true);
        }else{
          this.getView().byId('labelCS').setRequired(false);
        }

      },

      onBackButton: function () {
        this._oWizard = this.byId("CreateProductWizard");
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        //console.log(this._iSelectedStepIndex)
        if (this._iSelectedStepIndex == 0) {
            //console.log(this.getOwnerComponent().getRouter().navTo("View1"))
            this._iSelectedStepIndex = 0
            this.getOwnerComponent().getRouter().navTo("View1");
            location.reload();
            //this.getView().byId("").setVisible(false);
            return;
        }
        var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
        if (this._oSelectedStep && !this._oSelectedStep.bLast) {
            this._oWizard.goToStep(oNextStep, true);
        } else {
            this._oWizard.previousStep();
        }
        this._iSelectedStepIndex--
        this._oSelectedStep = oNextStep;
        this.controlHeader();

        //this.controlPreNI();
        //this.controlHeader()
    },

    onNextButton: function () {
        // this.onSearch()
        // this.onCommunicationPress()
        // var oModelP = new sap.ui.model.json.JSONModel("../mockdata/tabGestNI.json");
        // this.getView().setModel(oModelP, "HeaderNIW");
        this._oWizard = this.byId("CreateProductWizard");
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

        if (this._oSelectedStep && !this._oSelectedStep.bLast) {
            this._oWizard.goToStep(oNextStep, true);
        } else {
            this._oWizard.nextStep();
        }

        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;
        this.controlHeader();
        // console.log(this._iSelectedStepIndex)
        //this.controlPreNI()
        
        //this.getView().byId("tabGestNI").setVisible(false);
    },

    onOpenFragment : function () {

      var oDialog = this.openDialog("gestione1.fragment.anagrafica").open();
		},

    onOpenGridTable : function () {

			if (!this.eFragment) {
				this.eFragment = this.loadFragment({
					name: "gestione1.fragment.impPre",
          controller: this
				}).then(function (oFragment) {
          this.getView().addDependent(oFragment);
          return oFragment;
        }.bind(this));
			} 
			this.eFragment.then(function(oFragment) {
				oFragment.open();
			}.bind(this));
		},
    onOpenDialog1 : function () {

			if (!this.sFragment) {
				this.sFragment = this.loadFragment({
					name: "gestione1.fragment.listaPNI",
          controller: this
				}).then(function (oFragment) {
          this.getView().addDependent(oFragment);
          return oFragment;
        }.bind(this));
			}
      var UIStateModel= this.getView().getModel("UIState");
      var UIStateData= UIStateModel.getData();
      UIStateData.visible = false;
      UIStateModel.setData(UIStateData);
			this.sFragment.then(function(oFragment) {
				oFragment.open();
			}.bind(this));
		},
    onOpenDialog2 : function () {

			if (!this.dFragment) {
				this.dFragment = this.loadFragment({
					name: "gestione1.fragment.listaERP",
          controller: this
				}).then(function (oFragment) {
          this.getView().addDependent(oFragment);
          return oFragment;
        }.bind(this));
			} 
      var UIStateModel= this.getView().getModel("UIState");
      var UIStateData= UIStateModel.getData();
      UIStateData.visible = true;
      UIStateModel.setData(UIStateData);
			this.dFragment.then(function(oFragment) {
				oFragment.open();
			}.bind(this));
		},
    onOpenDialogModPag : function () {

      var oDialog = this.openDialog("gestione1.fragment.regModPag").open();
		},

    getOtherData: function (value) {

      var oModel= this.getView().getModel("comboBox"),
      oTempModel = this.getView().getModel("temp"),
      rowSelected = _.findWhere(oModel.getProperty("/Contratto"), {id: value}),
      beneficiario = _.findWhere(oModel.getProperty("/Beneficiario"), {id: rowSelected.id_ben});

      this._setBeneficiario(beneficiario);

      this.getView().getModel("IpeEntitySet").setProperty('/Zzdatastipula' ,rowSelected.data); 
      this.getView().getModel("IpeEntitySet").setProperty('/Zzcig' ,rowSelected.cig); 
      this.getView().getModel("IpeEntitySet").setProperty('/Zzcup' ,rowSelected.cup);
      this.getView().getModel("IpeEntitySet").setProperty('/Ktwrt' ,rowSelected.importo); 

		},
    

    
   
    //  onClickButton1 : function(){
    //    var UIStateModel= this.getView().getModel("UIState");
    //    var UIStateData= UIStateModel.getData();
    //   UIStateData.visible = false;
    //   UIStateModel.setData(UIStateData);

    //  },

    //  onClickButton2 : function(){
    //   var UIStateModel= this.getView().getModel("UIState");
    //   var UIStateData= UIStateModel.getData();
    //   UIStateData.visible = true;
    //   UIStateModel.setData(UIStateData);

    //  },

    onSaveMessageDialogPress: function (oEvent) {

      var sDialog = oEvent.getSource().data("dialog"),
      check= this.checkFields(sDialog);

      if(!check){
        sap.m.MessageBox.warning("Compilare i campi obbligatori!", {
          title: "Attenzione",                                   // default
          actions: [sap.m.MessageBox.Action.CLOSE],
          styleClass: "",                                      // default
          customIcon: "../img/kOnzy.gif",               // default
          textDirection: sap.ui.core.TextDirection.Inherit,
         
        })

      }else{

        sap.m.MessageBox.warning("Servizio certificazione beneficiario avviato,in attesa di risposta, si prega di attendere", {
          title: "Procedura avvio richiesta creazione anagrafica beneficiario",                                   // default
          onClose:  MessageBox.success("Anagrafica beneficiario creata correttamente"),                                       // default
          styleClass: "",                                      // default
          customIcon: "../img/kOnzy.gif",               // default
          textDirection: sap.ui.core.TextDirection.Inherit,
         
        })
      }
      
      
      
    },

    onWarning2MessageBoxPress: function () {
      sap.m.MessageBox.warning("Servizio certificazione beneficiario avviato,in attesa di risposta, si prega di attendere", {
        title: "Procedura avvio richiesta creazione anagrafica beneficiario",                                    // default
        onClose: null,                                       // default
        styleClass: "",                                      // default
        actions: null,                 // default
        emphasizedAction: null,        // default
        initialFocus: null,                                  // default
        textDirection: sap.ui.core.TextDirection.Inherit     // default
    });
  },

  onSuccessMessageBoxPress: function () {
    MessageBox.success("Beneficiario certificato e creato correttamente");
  },
  onError2MessageBoxPress: function () {
    MessageBox.error("Impossibile certificare il beneficiario, procedere con la creazione con i dati inseriti manualmente?", {
      actions: ["OK", MessageBox.Action.CLOSE,],
      emphasizedAction: "Annulla",
      onClose: function (sAction) {
        MessageBox.error("Operazione interrotta, nessun beneficiario creato " + sAction);
      }
    });
  },

   

    onOpenFragmentBusyDialog: function () {
     
      if (!this._pBusyDialog) {
        this._pBusyDialog = this.loadFragment({
          name: "gestione1.fragment.BusyDialog",
          controller: this
        }).then(function (oBusyDialog) {
          this.getView().addDependent(oBusyDialog);
          syncStyleClass("sapUiSizeCompact", this.getView(), oBusyDialog);
          return oBusyDialog;
        }.bind(this));
      }
  
      this._pBusyDialog.then(function(oBusyDialog) {
        oBusyDialog.open();
        this.simulateServerRequest();
      }.bind(this));
    },
    simulateServerRequest: function () {
			// simulate a longer running operation
			iTimeoutId = setTimeout(function() {
				this._pBusyDialog.then(function(oBusyDialog) {
					oBusyDialog.close();
				});
			}.bind(this), 3000);
		},

		onDialogClosed: function (oEvent) {
			clearTimeout(iTimeoutId);

			if (oEvent.getParameter("cancelPressed")) {
				MessageBox.error("The operation has been cancelled");
			} else {
				MessageBox.success("The operation has been completed");
			}
		},

    onCloseDialog : function () {
      this.byId("PosFinanziaria").close();
    },
     onCloseDialog1 : function () {
		 	this.byId("Anagrafica").close();
		},
     onCloseDialog2 : function () {
      this.byId("listaPNI").close();
   },
   onCloseDialog3 : function () {
    this.byId("regModPag").close();
 },
 onCloseDialog4 : function () {
  this.byId("impPre").close();
},
onCloseDialog5 : function () {
  this.byId("listaERP").close();
},
onCloseDialog6 : function () {
  this.byId("StruAmmResp").close();
},


  controlSwitch: function () {
                var oProprietà = this.getView().getModel();
                var stato= this.getView().byId("switch").getState();
                if (stato) {
                  oProprietà.setProperty("/FilterSwitch1", true);
                  oProprietà.setProperty("/FilterSwitch2", true);
                }
             else {
                oProprietà.setProperty("/FilterSwitch1", false);
                oProprietà.setProperty("/FilterSwitch2", false);
                this.getView().byId("Dstipula").setValue("");
                this.getView().byId("descContratto").setValue("");
                this.getView().byId("beneficiario").setValue("");
                this.getView().byId("cig").setValue("");
                this.getView().byId("cup").setValue("");
                this.getView().byId("importoCont").setValue("");
                this.getView().byId("Ncontratto").setSelectedKey("");
              


                this.getView().getModel("temp").setProperty("/Step2", []);
                
             }
            },

            checkStep1Fields: function (fields) {
              var self = this,
                  check = true,
                  sNcontratto = this.getView().byId("Ncontratto"),
                  sDstipula = this.getView().byId("Dstipula");

                  var checkNcontratto = sNcontratto.getValue() !== "" ? true : false;
                  var checksDstipula = sDstipula.getSelectedItem() !== null ? true : false;
 
                  if (!checkNcontratto) {
                      check = false;
                  }

                  if (!checksDstipula) {
                      check = false;
                  }
              return check;
          },

          checkFields: function (dialog) {
            var self = this,
            check = false;
            
              if(dialog === "Anagrafica"){
                var oForm = self.__dialog.getContent()[0].getFormContainers()[0],
                oForm2 = self.__dialog.getContent()[1].getFormContainers()[0],
                sPaese = oForm.getFormElements()[0].getFields()[0].getValue() !== "" ? true : false,
                sPaeseD = oForm.getFormElements()[0].getFields()[1].getValue() !== "" ? true : false,
                sCatBen = oForm.getFormElements()[1].getFields()[0].getSelectedKey() !== "" ? true : false,
                sDocBen = oForm.getFormElements()[2].getFields()[0].getValue() !== "" ? true : false,
                sNome = oForm.getFormElements()[3].getFields()[0].getValue() !== "" ? true : false,
                sCogn = oForm.getFormElements()[4].getFields()[0].getValue() !== "" ? true : false,
                sVia = oForm.getFormElements()[5].getFields()[0].getValue() !== "" ? true : false,
                sCiv = oForm.getFormElements()[5].getFields()[1].getValue() !== "" ? true : false,
                sLoc = oForm.getFormElements()[6].getFields()[0].getValue() !== "" ? true : false,
                sReg = oForm.getFormElements()[6].getFields()[1].getValue() !== "" ? true : false,
                sRegD = oForm.getFormElements()[6].getFields()[2].getValue() !== "" ? true : false,
                sCap = oForm.getFormElements()[7].getFields()[0].getValue() !== "" ? true : false,
                sCF = oForm2.getFormElements()[0].getFields()[0].getValue() !== "" ? true : false;

                if (sPaese && sPaeseD && sCatBen && sDocBen && sNome && sCogn && sVia && sCiv 
                  && sLoc && sReg && sRegD && sCap && sCF) {
                    check = true;
                }

              }else{
                var ben = sap.ui.getCore().byId("RegBen").getValue() !== "" ? true : false,
                mod = sap.ui.getCore().byId("RegModPag").getSelectedKey() !== "" ? true : false,
                iban = sap.ui.getCore().byId("iban").getValue() !== "" ? true : false;

                if (ben && mod && iban) {
                    check = true;
                }

              }
              

            return check;
        },

          
            controlHeader: function () {
              var oProprietà = this.getView().getModel();
              this._oWizard = this.byId("CreateProductWizard");
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);

        if (this._iSelectedStepIndex == 5 ) {
          oProprietà.setProperty("/header1Visible", true)
            
        } 
        else {
          oProprietà.setProperty("/header1Visible", true)
        }           
      },

      onValueHelpRequest: function (oEvent) {
        // this._oBasicSearchField = new SearchField();
        // if (!this.pDialog) {
        //   this.pDialog = this.loadFragment({
        //     name: "gestione1.fragment.posFinanziaria",
        //     controller: this
        //   }).then(function (oDialog) {
        //           oView.addDependent(oDialog);
        //           syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
        //         return oDialog;
        //       }.bind(this));
        //      }
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
  
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "gestione1.fragment.posFinanziaria",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
          return oDialog;
        }.bind(this));
      }
         
        this._pValueHelpDialog.then(function(oDialog) {
          // Create a filter for the binding
          //oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });
        




      },

      onValueHelpRequest2: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
  
        if (!this._sValueHelpDialog) {
          this._sValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "gestione1.fragment.struAmmResp",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
          return oDialog;
        }.bind(this));
      }
         
        this._sValueHelpDialog.then(function(oDialog) {
          // Create a filter for the binding
          //oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });

      },
      
     

      onChangeSelect: function () {
        var bSelected= this.getView().byId("CB1").getSelected();
        if (bSelected) {
          this.getView().byId("CB3").setEnabled(false);
        }  
        else {
          this.getView().byId("CB3").setEnabled(true);
        }
      }, 
      
      onRegIpebozza: function (oEvent) {
        var oModel= this.getView().getModel("comboBox"),
        oBozza = oEvent.getSource().data("Bozza") === "X" ? true : false,
        oTempModel = this.getView().getModel("temp"),
        oIpeEntitySet = this.getView().getModel("IpeEntitySet"), 
        rowSelected = _.findWhere(oModel.getProperty("/Contratto"), ),
        beneficiario = _.findWhere(oModel.getProperty("/Beneficiario"), ),
        Zzanno = this.getView().byId("es_decreto").getSelectedKey();

        //oTempModel.setProperty("/Step1", rowSelected);
        //oTempModel.setProperty("/Step2", beneficiario);
        

        
        var self= this
        MessageBox.warning("Sei sicuro di voler salvare l'Ipe in Bozza ?", {
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            emphasizedAction: sap.m.MessageBox.Action.YES,
            onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  var oDataModel = self.getOwnerComponent().getModel();
                  var entity = {
                    Bukrs: oTempModel.getProperty("/SelectedDecree").Ente,
                    Fikrs:oTempModel.getProperty("/SelectedDecree").AreaFinanziaria,
                    Gjahr: oTempModel.getProperty("/SelectedDecree").Esercizio,
                    Zzanno: Zzanno,
                    Zregistrato: oTempModel.getProperty("/SelectedDecree").RegistratoBozza,
                    ZCodCla:'',
                    ZCodGius:oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo,
                    ZCodIpe:oTempModel.getProperty("/SelectedDecree").CodiceIpe,
                    ZNumCla:'',
                    Zammin: oTempModel.getProperty("/SelectedDecree").Amministrazione,
                    Zcoddecr:oTempModel.getProperty("/SelectedDecree").NumeroDecreto,
                    ZidIpe:'',
                    Zufficioliv1:oTempModel.getProperty("/SelectedDecree").UfficioLiv1,
                    Zufficioliv2:oTempModel.getProperty("/SelectedDecree").UfficioLiv2,
                    Zzdatastipula: new Date (oIpeEntitySet.getProperty("/Zzdatastipula")), //new Date (oTempModel.getProperty("/Step1/").data),
                    Ebeln: oIpeEntitySet.getProperty("/Ebeln"),//oTempModel.getProperty("/Step1/").id,
                    Lifnr: oIpeEntitySet.getProperty("/Lifnr"),  //oTempModel.getProperty("/Step1/").id_ben,
                    Zzcig: oIpeEntitySet.getProperty("/Zzcig"),  //oTempModel.getProperty("/Step1/").cig,
                    Zzcup: oIpeEntitySet.getProperty("/Zzcup"), //oTempModel.getProperty("/Step1/").cup,
                    NameFirst: oIpeEntitySet.getProperty("/NameFirst"), //oTempModel.getProperty("/Step2/").nome,
                    NameLast: oIpeEntitySet.getProperty("/NameLast"), //oTempModel.getProperty("/Step2/").cognome,
                    ZzragSoc: oIpeEntitySet.getProperty("/ZzragSoc"), //oTempModel.getProperty("/Step2/").Rsociale,
                    Stcd1: oIpeEntitySet.getProperty("/Stcd1"), //oTempModel.getProperty("/Step2/").cf,
                    Stcd2: "",//oIpeEntitySet.getProperty("/Stcd2"), //oTempModel.getProperty("/Step2/").IVA,
                    Zwels: oIpeEntitySet.getProperty("/Zwels"), //oTempModel.getProperty("/items/").Modalita_pagamento,
                    Iban: oIpeEntitySet.getProperty("/Iban"), //oTempModel.getProperty("/Step2/").iban,
                    Zbozza: "X"
                    };
                    if(!oBozza){

                     oDataModel.create("/IpeEntitySet", entity,{
                       success: function(result){ 
                        console.log('SUCCESS')
                        MessageBox.success("Ipe in bozza creato correttamente", {
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.OK) {
                                    self.getView().getModel("temp").setProperty('/NewIPE', "");
                                    self.getOwnerComponent().getRouter().navTo("View1")
                                    location.reload();
                                    //self.getView().getModel("temp").setProperty('/NewIPE', "");
                                }
                            }
                        }) 
                    }, 

                        error: function(err){
                           console.log(err); 
                           MessageBox.error("Ipe in bozza non creato correttamente")
                           location.reload();
                          },
                            async: true, 
                             urlParameters: {}  });
                  }else{
                    self.onEditIpebozza(entity, oDataModel);
                  }
                 
                }
            }
        })
      
    },

    onEditIpebozza: function (entry,oDataModel) {
      var self = this,
      oTempModel = self.getView().getModel("temp"),
      oIpeEntitySet = self.getView().getModel("IpeEntitySet"),
      Stipula = self.getView().getModel("IpeEntitySet").getProperty('/Zzdatastipula'),
      DataStipula = Stipula.split(".");

      DataStipula = new Date(DataStipula[1] + "-" + DataStipula[0] + "-" + DataStipula[2])

      self.getView().getModel("IpeEntitySet").setProperty('/Zzdatastipula', DataStipula);
      self.getView().getModel("IpeEntitySet").setProperty('/Stcd2', "");
      var entry = self.getView().getModel("IpeEntitySet").getProperty('/');
      
      var path = oDataModel.createKey("/IpeEntitySet", {
        Bukrs: oTempModel.getProperty("/SelectedDecree").Ente,
        Fikrs: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria,
        Gjahr: oTempModel.getProperty("/SelectedDecree").Esercizio,
        ZCodCla: oIpeEntitySet.getProperty("/ZCodCla"),
        ZCodGius: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo,
        ZCodIpe: oIpeEntitySet.getProperty("/ZCodIpe"),
        ZNumCla: oIpeEntitySet.getProperty("/ZNumCla"),
        Zammin: oTempModel.getProperty("/SelectedDecree").Amministrazione,
        Zcoddecr: oTempModel.getProperty("/SelectedDecree").NumeroDecreto,
        ZidIpe: oIpeEntitySet.getProperty("/ZidIpe"),
        Zregistrato: oTempModel.getProperty("/SelectedDecree").RegistratoBozza,
        Zufficioliv1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1,
        Zufficioliv2: oTempModel.getProperty("/SelectedDecree").UfficioLiv2,
    });

    oDataModel.update(path, entry,  {
      success: function (data) {
          console.log("success");
          MessageBox.success("Operazione Eseguita con successo", {
              actions: [sap.m.MessageBox.Action.OK],
              emphasizedAction: MessageBox.Action.OK,
              onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.OK) {
                      that.getOwnerComponent().getRouter().navTo("View1");
                      
                  }
              }
          })
      },
      error: function (e) {
          //console.log("error");
          MessageBox.error("Operazione non eseguita")
          
  }
});
      

    },

    

    });
  }
);