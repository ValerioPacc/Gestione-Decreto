sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
        "gestione1/model/DateFormatter",
        "./BaseController",
        "sap/m/MessageBox",
        //"sap/m/iconTabBar",
        

    ],
    function(DateFormatter, BaseController, MessageBox, ) {
      "use strict";
  
      return BaseController.extend("gestione1.controller.dettagliDE", {

        formatter: DateFormatter,


        onInit() {
          this.getRouter().getRoute("dettagliDE").attachPatternMatched(this._onObjectMatched, this);
          
        
        },
        _onObjectMatched: function (oEvent) {
         /* this.getView().bindElement(
              "/DecretoImpegnoSet('Esercizio='" + oEvent.getParameters().arguments.campo +
              "',Amministrazione='" + oEvent.getParameters().arguments.campo1 +
              "',UfficioLiv1='" + oEvent.getParameters().arguments.campo2 +
              "',UfficioLiv2='" + oEvent.getParameters().arguments.campo3 +
              "',NumeroDecreto='" + oEvent.getParameters().arguments.campo4 +
              "',DataDecreto='" + oEvent.getParameters().arguments.campo5 + 
              "',Ragioneria='" + oEvent.getParameters().arguments.campo6 + 
              "',TipologiaImpegno='" + oEvent.getParameters().arguments.campo7 + 
              "',CodiceStato='" + oEvent.getParameters().arguments.campo8 + "')"
          );*/

          this.viewHeader(oEvent);
      },

      viewHeader: function (oEvent) {
        // console.log(this.getView().getModel("temp").getData(
        // "/HeaderNISet('"+ oEvent.getParameters().arguments.campo +
        // "','"+ oEvent.getParameters().arguments.campo1 +
        // "','"+ oEvent.getParameters().arguments.campo2 +
        // "','"+ oEvent.getParameters().arguments.campo3 +
        // "','"+ oEvent.getParameters().arguments.campo4 +
        // "','"+ oEvent.getParameters().arguments.campo5 + "')"))

        var header = this.getView().getModel("temp").getData().DecretoImpegnoSet.oData
        for (var i = 0; i < header.length; i++) {

          var dataNuova = new Date(header[i].DataDecreto),
                    mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                    day = ("0" + dataNuova.getDate()).slice(-2);
                var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                var nDate = nData.split("-").reverse().join(".");
          var dataProtocolloRag = header[i].DataProtocolloRag
                this.getView().byId("dataProtRag").setText(dataProtocolloRag)


            if (header[i].Esercizio == oEvent.getParameters().arguments.campo &&
                header[i].Amministrazione == oEvent.getParameters().arguments.campo1 &&
                header[i].UfficioLiv1 == oEvent.getParameters().arguments.campo2 &&
                header[i].UfficioLiv2 == oEvent.getParameters().arguments.campo3 &&
                header[i].NumeroDecreto == oEvent.getParameters().arguments.campo4 &&
                nDate == oEvent.getParameters().arguments.campo5 && 
                header[i].Ragioneria == oEvent.getParameters().arguments.campo6 &&
                header[i].TipologiaImpegno == oEvent.getParameters().arguments.campo7 &&
                header[i].CodiceStato == oEvent.getParameters().arguments.campo8) {

                var dirigDirFirm = header[i].DirigenteDirettoreFirmatario
                this.getView().byId("DDFirmatario").setText(dirigDirFirm)

                var dataFirm = header[i].DataFirma
                this.getView().byId("dataFirma").setText(dataFirm)
                
                var ufficioAmm = header[i].CodiceUffico
                this.getView().byId("UffAmm").setText(ufficioAmm)

                
                var esrcDE = header[i].Esercizio
                this.getView().byId("esercizio").setText(esrcDE)

                var amminstr = header[i].Amministrazione
                this.getView().byId("idAmm").setText(amminstr)

                var Ndecreto = header[i].NumeroDecreto
                this.getView().byId("Ndecr").setText(Ndecreto)

                var NumIpe = header[i].NumeroIpe
                this.getView().byId("Nipe").setText(NumIpe)

                var dataDecr = header[i].DataDecreto
                var dataNuova = new Date(dataDecr),
                    mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                    day = ("0" + dataNuova.getDate()).slice(-2);
                var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                var nDate = nData.split("-").reverse().join(".");
                this.getView().byId("dataDecr").setText(nDate)

                var numProtAmm = header[i].NProtocolloAmm
                this.getView().byId("NprotAmm").setText(numProtAmm)

                var decrState = header[i].CodiceStato
                this.getView().byId("StatoDecreto").setText(decrState)

                var ImpgnType = header[i].TipologiaImpegno
                this.getView().byId("TipologiaImpegno").setText(ImpgnType)

                var contratto = header[i].ContrattoOrdine
                this.getView().byId("Cordine").setText(contratto)

                var CCConti = header[i].ControlloCorteConti
                this.getView().byId("CcConti").setText(CCConti)

                var DocAggiuntiva = header[i].DocumentazioneAgg
                this.getView().byId("docAgg").setText(DocAggiuntiva)

                var Ragion = header[i].Ragioneria
                this.getView().byId("Rag").setText(Ragion)

                var dataProtocolloRag = header[i].DataProtocolloRag
                this.getView().byId("dataProtRag").setText(dataProtocolloRag)

                var NumProtRag = header[i].NProtocolloRag
                this.getView().byId("nProtRag").setText(NumProtRag)

            

            }
        }

    },
        onSelect: function (oEvent) {
          var key = oEvent.getParameters().key;
          if (key === "ListaIPE") {
              // var oProprietà = this.getView().getModel();
              // oProprietà.setProperty("/TableVisible", true)
              this.getView().byId("IconTabBar").destroyContent()

          }
        },
        onOpenInvFirmDialogModPag : function () {

          if (!this.fFragment) {
            this.fFragment = this.loadFragment({
              name: "gestione1.fragment.invioFirma",
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

        onConfirmationCancelMessageBoxPress: function () {
          MessageBox.confirm("Vuoi cancellare il Decreto in provvisorio?", {
            actions: ["OK", "Annulla"],
            emphasizedAction: "Annulla",
            title:"Cancellazione",
            onClose: function (sAction) {
             
              if (sAction === "OK") {
                MessageBox.success("Decreto cancellato con successo");
              }
              else{
                sAction.close();
              }
            }
          })
        },

        navToRegistraIPE: function (oEvent) {
          this.getOwnerComponent().getRouter().navTo("registraIPE");
      },

      navToWizard: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo("wizard");
    },

        onBackButton: function () {
          this.getOwnerComponent().getRouter().navTo("View1");
      },

      });

    }
  );
  