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

    formatterNumClausola:function(str){
      value = "";
      var len = str.toString().length;
      switch(len){
        case 0:
          value = "000";
          break;
        case 1:
            value = "00" + str;
            break;
        case 2:
            value = "0" + str;
          break;  
        default:
          value = str;  
      }
      return value.toString();
    },


    ktm:function(value){
      console.log(value);
      
    }
  }
});

