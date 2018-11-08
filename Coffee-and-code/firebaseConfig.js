import {
    APIKEY,
    AUTHDOMAIN,
    DATABASEURL,
    PROJECTID,
    STORAGEBUCKET,
    MESSAGINGSENDERID
}  from 'react-native-dotenv';

console.log('APIKEY' + APIKEY);


export const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    databaseURL: DATABASEURL,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID
};
  