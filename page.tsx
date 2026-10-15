import Link from "next/link";
import GoWishlistLogo from "../../components/GoWishlistLogo";

export const metadata = {
  title: "Privacy Policy | GoWishlist",
  description:
    "Learn how GoWishlist collects, uses, and protects information.",
};

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "20px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <GoWishlistLogo href="/home" size={29} />

          <Link
            href="/home"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            Back to Home
          </Link>
        </div>
      </header>

      <section
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "60px 30px 90px",
        }}
      >
        <div style={{ marginBottom: "35px" }}>
          <div
            style={{
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: "800",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            GOWISHLIST
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: "1.1",
              letterSpacing: "-1.7px",
              fontWeight: "800",
            }}
          >
            Privacy Policy
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: "12px 0 0",
            }}
          >
            Effective October 5, 2026
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "36px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.04)",
          }}
        >
          <Section title="1. Introduction">
            <p style={paragraphStyle}>
              This Privacy Policy explains how GoWishlist collects, uses,
              shares, and protects information when you use our website,
              services, features, accounts, wishlists, and related services.
            </p>

            <p style={paragraphStyle}>
              By using GoWishlist, you acknowledge the practices described in
              this Privacy Policy.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p style={paragraphStyle}>
              We may collect information that you provide directly to us,
              including your name, email address, profile information, account
              information, wishlist information, gift details, links, shipping
              information, and other information you choose to provide.
            </p>

            <p style={paragraphStyle}>
              When a person reserves a gift, we may collect information such as
              their name, email address, phone number, reservation information,
              tracking number, order link, and receipt link. Wishlist owners may
              also save shipping or delivery instructions for each individual
              gift; people see those details on the reservation screen while a
              gift is available, not after reservation.
            </p>

            <p style={paragraphStyle}>
              We may also automatically collect certain technical information
              when you use GoWishlist, including your browser type, device type,
              operating system, IP address, pages viewed, referring pages,
              interactions with the service, and approximate location derived
              from technical information such as an IP address.
            </p>
          </Section>

          <Section title="3. Google Sign-In">
            <p style={paragraphStyle}>
              GoWishlist may allow you to create or access your account using
              Google Sign-In.
            </p>

            <p style={paragraphStyle}>
              When you use Google Sign-In, we may receive information made
              available through your Google account, such as your name, email
              address, and profile information.
            </p>

            <p style={paragraphStyle}>
              We use this information to authenticate your account, provide the
              GoWishlist service, personalize your account experience, and help
              prevent unauthorized access.
            </p>
          </Section>

          <Section title="4. How We Use Information">
            <p style={paragraphStyle}>We may use information we collect to:</p>

            <ul style={listStyle}>
              <li>Create and maintain user accounts.</li>
              <li>Create, display, manage, and share wishlists.</li>
              <li>Allow guests to reserve gifts.</li>
              <li>Provide receipt and tracking features.</li>
              <li>Authenticate users and protect accounts.</li>
              <li>Operate, maintain, troubleshoot, and improve GoWishlist.</li>
              <li>Understand how users interact with our website and features.</li>
              <li>
                Detect fraud, misuse, spam, security threats, or prohibited
                activity.
              </li>
              <li>
                Operate affiliate or referral links and understand whether a
                retailer link was clicked or resulted in a qualifying referral,
                where applicable.
              </li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </Section>

          <Section title="5. Affiliate Links and Referral Programs">
            <p style={paragraphStyle}>
              GoWishlist may use affiliate or referral links for some retailers.
              If you click a qualifying retailer link and make a purchase or
              take another qualifying action, GoWishlist may receive a
              commission or referral fee at no additional cost to you.
            </p>

            <p style={paragraphStyle}>
              Affiliate links may contain identifiers or tracking parameters
              that allow a retailer or affiliate partner to recognize that a
              visit originated from GoWishlist.
            </p>

            <p style={paragraphStyle}>
              We may receive reporting from affiliate partners about clicks,
              referrals, qualifying purchases, commissions, or similar program
              activity. We do not receive your payment card information from a
              retailer merely because you use an affiliate link.
            </p>
          </Section>

          <Section title="6. Amazon Associates and Other Affiliate Partners">
            <p style={paragraphStyle}>
              GoWishlist may participate in the Amazon Associates Program and
              may also participate in affiliate programs offered by other
              retailers or affiliate networks.
            </p>

            <p style={paragraphStyle}>
              When you follow an affiliate link to Amazon or another retailer,
              that third party may collect information about your visit and use
              cookies or similar technologies according to its own privacy
              policy and program rules.
            </p>

            <p style={paragraphStyle}>
              GoWishlist does not control the privacy practices of Amazon,
              retailers, affiliate networks, or other third-party websites.
            </p>
          </Section>

          <Section title="7. Cookies and Similar Technologies">
            <p style={paragraphStyle}>
              GoWishlist and our service providers may use cookies and similar
              technologies to keep users signed in, remember preferences,
              provide security features, operate access codes, and understand
              site usage.
            </p>

            <p style={paragraphStyle}>
              Some cookies are necessary for the operation and security of the
              service. Other cookies or similar technologies may be used by
              third parties after you follow an external retailer or affiliate
              link.
            </p>

            <p style={paragraphStyle}>
              Your browser may allow you to block or delete certain cookies.
              Blocking necessary cookies may prevent some GoWishlist features
              from working correctly.
            </p>
          </Section>

          <Section title="8. How We Share Information">
            <p style={paragraphStyle}>
              We may share information with companies that help us operate
              GoWishlist, including hosting providers, database providers,
              authentication providers, analytics providers, security
              providers, communications providers, and other service providers.
            </p>

            <p style={paragraphStyle}>
              When you click an affiliate or referral link, the destination
              retailer or affiliate partner may receive information associated
              with that click, such as the referring page, affiliate identifier,
              browser or device information, and other information ordinarily
              sent when visiting a website.
            </p>

            <p style={paragraphStyle}>
              We may also share information when necessary to comply with law,
              respond to lawful legal requests, protect our rights, prevent
              fraud or abuse, protect users, or maintain the security of
              GoWishlist.
            </p>

            <p style={paragraphStyle}>
              If GoWishlist is involved in a merger, acquisition, financing,
              reorganization, sale of assets, or similar business transaction,
              information may be transferred as part of that transaction.
            </p>
          </Section>

          <Section title="9. We Do Not Sell Personal Information for Money">
            <p style={paragraphStyle}>
              GoWishlist does not sell your personal information to third
              parties in exchange for money.
            </p>

            <p style={paragraphStyle}>
              Use of an affiliate link may cause limited referral or click
              information to be shared with the destination retailer or
              affiliate partner as described above.
            </p>
          </Section>

          <Section title="10. Wishlist Information">
            <p style={paragraphStyle}>
              Information placed on a public wishlist may be visible to anyone
              who has access to the wishlist.
            </p>

            <p style={paragraphStyle}>
              Wishlists protected by an access code are intended to limit
              access, but users should not place highly sensitive or
              confidential information on a wishlist.
            </p>

            <p style={paragraphStyle}>
              The wishlist owner may be able to see information associated with
              a reservation, including the name and contact information supplied
              by the person reserving the gift, tracking information, and receipt
              or order links. Wishlist owners can remove reservations, while
              guests must contact the owner to request cancellation.
            </p>
          </Section>

          <Section title="11. Data Retention">
            <p style={paragraphStyle}>
              We may retain information for as long as reasonably necessary to
              provide GoWishlist, maintain user accounts, operate wishlists,
              resolve disputes, prevent fraud, enforce agreements, and comply
              with applicable legal obligations.
            </p>

            <p style={paragraphStyle}>
              Retention periods may vary depending on the type of information
              and the reason we maintain it.
            </p>
          </Section>

          <Section title="12. Security">
            <p style={paragraphStyle}>
              We use reasonable administrative, technical, and organizational
              measures designed to protect information against unauthorized
              access, loss, misuse, alteration, or disclosure.
            </p>

            <p style={paragraphStyle}>
              No website, database, network, or electronic transmission can be
              guaranteed to be completely secure. You are responsible for
              protecting your account credentials and access codes.
            </p>
          </Section>

          <Section title="13. Your Choices">
            <p style={paragraphStyle}>
              Depending on where you live, you may have rights regarding your
              personal information, which may include the right to request
              access, correction, deletion, or information about certain uses or
              disclosures of your information.
            </p>

            <p style={paragraphStyle}>
              Your browser may also provide controls for cookies and other
              technologies used by websites you visit.
            </p>

            <p style={paragraphStyle}>
              Additional privacy controls may be made available as GoWishlist
              grows or as required by applicable law.
            </p>
          </Section>

          <Section title="14. Children's Privacy">
            <p style={paragraphStyle}>
              GoWishlist is not intended to be used independently by children
              under 13 to create accounts or provide personal information
              without the involvement of a parent or legal guardian.
            </p>

            <p style={paragraphStyle}>
              If we learn that we collected personal information from a child
              in a manner prohibited by applicable law, we may take steps to
              delete that information.
            </p>
          </Section>

          <Section title="15. Third-Party Links">
            <p style={paragraphStyle}>
              Wishlists may contain links to Amazon, retailers, stores,
              websites, and other third-party services.
            </p>

            <p style={paragraphStyle}>
              GoWishlist does not control the privacy practices of those third
              parties. Information you provide to another website is governed
              by that website&apos;s own terms and privacy policy.
            </p>
          </Section>

          <Section title="16. Changes to This Privacy Policy">
            <p style={paragraphStyle}>
              We may update this Privacy Policy from time to time as GoWishlist
              changes, new features are added, or legal and operational
              requirements change.
            </p>

            <p style={paragraphStyle}>
              When we make changes, we may update the effective date displayed
              at the top of this page. Continued use of GoWishlist after an
              updated Privacy Policy becomes effective means that the updated
              policy will apply to your continued use of the service, subject to
              applicable law.
            </p>
          </Section>

          <Section title="17. Contact">
            <p
              style={{
                ...paragraphStyle,
                marginBottom: 0,
              }}
            >
              Questions or requests concerning this Privacy Policy may be
              submitted through the contact or support options made available by
              GoWishlist.
            </p>
          </Section>
        </div>
      </section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: "34px",
      }}
    >
      <h2
        style={{
          margin: "0 0 13px",
          fontSize: "20px",
          lineHeight: "1.3",
          fontWeight: "800",
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

const paragraphStyle = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "1.75",
  margin: "0 0 14px",
};

const listStyle = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "1.75",
  paddingLeft: "22px",
  margin: "0 0 14px",
};
