import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import GoWishlistLogo from "../../../../../components/GoWishlistLogo";
import { createAdminClient } from "../../../../../lib/supabase/admin";
import { createClient } from "../../../../../lib/supabase/server";
import {
  createWishlistAccessToken,
  getWishlistAccessCookieName,
} from "../../../../../lib/wishlist-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeCompare(first: string, second: string) {
  const a = Buffer.from(first);
  const b = Buffer.from(second);
  return a.length === b.length && timingSafeEqual(a, b);
}

function normalizeHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function InfoLink({ label, url }: { label: string; url: string | null }) {
  if (!url) return null;
  return (
    <p style={{ margin: "10px 0 0" }}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: 800, overflowWrap: "anywhere" }}>
        {label} →
      </a>
    </p>
  );
}

export default async function GiftReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; giftId: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { slug, giftId } = await params;
  const query = await searchParams;
  const admin = createAdminClient();

  const { data: wishlist } = await admin
    .from("wishlists")
    .select("id, owner_id, title, slug, is_live, access_code_hash")
    .eq("slug", slug.toLowerCase())
    .eq("is_live", true)
    .maybeSingle();

  if (!wishlist) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = Boolean(user && user.id === wishlist.owner_id);

  if (wishlist.access_code_hash && !isOwner) {
    const cookieStore = await cookies();
    const token = cookieStore.get(getWishlistAccessCookieName(wishlist.id))?.value || "";
    const expected = createWishlistAccessToken(wishlist.id, wishlist.access_code_hash);
    if (!safeCompare(token, expected)) redirect(`/wishlist/${wishlist.slug}`);
  }

  const { data: gift } = await admin
    .from("gifts")
    .select("id, wishlist_id, name, image_url")
    .eq("id", giftId)
    .eq("wishlist_id", wishlist.id)
    .maybeSingle();
  if (!gift) notFound();

  const { data: reservation } = await admin
    .from("reservations")
    .select("id, tracking_number, receipt_url, order_url")
    .eq("gift_id", gift.id)
    .eq("wishlist_id", wishlist.id)
    .maybeSingle();
  if (!reservation) redirect(`/wishlist/${wishlist.slug}`);

  async function saveReceiptInfo(formData: FormData) {
    "use server";

    const sessionClient = await createClient();
    const { data: { user: currentUser } } = await sessionClient.auth.getUser();
    if (!currentUser) redirect("/login");

    const serviceClient = createAdminClient();
    const { data: currentWishlist } = await serviceClient
      .from("wishlists")
      .select("id, owner_id, slug")
      .eq("id", wishlist.id)
      .maybeSingle();
    if (!currentWishlist || currentWishlist.owner_id !== currentUser.id) notFound();

    const { data: currentReservation } = await serviceClient
      .from("reservations")
      .select("id")
      .eq("id", reservation.id)
      .eq("gift_id", gift.id)
      .eq("wishlist_id", wishlist.id)
      .maybeSingle();
    if (!currentReservation) notFound();

    const trackingNumber = String(formData.get("trackingNumber") || "").trim();
    const rawReceiptUrl = String(formData.get("receiptUrl") || "").trim();
    const rawOrderUrl = String(formData.get("orderUrl") || "").trim();
    const receiptUrl = rawReceiptUrl ? normalizeHttpUrl(rawReceiptUrl) : "";
    const orderUrl = rawOrderUrl ? normalizeHttpUrl(rawOrderUrl) : "";
    const pageUrl = `/wishlist/${currentWishlist.slug}/receipt/${gift.id}`;

    if (trackingNumber.length > 120) redirect(`${pageUrl}?error=tracking`);
    if (rawReceiptUrl.length > 500 || (rawReceiptUrl && !receiptUrl)) redirect(`${pageUrl}?error=receipt`);
    if (rawOrderUrl.length > 500 || (rawOrderUrl && !orderUrl)) redirect(`${pageUrl}?error=order`);

    const { error } = await serviceClient
      .from("reservations")
      .update({
        tracking_number: trackingNumber || null,
        receipt_url: receiptUrl || null,
        order_url: orderUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentReservation.id)
      .eq("gift_id", gift.id)
      .eq("wishlist_id", wishlist.id);

    if (error) {
      console.error("Save receipt/tracking information failed:", error);
      redirect(`${pageUrl}?error=save`);
    }

    revalidatePath(`/dashboard/wishlist/${wishlist.id}`);
    revalidatePath(`/wishlist/${currentWishlist.slug}`);
    revalidatePath(pageUrl);
    redirect(`${pageUrl}?saved=1`);
  }

  const errorMessages: Record<string, string> = {
    tracking: "Tracking numbers must be 120 characters or fewer.",
    receipt: "Enter a valid receipt URL beginning with http:// or https://.",
    order: "Enter a valid order URL beginning with http:// or https://.",
    save: "We could not save the receipt or tracking information. Please try again.",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#111827" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          <GoWishlistLogo href="/home" size={29} />
          <Link href={`/wishlist/${wishlist.slug}`} style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>Back to Wishlist</Link>
        </div>
      </header>

      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "45px 24px 80px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "28px", boxShadow: "0 15px 40px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            {gift.image_url && <img src={gift.image_url} alt="" style={{ width: "76px", height: "76px", objectFit: "contain", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff" }} />}
            <div>
              <p style={{ color: "#2563eb", fontSize: "12px", fontWeight: 800, margin: "0 0 5px" }}>{wishlist.title}</p>
              <h1 style={{ margin: 0, fontSize: "26px", lineHeight: 1.2, fontWeight: 900 }}>Receipt &amp; Tracking</h1>
              <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>{gift.name}</p>
            </div>
          </div>

          {query.saved === "1" && <div role="status" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", fontSize: "14px", fontWeight: 700 }}>Receipt and tracking information saved.</div>}
          {query.error && errorMessages[query.error] && <div role="alert" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", fontSize: "14px", fontWeight: 700 }}>{errorMessages[query.error]}</div>}

          {isOwner ? (
            <>
              <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.6, margin: "0 0 20px" }}>Add or update the tracking number and receipt/order links for this reservation. Guests cannot cancel reservations here; they must contact you to unreserve a gift.</p>
              <form action={saveReceiptInfo} style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label htmlFor="trackingNumber" style={{ display: "block", fontSize: "13px", fontWeight: 800, marginBottom: "7px" }}>Tracking Number</label>
                  <input id="trackingNumber" name="trackingNumber" defaultValue={reservation.tracking_number || ""} maxLength={120} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "10px", padding: "12px 14px", fontSize: "15px" }} />
                </div>
                <div>
                  <label htmlFor="receiptUrl" style={{ display: "block", fontSize: "13px", fontWeight: 800, marginBottom: "7px" }}>Receipt URL</label>
                  <input id="receiptUrl" name="receiptUrl" type="url" defaultValue={reservation.receipt_url || ""} maxLength={500} placeholder="https://..." style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "10px", padding: "12px 14px", fontSize: "15px" }} />
                </div>
                <div>
                  <label htmlFor="orderUrl" style={{ display: "block", fontSize: "13px", fontWeight: 800, marginBottom: "7px" }}>Order URL</label>
                  <input id="orderUrl" name="orderUrl" type="url" defaultValue={reservation.order_url || ""} maxLength={500} placeholder="https://..." style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "10px", padding: "12px 14px", fontSize: "15px" }} />
                </div>
                <button type="submit" style={{ background: "#2563eb", color: "#fff", border: 0, borderRadius: "10px", padding: "14px 18px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>Save Receipt &amp; Tracking</button>
              </form>
            </>
          ) : (
            <>
              <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.6, margin: "0 0 18px" }}>The wishlist owner has shared the following tracking or purchase information.</p>
              {reservation.tracking_number && <div style={{ border: "1px solid #e5e7eb", background: "#f8fafc", borderRadius: "10px", padding: "14px", fontSize: "14px" }}><strong>Tracking Number:</strong><div style={{ marginTop: "5px", overflowWrap: "anywhere" }}>{reservation.tracking_number}</div></div>}
              <InfoLink label="View Receipt" url={reservation.receipt_url} />
              <InfoLink label="View Order" url={reservation.order_url} />
              {!reservation.tracking_number && !reservation.receipt_url && !reservation.order_url && <p style={{ color: "#6b7280", fontSize: "14px" }}>The wishlist owner has not shared receipt or tracking information yet.</p>}
              <p style={{ margin: "20px 0 0", color: "#6b7280", fontSize: "12px", lineHeight: 1.5 }}>Need to cancel the reservation? Contact the wishlist owner. Guests cannot unreserve gifts themselves.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
