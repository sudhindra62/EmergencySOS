import { useGuardianCore } from "./GuardianCore";
import { EmergencyVoice } from "./EmergencyVoice";

class SensorWindow {
  samples: { t: number, v: number }[] = [];
  add(t: number, v: number, maxAgeMs: number) {
    this.samples.push({ t, v });
    while (this.samples.length > 0 && t - this.samples[0].t > maxAgeMs) {
      this.samples.shift();
    }
  }
  getSpan() {
    if (this.samples.length < 2) return 0;
    let min = this.samples[0].v;
    let max = this.samples[0].v;
    for (let i = 1; i < this.samples.length; i++) {
        if (this.samples[i].v < min) min = this.samples[i].v;
        if (this.samples[i].v > max) max = this.samples[i].v;
    }
    return max - min;
  }
  clear() {
    this.samples = [];
  }
}

class ImpactDetectorEngine {
  private isListening = false;
  
  // State machine
  private state: 'IDLE' | 'SHAKING' | 'COOLDOWN' = 'IDLE';
  private currentShakeDuration = 0;
  private currentStillnessDuration = 0;
  private lastProcessTime = 0;
  
  private lastMotionUpdate = 0;
  private lastOrientUpdate = 0;

  private accelX = new SensorWindow();
  private accelY = new SensorWindow();
  private accelZ = new SensorWindow();

  private orientBeta = new SensorWindow();
  private orientGamma = new SensorWindow();

  // Thresholds based on sliding window max-min spans
  // 1g is ~9.8 m/s^2, so a span > 9.8 could just be rotating 90 degrees quickly.
  // To detect actual shaking or impacts, we configure thresholds for high sensitivity (light shake/vibration)
  private readonly ACCEL_IMPACT_THRESHOLD = 3.0;  // Very sensitive sudden impact (~0.3g change)
  private readonly ACCEL_SHAKE_THRESHOLD = 1.5;   // Light shaking/vibration
  private readonly ACCEL_STILL_THRESHOLD = 0.5;   // Quiet

  // For orientation, changes over a short window
  private readonly ORIENT_IMPACT_THRESHOLD = 10.0; // 10-degree sudden flip
  private readonly ORIENT_SHAKE_THRESHOLD = 5.0;   // 5-degree rapid rotation
  private readonly ORIENT_STILL_THRESHOLD = 1.0;

  private readonly WINDOW_SIZE_MS = 200; // Look at the last 200ms for spans for fast reactivity
  private readonly MIN_SHAKE_DURATION = 100; // Must maintain shaking span for just 100ms
  private readonly COOLDOWN_DURATION = 2000; // ms (time to wait after continuous motion)

  private handleMotion = (event: DeviceMotionEvent) => {
    const { accelerationIncludingGravity, acceleration } = event;
    const now = Date.now();
    
    let x = 0, y = 0, z = 0;
    let hasData = false;
    
    // Prefer linear acceleration, fall back to gravity-included
    if (acceleration && acceleration.x !== null) {
       x = acceleration.x;
       y = acceleration.y || 0;
       z = acceleration.z || 0;
       hasData = true;
    } else if (accelerationIncludingGravity && accelerationIncludingGravity.x !== null) {
       x = accelerationIncludingGravity.x;
       y = accelerationIncludingGravity.y || 0;
       z = accelerationIncludingGravity.z || 0;
       hasData = true;
    }
    
    if (!hasData) return;

    this.lastMotionUpdate = now;
    this.accelX.add(now, x, this.WINDOW_SIZE_MS);
    this.accelY.add(now, y, this.WINDOW_SIZE_MS);
    this.accelZ.add(now, z, this.WINDOW_SIZE_MS);

    const spanX = this.accelX.getSpan();
    const spanY = this.accelY.getSpan();
    const spanZ = this.accelZ.getSpan();
    
    const maxSpan = Math.max(spanX, spanY, spanZ);

    this.processActivity(maxSpan, this.ACCEL_IMPACT_THRESHOLD, this.ACCEL_SHAKE_THRESHOLD, this.ACCEL_STILL_THRESHOLD, now);
  };

  private handleOrientation = (event: DeviceOrientationEvent) => {
    // If devicemotion is active, it's more reliable. Skip orientation to avoid double counting.
    const now = Date.now();
    if (now - this.lastMotionUpdate < 1000) return; 

    if (event.beta === null && event.gamma === null) return;
    
    const beta = event.beta || 0;
    const gamma = event.gamma || 0;

    this.lastOrientUpdate = now;
    
    // Euler angles wrap constraints. This is a simplified unwrap.
    // If we transition 179 -> -179, it's a 2 degree change, not 358.
    // Let's use raw value and handle wrap around in the span logic if possible, 
    // or just rely on the fact that rapid physical shaking rarely crosses the exact 180 discontinuity perfectly.
    // For a simple web app, ignoring the exact seam is usually fine.
    
    this.orientBeta.add(now, beta, this.WINDOW_SIZE_MS);
    this.orientGamma.add(now, gamma, this.WINDOW_SIZE_MS);

    // Simple span calculation (might have glitches exactly at +/- 180, but works reliably otherwise)
    const spanBeta = this.orientBeta.getSpan();
    const spanGamma = this.orientGamma.getSpan();
    
    // Correct for wrap-around glitches > 180 (e.g. 179 and -179 -> span 358 -> correct to 2)
    const correctedBeta = spanBeta > 180 ? 360 - spanBeta : spanBeta;
    const correctedGamma = spanGamma > 180 ? 360 - spanGamma : spanGamma;

    const maxSpan = Math.max(correctedBeta, correctedGamma);

    this.processActivity(maxSpan, this.ORIENT_IMPACT_THRESHOLD, this.ORIENT_SHAKE_THRESHOLD, this.ORIENT_STILL_THRESHOLD, now);
  };

  private lastReportedActivity = 0;
  private lastReportTime = 0;

  private processActivity(span: number, impactThreshold: number, shakeThreshold: number, stillThreshold: number, now: number) {
    if (this.lastProcessTime === 0) {
        this.lastProcessTime = now;
        return;
    }
    
    const deltaMs = now - this.lastProcessTime;
    if (deltaMs < 20) return; // limit actual state machine processing to ~50hz max
    this.lastProcessTime = now;

    const { impactSensitivity, setCurrentActivityLevel } = useGuardianCore.getState();
    const sensitivity = impactSensitivity || 1.0;
    const scale = 1.0 / Math.max(0.1, sensitivity);

    const adjImpactThreshold = impactThreshold * scale;
    const adjShakeThreshold = shakeThreshold * scale;
    const adjStillThreshold = stillThreshold * scale;

    // Report normalized activity for the UI meter (0-100+)
    const activityPercentage = Math.min((span / adjImpactThreshold) * 100, 200);
    
    // Throttle UI updates to ~15Hz or on major changes
    if (now - this.lastReportTime > 66 || Math.abs(activityPercentage - this.lastReportedActivity) > 20) {
        this.lastReportTime = now;
        this.lastReportedActivity = activityPercentage;
        setCurrentActivityLevel(activityPercentage);
    }

    if (this.state === 'COOLDOWN') {
        // Must be fully still for a certain duration to reset
        if (span < adjStillThreshold) {
            this.currentStillnessDuration += deltaMs;
            if (this.currentStillnessDuration >= this.COOLDOWN_DURATION) {
                this.state = 'IDLE';
            }
        } else {
            this.currentStillnessDuration = 0;
        }
        return;
    }

    // 1. Sudden, massive spike -> Instant Trigger
    if (span >= adjImpactThreshold) {
        this.state = 'COOLDOWN';
        this.currentStillnessDuration = 0;
        this.triggerCrash();
        return;
    }

    // 2. Sustained heavy shaking over duration -> Trigger
    if (span >= adjShakeThreshold) {
        if (this.state === 'IDLE') {
            this.state = 'SHAKING';
            this.currentShakeDuration = deltaMs;
        } else if (this.state === 'SHAKING') {
            this.currentShakeDuration += deltaMs;
            if (this.currentShakeDuration >= this.MIN_SHAKE_DURATION) {
                this.state = 'COOLDOWN';
                this.currentStillnessDuration = 0;
                this.triggerCrash();
            }
        }
    } else {
        // If movement falls below shake threshold, reset shake sequence.
        if (this.state === 'SHAKING') {
            this.state = 'IDLE';
            this.currentShakeDuration = 0;
        }
    }
  }

  start() {
    if (this.isListening) return;
    this.isListening = true;
    this.lastMotionUpdate = 0;
    this.lastOrientUpdate = 0;
    this.lastProcessTime = 0;
    this.state = 'IDLE';
    this.accelX.clear();
    this.accelY.clear();
    this.accelZ.clear();
    this.orientBeta.clear();
    this.orientGamma.clear();

    const { requestWakeLock } = useGuardianCore.getState();
    requestWakeLock();

    if (typeof window !== "undefined") {
        if (window.addEventListener) {
           window.addEventListener("devicemotion", this.handleMotion);
           window.addEventListener("deviceorientation", this.handleOrientation);
        }
    }
  }

  stop() {
    this.isListening = false;
    this.state = 'IDLE';
    this.lastMotionUpdate = 0;
    this.lastOrientUpdate = 0;
    
    if (typeof window !== "undefined") {
        if (window.removeEventListener) {
           window.removeEventListener("devicemotion", this.handleMotion);
           window.removeEventListener("deviceorientation", this.handleOrientation);
        }
    }
  }

  private triggerCrash() {
    const { state, setState, addTriggerScore } = useGuardianCore.getState();
    // Only trigger if we are actively monitoring or idle properly
    if (state === "idle" || state === "monitoring") {
       addTriggerScore(100);
       setState("checking");
       EmergencyVoice.speak("Strong impact detected. Are you safe? Auto-dispatching help in 90 seconds.");
    }
  }

  // Developer method to force a trigger
  forceTrigger() {
    this.triggerCrash();
  }
}

export const ImpactDetector = new ImpactDetectorEngine();
