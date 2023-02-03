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
                FilterSwitch1: true,
                FilterSwitch2: true,
                header1Visible: true,
                // HeaderNIWstep3Visible: true
            };

    return BaseController.extend("gestione1.controller.wizard", {

      onInit() {
         var oProprietà = new JSONModel(),
                oInitialModelState = Object.assign({}, oData);
                oProprietà.setData(oInitialModelState);
                 this.getView().setModel(oProprietà);
                 this._iSelectedStepIndex = 0;
         this.controlSwitch();
         //this.controlHeader();
        var oModel = new sap.ui.model.json.JSONModel("../mock/comboBox.json");
        this.getView().setModel(oModel, "comboBox");
        var UIStateModel= new JSONModel();
        var UIStateData= {
          visible: false
        };
        UIStateModel.setData(UIStateData);
        this.getView().setModel(UIStateModel, "UIState");
      },

      onListSelect: function (event) {

        // console.log(event.getSource().getSelectedItem().getKey()); // works ok
        // var path = event.getSource().getSelectedItem().getBindingContext().getPath(); // Fails
        // console.log("Path=" + path)

        // var oSelectedItemPath = oEvent.getSource().getParent().getBindingContextPath();
        // var oSelectedItem = this.getOwnerComponent().getModel("comboBox").getObject(oSelectedItemPath);

        // console.log(oSelectedItem);

        var selectedItem = this.getView().byId('comboBox').getSelectedItem().getText(); console.log("text item: " + this.getView().byId('comboBox').getSelectedItem().getText())

        var oModel = this.getOwnerComponent().getModel("comboBox");

        // var text = oModel.getProperty(selectedItem)
        // console.log("You selected " + text.Modalita_pagamento)

        var setReqField = this.getView().byId('labelCS').setRequired(true);
        console.log("text item: " + this.getView().byId('labelCS').setRequired(true))
        // var fieldReq = oModel.getProperty(setReqField)
        // console.log("field set required: "+fieldReq)

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
            this.getView().byId("").setVisible(false);
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
        //this.controlHeader();
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
        //this.controlHeader();
        // console.log(this._iSelectedStepIndex)
        //this.controlPreNI()
        
        //this.getView().byId("tabGestNI").setVisible(false);
    },

    onOpenFragment : function () {

			if (!this.pFragment) {
				this.pFragment = this.loadFragment({
					name: "gestione1.fragment.anagrafica",
          controller: this
				}).then(function (oFragment) {
          this.getView().addDependent(oFragment);
          return oFragment;
        }.bind(this));
			} 
			this.pFragment.then(function(oFragment) {
				oFragment.open();
			}.bind(this));
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

			if (!this.cFragment) {
				this.cFragment = this.loadFragment({
					name: "gestione1.fragment.regModPag",
          controller: this
				}).then(function (oFragment) {
          this.getView().addDependent(oFragment);
          return oFragment;
        }.bind(this));
			} 
			this.cFragment.then(function(oFragment) {
				oFragment.open();
			}.bind(this));
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

    onSaveMessageDialogPress: function () {
      sap.m.MessageBox.warning("Servizio certificazione beneficiario avviato,in attesa di risposta, si prega di attendere", {
        title: "Procedura avvio richiesta creazione anagrafica beneficiario",                                   // default
        onClose:  MessageBox.success("Anagrafica beneficiario creata correttamente"),                                       // default
        styleClass: "",                                      // default
        customIcon: "../img/kOnzy.gif",               // default
        textDirection: sap.ui.core.TextDirection.Inherit,
       
      })
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
                  oProprietà.setProperty("/FilterSwitch1", true)
                  oProprietà.setProperty("/FilterSwitch2", true)
                }
             else {
              oProprietà.setProperty("/FilterSwitch1", false)
                  oProprietà.setProperty("/FilterSwitch2", false)
             }
            },

          
      //       controlHeader: function () {
      //         var oProprietà = this.getView().getModel();
      //         this._oWizard = this.byId("CreateProductWizard");
      //   this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
      //   this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);

      //   if (this._iSelectedStepIndex == 5  ) {
      //     oProprietà.setProperty("/header1Visible", true)
            
      //   } 
      //   else {
      //     oProprietà.setProperty("/header1Visible", false)
      //   }           
      // },

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
      }   
    });
  }
);