import { GoogleSpreadsheet } from "google-spreadsheet";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const LOOKUP_SHEET_ID = process.env.REACT_APP_LOOKUP_SHEET_ID
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

export const encrypt = (data) => {
    var encryptedData = AES.encrypt(data.toLowerCase(), 'secret key 123').toString();
    return encryptedData;
}

export const decrypt = (data) => {
    var bytes = AES.decrypt(data, 'secret key 123');
    var originalText = bytes.toString(Utf8);
    return originalText;
}

export const appendSpreadsheet = async (row) => {
    try {
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        // loads document properties and worksheets
        await doc.loadInfo();
    
        const sheet = doc.sheetsById[SHEET_ID];
        console.log(sheet)
        const result = await sheet.addRow(row);
    } catch (e) {
        console.error('Error: ', e);
    }
};

export const getWalletData = async(wallet) => {
    try {
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        // loads document properties and worksheets
        await doc.loadInfo();
        const sheet = doc.sheetsById[LOOKUP_SHEET_ID];
        await sheet.loadCells('B1:B2');
        const walletCell = await sheet.getCellByA1('B1');
        walletCell.value = wallet;
        await sheet.saveUpdatedCells();
        await sheet.loadCells('B1:B12');
        let data = {
            Wallet: await sheet.getCellByA1('B1').value,
            Name: decrypt(await sheet.getCellByA1('B2').value),
            Email: decrypt(await sheet.getCellByA1('B3').value),
            MoonbirdId: decrypt(await sheet.getCellByA1('B4').value),
            Address1: decrypt(await sheet.getCellByA1('B5').value),
            Address2: decrypt(await sheet.getCellByA1('B6').value),
            City: decrypt(await sheet.getCellByA1('B7').value),
            State: decrypt(await sheet.getCellByA1('B8').value),
            Zip: decrypt(await sheet.getCellByA1('B9').value),
            Country: decrypt(await sheet.getCellByA1('B10').value),
            Comments: decrypt(await sheet.getCellByA1('B11').value),
            Shipped: decrypt(await sheet.getCellByA1('B12').value)
        }
        return data
        // const result = await sheet.addRow(row);
    } catch (e) {
        console.error('Error: ', e);
    }
}

// export const getRows = async() => {
//     console.log('here')
//     try {
//         await doc.useServiceAccountAuth({
//             client_email: CLIENT_EMAIL,
//             private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
//         });
//         // loads document properties and worksheets
//         await doc.loadInfo();
    
//         const sheet = doc.sheetsById[SHEET_ID];
//         console.log(await sheet.getRows())
//         // const result = await sheet.addRow(row);
//     } catch (e) {
//         console.error('Error: ', e);
//     }
// }
  
// const newRow = { Name: "new name", Value: "new value" };

// appendSpreadsheet(newRow);