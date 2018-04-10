import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-simple-demo',
  templateUrl: './simple-demo.component.html',
  styleUrls: ['./simple-demo.component.css']
})
export class SimpleDemoComponent implements OnInit {
  public selected: any;
  public lists = [
    {
      name: 'listA',
      value: []
    },
    {
      name: 'listB',
      value: []
    }
  ];

  public models = {
    selected: null,
    lists: this.lists
  };

  constructor() {
    for (let i = 1; i <= 6; ++i) {
      this.lists[0].value.push({ label: 'Item A' + i });
      this.lists[1].value.push({ label: 'Item B' + i });
    }
  }

  moved(index: number, list: Array<any>) {
    list.splice(index, 1);
  }

  ngOnInit(): void { }

}
