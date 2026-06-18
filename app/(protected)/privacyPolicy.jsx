import React from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/Header";
import { COLORS } from "../../constants.js";

export default function PrivacyPolicy() {
    return (
        <SafeAreaView edges={[]} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton />

            <ScrollView
                style={{ backgroundColor: COLORS.primaryColor }}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>Privacy Policy</Text>

                {/* Intro */}
                <Text style={styles.text}>
                    At Econexx Wealth Pvt Ltd., accessible from planmoney.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Econexx Wealth Pvt Ltd. and how we use it.
                </Text>
                <Text style={styles.text}>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Econexx Wealth Pvt Ltd. This policy is not applicable to any information collected offline or via channels other than this website.</Text>



                {/* Consent */}
                <Text style={styles.heading}>Consent</Text>
                <Text style={styles.text}>
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.                </Text>

                {/* Info Collection */}
                <Text style={styles.heading}>Information we collect</Text>
                <Text style={styles.text}>
                    The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

                </Text>

                <Text style={styles.text}>
                    If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

                </Text>

                <Text style={styles.text}>
                    When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.

                </Text>

                {/* Usage */}
                <Text style={styles.heading}>How We Use Your Information</Text>
                <Text style={styles.text}>We use the information we collect in various ways, including to:</Text>

                <Text style={styles.bullet}>• Provide, operate, and maintain our website</Text>
                <Text style={styles.bullet}>• Improve, personalize, and expand our website
                </Text>
                <Text style={styles.bullet}>• Understand and analyze how you use our website
                </Text>
                <Text style={styles.bullet}>• Develop new products, services, features, and functionality</Text>
                <Text style={styles.bullet}>• Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
                </Text>
                <Text style={styles.bullet}>• Send you emails
                </Text>
                <Text style={styles.bullet}>• Find and prevent fraud
                </Text>

                {/* Log Files */}
                <Text style={styles.heading}>Log Files</Text>
                <Text style={styles.text}>
                    Econexx Wealth Pvt Ltd. follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </Text>

                {/* Cookies */}
                <Text style={styles.heading}>Google DoubleClick DART Cookie</Text>
                <Text style={styles.text}>
                    Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads
                </Text>

                {/* Ads */}
                <Text style={styles.heading}>Advertising Partners Privacy Policies</Text>
                <Text style={styles.text}>
                    You may consult this list to find the Privacy Policy for each of the advertising partners of Econexx Wealth Pvt Ltd. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Econexx Wealth Pvt Ltd., which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                </Text>

                <Text style={styles.text}>
                    Note that Econexx Wealth Pvt Ltd. has no access to or control over these cookies that are used by third-party advertisers.
                </Text>



                {/* Third Party */}
                <Text style={styles.heading}>Third Party Privacy Policies</Text>
                <Text style={styles.text}>
                    Econexx Wealth Pvt Ltd. Financial Service’s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </Text>

                <Text style={styles.text}>
                    You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.

                </Text>


                {/* CCPA */}
                <Text style={styles.heading}>CCPA Privacy Rights (Do Not Sell My Personal Information)
                </Text>

                <Text style={styles.text}>
                    Under the CCPA, among other rights, California consumers have the right to:
                </Text>
                <Text style={styles.bullet}>
                    • Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.
                </Text>
                <Text style={styles.bullet}>
                    • Request that a business delete any personal data about the consumer that a business has collected.

                </Text>
                <Text style={styles.bullet}>
                    • Request that a business that sells a consumer's personal data, not sell the consumer's personal data.

                </Text>

                <Text style={styles.bullet}>
                    If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.

                </Text>



                {/* GDPR */}
                <Text style={styles.heading}>GDPR Data Protection Rights</Text>

                <Text style={styles.bullet}>• The right to access - You have the right to request copies of your personal data. We may charge you a small fee for this service.
                </Text>
                <Text style={styles.bullet}>• The right to rectification - You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.
                </Text>
                <Text style={styles.bullet}>• The right to erasure – You have the right to request that we erase your personal data, under certain conditions.
                </Text>
                <Text style={styles.bullet}>• The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.
                </Text>
                <Text style={styles.bullet}>• The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.
                </Text>
                <Text style={styles.bullet}>• The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
                </Text>

                <Text style={styles.text}>
                    If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
                </Text>

                {/* Children */}
                <Text style={styles.heading}>Children's Information</Text>
                <Text style={styles.text}>
                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </Text>

                <Text style={styles.text}>
                    Econexx Wealth Pvt Ltd. does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                </Text>

                {/* Updates */}
                <Text style={styles.heading}>Changes to This Policy</Text>
                <Text style={styles.text}>
                    We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
                </Text>

                {/* Refund */}
                <Text style={styles.heading}>Refund Policy</Text>
                <Text style={styles.text}>
                    At Econexx Wealth Pvt Ltd., all our subscriptions, services and products are non-refundable. Any request in respect with the refund matters shall not be entertained.
                </Text>

                {/* Contact */}
                <Text style={styles.heading}>Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.                </Text>

                {/* Footer */}
                <Text style={styles.footer}>
                    © 2025 PlanMoney Financial Services · All rights reserved
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
    content: {
        padding: 16,
        paddingBottom: 100
    },
    title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "700",
        marginBottom: 16,
    },
    heading: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 8,
    },
    text: {
        fontSize: 13,
        color: "#AAA",
        lineHeight: 20,
        marginBottom: 10,
    },
    bullet: {
        fontSize: 13,
        color: "#AAA",
        marginLeft: 10,
        marginBottom: 6,
    },
    bold: {
        fontWeight: "700",
        color: "#fff",
    },
    footer: {
        marginTop: 30,
        fontSize: 11,
        color: "#555",
        textAlign: "center",
    },
});