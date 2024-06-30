import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Content, GoogleGenerativeAI, Part } from '@google/generative-ai';
@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  constructor(private http: HttpClient) {}
  apikey = 'AIzaSyDiNrEgQOfR7-Pe2yp44ecS0Lqix8qzAdM';
  url =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.apikey}`;
  genAI = new GoogleGenerativeAI(this.apikey);
  model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
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

    const chat = this.model.startChat({
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

  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // async fileToGenerativePart(path: any, mimeType: any, image: File): Promise<any> {
  //   let data = await this.toBase64(image)
  //   return {
  //     inlineData: {
  //       data: data,
  //       mimeType,
  //     },
  //   };
  // }

  async generateTextByImage(image: File, prompt: string){
    let data : string = await this.toBase64(image)
    

    const imagePrompt: Part = {
      inlineData: {
        data: data /* see JavaScript quickstart for details */,
        mimeType: "image/png",
      },
    };
    alert(imagePrompt.inlineData.data) 
    console.log(imagePrompt.inlineData.data)
    const result = await this.model.generateContent([prompt, data]);
    console.log(result.response.text());
    alert(result.response.text());
  }
}
