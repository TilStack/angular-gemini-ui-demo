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
    HighlightAuto,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private gemini: GeminiService) {}
  isLoading = false;
  chatMessages: ChatModel[] = [];
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
    var newCurrentChat = new ChatModel(
      this.currentChatItem.message,
      new Date(),
      this.selectedImage != null ? this.imageUrl! : '',
      this.selectedImage != null
        ? MessageType.USER_IMAGE_MESSAGE
        : MessageType.USER_MESSAGE
    );

    var imageCopy = this.selectedImage;
    this.removeImage();
    this.addChatMessage(newCurrentChat);

    if (imageCopy) {
      this.addChatMessage(this.loadingChatItem);
      this.gemini
        .generateTextByImage(imageCopy, newCurrentChat.message)
        .then((data) => {
          try {
            this.addBotBull(data);
          } catch (e) {
            this.chatMessages.pop();
            this.currentChatItem.messageType = MessageType.ERROR_MESSAGE;
            this.currentChatItem.message = 'An error occured try again';
            this.addChatMessage(this.currentChatItem);
            console.error(e);
          }
        })
        .catch((e) => {
          console.error('Promise rejected with error: ' + e);
        });
    } else if (this.gemini.isStreaming == true) {
      this.addChatMessage(this.loadingChatItem);
      this.gemini.geminiProStreaming(newCurrentChat.message).then((data) => {
        this.addBotBull(this.gemini.stramingResponse);
      });
    } 
    else {
      this.addChatMessage(this.loadingChatItem);
      this.gemini
        .generateText(newCurrentChat.message)
        .then((data) => {
          var filterData = data.response.text();
          this.addBotBull(filterData);
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

  // remove image

  removeImage() {
    this.selectedImage = null;
    this.imageUrl = null;
  }

  addBotBull(data: any) {
    this.currentChatItem.message = data;
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
    this.removeImage();
    this.currentChatItem.message = '';
  }
}
