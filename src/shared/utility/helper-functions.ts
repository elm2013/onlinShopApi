
const SmsConfig = require('./panelSmsConfig');
const axios = require('axios');

export const ConvertPersianArabicNumber = value => {
    return (value.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (Number) {
        return Number.charCodeAt(0) - 1632; // Convert Arabic numbers
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (Number) {
        return Number.charCodeAt(0) - 1776; // Convert Persian numbers
    })).toString();
}


export const SendMessage = async (SmsBody, mobiles) => {

    let parsGreenConfig = SmsConfig.parsGreen
    let data = JSON.stringify({
        "SmsBody": SmsBody,
        "Mobiles": mobiles
    })
    parsGreenConfig.data = data;

    return await axios(parsGreenConfig)
        .then(async (response) => {
            if (response.data.R_Success == true) {
                console.log(`sms sent successfully `);
                return true
            } else {
                console.error(`Send sms  error :${response.data.R_Message} `);
                return false
            }
        })
        .catch(async (error) => {
            console.debug(`error sending sms `, error);
            return false
        });

}

export const RandomString = (len: number = 11, charSet: string) => {
    charSet =
        charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
};
