import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'aiTextFormat',
  standalone: true,
})
export class AiTextFormatPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {} // Inject DomSanitizer

  transform(text: string): string {
    // Implémentez la logique de formatage ici

    // Exemple avec expression régulière pour la mise en gras et le code
    text = text.replace(/\(([^)]+)\)/g, '<b>$1</b>');
    const codeBlocks = text.match(/\[code\](.+?)\[\/code\]/g); // Rechercher les blocs de code

    if (codeBlocks) {
      for (const codeBlock of codeBlocks) {
        const formattedCode = this.sanitizer.bypassSecurityTrustHtml(
          `<pre class="code"><code>${codeBlock.slice(5, -7)}</code></pre>`
        ); // Formatter et sécuriser le code
        text = text.replace(codeBlock, formattedCode.toString());
      }
    }

    return text;
  }
}
