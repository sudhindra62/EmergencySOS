export class GuardianCountdown {
  static start(duration: number, onTick: (t: number) => void, onComplete: () => void) {
    let current = duration;
    const interval = setInterval(() => {
       current--;
       onTick(current);
       if (current <= 0) {
         clearInterval(interval);
         onComplete();
       }
    }, 1000);
    return () => clearInterval(interval);
  }
}
