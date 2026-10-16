/**
 * Celina Bites menu — transcribed from the menu on the previous celinabites.com.
 * Prices in Lebanese pounds (LBP). Every item has an Arabic and an English name.
 *
 * Edit freely: change a price, add an item, or add `soldOut: true` to hide the add button.
 */

export type Lang = "ar" | "en";
export type Text = { ar: string; en: string };

export type Variant = { label: Text; price: number };

export type Item = {
  id: string;
  name: Text;
  desc?: Text;
  /** Single price. Ignored when `variants` is set. */
  price?: number;
  /** Different prices per size / style. */
  variants?: Variant[];
  /** Sub-heading inside a category. */
  group?: Text;
  tag?: "signature" | "new";
  soldOut?: boolean;
};

export type Category = {
  id: string;
  title: Text;
  /** Handwritten subtitle. */
  script: Text;
  note?: Text;
  /** Which illustration to draw for the category (components/Bakes.tsx). */
  art: "manousheh" | "croissant" | "pastry" | "kaak" | "pizza" | "fatayer";
  items: Item[];
};

const t = (ar: string, en: string): Text => ({ ar, en });
const k = (n: number) => n * 1000;

const REGULAR = t("عادي", "Regular");
const MASHROUHA = t("مشروحة", "Mashrouha");
const manousheh = (id: string, ar: string, en: string, regular: number, mashrouha?: number, extra: Partial<Item> = {}): Item => ({
  id,
  name: t(ar, en),
  variants: mashrouha
    ? [
        { label: REGULAR, price: k(regular) },
        { label: MASHROUHA, price: k(mashrouha) },
      ]
    : [{ label: REGULAR, price: k(regular) }],
  ...extra,
});

const PIZZA_SIZES = [t("صغير", "Small"), t("وسط", "Medium"), t("كبير", "Large"), t("رول", "Roll")];
const pizza = (id: string, ar: string, en: string, prices: number[], extra: Partial<Item> = {}): Item => ({
  id,
  name: t(ar, en),
  variants: prices.map((p, i) => ({ label: PIZZA_SIZES[i], price: k(p) })),
  ...extra,
});
const STD = [700, 800, 900, 250];

const one = (id: string, ar: string, en: string, price: number, extra: Partial<Item> = {}): Item => ({ id, name: t(ar, en), price: k(price), ...extra });

export const menu: Category[] = [
  {
    id: "manakish",
    title: t("مناقيش", "Manakish"),
    script: t("من الفرن", "from the oven"),
    note: t("عادي أو مشروحة", "Regular or mashrouha"),
    art: "manousheh",
    items: [
      manousheh("zaatar", "زعتر", "Zaatar", 75, 90, { tag: "signature", desc: t("زعتر بلدي وزيت زيتون", "Wild thyme & olive oil") }),
      manousheh("zaatar-veg", "زعتر + خضرة", "Zaatar & Veggies", 100, 120),
      manousheh("cheese", "جبنة", "Cheese", 225, 250, { tag: "signature" }),
      manousheh("cheese-veg", "جبنة + خضرة", "Cheese & Veggies", 250, 300),
      manousheh("cheese-sujuk", "جبنة + سجق", "Cheese & Sujuk", 300, 350),
      manousheh("cheese-mortadella", "جبنة + مرتديلا", "Cheese & Mortadella", 300, 350),
      manousheh("cocktail", "كوكتيل", "Cocktail", 150, 175, { desc: t("نص زعتر نص جبنة", "Half zaatar, half cheese") }),
      manousheh("kishk", "كشك", "Kishk", 175, 200),
      manousheh("lahme", "لحمة", "Lahm Bi Ajine", 250, 275),
      manousheh("awarma", "قاورما", "Awarma", 400),
      manousheh("awarma-cheese", "قاورما مع جبنة", "Awarma & Cheese", 500),
      manousheh("awarma-egg", "قاورما مع بيض", "Awarma & Egg", 500),
      manousheh("taouk", "طاووق", "Taouk", 450, 500),
      manousheh("fajita", "فاهيتا", "Fajita", 450, 500),
      manousheh("mexicana", "مكسيكانا", "Mexicana", 450, 500),
      manousheh("muhammara", "محمرة", "Muhammara", 150, 175),
      manousheh("muhammara-cheese", "محمرة + جبنة", "Muhammara & Cheese", 250, 275),
      manousheh("cheese-pizza-sauce", "جبنة + صوص بيتزا", "Cheese & Pizza Sauce", 250, 275),
      manousheh("cheese-corn-olive", "جبنة ذرة زيتون", "Cheese, Corn & Olives", 250, 275),
      manousheh("veggies", "خضرة", "Veggies", 150, 175),
      manousheh("veggies-cheese", "خضرة + جبنة", "Veggies & Cheese", 220, 275),
    ],
  },
  {
    id: "croissant",
    title: t("كرواسون", "Croissant"),
    script: t("بالزبدة", "buttery"),
    art: "croissant",
    items: [
      one("croissant-lotus", "كرواسون لوتس", "Lotus Croissant", 75, { group: t("بالحبة", "Per piece"), tag: "signature" }),
      one("croissant-choco", "كرواسون شوكولا", "Chocolate Croissant", 75, { group: t("بالحبة", "Per piece") }),
      one("croissant-cheese", "كرواسون جبنة", "Cheese Croissant", 75, { group: t("بالحبة", "Per piece") }),
      one("croissant-zaatar", "كرواسون زعتر", "Zaatar Croissant", 60, { group: t("بالحبة", "Per piece") }),
      one("sawari-lotus", "سواري لوتس", "Lotus Mini Croissants", 500, { group: t("سواري — الدزينة", "Sawari — per dozen") }),
      one("sawari-choco", "سواري شوكولا", "Chocolate Mini Croissants", 500, { group: t("سواري — الدزينة", "Sawari — per dozen") }),
      one("sawari-cheese", "سواري جبنة", "Cheese Mini Croissants", 500, { group: t("سواري — الدزينة", "Sawari — per dozen") }),
      one("sawari-zaatar", "سواري زعتر", "Zaatar Mini Croissants", 400, { group: t("سواري — الدزينة", "Sawari — per dozen") }),
      one("sawari-mix", "سواري مشكّل", "Mixed Mini Croissants", 500, {
        group: t("سواري — الدزينة", "Sawari — per dozen"),
        desc: t("شوكولا · جبنة · زعتر · لوتس", "Chocolate · cheese · zaatar · Lotus"),
        tag: "signature",
      }),
    ],
  },
  {
    id: "butter-dough",
    title: t("عجينة الزبدة", "Butter Dough"),
    script: t("طبقات", "flaky layers"),
    note: t("معجنات بالزبدة الطازجة", "Made with fresh butter"),
    art: "pastry",
    items: [
      one("ash-el-bulbul", "حبة عش البلبل", "Ash El Bulbul", 75),
      one("trablsiyeh-open", "طرابلسية مفتوحة", "Open Trablsiyeh", 130),
      one("oil-dough", "عجينة زيت", "Olive-Oil Dough", 75),
      one("cheese-mille-feuille", "جبنة ملفاي", "Cheese Mille-Feuille", 75),
    ],
  },
  {
    id: "kaak",
    title: t("كعك", "Kaak"),
    script: t("كعك لبناني", "Lebanese kaak"),
    note: t("كعك لبناني طازج", "Fresh Lebanese street kaak"),
    art: "kaak",
    items: [
      one("kaak-plain", "كعكة عادي", "Plain Kaak", 200),
      one("kaak-cheese", "كعكة جبنة", "Cheese Kaak", 250),
      one("kaak-4-cheese", "كعكة 4 تشيز", "Four-Cheese Kaak", 250, { tag: "signature" }),
      one("kaak-cheese-mortadella", "كعكة جبنة ومرتديلا", "Cheese & Mortadella Kaak", 250),
      one("kaak-cheese-turkey", "كعكة جبنة وحبش مدخن", "Cheese & Smoked Turkey Kaak", 250),
      one("kaak-cheese-sujuk", "كعكة جبنة وسجق", "Cheese & Sujuk Kaak", 250),
      one("kaak-cheese-pepperoni", "كعكة جبنة وببروني", "Cheese & Pepperoni Kaak", 250),
      one("kaak-chicken", "كعكة دجاج", "Chicken Kaak", 250),
    ],
  },
  {
    id: "pizza",
    title: t("بيتزا", "Pizza"),
    script: t("على الحطب", "baked golden"),
    note: t("صغير · وسط · كبير · رول", "Small · Medium · Large · Roll"),
    art: "pizza",
    items: [
      pizza("pizza-veg", "خضرة", "Vegetarian", [600, 700, 800, 225]),
      pizza("pizza-sujuk", "سجق", "Sujuk", STD),
      pizza("pizza-pepperoni", "بيبيروني", "Pepperoni", STD),
      pizza("pizza-fajita", "فاهيتا", "Fajita", STD),
      pizza("pizza-taouk", "طاووق", "Taouk", STD),
      pizza("pizza-mexicana", "ماكسيكانا", "Mexicana", STD),
      pizza("pizza-bbq-chicken", "تشيكن باربيكيو", "BBQ Chicken", STD),
      pizza("pizza-turkey", "حبش مدخن", "Smoked Turkey", STD),
      pizza("pizza-hotdog", "هوت دوغ", "Hot Dog", STD),
      pizza("pizza-celina", "سيلينا", "Celina", STD, { tag: "signature", desc: t("بيتزا البيت", "The house pizza") }),
      pizza("pizza-mortadella", "مرتديلا", "Mortadella", STD),
      pizza("pizza-4-cheese", "فور تشيز", "Four Cheese", STD),
      pizza("pizza-bikatchu", "بيكاتشو", "Bikatchu", STD),
    ],
  },
  {
    id: "fatayer",
    title: t("معجنات", "Pastries"),
    script: t("للسهرة", "for the table"),
    note: t("الدزينة أو بالحبة", "By the dozen or by the piece"),
    art: "fatayer",
    items: [
      ...(
        [
          ["spinach", "سبانخ", "Spinach", 275],
          ["cheese", "جبنة", "Cheese", 275],
          ["baalbakiyeh", "بعلبكية", "Baalbakiyeh", 300],
          ["fajita", "فاهيتا", "Fajita", 300],
          ["taouk", "طاووق", "Taouk", 300],
          ["mexicana", "مكسيكانا", "Mexicana", 300],
          ["philadelphia", "فيلادلفيا", "Philadelphia", 300],
          ["pizza", "بيتزا", "Pizza", 300],
          ["rakakat", "رقاقات جبنة", "Cheese Rakakat", 300],
          ["sujuk", "سجق", "Sujuk", 300],
          ["bacon", "بيكون", "Bacon", 275],
          ["zaatar", "زعتر", "Zaatar", 275],
          ["kishk", "كشك", "Kishk", 275],
          ["hotdog", "هوت دوغ", "Hot Dog", 300],
        ] as const
      ).map(([id, ar, en, p]) => one(`dozen-${id}`, ar, en, p, { group: t("الدزينة", "Per dozen") })),
      one("dozen-mix", "دزينة مشكّل", "Mixed Dozen", 300, { group: t("الدزينة", "Per dozen"), tag: "signature" }),
      one("piece-bikatchu", "بيكاتشو", "Bikatchu", 200, { group: t("بالحبة", "Per piece") }),
      one("piece-croissant", "كروسان", "Croissant", 75, { group: t("بالحبة", "Per piece") }),
      one("piece-hadaf", "حدف", "Hadaf", 100, { group: t("بالحبة", "Per piece") }),
      one("piece-ash-el-bulbul", "عش البلبل", "Ash El Bulbul", 100, { group: t("بالحبة", "Per piece") }),
      one("piece-trablsiyeh", "طرابلسية", "Trablsiyeh", 200, { group: t("بالحبة", "Per piece") }),
    ],
  },
];

/** Items shown in the "Signatures" track, in order. */
export const showcase = ["zaatar", "cheese", "croissant-lotus", "pizza-celina", "kaak-4-cheese", "sawari-mix"];

export const allItems = menu.flatMap((c) => c.items.map((item) => ({ item, cat: c })));
export const itemCount = allItems.length;

export function findItem(id: string) {
  return allItems.find((x) => x.item.id === id)?.item;
}

export function categoryOf(id: string) {
  return allItems.find((x) => x.item.id === id)?.cat;
}

/** Lowest price of an item (its own price, or the cheapest variant). */
export function basePrice(item: Item) {
  return item.variants ? Math.min(...item.variants.map((v) => v.price)) : (item.price ?? 0);
}

export function money(n: number, lang: Lang) {
  const s = n.toLocaleString("en-US");
  return lang === "ar" ? `${s} ل.ل` : `LBP ${s}`;
}

/** Short form for tight spots: 75,000 → "75K". */
export function moneyShort(n: number, lang: Lang) {
  const s = n % 1000 === 0 ? `${(n / 1000).toLocaleString("en-US")}K` : n.toLocaleString("en-US");
  return lang === "ar" ? `${s} ل.ل` : `${s} LBP`;
}
