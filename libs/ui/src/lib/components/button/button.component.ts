import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: `[skButton]`,
  standalone: true,
})
export class ButtonDirective implements OnInit {
  @Input({ required: true }) color!:
    | 'blue'
    | 'sky'
    | 'red'
    | 'green'
    | 'purple';

  @HostBinding('class') get classes() {
    return this.styles;
  }

  private colorVariants = {
    blue: [
      'bg-blue-300',
      'hover:bg-blue-400',
      'focus:ring-blue-300',
      'dark:bg-blue-300',
      'dark:hover:bg-blue-400',
      'dark:focus:ring-blue-800',
    ],
    sky: [
      'bg-sky-300',
      'hover:bg-sky-400',
      'focus:ring-sky-300',
      'dark:bg-sky-300',
      'dark:hover:bg-sky-400',
      'dark:focus:ring-sky-800',
    ],
    red: [
      'bg-red-300',
      'hover:bg-red-400',
      'focus:ring-red-300',
      'dark:bg-red-300',
      'dark:hover:bg-red-400',
      'dark:focus:ring-red-800',
    ],
    green: [
      'bg-green-300',
      'hover:bg-green-400',
      'focus:ring-green-300',
      'dark:bg-green-300',
      'dark:hover:bg-green-400',
      'dark:focus:ring-green-800',
    ],
    purple: [
      'bg-purple-300',
      'hover:bg-purple-400',
      'focus:ring-purple-300',
      'dark:bg-purple-300',
      'dark:hover:bg-purple-400',
      'dark:focus:ring-purple-800',
    ],
  };

  public styles: string[] = [];

  ngOnInit(): void {
    this.styles = [
      ...this.colorVariants[this.color],
      `text-gray-800`,
      `disabled:opacity-50`,
      `disabled:cursor-not-allowed`,
      `focus:ring-4`,
      `focus:outline-none`,
      `font-medium`,
      `rounded-full`,
      `text-sm`,
      `px-5`,
      `py-2.5`,
      `text-center`,
    ];
  }
}
