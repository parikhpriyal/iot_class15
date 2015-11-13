#include <Servo.h>

//initialize global variables
Servo servo;

int servoPin = 9;
int angle = 0;

int RED_PIN = 6;
int BLUE_PIN = 5;
int GREEN_PIN = 3;
int DISPLAY_TIME = 100;

void setup() {
  Serial.begin(9600);
  servo.attach(9);
  pinMode(RED_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
}

void loop() {
  //reading data sent by pi
  while (Serial.available() > 0) {
    char incoming = Serial.read();
    Serial.print(incoming);

    //moving the servo when distance info has "4" as the units value
    if (incoming == '4') {
      for (angle = 0; angle < 180; angle++) {
        servo.write(angle);
        delay(15);
      }
      for (angle = 180; angle > 0; angle--) {
        servo.write(angle);
        delay(15);
      }

      //changing LED color once servo movement is completed
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, LOW);

      delay(1000);

      // Red (turn just the red LED on):

      digitalWrite(RED_PIN, HIGH);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, LOW);

      delay(1000);

      // Yellow (turn red and green on):

      digitalWrite(RED_PIN, HIGH);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, LOW);

      delay(1000);

      // Green (turn just the green LED on):

      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, LOW);

      delay(1000);

       // Cyan (turn green and blue on):

      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, HIGH);

      delay(1000);

      // Blue (turn just the blue LED on):

      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, HIGH);

      delay(1000);

      // Purple (turn red and blue on):

      digitalWrite(RED_PIN, HIGH);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, HIGH);

      delay(1000);

      // White (turn all the LEDs on):

      digitalWrite(RED_PIN, HIGH);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, HIGH);

      delay(1000);
    } 
    //no movement when distance is any number without a "4" as the units value
    else{
      angle = 0;
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, LOW);
    }
  }
}

