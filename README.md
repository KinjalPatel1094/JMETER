# JMeter Performance Testing Project


This project involves performance testing using Apache JMeter on the Blazedemo and OrangeHRM demo websites. The Blazemeter Chrome extension was used for recording the test scenarios and tests executed using Apache JMeter.

# Installation

# Step 1: Download and Install Apache JMeter

        Go to the Apache JMeter download page.
        Download the latest version of JMeter (binary zip file).
        Extract the downloaded archive to a suitable location on your machine.

# Step2 : Prerequirements

         JMeter is compatible with Java 8 or higher. Install Java 8+ on your machine.
         Set JAVA_HOME environment Variable according to your machine's Operating System.

# Step 3: Set Up Blazemeter Chrome Extension

         Open Chrome and go to the Blazemeter Chrome Extension.
         Add the extension to Chrome.
         Use the extension to record your test scenarios.

# Running the Test Plan

# GUI Mode

1.Open JMeter:
  Navigate to the JMeter bin/jmeter.sh file on macOS/Linux or bin/jmeter.bat for Windows.
  Open this file in terminal.It will start Jmeter.

2.Load the Test Plan:
  In JMeter, go to File > Open and select the test plan .jmx file included in this project.
 
3.Configure Test Plan(If required):
  Adjust any configurations as necessary, such as the number of users, ramp-up period, and loop count.

4.Run the Test Plan:
  Click the green Start button to run the test plan.
  Monitor the results in the View Results Tree or View results in Table listeners.

# Non-GUI Mode

1.Open Command line/Terminal ＞ Goto JMeter’s bin folder.
2.Run the command

  Windows:
  jmeter -n -t “location of your test file” -l “location of result/report file”

  Linux / MacOS:
  sh jmeter -n -t “location of your test file” -l “location of result/report file”

 # HTML Reports
 
 1.Create HTML report at the end of the test:
   jmeter -n -t “location of test file” -l “location of your result file” -e -o “location of reports folder”

 2.Create report from a standalone csv(report/result) file:
   jmeter -g “location of your result file” -o “location of reports folder”

