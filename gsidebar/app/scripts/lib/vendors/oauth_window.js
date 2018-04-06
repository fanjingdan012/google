// var bridgeAuthInfo = '<!DOCTYPE html>\
//                                     <html lang="en" class="no-js">\
//                                     <head>\
//                                         <meta charset="utf-8">\
//                                         <meta name="viewport" content="width=device-width, initial-scale=1.0" />\
//                                         <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />\
//                                         <title>Please Wait...</title>\
//                                         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.96.1/css/materialize.min.css">\
//                                         <style>  </style> <!-- Bootstrap -->\
//                                         <!--link href="' + WizyServerConfig.base_url + '/static/css/main.css" rel="stylesheet" />\
//                                         <link rel="shortcut icon" href="' + WizyServerConfig.base_url + '/static/img/favicon.ico" /-->\
//                                     </head>\
//                                     <body>\
//                                         <nav class="white main-nav">\
//                                             <div class="nav-wrapper">\
//                                               <a href="#" class="brand-logo"><img height="44" src="' + chrome.extension.getURL('images/sap-anywhere-logo.jpg') + '"></a>\
//                                             </div>\
//                                         </nav>\
//                                         <div class="row app-body">\
//                                             <div style="pop-message">\
//                                                 <center>\
//                                                     <h3>Activating</h3>\
//                                                     <p>please wait...</p>\
//                                                 </center>\
//                                             </div>\
//                                         </div>\
//                                     </body>\
//                                     </html>';

if (window.location.pathname === '/o/oauth2/approval') {
    chrome.runtime.sendMessage({
        'action': 'close_oauth_window'
    })
}