import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {


  uploadForm: FormGroup;
  fileInput: HTMLInputElement;

  constructor(fb: FormBuilder) {
    this.uploadForm = fb.group({
      image: ['']
    })
  }

  ngOnInit() {
    this.fileInput = <HTMLInputElement>document.getElementById("fileInput");
  }

  onFileChanged(event) {
    const file = event.target.files[0]
    console.log(file);
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();
  }


  public openFileDialog(): void {
    let event = new MouseEvent('click', { bubbles: false });
    this.fileInput.dispatchEvent(event);
  }

}
