import cv2
import mediapipe as mp

class PoseProcessor:
    def __init__(self):
        self.mp_pose = mp.solutions.pose # type: ignore
        self.pose = self.mp_pose.Pose()
        self.cap = cv2.VideoCapture(0)
        self.right_punch = False
        self.left_punch = False
        self.block = False
        self.left_dodge = False
        self.right_dodge = False
        self.center_x = 0.5
        self.center_y = 0.5
        self.max_valid_value = 1
        self.min_valid_value = 0
        self.data = []
        self.type = ""

    def process_frame(self, frame):
        if frame is None or frame.size == 0:
            return None

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(frame_rgb)
        if results.pose_landmarks:
            return results.pose_landmarks
        else:
            print("No pose landmarks found in the frame.")
            return None


    def draw_lines(self, frame, landmarks):
        lines = [
        (self.mp_pose.PoseLandmark.LEFT_SHOULDER, self.mp_pose.PoseLandmark.LEFT_ELBOW),
        (self.mp_pose.PoseLandmark.LEFT_ELBOW, self.mp_pose.PoseLandmark.LEFT_WRIST),
        (self.mp_pose.PoseLandmark.RIGHT_SHOULDER, self.mp_pose.PoseLandmark.RIGHT_ELBOW),
        (self.mp_pose.PoseLandmark.RIGHT_ELBOW, self.mp_pose.PoseLandmark.RIGHT_WRIST),
        (self.mp_pose.PoseLandmark.LEFT_SHOULDER, self.mp_pose.PoseLandmark.RIGHT_SHOULDER),
        (self.mp_pose.PoseLandmark.LEFT_HIP, self.mp_pose.PoseLandmark.RIGHT_HIP),
        (self.mp_pose.PoseLandmark.LEFT_SHOULDER, self.mp_pose.PoseLandmark.LEFT_HIP),
        (self.mp_pose.PoseLandmark.RIGHT_SHOULDER, self.mp_pose.PoseLandmark.RIGHT_HIP),
        (self.mp_pose.PoseLandmark.LEFT_HIP, self.mp_pose.PoseLandmark.LEFT_KNEE),
        (self.mp_pose.PoseLandmark.LEFT_KNEE, self.mp_pose.PoseLandmark.LEFT_ANKLE),
        (self.mp_pose.PoseLandmark.RIGHT_HIP, self.mp_pose.PoseLandmark.RIGHT_KNEE),
        (self.mp_pose.PoseLandmark.RIGHT_KNEE, self.mp_pose.PoseLandmark.RIGHT_ANKLE),
        (self.mp_pose.PoseLandmark.LEFT_EAR, self.mp_pose.PoseLandmark.LEFT_EYE_OUTER),
        (self.mp_pose.PoseLandmark.LEFT_EYE_INNER, self.mp_pose.PoseLandmark.LEFT_EYE_OUTER),
        (self.mp_pose.PoseLandmark.LEFT_EYE_INNER, self.mp_pose.PoseLandmark.NOSE),
        (self.mp_pose.PoseLandmark.NOSE, self.mp_pose.PoseLandmark.RIGHT_EYE_INNER),
        (self.mp_pose.PoseLandmark.RIGHT_EYE_INNER, self.mp_pose.PoseLandmark.RIGHT_EYE_OUTER),
        (self.mp_pose.PoseLandmark.RIGHT_EAR, self.mp_pose.PoseLandmark.RIGHT_EYE_OUTER),
        (self.mp_pose.PoseLandmark.MOUTH_LEFT, self.mp_pose.PoseLandmark.MOUTH_RIGHT),
    ]

        coordinates_list = []

        for line in lines:
            start_point = (
                int(landmarks[line[0]].x * frame.shape[1]),
                int(landmarks[line[0]].y * frame.shape[0]),
            )
            end_point = (
                int(landmarks[line[1]].x * frame.shape[1]),
                int(landmarks[line[1]].y * frame.shape[0]),
            )
            coordinates_list.append((start_point, end_point))
            cv2.line(frame, start_point, end_point, (0, 255, 0), 2)

        return coordinates_list


    def set_type(self, value):
        self.type = value

    def set_data(self, value):
        #Could add some filtering for error protection
        self.data = value


    def get_data(self):
         return self.data

    def get_type(self):
         return self.type
    

    def send_data(self, data, event_type):
        # Set an attribute of the class with the data and event_type
        self.set_data(data)
        self.set_type(event_type)
        #print(f"Saving data: {data}, Event type: {event_type}")

    def close_camera(self):
        self.cap.release()
        self.cv2.destroyAllWindows() # type: ignore


    def process_data(self):
        
        ret, frame = self.cap.read()
        landmarks = self.process_frame(frame)

        if landmarks:
            
                # Access normalized landmarks
                normalized_landmarks_list = landmarks.landmark

                # Draw lines on the frame using normalized coordinates
                coordinates_list = self.draw_lines(frame, normalized_landmarks_list)

                #Send the line data via the socket 
                self.send_data(coordinates_list, "lines")

                # Calculate distances using normalized coordinates
                right_hand = normalized_landmarks_list[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
                left_hand = normalized_landmarks_list[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
                right_shoulder = normalized_landmarks_list[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                left_shoulder = normalized_landmarks_list[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]

                distance_right_hand_shoulder = abs(right_hand.x - right_shoulder.x)
                distance_left_hand_shoulder = abs(left_hand.x - left_shoulder.x)
                distance_left_right_shoulder = abs(left_shoulder.x - right_shoulder.x)


                ## TRIGGERS

                if (self.right_punch): 
                        if((self.min_valid_value < right_hand.x < self.max_valid_value) and ((self.min_valid_value < right_hand.y < self.max_valid_value))):
                            if (distance_right_hand_shoulder > distance_left_right_shoulder):
                                self.right_punch = not self.right_punch
                                self.send_data("right punch", "event")
                else:
                        if (distance_right_hand_shoulder < distance_left_right_shoulder):
                            self.right_punch = not self.right_punch

        
                if (self.left_punch): 
                    if((self.min_valid_value < left_hand.x < self.max_valid_value) and ((self.min_valid_value < left_hand.y < self.max_valid_value))):   
                        if (distance_left_hand_shoulder > distance_left_right_shoulder):
                            self.left_punch = not self.left_punch
                            self.send_data("left punch","event")
                else:
                        if (distance_left_hand_shoulder < distance_left_right_shoulder):
                            self.left_punch = not self.left_punch

                
                if (self.block):
                        if ((right_hand.y < right_shoulder.y) and (left_hand.y < left_shoulder.y)):
                            self.block = not self.block
                            self.send_data("block","event")
                else:
                        if ((right_hand.y > right_shoulder.y) and (left_hand.y > left_shoulder.y)):
                            self.send_data("end block","event")
                            self.block = not self.block


                if (self.left_dodge):
                    if (right_shoulder.x > self.center_x):
                        self.left_dodge = not self.left_dodge
                        self.send_data("left dodge","event")
                else:
                        if (right_shoulder.x < self.center_x):
                            self.left_dodge = not self.left_dodge
                            self.send_data("end left dodge","event")


                if (self.right_dodge):
                    if (left_shoulder.x < self.center_x):
                        self.right_dodge = not self.right_dodge
                        self.send_data("right dodge","event")
                else:
                        if (left_shoulder.x > self.center_x):
                            self.right_dodge = not self.right_dodge
                            self.send_data("end right dodge","event")
                        

                # Display the frame with lines
                #cv2.imshow("Pose Lines", frame)


    def test(self):
         print("yoooo")


#pose = PoseProcessor()
#pose.process_data()