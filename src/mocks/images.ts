export interface MockUnsplashImage {
  url: string;
  photographer: string;
  category: "sports" | "dental" | "business" | "design" | "nature";
}

export const MOCK_UNSPLASH_IMAGES: MockUnsplashImage[] = [
  {
    url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800",
    photographer: "Jonathan Chng",
    category: "sports"
  },
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    photographer: "Sven Mieke",
    category: "sports"
  },
  {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    photographer: "Cedric d'Alby",
    category: "dental"
  },
  {
    url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800",
    photographer: "Diana Polekhina",
    category: "dental"
  },
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    photographer: "Carlos Muza",
    category: "business"
  },
  {
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    photographer: "Luke Peters",
    category: "design"
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    photographer: "Sean Oulashin",
    category: "nature"
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    photographer: "Sven Mieke",
    category: "business"
  }
];
