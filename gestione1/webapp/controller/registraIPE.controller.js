sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/Dialog",
        "sap/ui/core/library",
        "sap/m/Button",
        "sap/m/library",
        "sap/m/Text",
        "gestione1/model/DateFormatter",
        "sap/ui/model/Filter",
	      "sap/ui/model/FilterOperator"
    ],
    function(BaseController,MessageBox,Dialog,coreLibrary,Button,mobileLibrary,Text,DateFormatter,Filter,FilterOperator) {
      "use strict";


      // shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;
  
      return BaseController.extend("gestione1.controller.registraIPE", {

        formatter: DateFormatter,

        onInit() {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("registraIPE").attachPatternMatched(this._onObjectMatched, this);
          this.callStatoDecEntity()
          // var view= this.getView();
          // var dataDecr = this.getOwnerComponent().getModel("temp").getData().SelectedDecree.DataDecreto;
          //       var dataNuova = new Date(dataDecr),
          //           mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
          //           day = ("0" + dataNuova.getDate()).slice(-2);
          //       var nData = [dataNuova.getFullYear(), mnth, day].join("-");
          //       var nDate = nData.split("-").reverse().join(".");
          //       this.getView().byId("reData").setText(nDate);
                
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

          var dataDecr = this.getOwnerComponent().getModel("temp").getData().SelectedDecree.DataDecreto;
                var dataNuova = new Date(dataDecr),
                    mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                    day = ("0" + dataNuova.getDate()).slice(-2);
                var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                var nDate = nData.split("-").reverse().join(".");
                this.getView().byId("reData").setText(nDate);

          
          //oDataModel.metadataLoaded().then( function() { 
             oDataModel.read(path, {
               success: function(data, oResponse){
                   self.getView().getModel("temp").setProperty('/SelectedDecree', data); 
                   
                   
                      //  self.onDeleteRow(data);
                      //  self.onNavToupdateDecreto(data)
                  },
                   error: function(error){
                  var e = error;
              }
          });
      //});

          
          
      },
        // onSuccessMessageDialogPress: function () {
        //   MessageBox.confirm("Vuoi registrare il Decreto in provvisorio?", {
        //     actions: ["OK", "Annulla"],
        //     emphasizedAction: "OK",
        //     title: "Registrazione",
        //     onClose: function (sAction) {
             
        //       if (sAction === "OK") {
        //         MessageBox.success("Decreto registrato con successo");
        //       }
        //       else{
        //         sAction.close();
        //       }
        //     }
        //   })
        // },



        callStatoDecEntity: function () {
          var that = this;
          var oMdl = new sap.ui.model.json.JSONModel();
          this.getOwnerComponent().getModel().read("/StatoDecretoSet", {
              filters: [],
              urlParameters: "",
              success: function (data) {
                  oMdl.setData(data.results);
                  that.getView().getModel("temp").setProperty('/StatoDecretoSet', data.results)
                  //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
              },
              error: function (error) {
                  //that.getView().getModel("temp").setProperty(sProperty,[]);
                  //that.destroyBusyDialog();
                  var e = error;
              }
          });


      },

        onOpenConfDialog : function () {

          if (!this.fFragment) {
            this.fFragment = this.loadFragment({
              name: "gestione1.fragment.confDialog",
              controller: this
            }).then(function (oFragment) {
              this.getView().addDependent(oFragment);
              return oFragment;
            }.bind(this));
          } 
          this.fFragment.then(function(oFragment) {
            oFragment.open();
          }.bind(this));
        },
        onSuccessMessageBoxPress: function () {
          MessageBox.success("Decreto provvisorio registrato ", {
          onClose: function () {
          }
          });
        
        },

        onBackButton1: function () {
          window.history.go(-1);
          //this.getOwnerComponent().getRouter().navTo("DettagliDE");
          
      },
      onBackButton2: function () {
        this.getOwnerComponent().getRouter().navTo("RegistraIPE");
      }, 
      navToWizard: function (oEvent) {
        
        this.getOwnerComponent().getRouter().navTo("wizard");
        
    },
    navToView1: function (oEvent) {
      this.getOwnerComponent().getRouter().navTo("View1");
  },
  navToIpeVariazione: function (oEvent) {
    this.getOwnerComponent().getRouter().navTo("ipeVariazione");
},
navToAttoAnnullamento: function (oEvent) {
  this.getOwnerComponent().getRouter().navTo("attoAnnullamento");
},
  
      });
    }
  );
  