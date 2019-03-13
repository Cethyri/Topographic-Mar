import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService 
{
  config = {
    apiKey: "AIzaSyBbIbjANHJqGjnJ9Pd9f1n2mpBrsf3oBJk",
    authDomain: "topographic-mar.firebaseapp.com",
    databaseURL: "https://topographic-mar.firebaseio.com",
    storageBucket: "topographic-mar.appspot.com",
  };
  firebase = firebase;
  constructor() {
    firebase.initializeApp(this.config);
  }
}
