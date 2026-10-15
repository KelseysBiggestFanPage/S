import { cookies } from "next/headers";
import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import GoWishlistLogo from "../../../../../components/GoWishlistLogo";
import ReserveGiftForm from "../../../../../components/ReserveGiftForm";
import { getAffiliateUrl } from "../../../../../lib/affiliate";
import {
  createWishlistAccessToken,
  getWishlistAccessCookieName,
} from "../../../../../lib/wishlist-access";
import { createAdminClient } from "../../../../../lib/supabase/admin";
import { createClient } from "../../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatPrice(
  price: number | string | null
) {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return null;
  }

  const value = Number(price);

  if (!Number.isFinite(value)) {
    return null;
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(value);
}

export default async function ReserveGiftPage({
  params,
}: {
  params: Promise<{
    slug: string;
    giftId: string;
  }>;
}) {
  const { slug, giftId } =
    await params;

  const admin =
    createAdminClient();

  const {
    data: wishlist,
    error: wishlistError,
  } = await admin
    .from("wishlists")
    .select(
      "id, owner_id, title, slug, is_live, access_code_hash, owner_contact_email, owner_contact_phone"
    )
    .eq(
      "slug",
      slug.toLowerCase()
    )
    .eq("is_live", true)
    .maybeSingle();

  if (
    wishlistError ||
    !wishlist
  ) {
    notFound();
  }

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner =
    Boolean(user) &&
    user?.id ===
      wishlist.owner_id;

  if (
    wishlist.access_code_hash &&
    !isOwner
  ) {
    const cookieStore =
      await cookies();

    const currentToken =
      cookieStore.get(
        getWishlistAccessCookieName(
          wishlist.id
        )
      )?.value || "";

    const expectedToken =
      createWishlistAccessToken(
        wishlist.id,
        wishlist.access_code_hash
      );

    if (
      currentToken !==
      expectedToken
    ) {
      redirect(
        `/wishlist/${wishlist.slug}`
      );
    }
  }

  const {
    data: gift,
    error: giftError,
  } = await admin
    .from("gifts")
    .select(
      "id, wishlist_id, name, product_url, image_url, price, description, instructions, shipping_address"
    )
    .eq("id", giftId)
    .eq(
      "wishlist_id",
      wishlist.id
    )
    .maybeSingle();

  if (
    giftError ||
    !gift
  ) {
    notFound();
  }

  const {
    data: existingReservation,
  } = await admin
    .from("reservations")
    .select("id")
    .eq(
      "gift_id",
      gift.id
    )
    .maybeSingle();

  if (existingReservation) {
    redirect(
      `/wishlist/${wishlist.slug}`
    );
  }

  let defaultName = "";
  let defaultEmail =
    user?.email || "";
  let defaultPhone = "";

  if (user) {
    const {
      data: profile,
    } = await supabase
      .from("profiles")
      .select(
        "display_name, email"
      )
      .eq(
        "id",
        user.id
      )
      .maybeSingle();

    defaultName =
      profile?.display_name?.trim() ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "";

    defaultEmail =
      profile?.email?.trim() ||
      user.email ||
      "";

    defaultPhone =
      user.user_metadata?.phone ||
      "";
  }

  const price =
    formatPrice(
      gift.price
    );

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
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding:
              "20px 30px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: "20px",
          }}
        >
          <GoWishlistLogo
            href="/home"
            size={29}
          />

          <Link
            href={`/wishlist/${wishlist.slug}`}
            style={{
              color: "#6b7280",
              textDecoration:
                "none",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            Back to Wishlist
          </Link>
        </div>
      </header>

      <section
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding:
            "55px 30px 90px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom:
              "30px",
          }}
        >
          <div
            style={{
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom:
                "8px",
            }}
          >
            {wishlist.title}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              lineHeight: "1.1",
              fontWeight: "800",
              letterSpacing:
                "-1.7px",
            }}
          >
            Reserve This Gift
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
              margin:
                "12px auto 0",
              maxWidth: "520px",
            }}
          >
            Enter your information below
            to reserve this gift.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 15px 40px rgba(0,0,0,0.05)",
            marginBottom: "24px",
          }}
        >
          {gift.image_url && (
            <div
              style={{
                height: "300px",
                background:
                  "#ffffff",
                borderBottom:
                  "1px solid #e5e7eb",
                padding: "20px",
                boxSizing:
                  "border-box",
              }}
            >
              <img
                src={gift.image_url}
                alt={gift.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    "contain",
                }}
              />
            </div>
          )}

          <div
            style={{
              padding: "26px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                lineHeight: "1.25",
                fontWeight: "800",
              }}
            >
              {gift.name}
            </h2>

            {price && (
              <div
                style={{
                  color: "#2563eb",
                  fontSize: "19px",
                  fontWeight: "800",
                  marginTop: "7px",
                }}
              >
                {price}
              </div>
            )}

            {gift.description && (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.65",
                  whiteSpace:
                    "pre-wrap",
                  margin:
                    "16px 0 0",
                }}
              >
                {gift.description}
              </p>
            )}

            {gift.instructions && (
              <div
                style={{
                  background:
                    "#f8fafc",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    "11px",
                  padding: "14px",
                  color: "#4b5563",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  whiteSpace:
                    "pre-wrap",
                  marginTop: "16px",
                }}
              >
                <strong>
                  Gift Notes:
                </strong>{" "}
                {gift.instructions}
              </div>
            )}

            <a
              href={getAffiliateUrl(
                gift.product_url
              )}
              target="_blank"
              rel="sponsored noreferrer"
              style={{
                display:
                  "inline-block",
                color: "#2563eb",
                textDecoration:
                  "none",
                fontSize: "14px",
                fontWeight: "800",
                marginTop: "18px",
              }}
            >
              View Gift at Store →
            </a>
            <div style={{ color: "#6b7280", fontSize: "11px", lineHeight: "1.4", marginTop: "6px" }}>
              As an Amazon Associate, GoWishlist earns from qualifying purchases.
            </div>
          </div>
        </div>

        <ReserveGiftForm
          wishlistSlug={
            wishlist.slug
          }
          giftId={gift.id}
          defaultName={
            defaultName
          }
          defaultEmail={
            defaultEmail
          }
          defaultPhone={
            defaultPhone
          }
          giftShippingAddress={gift.shipping_address || ""}
          ownerContactEmail={wishlist.owner_contact_email || ""}
          ownerContactPhone={wishlist.owner_contact_phone || ""}
        />
      </section>
    </main>
  );
}
