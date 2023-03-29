sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/export/Spreadsheet',
    'gestione1/model/DateFormatter'
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,Filter,FilterOperator,Spreadsheet,DateFormatter) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        return BaseController.extend("gestione1.controller.View1", {
            formatter: DateFormatter,
            onInit: function () {
                //this.callTipoImpEntity()
                var oFilter = this.getView().byId("filterID"),
				that = this;
				
			oFilter.addEventDelegate({
				"onAfterRendering": function(oEvent) {
					var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();


					var oButton = oEvent.srcControl._oSearchButton;
					oButton.setText(oResourceBundle.getText("Avvio"));         
                       
				}
			});
               
            },
            navToDecreto: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("Decreto");
            },
           
            onSearch: function (oEvent) {
                 var that = this;
                var datiGI = [];

                // var abc=this.getView().byId("filterbar").getAllFilterItems();

                var bindingInfo = ""
                var path = ""

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
                                if(oEvent.getParameters().selectionSet[11].mProperties.value!= ''){
                                datiGI.push(new Filter({
                                    path: "DataDecreto",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[11].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[12].mProperties.value
                                }));
                            }
                            }
                            if (i == 17) {
                                if(oEvent.getParameters().selectionSet[17].mProperties.value!= ''){
                                datiGI.push(new Filter({
                                    path: "DataFirma",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[17].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[18].mProperties.value
                                }));
                            }
                            }
                            if (i == 19) {
                                if(oEvent.getParameters().selectionSet[19].mProperties.value!= ''){
                                datiGI.push(new Filter({
                                    path: "DataProtocolloAmm",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[19].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[20].mProperties.value
                                }));
                            }
                            }
                            if (i == 23) {
                                if(oEvent.getParameters().selectionSet[23].mProperties.value!= ''){
                                datiGI.push(new Filter({
                                    path: "DataProtocolloRag",
                                    operator: F-ilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[23].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[24].mProperties.value
                                }));
                            }
                            }
                        }
                        else if(oEvent.getParameters().selectionSet[i].mProperties.value != ''){
                            datiGI.push(new Filter({
                                path: path.sorter.sPath,
                                operator: FilterOperator.EQ,
                                value1: filtro.getValue()                           
                            }));
                         //datiGI.push("?$filter= "+path.sorter.sPath+" eq '" + filtro.getValue() + "'");
                        }
                        else if(i==12 || i==18 || i==20 || i==24){
                            continue
                        }
                    }
                }
                //console.log(datiGI)
                
                var oDataModel = that.getModel();
                
                 that.getModel().metadataLoaded().then( function() { 
                    oDataModel.read("/DecretoImpegnoSet", {
                    filters: datiGI ,
                     urlParameters: "",
                      success: function(data, oResponse){
                        var oModelJson = new sap.ui.model.json.JSONModel();
                          oModelJson.setData(data.results);
                           that.getView().getModel("temp").setProperty('/DecretoImpegnoSet', oModelJson);
                           that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
                         },
                          error: function(error){
                    var e = error;}
                    
                 });
                 
             });
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

            navToRegistraIpe: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("registraIPE");
            },
            onNavToDettagliDE: function(){
                var row = this.getView().byId("DecretoImpegno").getSelectedItem().getBindingContext("DecretoImpegno").getObject()
                //this.getModel("temp").setProperty("/SelectedDecree", row);
                if (row.CodiceStato == "01") {
                this.getOwnerComponent().getRouter().navTo("dettagliDE", {campo:row.Amministrazione, campo1:row.AreaFinanziaria, campo2: row.ChiaveGiustificativo, campo3:row.Ente, campo4:row.Esercizio, campo5:row.NumeroDecreto, campo6:row.RegistratoBozza, campo7:row.UfficioLiv1, campo8:row.UfficioLiv2 })
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
            callTipoImpEntity:function () {
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
        });
    });

    
     
