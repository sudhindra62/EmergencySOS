export class EmergencyVoice {
  static speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 1.0;
      window.speechSynthesis.speak(msg);
    }
  }
  static cancel() {
     if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
     }
  }
}
