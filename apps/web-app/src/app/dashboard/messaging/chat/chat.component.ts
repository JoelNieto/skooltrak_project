import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { QuillModule } from 'ngx-quill';

import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { ChatsLoadingComponent } from '../chats-loading/chats-loading.component';
import { ChatStore } from './chat.store';

@Component({
  selector: 'sk-chat',
  template: ` <div class="flex flex-col h-[32rem]">
    @if (store.loading()) {
      <sk-chats-loading />
    } @else {
      <div
        class="flex grow flex-col-reverse py-6 px-12 gap-6 overflow-y-scroll scroll-smooth"
        #chatContainer
      >
        @for (message of store.messages(); track message.id) {
          <div class="flex" [ngClass]="{ 'justify-end': message.mine }">
            <div class="flex-col">
              @if (!message.mine) {
                <div
                  class="font-sans text-sm text-blue-800 flex gap-1 mb-2 font-semibold "
                >
                  <sk-avatar
                    [fileName]="message.user.avatar_url ?? 'default_avatar.jpg'"
                    class="h-5"
                    rounded
                  />
                  {{ message.user.first_name }}
                </div>
              }
              <div
                [ngClass]="{
                  'bg-blue-600 text-white dark:bg-sky-900 dark:text-blue-200 rounded-ee-sm':
                    message.mine,
                  'bg-blue-100 text-sky-700 dark:bg-sky-600 dark:text-blue-100 rounded-es-sm':
                    !message.mine
                }"
                class="px-4 py-3 rounded-2xl relative chat-item"
                [innerHTML]="message.text"
              ></div>
              <div
                class="text-xs font-sans text-gray-400 font-thin mt-2 "
                [class.text-end]="message.mine"
              >
                {{ message.sent_at | date: 'medium' }}
              </div>
            </div>
          </div>
        }
      </div>
      <form class="flex-none">
        <label for="chat" class="sr-only">Your message</label>
        <div class="flex items-center px-3 gap-3 py-2 dark:bg-gray-600">
          <quill-editor
            [formControl]="messageControl"
            [modules]="modules"
            theme="snow"
            [placeholder]="'MESSAGING.SEND_PLACEHOLDER' | translate"
            [styles]="{ height: '3rem' }"
            class="block w-full rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm"
          />
          <button
            type="button"
            class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:blue -blue-500 dark:hover:bg-gray-600"
            [disabled]="messageControl.invalid"
            (click)="sendMessage()"
          >
            <span class="sr-only">Send message</span>
          </button>
        </div>
      </form>
    }
  </div>`,
  styles: [
    `
      quill-editor {
        @apply block p-0;
      }

      ::ng-deep .ql-container.ql-snow,
      ::ng-deep .ql-editor,
      ::ng-deep .ql-toolbar.ql-snow {
        @apply border-0 px-2 py-0.5;
      }

      ::ng-deep .ql-container {
        resize: vertical;
        overflow-y: scroll;
      }

      .chat-item {
        img {
          max-height: 3rem;
        }
      }
    `,
  ],
  providers: [ChatStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgClass,
    DatePipe,
    AvatarComponent,
    QuillModule,
    ChatsLoadingComponent,
  ],
})
export class ChatComponent implements OnInit {
  private chatContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('chatContainer');
  public readonly store = inject(ChatStore);
  public readonly state = inject(webStore.MessagesStore);
  private route = inject(ActivatedRoute);
  public messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
  };

  public ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: ({ chat_id }) => {
        patchState(this.state, { selectedId: chat_id });
        this.messageControl.reset();
      },
    });
  }

  public sendMessage(): void {
    const { nativeElement } = this.chatContainer();
    this.store.sendMessage(this.messageControl.value);
    this.messageControl.setValue('');
    nativeElement.scroll({ top: nativeElement.scrollHeight });
  }
}
