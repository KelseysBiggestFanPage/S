import Link from "next/link";
import GoWishlistLogo from "../../components/GoWishlistLogo";
import StoreLogoCarousel from "../../components/StoreLogoCarousel";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111827",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "20px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <GoWishlistLogo href="/home" size={29} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link
              href="/login"
              style={{
                color: "#374151",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                padding: "11px 14px",
              }}
            >
              Log In
            </Link>

            <Link
              href="/signup"
              style={{
                color: "#ffffff",
                background: "#2563eb",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "800",
                padding: "11px 17px",
                borderRadius: "10px",
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "95px 30px 70px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: "800",
            letterSpacing: "0.7px",
            marginBottom: "16px",
          }}
        >
          SIMPLE WISHLISTS FOR ANY OCCASION
        </div>

        <h1
          style={{
            margin: "0 auto",
            maxWidth: "850px",
            fontSize: "62px",
            lineHeight: "1.02",
            letterSpacing: "-3.4px",
            fontWeight: "850",
          }}
        >
          Make a wishlist.
          <br />
          Share it with anyone.
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "19px",
            lineHeight: "1.65",
            maxWidth: "680px",
            margin: "24px auto 34px",
          }}
        >
          Create a wishlist, add gifts from your favorite stores, and share one
          simple link with friends and family.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/signup"
            style={{
              background: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              padding: "15px 24px",
              borderRadius: "11px",
              fontSize: "16px",
              fontWeight: "800",
              boxShadow: "0 10px 30px rgba(37,99,235,0.20)",
            }}
          >
            Create a Wishlist
          </Link>

          <Link
            href="/login"
            style={{
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #d1d5db",
              textDecoration: "none",
              padding: "15px 24px",
              borderRadius: "11px",
              fontSize: "16px",
              fontWeight: "800",
            }}
          >
            Log In
          </Link>
        </div>
      </section>

      <StoreLogoCarousel />

      <section
        style={{
          background: "#f8fafc",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "75px 30px 85px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "42px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: "800",
                letterSpacing: "-1.5px",
              }}
            >
              How GoWishlist works
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "16px",
                margin: "12px auto 0",
                lineHeight: "1.6",
                maxWidth: "560px",
              }}
            >
              Make your list, share it, and let guests choose the gifts they
              want to give.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <Card
              number="1"
              title="Create"
              text="Make a wishlist for a birthday, holiday, celebration, or anything else."
            />

            <Card
              number="2"
              title="Share"
              text="Send your private wishlist link to friends and family."
            />

            <Card
              number="3"
              title="Reserve"
              text="Guests can reserve gifts so other people know what has already been chosen."
            />

            <Card
              number="4"
              title="Receive your gifts!"
              text="Enjoy your gifts from the people who made your celebration special."
            />
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 30px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "38px",
            lineHeight: "1.15",
            letterSpacing: "-1.7px",
            fontWeight: "800",
          }}
        >
          Ready to make your wishlist?
        </h2>

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            lineHeight: "1.6",
            margin: "14px auto 26px",
          }}
        >
          Create your GoWishlist and start adding gifts in minutes.
        </p>

        <Link
          href="/signup"
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            padding: "15px 24px",
            borderRadius: "11px",
            fontSize: "16px",
            fontWeight: "800",
          }}
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}

function Card({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "28px",
        textAlign: "left",
        boxShadow: "0 8px 25px rgba(0,0,0,0.035)",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: "#eff6ff",
          color: "#2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "900",
          marginBottom: "18px",
        }}
      >
        {number}
      </div>

      <div
        style={{
          fontSize: "19px",
          fontWeight: "800",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "14px",
          lineHeight: "1.65",
        }}
      >
        {text}
      </div>
    </div>
  );
}
