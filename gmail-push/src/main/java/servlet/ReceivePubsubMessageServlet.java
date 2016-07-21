package servlet;

import java.io.IOException;

import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.client.json.JsonParser;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.pubsub.model.PubsubMessage;
import com.mkyong.web.controller.HelloController;

// The following class is based on the HTTP Servlet 2.5 standard and
// should be registered to listen to your subscription endpoint URL
// and configured in your Web servlet environment (usually through
// your web.xml configuration).
@WebServlet("/receive")
public class ReceivePubsubMessageServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        HelloController.append("./messagesPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.txt", "messagereceivedPOST\n");

        ServletInputStream reader = req.getInputStream();
        // Parse the JSON message to the POJO model class.
        JsonParser parser = JacksonFactory.getDefaultInstance().createJsonParser(reader);
        parser.skipToKey("message");
        PubsubMessage message = parser.parseAndClose(PubsubMessage.class);
        HelloController.append("./messagesPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.txt",
                "messagereceived,id:" + message.getMessageId() + "\n");
        // Base64-decode the data and work with it.
        String data = new String(message.decodeData(), "UTF-8");
        HelloController.append("./messagesPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.txt", "data:" + message.getMessageId() + "\n");

        // Work with your message
        // Respond with a 20X to acknowledge receipt of the message.
        resp.setStatus(HttpServletResponse.SC_OK);
        // resp.getWriter().write(message.getMessageId());
        resp.getWriter().close();
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HelloController.append("./messagesPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.txt", "messagereceivedget\n");

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write("hello receive get");
        resp.getWriter().close();
    }
}