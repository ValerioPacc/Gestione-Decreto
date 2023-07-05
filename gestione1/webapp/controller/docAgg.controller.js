sap.ui.define(
    [
      "./BaseController"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("gestione1.controller.docAgg", {
        onInit() {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("docAgg").attachPatternMatched(this._onObjectMatched, this);


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
                   
                   var stato= data.CodiceStato
                   if (stato == "01") {
                      
                      //var oProprietà = self.getView().getModel();
                      var state= self.getView().byId("invFirma");
                      state.setVisible(false) 
                       }
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

            var dataNuova = new Date(data.DataProtocolloRag),
                mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                day = ("0" + dataNuova.getDate()).slice(-2);
            var nData = [dataNuova.getFullYear(), mnth, day].join("-");
            var nDate = nData.split("-").reverse().join(".");
            //var dataProtocolloRag = data.DataProtocolloRag
            this.getView().byId("dataProtRag").setText(nDate)


            // if (data.Amministrazione == oEvent.getParameters().arguments.campo &&
            //     data.AreaFinanziaria == oEvent.getParameters().arguments.campo1 &&
            //     data.ChiaveGiustificativo == oEvent.getParameters().arguments.campo2 &&
            //     data.Ente == oEvent.getParameters().arguments.campo3 &&
            //     data.Esercizio == oEvent.getParameters().arguments.campo4 &&
            //     data.NumeroDecreto == oEvent.getParameters().arguments.campo5 &&
            //     data.RegistratoBozza == oEvent.getParameters().arguments.campo6 &&
            //     data.UfficioLiv1 == oEvent.getParameters().arguments.campo7 &&
            //     data.UfficioLiv2 == oEvent.getParameters().arguments.campo8) {

                    var dataNuova = new Date(data.DataProtocolloRag),
                    mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                    day = ("0" + dataNuova.getDate()).slice(-2);
                var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                var nDate = nData.split("-").reverse().join(".");
                //var dataProtocolloRag = data.DataProtocolloRag
                this.getView().byId("dataProtRag").setText(nDate)



                var dirigDirFirm = data.DirigenteDirettoreFirmatario
                this.getView().byId("DDFirmatario").setText(dirigDirFirm)

                var dataFirm = data.DataFirma
                this.getView().byId("dataFirma").setText(dataFirm)

                var ufficioAmm = data.CodiceUffico
                this.getView().byId("UffAmm").setText(ufficioAmm)


                var esrcDE = data.Esercizio
                this.getView().byId("esercizio").setText(esrcDE)

                var amminstr = data.Amministrazione
                this.getView().byId("idAmm").setText(amminstr)

                var Ndecreto = data.NumeroDecreto
                this.getView().byId("Ndecr").setText(Ndecreto)

                var NumIpe = data.NumeroIpe
                this.getView().byId("Nipe").setText(NumIpe)

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

                var contratto = data.ContrattoOrdine
                this.getView().byId("Cordine").setText(contratto)

                var CCConti = data.ControlloCorteConti
                this.getView().byId("CcConti").setText(CCConti)

                var DocAggiuntiva = data.DocumentazioneAgg
                this.getView().byId("docAgg").setText(DocAggiuntiva)

                var Ragion = data.Ragioneria
                this.getView().byId("Rag").setText(Ragion)

                // var dataProtocolloRag = data.DataProtocolloRag
                // this.getView().byId("dataProtRag").setText(dataProtocolloRag)

                var NumProtRag = data.NProtocolloRag
                this.getView().byId("nProtRag").setText(NumProtRag)



            //}
        //}

    },

    onBackButton: function (oEvent) {
        window.history.go(-1);
    },
      });
    }
  );