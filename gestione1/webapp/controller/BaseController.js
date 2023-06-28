sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, mobileLibrary,Filter,FilterOperator) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("gestione1.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		OnSelect: function (oEvent){
            var self = this,
			field = oEvent.getSource().data("field"),
            item = oEvent.getSource().getSelectedKey();
			self.getView().getModel("IpeEntitySet").setProperty("/"+ field, item);

        },

		getColsData: function (oYears){
			var aColumnData = [
				{columnLabel: "PNI",columnName:"Geber"}
			]
			for (var i = 0; i< 40; i++ ){
                 var anno = oYears+i
                 aColumnData.push(
				 {columnLabel: "Clausola" + anno,columnName: "ZclausolaVar" + anno},
				 {columnLabel: "Disponibilità PNI"+ anno, columnName:"Wtfree"+ anno},
				 {columnLabel: ""+ anno, columnName:"ZImpIpeCl"+ anno},
				 {columnLabel: "Disponibilità di cassa"+ anno, columnName:"Zcassa"+ anno}
				 )

				// {columnLabel: "Clausola" + oYears[1],columnName:"ZclausolaVar"+ oYears[1]},
				// {columnLabel: "Disponibilità PNI"+ oYears[1], columnName:"Wtfree"+ oYears[1]},
				// {columnLabel: ""+ oYears[1], columnName:"ZImpIpeCl"+ oYears[1]},
				// {columnLabel: "Disponibilità di cassa"+ oYears[1], columnName:"Zcassa"+ oYears[1]},
				// {columnLabel: "Clausola" + oYears[2],columnName:"ZclausolaVar"+ oYears[2]},
				// {columnLabel: "Disponibilità PNI"+ oYears[2], columnName:"Wtfree"+ oYears[2]},
				// {columnLabel: ""+ oYears[2], columnName:"ZImpIpeCl"+ oYears[2]},
				// {columnLabel: "Disponibilità di cassa"+ oYears[2], columnName:"Zcassa"+ oYears[2]},
				// {columnLabel: "Clausola" + oYears[3],columnName:"ZclausolaVar"+ oYears[3]},
				// {columnLabel: "Disponibilità PNI"+ oYears[3], columnName:"Wtfree"+ oYears[3]},
				// {columnLabel: ""+ oYears[3], columnName:"ZImpIpeCl"+ oYears[3]},
				// {columnLabel: "Disponibilità di cassa"+ oYears[3], columnName:"Zcassa"+ oYears[3]}


			}
			  return aColumnData;

        },

		getRowsData: function (Aut, cols){
            // var ClausMod = this.getOwnerComponent().getModel("EsigibilitaSet");
			var oEsigModel = this.getOwnerComponent().getModel("Esigibilita");
			var oTempModel = this.getOwnerComponent().getModel("temp");



			//oEsigModel.setProperty('/', []);

				var arr = [];
				var year = 2023
				for (var j = 0; j < Aut.length; j++) {
					var row = {};
					for (var k = 0; k < cols.length; k++) {
					  var item = cols[k].columnName;
					  row[item] = "";
					}
					// var annualità = year + j
					row["Geber"] = Aut[j]; // Assegnazione del valore "aut" alla proprietà "Geber"
					// row["Wtfree"+annualità] =oTempModel.getData().EsigibilitaSet.Wtfree
					// row["Zcassa"+annualità] =oTempModel.getData().EsigibilitaSet.Cassa
					arr.push(row);
				  }

			// oEsigModel.setProperty('/List/Geber', arr)
			//arr.push(oEsigModel.getProperty('/List'));
			oEsigModel.setProperty("/List",arr);

			return arr;

		},


		getColsPrevisioni: function (oYears){
			var aColumnData = [
			{columnLabel: "Esigibilità annuale",columnName:"Annuale"}
			]
			for (var i = 0; i< 40; i++ ){
				var anno = oYears+i
                aColumnData.push(
				// {columnLabel: "Esigibilità annuale",columnName:"Annuale"},
				{columnLabel: "Previsioni PNI"+ anno, columnName:"ZprePni"+ anno},
				{columnLabel: ""+ anno, columnName:"ZImpIpeCl"+ anno},
				);
			}
			  return aColumnData;

        

	},
		getPreRowsData: function (Aut, cols){
			var oEsigModel = this.getOwnerComponent().getModel("Esigibilita");
			var oTempModel = this.getOwnerComponent().getModel("temp");



			//oEsigModel.setProperty('/', []);
			var arr = [];
			for( var i in cols){
				var item = cols[i];
				if(oEsigModel.getProperty("/List").length > 0){
					var key = Object.keys(oEsigModel.getProperty("/List")[0]);
					var oExist = _.contains(key, item.columnName);
					if(!oExist){
						oEsigModel.setProperty("/List/"+ item.columnName, "")
					}
				}else{
					oEsigModel.setProperty("/List/"+ item.columnName, "")
				}

			}

			oEsigModel.setProperty('/List/Annuale', Aut);
			arr.push(oEsigModel.getProperty('/List'));
			oEsigModel.setProperty("/List",arr);
			return arr;
		},


		callIpeEntity:function () {

			var that = this,
			oModel = that.getOwnerComponent().getModel(),
			oTempModel = that.getOwnerComponent().getModel("temp"),
			aFilters = [];

			that.getOwnerComponent().getModel("IpeEntitySet").setProperty('/' ,[])

			aFilters.push(
			  new Filter({path: "Zregistrato", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").RegistratoBozza }),
			  new Filter({path: "ZCodIpe", operator: FilterOperator.EQ, value1:  oTempModel.getProperty("/SelectedDecree").CodiceIpe}),
			  new Filter({path: "ZNumCla", operator: FilterOperator.EQ, value1:  oTempModel.getProperty("/SelectedDecree").NumeroClausola}),
			  new Filter({path: "Bukrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Ente }),
			  new Filter({path: "Fikrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria }),
			  new Filter({path: "Gjahr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Esercizio }),
			  new Filter({path: "Zammin", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Amministrazione }),
			  new Filter({path: "Zcoddecr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroDecreto }),
			  new Filter({path: "Zufficioliv1", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1 }),
			  new Filter({path: "Zufficioliv2", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv2 }),
			  new Filter({path: "ZCodGius", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo }),
			  new Filter({path: "ZidIpe", operator: FilterOperator.EQ, value1: "" }),
			  new Filter({path: "ZCodCla", operator: FilterOperator.EQ, value1: "" })
			  );


			oModel.read("/IpeEntitySet", {
				filters: aFilters,
				urlParameters: "",
				success: function (data) {
					var results = data.results;
					if(results.length > 0){
						// var mnth = ("0" + (results[0].Zzdatastipula.getMonth() + 1)).slice(-2),
                        // day = ("0" + results[0].Zzdatastipula.getDate()).slice(-2);

						// var nData = [results[0].Zzdatastipula.getFullYear(), mnth, day].join("-");
						// results[0].Zzdatastipula = nData.split("-").reverse().join(".");

						that.getView().getModel("IpeEntitySet").setProperty('/', results[0]);
						
					}else{
						that.getView().getModel("IpeEntitySet").setProperty('/',[]);
						that.getView().getModel("temp").setProperty('/NewIPE', "X");
					}
					//that.controlSwitch(results);
					// if (results.ZFlContOrd == "X") {
					// 	that.getView().byId("switch").setState(true) 
						
					// }else{
					// 	that.getView().byId("switch").setState(false) 
					// }

				},
				error: function (error) {
					//that.getView().getModel("temp").setProperty(sProperty,[]);
					//that.destroyBusyDialog();
					console.log(error);
				}

			});
			//this.viewHeaderIpe();
		},

		// callPrevisioniEntity:function () {
		// 	var that = this;
		// 	var oMdl = new sap.ui.model.json.JSONModel();
		// 	this.getOwnerComponent().getModel().read("/PrevisioneImpegnoSet", {
		// 		filters: [],
		// 		urlParameters: "",
		// 		success: function (data) {
		// 			oMdl.setData(data.results);
		// 			that.getView().getModel("temp").setProperty('/PrevisioneImpegnoSet', data.results)
		// 		},
		// 		error: function (error) {
		// 			//that.getView().getModel("temp").setProperty(sProperty,[]);
		// 			//that.destroyBusyDialog();
		// 			var e = error;
		// 		}
		// 	});


		// },

		viewHeaderIpe: function (oEvent) {
			var url = location.href
			var sUrl = url.split("/wizard/")[1]
			var aValori = sUrl.split(",")

			var Zammin = aValori[0]
			var Fikrs = aValori[1]
			var ZCodGius = aValori[2]
			var Bukrs = aValori[3]
			var Gjahr = aValori[4]
			var ZNumCla = aValori[5]
			var Zregistrato = aValori[6]
			var ZCodIpe = aValori[7]
			var Zufficioliv1 = aValori[8]
			var Zufficioliv2 = aValori[9]

			// var header = this.getView().getModel("temp").getData().IpeEntitySet.oData
			// for (var i = 0; i < header.length; i++) {
			// 	if (header[i].Zammin == Zammin &&
			// 		header[i].Fikrs == Fikrs &&
			// 		header[i].ZCodGius == ZCodGius &&
			// 		header[i].Bukrs == Bukrs &&
			// 		header[i].Gjahr == Gjahr &&
			// 		header[i].ZNumCla == ZNumCla &&
			// 		header[i].Zregistrato == Zregistrato &&
			// 		header[i].ZCodIpe == ZCodIpe &&
			// 		header[i].Zufficioliv1 == Zufficioliv1 &&
			// 		header[i].Zufficioliv1 == Zufficioliv2 ){
			var header = this.getView().getModel("temp").getData().IpeEntitySet
			for (var i = 0; i < header.length; i++) {

				if (header[i].Zammin == oEvent.getParameters().arguments.campo &&
					header[i].Fikrs == oEvent.getParameters().arguments.campo1 &&
					header[i].ZCodGius == oEvent.getParameters().arguments.campo2 &&
					header[i].Bukrs == oEvent.getParameters().arguments.campo3 &&
					header[i].Gjahr == oEvent.getParameters().arguments.campo4 &&
					header[i].ZNumCla == oEvent.getParameters().arguments.campo5 &&
					header[i].Zregistrato == oEvent.getParameters().arguments.campo6 &&
					header[i].ZCodIpe == oEvent.getParameters().arguments.campo7 &&
					header[i].Zufficioliv1 == oEvent.getParameters().arguments.campo8 &&
					header[i].Zufficioliv2 == oEvent.getParameters().arguments.campo9) {




					var Eserc = header[i].Gjahr
					this.getView().byId("eserecizio1").setText(Eserc)

					var Amm = header[i].Zammin
					this.getView().byId("amm1").setText(Amm)

					var beneficiario = header[i].Lifnr
					this.getView().byId("Ben1H").setText(beneficiario)


					// var ragioneria = header[i].//ragioneria
					// this.getView().byId("rag1").setText(ragioneria)

					var ipe = header[i].ZCodIpe
					this.getView().byId("Ipe1H").setText(ipe)

					// var totImpen = header[i].
					// this.getView().byId("totImp1").setText(totImpen)

					// var ricAsse = header[i].
					// this.getView().byId("ricAss1").setText(ricAsse)




				}
			}

		},
// callIpeEntity:function () {

// 			var that = this,
// 			oModel = that.getOwnerComponent().getModel(),
// 			oTempModel = that.getOwnerComponent().getModel("temp"),
// 			aFilters = [];

// 			this.getOwnerComponent().getModel("IpeEntitySet").setProperty('/' ,[])

// 			aFilters.push(
// 			  new Filter({path: "Bukrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Ente }),
// 			  new Filter({path: "Fikrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria }),
// 			  new Filter({path: "Gjahr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Esercizio }),
// 			  new Filter({path: "Zammin", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Amministrazione }),
// 			  new Filter({path: "Zcoddecr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroDecreto }),
// 			  new Filter({path: "Zufficioliv1", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1 }),
// 			  new Filter({path: "Zufficioliv2", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv2 }),
// 			  new Filter({path: "ZCodGius", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo })
// 			  );


// 			oModel.read("/IpeEntitySet", {
// 				filters: aFilters,
// 				urlParameters: "",
// 				success: function (data) {
// 					var results = data.results;
// 					if(results.length > 0){
// 						var mnth = ("0" + (results[0].Zzdatastipula.getMonth() + 1)).slice(-2),
//                         day = ("0" + results[0].Zzdatastipula.getDate()).slice(-2);

// 						var nData = [results[0].Zzdatastipula.getFullYear(), mnth, day].join("-");
// 						results[0].Zzdatastipula = nData.split("-").reverse().join(".");

// 						that.getView().getModel("IpeEntitySet").setProperty('/', results[0]);
// 					}else{
// 						that.getView().getModel("IpeEntitySet").setProperty('/',[]);
// 						that.getView().getModel("temp").setProperty('/NewIPE', "X");
// 					}

// 				},
// 				error: function (error) {
// 					//that.getView().getModel("temp").setProperty(sProperty,[]);
// 					//that.destroyBusyDialog();
// 					console.log(error);
// 				}
// 			});
// 		},


		callCountryEntity:function () {
			var that = this;
			var oMdl = new sap.ui.model.json.JSONModel();
			this.getOwnerComponent().getModel().read("/CountryMatchCodeSet", {
				filters: [],
				urlParameters: "",
				success: function (data) {
					oMdl.setData(data.results);
					that.getView().getModel("temp").setProperty('/CountryMatchCodeSet', data.results)
				},
				error: function (error) {
					//that.getView().getModel("temp").setProperty(sProperty,[]);
					//that.destroyBusyDialog();
					var e = error;
				}
			});
		//},
			// var that = this,
			// oModel = that.getOwnerComponent().getModel()
			// //oTempModel = that.getOwnerComponent().getModel("temp"),
			// //this.getOwnerComponent().getModel("CountryMatchCodeSet")




			// oModel.read("/CountryMatchCodeSet", {
			// 	urlParameters: "",
			// 	success: function(data, oResponse){
			// 		var oModelJson = new sap.ui.model.json.JSONModel();
			// 		  oModelJson.setData(data.results);
			// 		   that.getView().getModel("temp").setProperty('/CountryMatchCodeSet', oModelJson);
			// 		   //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
			// 		 },
			// 		  error: function(error){
			// 	var e = error;}
			//  });

		},
		callBeneficiarioEntity:function () {

			var that = this,
			oModel = that.getOwnerComponent().getModel()
			var lifnr = this.getView().byId("beneficiario1").getValue()
			//var oTempModel = that.getOwnerComponent().getModel("temp");
			//var lifnr = oTempModel.getProperty("/ContrattoSet").Lifnr;
			//oTempModel = that.getOwnerComponent().getModel("temp"),
			//this.getOwnerComponent().getModel("CountryMatchCodeSet")
			var path = oModel.createKey("/BeneficiarioEntitySet", {
				// Lifnr:'0010000499'
				Lifnr: lifnr
			})


			oModel.read(path, {
				urlParameters: "",
				success: function(data, oResponse){
					var oModelJson = new sap.ui.model.json.JSONModel();
					  oModelJson.setData(data.results);
					   that.getView().getModel("Beneficiario").setProperty('/beneficiario', data.results);
					   //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
					 },
					  error: function(error){
				var e = error;}
			 });

		},

		// callAnnoAmm:function (entity) {
		// 	var that = this,
		// 	oModel = that.getOwnerComponent().getModel()
		// 	//oTempModel = that.getOwnerComponent().getModel("temp"),
		// 	//this.getOwnerComponent().getModel("CountryMatchCodeSet")
		// 	a
		//    for (let index = 0; index < array.length; index++) {
		// 	const element = array[index];

		//    }



		// 	oModel.read("/ContrattoSet", {
		// 		urlParameters: "",
		// 		success: function(data, oResponse){
		// 			var oModelJson = new sap.ui.model.json.JSONModel();
		// 			  oModelJson.setData(data.results);
		// 			   that.getView().getModel("temp").setProperty('/ContrattoSet', oModelJson);
		// 			   //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
		// 			 },
		// 			  error: function(error){
		// 		var e = error;}
		// 	 });


		// },
		callEsigibilitaEntity:function (risultati) {
			var that = this,
			oModel = that.getOwnerComponent().getModel()
           var oTempModel = that.getOwnerComponent().getModel("temp");
		   var Auth=risultati[0].Fincode
			var Anno = oTempModel.getData().SelectedDecree.Esercizio
			var Pfinan = sap.ui.getCore().byId("PosizFin").getText()
			var StramminRes = sap.ui.getCore().byId("StruttAmmin").getText()
			var dataScad = '12.31.' + Anno
			var DataScadenza = new Date(dataScad),
			mnth = ("0" + (DataScadenza.getMonth() + 1)).slice(-2),
			day = ("0" + DataScadenza.getDate()).slice(-2);
		  var nData = [DataScadenza.getFullYear(), mnth, day].join("-");
		  dataScad = new Date(nData)


            var path = oModel.createKey("/EsigibilitaSet", {
				Autorizzazione:Auth,
				NumeroPni:'',
				Epr:'',
				Gjahr:Anno,
				Fdatk: nData  ,
				Fipex: Pfinan,
				Fistl: StramminRes
			})

			oModel.read(path, {
				urlParameters: "",
				success: function(data, oResponse){
					var oModelJson = new sap.ui.model.json.JSONModel();
					  oModelJson.setData(data);
					   that.getView().getModel("temp").setProperty('/EsigibilitaSet', data);

					 },
					  error: function(error){
				var e = error;}
			 });

		},

		callContrattoEntity:function () {
			var that = this
			var oModel = that.getOwnerComponent().getModel()
			 var oTempModel = this.getView().getModel("temp")
			 var oIpeEntitySet = this.getView().getModel("IpeEntitySet")
			var oTempModel = that.getOwnerComponent().getModel("temp");
			var Zzammin = oTempModel.getProperty("/SelectedDecree").Amministrazione;
		    var Zzanno = oTempModel.getProperty("/SelectedDecree").Esercizio
			// var oModel = that.getOwnerComponent().getModel()
		    // var oTempModel = that.getOwnerComponent().getModel("NewIpe")
		    // this.getOwnerComponent().getModel("IpeEntitySet");


			// var aFilters = [];

			// aFilters.push(
			//   new Filter({path: "Zzanno", operator: FilterOperator.EQ, value1: Zzanno }),
			//   new Filter({path: "Zzamministrazione", operator: FilterOperator.EQ, value1: Zzammin })

			// )


			var contratto=this.getView().byId("ValueHelpContratto").getValue()
			var path = oModel.createKey('/ContrattoSet', {
				Ebeln: contratto
			})



			oModel.read(path, {
				filters:[],
				urlParameters: "",
				success: function(data, oResponse){
					var oModelJson = new sap.ui.model.json.JSONModel();
					  oModelJson.setData(data);
					   that.getView().getModel("temp").setProperty('/ContrattoSet', data);
					   that.getContratto(data)
					  //that.callAnnoAmm(data.results);
					   //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
					 },
					  error: function(error){
				var e = error;}
			 });

		},

		callPniEntity:function () {
			var that = this
			var oModel = that.getOwnerComponent().getModel()
			var oTempModel = that.getOwnerComponent().getModel("temp");
			var Anno = oTempModel.getData().SelectedDecree.Esercizio
			var PosFin = this.getView().byId("pFin").getValue();
		        oModel = that.getOwnerComponent().getModel().callFunction("/DeterminaEsigibilita", { // function import name
				method: "GET", // http method
				urlParameters: {"Esercizio" : Anno, "PosizioneFinanziaria" : PosFin }, // function import parameters
				success: function(Value, response) {
					that.getView().getModel("temp").setProperty('/Autorizzazioni', Value);
				}, // callback function for success
				error: function(oError){ } // callback function for error });
			})
		},
		callAuthEntity:function () {
			var that = this
			var oModel = that.getOwnerComponent().getModel()
			// var oTempModel = this.getView().getModel("temp")
			//  var oIpeEntitySet = this.getView().getModel("")
			var oTempModel = that.getOwnerComponent().getModel("temp");
			var Pfinanz = that.getView().byId("pFin").getValue()
			var StrAmm = that.getView().byId("StrAmm").getValue()
		    var Zzanno = oTempModel.getData().SelectedDecree.Esercizio

			// var oModel = that.getOwnerComponent().getModel()
		    // var oTempModel = that.getOwnerComponent().getModel("NewIpe")
		    // this.getOwnerComponent().getModel("IpeEntitySet");


			var aFilters = [];

			aFilters.push(
			  new Filter({path: "Anno", operator: FilterOperator.EQ, value1: Zzanno }),
			  new Filter({path: "Fipex", operator: FilterOperator.EQ, value1: Pfinanz }),
			  new Filter({path: "Fictr", operator: FilterOperator.EQ, value1: StrAmm })
			)



			// var path = oModel.createKey('/ContrattoSet', {
			// 	Ebeln: this.getView().byId("ValueHelpContratto").getValue()
			// })
            // var Ebeln=this.getView().byId("ValueHelpContratto").getValue()



			oModel.read("/AutorizzazioneSet", {
				filters:aFilters,
				urlParameters: "",
				success: function(data, oResponse){
					var oModelJson = new sap.ui.model.json.JSONModel();
					  oModelJson.setData(data);
					   that.getView().getModel("temp").setProperty('/AutorizzazioneSet', data.results);
					   var risultati=data.results
					   that.getPosStr(risultati)
					/    that.callEsigibilitaEntity(risultati)
					  //that.callAnnoAmm(data.results);
					   //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
					 },

					  error: function(error){
				var e = error;}

			 });


		},
		callNaturaAttoEntity:function (oEvent) {

			var that = this,
			oModel = that.getOwnerComponent().getModel()
			oModel.read('/NaturaAttoSet', {
				urlParameters: "",
				success: function(data, oResponse){
					var oModelJson = new sap.ui.model.json.JSONModel();
					  oModelJson.setData(data.results);
					   that.getView().getModel("temp").setProperty('/NaturaAttoSet', data.results);

					 },
					  error: function(error){
				var e = error;}
			 });

		},
		callModPagEntity:function () {
			var that = this;
			var oMdl = new sap.ui.model.json.JSONModel();
            var Lifnr= "0010000621"
			var aFilters = [];

			aFilters.push(
			  new Filter({path: "Lifnr", operator: FilterOperator.EQ, value1: Lifnr })
			
			)
			
			
			this.getOwnerComponent().getModel().read( '/ZwelsBenSet',{
				filters: aFilters,
				urlParameters: "",
				success: function (data) {
					oMdl.setData(data.results);
					that.getView().getModel("temp").setProperty('/ZwelsBenSet', data.results)

				},
				error: function (error) {
					//that.getView().getModel("temp").setProperty(sProperty,[]);
					//that.destroyBusyDialog();
					var e = error;
				}
			});


		},

		callIndReiscrizioneEntity:function (oEvent) {

			var that = this,
			oModel = that.getOwnerComponent().getModel()
			var path = oModel.createKey('/IndReiscrizioneSet', {
				Fipex: this.getView().byId("pFin").getValue()
			})

			oModel.read(path, {
				urlParameters: "",
				success: function(data){
					var oModelJson = new sap.ui.model.json.JSONModel();
					  oModelJson.setData(data.results);
					   that.getView().getModel("temp").setProperty('/IndReiscrizione', data);

					 },
					  error: function(error){
				var e = error;}
			 });

			},

		////////////////////////////////////////////////////////////
		//	DIALOG
		////////////////////////////////////////////////////////////

		openDialog: function (dialogPath) {
			if (!this.__dialog) {
				this.__dialog = sap.ui.xmlfragment(dialogPath, this);
				this.getView().addDependent(this.__dialog);
			}
			return this.__dialog;
		},

		// openDialog1: function (dialogPath) {
		// 	if (!this.__dialog) {
		// 		this.__dialog = sap.ui.xmlfragment(dialogPath, this);
		// 		this.getView().addDependent(this.__dialog);
		// 	}
		// 	return this.__dialog;
		// },

		// openDialog2: function (dialogPath) {
		// 	if (!this.__dialog) {
		// 		this.__dialog = sap.ui.xmlfragment(dialogPath, this);
		// 		this.getView().addDependent(this.__dialog);
		// 	}
		// 	return this.__dialog;
		// },

		// openDialog3: function (dialogPath) {
		// 	if (!this.__dialog) {
		// 		this.__dialog = sap.ui.xmlfragment(dialogPath, this);
		// 		this.getView().addDependent(this.__dialog);
		// 	}
		// 	return this.__dialog;
		// },

		closeDialog: function() {
			if (this.__dialog) {
				if( this.__dialog.close ) {
					this.__dialog.close();
				}
				this.__dialog.destroy();
				this.__dialog = null;
			}
		},

		openExpandDialog: function (dialogPath) {
            if (!this.__dialog2) {
                this.__dialog2 = sap.ui.xmlfragment(dialogPath, this);
                this.getView().addDependent(this.__dialog2);
            }
            return this.__dialog2;
        },
        closeExpandDialog: function() {
            if (this.__dialog2) {
                if( this.__dialog2.close ) {
                    this.__dialog2.close();
                }
                this.__dialog2.destroy();
                this.__dialog2 = null;
            }
        },

		handleCountryValueHelp: function(oEvent){

			var oSource = oEvent.getSource(),
				oValue= oSource.getValue(),
				//sField = oEvent.getSource().data("filterTableField"),
				sName = oSource.data("FieldName");
				this.callCountryEntity();

			var oDialog = this.openExpandDialog("gestione1.fragment.Help." + sName).open();

		},
		handleContractValueHelp: function(oEvent){

			var oSource = oEvent.getSource(),
				oValue= oSource.getValue(),
				//sField = oEvent.getSource().data("filterTableField"),
				sName = oSource.data("FieldName");
	            var Zzanno = this.getView().byId("es_decreto").getSelectedKey();
				this.callContrattoEntity(Zzanno);

			var oDialog = this.openDialog("gestione1.fragment.Help." + sName).open();

		},
		handleBenValueHelp: function(oEvent){

			var oSource = oEvent.getSource(),
				oValue= oSource.getValue(),
				//sField = oEvent.getSource().data("filterTableField"),
				sName = oSource.data("FieldName");
	            this.callBeneficiarioEntity();

			var oDialog = this.openDialog("gestione1.fragment.Help.ValueHelp" + sName).open();

		},

		handleValueHelp: function(oEvent){

			var oSource = oEvent.getSource(),
				oValue= oSource.getValue(),
				//sField = oEvent.getSource().data("filterTableField"),
				sName = oSource.data("FieldName");

			var oDialog = this.openDialog("gestione1.fragment.Help.ValueHelp" + sName).open();

		},
		_handleValueHelpContractClose : function (evt) {

			var that = this,
			oSelectedItem = evt.getParameter("selectedItem"),
			sField = evt.getSource().data("filterTableField"),
			Input = this.getView().byId(sField);

			if (oSelectedItem) {
				var sValueTitle = oSelectedItem.getTitle();
				Input.setValue(sValueTitle);
				this.getView().getModel("ContrattoSet").setProperty('/Ebeln' ,sValueTitle);
				this.getOtherData(sValueTitle);
			}
			this.closeDialog();
		},
		_handleValueHelpContactCloseCountry : function (evt) {

			var that = this,
			oSelectedItem = evt.getParameter("selectedItem"),
			sField = evt.getSource().data("filterTableField"),
			Input = sap.ui.getCore().byId(sField);

			if (oSelectedItem) {
				var sValueTitle = oSelectedItem.getTitle();
				Input.setValue(sValueTitle);
				//sap.ui.getCore().getModel("CountryMatchCodeSet").setProperty('/Code' ,sValueTitle);
				this.getOtherData(sValueTitle);
			}
			this.closeExpandDialog();
		},

		_handleValueHelpCloseBen: function (evt) {

			var that = this,
			oSelectedItem = evt.getParameter("selectedItem"),
			sField = evt.getSource().data("filterTableField"),
			Input = this.getView().byId(sField),
			oTempModel = this.getView().getModel("temp"),
			oMock = this.getView().getModel("comboBox");

			if (oSelectedItem) {
				var sValueTitle = oSelectedItem.getTitle(),
				key = oSelectedItem.data("key"),
				oItem = _.findWhere(oMock.getProperty("/Beneficiario"), {id: key});

				Input.setValue(sValueTitle);
				this._setBeneficiario(oItem);


				oTempModel.setProperty("/Step2", oItem);


			}
			this.closeDialog();
		},

		_setBeneficiario: function (oItem) {

			this.getView().getModel("IpeEntitySet").setProperty('/Lifnr' ,oItem.id);
			this.getView().getModel("IpeEntitySet").setProperty('/NameFirst' ,oItem.nome);
			this.getView().getModel("IpeEntitySet").setProperty('/NameLast' ,oItem.cognome);
			this.getView().getModel("IpeEntitySet").setProperty('/ZzragSoc' ,oItem.Rsociale);
			this.getView().getModel("IpeEntitySet").setProperty('/Stcd1' ,oItem.cf);
			this.getView().getModel("IpeEntitySet").setProperty('/Stcd2' ,oItem.IVA);
			this.getView().getModel("IpeEntitySet").setProperty('/Taxnumxl' ,oItem.cfe);
			this.getView().getModel("IpeEntitySet").setProperty('/Zwels' ,oItem.id_pag);
			this.getView().getModel("IpeEntitySet").setProperty('/Iban' ,oItem.iban);


		},


		_handleValueHelpClose : function (evt) {

			var that = this,
			oSelectedItem = evt.getParameter("selectedItem"),
			sField = evt.getSource().data("filterTableField"),
			Input = this.getView().byId(sField);

			if (oSelectedItem) {

				var sValueTitle = oSelectedItem.getTitle();
				Input.setValue(sValueTitle);

			}

			this.closeDialog();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		navToHome: function() {
			this.getOwnerComponent().getRouter().navTo("View1");
			this.getView().getModel("temp").setProperty("/SelectedDecree",[]);
			var oTempModel = this.getView().getModel("temp");
			oTempModel.setProperty("/draft","");
			location.reload()
		}

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */


	});

});