// src/data/blogPosts.ts
import livingroom from "../assets/living room.jpg";
import diningroom from "../assets/dining room.jpg";
import whitechair1 from "../assets/whitechair1.jpg";

export type BlogPost = {
  id: number;
  slug: string; // for URL stability if you ever switch
  title: string;
  excerpt: string;
  img: string;
  date: string; // display date
  isoDate: string; // machine-friendly if needed later
  content: string; // markdown text
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "minimalist-living-room-ideas",
    title: "10 Minimalist Living Room Ideas",
    excerpt:
      "Choose neutral tones, wooden elements, and warm lighting to create a calm and stylish living space.",
    img: livingroom,
    date: "Sep 20, 2025",
    isoDate: "2025-09-20",
    tags: ["Living Room", "Minimalism", "Decor"],
    content: `
Minimalism isn't about having less—it’s about making room for more of what matters. Here are 10 practical ideas to refresh your living room:

1. **Neutral Base:** Start with whites, beiges, or soft greys to create a calm canvas.  
2. **Warm Woods:** Add wooden legs, side tables, or shelves for natural warmth.  
3. **Soft Lighting:** Use warm LED bulbs, floor lamps, and dimmers for cozy vibes.  
4. **Declutter Smartly:** Hide remotes and cables in trays or closed storage.  
5. **Textural Layers:** Combine linen throws, wool rugs, and cotton cushions.  
6. **One Focal Piece:** A statement artwork or sculptural lamp is enough.  
7. **Low Profile Sofa:** Keep lines clean and heights consistent.  
8. **Greenery:** One or two medium plants beat a dozen tiny pots.  
9. **Symmetry Light:** Mirror side tables or lamps—not everything must match.  
10. **Edit Weekly:** Keep surfaces intentional; remove what you don’t use.  

**Pro tip:** Photograph your room from the doorway—editing is easier when you see it like a visitor.
    `.trim(),
  },
  {
    id: 2,
    slug: "care-for-fabric-chairs",
    title: "Guide: How to Care for Fabric Chairs",
    excerpt:
      "Simple routines for vacuuming, spot-cleaning, and stain protection to keep your chairs looking new.",
    img: whitechair1,
    date: "Sep 20, 2025",
    isoDate: "2025-09-20",
    tags: ["Care", "Fabric", "Chairs"],
    content: `
Fabric chairs age gracefully with a little love. Keep yours fresh with this routine:

- **Weekly:** Vacuum with a soft brush attachment to lift dust and crumbs.  
- **Spills (ASAP):** Blot—don't rub—using a clean microfiber cloth.  
- **Spot Clean:** Mix mild soap + water (test underside first), dab gently, then air-dry.  
- **Stain Guard:** Consider a fabric protector spray (always test first).  
- **Sunlight:** Rotate chairs away from direct sun to avoid uneven fading.  
- **Odors:** Baking soda overnight, vacuum in the morning.  

**Fabric codes:** W (water-based cleaners), S (solvent), WS (either), X (vacuum only). Always check the label before cleaning!
    `.trim(),
  },
  {
    id: 3,
    slug: "perfect-dining-table-for-apartment",
    title: "The Perfect Dining Table for Your Apartment",
    excerpt:
      "Space-savvy picks: consider an extendable top, round edges, and lightweight stackable chairs.",
    img: diningroom,
    date: "Sep 20, 2025",
    isoDate: "2025-09-20",
    tags: ["Dining", "Small Space", "Guide"],
    content: `
In apartments, every centimeter counts. Here's how to pick a smart dining setup:

- **Shape:** Round tables soften tight layouts; rectangles maximize wall-side seating.  
- **Extendable:** Leaves give you guests-on-weekends flexibility.  
- **Materials:** Laminate or sealed wood = easier cleaning; avoid heavy stone if you move often.  
- **Legs & Base:** Pedestal bases free knee space; slim legs feel lighter visually.  
- **Chairs:** Stackable or folding chairs are MVPs for small rooms.  
- **Sizing tip:** Allow ~60 cm width per person and 90 cm clearance around the table for comfy movement.  

**Starter combo:** 100–110 cm round table + 4 stackable chairs + a bench against the wall.
    `.trim(),
  },
];
