import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: `[skooltrak-button]`,
  standalone: true,
  imports: [NgClass],

  template: `<button [class]="styles" (click)="buttonClick.emit()">
    <ng-content></ng-content>
  </button>`,
})
export class ButtonComponent implements OnInit {
  @Input({ required: true }) color!: 'blue' | 'sky' | 'red' | 'green';
  @Output() buttonClick = new EventEmitter();

  public styles: string[] = [];

  ngOnInit(): void {
    this.styles = [
      `text-white`,
      `disabled:opacity-75`,
      `disabled:cursor-not-allowed`,
      `bg-${this.color}-600`,
      `hover:bg-${this.color}-700`,
      `focus:ring-4`,
      `focus:outline-none`,
      `focus:ring-${this.color}-300`,
      `font-medium`,
      `rounded-lg`,
      `text-sm`,
      `px-5`,
      `py-2.5`,
      `text-center`,
      `dark:bg-${this.color}-600`,
      `dark:hover:bg-${this.color}-700`,
      `dark:focus:ring-${this.color}-800`,
    ];
  }
}
