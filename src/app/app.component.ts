import { Component, ElementRef, afterNextRender, afterRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatModel, MessageType } from './models/chat.model';
import { ServerModule } from '@angular/platform-server';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, UserDetailsComponent, ChatMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(){
    afterNextRender(() => {
      // Safe to check `scrollHeight` because this will only run in the browser, not the server.
      
    });
  }
  chatMessages : ChatModel[] = [
    new ChatModel(
      "Hello",
      new Date(),
      "pict",
      MessageType.BOT_MESSAGE
    )
  ]
  currentChatItem: ChatModel = new ChatModel(
    "",
    new Date(),
    "",
    MessageType.BOT_MESSAGE
  )
  userId: number | null = null

  addChatMessage(message: ChatModel){
    this.chatMessages.push(message)
  }


  onSend(){
    this.currentChatItem.time = new Date()
    this.addChatMessage(this.currentChatItem)
  }
}
