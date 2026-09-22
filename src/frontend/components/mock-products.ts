import { Product } from "@/types/product";

// Temporary stand-in for src/backend/db product data.
// Only the products actually available right now — update this list
// as more real products/photos are ready, then delete once the
// real products fetch is wired up.
// Swap `image` paths for real photos in /public/images/products/.
export const mockProducts: Product[] = [
  {
    // Kashaya Powder
description: "A traditional blend of 18 powerful herbs for daily immunity and wellness.",
long_description: "A time-tested herbal decoction made with 18 powerful herbs, rooted in traditional wellness practices. This blend combines ingredients like ginger, turmeric, tulsi, and pepper to support immunity, ease digestive discomfort, and relieve seasonal cold and cough. Free from preservatives, artificial flavors, and added colors, it's crafted the way kashayas have been made for generations. A warm cup of this powder offers comfort during weather changes and everyday wellness support. Best enjoyed as a hot herbal drink.",
ingredients: "Ginger · Turmeric · Tulsi · Pepper · Coriander (+14 more herbs)",
netWeight: "100 g",
badges: ["🌿 100% Natural", "🍵 18 Herbs"],

    slug: "kashaya",
    name: "Kashaya",
    tagline: "Traditional herbal decoction",
    category: "wellness",
    price: 499,
    mrp: 649,
    rating: 4.5,
    reviewCount: 128,
    image: "/images/products/Kashaya.png", 
    hoverImage: "/images/products/kashaya-hover.png",
    howToUse: "Boil 1 teaspoon in a cup of water for 5 minutes. Strain and drink warm.",
    reviews: [
  { name: "Lakshmi N.", rating: 5, comment: "Helped a lot during the monsoon cold season. Warm and comforting to drink." },
  { name: "Suresh P.", rating: 4, comment: "Authentic taste, reminds me of what my grandmother used to make." },
  { name: "Divya M.", rating: 5, comment: "Great for immunity, I keep a jar at home always." },
],
  },
  {
    // Moringa Leaf Soup Mix with Millets
description: "Finely milled moringa leaves blended with wholesome millets for everyday nourishment.",
long_description: "Finely milled moringa leaves blended with wholesome millets to create a nourishing everyday superfood mix. Moringa is naturally rich in protein, iron, and calcium, making it an excellent addition to your daily diet. Combined with millets, this blend supports strong immunity, healthy skin and hair, and overall wellness. Free from artificial preservatives and colors, it's made using traditional, natural methods. A simple way to bring ancient nutrition into modern meals.",
ingredients: "Moringa Leaf Powder · Millets · Natural Spices",
netWeight: "100 g",
badges: ["🌿 100% Natural", "🌱 Plant Based"],
    slug: "moringa",
    name: "Moringa",
    tagline: "Pure leaf, finely milled",
    category: "superfoods",
    price: 349,
    mrp: 449,
    rating: 4.5,
    reviewCount: 256,
    image: "/images/products/Moringa.png", 
    hoverImage: "/images/products/Moringa-hover.png",
    howToUse: "Mix 2 tablespoons in warm water or soup. Stir well and consume once daily.",
    reviews: [
  { name: "Priya S.", rating: 5, comment: "Great taste and easy to mix into my morning routine. My skin feels noticeably better after a few weeks." },
  { name: "Arjun K.", rating: 4, comment: "Good product, slightly earthy taste but that's expected with moringa. Will buy again." },
  { name: "Meena R.", rating: 5, comment: "Love that it's natural with no added preservatives. Perfect for my kids too." },
],
  },
  {

// Nuts & Seeds Protein Powder
description: "A wholesome mix of roasted nuts and seeds, naturally rich in plant protein.",
long_description: "A wholesome blend of roasted nuts and seeds, crafted to deliver plant-based protein in its most natural form. Packed with almonds, cashews, pumpkin seeds, and flax seeds, this mix supports muscle strength, sustained energy, and heart health. Unlike whey-based powders, it's gentle on digestion and free from artificial additives or flavors. Perfect for anyone looking to boost their daily protein intake the natural way. Simply blend into milk, smoothies, or your favorite shake.",

ingredients: "Almonds · Cashews · Pumpkin Seeds · Flax Seeds",
netWeight: "250 g",
badges: ["🌿 100% Natural", "💪 High Protein"],

    slug: "protein-powder",
    name: "Protein Powder",
    tagline: "Plant-based, lightly sweetened",
    category: "superfoods",
    price: 1299,
    mrp: 1599,
    rating: 4.5,
    reviewCount: 89,
    image: "/images/products/protein-powder.png",
    hoverImage: "/images/products/protien-powder-hover.png", 
    howToUse: "Add 2 scoops to milk, smoothies, or your favorite shake. Blend well before serving.",
    reviews: [
  { name: "Rahul D.", rating: 5, comment: "Best plant protein I've tried. Mixes smoothly and doesn't have that chalky texture." },
  { name: "Sneha T.", rating: 4, comment: "Tastes great in smoothies. Wish the pack size was a bit bigger." },
  { name: "Karthik V.", rating: 5, comment: "Switched from whey to this and haven't looked back. Great for digestion." },
],
  },
  {
    // Menthe Mudde Mix
description: "Specially prepared fenugreek-based mix, traditionally made for lactating mothers.",
long_description: "A specially prepared fenugreek-based mix, traditionally made to support lactating mothers through their postpartum journey. Made with stone-ground fenugreek and wholesome flour, this recipe has been passed down through generations for its nourishing properties. It's believed to help boost milk production, strengthen bones, and aid digestion during recovery. Free from preservatives and artificial additives, it stays true to traditional preparation methods. A comforting, nutrient-rich addition to a new mother's daily routine.",
ingredients: "Fenugreek Seeds · Stone Ground Flour · Ghee",
netWeight: "100 g",
badges: ["🌿 100% Natural", "🤱 For New Mothers"],
    slug: "menthe-mudde",
    name: "Menthe Mudde Mix",
    tagline: "Fenugreek herbal balls, sun-dried",
    category: "wellness",
    price: 299,
    mrp: 399,
    rating: 4.5,
    reviewCount: 42,
    image: "/images/products/methi.png",
    hoverImage: "/images/products/methi-hover.png",
    howToUse: "Mix 2 tablespoons with warm ghee or water to form a soft ball. Consume once daily.",
    reviews: [
  { name: "Anjali S.", rating: 5, comment: "Recommended by my doctor after delivery. Really helped with recovery." },
  { name: "Pooja R.", rating: 5, comment: "Traditional recipe, tastes just like homemade. Great quality." },
  { name: "Nithya K.", rating: 4, comment: "Good product, takes a little effort to prepare but worth it." },
],
  },
];
