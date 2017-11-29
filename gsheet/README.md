#Google Sheet API Demo  
##Follow quickstart  
###https://developers.google.com/sheets/api/quickstart/java  
##Run it  
###0. register a google app from https://console.developers.google.com  
![](https://github.com/fanjingdan012/google/blob/master/gsheet/screenshots/google_credential.png)  
####0.1 create a OAuth 2.0 Client ID token, modify redirect uri to http://localhost:55039/Callback  
![](https://github.com/fanjingdan012/google/blob/master/gsheet/screenshots/redirect_uri.PNG)  
####0.2 Download that token  
###1. modify client_secret.json. fill in <your_xxx>  
###2. create a google sheet: https://docs.google.com/spreadsheets/d/  
####2.1 fill in spread sheet id to Quickstart.java  
###3. Run main method in Quickstart, it contains read and write, both works  
####result:  
![](https://github.com/fanjingdan012/google/blob/master/gsheet/screenshots/sheet.PNG)  
