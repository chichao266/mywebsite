export type DemoProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  stoneType: string | null;
  metal: string | null;
  caratWeight: string | null;
  cut: string | null;
  color: string | null;
  clarity: string | null;
  certification: string | null;
  dimensions: string | null;
  care: string | null;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function imgs(...urls: string[]) {
  return JSON.stringify(urls);
}

const now = new Date("2026-06-24T00:00:00.000Z");

export const demoProducts: DemoProduct[] = [
  {
    id: "demo-lab-diamond-studs",
    name: "Solitaire Lab Diamond Studs",
    description:
      "A clean everyday pair of lab-grown diamond studs in a low-profile basket setting. Designed for daily shine, easy gifting, and effortless layering.",
    price: 168,
    images: imgs(
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=900&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=85"
    ),
    category: "Lab Diamonds",
    stoneType: "Lab-grown diamond",
    metal: "14k gold vermeil",
    caratWeight: "0.50 ct total",
    cut: "Round brilliant",
    color: "Near-colorless",
    clarity: "VS equivalent",
    certification: "Certificate available",
    dimensions: "4 mm stones",
    care: "Clean with a soft cloth and store separately from harder jewelry.",
    stock: 12,
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-lab-sapphire-ring",
    name: "Oval Lab Sapphire Ring",
    description:
      "A deep blue lab-grown sapphire in a refined oval setting. Finished with a slender band for a modern color statement.",
    price: 260,
    images: imgs(
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=900&auto=format&fit=crop&q=85"
    ),
    category: "Lab Sapphires",
    stoneType: "Lab-grown sapphire",
    metal: "14k gold vermeil",
    caratWeight: "1.20 ct center stone",
    cut: "Oval",
    color: "Deep blue",
    clarity: "Eye-clean",
    certification: "Stone origin disclosed",
    dimensions: "7 x 5 mm center stone",
    care: "Remove before swimming or applying lotion. Store in a dry pouch.",
    stock: 5,
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-emerald-line-pendant",
    name: "Emerald Line Pendant",
    description:
      "A slim pendant with a lab-grown emerald accent, balancing clear color with a simple silhouette for everyday wear.",
    price: 190,
    images: imgs(
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900&auto=format&fit=crop&q=85"
    ),
    category: "Lab Emeralds",
    stoneType: "Lab-grown emerald",
    metal: "Sterling silver",
    caratWeight: "0.40 ct",
    cut: "Baguette",
    color: "Emerald green",
    clarity: "Light garden visible",
    certification: "Stone origin disclosed",
    dimensions: "16-18 in adjustable chain",
    care: "Clean with a damp soft cloth. Avoid ultrasonic cleaners.",
    stock: 7,
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-ruby-huggies",
    name: "Ruby Petite Huggies",
    description:
      "Small huggie earrings with lab-grown ruby accents. A quiet flash of red designed for daily color, not occasion-only dressing.",
    price: 145,
    images: imgs(
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&auto=format&fit=crop&q=85"
    ),
    category: "Lab Rubies",
    stoneType: "Lab-grown ruby",
    metal: "Gold vermeil",
    caratWeight: "0.18 ct total",
    cut: "Round",
    color: "Ruby red",
    clarity: "Eye-clean",
    certification: "Stone origin disclosed",
    dimensions: "12 mm huggie diameter",
    care: "Close clasps before storage and keep away from perfume.",
    stock: 10,
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
];
