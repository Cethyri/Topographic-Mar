import { Component } from '@angular/core';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBbIbjANHJqGjnJ9Pd9f1n2mpBrsf3oBJk",
  authDomain: "topographic-mar.firebaseapp.com",
  databaseURL: "https://topographic-mar.firebaseio.com",
  storageBucket: "topographic-mar.appspot.com",
};
firebase.initializeApp(config);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Topographic-Mar';
}
