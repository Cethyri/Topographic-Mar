import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  @Input() title: string;

  constructor(private http: HttpClient) {}
  
  ngOnInit() {}

  // onClick() {
  //   var apiObservable = this.http.get("http://localhost:8080/api", {responseType: 'text'});
  //   apiObservable.subscribe(data => {
  //     console.log(data);
  //   });
  // }
}
