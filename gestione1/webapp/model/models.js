sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },
        createTempModel: function() {
            var oModel = {
                draft: "",
                Step1:[],
                Step2:[],
                NewIPE:"",
                Esig: []
            };
            
            return new JSONModel(oModel)
        },

        createIPEModel: function () {
            var oModel = {};
			return new JSONModel(oModel);
		},



        createEsigModel: function () {
            var oModel = {
                List:[]
            };
			return new JSONModel(oModel);
		},
    };
});