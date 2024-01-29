// chronometer.js
class Chronometer {
    constructor() {
      this.startTime = null;
      this.running = false;
    }
  
    start() {
      if (!this.running) {
        this.startTime = new Date().getTime();
        this.running = true;
      }
    }
  
    reset() {
      this.startTime = null;
    }
  
    getTime() {
      if (this.running) {
        return new Date().getTime() - this.startTime;
      } else {
        return 0;
      }
    }

    isRunning(){
        return this.running == true
    }
  }

  

// Export the class
export default Chronometer;
