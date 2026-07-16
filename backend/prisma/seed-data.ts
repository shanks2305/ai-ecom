export type BrandSeed = {
  name: string;
  slug: string;
  description: string;
};

export type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  children?: CategorySeed[];
};

export type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  price: number;
  brandSlug: string;
  categorySlug: string;
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
};

export const brands: BrandSeed[] = [
  { name: "Sony", slug: "sony", description: "PlayStation consoles, games, and accessories." },
  { name: "Microsoft", slug: "microsoft", description: "Xbox consoles, Game Pass, and PC gaming." },
  { name: "Nintendo", slug: "nintendo", description: "Switch hardware and iconic Nintendo franchises." },
  { name: "Valve", slug: "valve", description: "Steam platform, gift cards, and PC titles." },
  { name: "Electronic Arts", slug: "ea", description: "Sports, shooters, and live-service franchises." },
  { name: "Ubisoft", slug: "ubisoft", description: "Open-world adventures and competitive shooters." },
  { name: "Activision", slug: "activision", description: "Call of Duty and blockbuster action games." },
  { name: "Rockstar Games", slug: "rockstar", description: "Grand Theft Auto, Red Dead, and immersive worlds." },
  { name: "Bethesda", slug: "bethesda", description: "RPGs and expansive single-player experiences." },
  { name: "CD Projekt Red", slug: "cdpr", description: "Story-driven RPGs including The Witcher and Cyberpunk." },
  { name: "Capcom", slug: "capcom", description: "Resident Evil, Monster Hunter, and fighting games." },
  { name: "Bandai Namco", slug: "bandai-namco", description: "Anime fighters, RPGs, and arcade classics." },
  { name: "2K Games", slug: "2k", description: "Sports sims, shooters, and narrative adventures." },
  { name: "Epic Games", slug: "epic", description: "Fortnite, Unreal-powered titles, and Epic Store." },
  { name: "Logitech", slug: "logitech", description: "Gaming peripherals trusted by esports pros." },
  { name: "Razer", slug: "razer", description: "High-performance mice, keyboards, and headsets." },
  { name: "SteelSeries", slug: "steelseries", description: "Competitive-grade audio and input gear." },
  { name: "Corsair", slug: "corsair", description: "PC components, peripherals, and streaming gear." },
  { name: "HyperX", slug: "hyperx", description: "Comfort-focused headsets and accessories." },
  { name: "ASUS ROG", slug: "asus-rog", description: "Republic of Gamers monitors, laptops, and gear." },
];

export const categories: CategorySeed[] = [
  {
    name: "Consoles",
    slug: "consoles",
    description: "Next-gen and handheld gaming consoles.",
    children: [
      { name: "PlayStation", slug: "playstation-consoles", description: "PS5 and PlayStation hardware." },
      { name: "Xbox", slug: "xbox-consoles", description: "Xbox Series consoles and bundles." },
      { name: "Nintendo", slug: "nintendo-consoles", description: "Nintendo Switch family consoles." },
    ],
  },
  {
    name: "Games",
    slug: "games",
    description: "Physical and digital titles across platforms.",
    children: [
      { name: "Action & Adventure", slug: "action-adventure", description: "Story-driven action and exploration." },
      { name: "Sports", slug: "sports-games", description: "Football, racing leagues, and sports sims." },
      { name: "RPG", slug: "rpg-games", description: "Role-playing epics and open worlds." },
      { name: "Racing", slug: "racing-games", description: "Arcade and simulation racing titles." },
      { name: "Fighting", slug: "fighting-games", description: "Competitive fighters and brawlers." },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Controllers, audio, and setup essentials.",
    children: [
      { name: "Controllers", slug: "controllers", description: "Wireless and pro controllers." },
      { name: "Headsets", slug: "headsets", description: "Wired and wireless gaming audio." },
      { name: "Keyboards & Mice", slug: "keyboards-mice", description: "PC gaming input devices." },
      { name: "Charging & Storage", slug: "charging-storage", description: "Docks, chargers, and carry cases." },
    ],
  },
  {
    name: "Gift Cards",
    slug: "gift-cards",
    description: "Digital wallet top-ups for major platforms.",
    children: [
      { name: "PlayStation Store", slug: "ps-store-gift-cards", description: "PSN wallet codes." },
      { name: "Xbox & Microsoft Store", slug: "xbox-gift-cards", description: "Xbox and Microsoft wallet codes." },
      { name: "Steam", slug: "steam-gift-cards", description: "Steam Wallet gift cards." },
      { name: "Nintendo eShop", slug: "nintendo-eshop-gift-cards", description: "Nintendo eShop wallet codes." },
    ],
  },
  {
    name: "PC Gaming",
    slug: "pc-gaming",
    description: "Monitors, chairs, and desktop gaming gear.",
    children: [
      { name: "Gaming Monitors", slug: "gaming-monitors", description: "High refresh-rate displays." },
      { name: "Gaming Chairs", slug: "gaming-chairs", description: "Ergonomic seating for long sessions." },
    ],
  },
];

const explicitProducts: ProductSeed[] = [
  // Consoles
  { name: "PlayStation 5 Slim", slug: "playstation-5-slim", description: "1TB PS5 Slim with DualSense controller.", price: 44990, brandSlug: "sony", categorySlug: "playstation-consoles" },
  { name: "PlayStation 5 Pro", slug: "playstation-5-pro", description: "Enhanced PS5 Pro with 2TB storage.", price: 69990, brandSlug: "sony", categorySlug: "playstation-consoles" },
  { name: "Xbox Series X", slug: "xbox-series-x", description: "Flagship Xbox with 1TB SSD.", price: 52990, brandSlug: "microsoft", categorySlug: "xbox-consoles" },
  { name: "Xbox Series S", slug: "xbox-series-s", description: "Compact digital Xbox Series S 512GB.", price: 34990, brandSlug: "microsoft", categorySlug: "xbox-consoles" },
  { name: "Nintendo Switch OLED", slug: "nintendo-switch-oled", description: "7-inch OLED handheld hybrid console.", price: 34999, brandSlug: "nintendo", categorySlug: "nintendo-consoles" },
  { name: "Nintendo Switch 2", slug: "nintendo-switch-2", description: "Next-gen Nintendo hybrid console.", price: 44999, brandSlug: "nintendo", categorySlug: "nintendo-consoles" },

  // Games
  { name: "EA Sports FC 25", slug: "ea-sports-fc-25", description: "Latest football simulation from EA Sports.", price: 3999, brandSlug: "ea", categorySlug: "sports-games" },
  { name: "Call of Duty: Black Ops 6", slug: "call-of-duty-black-ops-6", description: "Fast-paced military shooter campaign and multiplayer.", price: 4499, brandSlug: "activision", categorySlug: "action-adventure" },
  { name: "Grand Theft Auto VI", slug: "grand-theft-auto-vi", description: "Open-world crime epic set in Vice City.", price: 4999, brandSlug: "rockstar", categorySlug: "action-adventure" },
  { name: "Elden Ring", slug: "elden-ring", description: "FromSoftware open-world action RPG.", price: 3499, brandSlug: "bandai-namco", categorySlug: "rpg-games" },
  { name: "The Witcher 3: Wild Hunt", slug: "the-witcher-3-wild-hunt", description: "Complete edition of the award-winning RPG.", price: 1999, brandSlug: "cdpr", categorySlug: "rpg-games" },
  { name: "Cyberpunk 2077", slug: "cyberpunk-2077", description: "Futuristic open-world RPG in Night City.", price: 2499, brandSlug: "cdpr", categorySlug: "rpg-games" },
  { name: "God of War Ragnarök", slug: "god-of-war-ragnarok", description: "Kratos and Atreus continue their Norse saga.", price: 3999, brandSlug: "sony", categorySlug: "action-adventure" },
  { name: "Marvel's Spider-Man 2", slug: "marvels-spider-man-2", description: "Play as both Peter Parker and Miles Morales.", price: 4499, brandSlug: "sony", categorySlug: "action-adventure" },
  { name: "The Legend of Zelda: Tears of the Kingdom", slug: "zelda-tears-of-the-kingdom", description: "Explore Hyrule and the skies above.", price: 4999, brandSlug: "nintendo", categorySlug: "action-adventure" },
  { name: "Mario Kart 8 Deluxe", slug: "mario-kart-8-deluxe", description: "Definitive kart racing on Nintendo Switch.", price: 4999, brandSlug: "nintendo", categorySlug: "racing-games" },
  { name: "Halo Infinite", slug: "halo-infinite", description: "Master Chief returns in sci-fi shooter action.", price: 2999, brandSlug: "microsoft", categorySlug: "action-adventure" },
  { name: "Forza Horizon 5", slug: "forza-horizon-5", description: "Open-world racing across vibrant Mexico.", price: 3499, brandSlug: "microsoft", categorySlug: "racing-games" },
  { name: "Assassin's Creed Mirage", slug: "assassins-creed-mirage", description: "Stealth action in ancient Baghdad.", price: 3499, brandSlug: "ubisoft", categorySlug: "action-adventure" },
  { name: "Rainbow Six Siege", slug: "rainbow-six-siege", description: "Tactical 5v5 competitive shooter.", price: 1999, brandSlug: "ubisoft", categorySlug: "action-adventure" },
  { name: "Red Dead Redemption 2", slug: "red-dead-redemption-2", description: "Western open-world masterpiece.", price: 2499, brandSlug: "rockstar", categorySlug: "action-adventure" },
  { name: "Resident Evil 4 Remake", slug: "resident-evil-4-remake", description: "Survival horror reimagined for modern consoles.", price: 3999, brandSlug: "capcom", categorySlug: "action-adventure" },
  { name: "Street Fighter 6", slug: "street-fighter-6", description: "Capcom's flagship fighting game.", price: 3999, brandSlug: "capcom", categorySlug: "fighting-games" },
  { name: "Tekken 8", slug: "tekken-8", description: "Next entry in the legendary 3D fighter series.", price: 4499, brandSlug: "bandai-namco", categorySlug: "fighting-games" },
  { name: "NBA 2K25", slug: "nba-2k25", description: "Basketball simulation with MyCareer mode.", price: 4499, brandSlug: "2k", categorySlug: "sports-games" },
  { name: "Starfield", slug: "starfield", description: "Bethesda's space exploration RPG.", price: 3999, brandSlug: "bethesda", categorySlug: "rpg-games" },
  { name: "Fortnite 2800 V-Bucks", slug: "fortnite-2800-v-bucks", description: "In-game currency for Fortnite cosmetics.", price: 1999, brandSlug: "epic", categorySlug: "action-adventure" },
  { name: "Hogwarts Legacy", slug: "hogwarts-legacy", description: "Open-world wizarding adventure.", price: 3999, brandSlug: "2k", categorySlug: "rpg-games" },

  // Gift cards
  { name: "Steam Gift Card ₹500", slug: "steam-gift-card-500", description: "Add ₹500 to your Steam Wallet.", price: 500, brandSlug: "valve", categorySlug: "steam-gift-cards" },
  { name: "Steam Gift Card ₹1000", slug: "steam-gift-card-1000", description: "Add ₹1000 to your Steam Wallet.", price: 1000, brandSlug: "valve", categorySlug: "steam-gift-cards" },
  { name: "Steam Gift Card ₹2000", slug: "steam-gift-card-2000", description: "Add ₹2000 to your Steam Wallet.", price: 2000, brandSlug: "valve", categorySlug: "steam-gift-cards" },
  { name: "PlayStation Store Gift Card ₹1000", slug: "ps-store-gift-card-1000", description: "Top up your PSN wallet with ₹1000.", price: 1000, brandSlug: "sony", categorySlug: "ps-store-gift-cards" },
  { name: "PlayStation Store Gift Card ₹2000", slug: "ps-store-gift-card-2000", description: "Top up your PSN wallet with ₹2000.", price: 2000, brandSlug: "sony", categorySlug: "ps-store-gift-cards" },
  { name: "Xbox Gift Card ₹1000", slug: "xbox-gift-card-1000", description: "Microsoft Store credit for games and add-ons.", price: 1000, brandSlug: "microsoft", categorySlug: "xbox-gift-cards" },
  { name: "Xbox Gift Card ₹2000", slug: "xbox-gift-card-2000", description: "Microsoft Store credit for games and add-ons.", price: 2000, brandSlug: "microsoft", categorySlug: "xbox-gift-cards" },
  { name: "Nintendo eShop Gift Card ₹500", slug: "nintendo-eshop-gift-card-500", description: "Nintendo eShop wallet top-up.", price: 500, brandSlug: "nintendo", categorySlug: "nintendo-eshop-gift-cards" },
  { name: "Nintendo eShop Gift Card ₹1000", slug: "nintendo-eshop-gift-card-1000", description: "Nintendo eShop wallet top-up.", price: 1000, brandSlug: "nintendo", categorySlug: "nintendo-eshop-gift-cards" },

  // Accessories
  { name: "DualSense Wireless Controller", slug: "dualsense-wireless-controller", description: "Official PS5 controller with haptic feedback.", price: 5990, brandSlug: "sony", categorySlug: "controllers" },
  { name: "Xbox Wireless Controller", slug: "xbox-wireless-controller", description: "Official Xbox controller in carbon black.", price: 5490, brandSlug: "microsoft", categorySlug: "controllers" },
  { name: "Nintendo Switch Joy-Con Pair", slug: "nintendo-switch-joy-con-pair", description: "Neon red and blue Joy-Con set.", price: 7499, brandSlug: "nintendo", categorySlug: "controllers" },
  { name: "Logitech G Pro X Headset", slug: "logitech-g-pro-x-headset", description: "Tournament-grade wired gaming headset.", price: 12995, brandSlug: "logitech", categorySlug: "headsets" },
  { name: "Razer BlackWidow V4 Keyboard", slug: "razer-blackwidow-v4-keyboard", description: "Mechanical keyboard with RGB lighting.", price: 14999, brandSlug: "razer", categorySlug: "keyboards-mice" },
  { name: "SteelSeries Arctis Nova Pro", slug: "steelseries-arctis-nova-pro", description: "Premium wireless headset with hot-swap battery.", price: 27999, brandSlug: "steelseries", categorySlug: "headsets" },
  { name: "PS5 DualSense Charging Station", slug: "ps5-dualsense-charging-station", description: "Charge two DualSense controllers at once.", price: 1990, brandSlug: "sony", categorySlug: "charging-storage" },
  { name: "Xbox Play and Charge Kit", slug: "xbox-play-and-charge-kit", description: "Rechargeable battery pack for Xbox controllers.", price: 2490, brandSlug: "microsoft", categorySlug: "charging-storage" },
  { name: "Corsair HS80 RGB Headset", slug: "corsair-hs80-rgb-headset", description: "Wireless Dolby Atmos gaming headset.", price: 11999, brandSlug: "corsair", categorySlug: "headsets" },
  { name: "HyperX Cloud III Wireless", slug: "hyperx-cloud-iii-wireless", description: "Lightweight wireless headset with long battery life.", price: 10999, brandSlug: "hyperx", categorySlug: "headsets" },
  { name: "Razer DeathAdder V3 Pro", slug: "razer-deathadder-v3-pro", description: "Esports wireless gaming mouse.", price: 12499, brandSlug: "razer", categorySlug: "keyboards-mice" },
  { name: "ASUS ROG Swift PG27AQDM", slug: "asus-rog-swift-pg27aqdm", description: "27-inch OLED 240Hz gaming monitor.", price: 89999, brandSlug: "asus-rog", categorySlug: "gaming-monitors" },
  { name: "ASUS ROG Chariot Gaming Chair", slug: "asus-rog-chariot-gaming-chair", description: "Ergonomic gaming chair with lumbar support.", price: 42999, brandSlug: "asus-rog", categorySlug: "gaming-chairs" },
];

type ProductTemplate = {
  baseName: string;
  baseSlug: string;
  description: string;
  basePrice: number;
  brandSlug: string;
  categorySlug: string;
  variants: string[];
  priceStep?: number;
};

const productTemplates: ProductTemplate[] = [
  { baseName: "FIFA Legacy Edition", baseSlug: "fifa-legacy", description: "Classic football title digital edition.", basePrice: 999, brandSlug: "ea", categorySlug: "sports-games", variants: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"] },
  { baseName: "Need for Speed", baseSlug: "need-for-speed", description: "Arcade street racing from EA.", basePrice: 1499, brandSlug: "ea", categorySlug: "racing-games", variants: ["Heat", "Payback", "Unbound", "Rivals", "Most Wanted"] },
  { baseName: "Battlefield", baseSlug: "battlefield", description: "Large-scale multiplayer warfare.", basePrice: 1999, brandSlug: "ea", categorySlug: "action-adventure", variants: ["1", "V", "2042", "Hardline", "4"] },
  { baseName: "Far Cry", baseSlug: "far-cry", description: "Open-world FPS adventure from Ubisoft.", basePrice: 1999, brandSlug: "ubisoft", categorySlug: "action-adventure", variants: ["3", "4", "5", "6", "New Dawn", "Primal"] },
  { baseName: "Watch Dogs", baseSlug: "watch-dogs", description: "Hack the city in this modern action series.", basePrice: 1499, brandSlug: "ubisoft", categorySlug: "action-adventure", variants: ["1", "2", "Legion"] },
  { baseName: "Monster Hunter", baseSlug: "monster-hunter", description: "Hunt giant monsters with friends.", basePrice: 2999, brandSlug: "capcom", categorySlug: "rpg-games", variants: ["World", "Rise", "Wilds"] },
  { baseName: "Devil May Cry", baseSlug: "devil-may-cry", description: "Stylish action hack-and-slash.", basePrice: 1999, brandSlug: "capcom", categorySlug: "action-adventure", variants: ["4", "5", "HD Collection"] },
  { baseName: "Dark Souls", baseSlug: "dark-souls", description: "Challenging action RPG from FromSoftware.", basePrice: 1999, brandSlug: "bandai-namco", categorySlug: "rpg-games", variants: ["Remastered", "II", "III"] },
  { baseName: "Sekiro: Shadows Die Twice", baseSlug: "sekiro", description: "Samurai action adventure.", basePrice: 2499, brandSlug: "activision", categorySlug: "action-adventure", variants: ["Standard", "GOTY Edition"] },
  { baseName: "Logitech G Series Mouse", baseSlug: "logitech-g-mouse", description: "Precision gaming mouse.", basePrice: 2999, brandSlug: "logitech", categorySlug: "keyboards-mice", variants: ["G502", "G305", "G403", "G703", "G903"], priceStep: 1500 },
  { baseName: "Razer Kraken Headset", baseSlug: "razer-kraken", description: "Comfortable gaming headset line.", basePrice: 4999, brandSlug: "razer", categorySlug: "headsets", variants: ["V3", "V3 X", "V4", "Kitty Edition"], priceStep: 2000 },
  { baseName: "SteelSeries QcK Mouse Pad", baseSlug: "steelseries-qck", description: "Esports mouse pad series.", basePrice: 999, brandSlug: "steelseries", categorySlug: "keyboards-mice", variants: ["Small", "Medium", "Large", "XXL", "Prism"], priceStep: 400 },
  { baseName: "Corsair K70 Keyboard", baseSlug: "corsair-k70", description: "Mechanical gaming keyboard.", basePrice: 9999, brandSlug: "corsair", categorySlug: "keyboards-mice", variants: ["RGB MK.2", "RGB PRO", "MINI", "TKL"], priceStep: 2500 },
  { baseName: "HyperX Alloy Keyboard", baseSlug: "hyperx-alloy", description: "Durable mechanical keyboard.", basePrice: 6999, brandSlug: "hyperx", categorySlug: "keyboards-mice", variants: ["Origins", "Origins Core", "Elite 2"], priceStep: 2000 },
  { baseName: "PlayStation Store Gift Card", baseSlug: "ps-store-gift-card", description: "PSN wallet top-up.", basePrice: 500, brandSlug: "sony", categorySlug: "ps-store-gift-cards", variants: ["₹500", "₹1500", "₹3000", "₹4000", "₹5000"], priceStep: 500 },
  { baseName: "Steam Gift Card", baseSlug: "steam-gift-card", description: "Steam Wallet top-up.", basePrice: 1500, brandSlug: "valve", categorySlug: "steam-gift-cards", variants: ["₹1500", "₹3000", "₹4000", "₹5000"], priceStep: 500 },
  { baseName: "Xbox Game Pass", baseSlug: "xbox-game-pass", description: "Subscription for hundreds of games.", basePrice: 699, brandSlug: "microsoft", categorySlug: "xbox-gift-cards", variants: ["1 Month", "3 Months", "6 Months", "12 Months"], priceStep: 1200 },
  { baseName: "Nintendo Switch Carrying Case", baseSlug: "nintendo-switch-case", description: "Protective travel case for Switch.", basePrice: 1299, brandSlug: "nintendo", categorySlug: "charging-storage", variants: ["Lite", "OLED", "Pro", "Travel Elite"], priceStep: 500 },
  { baseName: "ASUS ROG Strix Monitor", baseSlug: "asus-rog-strix-monitor", description: "High refresh gaming monitor.", basePrice: 24999, brandSlug: "asus-rog", categorySlug: "gaming-monitors", variants: ["24.5 280Hz", "27 165Hz", "32 144Hz", "34 Ultrawide"], priceStep: 15000 },
  { baseName: "2K Sports Bundle", baseSlug: "2k-sports-bundle", description: "Sports franchise digital bundle.", basePrice: 2999, brandSlug: "2k", categorySlug: "sports-games", variants: ["WWE 2K24", "PGA Tour 2K23", "MLB The Show 24", "TopSpin 2K25"], priceStep: 500 },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}

function expandTemplates(templates: ProductTemplate[]): ProductSeed[] {
  const generated: ProductSeed[] = [];

  for (const template of templates) {
    template.variants.forEach((variant, index) => {
      const name = `${template.baseName} ${variant}`;
      const slug = slugify(`${template.baseSlug}-${variant}`);
      const price = template.basePrice + (template.priceStep ?? 0) * index;

      generated.push({
        name,
        slug,
        description: `${template.description} (${variant} edition).`,
        price,
        brandSlug: template.brandSlug,
        categorySlug: template.categorySlug,
      });
    });
  }

  return generated;
}

function buildProducts(targetCount = 100): ProductSeed[] {
  const merged = new Map<string, ProductSeed>();

  for (const product of [...explicitProducts, ...expandTemplates(productTemplates)]) {
    merged.set(product.slug, { ...product, status: "PUBLISHED" });
  }

  let products = [...merged.values()];

  if (products.length < targetCount) {
    const fillers = [
      { name: "Minecraft", brandSlug: "microsoft", categorySlug: "action-adventure", price: 1999 },
      { name: "Doom Eternal", brandSlug: "bethesda", categorySlug: "action-adventure", price: 1499 },
      { name: "Fallout 4", brandSlug: "bethesda", categorySlug: "rpg-games", price: 999 },
      { name: "Skyrim Special Edition", brandSlug: "bethesda", categorySlug: "rpg-games", price: 1499 },
      { name: "Ghost of Tsushima", brandSlug: "sony", categorySlug: "action-adventure", price: 3999 },
      { name: "Horizon Forbidden West", brandSlug: "sony", categorySlug: "action-adventure", price: 3999 },
      { name: "Gran Turismo 7", brandSlug: "sony", categorySlug: "racing-games", price: 3999 },
      { name: "Super Smash Bros. Ultimate", brandSlug: "nintendo", categorySlug: "fighting-games", price: 4999 },
      { name: "Animal Crossing: New Horizons", brandSlug: "nintendo", categorySlug: "action-adventure", price: 4999 },
      { name: "Metroid Dread", brandSlug: "nintendo", categorySlug: "action-adventure", price: 3999 },
    ];

    for (const filler of fillers) {
      if (products.length >= targetCount) break;
      const slug = slugify(filler.name);
      if (!merged.has(slug)) {
        products.push({
          name: filler.name,
          slug,
          description: `${filler.name} for modern gaming platforms.`,
          price: filler.price,
          brandSlug: filler.brandSlug,
          categorySlug: filler.categorySlug,
          status: "PUBLISHED",
        });
        merged.set(slug, products[products.length - 1]);
      }
    }
  }

  return products.length >= targetCount ? products.slice(0, targetCount) : products;
}

export const products = buildProducts(100);
