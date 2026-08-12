export class SilenceDetector {
  private static audioCtx: AudioContext | null = null;
  private static analyser: AnalyserNode | null = null;
  private static stream: MediaStream | null = null;

  static async startMonitoring(onSilenceDetected: () => void) {
    if (typeof window === "undefined" || !navigator.mediaDevices) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      source.connect(this.analyser);
      this.analyser.fftSize = 256;

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // If average volume is very low, consider it silent
        if (average < 10) {
            onSilenceDetected();
        }

        requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.warn("SilenceDetector: Microphone access denied or unavailable", err);
    }
  }

  static stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.analyser = null;
  }
}
