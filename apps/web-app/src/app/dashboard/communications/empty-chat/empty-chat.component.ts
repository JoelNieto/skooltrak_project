import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'sk-empty-chat',
    imports: [CommonModule],
    template: `<p>empty-chat works!</p>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyChatComponent {}
