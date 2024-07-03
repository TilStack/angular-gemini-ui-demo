import { Component, NO_ERRORS_SCHEMA, computed, input } from '@angular/core';
import { ChatModel, MessageType } from '../../models/chat.model';
import { MarkdownComponent} from 'ngx-markdown';
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import { HighlightAuto } from 'ngx-highlightjs';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [MarkdownComponent,HighlightAuto], // Add 'markdown' component to the imports
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  message = input.required<ChatModel>();
  messageType = MessageType 
  mdwn = `
  ## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
   - Unordered list
   - Another unordered bullet

### Blockquote
> Blockquote to the max
 `;
} 
