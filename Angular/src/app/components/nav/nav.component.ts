import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FirebaseService } from '../../services/firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  @Input() title: string;

  constructor(private http: HttpClient, public firebaseService: FirebaseService, public router: Router) 
  {
    this.firebaseService.firebase.auth().onAuthStateChanged(user => {
      console.log("auth state changed!");
      if (user) {
        document.getElementById("login").style.display = "none";
        document.getElementById("username").style.display = "inline-block";
        document.getElementById("username").innerText = this.firebaseService.firebase.auth().currentUser.email;
        document.getElementById("logout").style.display = "inline-block";
        document.getElementById("upload").style.display = "inline-block";
        this.router.navigateByUrl('/storage');
      } else {
        document.getElementById("login").style.display = "inline-block";
        document.getElementById("username").style.display = "none";
        document.getElementById("logout").style.display = "none";
        document.getElementById("upload").style.display = "none";
        this.router.navigateByUrl('');
      }
    });


  }
  
  ngOnInit() {
    document.getElementById("logout").addEventListener("mousedown", event => {
      this.firebaseService.firebase.auth().signOut();
    });
  }

}
