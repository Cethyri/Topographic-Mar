import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup
  constructor(private fb: FormBuilder, public firebaseService: FirebaseService) { 
    this.userForm = fb.group({
      email: [''],
      password: ['']
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.userForm.get("email").value);
    console.log(this.userForm.get("password").value);
    // Validation
    
    this.firebaseService.firebase.auth().createUserWithEmailAndPassword(this.userForm.get("email").value, this.userForm.get("password").value).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

}
