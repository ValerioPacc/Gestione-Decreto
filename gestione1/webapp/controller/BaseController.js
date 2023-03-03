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