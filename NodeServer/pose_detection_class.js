
//import { solutions } from "@mediapipe/tasks-vision";

class PoseProcessor {
  constructor() {
    this.right_punch = false;
    this.left_punch = false;
    this.block = false;
    this.left_dodge = false;
    this.right_dodge = false;
    this.center_x = 0.5;
    this.center_y = 0.5;
    this.max_valid_value = 1;
    this.min_valid_value = 0;
    this.data = [];
    this.type = "";
  }

  processFrame(frame) {
    const poseLandmarkerResult = poseLandmarker.detect(frame);
    if (!poseLandmarkerResult.poseLandmarks) {
      return;
    }
    console.log(poseLandmarkerResult.poseLandmarks);
    return poseLandmarkerResult.poseLandmarks;
  }

  setType(value) {
    this.type = value;
  }

  setData(value) {
    this.data = value;
  }

  getData() {
    return this.data;
  }

  getType() {
    return this.type;
  }

  saveData(data, eventType) {
    this.setData(data);
    this.setType(eventType);
    // console.log(`Saving data: ${data}, Event type: ${eventType}`);
  }


  processData(landmarks) {

    if (landmarks) {
      // Draw lines on the frame using normalized coordinates
      //const coordinatesList = this.drawLines(frame, normalizedLandmarksList);

      //const coordinatesList = [];

      // for (const line of landmarks) {
      //   const startPoint = [
      //     landmarks[line[0]].x * frame.cols,
      //     landmarks[line[0]].y * frame.rows,
      //   ];
      //   const endPoint = [
      //     landmarks[line[1]].x * frame.cols,
      //     landmarks[line[1]].y * frame.rows,
      //   ];
      //   coordinatesList.push([startPoint, endPoint]);
      // }

      this.saveData(landmarks, "lines");

      // Calculate distances using normalized coordinates
      const rightHand = {x: landmarks[16].x, y: landmarks[16].y};
      const leftHand = {x: landmarks[15].x, y: landmarks[15].y}
      const rightShoulder = {x: landmarks[12].x, y: landmarks[12].y}
      const leftShoulder = {x: landmarks[11].x, y: landmarks[11].y}


      const distanceRightHandShoulder = Math.abs(rightHand.x - rightShoulder.x);
      const distanceLeftHandShoulder = Math.abs(leftHand.x - leftShoulder.x);
      const distanceLeftRightShoulder = Math.abs(leftShoulder.x - rightShoulder.x
      );



      //TRIGGERS

      if (this.right_punch) {
        if (
          this.min_valid_value < rightHand.x &&
          rightHand.x < this.max_valid_value &&
          this.min_valid_value < rightHand.y &&
          rightHand.y < this.max_valid_value
        ) {
          if (distanceRightHandShoulder > distanceLeftRightShoulder) {
            this.right_punch = !this.right_punch;
            this.saveData("right punch", "event");
          }
        }
      } else {
        if (distanceRightHandShoulder < distanceLeftRightShoulder) {
          this.right_punch = !this.right_punch;
        }
      }

      if (this.left_punch) {
        if (
          this.min_valid_value < leftHand.x &&
          leftHand.x < this.max_valid_value &&
          this.min_valid_value < leftHand.y &&
          leftHand.y < this.max_valid_value
        ) {
          if (distanceLeftHandShoulder > distanceLeftRightShoulder) {
            this.left_punch = !this.left_punch;
            this.saveData("left punch", "event");
          }
        }
      } else {
        if (distanceLeftHandShoulder < distanceLeftRightShoulder) {
          this.left_punch = !this.left_punch;
        }
      }

      if (this.block) {
        if (rightHand.y < rightShoulder.y && leftHand.y < leftShoulder.y) {
          this.block = !this.block;
          this.saveData("block", "event");
        }
      } else {
        if (rightHand.y > rightShoulder.y && leftHand.y > leftShoulder.y) {
          this.saveData("end block", "event");
          this.block = !this.block;
        }
      }

      if (this.left_dodge) {
        if (rightShoulder.x > this.center_x) {
          this.left_dodge = !this.left_dodge;
          this.saveData("left dodge", "event");
        }
      } else {
        if (rightShoulder.x < this.center_x) {
          this.left_dodge = !this.left_dodge;
          this.saveData("end left dodge", "event");
        }
      }

      if (this.right_dodge) {
        if (leftShoulder.x < this.center_x) {
          this.right_dodge = !this.right_dodge;
          this.saveData("right dodge", "event");
        }
      } else {
        if (leftShoulder.x > this.center_x) {
          this.right_dodge = !this.right_dodge;
          this.saveData("end right dodge", "event");
        }
      }

      // Display the frame with lines
      // cv.imshow("Pose Lines", frame);
    }
  }

  test() {
    console.log("yoooo");
  }

  static instance = new PoseProcessor();
}

// const pose = new PoseProcessor();
// pose.processData();

export default PoseProcessor;
