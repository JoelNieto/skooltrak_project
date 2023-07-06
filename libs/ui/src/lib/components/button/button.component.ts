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
      'bg-blue-500',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'dark:bg-blue-500',
      'dark:hover:bg-blue-700',
      'dark:focus:ring-blue-800',
    ],
    sky: [
      'bg-sky-500',
      'hover:bg-sky-700',
      'focus:ring-sky-500',
      'dark:bg-sky-500',
      'dark:hover:bg-sky-700',
      'dark:focus:ring-sky-800',
    ],
    red: [
      'bg-red-500',
      'hover:bg-red-700',
      'focus:ring-red-500',
      'dark:bg-red-500',
      'dark:hover:bg-red-700',
      'dark:focus:ring-red-800',
    ],
    green: [
      'bg-green-500',
      'hover:bg-green-700',
      'focus:ring-green-500',
      'dark:bg-green-500',
      'dark:hover:bg-green-700',
      'dark:focus:ring-green-800',
    ],
    purple: [
      'bg-purple-500',
      'hover:bg-purple-700',
      'focus:ring-purple-500',
      'dark:bg-purple-500',
      'dark:hover:bg-purple-700',
      'dark:focus:ring-purple-800',
    ],
  };

  public styles: string[] = [];

  ngOnInit(): void {
    this.styles = [
      ...this.colorVariants[this.color],
      `text-gray-50`,
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
