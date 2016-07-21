package com.gmail.integration.oauth;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

public class AuthUtil {

    // private static final String PROXY_HOST = "proxy.sin.sap.corp";
    // private static final int PROXY_PORT = 8080;
    private static String CLIENTSECRETS_LOCATION = "/client_secret.json";
    private static final String REDIRECT_URI = "https://ec2-54-153-132-154.ap-southeast-2.compute.amazonaws.com/gmail-push/oauth2callback";
    private static final String CLIENT_ID = "521079566716-i6qr0qpu9mrr9vmokgd7oh0hql3r24ve.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "IiSIWw-m4hwl0tnCyQVyjaQf";

    private static final List<String> SCOPES = Arrays.asList("https://mail.google.com/",
            "https://www.googleapis.com/auth/userinfo.email");

    private static GoogleAuthorizationCodeFlow flow = null;

    /**
     * Build an authorization flow and store it as a static class attribute.
     * 
     * @return GoogleAuthorizationCodeFlow instance.
     * @throws IOException
     *             Unable to load client_secrets.json.
     */
    public static GoogleAuthorizationCodeFlow getFlow() throws IOException {
        if (flow == null) {
            HttpTransport httpTransport = new NetHttpTransport.Builder()
            // .setProxy(
            // new Proxy(Proxy.Type.HTTP, new InetSocketAddress(PROXY_HOST, PROXY_PORT)))
                    .build();
            JacksonFactory jsonFactory = new JacksonFactory();
            GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(jsonFactory, new InputStreamReader(
                    AuthUtil.class.getResourceAsStream(CLIENTSECRETS_LOCATION)));
            flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, jsonFactory, clientSecrets, SCOPES)
                    .setAccessType("offline").setApprovalPrompt("force").build();
        }
        return flow;
    }

    /**
     * Exchange an authorization code for OAuth 2.0 credentials.
     * 
     * @param authorizationCode
     *            Authorization code to exchange for OAuth 2.0
     *            credentials.
     * @return OAuth 2.0 credentials.
     * @throws IOException
     * @throws CodeExchangeException
     *             An error occurred.
     */
    public static GoogleCredential exchangeCode(String authorizationCode) throws IOException {

        GoogleAuthorizationCodeFlow flow = getFlow();

        GoogleTokenResponse response = flow.newTokenRequest(authorizationCode).setRedirectUri(REDIRECT_URI).execute();
        response.getTokenType();
        /* GoogleCredential credential = new GoogleCredential().setFromTokenResponse(response); */
        HttpTransport httpTransport = new NetHttpTransport.Builder()
        // .setProxy(
        // new Proxy(Proxy.Type.HTTP, new InetSocketAddress(PROXY_HOST, PROXY_PORT)))
                .build();
        JacksonFactory jsonFactory = new JacksonFactory();
        GoogleCredential credential = new GoogleCredential.Builder().setTransport(httpTransport)
                .setJsonFactory(jsonFactory).setClientSecrets(CLIENT_ID, CLIENT_SECRET).build()
                .setFromTokenResponse(response);
        return credential;

    }

    /**
     * Retrieve the authorization URL.
     * 
     * @param emailAddress
     *            User's e-mail address.
     * @param state
     *            State for the authorization URL.
     * @return Authorization URL to redirect the user to.
     * @throws IOException
     *             Unable to load client_secrets.json.
     */
    public static String getAuthorizationUrl(String emailAddress, String state) throws IOException {
        GoogleAuthorizationCodeRequestUrl urlBuilder = getFlow().newAuthorizationUrl().setRedirectUri(REDIRECT_URI)
                .setState(state);
        return urlBuilder.build();
    }
}
