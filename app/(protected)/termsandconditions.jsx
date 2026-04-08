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
import { COLORS } from "../constants";

export default function TermsAndConditions() {
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
        <Text style={styles.title}>Terms & Conditions</Text>

        {/* Intro */}
        <Text style={styles.text}>
          These terms and conditions outline the rules and regulations for the use of <Text style={styles.bold}>PLANMONEY FINANCIAL SERVICES</Text> Website. By accessing this website we assume you accept these terms and conditions.
        </Text>

        <Text style={styles.text}>
          Do not continue to use PLANMONEY FINANCIAL SERVICES if you do not agree to take all of the terms and conditions stated on this page. The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person logs on to this website and compliant with the Company’s terms and conditions.
        </Text>

        <Text style={styles.text}>
          “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves.
        </Text>

        <Text style={styles.text}>
          All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of the provision of the Company’s stated services, in accordance with and subject to, prevailing law of India.
        </Text>

        <Text style={styles.text}>
          Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
        </Text>

        {/* Cookies */}
        <Text style={styles.heading}>Cookies</Text>
        <Text style={styles.text}>
          We employ the use of cookies. By accessing <Text style={styles.bold}>PLANMONEY FINANCIAL SERVICES</Text>, you agreed to use cookies in agreement with PLANMONEY FINANCIAL SERVICES ‘s Privacy Policy.

        </Text>

        <Text style={styles.text}>
          Most interactive websites use cookies to let us retrieve the user’s details for each visit.

        </Text>
        <Text style={styles.text}>
          Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
        </Text>
        {/* License */}
        <Text style={styles.heading}>License</Text>
        <Text style={styles.text}>
          Unless otherwise stated, <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> and/or its licensors own the intellectual property rights for all material on PLANMONEY FINANCIAL SERVICES.
        </Text>
        <Text style={styles.text}>All intellectual property rights are reserved.
        </Text>
        <Text style={styles.text}>You may access this from <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> for your own personal use subject to restrictions set in these terms and conditions.

        </Text>

        <Text style={styles.subHeading}>You must not:</Text>
        <Text style={styles.bullet}>• Republish material from <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>
        </Text>
        <Text style={styles.bullet}>• Sell, rent or sub-license material from <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> Reproduce, duplicate or copy material from <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>
        </Text>
        <Text style={styles.bullet}>
          • Redistribute content from <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>
        </Text>

        {/* Comments */}
        <Text style={styles.heading}>This Agreement shall begin on the date hereof.
        </Text>
        <Text style={styles.text}>
          Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website.
        </Text>
        <Text style={styles.text}><Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> does not filter, edit, publish or review Comments prior to their presence on the website.
        </Text>
        <Text style={styles.text}>Comments do not reflect the views and opinions of <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>, its agents and/or affiliates.
        </Text>
        <Text style={styles.text}>Comments reflect the views and opinions of the person who post their views and opinions.
        </Text>
        <Text style={styles.text}>To the extent permitted by applicable laws, <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
        </Text>
        <Text style={styles.text}><Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions. <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>

        </Text>

        {/* Warranties */}
        <Text style={styles.heading}>You warrant and represent that:
        </Text>
        <Text style={styles.bullet}>
          • You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;

        </Text>
        <Text style={styles.bullet}>
          • The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;
        </Text>
        <Text style={styles.bullet}>
          • The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy
        </Text>
        <Text style={styles.bullet}>
          • The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity. You hereby grant <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.
        </Text>

        {/* Hyperlink */}
        <Text style={styles.heading}>Hyperlinking to our Content</Text>
        <Text style={styles.text}>
          The following organizations may link to our Website without prior written approval:
        </Text>

        <Text style={styles.bullet}>• Government agencies;</Text>
        <Text style={styles.bullet}>• Search engines;</Text>
        <Text style={styles.bullet}>• News organizations;</Text>
        <Text style={styles.bullet}>• Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses;</Text>
        <Text style={styles.bullet}>• System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</Text>
        <Text style={styles.text}>These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.

        </Text>
        {/* iFrames */}
        <Text style={styles.heading}>We may consider and approve other link requests from the following types of organizations:</Text>
        <Text style={styles.bullet}>
          • commonly-known consumer and/or business information sources;
        </Text>
        <Text style={styles.bullet}>
          • dot com community sites;
        </Text>
        <Text style={styles.bullet}>
          • associations or other groups representing charities;
        </Text>
        <Text style={styles.bullet}>
          • online directory distributors;
        </Text>
        <Text style={styles.bullet}>
          • internet portals;
        </Text>
        <Text style={styles.bullet}>
          • accounting, law and consulting firms; and
        </Text>
        <Text style={styles.bullet}>
          • educational institutions and trade associations.
        </Text>
        <Text style={styles.text}>We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>; and (d) the link is in the context of general resource information. These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site. If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text>.</Text>
        <Text style={styles.text}>Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.

        </Text>
        {/* Content Liability */}
        <Text style={styles.heading}>Approved organizations may hyperlink to our Website as follows:
        </Text>
        <Text style={styles.bullet}>
          • By use of our corporate name; or
        </Text>
        <Text style={styles.bullet}>• By use of the uniform resource locator being linked to; or
        </Text>
        <Text style={styles.bullet}>• By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.
        </Text>
        <Text style={styles.text}>
          No use of <Text style={styles.bold}> PLANMONEY FINANCIAL SERVICES</Text> logo or other artwork will be allowed for linking absent a trademark license agreement.
        </Text>

        {/* Privacy */}
        <Text style={styles.heading}>iFrames</Text>
        <Text style={styles.text}>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.

        </Text>

        {/* Rights */}
        <Text style={styles.heading}>Content Liability</Text>
        <Text style={styles.text}>
          We shall not be hold responsible for any content that appears on your Website.
        </Text>
        <Text style={styles.text}>You agree to protect and defend us against all claims that is rising on your Website.
        </Text>
        <Text style={styles.text}>No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
        </Text>

        {/* Removal */}
        <Text style={styles.heading}>Your Privacy
        </Text>
        <Text style={styles.text}>Please read Privacy Policy


        </Text>

        {/* Removal */}
        <Text style={styles.heading}>Reservation of Rights</Text>
        <Text style={styles.text}>We reserve the right to request that you remove all links or any particular link to our Website.
        </Text>
        <Text style={styles.text}>You approve to immediately remove all links to our Website upon request.
        </Text>
        <Text style={styles.text}>We also reserve the right to amen these terms and conditions and it’s linking policy at any time.
        </Text>
        <Text style={styles.text}>By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
        </Text>

        {/* Removal */}
        <Text style={styles.heading}>Removal of links from our website

        </Text>
        <Text style={styles.text}>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment.
        </Text>
        <Text style={styles.text}>We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
        </Text>
        <Text style={styles.text}>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.`
        </Text>

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
  subHeading: {
    fontSize: 14,
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
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