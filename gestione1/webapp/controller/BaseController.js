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

	return Controller.extend("sap.btp.sapui5.controller.BaseController", {
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
				{columnLabel: "PNI",columnName:"Geber"},
				{columnLabel: "Clausula" + oYears[0],columnName:"ZclausolaVar"+ oYears[0]}, 
				{columnLabel: "Disponobilità PNI"+ oYears[0], columnName:"Wtfree"+ oYears[0]}, 
				{columnLabel: ""+ oYears[0], columnName:"ZImpIpeCl"+ oYears[0]}, 
				{columnLabel: "Disponobilità di cassa"+ oYears[0], columnName:"Zcassa"+ oYears[0]},
				{columnLabel: "Clausula" + oYears[1],columnName:"ZclausolaVar"+ oYears[1]}, 
				{columnLabel: "Disponobilità PNI"+ oYears[1], columnName:"Wtfree"+ oYears[1]}, 
				{columnLabel: ""+ oYears[1], columnName:"ZImpIpeCl"+ oYears[1]}, 
				{columnLabel: "Disponobilità di cassa"+ oYears[1], columnName:"Zcassa"+ oYears[1]},
				{columnLabel: "Clausula" + oYears[2],columnName:"ZclausolaVar"+ oYears[2]}, 
				{columnLabel: "Disponobilità PNI"+ oYears[2], columnName:"Wtfree"+ oYears[2]}, 
				{columnLabel: ""+ oYears[2], columnName:"ZImpIpeCl"+ oYears[2]}, 
				{columnLabel: "Disponobilità di cassa"+ oYears[2], columnName:"Zcassa"+ oYears[2]},
				{columnLabel: "Clausula" + oYears[3],columnName:"ZclausolaVar"+ oYears[3]}, 
				{columnLabel: "Disponobilità PNI"+ oYears[3], columnName:"Wtfree"+ oYears[3]}, 
				{columnLabel: ""+ oYears[3], columnName:"ZImpIpeCl"+ oYears[3]}, 
				{columnLabel: "Disponobilità di cassa"+ oYears[3], columnName:"Zcassa"+ oYears[3]}
			  ];

			  return aColumnData;
            
        },

		getRowsData: function (Aut, cols){
			var oEsigModel = this.getOwnerComponent().getModel("Esigibilita");

			oEsigModel.setProperty('/', []); 
			var arr = [];
			for( var i in cols){
				var item = cols[i];
				oEsigModel.setProperty("/"+ item.columnName, "pippo"); 
				
			}
			
			oEsigModel.setProperty('/Geber', Aut); 
			arr.push(oEsigModel.getProperty('/'));
			return arr;
		},

		

		callIpeEntity:function () {
   
			var that = this,
			oModel = that.getOwnerComponent().getModel(),
			oTempModel = that.getOwnerComponent().getModel("temp"),
			aFilters = [];

			this.getOwnerComponent().getModel("IpeEntitySet").setProperty('/' ,[])
		   
			aFilters.push(
			  new Filter({path: "Bukrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Ente }),
			  new Filter({path: "Fikrs", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria }),
			  new Filter({path: "Gjahr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Esercizio }),
			  new Filter({path: "Zammin", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").Amministrazione }),
			  new Filter({path: "Zcoddecr", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").NumeroDecreto }),
			  new Filter({path: "Zufficioliv1", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1 }),
			  new Filter({path: "Zufficioliv2", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").UfficioLiv2 }),
			  new Filter({path: "ZCodGius", operator: FilterOperator.EQ, value1: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo })
			  );
	
	
			oModel.read("/IpeEntitySet", {
				filters: aFilters,
				urlParameters: "",
				success: function (data) {
					var results = data.results;
					if(results.length > 0){
						var mnth = ("0" + (results[0].Zzdatastipula.getMonth() + 1)).slice(-2),
                        day = ("0" + results[0].Zzdatastipula.getDate()).slice(-2);

						var nData = [results[0].Zzdatastipula.getFullYear(), mnth, day].join("-");
						results[0].Zzdatastipula = nData.split("-").reverse().join(".");

						that.getView().getModel("IpeEntitySet").setProperty('/', results[0]); 
					}else{
						that.getView().getModel("IpeEntitySet").setProperty('/',[]); 
						that.getView().getModel("temp").setProperty('/NewIPE', "X");
					}
					
				},
				error: function (error) {
					//that.getView().getModel("temp").setProperty(sProperty,[]);
					//that.destroyBusyDialog();
					console.log(error);
				}
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
		
		closeDialog: function() {
			if (this.__dialog) {
				if( this.__dialog.close ) {
					this.__dialog.close();
				}
				this.__dialog.destroy();
				this.__dialog = null;
			}
		},

		handleValueHelp: function(oEvent){
				
			var oSource = oEvent.getSource(),
				oValue= oSource.getValue(),
				sName = oSource.data("FieldName");
	
			var oDialog = this.openDialog("gestione1.fragment.Help.ValueHelp" + sName).open();
			
		},
		_handleValueHelpContactClose : function (evt) {
						
			var that = this,
			oSelectedItem = evt.getParameter("selectedItem"),
			sField = evt.getSource().data("filterTableField"),
			Input = this.getView().byId(sField);
			
			if (oSelectedItem) {			
				var sValueTitle = oSelectedItem.getTitle();
				Input.setValue(sValueTitle);
				this.getView().getModel("IpeEntitySet").setProperty('/Ebeln' ,sValueTitle); 
				this.getOtherData(sValueTitle);
			}
			this.closeDialog();
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
		}

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		

	});

});