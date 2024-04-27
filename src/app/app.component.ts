import {
  Component,
  ElementRef,
  afterNextRender,
  afterRender,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatModel, MessageType } from './models/chat.model';
import { ServerModule } from '@angular/platform-server';
import { GeminiService } from './services/gemini.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    UserDetailsComponent,
    ChatMessageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private gemini: GeminiService) {}
  chatMessages: ChatModel[] = [];
  currentChatItem: ChatModel = new ChatModel(
    '',
    new Date(),
    '',
    MessageType.BOT_MESSAGE
  );
  userId: number | null = null;

  addChatMessage(message: ChatModel) {
    this.chatMessages.push(message);
  }

  onSend() {
    if (this.currentChatItem.message != '') {
      this.currentChatItem.time = new Date();

      var newCurrentChat = new ChatModel(
        this.currentChatItem.message,
        new Date(),
        'pict',
        MessageType.USER_MESSAGE
      );
      this.addChatMessage(newCurrentChat);
      var messages = [];
      for (let chat of this.chatMessages) {
        messages.push({
          text: chat.message,
        });
      }
      this.gemini.generateText(messages).subscribe((data) => {
        var filterData = data['candidates'][0]['content']['parts'][0]['text'];
        this.currentChatItem.message = filterData;
        var currentBotChat = new ChatModel(
          this.currentChatItem.message,
          new Date(),
          'pict',
          MessageType.BOT_MESSAGE
        );
        this.addChatMessage(currentBotChat);
        this.currentChatItem.message = '';
      });

      this.currentChatItem.message = '';
    }
  }
}
