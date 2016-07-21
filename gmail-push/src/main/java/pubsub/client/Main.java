package pubsub.client;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.api.services.pubsub.Pubsub;
import com.google.api.services.pubsub.model.AcknowledgeRequest;
import com.google.api.services.pubsub.model.Binding;
import com.google.api.services.pubsub.model.ListSubscriptionsResponse;
import com.google.api.services.pubsub.model.ListTopicSubscriptionsResponse;
import com.google.api.services.pubsub.model.ListTopicsResponse;
import com.google.api.services.pubsub.model.Policy;
import com.google.api.services.pubsub.model.PubsubMessage;
import com.google.api.services.pubsub.model.PullRequest;
import com.google.api.services.pubsub.model.PullResponse;
import com.google.api.services.pubsub.model.PushConfig;
import com.google.api.services.pubsub.model.ReceivedMessage;
import com.google.api.services.pubsub.model.SetIamPolicyRequest;
import com.google.api.services.pubsub.model.Subscription;
import com.google.api.services.pubsub.model.Topic;

/**
 * Main class for the Cloud Pub/Sub command line sample application.
 */
public final class Main {

    /**
     * Prevents initialization.
     */
    private Main() {
    }

    /**
     * Pull batch size.
     */
    static final int BATCH_SIZE = 1000;

    /**
     * A name of environment variable for decide whether or not to loop.
     */
    static final String LOOP_ENV_NAME = "LOOP";

    /**
     * Options for parser.
     */
    // private static Options options;

    // static {
    // options = new Options();
    // options.addOption("l", "loop", false, "Loop forever for pulling when specified");
    //
    // }

    /**
     * Enum representing subcommands.
     */
    private enum CmdLineOperation {
        /**
         * Action for creating a new topic.
         */
        create_topic {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                TopicMethods.createTopic(client, args);
            }
        },
        /**
         * Action for publishing a message to a topic.
         */
        publish_message {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                TopicMethods.publishMessage(client, args);
            }
        },
        /**
         * Action for connecting to an IRC channel and publishing messages to a
         * topic.
         */
        connect_irc {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                TopicMethods.connectIrc(client, args);
            }
        },
        /**
         * Action for listing topics in a project.
         */
        list_topics {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                TopicMethods.listTopics(client, args);
            }
        },
        /**
         * Action for deleting a topic.
         */
        delete_topic {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                TopicMethods.deleteTopic(client, args);
            }
        },
        /**
         * Action for creating a new subscription.
         */
        create_subscription {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                SubscriptionMethods.createSubscription(client, args);
            }
        },
        /**
         * Action for pulling messages from a subscription.
         */
        pull_messages {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                SubscriptionMethods.pullMessages(client, args);
            }
        },
        /**
         * Action for listing subscriptions in a project.
         */
        list_subscriptions {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                SubscriptionMethods.listSubscriptions(client, args);
            }
        },
        /**
         * Action for deleting a subscription.
         */
        delete_subscription {
            @Override
            void run(final Pubsub client, final String[] args) throws IOException {
                SubscriptionMethods.deleteSubscription(client, args);
            }
        };

        /**
         * Abstruct method for this Enum.
         * 
         * @param client
         *            Cloud Pub/Sub client.
         * @param args
         *            Command line arguments.
         * @throws IOException
         *             when Cloud Pub/Sub API calls fail.
         */
        abstract void run(Pubsub client, String[] args) throws IOException;
    }

    // /**
    // * Checks if the argument has enough length.
    // *
    // * @param args
    // * Command line arguments.
    // * @param min
    // * Minimum length of the arguments.
    // */
    // static void checkArgsLength(final String[] args, final int min) {
    // if (args.length < min) {
    // help();
    // System.exit(1);
    // }
    // }

    // /**
    // * Prints out the usage to stderr.
    // */
    // public static void help() {
    // System.err.println("Usage: pubsub-sample.[sh|bat] [options] arguments");
    // HelpFormatter formatter = new HelpFormatter();
    // PrintWriter writer = new PrintWriter(System.err);
    // formatter.printOptions(writer, 80, options, 2, 2);
    // writer.print("Available arguments are:\n" + "PROJ list_topics\n" + "PROJ create_topic TOPIC\n"
    // + "PROJ delete_topic TOPIC\n" + "PROJ list_subscriptions\n"
    // + "PROJ create_subscription SUBSCRIPTION LINKED_TOPIC " + "[PUSH_ENDPOINT]\n"
    // + "PROJ delete_subscription SUBSCRIPTION\n" + "PROJ connect_irc TOPIC SERVER CHANNEL\n"
    // + "PROJ publish_message TOPIC MESSAGE\n" + "PROJ pull_messages SUBSCRIPTION\n");
    // writer.close();
    // }
    //
    // public static void cmd(final String[] args) throws ParseException, IOException {
    // CommandLineParser parser = new BasicParser();
    // CommandLine cmd = parser.parse(options, args);
    // String[] cmdArgs = cmd.getArgs();
    // checkArgsLength(cmdArgs, 2);
    // if (cmd.hasOption("loop")) {
    // System.setProperty(LOOP_ENV_NAME, "loop");
    // }
    // Pubsub client = PubsubUtils.getClient();
    // try {
    // CmdLineOperation cmdLineOperation = CmdLineOperation.valueOf(cmdArgs[1]);
    // cmdLineOperation.run(client, cmdArgs);
    // } catch (IOException e) {
    // e.printStackTrace();
    // System.exit(1);
    // } catch (IllegalArgumentException e) {
    // help();
    // System.exit(1);
    // }
    // }

    public static void createTopic(Pubsub client) throws IOException {

        Topic newTopic = client.projects().topics()
                .create("projects/testgmailoauth-1023/topics/gmail-push", new Topic()).execute();
        System.out.println("Created: " + newTopic.getName());
    }

    public static void createPushSubscription(Pubsub client) throws IOException {
        // Only needed if you are using push delivery
        // String pushEndpoint = "https://ec2-54-153-132-154.ap-southeast-2.compute.amazonaws.com/gmail-push/receive";
        String pushEndpoint = "https://gmailpush.duapp.com/receive";
        PushConfig pushConfig = new PushConfig().setPushEndpoint(pushEndpoint);

        Subscription subscription = new Subscription()
        // The name of the topic from which this subscription
        // receives messages
                .setTopic("projects/testgmailoauth-1023/topics/gmail-push")
                // Ackowledgement deadline in second
                .setAckDeadlineSeconds(20)
                // Only needed if you are using push delivery
                .setPushConfig(pushConfig);

        Subscription newSubscription = client.projects().subscriptions()
                .create("projects/testgmailoauth-1023/subscriptions/gmail-push-subscription", subscription).execute();
        System.out.println("Created: " + newSubscription.getName());
    }

    public static void listSubscription(Pubsub pubsub) throws IOException {

        Pubsub.Projects.Subscriptions.List listMethod = pubsub.projects().subscriptions()
                .list("projects/testgmailoauth-1023");
        String nextPageToken = null;
        ListSubscriptionsResponse response;
        do {
            if (nextPageToken != null) {
                listMethod.setPageToken(nextPageToken);
            }
            response = listMethod.execute();
            List<Subscription> subscriptions = response.getSubscriptions();
            if (subscriptions != null) {
                for (Subscription subscription : subscriptions) {
                    // pubsub.projects().subscriptions().delete(subscription.getName()).execute();
                    System.out.println("Found subscription: " + subscription.getPushConfig().getPushEndpoint());
                }
            }
            nextPageToken = response.getNextPageToken();
        } while (nextPageToken != null);
    }

    public static void listTopic(Pubsub pubsub) throws IOException {

        com.google.api.services.pubsub.Pubsub.Projects.Topics.List listMethod = pubsub.projects().topics()
                .list("projects/testgmailoauth-1023");
        String nextPageToken = null;
        ListTopicsResponse response;
        do {
            if (nextPageToken != null) {
                listMethod.setPageToken(nextPageToken);
            }
            response = listMethod.execute();
            List<Topic> topics = response.getTopics();
            if (topics != null) {
                for (Topic topic : topics) {
                    // pubsub.projects().subscriptions().delete(subscription.getName()).execute();
                    System.out.println("Found topic: " + topic.getName());
                }
            }
            nextPageToken = response.getNextPageToken();
        } while (nextPageToken != null);
    }

    public static void createPullSubscription(Pubsub pubsub) throws IOException {
        Subscription subscription = new Subscription()
        // The name of the topic from which this subscription
        // receives messages
                .setTopic("projects/testgmailoauth-1023/topics/gmail-push")
                // Ackowledgement deadline in second
                .setAckDeadlineSeconds(20);
        // Only needed if you are using push delivery
        // .setPushConfig(pushConfig);
        Subscription newSubscription = pubsub.projects().subscriptions()
                .create("projects/testgmailoauth-1023/subscriptions/gmail-pull-subscription", subscription).execute();
        System.out.println("Created: " + newSubscription.getName());
    }

    public static void receiveByPull(Pubsub pubsub) throws IOException {
        String subscriptionName = "projects/testgmailoauth-1023/subscriptions/gmail-pull-subscription";
        // You can fetch multiple messages with a single API call.
        int batchSize = 10;
        PullRequest pullRequest = new PullRequest()
        // Setting ReturnImmediately to false instructs the API to
        // wait to collect the message up to the size of
        // MaxEvents, or until the timeout.
                .setReturnImmediately(false).setMaxMessages(batchSize);
        do {
            PullResponse pullResponse = pubsub.projects().subscriptions().pull(subscriptionName, pullRequest).execute();
            List<String> ackIds = new ArrayList<>(batchSize);
            List<ReceivedMessage> receivedMessages = pullResponse.getReceivedMessages();
            if (receivedMessages == null || receivedMessages.isEmpty()) {
                // The result was empty.
                System.out.println("There were no messages.");
                continue;
            }
            for (ReceivedMessage receivedMessage : receivedMessages) {
                PubsubMessage pubsubMessage = receivedMessage.getMessage();
                if (pubsubMessage != null) {
                    System.out.print("Message: ");
                    System.out.println(new String(pubsubMessage.decodeData(), "UTF-8"));
                }
                ackIds.add(receivedMessage.getAckId());
            }
            // Ack can be done asynchronously if you care about throughput.
            AcknowledgeRequest ackRequest = new AcknowledgeRequest().setAckIds(ackIds);
            pubsub.projects().subscriptions().acknowledge(subscriptionName, ackRequest).execute();
            // You can keep pulling messages by changing the condition below.
        } while (true);
    }

    public static void setIamPolicy(Pubsub client) throws IOException {
        List<Binding> bindings = new ArrayList<Binding>();
        List<String> members = new ArrayList<String>();
        members.add("serviceAccount:gmail-api-push@system.gserviceaccount.com");
        members.add("serviceAccount:521079566716-lom12pk7vvne77i06k876j3ulgjf6spa@developer.gserviceaccount.com");
        Binding bRole = new Binding().setRole("roles/pubsub.publisher").setMembers(members);
        bindings.add(bRole);
        Policy policy = new Policy().setBindings(bindings);
        SetIamPolicyRequest content = new SetIamPolicyRequest().setPolicy(policy);
        client.projects().topics().setIamPolicy("projects/testgmailoauth-1023/topics/gmail-push", content).execute();

        // .create("projects/testgmailoauth-1023/topics/gmail-push", new Topic()).execute();
        System.out.println("Granted:gmail push ");
    }

    public static void listTopicSub(Pubsub pubsub) throws IOException {

        com.google.api.services.pubsub.Pubsub.Projects.Topics.Subscriptions.List listMethod = pubsub.projects()
                .topics().subscriptions().list("projects/testgmailoauth-1023/topics/gmail-push");
        String nextPageToken = null;
        ListTopicSubscriptionsResponse response;
        do {
            if (nextPageToken != null) {
                listMethod.setPageToken(nextPageToken);
            }
            response = listMethod.execute();
            List<String> topics = response.getSubscriptions();
            if (topics != null) {
                for (String topic : topics) {
                    // pubsub.projects().subscriptions().delete(subscription.getName()).execute();
                    System.out.println("Found sub: " + topic);
                }
            }
            nextPageToken = response.getNextPageToken();
        } while (nextPageToken != null);
    }

    // public static void getIamPolicy(Pubsub pubsub) throws IOException {
    //
    // GetIamPolicy listMethod =
    // pubsub.projects().topics().getIamPolicy("projects/testgmailoauth-1023/topics/gmail-push");
    // String nextPageToken = null;
    // ListTopicSubscriptionsResponse response;
    // do {
    // if (nextPageToken != null) {
    // listMethod.get(nextPageToken);
    // }
    // response = listMethod.execute();
    // List<String> topics = response.getSubscriptions();
    // if (topics != null) {
    // for (String topic : topics) {
    // // pubsub.projects().subscriptions().delete(subscription.getName()).execute();
    // System.out.println("Found sub: " + topic);
    // }
    // }
    // nextPageToken = response.getNextPageToken();
    // } while (nextPageToken != null);
    // }

    /**
     * Parses the command line arguments and calls a corresponding method.
     * 
     * @param args
     *            Command line arguments.
     * @throws Exception
     *             when something bad happens.
     */
    public static void main(final String[] args) throws Exception {

        Pubsub client = PubsubUtils.getClient();
        // Pubsub pubsub = createPubsubClient();
        if (client == null) {
            System.out.println("client null");
            return;
        }
        // createTopic(client);
        // createPushSubscription(client);
        // listSubscription(client);
        // listTopic(client);
        // createPullSubscription(client);
        receiveByPull(client);
        // setIamPolicy(client);
        // listTopicSub(client);
    }
}
