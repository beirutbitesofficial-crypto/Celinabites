/**
 * Central place for brand content & links. Edit here — every section reads from this file.
 */
export const site = {
  name: "Celina Bites",
  nameAr: "سيلينا بايتس",
  /** WhatsApp number that receives orders, international format, digits only. */
  whatsapp: "96181626267",
  /** Phones shown on the site (the first one is the "Call" button). */
  phones: ["81 626 267", "07 242 731"],
  email: "Catering@celinabites.com",
  instagram: "https://www.instagram.com/celinabites/",
  /** Google Maps link to the shop. ⚠️ Replace with the shop's own "Share → Copy link" from Google Maps. */
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=Celina+Bites",
  /** Google Maps embed. ⚠️ Replace the query with the shop's address or plus code. */
  mapEmbed: "https://maps.google.com/maps?q=Celina%20Bites%2C%20Lebanon&z=15&output=embed",
  /** Opening hours, Beirut time, minutes after midnight. Same every day (index 0 = Sunday). */
  hours: Array.from({ length: 7 }, () => ({ open: 7 * 60, close: 23 * 60 })) as ({ open: number; close: number } | null)[],
  /** Preview mode: keeps Google from indexing the site. */
  preview: false,
};

export function whatsappLink(text: string) {
  const to = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}

export const telHref = (phone: string) => `tel:${phone.replace(/\D/g, "")}`;
