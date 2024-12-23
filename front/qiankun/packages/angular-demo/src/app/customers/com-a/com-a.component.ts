import { Component, OnInit } from '@angular/core';
function readonly(target:any) {
  console.log(target.firstName,123123);
  Object.defineProperty(target, 'firstName', {
    writable: false
  });
}
@Component({
  selector: 'app-com-a',
  templateUrl: './com-a.component.html',
  styleUrls: ['./com-a.component.scss']
})
@readonly
export class ComAComponent implements OnInit {
  firstName: string = 'lm';
  isAbailable: boolean = false;
  items: any[] = [{ name: 'lm' },{ name: 'lm' }]
  constructor() {
    // super();
    this.firstName = 'lm';
    this.isAbailable = false;
  }

  ngOnInit(): void {
    console.log('com-a init');
  }

  doSomething() {
    // 处理点击事件的逻辑
    alert('haha');
  }

}
