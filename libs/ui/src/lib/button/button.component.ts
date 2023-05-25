import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: `[skooltrak-button]`,
  standalone: true,
  imports: [NgClass],

  template: `<div [class]="styles" (click)="buttonClick.emit()">
    <ng-content></ng-content>
  </div>`,
})
export class ButtonComponent implements OnInit {
  @Input({ required: true }) color!: 'blue' | 'sky' | 'red' | 'green';
  @Output() buttonClick = new EventEmitter();
  private colorVariants = {
    blue: [
      'bg-blue-600',
      'hover:bg-blue-700',
      'focus:ring-blue-300',
      'dark:bg-blue-600',
      'dark:hover:bg-blue-700',
      'dark:focus:ring-blue-800',
    ],
    sky: [
      'bg-sky-600',
      'hover:bg-sky-700',
      'focus:ring-sky-300',
      'dark:bg-sky-600',
      'dark:hover:bg-sky-700',
      'dark:focus:ring-sky-800',
    ],
    red: [
      'bg-red-600',
      'hover:bg-red-700',
      'focus:ring-red-300',
      'dark:bg-red-600',
      'dark:hover:bg-red-700',
      'dark:focus:ring-red-800',
    ],
    green: [
      'bg-green-600',
      'hover:bg-green-700',
      'focus:ring-green-300',
      'dark:bg-green-600',
      'dark:hover:bg-green-700',
      'dark:focus:ring-green-800',
    ],
  };

  public styles: string[] = [];

  ngOnInit(): void {
    console.log(this.color);
    this.styles = [
      ...this.colorVariants[this.color],
      `text-white`,
      `disabled:opacity-75`,
      `disabled:cursor-not-allowed`,
      `focus:ring-4`,
      `focus:outline-none`,
      `font-medium`,
      `rounded-lg`,
      `text-sm`,
      `px-5`,
      `py-2.5`,
      `text-center`,
    ];
    console.log(this.styles);
  }
}
