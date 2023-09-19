sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/export/Spreadsheet',
    "sap/m/MessageBox",
    'gestione1/model/DateFormatter'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, ODataModel, Filter, FilterOperator, Spreadsheet,MessageBox, DateFormatter) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        return BaseController.extend("gestione1.controller.View1", {
            formatter: DateFormatter,
            onInit: function () {
                this.callEsercizioEntity()
                //this.callConiAuthEntity()  //chiamata per i coni visibilità ancora non funzionante
                 //this.callVisibilità()
                 this.callUfficioEntity()
                 this.callEserFipexEntity()
                this.callStatoDecEntity()
                this.callTipoImpEntity()
                this.callCurrentUserParamEntity()
                var oFilter = this.getView().byId("filterID"),
                    that = this;

                oFilter.addEventDelegate({
                    "onAfterRendering": function (oEvent) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();


                        var oButton = oEvent.srcControl._oSearchButton;
                        oButton.setText(oResourceBundle.getText("Avvio"));

                    }
                });

            },
        

            navToDecreto: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("Decreto");
            },

            ////  Funzione estrazione tabella lista Decreti   ///
            onSearch: function (oEvent) {

                //var visibilità = this.getView().getModel("temp").getData().Visibilità[0]
                var that = this;
                var datiGI = [];

                // var abc=this.getView().byId("filterbar").getAllFilterItems();

                var bindingInfo = ""
                var path = ""
                var Tipologia = that.getView().getModel("temp").getData().TipologiaImpegnoSet
                var StatoDec = that.getView().getModel("temp").getData().StatoDecretoSet
                var EserFipex = that.getView().getModel("temp").getData().EsercizioFipexSet
                
                var numFilter = oEvent.getParameters().selectionSet.length;

                for (let i = 0; i < numFilter; i++) {

                    bindingInfo = "items"
                    path = oEvent.getParameters().selectionSet[i].getBindingInfo(bindingInfo)
                    if (path == undefined) {
                        bindingInfo = "suggestionItems"
                        path = oEvent.getParameters().selectionSet[i].getBindingInfo(bindingInfo)
                    }
                    var filtro = oEvent.getParameters().selectionSet[i]
                    if (filtro) {
                        if (filtro.mProperties.dateValue instanceof Date || !isNaN(filtro.mProperties.dateValue)) {

                            if (i == 11) {
                                if (oEvent.getParameters().selectionSet[11].mProperties.value != '') {
                                  if (oEvent.getParameters().selectionSet[12].mProperties.value == '' ) {
                                   
                                  
                                    datiGI.push(new Filter({
                                        path: "DataDecreto",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[11].mProperties.value,
                                        value2: null
                                    }));
                                }
                                else {
                                    datiGI.push(new Filter({
                                        path: "DataDecreto",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[11].mProperties.value,
                                        value2:  oEvent.getParameters().selectionSet[12].mProperties.value
                                    }));
                                }
                            }
                        }
                            if (i == 17) {
                                if (oEvent.getParameters().selectionSet[17].mProperties.value != '') {
                                    datiGI.push(new Filter({
                                        path: "DataFirma",
                                        operator: FilterOperator.BT,
                                        value1: this.getView().byId('dataFirmaAmmDa1').getValue(),
                                        value2: this.getView().byId('dataFirmaAmmA1').getValue(),
                                    }));
                                }
                            }
                            if (i == 19) {
                                if (oEvent.getParameters().selectionSet[19].mProperties.value != '') {
                                    datiGI.push(new Filter({
                                        path: "DataProtocolloAmm",
                                        operator: FilterOperator.BT,
                                        value1: this.getView().byId('dataProtocolloAmmDa1').getValue(),
                                        value2: this.getView().byId('dataProtocolloAmmA1').getValue()
                                    }));
                                }
                            }
                            if (i == 23) {
                                if (oEvent.getParameters().selectionSet[23].mProperties.value != '') {
                                    datiGI.push(new Filter({
                                        path: "DataProtocolloRag",
                                        operator: FilterOperator.BT,
                                        value1: this.getView().byId('dataProtocolloRGSDa1').getValue(),
                                        value2: this.getView().byId('dataProtocolloRGSA1').getValue()
                                    }));
                                }
                            }
                        }
                        else if (oEvent.getParameters().selectionSet[i].mProperties.value != '' && i != 6 && i != 27) {
                            datiGI.push(new Filter({
                                path: path.sorter.sPath,
                                operator: FilterOperator.EQ,
                                value1: filtro.getValue()
                            }));
                            //datiGI.push("?$filter= "+path.sorter.sPath+" eq '" + filtro.getValue() + "'");
                        }
                        else if (i == 12 || i == 18 || i == 20 || i == 24) {
                            continue
                        }
                        else if (i == 0) {
                            if (oEvent.getParameters().selectionSet[i].mProperties.value == '') {
                                MessageBox.error("Valorizzare Esercizio Decreto", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                })
                            }
                        }
                        else if (i == 1) {
                            if (oEvent.getParameters().selectionSet[i].mProperties.value == '') {
                                MessageBox.error("Valorizzare Amministrazione", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                })
                            }
                        }
                          /// controllo valorizzazione Esercizio posizione finanziaria ///
                        else if (i == 33) {
                            if (oEvent.getParameters().selectionSet[i].mProperties.value == '') {
                                MessageBox.error("Valorizzare Esercizio Posizione Finanziaria", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                })
                            }
                        }

            

                        else if (i == 6) {
                            for (var t = 0; t < Tipologia.length; t++) {
                               if (oEvent.getParameters().selectionSet[i].mProperties.value == Tipologia[t].Descrizione) {
                                datiGI.push(new Filter({
                                    path: 'TipologiaImpegno',
                                    operator: FilterOperator.EQ,
                                    value1: Tipologia[t].Codice
                                }));
                               }
                                
                            }
                            
                        }

                        else if (i == 27) {
                            for (var s = 0; s < StatoDec.length; s++) {
                               if (oEvent.getParameters().selectionSet[i].mProperties.value == StatoDec[s].DescrizioneStato) {
                                datiGI.push(new Filter({
                                    path: 'CodiceStato',
                                    operator: FilterOperator.EQ,
                                    value1: StatoDec[s].Codice
                                }));
                               }
                                
                            }
                            
                        }
                        else if (i == 33) {
                            for (var t = 0; t < EserFipex.length; t++) {
                               if (oEvent.getParameters().selectionSet[i].mProperties.value == EserFipex[t].Anno) {
                                datiGI.push(new Filter({
                                    path: 'Anno',
                                    operator: FilterOperator.EQ,
                                    value1: EserFipex[t].Anno
                                }));
                               }
                                
                            }
                            
                        }
                    }
                }
                if (datiGI[0].sPath == 'Esercizio') {
                //console.log(datiGI)

                var oDataModel = that.getModel();

                that.getModel().metadataLoaded().then(function () {
                    oDataModel.read("/DecretoImpegnoSet", {
                        filters: datiGI,
                        //urlParameters:{ "AutorityRole": visibilità.AGR_NAME, "AutorityFikrs": visibilità.FIKRS, "AutorityPrctr": visibilità.PRCTR },
                        success: function (data, oResponse) {
                            var oModelJson = new sap.ui.model.json.JSONModel();
                            oModelJson.setData(data.results);
                            that.getView().getModel("temp").setProperty('/DecretoImpegnoSet', oModelJson);
                            that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
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
            }
                this.getView().byId("Esporta").setEnabled(true);
                this.getView().byId("DettagliDE").setEnabled(false);
                this.getView().byId("registrazioneDI").setEnabled(true);
                // var that = this;
                // var oMdl = new sap.ui.model.json.JSONModel();
                // this.getView().getModel().read("/DecretoImpegnoSet", {
                //     filters: datiGI,
                //     urlParameters: "",
                //     success: function (data) {
                //         oMdl.setData(data.results);
                //         that.getView().getModel("temp").setProperty('/DecretoImpegnoSet', data.results)
                //     },
                //     error: function (error) {
                //         //that.getView().getModel("temp").setProperty(sProperty,[]);
                //         //that.destroyBusyDialog();
                //         var e = error;
                //     }
                // });


                //  this.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
                //sap.ui.getCore().TableModel = oMdlW;
                // this.getView().byId("Esporta").setEnabled(true);
                // this.getView().byId("PreimpostazioneNI").setEnabled(true);

            },
            
            callEserFipexEntity: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/EsercizioFipexSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/EsercizioFipexSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
                
    
            },

            callUfficioEntity: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/UfficioSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/UfficioSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
                
    
            },

            navToRegistraIpe: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("registraIPE");
            },
            onNavToDettagliDE: function () {
                var row = this.getView().byId("DecretoImpegno").getSelectedItem().getBindingContext("DecretoImpegno").getObject()
                //this.getModel("temp").setProperty("/SelectedDecree", row);
                if (row.CodiceStato == "01") {
                    
                    this.getOwnerComponent().getRouter().navTo("dettagliDE", { campo: row.Amministrazione, campo1: row.AreaFinanziaria, campo2: row.ChiaveGiustificativo, campo3: row.Ente, campo4: row.Esercizio, campo5: row.NumeroDecreto, campo6: row.RegistratoBozza, campo7: row.UfficioLiv1, campo8: row.UfficioLiv2 })
                    
                }
                else if (row.CodiceStato == "02") {

                    this.getOwnerComponent().getRouter().navTo("dettagliDE", { campo: row.Amministrazione, campo1: row.AreaFinanziaria, campo2: row.ChiaveGiustificativo, campo3: row.Ente, campo4: row.Esercizio, campo5: row.NumeroDecreto, campo6: row.RegistratoBozza, campo7: row.UfficioLiv1, campo8: row.UfficioLiv2 })
                }
                // else if (row.CodiceStato == "08") {
                //     this.getOwnerComponent().getRouter().navTo("documentazioneAgg", { campo: row.Amministrazione, campo1: row.AreaFinanziaria, campo2: row.ChiaveGiustificativo, campo3: row.Ente, campo4: row.Esercizio, campo5: row.NumeroDecreto, campo6: row.RegistratoBozza, campo7: row.UfficioLiv1, campo8: row.UfficioLiv2 })
                // }
                else{
                    this.getOwnerComponent().getRouter().navTo("dettagliDE", { campo: row.Amministrazione, campo1: row.AreaFinanziaria, campo2: row.ChiaveGiustificativo, campo3: row.Ente, campo4: row.Esercizio, campo5: row.NumeroDecreto, campo6: row.RegistratoBozza, campo7: row.UfficioLiv1, campo8: row.UfficioLiv2 })
                }
            },



            createColumnConfig: function () {
                var aCols = [];

                aCols.push({
                    property: 'Esercizio',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Amministrazione',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'UfficioLiv1',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'UfficioLiv2',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'NumeroDecreto',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'DataDecreto',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Ragioneria',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'TipologiaImpegno',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'StatoDecreto',
                    type: EdmType.Number
                });

                return aCols;
            },

            
            onExport: function () {
                //console.log("onExport")
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('DecretoImpegno');
                }

                oTable = this._oTable;


                // var oSelectedItemPath = oEvent.getSource().getParent().getBindingContextPath();
                // var oSelectedItem = this.getOwnerComponent().getModel("booksMdl").getObject(oSelectedItemPath);

                //console.log("table1: " + oTable)
                oRowBinding = oTable.getBinding('items');
                //console.log("row binding: " + oRowBinding);
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Esportazione DE',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            onRowSelectionChange: function (oEvent) {
                this.getView().byId("registrazioneDI").setEnabled(false);
                this.getView().byId("DettagliDE").setEnabled(true);
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
                        //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });


            },

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
                        //console.log("Test")
                        that.getView().byId("AmministrazioneED").setValue(amm)
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

            navTodocAgg: function() {
                this.getOwnerComponent().getRouter().navTo("documentazioneAgg");
            },
            callConiAuthEntity:function () {
                var that = this
                var self = this
                var oMdl = new sap.ui.model.json.JSONModel();
                var filters = []
                filters.push(
                    new Filter({ path: "SEM_OBJ", operator: FilterOperator.EQ, value1: "ZS4_DECRETOIMPEGNO_SRV" }),
                    new Filter({ path: "AUTH_OBJ", operator: FilterOperator.EQ, value1: "Z_GEST_IMP" })
                )
                // "ODataModel" required from module "sap/ui/model/odata/v2/ODataModel"
                var visibilità = new ODataModel("http://10.38.125.80:8000/sap/opu/odata/sap/ZSS4_CA_CONI_VISIBILITA_SRV/");
                visibilità.read("/ZES_CONIAUTH_SET", {
                //
                    filters: filters,
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/Visibilità', data.results)
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
    });



