import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatModel, MessageType } from './models/chat.model';
import { GeminiService } from './services/gemini.service';
import { HighlightAuto } from 'ngx-highlightjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    UserDetailsComponent,
    ChatMessageComponent,
    HighlightAuto
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private gemini: GeminiService) {}
  isLoading = false;
  chatMessages: ChatModel[] = [];
  code = ` <!DOCTYPE html>
  <html>
  <title>HTML Tutorial</title>
  <body>
  
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
  
  </body>
  </html>`;
  currentChatItem: ChatModel = new ChatModel(
    '',
    new Date(),
    '',
    MessageType.BOT_MESSAGE
  );
  loadingChatItem: ChatModel = new ChatModel(
    '',
    new Date(),
    '',
    MessageType.LOADING_MESSAGE
  );
  userId: number | null = null;

  addChatMessage(message: ChatModel) {
    this.chatMessages.push(message);
  }

  onSend() {
    this.currentChatItem.time = new Date();
    alert(this.currentChatItem.message);
    var newCurrentChat = new ChatModel(
      this.currentChatItem.message,
      new Date(),
      'pict',
      MessageType.USER_MESSAGE
    );
    this.addChatMessage(newCurrentChat);

    if (this.imageUrl) {
      this.addChatMessage(this.loadingChatItem);
      this.gemini
        .generateTextByImage(this.selectedImage!, newCurrentChat.message)
        .then((data) => {
          // this.addChatMessage(this.loadingChatItem);
          // try{
          //   this.chatMessages.pop()
          //   var finalData = data.subscribe(data =>{
          //     this.currentChatItem.message = data.response.text()
          //     this.addChatMessage(this.currentChatItem) 
          //   })
          // }
          // catch{
          //   this.chatMessages.pop()
          //   this.currentChatItem.messageType = MessageType.ERROR_MESSAGE
          //   this.currentChatItem.message = "An error occured try again"
          //   this.addChatMessage(this.currentChatItem)
          // }

          alert(data);
         
        })
        .catch((e) => {
          alert(e.message);
        });
    } else {
      this.addChatMessage(this.loadingChatItem);
      this.gemini
        .generateText(newCurrentChat.message)
        .then((data) => {
          var filterData = data.response.text();
          this.currentChatItem.message = filterData;
          var currentBotChat = new ChatModel(
            this.currentChatItem.message,
            new Date(),
            'pict',
            MessageType.BOT_MESSAGE
          );
          this.chatMessages.pop();
          this.addChatMessage(currentBotChat);
          this.gemini.chatHistory.push({
            role: 'model',
            parts: [{ text: this.currentChatItem.message }],
          });
          
          this.currentChatItem.message = '';
        })
        .catch((error) => {
          console.error('Promise rejected with error: ' + error);
        });
    }

    this.currentChatItem.message = '';
  }

  selectedImage: File | null = null;
  imageUrl: string | null = null;
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];

    if (this.selectedImage) {
      const objectURL = URL.createObjectURL(this.selectedImage);
      this.imageUrl = objectURL;
    }
  }
}



