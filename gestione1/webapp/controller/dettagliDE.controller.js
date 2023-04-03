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

        return BaseController.extend("gestione1.controller.dettagliDE", {

            formatter: DateFormatter,


            onInit() {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("dettagliDE").attachPatternMatched(this._onObjectMatched, this);


            },
            _onObjectMatched: function (oEvent) {

                var self = this;
                var oDataModel = self.getModel();
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

                
                oDataModel.metadataLoaded().then( function() { 
                   oDataModel.read(path, {
                     success: function(data, oResponse){
                         self.getView().getModel("temp").setProperty('/SelectedDecree', data); 
                         
                        },
                         error: function(error){
                        var e = error;
                    }
                });
            });

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

                    var dataNuova = new Date(header[i].DataProtocolloRag),
                        mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                        day = ("0" + dataNuova.getDate()).slice(-2);
                    var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                    var nDate = nData.split("-").reverse().join(".");
                    //var dataProtocolloRag = header[i].DataProtocolloRag
                    this.getView().byId("dataProtRag").setText(nDate)


                    if (header[i].Amministrazione == oEvent.getParameters().arguments.campo &&
                        header[i].AreaFinanziaria == oEvent.getParameters().arguments.campo1 &&
                        header[i].ChiaveGiustificativo == oEvent.getParameters().arguments.campo2 &&
                        header[i].Ente == oEvent.getParameters().arguments.campo3 &&
                        header[i].Esercizio == oEvent.getParameters().arguments.campo4 &&
                        header[i].NumeroDecreto == oEvent.getParameters().arguments.campo5 &&
                        header[i].RegistratoBozza == oEvent.getParameters().arguments.campo6 &&
                        header[i].UfficioLiv1 == oEvent.getParameters().arguments.campo7 &&
                        header[i].UfficioLiv2 == oEvent.getParameters().arguments.campo8) {

                            var dataNuova = new Date(header[i].DataProtocolloRag),
                            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                            day = ("0" + dataNuova.getDate()).slice(-2);
                        var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                        var nDate = nData.split("-").reverse().join(".");
                        //var dataProtocolloRag = header[i].DataProtocolloRag
                        this.getView().byId("dataProtRag").setText(nDate)



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

                        // var dataProtocolloRag = header[i].DataProtocolloRag
                        // this.getView().byId("dataProtRag").setText(dataProtocolloRag)

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
                    {
                        this.getOwnerComponent().getRouter().navTo("firmaDecreto")
                    }

                }
            },
            onOpenInvFirmDialogModPag: function () {

                if (!this.fFragment) {
                    this.fFragment = this.loadFragment({
                        name: "gestione1.fragment.invioFirma",
                        controller: this
                    }).then(function (oFragment) {
                        this.getView().addDependent(oFragment);
                        return oFragment;
                    }.bind(this));
                }
                this.fFragment.then(function (oFragment) {
                    oFragment.open();
                }.bind(this));
            },



            onDeleteRow: function (oEvent) {
                var that = this;

                var url = location.href
                var sUrl = url.split("/dettagliDE/")[1]
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
                        MessageBox.warning("Sei sicuro di voler cancellare il Decreto d'Impegno n° " + header[i].NumeroDecreto + "?", {
                            title: "Attenzione",
                            actions: ["Si", "No"],
                            emphasizedAction: "Si",
                            onClose: function (oAction) {
                                if (oAction === "Si") {
                                    
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

                                    oModel.remove(path, {
                                        success: function (data, response) {
                                            //console.log("success");
                                            MessageBox.success("Operazione eseguita con successo",{
                                                title:"Esito Operazione",
                                            actions: [sap.m.MessageBox.Action.OK],
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === sap.m.MessageBox.Action.OK) {
                                            that.getOwnerComponent().getRouter().navTo("View1") 
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

            // onConfirmationCancelMessageBoxPress: function () {
            //   MessageBox.confirm("Vuoi cancellare il Decreto in provvisorio?", {
            //     actions: ["OK", "Annulla"],
            //     emphasizedAction: "Annulla",
            //     title:"Cancellazione",
            //     onClose: function (sAction) {

            //       if (sAction === "OK") {
            //         MessageBox.success("Decreto cancellato con successo");
            //       }
            //       else{
            //         sAction.close();
            //       }
            //     }
            //   })
            // },

            navToRegistraIPE: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("registraIPE");
            },

            navToDettagli: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("dettagliDE");
            },

            navToWizard: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("wizard");
            },
            navToFirma: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("firmaDecreto", {campo:Amministrazione, campo1:AreaFinanziaria, campo2: ChiaveGiustificativo, campo3:Ente, campo4:Esercizio, campo5:NumeroDecreto, campo6:RegistratoBozza, campo7:UfficioLiv1, campo8:UfficioLiv2 })
            },


            // onBackButton: function () {
            //     this.getOwnerComponent().getRouter().navTo("View1");
            //     this.getView().getModel("temp").setProperty("/SelectedDecree",[]);
            //     var oTempModel = this.getView().getModel("temp");
            //     oTempModel.setProperty("/draft","");
            // },

            onNavToupdateDecreto: function(){
            //var row = this.getView().byId("DecretoImpegno").getSelectedItem().getBindingContext("DecretoImpegno").getObject()
                //this.getModel("temp").setProperty("/SelectedDecree", row);
                
        var url = location.href
        var sUrl = url.split("/dettagliDE/")[1]
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
                var oTempModel = this.getView().getModel("temp");
                oTempModel.setProperty("/draft","x");
                this.getOwnerComponent().getRouter().navTo("updateDecreto", {campo:header[i].Amministrazione, campo1:header[i].AreaFinanziaria, campo2: header[i].ChiaveGiustificativo, campo3:header[i].Ente, campo4:header[i].Esercizio, campo5:header[i].NumeroDecreto, campo6:header[i].RegistratoBozza, campo7:header[i].UfficioLiv1, campo8:header[i].UfficioLiv2 })
                }
            }     
            },

        
           

        })

    });

