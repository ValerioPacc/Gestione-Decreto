sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
        "gestione1/model/DateFormatter",
        "./BaseController",
        "sap/m/MessageBox",
        //"sap/m/iconTabBar",


    ],
    function (DateFormatter, BaseController, MessageBox,) {
        "use strict";

        return BaseController.extend("gestione1.controller.firmaDecreto", {

            formatter: DateFormatter,


            onInit() {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("firmaDecreto").attachPatternMatched(this._onObjectMatched, this);
                //this.callDecretoIMP()
                this.callIpeEntity()
                //this.viewHeader()
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
                         
                        //  var stato= data.CodiceStato
                        //  if (stato == "01") {
                            
                        //     //var oProprietà = self.getView().getModel();
                        //     var state= self.getView().byId("invFirma");
                        //     state.setVisible(false) 
                        //      }
                             //
                             
                            self.viewHeader(data);
                            //  self.onDeleteRow(data);
                            //  self.onNavToupdateDecreto(data)
                        },
                         error: function(error){
                        var e = error;
                    }
                });
            //});
      
                
                
            },
            viewHeader: function (data) {
              // console.log(this.getView().getModel("temp").getData(
              // "/HeaderNISet('"+ oEvent.getParameters().arguments.campo +
              // "','"+ oEvent.getParameters().arguments.campo1 +
              // "','"+ oEvent.getParameters().arguments.campo2 +
              // "','"+ oEvent.getParameters().arguments.campo3 +
              // "','"+ oEvent.getParameters().arguments.campo4 +
              // "','"+ oEvent.getParameters().arguments.campo5 + "')"))
      
              // var header = this.getView().getModel("temp").getData().DecretoImpegnoSet.oData
              // for (var i = 0; i < header.length; i++) {
      
                //   var dataNuova = new Date(data.DataProtocolloRag),
                //       mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                //       day = ("0" + dataNuova.getDate()).slice(-2);
                //   var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                //   var nDate = nData.split("-").reverse().join(".");
                //   //var dataProtocolloRag = data.DataProtocolloRag
                //   this.getView().byId("dataProtRag").setText(nDate)
      
      
                  // if (data.Amministrazione == oEvent.getParameters().arguments.campo &&
                  //     data.AreaFinanziaria == oEvent.getParameters().arguments.campo1 &&
                  //     data.ChiaveGiustificativo == oEvent.getParameters().arguments.campo2 &&
                  //     data.Ente == oEvent.getParameters().arguments.campo3 &&
                  //     data.Esercizio == oEvent.getParameters().arguments.campo4 &&
                  //     data.NumeroDecreto == oEvent.getParameters().arguments.campo5 &&
                  //     data.RegistratoBozza == oEvent.getParameters().arguments.campo6 &&
                  //     data.UfficioLiv1 == oEvent.getParameters().arguments.campo7 &&
                  //     data.UfficioLiv2 == oEvent.getParameters().arguments.campo8) {


      
                          var dataNuova = new Date(data.DataProtocolloAmm),
                          mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                          day = ("0" + dataNuova.getDate()).slice(-2);
                      var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                      var nDate = nData.split("-").reverse().join(".");
                      //var dataProtocolloRag = data.DataProtocolloRag
                      this.getView().byId("DprotAmmin").setText(nDate)

                      var esrcDE = data.Esercizio
                      this.getView().byId("esercizio").setText(esrcDE)
      
                      var amminstr = data.Amministrazione
                      this.getView().byId("idAmm").setText(amminstr)
      
                      var Ndecreto = data.NumeroDecreto
                      this.getView().byId("Ndecr").setText(Ndecreto)
      
                    
      
                      var dataDecr = data.DataDecreto
                      var dataNuova = new Date(dataDecr),
                          mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                          day = ("0" + dataNuova.getDate()).slice(-2);
                      var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                      var nDate = nData.split("-").reverse().join(".");
                      this.getView().byId("dataDecr").setText(nDate)
      
                      var numProtAmm = data.NProtocolloAmm
                      this.getView().byId("NprotAmm").setText(numProtAmm)
      
                      var decrState = data.CodiceStato
                      this.getView().byId("StatoDecreto").setText(decrState)
      
                      var ImpgnType = data.TipologiaImpegno
                      this.getView().byId("TipologiaImpegno").setText(ImpgnType)

                      var Ragion = data.Ragioneria
                      this.getView().byId("Rag").setText(Ragion)
      
                      // var dataProtocolloRag = data.DataProtocolloRag
                      // this.getView().byId("dataProtRag").setText(dataProtocolloRag)
      
                     
      
      
      
                  //}
              //}
      
          },
            onSelect: function (oEvent) {
                var key = oEvent.getParameters().key;
                if (key === "ListaIPE") {
                    // var oProprietà = this.getView().getModel();
                    // oProprietà.setProperty("/TableVisible", true)
                    this.getView().byId("IconTabBar").destroyContent()

                }
            },
            onOpenInvFirmDialogModPag: function () {
                var oDialog2 = this.openDialog("gestione1.fragment.invioFirma").open();
                // if (!this.fFragment) {
                //     this.fFragment = this.loadFragment({
                //         name: "gestione1.fragment.invioFirma",
                //         controller: this
                //     }).then(function (oFragment) {
                //         this.getView().addDependent(oFragment);
                //         return oFragment;
                //     }.bind(this));
                // }
                // this.fFragment.then(function (oFragment) {
                //     oFragment.open();
                // }.bind(this));
            },
            onBackButton: function (oEvent) {
                window.history.go(-1);
            },

            navToRegistraIPE: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("registraIPE");
            },

            navToDettagli: function (oEvent) {
                // window.history.go(-1);
                var oDialog2 = this.closeDialog("gestione1.fragment.invioFirma").close();
                // this.getOwnerComponent().getRouter().navTo("dettagliDE");
            },

            navToWizard: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("wizard");
            },

            // onBackButton: function () {
            //     this.getOwnerComponent().getRouter().navTo("View1");
            //     this.getView().getModel("temp").setProperty("/SelectedDecree",[]);
            //     var oTempModel = this.getView().getModel("temp");
            //     oTempModel.setProperty("/draft","");
            // },

           

        
           

        })

    });