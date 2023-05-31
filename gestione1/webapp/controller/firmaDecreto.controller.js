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
                this.callDecretoIMP()
                this.callIpeEntity()
                this.viewHeader()
            },

            callDecretoIMP: function () {
            var that = this;
            var oMdl = new sap.ui.model.json.JSONModel();
            that.getOwnerComponent().getModel().read("/DecretoImpegnoSet", {
                filters: [],
                urlParameters: "",
                success: function (data) {
                    oMdl.setData(data.results);
                    that.getView().getModel("temp").setProperty('/DecretoImpegnoSet', data.results)
                },
                error: function (error) {
                    //that.getView().getModel("temp").setProperty(sProperty,[]);
                    //that.destroyBusyDialog();
                    var e = error;
                }
            });
         
        },      
               

            viewHeader: function (oEvent) {
               var that = this;
                // console.log(this.getView().getModel("temp").getData(
                // "/HeaderNISet('"+ oEvent.getParameters().arguments.campo +
                // "','"+ oEvent.getParameters().arguments.campo1 +
                // "','"+ oEvent.getParameters().arguments.campo2 +
                // "','"+ oEvent.getParameters().arguments.campo3 +
                // "','"+ oEvent.getParameters().arguments.campo4 +
                // "','"+ oEvent.getParameters().arguments.campo5 + "')"))

                var header = that.getOwnerComponent().getModel("temp").getData().SelectedDecree
                

                    


                    

                            var dataNuova = new Date(header.DataProtocolloAmm),
                            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                            day = ("0" + dataNuova.getDate()).slice(-2);
                        var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                        var nDate = nData.split("-").reverse().join(".");
                        //var dataProtocolloRag = header[i].DataProtocolloRag
                        that.getView().byId("DprotAmmin").setText(nDate)



                        

        

                       


                        var esrcDE = header.Esercizio
                        that.getView().byId("esercizio").setText(esrcDE)

                        var amminstr = header.Amministrazione
                        that.getView().byId("idAmm").setText(amminstr)

                        var Ndecreto = header.NumeroDecreto
                        that.getView().byId("Ndecr").setText(Ndecreto)

                        

                        var dataDecr = header.DataDecreto
                        var dataNuova = new Date(dataDecr),
                            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                            day = ("0" + dataNuova.getDate()).slice(-2);
                        var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                        var nDate = nData.split("-").reverse().join(".");
                        that.getView().byId("dataDecr").setText(nDate)

                        var numProtAmm = header.NProtocolloAmm
                        that.getView().byId("NprotAmm").setText(numProtAmm)

                        var decrState = header.CodiceStato
                        that.getView().byId("StatoDecreto").setText(decrState)

                        var ImpgnType = header.TipologiaImpegno
                        that.getView().byId("TipologiaImpegno").setText(ImpgnType)

                        

                  


                        var Ragion = header.Ragioneria
                        that.getView().byId("Rag").setText(Ragion)

                        // var dataProtocolloRag = header[i].DataProtocolloRag
                        // this.getView().byId("dataProtRag").setText(dataProtocolloRag)

                       



                    
                

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

            navToRegistraIPE: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("registraIPE");
            },

            navToDettagli: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("dettagliDE");
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