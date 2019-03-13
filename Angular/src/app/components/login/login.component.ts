import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup
  constructor(private fb: FormBuilder, public firebaseService: FirebaseService, public router: Router) { 
    this.userForm = fb.group({
      email: [''],
      password: ['']
    })
  }


  ngOnInit() {
  }

  onSubmit() {
    let firebase = this.firebaseService.firebase;
    let userForm = this.userForm;
    firebase.auth().signInWithEmailAndPassword(userForm.get("email").value, userForm.get("password").value).
    then(function(result) {
    }, function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      firebase.auth().createUserWithEmailAndPassword(userForm.get("email").value, userForm.get("password").value)
      .then(function(result) {
        firebase.auth().signInWithEmailAndPassword(userForm.get("email").value, userForm.get("password").value)
      },
      function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    });
  }

}
