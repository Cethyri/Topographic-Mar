import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScreenComponent } from './game-screen.component';
import firebase from "firebase";

var config = {
  apiKey: "AIzaSyAC-6lFDwyb1K99UuPIqz7MVEjowrVcHu0",
  authDomain: "topographic-mar.firebaseapp.com",
  databaseURL: "https://topographic-mar.firebaseio.com",
  storageBucket: "topographic-mar.appspot.com",
};

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithRedirect(provider);

firebase.initializeApp(config);

// firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
