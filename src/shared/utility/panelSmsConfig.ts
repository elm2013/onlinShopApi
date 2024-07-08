module.exports={
    "parsGreen":{
         "method": "post",
         "url": "https://sms.parsgreen.ir/Apiv2/Message/SendSms",
         "headers": { 
             "Content-Type": "application/json",
             "Authorization":"basic apikey:A84D85F7-C1CD-4C26-B18C-363830CD4966"
         },
         "data":{}
     },
     "FarazSms":{
         "method": "post",
         "url": "http://ippanel.com/api/select",
         "headers": { 
             "Content-Type": "application/json",
             
         },
         "data": {
             "op":"pattern",
             "user":"FREE09134004010",
             "pass":"Faraz@1283950073",
             "fromNum":"+983000505",
             "toNum":"",
             "patternCode":"xkc8cyv4mawd34u",
             "inputData":[ ]
         },
     }
 }