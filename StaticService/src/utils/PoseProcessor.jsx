import {
  VideoCapture,
  COLOR_BGR2RGB,
  Point,
  Vec3,
  destroyAllWindows,
} from "node-opencv";
import { solutions } from "@mediapipe/tasks-vision";

class PoseProcessor {
  constructor() {
    this.mp_pose = solutions.pose;
    this.pose = new this.mp_pose.Pose();
    this.cap = new VideoCapture(0);
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
    if (frame === null || frame.size === 0) {
      return null;
    }

    const frameRgb = frame.cvtColor(COLOR_BGR2RGB);
    const results = this.pose.process(frameRgb);
    if (results.poseLandmarks) {
      return results.poseLandmarks;
    } else {
      console.log("No pose landmarks found in the frame.");
      return null;
    }
  }

  drawLines(frame, landmarks) {
    const lines = [
      [
        this.mp_pose.PoseLandmark.LEFT_SHOULDER,
        this.mp_pose.PoseLandmark.LEFT_ELBOW,
      ],
      [
        this.mp_pose.PoseLandmark.LEFT_ELBOW,
        this.mp_pose.PoseLandmark.LEFT_WRIST,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_SHOULDER,
        this.mp_pose.PoseLandmark.RIGHT_ELBOW,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_ELBOW,
        this.mp_pose.PoseLandmark.RIGHT_WRIST,
      ],
      [
        this.mp_pose.PoseLandmark.LEFT_SHOULDER,
        this.mp_pose.PoseLandmark.RIGHT_SHOULDER,
      ],
      [this.mp_pose.PoseLandmark.LEFT_HIP, this.mp_pose.PoseLandmark.RIGHT_HIP],
      [
        this.mp_pose.PoseLandmark.LEFT_SHOULDER,
        this.mp_pose.PoseLandmark.LEFT_HIP,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_SHOULDER,
        this.mp_pose.PoseLandmark.RIGHT_HIP,
      ],
      [this.mp_pose.PoseLandmark.LEFT_HIP, this.mp_pose.PoseLandmark.LEFT_KNEE],
      [
        this.mp_pose.PoseLandmark.LEFT_KNEE,
        this.mp_pose.PoseLandmark.LEFT_ANKLE,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_HIP,
        this.mp_pose.PoseLandmark.RIGHT_KNEE,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_KNEE,
        this.mp_pose.PoseLandmark.RIGHT_ANKLE,
      ],
      [
        this.mp_pose.PoseLandmark.LEFT_EAR,
        this.mp_pose.PoseLandmark.LEFT_EYE_OUTER,
      ],
      [
        this.mp_pose.PoseLandmark.LEFT_EYE_INNER,
        this.mp_pose.PoseLandmark.LEFT_EYE_OUTER,
      ],
      [
        this.mp_pose.PoseLandmark.LEFT_EYE_INNER,
        this.mp_pose.PoseLandmark.NOSE,
      ],
      [
        this.mp_pose.PoseLandmark.NOSE,
        this.mp_pose.PoseLandmark.RIGHT_EYE_INNER,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_EYE_INNER,
        this.mp_pose.PoseLandmark.RIGHT_EYE_OUTER,
      ],
      [
        this.mp_pose.PoseLandmark.RIGHT_EAR,
        this.mp_pose.PoseLandmark.RIGHT_EYE_OUTER,
      ],
      [
        this.mp_pose.PoseLandmark.MOUTH_LEFT,
        this.mp_pose.PoseLandmark.MOUTH_RIGHT,
      ],
    ];

    const coordinatesList = [];

    for (const line of lines) {
      const startPoint = [
        landmarks[line[0]].x * frame.cols,
        landmarks[line[0]].y * frame.rows,
      ];
      const endPoint = [
        landmarks[line[1]].x * frame.cols,
        landmarks[line[1]].y * frame.rows,
      ];
      coordinatesList.push([startPoint, endPoint]);
      frame.drawLine(
        new cv.Point(startPoint[0], startPoint[1]),
        new cv.Point(endPoint[0], endPoint[1]),
        new cv.Vec3(0, 255, 0),
        2
      );
    }

    return coordinatesList;
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

  sendData(data, eventType) {
    this.setData(data);
    this.setType(eventType);
    // console.log(`Saving data: ${data}, Event type: ${eventType}`);
  }

  closeCamera() {
    this.cap.release();
    destroyAllWindows(); // Assuming cv is imported and cv.destroyAllWindows exists
  }

  processData() {
    const ret = this.cap.read();
    const frame = ret.frame;
    const landmarks = this.processFrame(frame);

    if (landmarks) {
      // Access normalized landmarks
      const normalizedLandmarksList = landmarks.landmark;

      // Draw lines on the frame using normalized coordinates
      const coordinatesList = this.drawLines(frame, normalizedLandmarksList);

      // Send the line data via the socket
      this.sendData(coordinatesList, "lines");

      // Calculate distances using normalized coordinates
      const rightHand =
        normalizedLandmarksList[this.mp_pose.PoseLandmark.RIGHT_WRIST.value];
      const leftHand =
        normalizedLandmarksList[this.mp_pose.PoseLandmark.LEFT_WRIST.value];
      const rightShoulder =
        normalizedLandmarksList[this.mp_pose.PoseLandmark.RIGHT_SHOULDER.value];
      const leftShoulder =
        normalizedLandmarksList[this.mp_pose.PoseLandmark.LEFT_SHOULDER.value];

      const distanceRightHandShoulder = Math.abs(rightHand.x - rightShoulder.x);
      const distanceLeftHandShoulder = Math.abs(leftHand.x - leftShoulder.x);
      const distanceLeftRightShoulder = Math.abs(
        leftShoulder.x - rightShoulder.x
      );

      // TRIGGERS

      if (this.right_punch) {
        if (
          this.min_valid_value < rightHand.x &&
          rightHand.x < this.max_valid_value &&
          this.min_valid_value < rightHand.y &&
          rightHand.y < this.max_valid_value
        ) {
          if (distanceRightHandShoulder > distanceLeftRightShoulder) {
            this.right_punch = !this.right_punch;
            this.sendData("right punch", "event");
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
            this.sendData("left punch", "event");
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
          this.sendData("block", "event");
        }
      } else {
        if (rightHand.y > rightShoulder.y && leftHand.y > leftShoulder.y) {
          this.sendData("end block", "event");
          this.block = !this.block;
        }
      }

      if (this.left_dodge) {
        if (rightShoulder.x > this.center_x) {
          this.left_dodge = !this.left_dodge;
          this.sendData("left dodge", "event");
        }
      } else {
        if (rightShoulder.x < this.center_x) {
          this.left_dodge = !this.left_dodge;
          this.sendData("end left dodge", "event");
        }
      }

      if (this.right_dodge) {
        if (leftShoulder.x < this.center_x) {
          this.right_dodge = !this.right_dodge;
          this.sendData("right dodge", "event");
        }
      } else {
        if (leftShoulder.x > this.center_x) {
          this.right_dodge = !this.right_dodge;
          this.sendData("end right dodge", "event");
        }
      }

      // Display the frame with lines
      // cv.imshow("Pose Lines", frame);
    }
  }

  test() {
    console.log("yoooo");
  }
}

// const pose = new PoseProcessor();
// pose.processData();

export default PoseProcessor;
