import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-com-a',
  templateUrl: './com-a.component.html',
  styleUrls: ['./com-a.component.scss']
})
export class ComAComponent implements OnInit {
  firstName: string;
  constructor() {
    // super();
    this.firstName = 'John Doe';
   }

  ngOnInit(): void {
    console.log('com-a init');
    
  }

}
