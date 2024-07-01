import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Content, GoogleGenerativeAI, Part } from '@google/generative-ai';
import { FileConversionService } from './file-conversion.service';
@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  constructor(private http: HttpClient, private fileConversionService: FileConversionService) {}
  isStreaming = false;
  apikey = 'AIzaSyDiNrEgQOfR7-Pe2yp44ecS0Lqix8qzAdM';
  genAI = new GoogleGenerativeAI(this.apikey);
  imageModel = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  textModel = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  promptContext = 'tu es un developpeur senior';
  chatHistory: {
    role: string;
    parts: {
      text: string;
    }[];
  }[] = [];
  generateText(prompt: string): Promise<any> {
    let test: {
      role: string;
      parts: {
        text: string;
      }[];
    }[] = [
      {
        role: 'user',
        parts: [{ text: this.promptContext }],
      },
      {
        role: 'model',
        parts: [{ text: 'oui exact' }],
      },
    ];

    for (let item of this.chatHistory) {
      test.push(item);
    }

    const chat = this.textModel.startChat({
      history: test,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
    this.chatHistory!.push({
      role: 'user',
      parts: [{ text: prompt }],
    });
    return chat.sendMessage(prompt);
  }

   async generateTextByImage(file: File, promptText: string) : Promise<any> {
    try {
      let imageBase64 = await this.fileConversionService.convertToBase64(
        URL.createObjectURL(file)
      );
    
      // Check for successful conversion to Base64
      if (typeof imageBase64 !== 'string') {
        console.error('Image conversion to Base64 failed.');
        return;
      }
      // Model initialisation missing for brevity
      let prompt = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: promptText,
        },
      ];
      const result = await this.imageModel.generateContent(prompt);
      const response = await result.response;
      console.log(response.text());
      return response.text();
    } catch (error) {
      console.error('Error converting file to Base64', error);
      return null;
    }
  }


  async geminiProStreaming( promptText: string) {
    // Model initialisation missing for brevity
    
    const prompt = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };
    const streamingResp = await this.textModel.generateContentStream(prompt);
    for await (const item of streamingResp.stream) {
      console.log('stream chunk: ' + item.text());


    }
    console.log('aggregated response: ' + (await streamingResp.response).text());
  }
}
