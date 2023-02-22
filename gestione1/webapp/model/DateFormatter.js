sap.ui.define([], function () {
    return {

      convert: function(str) {
        if(str !== ''){
          var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
           var nData= [date.getFullYear(), mnth, day].join("-");
           var nDate = nData.split("-").reverse().join(".");
           return nDate
        } 
        else{
          return str;
        }
        },
        }
  });

  