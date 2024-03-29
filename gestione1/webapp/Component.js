/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "gestione1/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("gestione1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                var sRootPath = jQuery.sap.getModulePath("gestione1");

                /*** IMPORT CUSTOM LIBS ***/
                jQuery.getScript(sRootPath + "/utils/underscore-min.js");
                ;

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(models.createTempModel(), "temp");
                // set the Decreto model
                // this.setModel(models.createListaModel(), "Lista");
                // // set the Dettaglio modelù
                // this.setModel(models.createDetailModel(), "Dettaglio");
                // // set the Dettaglio modelù
                // this.setModel(models.createLifnrModel(), "Beneficiario");
                // set the Ipe model
                this.setModel(models.createIPEModel(), "IpeEntitySet");
                // set the Esig model
                this.setModel(models.createEsigModel(), "Esigibilita");
                // set the Previsioni model
                this.setModel(models.createPrevModel(), "Previsioni");
                // set the Clausola model
                this.setModel(models.createClausModel(), "Clausola");

                this.setModel(models.createcomboJSONModel(), "comboBox");
            }
        });
    }
);