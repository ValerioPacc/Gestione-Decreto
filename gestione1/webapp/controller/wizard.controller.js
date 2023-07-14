sap.ui.define(
  [
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/core/library",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/SearchField",
    'gestione1/model/DateFormatter',
    "sap/m/Label",
    "sap/m/Text"


  ],
  function (BaseController, CoreLibrary, JSONModel, MessageBox, syncStyleClass, Fragment, Filter, FilterOperator, SearchField, DateFormatter, Label, TextView) {
    "use strict";
    var iTimeoutId;
    var ValueState = CoreLibrary.ValueState,

      oData = new JSONModel({
        FilterSwitch1: false,
        FilterSwitch2: true,
        header1Visible: true,
        HeaderNIWstep3Visible: true,
        ReiscrSwitch: false
      });



    return BaseController.extend("gestione1.controller.wizard", {
      _year40: 40,
      _lastNumClausola: 0,
      onInit() {
        this.callEsercizioEntity()
        this.callIpeEntity();
        this.callModPagEntity()
        this.callNaturaAttoEntity();
        this.callModPagEntity()
        this.callContrattoEntity()
        this.callPniEntity()
        this.callIndReiscrizioneEntity()

        // this.callAuthEntity()
        // this.callPrevisioniEntity()


        this.getView().getModel("comboBox")


        var oProprietà = new JSONModel(),
          oInitialModelState = Object.assign({}, oData);
        oProprietà.setData(oInitialModelState);
        this.getView().setModel(oProprietà);
        this._iSelectedStepIndex = 0;
        this.controlSwitch();
        this.controlHeader();
        var oModel = new sap.ui.model.json.JSONModel("../mock/comboBox.json");
        this.getView().setModel(oModel, "comboBox");
        var UIStateModel = new JSONModel();
        var UIStateData = {
          visible: false
        };
        UIStateModel.setData(UIStateData);
        this.getView().setModel(UIStateModel, "UIState");


        this.checkStep1Fields;

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



      onListSelect: function (event) {
        var oSelectedKey = this.getView().byId('mPag').getSelectedKey();

        this.getView().getModel("comboBox").setProperty('/Zwels', oSelectedKey);

        if (oSelectedKey === '2') {
          this.getView().byId('labelCS').setRequired(true);
        } else {
          this.getView().byId('labelCS').setRequired(false);
        }

      },

      handleChange: function () {
        var oProprietà = this.getView().getModel();
        var stato = this.getView().byId("IndReiscrizione").getState();
        if (stato) {
          //oProprietà.setProperty("/ReiscrSwitch", true);
          this.getView().byId("Reiscrizione").setVisible(true)



        }
        else {
          //oProprietà.setProperty("/ReiscrSwitch");
          this.getView().byId("Reiscrizione").setVisible(false)
        }
      },
      onBackButton: function () {
        this._oWizard = this.byId("CreateProductWizard");
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        //console.log(this._iSelectedStepIndex)
        if (this._iSelectedStepIndex == 0) {
          //console.log(this.getOwnerComponent().getRouter().navTo("View1"))
          this._iSelectedStepIndex = 0
          //this.navToHome();
          window.history.go(-1);
          //this.getView().byId("").setVisible(false);
          return;
        }
        var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
        if (this._oSelectedStep && !this._oSelectedStep.bLast) {
          this._oWizard.goToStep(oNextStep, true);
        } else {
          this._oWizard.previousStep();
        }
        this._iSelectedStepIndex--
        this._oSelectedStep = oNextStep;
        //this.controlHeader();

        //this.controlPreNI();
        //this.controlHeader()
      },

      onNextButton: function () {
        var es_decreto = this.getView().byId("es_decreto").getSelectedKey()
        var amm = this.getView().byId("ammin1").getValue()
        var Ncontratto = this.getView().byId("ValueHelpContratto").getValue()
        var Dstipula = this.getView().byId("Dstipula").getValue()
        var beneficiario = this.getView().byId("beneficiario1").getValue()
        var mPag = this.getView().byId("mPag").getSelectedItem()
        var stato = this.getView().byId("switch").getState();


        if (es_decreto == "" && amm == "" && Ncontratto == "" && Dstipula == "") {
          MessageBox.error("Campi obbligatori non inseriti!", {
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          })
        }
        else if (es_decreto == "") {
          MessageBox.error("Campo Esercizio obbligatorio non inserito!", {
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          })
        }
        else if (amm == "") {
          MessageBox.error("Campo Amministrazione obbligatorio non inserito!", {
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          })
        }
        //   else if (beneficiario == "") {
        //     MessageBox.error("Campo Beneficiario obbligatorio non inserito!", {
        //         actions: [sap.m.MessageBox.Action.OK],
        //         emphasizedAction: MessageBox.Action.OK,
        //     })
        // }
        //   else if (mPag == "") {
        //     MessageBox.error("Campo Modalità di Pagamento obbligatorio non inserito!", {
        //         actions: [sap.m.MessageBox.Action.OK],
        //         emphasizedAction: MessageBox.Action.OK,
        //     })
        // }
        else if (Ncontratto == "" && stato == true) {
          MessageBox.error("Campo N. Contratto obbligatorio non inserito!", {
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          })
        }
        else if (Dstipula == "" && stato == true) {
          MessageBox.error("Campo Data Stipula obbligatorio non inserito!", {
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          })
        }

        else {
          this._oWizard = this.byId("CreateProductWizard");
          this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
          this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
          var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

          if (this._oSelectedStep && !this._oSelectedStep.bLast) {
            this._oWizard.goToStep(oNextStep, true);
          } else {
            this._oWizard.nextStep();
          }
        }
        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;
        //this.controlHeader();
        if (this.getView().byId("ValueHelpContratto").getValue() != "") {
          var ben = this.getView().byId("beneficiario").getValue()
          this.getView().byId("beneficiario1").setValue(ben)

        }
        this._oWizard = this.byId("CreateProductWizard");
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);

        if (this._iSelectedStepIndex == 5) {
          var self = this,
            oTable = self.getView().byId("EsigTable");
          self._lastNumClausola = 0;
          self.getView().getModel("temp").setProperty('/EsigibilitaSet', []);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData({ EsigibilitaSet: [] });
          oTable.setModel(oModel);
          oTable.bindRows("/EsigibilitaSet");

          console.log("ESIGIBILITA'"); //TODO:da canc

          var oTempModel = this.getOwnerComponent().getModel("temp");
          console.log(oTempModel);


          self.fillTableEsigibilita(oTempModel.getProperty("/SelectedDecree").Esercizio);


          var Auth = oTempModel.getData().Autorizzazioni.Value
          if (Auth == "A") {
            self.getView().byId("idPNI").setText("Autorizzazioni")

          }
          var Pf = self.getView().byId("pFin").getValue();
          var StrAmm = self.getView().byId("StrAmm").getValue();
          self.getView().byId("PsFin").setText(Pf);
          self.getView().byId("strAmm").setText(StrAmm);
          // this.callImpClausolaEntity();
        }
        //  if (this._iSelectedStepIndex == 5) {

        //   this.callAuthEntity()

        // }
        // if (this._iSelectedStepIndex == 2) {

        //   var oTempModel = this.getOwnerComponent().getModel("temp");
        //   var Reiscr = oTempModel.getData().IndReiscrizione.CodicePg
        //   if (Reiscr >= "80") {
        //     this.getView().byId("IndR").setVisible(true)
        //     this.getView().byId("IndReiscrizione").setVisible(true)

        //   }

        // }
        // console.log(this._iSelectedStepIndex)
        //this.controlPreNI()

        //this.getView().byId("tabGestNI").setVisible(false);

      },

      fillTableEsigibilita: function (decreYear) {
        var self = this,
          oTable = self.getView().byId("EsigTable"),
          lastYear = parseInt(decreYear) + self._year40;

        if (oTable.getColumns().length > 0)
          return;

        oTable.addColumn(new sap.ui.table.Column({
          label: new sap.m.Label({ text: "" }),
          template: new sap.m.Text({ text: "{autorizzazione}" })
        }));

        for (var i = decreYear; i <= lastYear; i++) {

          oTable.addColumn(new sap.ui.table.Column({
            label: new sap.m.Label({ text: "Clausola" }),
            template: new sap.m.Text({ text: "{" + "nClausola_" + i + "}" }),
            width: '120px'
          }));
          oTable.addColumn(new sap.ui.table.Column({
            label: new sap.m.Label({ text: "Disponibilità" }),
            template: new sap.m.Text({ text: "{" + "wtfree_" + i + "}" }),
            width: '200px'
          }));
          oTable.addColumn(new sap.ui.table.Column({
            label: new sap.m.Label({ text: i }),
            template: new sap.m.Input({
              value: "{" + "importo_" + i + "}",
              submit: function (oEvent) {
                self.esigibilitaImportoSubmit(oEvent);
              },
              customData: [
                new sap.ui.core.CustomData({ key: "fincode", value: "{fincode}", writeToDom: true }),
                new sap.ui.core.CustomData({ key: "pni", value: "", writeToDom: true }),
                new sap.ui.core.CustomData({ key: "annoImporto", value: i.toString(), writeToDom: true })
              ]
            }),
            width: '120px'
          }));
          oTable.addColumn(new sap.ui.table.Column({
            label: new sap.m.Label({ text: "Disponibilità di cassa" }),
            template: new sap.m.Text({ text: "{" + "cassa_" + i + "}" }),
            width: '200px'
          }));
        }
      },

      esigibilitaImportoSubmit: function (oEvent) {
        var self = this,
          importo = !oEvent.getParameters().value || oEvent.getParameters().value === null || oEvent.getParameters().value === "" ? 0 : oEvent.getParameters().value,
          oTable = self.getView().byId("EsigTable"),
          oDataModel = self.getOwnerComponent().getModel(),
          fincode = oEvent.getSource().data("fincode"),
          pni = oEvent.getSource().data("pni"),
          annoImporto = oEvent.getSource().data("annoImporto"),
          fipex = self.getView().byId("pFin").getValue(),
          fistl = self.getView().byId("StrAmm").getValue();

        importo = parseFloat(importo);
        var path = self.getOwnerComponent().getModel().createKey("EsigibilitaSet", {
          Autorizzazione: fincode,
          NumeroPni: pni,
          Epr: "",
          Gjahr: self.getView().getModel("temp").getProperty("/SelectedDecree").Esercizio,
          Fdatk: new Date(annoImporto + "-12-31"),
          Fipex: fipex,
          Fistl: fistl
        });

        self.getOwnerComponent().getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + path, {
              success: function (data, oResponse) {
                console.log(data);
                var currentNClausola = "";
                var arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet');
                if (arrayModel.length > 0 && arrayModel.findIndex((x) => x.fincode === fincode) > -1) {
                  var index = arrayModel.findIndex((x) => x.fincode === fincode);
                  var item = arrayModel[index];
                  console.log(annoImporto);//TODO:da canc
                  if (importo > 0) {
                    if (item["nClausola_" + annoImporto] === "") {
                      self._lastNumClausola = self._lastNumClausola + 1;
                      item["nClausola_" + annoImporto] = DateFormatter.formatterNumClausola(self._lastNumClausola);
                    }
                    item["wtfree_" + annoImporto] = data.Wtfree;
                    item["cassa_" + annoImporto] = data.Cassa;
                  }
                  else {
                    currentNClausola = item["nClausola_" + annoImporto];
                    item["nClausola_" + annoImporto] = "";
                    item["wtfree_" + annoImporto] = "";
                    item["cassa_" + annoImporto] = "";
                    if (currentNClausola !== "" && parseInt(currentNClausola) > 0) {
                      arrayModel = self.ricalcolaNClausola(currentNClausola, arrayModel);
                    }
                  }

                  self.getView().getModel("temp").setProperty('/EsigibilitaSet', arrayModel);
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData({ EsigibilitaSet: arrayModel });
                  oTable.setModel(oModel);
                  oTable.bindRows("/EsigibilitaSet");
                }
              },
              error: function (error) {
                console.log(error);
              },
            });
          });
      },

      removePrevisionbyNClausola: function (zNumCla) {
        var self = this,
          arrayModel = self.getView().getModel("temp").getProperty('/PrevisionSet');
        if (arrayModel && arrayModel.length > 0) {
          var toRemove = arrayModel.filter(x => parseInt(x.ZNumCla) === parseInt(zNumCla));
          toRemove.forEach(x => arrayModel.splice(arrayModel.findIndex(n => n === x), 1));
          self.getView().getModel("temp").setProperty('/PrevisionSet', arrayModel);
        }
      },

      ricalcolaNClausola: function (currentNClausola, arrayModel) {
        var self = this,
          arrayProvision = [];
        //elimino le previsioni che hanno numero clausola === currentNClausola
        self.removePrevisionbyNClausola(currentNClausola);
        arrayProvision = self.getView().getModel("temp").getProperty('/PrevisionSet');
        for (var i = 0; i < arrayModel.length; i++) {
          var item = arrayModel[i];
          var keyNames = Object.keys(item);
          var propsNames = keyNames.filter(x => x.includes("nClausola_"));
          for (var j = 0; j < propsNames.length; j++) {
            if (item[propsNames[j]] !== "" && parseInt(item[propsNames[j]]) > currentNClausola) {
              // Cerco le previsioni
              var indices = [];
              if (arrayProvision && arrayProvision.length > 0) {
                indices = arrayProvision.map((x, index) => {
                  if (parseInt(x.ZNumCla) === parseInt(item[propsNames[j]]))
                    return index
                }).filter(item => item !== undefined);
              }

              item[propsNames[j]] = DateFormatter.formatterNumClausola(parseInt(item[propsNames[j]]) - 1);
              for (var y = 0; y < indices.length; y++) {
                arrayProvision[indices[y]].ZNumCla = item[propsNames[j]]
              }
            }
          }
        }

        if (self._lastNumClausola === 1)
          self._lastNumClausola = 0;
        else
          self._lastNumClausola = self._lastNumClausola - 1;

        console.log(arrayModel); //TODO:da canc
        console.log(arrayProvision);//TODO:da canc
        self.getView().getModel("temp").setProperty('/PrevisionSet', arrayProvision);
        return arrayModel;
      },

      ricalcolaNClausolaFromDeleteButton: function (arrayModel) {
        var self = this,
          appo = [],
          appoProvision = [];

        for (var i = 0; i < arrayModel.length; i++) {
          var item = arrayModel[i];
          var keyNames = Object.keys(item);
          var propsNames = keyNames.filter(x => x.includes("nClausola_"));
          for (var j = 0; j < propsNames.length; j++) {
            if (item[propsNames[j]] !== "" && parseInt(item[propsNames[j]]) > 0) {
              var props = propsNames[j];
              var year = props.substring(10);
              appo.push({
                fincode: item.fincode,
                year: year,
                nClausola: item[propsNames[j]]
              });
            }
          }
        }

        self._lastNumClausola = appo.length;
        if (appo.length === 0)
          return arrayModel;

        appoProvision = self.getProvisionFromDeleteButton(appo);
        //ordino in maniere crescente per nClausola e riassegno il numeratore delle clausole   
        appo = _.sortBy(appo, "nClausola");

        for (var i = 0; i < appo.length; i++) {
          appo[i].nClausola = i + 1;
        }

        //riassegno la numerazione delle nClausola
        for (var i = 0; i < appo.length; i++) {
          var item = arrayModel.filter(x => x.fincode === appo[i].fincode);
          if (item) {
            item = item[0];
            var keyNames = Object.keys(item);
            var prop = keyNames.filter(x => x.includes("nClausola_" + appo[i].year));
            if (prop) {
              self.updateClausolaInProvisionSet(item[prop], appo[i].nClausola);
              item[prop] = DateFormatter.formatterNumClausola(parseInt(appo[i].nClausola));
            }
          }
        }
        return arrayModel;
      },

      updateClausolaInProvisionSet: function (currentNClausola, nextNClausola) {
        var self = this,
          arrayProvision = self.getView().getModel("temp").getProperty('/PrevisionSet');

        var indices = arrayProvision.map((x, index) => {
          if (parseInt(x.ZNumCla) === parseInt(currentNClausola))
            return index
        }).filter(item => item !== undefined);


        for (var i = 0; i < indices.length; i++) {
          var item = arrayProvision[indices[i]];
          item.ZNumCla = DateFormatter.formatterNumClausola(parseInt(nextNClausola));
        }

        self.getView().getModel("temp").setProperty('/PrevisionSet', arrayProvision);
      },

      getProvisionFromDeleteButton: function (remainArray) {
        var self = this,
          array = self.getView().getModel("temp").getProperty('/PrevisionSet'),
          remainPrevision = [];

        for (var i = 0; i < remainArray.length; i++) {
          var remain = remainArray[i];
          var arrs = array.filter(x => parseInt(x.ZNumCla) === parseInt(remain.nClausola));
          remainPrevision = remainPrevision.concat(arrs);
        }
        if (remainPrevision.length > 0)
          remainPrevision = _.sortBy(remainPrevision, "ZNumCla");

        self.getView().getModel("temp").setProperty('/PrevisionSet', remainPrevision);
        return remainPrevision;
      },

      onDelAuth: function (oEvent) {
        var self = this,
          oTable = self.getView().byId("EsigTable"),
          selectedIndex = oTable.getSelectedIndex(),
          arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet');

        if (selectedIndex === -1)
          return false;

        arrayModel.splice(selectedIndex, 1);
        //TODO: cancellare le eventuali previsioni
        if (arrayModel.length === 0) {
          self._lastNumClausola = 0;
          self.getView().getModel("temp").setProperty('/EsigibilitaSet', []);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData({ EsigibilitaSet: [] });
          oTable.setModel(oModel);
          oTable.bindRows("/EsigibilitaSet");
          return;
        }

        arrayModel = self.ricalcolaNClausolaFromDeleteButton(arrayModel);
        self.getView().getModel("temp").setProperty('/EsigibilitaSet', arrayModel);
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({ EsigibilitaSet: arrayModel });
        oTable.setModel(oModel);
        oTable.bindRows("/EsigibilitaSet");
      },

      fillDefaultModelEsigibilità: function (decreYear, auth) {
        var self = this,
          arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet') && self.getView().getModel("temp").getProperty('/EsigibilitaSet').length > 0 ?
            self.getView().getModel("temp").getProperty('/EsigibilitaSet') : [],
          oTable = self.getView().byId("EsigTable"),
          lastYear = parseInt(decreYear) + self._year40;

        if (arrayModel.length === 0 || arrayModel.findIndex((x) => x.fincode === auth.finCode) === -1) {
          var item = {};
          for (var i = decreYear; i <= lastYear; i++) {
            item["autorizzazione"] = "Autorizzazione: " + auth.autDescr,
              item["fincode"] = auth.finCode,
              item["epr_" + i.toString()] = i;
            item["importo_" + i.toString()] = 0;
            item["nClausola_" + i.toString()] = "";
            item["wtfree_" + i.toString()] = "";
            item["cassa_" + i.toString()] = "";
          }
          arrayModel.push(item);
          console.log(arrayModel);//TODO:da canc
          self.getView().getModel("temp").setProperty('/EsigibilitaSet', arrayModel);
        }
      },

      onOpenFragment: function () {

        var oDialog2 = this.openDialog("gestione1.fragment.anagrafica").open();
      },

      onOpenGridTable: function () {
        var self = this,
          previsionWFModel = {},
          arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet'),
          previsionWFModel = self.getView().getModel("previsionWF"),
          minStep = parseInt(self.getView().getModel("temp").getProperty("/SelectedDecree").Esercizio),
          maxStep = minStep + 40;

        if (!previsionWFModel || previsionWFModel !== null) {
          previsionWFModel = {
            clausoleCombo: [],
            previsionAuth: "",
            minStep: minStep,
            maxStep: maxStep,
            stepCurrentYear: "",
            totAnno: 0,
            previsionMonthsSet: []
          };
        } else
          previsionWFModel = previsionWFModel.getData();

        previsionWFModel.clausoleCombo = self.fillClausoleComboModel(arrayModel);
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(previsionWFModel);
        self.getView().setModel(oModel, "previsionWF");

        self.getView().byId("previsionClausola").setSelectedKey("");
        self.getView().byId("previsionStepInput").setEnabled(false);
        self.getView().byId("EsigTable").setVisible(false);
        self.getView().byId("previsionPanel").setVisible(true);
      },

      onBackToEsigibilita: function (oEvent) {
        var self = this;
        self.getView().byId("EsigTable").setVisible(true);
        self.getView().byId("previsionPanel").setVisible(false);
      },

      onPrevisionClausolaChange: function (oEvent) {
        var self = this,
          value = oEvent.getParameters().value,
          esiModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet'),
          arrayModel = self.getView().getModel("temp").getProperty('/PrevisionSet'),
          filledClausole = self.getSelectedClausole(esiModel),
          previsionStepInput = self.getView().byId("previsionStepInput");

        if (value === "") {
          self.getView().getModel("previsionWF").setProperty("/stepCurrentYear", "");
          self.getView().getModel("previsionWF").setProperty("/previsionMonthsSet", []);
          self.getView().getModel("previsionWF").setProperty("/previsionAuth", "");
          self.getView().getModel("previsionWF").setProperty("/totAnno", 0);
          previsionStepInput.setEnabled(false);
          return;
        }

        var index = filledClausole.findIndex((x) => parseInt(x.nClausola) === parseInt(value));
        if (index === -1) {
          self.fillEmptyPrevisionMonths(item, true);
          return false;
        }
        previsionStepInput.setEnabled(true);

        var item = filledClausole[index];
        self.getView().getModel("previsionWF").setProperty("/previsionAuth", item.autorizzazione);

        if (!arrayModel || arrayModel === null || arrayModel.length === 0 || value === "") {
          self.fillEmptyPrevisionMonths(item, true);
          return false;
        }

        var indexRecord = arrayModel.findIndex((x) => parseInt(x.ZNumCla) === parseInt(value));
        if (indexRecord === -1) {
          self.fillEmptyPrevisionMonths(item, true);
          return false;
        }

        var record = arrayModel[indexRecord];
        if (!record || record === null) {
          self.fillEmptyPrevisionMonths(item, true);
          return false;
        }
        else {
          self.fillPrevisionMonths(record, false, record.Totale);
        }
      },

      fillEmptyPrevisionMonths: function (item, clearTotAnno = false, tot = 0) {
        var self = this,
          previsionStepInput = self.getView().byId("previsionStepInput"),
          array = [];

        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "1", month: "Gennaio", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "2", month: "Febbraio", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "3", month: "Marzo", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "4", month: "Aprile", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "5", month: "Maggio", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "6", month: "Giugno", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "7", month: "Luglio", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "8", month: "Agosto", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "9", month: "Settembre", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "10", month: "Ottobre", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "11", month: "Novembre", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "12", month: "Dicembre", importo: parseFloat(0).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.nClausola : null, key: "TOT", month: "TOTALE", importo: parseFloat(tot).toFixed(2) });

        self.getView().getModel("previsionWF").setProperty("/previsionMonthsSet", array);
        previsionStepInput.setValue(item ? item.anno : "");
        if (clearTotAnno)
          self.getView().getModel("previsionWF").setProperty("/totAnno", parseFloat(0).toFixed(2));
        else
          self.getView().getModel("previsionWF").setProperty("/totAnno", item.Annuale ? parseFloat(item.Annuale).toFixed(2) : parseFloat(0).toFixed(2));
      },

      fillPrevisionMonths: function (item, clearTotAnno = false, tot = 0) {
        var self = this,
          previsionStepInput = self.getView().byId("previsionStepInput"),
          array = [];
        console.log(item);

        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "1", month: "Gennaio", importo: parseFloat(item.Gennaio).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "2", month: "Febbraio", importo: parseFloat(item.Febbraio).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "3", month: "Marzo", importo: parseFloat(item.Marzo).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "4", month: "Aprile", importo: parseFloat(item.Aprile).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "5", month: "Maggio", importo: parseFloat(item.Maggio).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "6", month: "Giugno", importo: parseFloat(item.Giugno).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "7", month: "Luglio", importo: parseFloat(item.Luglio).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "8", month: "Agosto", importo: parseFloat(item.Agosto).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "9", month: "Settembre", importo: parseFloat(item.Settembre).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "10", month: "Ottobre", importo: parseFloat(item.Ottobre).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "11", month: "Novembre", importo: parseFloat(item.Novembre).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "12", month: "Dicembre", importo: parseFloat(item.Dicembre).toFixed(2) });
        array.push({/*fincode:item ? item.fincode : null,*/ nClausola: item ? item.ZNumCla : null, key: "TOT", month: "TOTALE", importo: parseFloat(tot).toFixed(2) });
        self.getView().getModel("previsionWF").setProperty("/previsionMonthsSet", array);
        self.getView().getModel("previsionWF").setProperty("/totAnno", item.Annuale ? parseFloat(item.Annuale).toFixed(2) : parseFloat(0).toFixed(2));
        previsionStepInput.setValue(item.Anno);
      },

      previsionWFImportoLiveChange: function (oEvent) {
        var self = this,
          total = 0,
          sValue = oEvent.getParameters().value;

        self.getView().getModel("previsionWF").getObject(
          oEvent.getSource().getParent().getBindingContextPath()
        ).importo = parseFloat(sValue);

        var array = self.getView().getModel("previsionWF").getProperty("/previsionMonthsSet");

        for (var i = 0; i < array.length - 1; i++) {
          var imp = parseFloat(array[i].importo);
          total = total + imp;
        }
        array[12].importo = total.toFixed(2);
        self.getView().getModel("previsionWF").setProperty("/previsionMonthsSet", array);
        self.getView().getModel("previsionWF").setProperty("/totAnno", 0);
      },

      onChangePrevisionYear: function (oEvent) {
        var self = this,
          year = oEvent.getParameters().value,
          previsionClausola = self.getView().byId("previsionClausola"),
          array = self.getView().getModel("temp").getProperty('/EsigibilitaSet'),
          filledClausole = self.getSelectedClausole(array),
          arrayModel = self.getView().getModel("temp").getProperty('/PrevisionSet');

        var index = filledClausole.findIndex((x) => parseInt(x.nClausola) === parseInt(previsionClausola.getSelectedKey()));
        if (index === -1)
          return false;
        var item = filledClausole[index];
        item.anno = year;

        if (!arrayModel || arrayModel === null || arrayModel.length === 0) {
          self.fillEmptyPrevisionMonths(item, true);
        }
        else {
          var index = arrayModel.findIndex(
            (x) => parseInt(x.ZNumCla) === parseInt(previsionClausola.getSelectedKey()) && x.Anno === year.toString()
          );
          if (index === -1) {
            self.fillEmptyPrevisionMonths(item, true);
          }
          else {
            var record = arrayModel[index];
            if (!record || record === null) {
              self.fillEmptyPrevisionMonths(item, true);
            }
            else {
              self.fillPrevisionMonths(record, false, record.Totale);
            }
          }
        }
      },

      previsionWFTotAnnoLiveChange: function (oEvent) {
        var self = this,
          arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet'),
          value = oEvent.getParameters().value,
          previsionClausolaContro = self.getView().byId("previsionClausola");

        if (!previsionClausolaContro.getSelectedKey() || previsionClausolaContro.getSelectedKey() === null || previsionClausolaContro.getSelectedKey() === "")
          return false;

        var filledClausole = self.getSelectedClausole(arrayModel);
        var index = filledClausole.findIndex((x) => parseInt(x.nClausola) === parseInt(previsionClausolaContro.getSelectedKey()));
        if (index === -1)
          return false;

        var item = filledClausole[index];
        self.fillEmptyPrevisionMonths(item, false, value);
        self.getView().getModel("previsionWF").setProperty("/totAnno", parseFloat(value).toFixed(2));
      },

      getSelectedClausole: function (arrayModel) {
        var self = this,
          array = [];
        for (var i = 0; i < arrayModel.length; i++) {
          var item = arrayModel[i];
          var keyNames = Object.keys(item);
          var propsNames = keyNames.filter(x => x.includes("nClausola_"));
          for (var j = 0; j < propsNames.length; j++) {
            if (item[propsNames[j]] !== "") {
              array.push({
                nClausola: item[propsNames[j]],
                anno: propsNames[j].substring(10),
                autorizzazione: item.autorizzazione,
                fincode: item.fincode
              });
            }
          }
        }
        return array;
      },

      fillClausoleComboModel: function (arrayModel) {
        var self = this,
          array = [];
        array.push({ nClausola: "" });
        for (var i = 0; i < arrayModel.length; i++) {
          var item = arrayModel[i];
          var keyNames = Object.keys(item);
          var propsNames = keyNames.filter(x => x.includes("nClausola_"));
          for (var j = 0; j < propsNames.length; j++) {
            if (item[propsNames[j]] !== "") {
              array.push({ nClausola: item[propsNames[j]] });
            }
          }
        }
        console.log(array);//TODO:da canc
        return array;
      },

      onSavePrevisionWF: function (oEvent) {
        var self = this,
          previsionStepInput = self.getView().byId("previsionStepInput"),
          arrayModel = self.getView().getModel("temp").getProperty('/PrevisionSet');

        if (!arrayModel || arrayModel === null || arrayModel.length === 0) {
          self.getView().getModel("temp").setProperty('/PrevisionSet', []);
          arrayModel = [];
        }

        var provision = self.getView().getModel("previsionWF").getProperty("/previsionMonthsSet");
        var totAnno = self.getView().getModel("previsionWF").getProperty("/totAnno");
        console.log(provision); //TODO:da canc

        var item = self.getPrevisionEntity(provision, previsionStepInput.getValue(), totAnno);
        var index = arrayModel.findIndex((x) => parseInt(x.ZNumCla) === parseInt(item.ZNumCla) && x.Anno === item.Anno);
        if (index > -1)
          arrayModel.splice(index, 1);
        arrayModel.push(item);
        arrayModel = _.sortBy(arrayModel, "ZNumCla");
        self.getView().getModel("temp").setProperty('/PrevisionSet', arrayModel);
      },

      getPrevisionEntity: function (data, anno, annualita) {
        var self = this,
          decreto = self.getOwnerComponent().getModel("temp").getData().SelectedDecree,
          object = {
            'ZNumCla': DateFormatter.formatterNumClausola(data[0].nClausola),
            'Anno': anno.toString(),
            'ChiaveGiustificativo': decreto.ChiaveGiustificativo,
            'Annuale': parseFloat(annualita).toFixed(2),
            'Gennaio': parseFloat(data[0].importo).toFixed(2),
            'Febbraio': parseFloat(data[1].importo).toFixed(2),
            'Marzo': parseFloat(data[2].importo).toFixed(2),
            'Aprile': parseFloat(data[3].importo).toFixed(2),
            'Maggio': parseFloat(data[4].importo).toFixed(2),
            'Giugno': parseFloat(data[5].importo).toFixed(2),
            'Luglio': parseFloat(data[6].importo).toFixed(2),
            'Agosto': parseFloat(data[7].importo).toFixed(2),
            'Settembre': parseFloat(data[8].importo).toFixed(2),
            'Ottobre': parseFloat(data[9].importo).toFixed(2),
            'Novembre': parseFloat(data[10].importo).toFixed(2),
            'Dicembre': parseFloat(data[11].importo).toFixed(2),
            'Totale': parseFloat(data[12].importo).toFixed(2)
          };
        return object;
      },

      onOpenDialog1: function () {
        // this.callAuthEntity();
        var self = this;
        var oModel = self.getOwnerComponent().getModel();
        var oTempModel = self.getOwnerComponent().getModel("temp");
        var Pfinanz = self.getView().byId("pFin").getValue();
        var StrAmm = self.getView().byId("StrAmm").getValue();
        var Zzanno = oTempModel.getData().SelectedDecree.Esercizio;
        var flagContratto = self.getView().byId("switch").getState();
        var contratto = self.getView().byId("ValueHelpContratto");

        var aFilters = [];
        aFilters.push(
          new Filter({ path: "Anno", operator: FilterOperator.EQ, value1: Zzanno }),
          new Filter({ path: "Fipex", operator: FilterOperator.EQ, value1: Pfinanz }),
          new Filter({ path: "Fictr", operator: FilterOperator.EQ, value1: StrAmm }),
          new Filter({ path: "FlagContratto", operator: FilterOperator.EQ, value1: flagContratto }),
          new Filter({ path: "Ebeln", operator: FilterOperator.EQ, value1: contratto.getValue() })
          // new Filter({path: "NumeroPni", operator: FilterOperator.EQ, value1: "" })// TODO verrà usato quando si lavorerà sui PNI
        )

        oModel.read("/AutorizzazioneSet", {
          filters: aFilters,
          urlParameters: "",
          success: function (data, oResponse) {
            var oModelJson = new sap.ui.model.json.JSONModel();
            oModelJson.setData(data);
            self.getView().getModel("temp").setProperty('/AutorizzazioneSet', data.results);
            var oDialog1 = self.openDialog("gestione1.fragment.listaPNI").open();
            var risultati = data.results
            self.getPosStr(risultati)
            // that.callImpClausolaEntity(risultati)
            // var oDialog1 = self.openDialog("gestione1.fragment.listaPNI").open();
          },

          error: function (error) {
            console.log(error);
            var e = error;
          }
        });


        // this.callEsigibilitaEntity()
        // if (!this.sFragment) {
        // 	this.sFragment = this.loadFragment({
        // 		name: "gestione1.fragment.listaPNI",
        //     controller: this
        // 	}).then(function (oFragment) {
        //     this.getView().addDependent(oFragment);
        //     return oFragment;
        //   }.bind(this));
        // }
        // var UIStateModel= this.getView().getModel("UIState");
        // var UIStateData= UIStateModel.getData();
        // UIStateData.visible = false;
        // UIStateModel.setData(UIStateData);
        // this.sFragment.then(function(oFragment) {
        // 	oFragment.open();
        // }.bind(this));
        // this.callAuthEntity()

      },
      onOpenDialog2: function () {
        var oDialog3 = this.openDialog("gestione1.fragment.listaERP").open();
        // if (!this.dFragment) {
        // 	this.dFragment = this.loadFragment({
        // 		name: "gestione1.fragment.listaERP",
        //     controller: this
        // 	}).then(function (oFragment) {
        //     this.getView().addDependent(oFragment);
        //     return oFragment;
        //   }.bind(this));
        // } 
        // var UIStateModel= this.getView().getModel("UIState");
        // var UIStateData= UIStateModel.getData();
        // UIStateData.visible = true;
        // UIStateModel.setData(UIStateData);
        // this.dFragment.then(function(oFragment) {
        // 	oFragment.open();
        // }.bind(this));
      },
      onOpenDialogModPag: function () {

        var oDialog3 = this.openDialog("gestione1.fragment.regModPag").open();
      },

      getOtherData: function (value) {

        var oModel = this.getView().getModel("comboBox"),
          oTempModel = this.getView().getModel("temp")
        // rowSelected = _.findWhere(oModel.getProperty("/Contratto"), {id: value}),
        // beneficiario = _.findWhere(oModel.getProperty("/Beneficiario"), {id: rowSelected.id_ben});
        // //country= _.findWhere(oTempModel.getProperty("/CountryMatchCodeSet"));
        var Codice = _.findWhere(oTempModel.getProperty("/CountryMatchCodeSet"), { Code: value })
        if (Codice != undefined) {
          sap.ui.getCore().byId("input").setValue(Codice.Description);


          //valoriNuovi.push(KOSTL.Kostl) }

        }
        // this._setBeneficiario(beneficiario);

        //   if (stato == false) {
        //     this.getView().byId("numConAtt").setValue("");
        //     this.getView().byId("dataAtt").setValue("");

        // }
        // //this.getView().getModel("IpeEntitySet").setProperty('/Zzdatastipula' ,rowSelected.data); 
        // this.getView().getModel("IpeEntitySet").setProperty('/Zzcig' ,rowSelected.cig); 
        // this.getView().getModel("IpeEntitySet").setProperty('/Zzcup' ,rowSelected.cup);
        // this.getView().getModel("IpeEntitySet").setProperty('/Ktwrt' ,rowSelected.importo); 
        //this.getView().getModel("CountryMatchCodeSet").setProperty('/Description' ,country.Description); 
      },

      getContratto: function (data) {
        var nContr = data.Ebeln
        var oTempModel = this.getView().getModel("temp");
        var stato = this.getView().byId("switch").getState();

        if (stato == true) {
          if (nContr != "") {


            var date = new Date(oTempModel.getProperty("/ContrattoSet").Zzdatastipula),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            var nData = [date.getFullYear(), day, mnth].join("-");
            var nDate = nData.split("-").reverse().join("/");


            this.getView().byId("Dstipula").setValue(nDate);
            this.getView().byId("cig").setValue(data.Zzcig);
            this.getView().byId("beneficiario1").setValue(data.Lifnr);
            this.getView().byId("importoCont").setValue(data.Ktwrt);
            this.getView().byId("numConAtt").setValue(data.Ebeln);
            this.getView().byId("dataAtt").setValue(nDate);
            this.getView().byId("idTypeCon").setValue(data.Bsart);
            this.getView().byId("formAgg").setValue(data.Zzgara);

            //valoriNuovi.push(KOSTL.Kostl)
          }
        }
        else {

        }
      },

      getBeneficiario: function (lifnr) {
        var oTempModel = this.getView().getModel("temp");
        //var stato = this.getView().byId("switch").getState();
        var beneficiario = lifnr.Lifnr

        if (beneficiario != "") {



          this.getView().byId("cFiscale").setValue(lifnr.Stcd1);
          this.getView().byId("cFiscaleE").setValue(lifnr.Taxnumxl);
          // this.getView().byId("beneficiario").setValue(data.Lifnr);
          // this.getView().byId("importoCont").setValue(data.Ktwrt);
          // this.getView().byId("numConAtt").setValue(data.Ebeln);
          // this.getView().byId("dataAtt").setValue(nDate);
          // this.getView().byId("idTypeCon").setValue(data.Bsart);
          // this.getView().byId("formAgg").setValue(data.Zzgara);

          //valoriNuovi.push(KOSTL.Kostl)
        }

      },

      getPosStr: function (risultati) {
        var oTempModel = this.getView().getModel("temp")
        var PosizioneFIN = risultati[0].Fipex
        var StrutturaAmmRes = risultati[0].Fictr
        sap.ui.getCore().byId("PosizFin").setText(PosizioneFIN);
        sap.ui.getCore().byId("StruttAmmin").setText(StrutturaAmmRes);

      },


      //  onClickButton1 : function(){
      //    var UIStateModel= this.getView().getModel("UIState");
      //    var UIStateData= UIStateModel.getData();
      //   UIStateData.visible = false;
      //   UIStateModel.setData(UIStateData);

      //  },

      //  onClickButton2 : function(){
      //   var UIStateModel= this.getView().getModel("UIState");
      //   var UIStateData= UIStateModel.getData();
      //   UIStateData.visible = true;
      //   UIStateModel.setData(UIStateData);

      //  },

      onSaveMessageDialogPress: function (oEvent) {

        var sDialog = oEvent.getSource().data("dialog"),
          check = this.checkFields(sDialog);

        if (!check) {
          sap.m.MessageBox.warning("Compilare i campi obbligatori!", {
            title: "Attenzione",                                   // default
            actions: [sap.m.MessageBox.Action.CLOSE],
            styleClass: "",                                      // default
            customIcon: "../img/kOnzy.gif",               // default
            textDirection: sap.ui.core.TextDirection.Inherit,

          })

        } else {

          sap.m.MessageBox.warning("Servizio certificazione beneficiario avviato,in attesa di risposta, si prega di attendere", {
            title: "Procedura avvio richiesta creazione anagrafica beneficiario",                                   // default
            onClose: MessageBox.success("Anagrafica beneficiario creata correttamente"),                                       // default
            styleClass: "",                                      // default
            customIcon: "../img/kOnzy.gif",               // default
            textDirection: sap.ui.core.TextDirection.Inherit,

          })
        }



      },

      onWarning2MessageBoxPress: function () {
        sap.m.MessageBox.warning("Servizio certificazione beneficiario avviato,in attesa di risposta, si prega di attendere", {
          title: "Procedura avvio richiesta creazione anagrafica beneficiario",                                    // default
          onClose: null,                                       // default
          styleClass: "",                                      // default
          actions: null,                 // default
          emphasizedAction: null,        // default
          initialFocus: null,                                  // default
          textDirection: sap.ui.core.TextDirection.Inherit     // default
        });
      },

      onSuccessMessageBoxPress: function () {
        MessageBox.success("Beneficiario certificato e creato correttamente");
      },
      onError2MessageBoxPress: function () {
        MessageBox.error("Impossibile certificare il beneficiario, procedere con la creazione con i dati inseriti manualmente?", {
          actions: ["OK", MessageBox.Action.CLOSE,],
          emphasizedAction: "Annulla",
          onClose: function (sAction) {
            MessageBox.error("Operazione interrotta, nessun beneficiario creato " + sAction);
          }
        });
      },



      onOpenFragmentBusyDialog: function () {

        if (!this._pBusyDialog) {
          this._pBusyDialog = this.loadFragment({
            name: "gestione1.fragment.BusyDialog",
            controller: this
          }).then(function (oBusyDialog) {
            this.getView().addDependent(oBusyDialog);
            syncStyleClass("sapUiSizeCompact", this.getView(), oBusyDialog);
            return oBusyDialog;
          }.bind(this));
        }

        this._pBusyDialog.then(function (oBusyDialog) {
          oBusyDialog.open();
          this.simulateServerRequest();
        }.bind(this));
      },
      simulateServerRequest: function () {
        // simulate a longer running operation
        iTimeoutId = setTimeout(function () {
          this._pBusyDialog.then(function (oBusyDialog) {
            oBusyDialog.close();
          });
        }.bind(this), 3000);
      },

      onDialogClosed: function (oEvent) {
        clearTimeout(iTimeoutId);

        if (oEvent.getParameter("cancelPressed")) {
          MessageBox.error("The operation has been cancelled");
        } else {
          MessageBox.success("The operation has been completed");
        }
      },

      onCloseDialog: function () {
        this.byId("PosFinanziaria").close();
      },
      onCloseDialog1: function () {
        this.byId("Anagrafica").close();
      },
      onCloseDialog2: function () {
        this.byId("listaPNI").close();
      },
      onCloseDialog3: function () {
        this.byId("regModPag").close();
      },
      onCloseDialog4: function () {
        this.byId("impPre").close();
      },
      onCloseDialog5: function () {
        this.byId("listaERP").close();
      },
      onCloseDialog6: function () {
        this.byId("StruAmmResp").close();
      },


      controlSwitch: function (results) {
        var oProprietà = this.getView().getModel();
        var oTempModel = this.getOwnerComponent().getModel("temp");
        var stato = this.getView().byId("switch").getState();
        var esercizio = oTempModel.getProperty("/SelectedDecree").Esercizio
        if (stato) {
          //var oTempModel = this.getOwnerComponent().getModel("temp")
          //var nContr = oTempModel.getProperty("/ContrattoSet").Ebeln
          oProprietà.setProperty("/FilterSwitch1", true);
          oProprietà.setProperty("/FilterSwitch2", true);
          this.getView().byId("cup").setValue("");
          //this.getView().byId("es_decreto").setValue(esercizio);
          //this.getOtherData(nContr)
        }
        else {
          oProprietà.setProperty("/FilterSwitch1", false);
          oProprietà.setProperty("/FilterSwitch2", false);
          this.getView().byId("Dstipula").setValue("");
          this.getView().byId("descContratto").setValue("");
          this.getView().byId("beneficiario").setValue("");
          this.getView().byId("cig").setValue("");
          //this.getView().byId("cup").setValue("");
          this.getView().byId("importoCont").setValue("");
          this.getView().byId("ValueHelpContratto").setValue("");
          this.getView().byId("numConAtt").setValue("");
          this.getView().byId("dataAtt").setValue("");
          this.getView().byId("es_decreto").setValue("");
          // this.getView().byId("numConAtt").setEnabled(true);
          // this.getView().byId("dataAtt").setEnabled(true);


          this.getView().getModel("temp").setProperty("/Step2", []);

        }
      },

      checkStep1Fields: function (fields) {
        var self = this,
          check = true,
          sNcontratto = this.getView().byId("Ncontratto"),
          sDstipula = this.getView().byId("Dstipula");

        var checkNcontratto = sNcontratto.getValue() !== "" ? true : false;
        var checksDstipula = sDstipula.getSelectedItem() !== null ? true : false;

        if (!checkNcontratto) {
          check = false;
        }

        if (!checksDstipula) {
          check = false;
        }
        return check;
      },

      checkFields: function (dialog) {
        var self = this,
          check = false;

        if (dialog === "Anagrafica") {
          var oForm = self.__dialog.getContent()[0].getFormContainers()[0],
            oForm2 = self.__dialog.getContent()[1].getFormContainers()[0],
            sPaese = oForm.getFormElements()[0].getFields()[0].getValue() !== "" ? true : false,
            sPaeseD = oForm.getFormElements()[0].getFields()[1].getValue() !== "" ? true : false,
            sCatBen = oForm.getFormElements()[1].getFields()[0].getSelectedKey() !== "" ? true : false,
            sDocBen = oForm.getFormElements()[2].getFields()[0].getValue() !== "" ? true : false,
            sNome = oForm.getFormElements()[3].getFields()[0].getValue() !== "" ? true : false,
            sCogn = oForm.getFormElements()[4].getFields()[0].getValue() !== "" ? true : false,
            sVia = oForm.getFormElements()[5].getFields()[0].getValue() !== "" ? true : false,
            sCiv = oForm.getFormElements()[5].getFields()[1].getValue() !== "" ? true : false,
            sLoc = oForm.getFormElements()[6].getFields()[0].getValue() !== "" ? true : false,
            sReg = oForm.getFormElements()[6].getFields()[1].getValue() !== "" ? true : false,
            sRegD = oForm.getFormElements()[6].getFields()[2].getValue() !== "" ? true : false,
            sCap = oForm.getFormElements()[7].getFields()[0].getValue() !== "" ? true : false,
            sCF = oForm2.getFormElements()[0].getFields()[0].getValue() !== "" ? true : false;

          if (sPaese && sPaeseD && sCatBen && sDocBen && sNome && sCogn && sVia && sCiv
            && sLoc && sReg && sRegD && sCap && sCF) {
            check = true;
          }

        } else {
          var ben = sap.ui.getCore().byId("RegBen").getValue() !== "" ? true : false,
            mod = sap.ui.getCore().byId("RegModPag").getSelectedKey() !== "" ? true : false,
            iban = sap.ui.getCore().byId("iban").getValue() !== "" ? true : false;

          if (ben && mod && iban) {
            check = true;
          }

        }


        return check;
      },
      controlswitch2: function () {
        var stato = this.getView().byId("RicPre").getState();
        if (stato) {
          this.getView().byId("IdAssPre").setEnabled(true);

        }
        else {
          this.getView().byId("IdAssPre").setEnabled(false);
        }
      },

      controlHeader: function () {
        var oProprietà = this.getView().getModel();
        this._oWizard = this.byId("CreateProductWizard");
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);

        if (this._iSelectedStepIndex == 0) {
          oProprietà.setProperty("/header1Visible", false)

        }

        else if (this._iSelectedStepIndex == 1) {
          oProprietà.setProperty("/header1Visible", false)
        }
        else if (this._iSelectedStepIndex == 2) {
          oProprietà.setProperty("/header1Visible", false)
        }
        else if (this._iSelectedStepIndex == 3) {
          oProprietà.setProperty("/header1Visible", false)
        }
        else if (this._iSelectedStepIndex == 4) {
          oProprietà.setProperty("/header1Visible", false)
        }
        else {
          oProprietà.setProperty("/header1Visible", true)
        }

        // else {
        //   oProprietà.setProperty("/header1Visible", false)
        // }           
      },

      onValueHelpRequest: function (oEvent) {
        // this._oBasicSearchField = new SearchField();
        // if (!this.pDialog) {
        //   this.pDialog = this.loadFragment({
        //     name: "gestione1.fragment.posFinanziaria",
        //     controller: this
        //   }).then(function (oDialog) {
        //           oView.addDependent(oDialog);
        //           syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
        //         return oDialog;
        //       }.bind(this));
        //      }
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "gestione1.fragment.posFinanziaria",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
            return oDialog;
          }.bind(this));
        }

        this._pValueHelpDialog.then(function (oDialog) {
          // Create a filter for the binding
          //oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });





      },

      onValueHelpRequest2: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._sValueHelpDialog) {
          this._sValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "gestione1.fragment.struAmmResp",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
            return oDialog;
          }.bind(this));
        }

        this._sValueHelpDialog.then(function (oDialog) {
          // Create a filter for the binding
          //oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });

      },



      onChangeSelect: function () {
        var bSelected = this.getView().byId("CB1").getSelected();
        if (bSelected) {
          this.getView().byId("CB3").setEnabled(false);
        }
        else {
          this.getView().byId("CB3").setEnabled(true);
        }
      },

      onRegIpebozza: function (oEvent) {
        var oModel = this.getView().getModel("comboBox"),
          oTempModel = this.getView().getModel("temp"),
          oIpeEntitySet = this.getView().getModel("IpeEntitySet")
        //oNaturaAtto = this.getView().getModel("NaturaAttoSet")
        if (oIpeEntitySet.oData.Zbozza == undefined) {
          var oBozza = false
        }
        else {
          var oBozza = true
        }
        //oBozza = this.getView().getModel("IpeEntitySet").oData.Zbozza === "X" ? true : false,
        var rowSelected = _.findWhere(oModel.getProperty("/Contratto"),),
          beneficiario = _.findWhere(oModel.getProperty("/Beneficiario"),),
          Zzanno = this.getView().byId("es_decreto").getSelectedKey();

        //oTempModel.setProperty("/Step1", rowSelected);
        //oTempModel.setProperty("/Step2", beneficiario);
        var self = this
        MessageBox.warning("Sei sicuro di voler salvare l'Ipe in Bozza ?", {
          actions: ["Si", sap.m.MessageBox.Action.NO],
          emphasizedAction: "Si",
          onClose: function (oAction) {
            if (oAction === "Si") {
              var oDataModel = self.getOwnerComponent().getModel();
              var Zop = self.getView().byId("CB1").getSelected()
              var Zoa = self.getView().byId("CB2").getSelected()
              var Zni = self.getView().byId("CB3").getSelected()


              //   if (Zop == true ) 
              //   var B_Zop = "1"

              // if (Zop == false )
              // var B_Zop = "0"

              var entity = {
                Bukrs: oTempModel.getProperty("/SelectedDecree").Ente,
                Fikrs: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria,
                Gjahr: oTempModel.getProperty("/SelectedDecree").Esercizio,
                Zzanno: Zzanno,
                Zregistrato: oTempModel.getProperty("/SelectedDecree").RegistratoBozza,
                ZCodCla: '',
                ZCodGius: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo,
                ZCodIpe: oTempModel.getProperty("/SelectedDecree").CodiceIpe,
                ZNumCla: '',
                Zammin: oTempModel.getProperty("/SelectedDecree").Amministrazione,
                Zcoddecr: oTempModel.getProperty("/SelectedDecree").NumeroDecreto,
                ZidIpe: '',
                Zufficioliv1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1,
                Zufficioliv2: oTempModel.getProperty("/SelectedDecree").UfficioLiv2,
                ZFlContOrd: self.getView().byId("switch").getState() ? 'X' : '',
                Zzdatastipula: self.getView().byId("Dstipula").getValue() !== "" ? self.getView().byId("Dstipula").getValue() : null,//oIpeEntitySet.getProperty("/Zzdatastipula"), //new Date (oTempModel.getProperty("/Step1/").data),
                Ebeln: self.getView().byId("ValueHelpContratto").getValue(),//oTempModel.getProperty("/Step1/").id,
                Lifnr: self.getView().byId("beneficiario1").getValue(),//oIpeEntitySet.getProperty("/Lifnr"),  //oTempModel.getProperty("/Step1/").id_ben,
                Zzcig: self.getView().byId("cig").getValue(),  //oTempModel.getProperty("/Step1/").cig,
                Zzcup: self.getView().byId("cup").getValue(),//oIpeEntitySet.getProperty("/Zzcup"),
                Ktwrt: self.getView().byId("importoCont").getValue() !== "" ? self.getView().byId("importoCont").getValue() : "0",//oIpeEntitySet.getProperty("/Ktwrt"), //oTempModel.getProperty("/Step1/").cup,
                NameFirst: self.getView().byId("nome").getValue(),//oIpeEntitySet.getProperty("/NameFirst"), //oTempModel.getProperty("/Step2/").nome,
                NameLast: self.getView().byId("cognome").getValue(),//oIpeEntitySet.getProperty("/NameLast"), //oTempModel.getProperty("/Step2/").cognome,
                ZzragSoc: self.getView().byId("rSociale").getValue(),//oIpeEntitySet.getProperty("/ZzragSoc"), //oTempModel.getProperty("/Step2/").Rsociale,
                Stcd1: self.getView().byId("IVA").getValue(),//oIpeEntitySet.getProperty("/Stcd1"), //oTempModel.getProperty("/Step2/").cf,
                Stcd2: "",//oIpeEntitySet.getProperty("/Stcd2"), //oTempModel.getProperty("/Step2/").IVA,
                Zwels: self.getView().byId("mPag").getValue(),//oIpeEntitySet.getProperty("/Zwels"), //oTempModel.getProperty("/items/").Modalita_pagamento,
                Iban: self.getView().byId("Iban1").getValue(),//oIpeEntitySet.getProperty("/Iban"), //oTempModel.getProperty("/Step2/").iban,
                ZidRich: self.getView().byId("IdAssPre").getValue(),//oIpeEntitySet.getProperty("/ZidRich"),
                Fipex: self.getView().byId("pFin").getValue(),
                Fistl: self.getView().byId("StrAmm").getValue(),
                Ktext: self.getView().byId("oggSpesa").getValue(),
                Znaturaatto: self.getView().byId("naturAtto").getValue().split(":")[0],
                Znumcontratt: self.getView().byId("numConAtt").getValue(),
                Zdataatto: self.getView().byId("dataAtt").getValue() !== "" ? self.getView().byId("dataAtt").getValue() : null,
                Bsart: self.getView().byId("idTypeCon").getValue(),
                Zzgara: self.getView().byId("formAgg").getValue(),
                Zop: self.getView().byId("CB1").getSelected() ? 'X' : '',
                Zoa: self.getView().byId("CB2").getSelected() ? 'X' : '',
                Zni: self.getView().byId("CB3").getSelected() ? 'X' : '',
                Zbozza: "X"
              };
              // var stato = self.getView().byId("switch").getState();
              // if (stato = false) {
              //   entity.Ktwrt=null
              // }
              if (oBozza == false) {
                if (entity.Zzdatastipula != "") {
                  var dataNuova = new Date(entity.Zzdatastipula),
                    mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                    day = ("0" + dataNuova.getDate()).slice(-2);
                  var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                  entity.Zzdatastipula = new Date(nData)
                }


                if (entity.Zdataatto != "") {
                  var dataNuova = new Date(entity.Zdataatto),
                    mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                    day = ("0" + dataNuova.getDate()).slice(-2);
                  var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                  entity.Zdataatto = new Date(nData)
                }
                // var dataNuova = new Date(entity.Zzdatastipula),
                //   mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                //   day = ("0" + dataNuova.getDate()).slice(-2);
                // var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                // entity.Zzdatastipula = new Date(nData)
                oDataModel.create("/IpeEntitySet", entity, {
                  success: function (result) {
                    console.log('SUCCESS')
                    MessageBox.success("Ipe in bozza creato correttamente", {
                      actions: ["OK"],
                      emphasizedAction: "OK",
                      onClose: function (oAction) {
                        if (oAction === "OK") {
                          self.getView().getModel("IpeEntitySet").setProperty('/', result);
                          //self.getOwnerComponent().getRouter().navTo("View1")
                          //self.getView().getModel("temp").setProperty('/NewIPE', "");
                        }
                      }
                    })
                  },

                  error: function (err) {
                    console.log(err);
                    MessageBox.error("Ipe in bozza non creato correttamente")

                  },
                  async: true,
                  urlParameters: {}
                });
              }
              else {
                self.onEditIpebozza(entity, oDataModel);
              }

            }
          }

        })

      },


      onEditIpebozza: function (entry, oDataModel) {
        var self = this,
          oTempModel = self.getView().getModel("temp"),
          oIpeEntitySet = self.getView().getModel("IpeEntitySet")
        //var Stipula = self.getView().getModel("IpeEntitySet").getProperty('/Zzdatastipula')
        // // DataStipula = Stipula.split(".");

        // DataStipula = new Date(Stipula[1] + "-" + Stipula[0] + "-" + Stipula[2])

        // self.getView().getModel("IpeEntitySet").setProperty('/Zzdatastipula', DataStipula);
        // self.getView().getModel("IpeEntitySet").setProperty('/Stcd2', "");

        var entry = self.getView().getModel("IpeEntitySet").getProperty('/');
        var importo = self.getView().byId("importoCont").getValue() !== "" ? self.getView().byId("importoCont").getValue() : "0"
        entry.Ktwrt = importo;
        var date = self.getView().byId("Dstipula").getValue() !== "" ? self.getView().byId("Dstipula").getValue() : null
        entry.Zzdatastipula = new Date(date)

        var data = self.getView().byId("dataAtt").getValue() !== "" ? self.getView().byId("dataAtt").getValue() : null
        entry.Zdataatto = new Date(data)

        var path = oDataModel.createKey("/IpeEntitySet", {
          Bukrs: oTempModel.getProperty("/SelectedDecree").Ente,
          Fikrs: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria,
          Gjahr: oTempModel.getProperty("/SelectedDecree").Esercizio,
          ZCodCla: oIpeEntitySet.getProperty("/ZCodCla"),
          ZCodGius: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo,
          ZCodIpe: oIpeEntitySet.getProperty("/ZCodIpe"),
          ZNumCla: oIpeEntitySet.getProperty("/ZNumCla"),
          Zammin: oTempModel.getProperty("/SelectedDecree").Amministrazione,
          Zcoddecr: oTempModel.getProperty("/SelectedDecree").NumeroDecreto,
          ZidIpe: oIpeEntitySet.getProperty("/ZidIpe"),
          Zregistrato: oTempModel.getProperty("/SelectedDecree").RegistratoBozza,
          Zufficioliv1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1,
          Zufficioliv2: oTempModel.getProperty("/SelectedDecree").UfficioLiv2,
        });
        //entry.Ktwrt = parseFloat(oIpeEntitySet.getProperty("/Ktwrt"))
        oDataModel.update(path, entry, {
          success: function (data) {
            console.log("success");
            MessageBox.success("Operazione Eseguita con successo", {
              actions: ["OK"],
              emphasizedAction: "OK",
              onClose: function (oAction) {
                if (oAction === "OK") {
                  //that.getOwnerComponent().getRouter().navTo("View1");

                }
              }
            })
          },
          error: function (e) {
            //console.log("error");
            MessageBox.error("Operazione non eseguita")

          }
        });


      },
      OnSelectYears: function () {
        var self = this,
          oTable = this.getView().byId("EsigTable");
        var oTempModel = this.getOwnerComponent().getModel("temp");
        var rows = sap.ui.getCore().byId("PniAuth").getSelectedItems()
        var array = []
        var oMdlAuth = new sap.ui.model.json.JSONModel();
        for (let i = 0; i < rows.length; i++) {
          array.push({
            finCode: rows[i].getBindingContext("temp").getObject().Fincode,
            autDescr: rows[i].getBindingContext("temp").getObject().Beschr
          })
        }
        oMdlAuth.setData(array);
        self.getView().setModel(oMdlAuth, "Esig");
        sap.ui.getCore().byId("listaPNI").close();
        for (var x = 0; x < array.length; x++) {
          self.fillDefaultModelEsigibilità(oTempModel.getProperty("/SelectedDecree").Esercizio, array[x]);
        }
        var arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet');
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({ EsigibilitaSet: arrayModel });
        oTable.setModel(oModel);
        oTable.bindRows("/EsigibilitaSet");
      },

      onSaveIPE: function (oEvent) {
        var self = this,
          oDataModel = self.getOwnerComponent().getModel();

        self.getView().setBusy(true);
        var decreto = self.getOwnerComponent().getModel("temp").getData().SelectedDecree;

        var deepObject = {
          ChiaveGiustificativo: decreto.ChiaveGiustificativo,
          DecretoImpegnoSet: null,
          IpeEntitySet: null,
          Funzionalita: "REGISTRA_PROVVISORIO",
          ImportiClausolaSet: null,
          PrevisioneImpegnoSet: null
        };

        var ipe = self.getIpeForDeep();
        var esigibilita = self.getEsigibilitaForDeep();
        var previsions = self.getPrevisionForDeep();
        deepObject.DecretoImpegnoSet = decreto;
        deepObject.IpeEntitySet = ipe;
        deepObject.ImportiClausolaSet = esigibilita;
        deepObject.PrevisioneImpegnoSet = previsions;

        oDataModel.create("/DeepEntitySet", deepObject, {
          success: function (result) {
            self.getView().setBusy(false);
            if (result.Msgty === 'S') {
              MessageBox.success(result.Message, {
                actions: ["OK"],
                // emphasizedAction: "Annulla",
                onClose: function (sAction) {
                  self.navToHome();
                  // MessageBox.error("Operazione interrotta, nessun beneficiario creato " + sAction);
                }
              });
              // MessageBox.success(result.Message, {icon: MessageBox.Icon.SUCCESS });                    
            }
            else
              MessageBox.error(result.Message, { icon: MessageBox.Icon.ERROR });
          },
          error: function (err) {
            self.getView().setBusy(false);
            MessageBox.error("Si è verificato un errore!", { icon: MessageBox.Icon.ERROR });
            console.log(err);
          },
          async: true,
          urlParameters: {}
        });
      },

      getIpeForDeep: function () {
        var self = this,
          array = [],
          oTempModel = self.getOwnerComponent().getModel("temp");

        var entity = {
          Bukrs: oTempModel.getProperty("/SelectedDecree").Ente,
          Fikrs: oTempModel.getProperty("/SelectedDecree").AreaFinanziaria,
          Gjahr: oTempModel.getProperty("/SelectedDecree").Esercizio,
          Zzanno: oTempModel.getProperty("/SelectedDecree").Esercizio,// Zzanno,
          Zregistrato: oTempModel.getProperty("/SelectedDecree").RegistratoBozza,
          ZCodCla: '',
          ZCodGius: oTempModel.getProperty("/SelectedDecree").ChiaveGiustificativo,
          ZCodIpe: oTempModel.getProperty("/SelectedDecree").CodiceIpe,
          ZNumCla: '',
          Zammin: oTempModel.getProperty("/SelectedDecree").Amministrazione,
          Zcoddecr: oTempModel.getProperty("/SelectedDecree").NumeroDecreto,
          ZtipoIpe: '0',
          ZidIpe: '',
          Zufficioliv1: oTempModel.getProperty("/SelectedDecree").UfficioLiv1,
          Zufficioliv2: oTempModel.getProperty("/SelectedDecree").UfficioLiv2,
          ZFlContOrd: self.getView().byId("switch").getState() ? 'X' : '',
          Zzdatastipula: self.getView().byId("Dstipula").getValue() !== "" ? self.getView().byId("Dstipula").getValue() : null,//oIpeEntitySet.getProperty("/Zzdatastipula"), //new Date (oTempModel.getProperty("/Step1/").data),
          Ebeln: self.getView().byId("ValueHelpContratto").getValue(),//oTempModel.getProperty("/Step1/").id,
          Lifnr: self.getView().byId("beneficiario1").getValue(),//oIpeEntitySet.getProperty("/Lifnr"),  //oTempModel.getProperty("/Step1/").id_ben,
          Zzcig: self.getView().byId("cig").getValue(),  //oTempModel.getProperty("/Step1/").cig,
          Zzcup: self.getView().byId("cup").getValue(),//oIpeEntitySet.getProperty("/Zzcup"),
          Ktwrt: self.getView().byId("importoCont").getValue() !== "" ? self.getView().byId("importoCont").getValue() : "0",//oIpeEntitySet.getProperty("/Ktwrt"), //oTempModel.getProperty("/Step1/").cup,
          NameFirst: self.getView().byId("nome").getValue(),//oIpeEntitySet.getProperty("/NameFirst"), //oTempModel.getProperty("/Step2/").nome,
          NameLast: self.getView().byId("cognome").getValue(),//oIpeEntitySet.getProperty("/NameLast"), //oTempModel.getProperty("/Step2/").cognome,
          ZzragSoc: self.getView().byId("rSociale").getValue(),//oIpeEntitySet.getProperty("/ZzragSoc"), //oTempModel.getProperty("/Step2/").Rsociale,
          Stcd1: self.getView().byId("IVA").getValue(),//oIpeEntitySet.getProperty("/Stcd1"), //oTempModel.getProperty("/Step2/").cf,
          Stcd2: "",//oIpeEntitySet.getProperty("/Stcd2"), //oTempModel.getProperty("/Step2/").IVA,
          Zwels: self.getView().byId("mPag").getValue(),//oIpeEntitySet.getProperty("/Zwels"), //oTempModel.getProperty("/items/").Modalita_pagamento,
          Iban: self.getView().byId("Iban1").getValue(),//oIpeEntitySet.getProperty("/Iban"), //oTempModel.getProperty("/Step2/").iban,
          ZidRich: self.getView().byId("IdAssPre").getValue(),//oIpeEntitySet.getProperty("/ZidRich"),
          Fipex: self.getView().byId("pFin").getValue(),
          Fistl: self.getView().byId("StrAmm").getValue(),
          Ktext: self.getView().byId("oggSpesa").getValue(),
          Znaturaatto: self.getView().byId("naturAtto").getValue().split(":")[0],
          Znumcontratt: self.getView().byId("numConAtt").getValue(),
          Zdataatto: self.getView().byId("dataAtt").getValue() !== "" ? self.getView().byId("dataAtt").getValue() : null,
          Bsart: self.getView().byId("idTypeCon").getValue(),
          Zzgara: self.getView().byId("formAgg").getValue(),
          Zop: self.getView().byId("CB1").getSelected() ? 'X' : '',
          Zoa: self.getView().byId("CB2").getSelected() ? 'X' : '',
          Zni: self.getView().byId("CB3").getSelected() ? 'X' : '',
          Zbozza: ""
        };

        array.push(entity);
        return array;
      },

      getPrevisionForDeep: function () {
        var self = this,
          prevision = self.getView().getModel("temp").getProperty('/PrevisionSet');

        if (prevision && prevision.length > 0) {
          var toRemove = prevision.filter(x => parseFloat(x.Totale) === 0);
          toRemove.forEach(x => prevision.splice(prevision.findIndex(n => n === x), 1));
        }
        else
          return [];

        return prevision;
      },

      getEsigibilitaForDeep: function () {
        var self = this,
          array = [],
          arrayModel = self.getView().getModel("temp").getProperty('/EsigibilitaSet'),
          decreto = self.getOwnerComponent().getModel("temp").getData().SelectedDecree;

        if (!arrayModel || arrayModel === null || arrayModel.length === 0) {
          return [];
        }

        for (var i = 0; i < arrayModel.length; i++) {
          var item = arrayModel[i];
          var finCode = item.fincode;
          var keyNames = Object.keys(item);
          var propsNames = keyNames.filter(x => x.includes("nClausola_"));
          for (var j = 0; j < propsNames.length; j++) {
            if (item[propsNames[j]] !== "" && parseInt(item[propsNames[j]]) > 0) {
              var props = propsNames[j];
              var year = props.substring(10);

              var obj = {
                ChiaveGiustificativo: decreto.ChiaveGiustificativo,
                ZNumCla: item[propsNames[j]],
                Gjahr: year.toString(),
                Autorizzazione: finCode,
                NumeroPni: "",
                ImportoClausola: parseFloat(item["importo_" + year.toString()]).toFixed(2)
              }
              array.push(obj);
            }
          }
        }
        return array;
      },


      // OnSelectYears_old: function () {

      //   var oTempModel = this.getOwnerComponent().getModel("temp");
      //   var rows = sap.ui.getCore().byId("PniAuth").getSelectedItems()
      //   var array = []
      //   var oMdlAuth = new sap.ui.model.json.JSONModel();
      //   for (let i = 0; i < rows.length; i++) {
      //     var campo = rows[i].getBindingContext("temp").getObject().Beschr
      //     array.push(campo)
      //   }
      //   oMdlAuth.setData(array);
      //   this.getView().setModel(oMdlAuth, "Esig");
      //   sap.ui.getCore().byId("listaPNI").close();

      //   var arr2 = []
      //   //var oValue =oEvent.getSource().getSelectedItem().getProperty("text"),
      //   // var Aut1=oEsigModel.getProperty('/List/Geber', Aut).split(':')[1].split(',')
      //   for (var x = 0; x < array.length; x++) {
      //     var Auth = "Autorizzazione: " + array[x]
      //     arr2.push(Auth)

      //   }
      //   var Aut = arr2,
      //     oYears = parseInt(oTempModel.getData().SelectedDecree.Esercizio),
      //     oTable = this.getView().byId("EsigTable"),
      //     colsData = this.getColsData(oYears),
      //     rows = this.getRowsData(Aut, colsData, oYears),
      //     model = new sap.ui.model.json.JSONModel({});


      //   var oModel = new sap.ui.model.json.JSONModel();

      //   oModel.setData({
      //     columns: colsData,
      //     rows: rows
      //   });

      //   this._buildUITableContent.apply(this, [oTable, oModel]);

      // },

      _buildUITableContent: function (oTable, oModel) {
        var oController = this;
        var crtView = oController.getView();


        oTable.setModel(oModel);

        oTable.bindColumns("/columns", function (sId, oContext) {
          var columnName = oContext.getObject().columnName;
          var columnLabel = oContext.getObject().columnLabel;
          var templateBind = "{" + columnName + "}";
          var Column = "";
          columnLabel = columnName.slice(0, -4) === "ZImpIpeCl" ? columnLabel : columnLabel.slice(0, -4);
          if (columnName.slice(0, -4) === "ZImpIpeCl") {

            var oInput = new sap.m.Input("Txt" + columnName, {
              value: templateBind
            });

            var oCustomData = new sap.ui.core.CustomData({
              key: "FieldData",
              value: columnLabel
            });

            // Add the custom data to the Input control
            oInput.addCustomData(oCustomData);

            oInput.attachChange(function (oEvent) {
              var that = this

              var sNewValue = oEvent.getParameter("value");
              var Obj = oEvent.getSource().getBindingContext().getObject()

              //Obj.Wtfree2023 = 
              // oEvent.getSource().getBindingContext().getObject().Zcassa2023 
              //var Anno = oEvent.getSource().data("app:FieldData");
              oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().getPath(), Obj);

              console.log("Nuovo valore: " + sNewValue);
            });

            return new sap.ui.table.Column("col" + columnName, {
              label: columnLabel,
              template: oInput,
              width: "8rem",
            });

          } else {
            return new sap.ui.table.Column("col" + columnName, {
              label: columnLabel,
              template: columnName,
              width: columnName.slice(0, -4) === "Geber" ? "22rem" : "8rem",
            });
          }

        });

        oTable.bindRows("/rows");

      },

      onChangeZImpIpeCl: function (oEvent) {
        var sNewValue = oEvent.getParameter("value");

        console.log("Nuovo valore: " + sNewValue);
      },

      OnSelectAnni: function (oEvent) {
        var oTempModel = this.getOwnerComponent().getModel("temp");
        var oValue = oEvent.getSource().getSelectedItem().getProperty("text")
        var Mese = "Annuale"
        // Mese1 ="Febbraio"
        //   "Marzo"
        //   "Aprile"
        //   "Maggio"
        //   "Giugno"
        //   "Luglio"
        //   "Agosto"
        //   "Settembre"
        //   "Ottobre"
        //   "Novembre"
        //   "Dicembre"
        // "Totale previsioni pagamenti"
        // var TotalRows = this.getView().byId("preTable").getAggregation("rows").length
        //   for (let i = 0; i < TotalRows; i++) {
        //     var Month = Mese[i];
        //     this.getRowsData(Month,colsData,oYears)


        //   }
        var oYears = parseInt(oTempModel.getData().SelectedDecree.Esercizio),
          oTable = sap.ui.getCore().byId("preTable"),
          colsData = this.getColsPrevisioni(oYears),
          rows = this.getPreRowsData(Mese, colsData, oYears),
          model = new sap.ui.model.json.JSONModel({});


        var oModel = new sap.ui.model.json.JSONModel();

        oModel.setData({
          columns: colsData,
          rows: rows[0]
        });

        this._buildUIPreTableContent.apply(this, [oTable, oModel]);



      },

      _buildUIPreTableContent: function (oTable, oModel) {
        var oController = this;
        var crtView = oController.getView();


        oTable.setModel(oModel);

        oTable.bindColumns("/columns", function (sId, oContext) {
          var columnName = oContext.getObject().columnName;
          var columnLabel = oContext.getObject().columnLabel;
          var templateBind = "{" + columnName + "}";
          var Column = "";
          columnLabel = columnName.slice(0, -4) === "ZImpIpeCl" ? columnLabel : columnLabel.slice(0, -4);
          if (columnName.slice(0, -4) === "ZImpIpeCl") {

            var oInput = new sap.m.Input("Tst" + columnName, {
              value: templateBind
            });

            var oCustomData = new sap.ui.core.CustomData({
              key: "FieldData",
              value: columnLabel
            });

            // Add the custom data to the Input control
            oInput.addCustomData(oCustomData);

            oInput.attachChange(function (oEvent) {
              var sNewValue = oEvent.getParameter("value");
              var Anno = oEvent.getSource().data("app:FieldData");
              console.log("Nuovo valore: " + sNewValue);
            });

            return new sap.ui.table.Column("colm" + columnName, {
              label: columnLabel,
              template: oInput,
              width: "8rem",
            });

          } else {
            return new sap.ui.table.Column("colm" + columnName, {
              label: columnLabel,
              template: columnName,
              width: columnName.slice(0, -4) === "Annuale" ? "22rem" : "8rem",

            });
          }

        });

        oTable.bindRows("/rows");

      },

      onChangeZImpIpeCl: function (oEvent) {
        var sNewValue = oEvent.getParameter("value");
        console.log("Nuovo valore: " + sNewValue);
      },


      onCreateClausola: function (oEvent) {
        var that = this;
        oDataModel = that.getOwnerComponent().getModel();

        var deepEntity = {
          ImportiClausolaSet: null,
          PrevisioneImpegnoSet: [],
          Operation: 'Creazione Clausola'
        }
        var oEsigModel = that.getOwnerComponent().getModel("Esigibilita");
        var oTempModel = that.getOwnerComponent().getModel("temp");
        var Auth = oEsigModel.getData().List[0].Geber.split(":")[1]
        var anno = 2023


        deepEntity.PrevisioniImpegnoSet.push({
          ZNumCla: '',
          Anno: anno,
          Gennaio: '',
          Febbraio: '',
          Marzo: '',
          Aprile: '',
          Maggio: '',
          Giugno: '',
          Luglio: '',
          Agosto: '',
          Settembre: '',
          Ottobre: '',
          Novembre: '',
          Dicembre: '',
          Totale: ''

        });

        deepEntity.ImportiClausolaSet = {
          Codice: Auth,
          Gjahr: anno,
          Wtfree: oTempModel.getData().EsigibilitàSet.Wtfree,
          Cassa: oTempModel.getData().EsigibilitàSet.Zcassa,
          ImportoClausola: ''


        };

        oDataModel.create('/DeepEsigibiltaSet', deepEntity, {
          urlParameters: "",
          success: function (data, oResponse) {
            var oModelJson = new sap.ui.model.json.JSONModel();
            oModelJson.setData(data);
            //  that.getView().getModel("temp").setProperty('/ContrattoSet', data);
            //  that.getContratto(data)
            //that.callAnnoAmm(data.results);
            //that.getOwnerComponent().setModel(oModelJson, "DecretoImpegno");
          },
          error: function (error) {
            var e = error;
          }
        });



      },
      //     onSelctionAuth: function() {
      //     var rows= sap.ui.getCore().byId("PniAuth").getSelectedItems()
      //     var array=[]
      //     var oMdlAuth = new sap.ui.model.json.JSONModel();
      // for (let i = 0; i < rows.length; i++) {
      //   var campo = rows[i].getBindingContext("temp").getObject()
      //   array.push(campo)
      // }
      // oMdlAuth.setData(array);
      // this.getView().setModel(oMdlAuth, "Esig");
      // sap.ui.getCore().byId("listaPNI").close();
      // this.callEsigibilitaEntity()
      // this.OnSelectYears(array)
      //     }

    });
  }
);