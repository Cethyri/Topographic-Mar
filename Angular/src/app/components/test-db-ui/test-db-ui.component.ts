import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-test-db-ui',
  templateUrl: './test-db-ui.component.html',
  styleUrls: ['./test-db-ui.component.scss']
})
export class TestDbUiComponent implements OnInit {

  userForm: FormGroup

  constructor(fb: FormBuilder) { 
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
    
    firebase.auth().createUserWithEmailAndPassword(this.userForm.get("email").value, this.userForm.get("password").value).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

}
