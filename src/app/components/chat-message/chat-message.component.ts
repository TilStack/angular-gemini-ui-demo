import { Component, computed, input } from '@angular/core';
import { ChatModel, MessageType } from '../../models/chat.model';
import { AiTextFormatPipe } from '../../services/ai-text-format.pipe';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [AiTextFormatPipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  message = input.required<ChatModel>();
  messageType = MessageType
}
