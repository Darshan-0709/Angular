import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessageService } from './messages.service';

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
    standalone: false
})
export class MessagesComponent implements OnInit {

  showMessage = false
  errors$ = new Observable<string[]>()
  constructor(public messageService: MessageService) {
    console.log("Created message service")
  }

  ngOnInit() {
    this.errors$ = this.messageService.errors$.pipe(
      tap(()=> this.showMessage = true)
    )
  }

  onClose() {
    this.showMessage = false

  }

}
