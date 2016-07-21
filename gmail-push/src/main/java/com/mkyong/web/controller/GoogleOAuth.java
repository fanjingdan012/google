package com.mkyong.web.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.apache.http.Consts;
import org.apache.http.HttpHost;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.DefaultProxyRoutePlanner;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.map.ObjectMapper;

import com.gmail.integration.util.UrlBuilder;

public class GoogleOAuth {
    public static final String OAUTH2_END_POINT = "https://accounts.google.com/o/oauth2/auth";

    /** URL to end point where one can request access tokens. */
    public static final String ACCESS_TOKEN_REQUEST_END_POINT = "https://www.googleapis.com/oauth2/v3/token";

    /** URL to user info API. */
    public static final String USERINFO_API_END_POINT = "https://www.googleapis.com/oauth2/v1/userinfo";

    /** Used to tell this filter which state the user is in. */
    private static final String STATE = "try";

    public void accessTokenRequest(HttpServletResponse response) throws IOException {
        Properties properties = initProperties();
        UrlBuilder url = new UrlBuilder(OAUTH2_END_POINT);
        url.setQueryStringParameter("response_type", "code");
        url.setQueryStringParameter("client_id", properties.getProperty("client_id"));
        url.setQueryStringParameter("redirect_uri", properties.getProperty("redirect_uri"));
        url.setQueryStringParameter("scope", properties.getProperty("scope"));
        url.setQueryStringParameter("access_type", "offline");
        url.setQueryStringParameter("approval_prompt", "force");
        String destURL = url.toString();
        response.sendRedirect(destURL);
    }

    public static String getAccessToken(String code) throws Exception {

        List<NameValuePair> formparams = new ArrayList<NameValuePair>();
        formparams.add(new BasicNameValuePair("code", code));
        formparams.add(new BasicNameValuePair("client_id",
                "535158361899-coon9hsc5gib7ksm2t21lb111vqdrodv.apps.googleusercontent.com"));
        formparams.add(new BasicNameValuePair("client_secret", "5Y1CXf4YJ5ZpIIRyN0lkZ1_r"));
        formparams.add(new BasicNameValuePair("redirect_uri",
                "https://ec2-54-153-132-154.ap-southeast-2.compute.amazonaws.com/gmail-push/oauth2callback"));
        formparams.add(new BasicNameValuePair("grant_type", "authorization_code"));

        UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, Consts.UTF_8);

        HttpPost httppost = new HttpPost(ACCESS_TOKEN_REQUEST_END_POINT);
        httppost.setEntity(entity);

        HttpHost proxy = new HttpHost("proxy.sin.sap.corp", 8080);
        DefaultProxyRoutePlanner routePlanner = new DefaultProxyRoutePlanner(proxy);
        CloseableHttpClient httpclient = HttpClients.custom().setRoutePlanner(routePlanner).build();

        CloseableHttpResponse response = httpclient.execute(httppost);

        String s = "";
        String line = "";

        BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

        // Read response until the end
        while ((line = rd.readLine()) != null) {
            s += line;
        }
        ObjectMapper objectMapper = new ObjectMapper();
        System.out.println(s);
        AccessToken at = objectMapper.readValue(s, AccessToken.class);

        String token = at.getAccess_token();
        return token;

    }

    private Properties initProperties() {
        Properties properties = new Properties();
        try {
            InputStream inputStream = GoogleOAuth.class.getResourceAsStream("/configuration.properties");
            properties.load(inputStream);
            inputStream.close();
        } catch (Exception e) {

        }
        return properties;
    }

}
