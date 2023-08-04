sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
        "gestione1/model/DateFormatter",
        "./BaseController",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
        //"sap/m/iconTabBar",


    ],
    function (DateFormatter, BaseController, MessageBox,Filter,FilterOperator) {
        "use strict";
        var oData = {
            VisibleButton: true,
        };
        return BaseController.extend("gestione1.controller.dettagliDE", {

            formatter: DateFormatter,


            onInit() {
                this.callTipoImpEntity()
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("dettagliDE").attachPatternMatched(this._onObjectMatched, this);
                
                //var row = this.getView().byId("DecretoImpegno").getSelectedItem().getBindingContext("DecretoImpegno").getObject()
                // if (row.CodiceStato == "01") {
                //     this.getView().byId("invFirma").setEnabled(false)
                // }


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
                             self.viewHeader(data);
                             self.callIpeEntity()
                            //  self.onDeleteRow(data);
                            //  self.onNavToupdateDecreto(data)
                        },
                         error: function(error){
                        var e = error;
                    }
                });
            //});

                
                
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
          
            onSearch: function (oEvent) {

                //var visibilità = this.getView().getModel("temp").getData().Visibilità[0]
                var that = this,
                    oModel = that.getOwnerComponent().getModel(),
                    oTempModel = that.getOwnerComponent().getModel("temp"),
                    aFilters = [];
                
    
                aFilters.push(
                    new Filter({ path: "Zregistrato", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").RegistratoBozza }),
                    new Filter({ path: "ZCodIpe", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").CodiceIpe }),
                    new Filter({ path: "ZNumCla", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroClausola }),
                    new Filter({ path: "Bukrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Ente }),
                    new Filter({ path: "Fikrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria }),
                    new Filter({ path: "Gjahr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Esercizio }),
                    new Filter({ path: "Zammin", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Amministrazione }),
                    new Filter({ path: "Zcoddecr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroDecreto }),
                    new Filter({ path: "Zufficioliv1", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1 }),
                    new Filter({ path: "Zufficioliv2", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv2 }),
                    new Filter({ path: "ZCodGius", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo }),
                    new Filter({ path: "ZidIpe", operator: FilterOperator.EQ, value1: "" }),
                    new Filter({ path: "ZCodCla", operator: FilterOperator.EQ, value1: "" })
                );
                // var abc=this.getView().byId("filterbar").getAllFilterItems();

                // var bindingInfo = ""
                // var path = ""
               
                
                // var numFilter = oEvent.getParameters().selectionSet.length;

                // for (let i = 0; i < numFilter; i++) {

                //     bindingInfo = "items"
                //     path = oEvent.getParameters().selectionSet[i].getBindingInfo(bindingInfo)
                //     if (path == undefined) {
                //         bindingInfo = "suggestionItems"
                //         path = oEvent.getParameters().selectionSet[i].getBindingInfo(bindingInfo)
                //     }
                //     var filtro = oEvent.getParameters().selectionSet[i]
                   
                //console.log(datiGI)

                var oModel = that.getModel();

                that.getModel().metadataLoaded().then(function () {
                    oModel.read("/IpeEntitySet", {
                        filters: aFilters,
                        //urlParameters:{ "AutorityRole": visibilità.AGR_NAME, "AutorityFikrs": visibilità.FIKRS, "AutorityPrctr": visibilità.PRCTR },
                        success: function (data, oResponse) {
                            var oModelJson = new sap.ui.model.json.JSONModel();
                            oModelJson.setData(data.results);
                            that.getView().getModel("temp").setProperty('/IpeEntitySet', oModelJson);
                            that.getOwnerComponent().setModel(oModelJson, "ListaIpe");
                        },
                        error: function (error) {
                            var e = error;
                            MessageBox.error("Errore durante l'estrazione della tabella", {
                                actions: [sap.m.MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                            })
                        }

                    });

                });
            
               
        

        

    },
  
            // callIpeEntity: function () {

            //     var that = this,
            //         oModel = that.getOwnerComponent().getModel(),
            //         oTempModel = that.getOwnerComponent().getModel("temp"),
            //         aFilters = [];
    
                
    
            //     aFilters.push(
            //         new Filter({ path: "Zregistrato", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").RegistratoBozza }),
            //         new Filter({ path: "ZCodIpe", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").CodiceIpe }),
            //         new Filter({ path: "ZNumCla", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroClausola }),
            //         new Filter({ path: "Bukrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Ente }),
            //         new Filter({ path: "Fikrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria }),
            //         new Filter({ path: "Gjahr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Esercizio }),
            //         new Filter({ path: "Zammin", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Amministrazione }),
            //         new Filter({ path: "Zcoddecr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroDecreto }),
            //         new Filter({ path: "Zufficioliv1", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1 }),
            //         new Filter({ path: "Zufficioliv2", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv2 }),
            //         new Filter({ path: "ZCodGius", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo }),
            //         new Filter({ path: "ZidIpe", operator: FilterOperator.EQ, value1: "" }),
            //         new Filter({ path: "ZCodCla", operator: FilterOperator.EQ, value1: "" })
            //     );
    
    
            //     oModel.read("/IpeEntitySet", {
            //         filters: aFilters,
            //         urlParameters: "",
            //         success: function (data) {
            //             var results = data.results;
            //             if (results.length > 0) {
            //                 // var mnth = ("0" + (results[0].Zzdatastipula.getMonth() + 1)).slice(-2),
            //                 // day = ("0" + results[0].Zzdatastipula.getDate()).slice(-2);
    
            //                 // var nData = [results[0].Zzdatastipula.getFullYear(), mnth, day].join("-");
            //                 // results[0].Zzdatastipula = nData.split("-").reverse().join(".");
    
            //                 that.getView().getModel("IpeEntitySet").setProperty('/', results[0]);
    
            //             } else {
            //                 that.getView().getModel("IpeEntitySet").setProperty('/', []);
            //                 that.getView().getModel("temp").setProperty('/NewIPE', "X");
            //             }
            //             //that.controlSwitch(results);
            //             // if (results.ZFlContOrd == "X") {
            //             // 	that.getView().byId("switch").setState(true) 
    
            //             // }else{
            //             // 	that.getView().byId("switch").setState(false) 
            //             // }
    
            //         },
            //         error: function (error) {
            //             //that.getView().getModel("temp").setProperty(sProperty,[]);
            //             //that.destroyBusyDialog();
            //             console.log(error);
            //         }
    
            //     });
            //     //this.viewHeaderIpe();
            // },
     
            viewHeader: function (data) {
                // console.log(this.getView().getModel("temp").getData(
                // "/HeaderNISet('"+ oEvent.getParameters().arguments.campo +
                // "','"+ oEvent.getParameters().arguments.campo1 +
                // "','"+ oEvent.getParameters().arguments.campo2 +
                // "','"+ oEvent.getParameters().arguments.campo3 +
                // "','"+ oEvent.getParameters().arguments.campo4 +
                // "','"+ oEvent.getParameters().arguments.campo5 + "')"))
                var oTempModel = this.getOwnerComponent().getModel("temp");
                // var header = this.getView().getModel("temp").getData().DecretoImpegnoSet.oData
                // for (var i = 0; i < header.length; i++) {
if (data.DataProtocolloAmm != null) {
    

                    var dataNuova = new Date(data.DataProtocolloAmm),
                        mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                        day = ("0" + dataNuova.getDate()).slice(-2);
                    var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                    var nDate = nData.split("-").reverse().join(".");
                    //var dataProtocolloRag = data.DataProtocolloRag
                    this.getView().byId("DprotAmm").setText(nDate)
                    this.getView().byId("DataProtAmm").setText(nDate)
                    
}

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
                        this.getView().byId("numeroProtAmm").setText(numProtAmm)
                        

                        var decrState = data.DescrizioneStato
                        this.getView().byId("StatoDecreto").setText(decrState)
                        this.getView().byId("Sdecreto").setText(decrState)
                        
                        var ImpgnType = data.TipologiaImpegno
                        var tipoImp = _.findWhere(oTempModel.getProperty('/TipologiaImpegnoSet'), {Codice: ImpgnType})
                        //var modalita = _.findWhere(oTempModel.getProperty('/ZwelsBenSet'), {id: tipoImp.Descrizione})
                        var tipologia = tipoImp.Descrizione
                        this.getView().byId("TipologiaImpegno").setText(tipologia)
                        this.getView().byId("Timpegno").setText(tipologia)

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
            onSelect: function (oEvent) {
                var key = oEvent.getParameters().key;
                var icon = this.getView().byId("IconTabBar").mProperties.expanded
                var Decr =this.getOwnerComponent().getModel("temp").getData().SelectedDecree
                if (icon === true) {
                    this.getView().byId("datiAmm").setVisible(false)
                    this.getView().byId("datiRag").setVisible(false)
                    this.getView().byId("rag").setVisible(false)
                    this.getView().byId("rag1").setVisible(false)
                    this.getView().byId("invFirma").setVisible(true)
                    this.getView().byId("nIPE").setVisible(false)
                    this.getView().byId("Nipe").setVisible(false)
                    this.getView().byId("Timpegno").setVisible(true)
                    this.getView().byId("tImpegno").setVisible(true)
                    this.getView().byId("sDecreto").setVisible(true)
                    this.getView().byId("Sdecreto").setVisible(true)
                    this.getView().byId("ragioneria").setVisible(true)
                    this.getView().byId("Ragioneria").setVisible(true)
                    this.getView().byId("datiFirm").setVisible(true)
                    this.getView().byId("layout1").setVisible(false)
                    this.getView().byId("layout2").setVisible(false)
                    this.getView().byId("nProtAmm").setVisible(false)
                    this.getView().byId("NprotAmm").setVisible(false)
                    this.getView().byId("RegistraDE").setVisible(false)
                    this.getView().byId("rettificaDE").setVisible(false)
                    this.getView().byId("cancellaDE").setVisible(false)
                    this.getView().byId("Annulla").setVisible(true)
                    this.getView().byId("InvioFirm").setVisible(true)
                 


                    // var oProprietà = this.getView().getModel();
                    // oProprietà.setProperty("/TableVisible", true)
                    // {
                        
                    //     this.getOwnerComponent().getRouter().navTo("firmaDecreto", { campo: Decr.Amministrazione, campo1: Decr.AreaFinanziaria, campo2: Decr.ChiaveGiustificativo, campo3: Decr.Ente, campo4: Decr.Esercizio, campo5: Decr.NumeroDecreto, campo6: Decr.RegistratoBozza, campo7: Decr.UfficioLiv1, campo8: Decr.UfficioLiv2 })
                    // }

                }
                else if (icon === false){
                    this.getView().byId("datiAmm").setVisible(true)
                    this.getView().byId("datiRag").setVisible(true)
                    this.getView().byId("layout1").setVisible(true)
                    this.getView().byId("layout2").setVisible(true)
                    this.getView().byId("nProtAmm").setVisible(true)
                    this.getView().byId("NprotAmm").setVisible(true) 
                    this.getView().byId("rag").setVisible(true)
                    this.getView().byId("rag1").setVisible(true)
                    this.getView().byId("nIPE").setVisible(true)
                    this.getView().byId("Nipe").setVisible(true)
                    this.getView().byId("invFirma").setVisible(false)
                    this.getView().byId("Timpegno").setVisible(false)
                    this.getView().byId("tImpegno").setVisible(false)
                    this.getView().byId("sDecreto").setVisible(false)
                    this.getView().byId("Sdecreto").setVisible(false)
                    this.getView().byId("ragioneria").setVisible(false)
                    this.getView().byId("Ragioneria").setVisible(false)
                    this.getView().byId("datiFirm").setVisible(false)  
                    this.getView().byId("RegistraDE").setVisible(true)
                    this.getView().byId("rettificaDE").setVisible(true)
                    this.getView().byId("cancellaDE").setVisible(true)
                    this.getView().byId("Annulla").setVisible(false)
                    this.getView().byId("InvioFirm").setVisible(false)      
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
                        //var indice = i
                        MessageBox.warning("Sei sicuro di voler cancellare il Decreto d'Impegno n° " + data.NumeroDecreto + "?", {
                            title: "Attenzione",
                            actions: ["Si", "No"],
                            emphasizedAction: "Si",
                            onClose: function (oAction) {
                                if (oAction === "Si") {
                                    
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
                //}
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
                var Decr =this.getOwnerComponent().getModel("temp").getData().SelectedDecree
                this.getOwnerComponent().getRouter().navTo("registraIPE" , { campo: Decr.Amministrazione, campo1: Decr.AreaFinanziaria, campo2: Decr.ChiaveGiustificativo, campo3: Decr.Ente, campo4: Decr.Esercizio, campo5: Decr.NumeroDecreto, campo6: Decr.RegistratoBozza, campo7: Decr.UfficioLiv1, campo8: Decr.UfficioLiv2 });
            },

            navToDettagli: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("dettagliDE");
            },

            navToWizard: function (oEvent) {
                //var row = this.getView().byId("ListaIPE").getSelectedItem().getBindingContext("ListaIpe").getObject()
                this.getOwnerComponent().getRouter().navTo("wizard");
            },
            navToFirma: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("firmaDecreto", {campo:Amministrazione, campo1:AreaFinanziaria, campo2: ChiaveGiustificativo, campo3:Ente, campo4:Esercizio, campo5:NumeroDecreto, campo6:RegistratoBozza, campo7:UfficioLiv1, campo8:UfficioLiv2 })
            },


            onBackButton: function () {
                // this.getOwnerComponent().getRouter().navTo("View1");
                this.getView().getModel("temp").setProperty("/SelectedDecree",[]);
                var oTempModel = this.getView().getModel("temp");
                oTempModel.setProperty("/draft","");
                window.history.go(-1);
               

                
            },

            onNavToupdateDecreto: function(oEvent){
            //var row = this.getView().byId("DecretoImpegno").getSelectedItem().getBindingContext("DecretoImpegno").getObject()
                //this.getModel("temp").setProperty("/SelectedDecree", row);
                var data = this.getView().getModel("temp").oData.SelectedDecree    
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
                var oTempModel = this.getView().getModel("temp");
                oTempModel.setProperty("/draft","x");
                this.getOwnerComponent().getRouter().navTo("updateDecreto", {campo:data.Amministrazione, campo1:data.AreaFinanziaria, campo2: data.ChiaveGiustificativo, campo3:data.Ente, campo4:data.Esercizio, campo5:data.NumeroDecreto, campo6:data.RegistratoBozza, campo7:data.UfficioLiv1, campo8:data.UfficioLiv2 })
                }
            //}     
            },

        
           

        })

    });

