import { ApiService } from './../../commons/services/api-service.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
    selector: 'app-form-upload',
    styleUrls: ['./form-upload.component.css'],
    templateUrl: './form-upload.component.html'
})
export class FormUploadComponent implements OnInit {
    selectedFiles: FileList;
    currentFileUpload: File;
    idDocumentSaved: any;
    @Input() nameFile = 'Choose image';
    progress: { percentage: number } = { percentage: 0 };
    urlDocumentController = '/document';
    @Output() documentSaved = new EventEmitter();

    constructor(private uploadService: ApiService) { }

    ngOnInit() {

    }

    selectFile(event) {
        const file = event.target.files.item(0);
        if (file.type.match('image.*')) {
            this.selectedFiles = event.target.files;
            this.nameFile = event.target.files[0].name;
        } else {
            alert('invalid format!');
        }
    }

    upload() {
        this.progress.percentage = 0;

        this.currentFileUpload = this.selectedFiles.item(0);
        this.uploadService.pushFile(this.urlDocumentController + '/uploadFile', this.currentFileUpload).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progress.percentage = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
                console.log('File is completely uploaded!');
                this.idDocumentSaved = JSON.parse('' + event.body).id;
                this.documentSaved.emit(this.idDocumentSaved);

            }
        });

        this.selectedFiles = undefined;
    }
}
