// Consolidated Egyptian sites service
import pyramidsSvg from '../assets/destinations/pyramids.svg';
import luxorSvg from '../assets/destinations/luxor.svg';
import redSeaSvg from '../assets/destinations/red-sea.svg';
import abuSimbelSvg from '../assets/destinations/abu-simbel.svg';

// Import JPG photos
import pyramidsGizaPhoto from '../assets/Pyramids_of_Giza.jpg';
import philaeTemplePhoto from '../assets/Philae_Temple.jpg';
import siwaOasisPhoto from '../assets/Siwa_Oasis.jpg';
import templeHatshepsutPhoto from '../assets/Temple_of_Hatshepsut.jpg';
import valleyKingsPhoto from '../assets/Valley_of_the_Kings.jpg';
import luxorTemplePhoto from '../assets/Egypt-Luxor-Temple1-SH.jpg';
import karnakTemplePhoto from '../assets/karnak temp.jpg';
import saqqaraPhoto from '../assets/saqaraa.jpg';
import sphinxPhoto from '../assets/sphnix.jpg';
import abuSimbelPhoto from '../assets/Abu Simble.jpg';
import redSeaCoastPhoto from '../assets/Red-Sea-Coast.jpg';
import TempleofSetiI from '../assets/temple of seti.jpg';
import MedinetHabu from '../assets/Medinet-Habu.jpg';
import meidumPyramidPhoto from '../assets/meidum Pyramid.jpg';
import tanisPhoto from '../assets/tanis.jpg';
import templeOfEsnaPhoto from '../assets/temple of esna.jpg';
import babZuweilaPhoto from '../assets/Bab_Zuweila.jpg';
import templeOfRamsesIIPhoto from '../assets/temple-of-ramses-ii.jpg';
import alHakimMosquePhoto from '../assets/Filming_in_the_Al_Hakim_Mosque.jpg';
import saintSimonMonasteryPhoto from '../assets/Saint Simon Monastery.jpg';
import stAnthonyMonasteryPhoto from '../assets/st-anthony-monastery.jpg';
import wadiAlRayanPhoto from '../assets/wadi al rayan.jpg';
import wadiElHitanPhoto from '../assets/wadi el hitan.jpg';
import fayoumOasisPhoto from '../assets/fayoum oasis.jpg';
import alAzharParkPhoto from '../assets/al azhar park.jpg';
import zamalekPhoto from '../assets/Zamalek.jpeg';
import manialPalacePhoto from '../assets/Manial-Palace-Cairo-.jpg';
import nubianVillagePhoto from '../assets/Nubian-Village.jpg';
import elephantineIslandPhoto from '../assets/view-of-the-river-nile-and-nubian-village-on-elephantine-island.jpg';
import elAlameinPhoto from '../assets/alamein military.jpg';
import rasMohammedPhoto from '../assets/Ras-Mohamed-Park.jpg';


// Helper function to get an image based on the site name or region
const getSiteImage = (siteName, region) => {
  // Default image mapping based on keywords in the name or region
  if (siteName.toLowerCase().includes('pyramid') || siteName.toLowerCase().includes('giza') || siteName.toLowerCase().includes('sphinx') ||
      siteName.toLowerCase().includes('meidum') || siteName.toLowerCase().includes('saqqara')) {
    return pyramidsSvg;
  } else if (siteName.toLowerCase().includes('luxor') || siteName.toLowerCase().includes('karnak') || siteName.toLowerCase().includes('temple') ||
             siteName.toLowerCase().includes('hatshepsut') || siteName.toLowerCase().includes('ramesseum') || siteName.toLowerCase().includes('habu') ||
             siteName.toLowerCase().includes('seti') || siteName.toLowerCase().includes('abydos') || siteName.toLowerCase().includes('esna') ||
             region.toLowerCase().includes('luxor')) {
    return luxorSvg;
  } else if (siteName.toLowerCase().includes('red sea') || siteName.toLowerCase().includes('beach') || siteName.toLowerCase().includes('diving') ||
             siteName.toLowerCase().includes('ras mohammed') || siteName.toLowerCase().includes('el alamein') ||
             region.toLowerCase().includes('red sea') || region.toLowerCase().includes('sinai')) {
    return redSeaSvg;
  } else if (siteName.toLowerCase().includes('abu simbel') || siteName.toLowerCase().includes('aswan') || siteName.toLowerCase().includes('philae') ||
             siteName.toLowerCase().includes('nubian') || siteName.toLowerCase().includes('elephantine') ||
             region.toLowerCase().includes('aswan')) {
    return abuSimbelSvg;
  }

  // Default to pyramids image for all other cases
  return pyramidsSvg;
};

// Egyptian sites data
export const egyptianSites = [
  {
    id: 1,
    name: "Pyramids of Giza",
    description: "The Pyramids of Giza, comprising the Great Pyramid of Khufu, the Pyramid of Khafre, and the Pyramid of Menkaure, are the only remaining wonders of the ancient world. Built over 4,500 years ago, these structures were monumental tombs for pharaohs, showcasing ancient Egypt's architectural prowess. Visitors can explore the interior chambers of some pyramids, learn about the construction theories, and view the Sphinx, a limestone statue symbolizing royal power and protection.",
    region: "Giza",
    coverImage: pyramidsGizaPhoto,
    category: "historical",
    shortDescription: "The only remaining wonder of the ancient world",
    averageRating: 4.9,
    reviewCount: 1245,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "240 EGP",
      student: "120 EGP",
      notes: "Additional fees for entering the pyramids"
    }
  },
  {
    id: 2,
    name: "Sphinx of Giza",
    description: "The Great Sphinx of Giza, with its lion's body and human head, represents the pharaoh Khafre. Carved from a single block of limestone, it measures 73 meters long and 20 meters high. The Sphinx guards the pyramids and stands as a symbol of strength and wisdom. The Sphinx Enclosure offers insights into its restoration and the surrounding temples.",
    region: "Giza",
    coverImage: sphinxPhoto,
    category: "historical",
    shortDescription: "The iconic guardian of the Giza Plateau",
    averageRating: 4.8,
    reviewCount: 1150,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "Included with Pyramids ticket",
      student: "Included with Pyramids ticket"
    }
  },
  {
    id: 3,
    name: "Saqqara Step Pyramid",
    description: "Designed by the architect Imhotep, the Step Pyramid of Djoser is the world's earliest colossal stone structure, dating back to the 27th century BCE. It marked a major advancement from traditional mastaba tombs to pyramid construction. Visitors can explore its complex, including courtyards, temples, and the Serdab chamber, which houses a replica of King Djoser's statue.",
    region: "Saqqara",
    coverImage: saqqaraPhoto,
    category: "historical",
    shortDescription: "The world's earliest colossal stone structure",
    averageRating: 4.7,
    reviewCount: 950,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "180 EGP",
      student: "90 EGP"
    }
  },
  {
    id: 4,
    name: "Luxor Temple",
    description: "Located on the east bank of the Nile, Luxor Temple was primarily dedicated to the Theban Triad—Amun, Mut, and Khonsu. Built during the New Kingdom, it features colossal statues, towering obelisks, and intricate carvings. The temple is illuminated beautifully at night, and the annual Opet Festival procession from Karnak to Luxor Temple is recreated in historical re-enactments.",
    region: "Luxor",
    coverImage: luxorTemplePhoto,
    category: "historical",
    shortDescription: "Explore the magnificent temple complex of ancient Thebes",
    averageRating: 4.7,
    reviewCount: 987,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning or evening",
    entryFee: {
      adult: "160 EGP",
      student: "80 EGP"
    }
  },
  {
    id: 5,
    name: "Karnak Temple",
    description: "The Karnak Temple complex is one of the largest religious sites ever constructed, spanning over 200 acres. It was built over 2,000 years, reflecting the contributions of numerous pharaohs. Key highlights include the Hypostyle Hall with its 134 massive columns, the Sacred Lake, and the Avenue of Sphinxes that once connected Karnak to Luxor Temple.",
    region: "Luxor",
    coverImage: karnakTemplePhoto,
    category: "historical",
    shortDescription: "The largest ancient religious site in the world",
    averageRating: 4.8,
    reviewCount: 1050,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "180 EGP",
      student: "90 EGP"
    }
  },
  {
    id: 6,
    name: "Valley of the Kings",
    description: "Nestled in the Theban Hills, the Valley of the Kings served as the necropolis for New Kingdom pharaohs. Over 60 tombs have been discovered, including the famous tomb of Tutankhamun, filled with golden artifacts. Each tomb is richly decorated with scenes from the Book of the Dead, intended to guide the deceased into the afterlife.",
    region: "Luxor",
    coverImage: valleyKingsPhoto,
    category: "historical",
    shortDescription: "The royal burial ground of ancient Egyptian pharaohs",
    averageRating: 4.9,
    reviewCount: 1120,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "240 EGP",
      student: "120 EGP",
      notes: "Additional fees for special tombs like Tutankhamun's"
    }
  },
  {
    id: 7,
    name: "Temple of Hatshepsut",
    description: "This mortuary temple, located at Deir el-Bahri, honors Hatshepsut, one of Egypt's few female pharaohs. Built into the cliffside, the temple features terraces, colonnades, and statues of Hatshepsut in various guises, including that of a male pharaoh. The temple's reliefs depict her divine birth and trading expeditions to Punt.",
    region: "Luxor",
    coverImage: templeHatshepsutPhoto,
    category: "historical",
    shortDescription: "The magnificent mortuary temple of Egypt's famous female pharaoh",
    averageRating: 4.7,
    reviewCount: 890,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "140 EGP",
      student: "70 EGP"
    }
  },
  {
    id: 8,
    name: "Philae Temple",
    description: "Once submerged by the Nile, Philae Temple was relocated to Agilkia Island as part of the UNESCO Nubia Campaign. Dedicated to the goddess Isis, it is renowned for its beautiful reliefs and the annual Philae Sound and Light Show, narrating the temple's history and mythology.",
    region: "Aswan",
    coverImage: philaeTemplePhoto,
    category: "historical",
    shortDescription: "A temple rescued from the rising waters of Lake Nasser",
    averageRating: 4.6,
    reviewCount: 780,
    visitDuration: "2 hours",
    bestTimeToVisit: "Morning or for the evening sound and light show",
    entryFee: {
      adult: "180 EGP",
      student: "90 EGP",
      notes: "Boat transfer to the island is additional"
    }
  },
  {
    id: 9,
    name: "Abu Simbel",
    description: "The twin temples of Abu Simbel were carved out of the mountainside in the 13th century BCE during the reign of Pharaoh Ramesses II. The temples were relocated in the 1960s to avoid being submerged during the creation of Lake Nasser. The main temple is dedicated to Ra-Horakhty, Ptah, and Amun, while the smaller temple is dedicated to the goddess Hathor and Queen Nefertari.",
    region: "Aswan",
    coverImage: abuSimbelPhoto,
    category: "historical",
    shortDescription: "Marvel at the colossal temples of Ramses II",
    averageRating: 4.9,
    reviewCount: 756,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "240 EGP",
      student: "120 EGP"
    }
  },
  {
    id: 10,
    name: "Red Sea Coast",
    description: "The Red Sea Coast of Egypt is famous for its pristine beaches, crystal-clear waters, and vibrant coral reefs. It's one of the world's premier diving and snorkeling destinations, with resorts like Hurghada and Sharm El Sheikh offering luxury accommodations and water activities.",
    region: "Red Sea",
    coverImage: redSeaCoastPhoto,
    category: "beach",
    shortDescription: "Discover world-class diving and pristine beaches",
    averageRating: 4.6,
    reviewCount: 1532,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, but spring and fall offer the best temperatures",
    entryFee: {
      notes: "Varies by beach and resort"
    }
  },
  {
    id: 11,
    name: "Temple of Seti I",
    description: "The Temple of Seti I is one of the most important archaeological sites in Egypt, known for its exceptional architectural design and remarkably detailed reliefs. The temple was built by Seti I and completed by his son Ramesses II, featuring seven sanctuaries dedicated to different deities.",
    region: "Abydos",
    coverImage: TempleofSetiI,
    category: "historical",
    shortDescription: "An important temple with detailed reliefs",
    averageRating: 4.7,
    reviewCount: 520,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "160 EGP",
      student: "80 EGP"
    }
  },
  {
    id: 12,
    name: "Medinet Habu",
    description: "Medinet Habu is the mortuary temple of Ramesses III, the second largest ancient temple complex in Egypt after Karnak. It is known for its well-preserved temple structure and the detailed reliefs depicting Ramesses III's military victories, particularly against the Sea Peoples.",
    region: "Luxor",
    coverImage: MedinetHabu,
    category: "historical",
    shortDescription: "Mortuary temple of Ramses III in Luxor",
    averageRating: 4.6,
    reviewCount: 480,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "140 EGP",
      student: "70 EGP"
    }
  },
  {
    id: 13,
    name: "Ramesseum",
    description: "The Ramesseum is the mortuary temple of Pharaoh Ramesses II (Ramesses the Great). Although partially ruined, it still contains impressive architectural elements and colossal statues. The fallen colossus of Ramesses II inspired Percy Bysshe Shelley's famous poem 'Ozymandias.'",
    region: "Luxor",
    coverImage: templeOfRamsesIIPhoto,
    category: "historical",
    shortDescription: "Ramses II's mortuary temple in Thebes (Luxor)",
    averageRating: 4.5,
    reviewCount: 420,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 14,
    name: "Temple of Esna",
    description: "The Temple of Esna (also known as the Temple of Khnum) is a Greco-Roman temple dedicated to the ram-headed god Khnum. The temple is partially buried beneath the modern town, with only the hypostyle hall excavated and accessible to visitors.",
    region: "Luxor",
    coverImage: templeOfEsnaPhoto,
    category: "historical",
    shortDescription: "Small temple dedicated to Khnum, well-preserved inside the modern town",
    averageRating: 4.3,
    reviewCount: 320,
    visitDuration: "1 hour",
    bestTimeToVisit: "Any time of day",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 15,
    name: "Meidum Pyramid",
    description: "The Meidum Pyramid is an ancient Egyptian pyramid that represents a transitional form between step pyramids and true pyramids. It was likely built by Pharaoh Huni and completed by Pharaoh Sneferu. The pyramid partially collapsed in ancient times, giving it a distinctive, tower-like appearance.",
    region: "Beni Suef",
    coverImage: meidumPyramidPhoto,
    category: "historical",
    shortDescription: "An early step pyramid south of Cairo",
    averageRating: 4.2,
    reviewCount: 180,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "60 EGP",
      student: "30 EGP"
    }
  },
  {
    id: 16,
    name: "Tanis",
    description: "Tanis (ancient Djanet) was a major city in ancient Egypt that served as the capital of the 21st and 22nd Dynasties during the Third Intermediate Period. The archaeological site contains ruins of temples, royal tombs, and a sacred lake. Tanis gained fame as the fictional location of the Lost Ark in the film 'Raiders of the Lost Ark.'",
    region: "Nile Delta",
    coverImage: tanisPhoto,
    category: "historical",
    shortDescription: "Ruins of a major ancient city in the Nile Delta",
    averageRating: 4.1,
    reviewCount: 150,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Winter months",
    entryFee: {
      adult: "60 EGP",
      student: "30 EGP"
    }
  },
  {
    id: 17,
    name: "Bab Zuweila",
    description: "Bab Zuweila is one of the few remaining gates of the ancient walled city of Cairo, dating from the Fatimid era. The gate features twin minarets and offers panoramic views of Islamic Cairo from its roof. It was once used for public executions and displaying the heads of criminals.",
    region: "Cairo",
    coverImage: babZuweilaPhoto,
    category: "historical",
    shortDescription: "Historic Islamic gate in Old Cairo",
    averageRating: 4.4,
    reviewCount: 380,
    visitDuration: "1 hour",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "40 EGP",
      student: "20 EGP"
    }
  },
  {
    id: 18,
    name: "Al-Hakim Mosque",
    description: "Al-Hakim Mosque is one of the major Fatimid-era mosques in Cairo, known for its impressive minarets and historical significance. Built by the controversial Fatimid caliph Al-Hakim bi-Amr Allah, the mosque has a unique architectural style and has been restored several times throughout history.",
    region: "Cairo",
    coverImage: alHakimMosquePhoto,
    category: "religious",
    shortDescription: "Fatimid-era mosque in Cairo",
    averageRating: 4.3,
    reviewCount: 290,
    visitDuration: "1 hour",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "40 EGP",
      student: "20 EGP"
    }
  },
  {
    id: 19,
    name: "Saint Simon Monastery",
    description: "The Monastery of Saint Simon (also known as the Cave Church) is a massive church carved into the Mokattam hills in Cairo. It is the largest church in the Middle East with an amphitheater-like structure that can seat up to 20,000 people. The church serves the large community of Zabbaleen (garbage collectors) who live in the area.",
    region: "Cairo",
    coverImage: saintSimonMonasteryPhoto,
    category: "religious",
    shortDescription: "Giant cave church carved into the Mokattam hills in Cairo",
    averageRating: 4.7,
    reviewCount: 450,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Weekday mornings",
    entryFee: {
      notes: "Free (donations appreciated)"
    }
  },
  {
    id: 20,
    name: "St. Anthony's Monastery",
    description: "St. Anthony's Monastery is one of the oldest Christian monasteries in the world, founded in the 4th century CE. Located in a remote desert setting near the Red Sea, the monastery contains ancient fortifications, churches, a library with valuable manuscripts, and beautiful wall paintings. It continues to be an active monastery with Coptic monks.",
    region: "Red Sea",
    coverImage: stAnthonyMonasteryPhoto,
    category: "religious",
    shortDescription: "One of the oldest Christian monasteries in the world",
    averageRating: 4.8,
    reviewCount: 320,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Weekday mornings",
    entryFee: {
      notes: "Free (donations appreciated)"
    }
  },
  {
    id: 21,
    name: "Wadi El Rayan",
    description: "Wadi El Rayan is a protected area featuring Egypt's only waterfalls connecting two man-made lakes. The area includes desert landscapes, springs, mountains, and a variety of wildlife. It's a popular destination for day trips from Cairo, offering activities like sandboarding, safari tours, and bird watching.",
    region: "Fayoum",
    coverImage: wadiAlRayanPhoto,
    category: "nature",
    shortDescription: "Oasis with waterfalls and desert lakes in Fayoum",
    averageRating: 4.6,
    reviewCount: 580,
    visitDuration: "Full day",
    bestTimeToVisit: "Winter months (November to March)",
    entryFee: {
      adult: "50 EGP",
      student: "25 EGP",
      notes: "Vehicle: 20 EGP"
    }
  },
  {
    id: 22,
    name: "Wadi El Hitan",
    description: "Wadi El Hitan (Valley of the Whales) is a UNESCO World Heritage Site containing hundreds of fossils of ancient whales that document one of the most significant evolutionary events in history: the transition of whales from land-based to ocean-going mammals. The site features a well-designed walking trail with informative signs and a fossil museum.",
    region: "Fayoum",
    coverImage: wadiElHitanPhoto,
    category: "nature",
    shortDescription: "UNESCO site with fossils of ancient whales",
    averageRating: 4.7,
    reviewCount: 420,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Winter months (November to March)",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP",
      notes: "Vehicle: 20 EGP"
    }
  },
  {
    id: 23,
    name: "Fayoum Oasis",
    description: "Fayoum Oasis is a depression in the desert immediately to the west of the Nile River. It contains Egypt's largest oasis, Lake Qarun, numerous archaeological sites, agricultural villages, and natural attractions. The area is known for its rural charm, pottery workshops, and as a bird-watching destination.",
    region: "Fayoum",
    coverImage: fayoumOasisPhoto,
    category: "nature",
    shortDescription: "Scenic area with villages, lakes, and ancient ruins",
    averageRating: 4.5,
    reviewCount: 380,
    visitDuration: "1-2 days",
    bestTimeToVisit: "Winter and spring (November to April)",
    entryFee: {
      notes: "Varies by specific site"
    }
  },
  {
    id: 24,
    name: "Al-Azhar Park",
    description: "Al-Azhar Park is a large public park in the heart of historic Cairo, created on what was once a 500-year-old debris dump. The 74-acre park features Islamic-style gardens, fountains, a lake, and several restaurants with panoramic views of Cairo. It provides a green oasis in one of the most densely populated cities in the world.",
    region: "Cairo",
    coverImage: alAzharParkPhoto,
    category: "recreation",
    shortDescription: "Modern Islamic-style park in central Cairo with great views",
    averageRating: 4.7,
    reviewCount: 920,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Late afternoon",
    entryFee: {
      adult: "25 EGP",
      student: "15 EGP"
    }
  },
  {
    id: 25,
    name: "Zamalek Island",
    description: "Zamalek is an upscale residential district located on Gezira Island in the Nile River. Known for its tree-lined streets, European-style buildings, and cultural venues, Zamalek hosts numerous embassies, art galleries, boutiques, cafes, and restaurants. It's home to the Cairo Opera House, the Museum of Modern Egyptian Art, and the Gezira Sporting Club.",
    region: "Cairo",
    coverImage: zamalekPhoto,
    category: "urban",
    shortDescription: "Green, upscale district on the Nile with cafes, galleries, and culture",
    averageRating: 4.6,
    reviewCount: 780,
    visitDuration: "Half day",
    bestTimeToVisit: "Afternoon and evening",
    entryFee: {
      notes: "Free to visit the district (specific venues have their own fees)"
    }
  },
  {
    id: 26,
    name: "Manial Palace",
    description: "Manial Palace is a former royal residence built by Prince Mohammed Ali Tewfik between 1899 and 1929. The palace complex includes multiple buildings with a unique architectural style blending Ottoman, Moorish, Persian, and European elements. It houses historical furniture, clothing, silver, artwork, and manuscripts in a museum setting surrounded by extensive gardens.",
    region: "Cairo",
    coverImage: manialPalacePhoto,
    category: "historical",
    shortDescription: "Ornate 19th-century palace and museum in Cairo",
    averageRating: 4.5,
    reviewCount: 420,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Weekday mornings",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP",
      notes: "Camera fee: 50 EGP"
    }
  },
  {
    id: 27,
    name: "Nubian Village",
    description: "The colorful Nubian villages near Aswan offer visitors a glimpse into the unique culture, architecture, and lifestyle of the Nubian people. These villages feature distinctively painted houses in bright colors, traditional handicrafts, and opportunities to experience Nubian music, food, and hospitality. The most visited villages are located on Elephantine Island and the west bank of the Nile.",
    region: "Aswan",
    coverImage: nubianVillagePhoto,
    category: "cultural",
    shortDescription: "Colorful villages showcasing Nubian culture and hospitality",
    averageRating: 4.8,
    reviewCount: 680,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning or late afternoon",
    entryFee: {
      notes: "Free to visit (expect to purchase handicrafts or refreshments)"
    }
  },
  {
    id: 28,
    name: "Elephantine Island",
    description: "Elephantine Island is located in the Nile River at Aswan and has been inhabited since prehistoric times. The island contains archaeological sites spanning 5,000 years of Egyptian history, including the Temple of Khnum, the Nilometer, and ruins from various periods. It also hosts the Aswan Museum and several traditional Nubian villages.",
    region: "Aswan",
    coverImage: elephantineIslandPhoto,
    category: "historical",
    shortDescription: "Ancient settlement with a museum and temple ruins",
    averageRating: 4.6,
    reviewCount: 520,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 29,
    name: "El Alamein",
    description: "El Alamein is the site of decisive battles of World War II that took place in 1942 between Allied forces led by General Montgomery and Axis forces led by General Rommel. Today, the area features a military museum with weapons, uniforms, and tanks, as well as Commonwealth, German, and Italian war cemeteries honoring the thousands of soldiers who died in the battles.",
    region: "Mediterranean Coast",
    coverImage: elAlameinPhoto,
    category: "historical",
    shortDescription: "World War II battlefield and military museum",
    averageRating: 4.5,
    reviewCount: 380,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Spring or fall",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP",
      notes: "Cemeteries: Free"
    }
  },
  {
    id: 30,
    name: "Ras Mohammed National Park",
    description: "Ras Mohammed National Park is Egypt's first national park, located at the southern tip of the Sinai Peninsula. The park encompasses both land and marine areas, featuring spectacular coral reefs, diverse marine life, mangrove forests, and dramatic landscapes where desert meets sea. It's considered one of the world's best diving and snorkeling locations.",
    region: "Sinai",
    coverImage: rasMohammedPhoto,
    category: "nature",
    shortDescription: "Marine park near Sharm El-Sheikh, ideal for snorkeling and diving",
    averageRating: 4.9,
    reviewCount: 1250,
    visitDuration: "Full day",
    bestTimeToVisit: "Spring and fall",
    entryFee: {
      adult: "200 EGP",
      student: "100 EGP"
    }
  },
  {
    id: 31,
    name: "Siwa Oasis",
    description: "Siwa Oasis is a remote desert oasis in the Western Desert of Egypt, near the border with Libya. Known for its unique culture, natural springs, salt lakes, and ancient ruins, Siwa offers a peaceful retreat from modern life. The oasis is famous for the Oracle Temple of Amun, where Alexander the Great once consulted the oracle, and for its distinctive Berber culture and architecture.",
    region: "Western Desert",
    coverImage: siwaOasisPhoto,
    category: "nature",
    shortDescription: "Remote desert oasis with ancient ruins and natural springs",
    averageRating: 4.8,
    reviewCount: 650,
    visitDuration: "2-3 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Free to visit the oasis (specific sites have individual fees)"
    }
  },
  {
    id: 32,
    name: "Dahshur Pyramids",
    description: "Dahshur is home to several pyramids built during the reign of King Sneferu, including the famous Bent Pyramid and Red Pyramid. The Bent Pyramid is unique for its distinctive shape, where the angle changes partway up, while the Red Pyramid is considered the first successful smooth-sided pyramid. These pyramids represent crucial steps in the evolution of pyramid construction.",
    region: "Dahshur",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Home to the Bent Pyramid and Red Pyramid of Sneferu",
    averageRating: 4.6,
    reviewCount: 420,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 33,
    name: "Valley of the Queens",
    description: "The Valley of the Queens served as the burial place for queens and royal children during the New Kingdom period. The most famous tomb belongs to Queen Nefertari, wife of Ramesses II, featuring some of the most beautiful and well-preserved wall paintings in ancient Egypt. The valley contains over 90 tombs with intricate decorations depicting the journey to the afterlife.",
    region: "Luxor",
    coverImage: luxorSvg,
    category: "historical",
    shortDescription: "Royal burial ground for queens and royal children",
    averageRating: 4.8,
    reviewCount: 680,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "180 EGP",
      student: "90 EGP",
      notes: "Additional fee for Nefertari's tomb: 1400 EGP"
    }
  },
  {
    id: 34,
    name: "Edfu Temple",
    description: "The Temple of Edfu, dedicated to the falcon god Horus, is one of the best-preserved temples in Egypt. Built during the Ptolemaic period, it features massive pylons, detailed reliefs, and a sacred boat sanctuary. The temple walls contain the famous 'Myth of Horus' inscriptions, telling the story of Horus's battle against his uncle Seth.",
    region: "Edfu",
    coverImage: luxorSvg,
    category: "historical",
    shortDescription: "Best-preserved temple dedicated to Horus",
    averageRating: 4.7,
    reviewCount: 890,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "140 EGP",
      student: "70 EGP"
    }
  },
  {
    id: 35,
    name: "Kom Ombo Temple",
    description: "The Temple of Kom Ombo is unique for being dedicated to two gods: Sobek (the crocodile god) and Haroeris (Horus the Elder). Built during the Ptolemaic dynasty, the temple features a symmetrical design with duplicate halls, sanctuaries, and courtyards. The site includes a crocodile museum displaying mummified crocodiles and artifacts.",
    region: "Kom Ombo",
    coverImage: luxorSvg,
    category: "historical",
    shortDescription: "Unique double temple dedicated to Sobek and Horus",
    averageRating: 4.6,
    reviewCount: 750,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning or sunset",
    entryFee: {
      adult: "120 EGP",
      student: "60 EGP"
    }
  },
  {
    id: 36,
    name: "Dendera Temple Complex",
    description: "The Dendera Temple Complex is dedicated to Hathor, the goddess of love, beauty, and joy. Famous for its astronomical ceiling depicting the zodiac, the temple features well-preserved colors and intricate carvings. The complex includes the main temple, a sacred lake, sanatorium, and the famous Dendera Light reliefs that have sparked much debate among researchers.",
    region: "Dendera",
    coverImage: luxorSvg,
    category: "historical",
    shortDescription: "Temple of Hathor with famous astronomical ceiling",
    averageRating: 4.7,
    reviewCount: 620,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "140 EGP",
      student: "70 EGP"
    }
  },
  {
    id: 37,
    name: "Serapeum of Saqqara",
    description: "The Serapeum of Saqqara is an underground complex of tunnels and chambers that served as the burial place for the sacred Apis bulls. These massive granite and basalt sarcophagi, each weighing up to 80 tons, were discovered by Auguste Mariette in 1851. The site provides insight into ancient Egyptian religious practices and the cult of the Apis bull.",
    region: "Saqqara",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Underground burial complex for sacred Apis bulls",
    averageRating: 4.5,
    reviewCount: 380,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "150 EGP",
      student: "75 EGP"
    }
  },
  {
    id: 38,
    name: "Qasr Qarun",
    description: "Qasr Qarun is a well-preserved Greco-Roman temple located in the Fayoum region. Built during the Ptolemaic period and dedicated to the crocodile god Sobek, the temple features multiple levels, chambers, and a complex system of passages. The site offers panoramic views of Lake Qarun and the surrounding desert landscape.",
    region: "Fayoum",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Greco-Roman temple overlooking Lake Qarun",
    averageRating: 4.3,
    reviewCount: 280,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Late afternoon for sunset views",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP"
    }
  },
  {
    id: 39,
    name: "Sharm El Sheikh",
    description: "Sharm El Sheikh is Egypt's premier Red Sea resort destination, famous for its world-class diving sites, luxury resorts, and vibrant nightlife. The area offers access to some of the world's most spectacular coral reefs, including the famous Blue Hole and Thistlegorm wreck. The resort town features beautiful beaches, water sports, and a bustling old market.",
    region: "Sinai",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Premier Red Sea resort with world-class diving",
    averageRating: 4.7,
    reviewCount: 2150,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Varies by beach and resort"
    }
  },
  {
    id: 40,
    name: "Dahab",
    description: "Dahab is a laid-back coastal town on the Sinai Peninsula, known for its relaxed atmosphere, budget-friendly accommodations, and excellent diving spots. The town is famous for the Blue Hole, one of the world's most renowned diving sites, and offers a bohemian vibe with beachfront cafes, Bedouin culture, and stunning desert landscapes.",
    region: "Sinai",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Laid-back diving town with the famous Blue Hole",
    averageRating: 4.6,
    reviewCount: 1680,
    visitDuration: "2-5 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Free beaches, diving excursions vary"
    }
  },
  {
    id: 41,
    name: "Hurghada",
    description: "Hurghada is one of Egypt's oldest and most established Red Sea resort destinations. Known for its beautiful beaches, coral reefs, and water sports, the city offers a perfect blend of relaxation and adventure. Visitors can enjoy snorkeling, diving, windsurfing, and boat trips to nearby islands, along with a vibrant marina and old town area.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Established Red Sea resort with beautiful coral reefs",
    averageRating: 4.5,
    reviewCount: 1950,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Varies by beach and resort"
    }
  },
  {
    id: 42,
    name: "Marsa Alam",
    description: "Marsa Alam is a pristine Red Sea destination known for its untouched coral reefs, diverse marine life, and luxury eco-resorts. The area is famous for dugong sightings, sea turtle nesting sites, and some of the Red Sea's most spectacular diving spots including Elphinstone Reef and Abu Dabbab Bay.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Pristine Red Sea destination with diverse marine life",
    averageRating: 4.8,
    reviewCount: 1320,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Varies by beach and resort"
    }
  },
  {
    id: 43,
    name: "El Gouna",
    description: "El Gouna is an upscale resort town built on a series of islands and lagoons along the Red Sea coast. Known for its distinctive architecture, championship golf course, and luxury amenities, the town offers a sophisticated beach experience with marinas, spas, and fine dining restaurants.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Upscale resort town built on lagoons",
    averageRating: 4.7,
    reviewCount: 1180,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Varies by beach and resort"
    }
  },
  {
    id: 44,
    name: "Nuweiba",
    description: "Nuweiba is a quiet coastal town on the Gulf of Aqaba, offering a peaceful alternative to busier Red Sea resorts. The area is known for its beautiful beaches, Bedouin culture, and proximity to Mount Sinai and Saint Catherine's Monastery. It's also the departure point for ferries to Jordan.",
    region: "Sinai",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Quiet coastal town near Mount Sinai",
    averageRating: 4.4,
    reviewCount: 680,
    visitDuration: "2-4 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Free beaches"
    }
  },
  {
    id: 45,
    name: "Taba",
    description: "Taba is located at the northernmost tip of the Gulf of Aqaba, right at the border with Israel. The resort town offers stunning mountain and sea views, luxury hotels, and access to excellent diving sites. The area is known for its dramatic landscape where desert mountains meet the sea.",
    region: "Sinai",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Border resort town with mountain and sea views",
    averageRating: 4.5,
    reviewCount: 520,
    visitDuration: "2-4 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Varies by resort"
    }
  },
  {
    id: 46,
    name: "White Desert National Park",
    description: "The White Desert is one of Egypt's most surreal landscapes, featuring chalk rock formations sculpted by wind erosion into mushroom-like shapes. Located in the Farafra Depression, the park offers camping under the stars, unique geological formations, and an otherworldly experience. The contrast between white chalk rocks and golden sand creates a magical atmosphere.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Surreal white chalk formations in the Western Desert",
    averageRating: 4.9,
    reviewCount: 850,
    visitDuration: "1-2 days",
    bestTimeToVisit: "October to March",
    entryFee: {
      adult: "50 EGP",
      student: "25 EGP",
      notes: "Camping permits required"
    }
  },
  {
    id: 47,
    name: "Black Desert",
    description: "The Black Desert gets its name from the black volcanic hills and rocks scattered across the landscape. Located between the Bahariya and Farafra oases, this unique desert features dark volcanic material contrasting with golden sand dunes. The area offers excellent opportunities for desert camping and photography.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Volcanic landscape with black hills and golden sand",
    averageRating: 4.7,
    reviewCount: 620,
    visitDuration: "1 day",
    bestTimeToVisit: "October to March",
    entryFee: {
      adult: "30 EGP",
      student: "15 EGP"
    }
  },
  {
    id: 48,
    name: "Bahariya Oasis",
    description: "Bahariya Oasis is a lush depression in the Western Desert, known for its hot springs, palm groves, and archaeological sites. The oasis features the Valley of the Golden Mummies, ancient tombs with well-preserved mummies, and the Temple of Alexander the Great. It serves as a gateway to the White and Black Deserts.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Lush oasis with hot springs and golden mummies",
    averageRating: 4.6,
    reviewCount: 480,
    visitDuration: "1-2 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Varies by specific site"
    }
  },
  {
    id: 49,
    name: "Farafra Oasis",
    description: "Farafra is the most isolated and smallest of Egypt's major oases, known for its traditional mud-brick architecture and peaceful atmosphere. The oasis is famous for its hot springs, palm groves, and as the gateway to the White Desert. The local Bedouin culture remains largely unchanged, offering authentic desert experiences.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Isolated oasis gateway to the White Desert",
    averageRating: 4.5,
    reviewCount: 320,
    visitDuration: "1-2 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Free to visit oasis, fees for specific activities"
    }
  },
  {
    id: 50,
    name: "Dakhla Oasis",
    description: "Dakhla Oasis is one of Egypt's most beautiful oases, featuring medieval Islamic architecture, ancient Roman ruins, and lush agricultural areas. The oasis includes the medieval town of Al-Qasr with its narrow alleys and traditional houses, hot springs, and prehistoric rock art sites.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Beautiful oasis with medieval Islamic architecture",
    averageRating: 4.7,
    reviewCount: 420,
    visitDuration: "2-3 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Varies by specific site"
    }
  },
  {
    id: 51,
    name: "Kharga Oasis",
    description: "Kharga is the largest of Egypt's oases and the capital of the New Valley Governorate. The oasis features ancient temples, Christian monuments, and Islamic architecture. Key attractions include the Temple of Hibis, the Necropolis of Al-Bagawat with its early Christian tombs, and the Fortress of Ghueita.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Largest oasis with ancient temples and Christian monuments",
    averageRating: 4.4,
    reviewCount: 380,
    visitDuration: "1-2 days",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Varies by specific site"
    }
  },
  {
    id: 52,
    name: "Crystal Mountain",
    description: "Crystal Mountain is a unique geological formation in the Western Desert, made entirely of quartz crystal. This natural wonder sparkles in the sunlight and offers a magical experience for visitors. The mountain is located on the route between the Bahariya Oasis and the White Desert, making it a popular stop for desert tours.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Unique quartz crystal mountain formation",
    averageRating: 4.8,
    reviewCount: 290,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "October to March",
    entryFee: {
      notes: "Usually included in desert tour packages"
    }
  },
  {
    id: 53,
    name: "Egyptian Museum",
    description: "The Egyptian Museum in Tahrir Square houses the world's most extensive collection of ancient Egyptian artifacts, including treasures from Tutankhamun's tomb, royal mummies, and countless statues, jewelry, and everyday objects spanning 5,000 years of Egyptian history. The museum's collection includes over 120,000 items.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "World's most extensive collection of Egyptian artifacts",
    averageRating: 4.6,
    reviewCount: 2850,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Early morning to avoid crowds",
    entryFee: {
      adult: "200 EGP",
      student: "100 EGP",
      notes: "Additional fees for Royal Mummies Hall and photography"
    }
  },
  {
    id: 54,
    name: "Grand Egyptian Museum",
    description: "The Grand Egyptian Museum (GEM) near the Giza Pyramids is the world's largest archaeological museum dedicated to a single civilization. This state-of-the-art facility houses over 100,000 artifacts, including the complete Tutankhamun collection, and offers immersive experiences with cutting-edge technology and stunning views of the pyramids.",
    region: "Giza",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "World's largest archaeological museum near the pyramids",
    averageRating: 4.9,
    reviewCount: 1250,
    visitDuration: "4-6 hours",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "600 EGP",
      student: "300 EGP",
      notes: "Different ticket tiers available"
    }
  },
  {
    id: 55,
    name: "Khan El Khalili Bazaar",
    description: "Khan El Khalili is Cairo's most famous bazaar, a labyrinth of narrow alleys filled with shops selling everything from spices and perfumes to jewelry and souvenirs. Dating back to the 14th century, this historic market offers an authentic Middle Eastern shopping experience with traditional crafts, antiques, and the famous El Fishawi Café.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Historic bazaar with traditional crafts and souvenirs",
    averageRating: 4.4,
    reviewCount: 3200,
    visitDuration: "2-4 hours",
    bestTimeToVisit: "Late afternoon and evening",
    entryFee: {
      notes: "Free to enter, bargaining expected for purchases"
    }
  },
  {
    id: 56,
    name: "Al-Azhar Mosque",
    description: "Al-Azhar Mosque is one of the most important mosques in the Islamic world and home to Al-Azhar University, the oldest continuously operating university. Built in 970 CE, the mosque features beautiful Islamic architecture with minarets, courtyards, and prayer halls. It remains a center of Islamic learning and worship.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Historic mosque and center of Islamic learning",
    averageRating: 4.7,
    reviewCount: 1680,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Outside prayer times",
    entryFee: {
      notes: "Free, modest dress required"
    }
  },
  {
    id: 57,
    name: "Citadel of Saladin",
    description: "The Citadel of Saladin is a medieval Islamic fortification built by Saladin in the 12th century to defend against Crusader attacks. The complex includes the impressive Mosque of Muhammad Ali, military museums, and offers panoramic views of Cairo. The citadel represents one of the finest examples of medieval military architecture.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Medieval fortress with panoramic views of Cairo",
    averageRating: 4.6,
    reviewCount: 2100,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning or late afternoon",
    entryFee: {
      adult: "180 EGP",
      student: "90 EGP"
    }
  },
  {
    id: 58,
    name: "Mosque of Muhammad Ali",
    description: "The Mosque of Muhammad Ali, also known as the Alabaster Mosque, is located within the Citadel of Saladin. Built in the Ottoman style with a central dome and twin minarets, the mosque is clad in alabaster and offers stunning views over Cairo. It serves as the burial place of Muhammad Ali Pasha, the founder of modern Egypt.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Ottoman-style mosque clad in alabaster",
    averageRating: 4.7,
    reviewCount: 1850,
    visitDuration: "1 hour",
    bestTimeToVisit: "Outside prayer times",
    entryFee: {
      notes: "Included with Citadel ticket"
    }
  },
  {
    id: 59,
    name: "Coptic Cairo",
    description: "Coptic Cairo is the historic Christian quarter of Old Cairo, home to numerous ancient churches, monasteries, and the Coptic Museum. Key sites include the Hanging Church (Al-Muallaqa), the Church of St. Sergius and Bacchus, and the Ben Ezra Synagogue. This area represents the heart of Egypt's Christian heritage.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Historic Christian quarter with ancient churches",
    averageRating: 4.5,
    reviewCount: 1420,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      notes: "Free to enter churches, small donations appreciated"
    }
  },
  {
    id: 60,
    name: "Ben Ezra Synagogue",
    description: "The Ben Ezra Synagogue is the oldest synagogue in Cairo, dating back to the 9th century. Built on the site where baby Moses was allegedly found, the synagogue houses the famous Cairo Geniza collection of medieval Jewish manuscripts. The building showcases beautiful Islamic and Jewish architectural elements.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Oldest synagogue in Cairo with historic manuscripts",
    averageRating: 4.3,
    reviewCount: 680,
    visitDuration: "30-45 minutes",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      notes: "Free, donations appreciated"
    }
  },
  {
    id: 61,
    name: "Al-Muizz Street",
    description: "Al-Muizz Street is one of the oldest streets in Cairo and the largest open-air museum of Islamic architecture in the world. The street features medieval mosques, madrasas, hammams, and fountains spanning different Islamic periods. It's a UNESCO World Heritage site showcasing the evolution of Islamic Cairo.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "World's largest open-air museum of Islamic architecture",
    averageRating: 4.6,
    reviewCount: 1950,
    visitDuration: "2-4 hours",
    bestTimeToVisit: "Late afternoon and evening",
    entryFee: {
      notes: "Free to walk, individual monuments have entry fees"
    }
  },
  {
    id: 62,
    name: "Cairo Tower",
    description: "Cairo Tower is a 187-meter tall concrete tower offering panoramic views of Cairo and the Nile River. Built in the 1960s, the tower features a revolving restaurant at the top and observation decks. It's an iconic landmark of modern Cairo and provides the best aerial views of the city's sprawling landscape.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "urban",
    shortDescription: "Iconic tower with panoramic views of Cairo",
    averageRating: 4.4,
    reviewCount: 2200,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Sunset for best views",
    entryFee: {
      adult: "120 EGP",
      student: "60 EGP"
    }
  },
  {
    id: 63,
    name: "Monastery of Saint Catherine",
    description: "Saint Catherine's Monastery is one of the oldest continuously operating Christian monasteries in the world, located at the foot of Mount Sinai. The monastery houses an incredible collection of early Christian manuscripts, icons, and the alleged burning bush from the biblical story of Moses. It's a UNESCO World Heritage site.",
    region: "Sinai",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Ancient monastery at the foot of Mount Sinai",
    averageRating: 4.8,
    reviewCount: 920,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      notes: "Free, donations appreciated"
    }
  },
  {
    id: 64,
    name: "Mount Sinai",
    description: "Mount Sinai (Jebel Musa) is the biblical mountain where Moses is said to have received the Ten Commandments. The mountain offers a challenging hike to the summit, typically done at night to witness the spectacular sunrise. The trek passes through dramatic desert landscapes and offers spiritual significance for multiple religions.",
    region: "Sinai",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Biblical mountain with sunrise hiking experience",
    averageRating: 4.9,
    reviewCount: 1580,
    visitDuration: "6-8 hours (including hike)",
    bestTimeToVisit: "October to April for hiking",
    entryFee: {
      adult: "50 EGP",
      student: "25 EGP",
      notes: "Guide recommended for night hike"
    }
  },
  {
    id: 65,
    name: "Library of Alexandria",
    description: "The Bibliotheca Alexandrina is a modern tribute to the ancient Library of Alexandria, one of the largest and most significant libraries of the ancient world. The contemporary library features a distinctive tilted disc design, multiple museums, planetarium, and millions of books. It serves as a major cultural center for the Mediterranean region.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Modern tribute to the ancient Library of Alexandria",
    averageRating: 4.6,
    reviewCount: 1850,
    visitDuration: "2-4 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "70 EGP",
      student: "35 EGP",
      notes: "Additional fees for museums and planetarium"
    }
  },
  {
    id: 66,
    name: "Citadel of Qaitbay",
    description: "The Citadel of Qaitbay is a 15th-century fortress built on the exact site of the ancient Lighthouse of Alexandria, one of the Seven Wonders of the Ancient World. The fortress offers stunning views of the Mediterranean Sea and houses a naval museum. It represents the last major medieval fortification built in Egypt.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Medieval fortress on the site of the ancient lighthouse",
    averageRating: 4.5,
    reviewCount: 1420,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Late afternoon for sunset views",
    entryFee: {
      adult: "60 EGP",
      student: "30 EGP"
    }
  },
  {
    id: 67,
    name: "Pompey's Pillar",
    description: "Pompey's Pillar is a Roman triumphal column and the largest ancient monument in Alexandria. Standing 27 meters high, it was erected in honor of Emperor Diocletian. The site also includes underground galleries, sphinxes, and the remains of the ancient Serapeum temple complex.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Largest ancient monument in Alexandria",
    averageRating: 4.3,
    reviewCount: 980,
    visitDuration: "1 hour",
    bestTimeToVisit: "Morning or late afternoon",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP"
    }
  },
  {
    id: 68,
    name: "Catacombs of Kom el Shoqafa",
    description: "The Catacombs of Kom el Shoqafa are the largest Roman burial site in Egypt, dating from the 2nd century CE. This underground necropolis features a unique blend of Egyptian, Greek, and Roman artistic traditions. The three-level catacomb includes the Hall of Caracalla and intricate carved reliefs.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Largest Roman burial site with unique artistic blend",
    averageRating: 4.4,
    reviewCount: 1120,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP"
    }
  },
  {
    id: 69,
    name: "Montaza Palace",
    description: "Montaza Palace is a former royal palace complex built in the early 20th century, featuring beautiful gardens, beaches, and Ottoman-Florentine architecture. The palace grounds include the Haramlik and Salamlik palaces, extensive gardens with rare plants, and private beaches along the Mediterranean coast.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Former royal palace with beautiful gardens and beaches",
    averageRating: 4.6,
    reviewCount: 1680,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Late afternoon",
    entryFee: {
      adult: "25 EGP",
      student: "15 EGP",
      notes: "Palace interior: additional 60 EGP"
    }
  },
  {
    id: 70,
    name: "Alexandria Corniche",
    description: "The Alexandria Corniche is a waterfront promenade stretching along the Mediterranean coast, offering stunning sea views, historic buildings, and vibrant street life. The corniche passes by major landmarks including the Citadel of Qaitbay, Stanley Bridge, and numerous cafes and restaurants with sea views.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "urban",
    shortDescription: "Scenic waterfront promenade along the Mediterranean",
    averageRating: 4.5,
    reviewCount: 2200,
    visitDuration: "2-4 hours",
    bestTimeToVisit: "Late afternoon and evening",
    entryFee: {
      notes: "Free to walk"
    }
  },
  {
    id: 71,
    name: "Aswan High Dam",
    description: "The Aswan High Dam is one of the world's largest embankment dams, completed in 1970. The dam created Lake Nasser, one of the world's largest artificial lakes, and provides hydroelectric power for much of Egypt. The visitor center offers insights into the dam's construction and its impact on Egypt's development.",
    region: "Aswan",
    coverImage: abuSimbelSvg,
    category: "modern",
    shortDescription: "Massive dam creating Lake Nasser",
    averageRating: 4.2,
    reviewCount: 1180,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning or late afternoon",
    entryFee: {
      adult: "30 EGP",
      student: "15 EGP"
    }
  },
  {
    id: 72,
    name: "Kitchener's Island",
    description: "Kitchener's Island, also known as Botanical Island, is a small island in the Nile near Aswan featuring beautiful botanical gardens with exotic plants from around the world. The island was given to Lord Kitchener who transformed it into a botanical paradise. It's accessible by felucca and offers peaceful walks among rare plants.",
    region: "Aswan",
    coverImage: abuSimbelSvg,
    category: "nature",
    shortDescription: "Botanical island with exotic plants and gardens",
    averageRating: 4.5,
    reviewCount: 820,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning or late afternoon",
    entryFee: {
      adult: "40 EGP",
      student: "20 EGP",
      notes: "Felucca transport additional"
    }
  },
  {
    id: 73,
    name: "Blue Hole Dahab",
    description: "The Blue Hole is a world-famous diving site near Dahab, known for its deep blue circular reef formation. This natural wonder drops to over 100 meters and offers spectacular underwater scenery with coral formations and marine life. It's considered one of the most beautiful and challenging dive sites in the world.",
    region: "Sinai",
    coverImage: redSeaSvg,
    category: "adventure",
    shortDescription: "World-famous deep diving site with spectacular reefs",
    averageRating: 4.8,
    reviewCount: 1450,
    visitDuration: "Half day",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Diving packages vary by operator"
    }
  },
  {
    id: 74,
    name: "Colored Canyon",
    description: "The Colored Canyon near Nuweiba is a natural wonder featuring narrow passages between multicolored sandstone walls. The canyon's walls display amazing patterns and colors created by millions of years of geological processes. It offers an easy hiking experience through stunning natural rock formations.",
    region: "Sinai",
    coverImage: redSeaSvg,
    category: "nature",
    shortDescription: "Natural canyon with multicolored sandstone walls",
    averageRating: 4.7,
    reviewCount: 680,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "October to April",
    entryFee: {
      adult: "50 EGP",
      student: "25 EGP"
    }
  },
  {
    id: 75,
    name: "National Museum of Egyptian Civilization",
    description: "The National Museum of Egyptian Civilization (NMEC) in Fustat showcases Egypt's rich heritage from prehistoric times to the present day. The museum features the Royal Mummies Hall, displaying 22 royal mummies in a specially designed environment, along with artifacts representing different periods of Egyptian civilization.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Comprehensive museum showcasing Egyptian civilization",
    averageRating: 4.7,
    reviewCount: 1320,
    visitDuration: "3-4 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "200 EGP",
      student: "100 EGP",
      notes: "Royal Mummies Hall: additional 100 EGP"
    }
  },
  {
    id: 76,
    name: "Giftun Island",
    description: "Giftun Island near Hurghada is a protected marine reserve known for its pristine beaches, crystal-clear waters, and vibrant coral reefs. The island offers excellent snorkeling and diving opportunities, with diverse marine life including colorful fish, dolphins, and sea turtles. It's accessible by boat trips from Hurghada.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Protected marine reserve with pristine beaches",
    averageRating: 4.8,
    reviewCount: 1680,
    visitDuration: "Full day",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Boat trip packages vary by operator"
    }
  },
  {
    id: 77,
    name: "Abu Dabbab Beach",
    description: "Abu Dabbab Beach near Marsa Alam is famous for its resident population of sea turtles and dugongs (sea cows). This pristine beach offers excellent snorkeling opportunities in shallow, clear waters with seagrass beds that attract these gentle marine mammals. It's one of the few places in the world where you can swim with dugongs.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Famous beach for swimming with sea turtles and dugongs",
    averageRating: 4.9,
    reviewCount: 920,
    visitDuration: "Half to full day",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Beach access and snorkeling gear rental vary"
    }
  },
  {
    id: 78,
    name: "Makadi Bay",
    description: "Makadi Bay is a luxury resort destination south of Hurghada, known for its pristine beaches, crystal-clear waters, and world-class resorts. The bay offers excellent snorkeling and diving opportunities, with beautiful coral reefs and diverse marine life. It's perfect for families and luxury travelers seeking a peaceful Red Sea experience.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Luxury resort bay with pristine beaches and coral reefs",
    averageRating: 4.7,
    reviewCount: 1450,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Resort-based destination"
    }
  },
  {
    id: 79,
    name: "Soma Bay",
    description: "Soma Bay is an exclusive peninsula resort destination featuring luxury hotels, championship golf courses, and pristine beaches. The bay offers world-class diving sites, kitesurfing conditions, and spa facilities. It's known for its upscale atmosphere and stunning Red Sea views.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Exclusive peninsula with luxury resorts and golf",
    averageRating: 4.8,
    reviewCount: 980,
    visitDuration: "3-7 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Resort-based destination"
    }
  },
  {
    id: 80,
    name: "Safaga",
    description: "Safaga is a port city and resort destination known for its therapeutic black sand beaches and excellent windsurfing conditions. The city offers unique diving sites with pristine coral reefs and is famous for its medical tourism due to the healing properties of its sand and climate.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Port city with therapeutic black sand beaches",
    averageRating: 4.5,
    reviewCount: 720,
    visitDuration: "2-5 days",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Varies by beach and resort"
    }
  },
  {
    id: 81,
    name: "Mahmya Island",
    description: "Mahmya Island is a pristine island paradise in the Red Sea, part of the Giftun Island National Park. The island features white sandy beaches, turquoise waters, and vibrant coral reefs. It's accessible only by boat and offers a perfect day trip experience with snorkeling, swimming, and relaxation.",
    region: "Red Sea",
    coverImage: redSeaSvg,
    category: "beach",
    shortDescription: "Pristine island paradise with white sandy beaches",
    averageRating: 4.9,
    reviewCount: 1280,
    visitDuration: "Full day",
    bestTimeToVisit: "Year-round, best October to April",
    entryFee: {
      notes: "Day trip packages vary by operator"
    }
  },
  {
    id: 82,
    name: "Great Sand Sea",
    description: "The Great Sand Sea is a vast sand desert shared between Egypt and Libya, featuring some of the world's largest sand dunes. This remote wilderness offers incredible desert landscapes, fossil discoveries, and opportunities for extreme desert adventures. It's one of the most pristine desert environments on Earth.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Vast sand desert with world's largest dunes",
    averageRating: 4.8,
    reviewCount: 420,
    visitDuration: "2-4 days",
    bestTimeToVisit: "October to March",
    entryFee: {
      notes: "Guided expeditions required"
    }
  },
  {
    id: 83,
    name: "Gilf Kebir National Park",
    description: "Gilf Kebir is a remote plateau in the Western Desert featuring prehistoric rock art, dramatic landscapes, and the famous Cave of Swimmers. This UNESCO World Heritage site inspired the novel 'The English Patient' and offers some of the most spectacular desert scenery in Egypt.",
    region: "Western Desert",
    coverImage: pyramidsSvg,
    category: "nature",
    shortDescription: "Remote plateau with prehistoric rock art",
    averageRating: 4.9,
    reviewCount: 180,
    visitDuration: "3-5 days",
    bestTimeToVisit: "October to March",
    entryFee: {
      notes: "Specialized expedition required"
    }
  },
  {
    id: 84,
    name: "Wadi El Natrun Monasteries",
    description: "Wadi El Natrun is home to four ancient Coptic monasteries that have been centers of Christian monasticism for over 1,500 years. The monasteries of St. Bishoy, St. Macarius, Paromeos, and Suriani feature ancient churches, libraries with rare manuscripts, and continue to house active monastic communities.",
    region: "Wadi El Natrun",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Ancient Coptic monasteries in the desert",
    averageRating: 4.6,
    reviewCount: 580,
    visitDuration: "Half day",
    bestTimeToVisit: "Weekday mornings",
    entryFee: {
      notes: "Free, donations appreciated"
    }
  },
  {
    id: 85,
    name: "Saint Paul Monastery",
    description: "The Monastery of Saint Paul the Anchorite is one of the oldest monasteries in the world, founded in the 4th century. Located in the Eastern Desert near the Red Sea, it features ancient churches, a spring, and beautiful wall paintings. The monastery continues to house Coptic monks and maintains its spiritual traditions.",
    region: "Eastern Desert",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "One of the world's oldest monasteries",
    averageRating: 4.7,
    reviewCount: 420,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Weekday mornings",
    entryFee: {
      notes: "Free, donations appreciated"
    }
  },
  {
    id: 86,
    name: "Fortress of Babylon",
    description: "The Fortress of Babylon is an ancient Roman fortress in Old Cairo, built around 30 BCE. The fortress served as the foundation for the development of Coptic Cairo and houses several ancient churches within its walls. It represents the Roman military presence in ancient Egypt.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Ancient Roman fortress in Old Cairo",
    averageRating: 4.3,
    reviewCount: 680,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "60 EGP",
      student: "30 EGP"
    }
  },
  {
    id: 87,
    name: "Abu Mena",
    description: "Abu Mena is an ancient Christian pilgrimage site and UNESCO World Heritage Site near Alexandria. The ruins include a basilica, baptistery, and monastery complex built around the tomb of Saint Menas. Though partially in ruins, it remains an important archaeological site representing early Christian Egypt.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "religious",
    shortDescription: "Ancient Christian pilgrimage site and UNESCO site",
    averageRating: 4.4,
    reviewCount: 320,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP"
    }
  },
  {
    id: 88,
    name: "Greco-Roman Museum",
    description: "The Greco-Roman Museum in Alexandria houses one of the world's finest collections of Greco-Roman artifacts from Egypt. The museum features statues, mosaics, coins, and everyday objects that illustrate the blend of Egyptian, Greek, and Roman cultures during the Ptolemaic and Roman periods.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Finest collection of Greco-Roman artifacts",
    averageRating: 4.5,
    reviewCount: 890,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 89,
    name: "Ras El-Tin Palace",
    description: "Ras El-Tin Palace is a historic royal palace in Alexandria that served as the summer residence of Egyptian royalty. Built in the 19th century, the palace features beautiful architecture, gardens, and historical significance as the place where King Farouk abdicated. It offers insights into Egypt's modern royal history.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Historic royal palace with beautiful architecture",
    averageRating: 4.4,
    reviewCount: 520,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 90,
    name: "Museum of Islamic Art",
    description: "The Museum of Islamic Art in Cairo houses one of the world's finest collections of Islamic artifacts, spanning from the 7th to the 19th centuries. The museum features manuscripts, ceramics, textiles, metalwork, and architectural elements from various Islamic periods and regions.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "World's finest collection of Islamic artifacts",
    averageRating: 4.6,
    reviewCount: 1120,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 91,
    name: "Gayer-Anderson Museum",
    description: "The Gayer-Anderson Museum is housed in two adjoining 17th-century houses near the Ibn Tulun Mosque. The museum showcases Islamic domestic architecture and houses a collection of furniture, carpets, and artifacts collected by Major Gayer-Anderson. It offers a glimpse into traditional Islamic Cairo lifestyle.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Traditional Islamic houses with period furnishings",
    averageRating: 4.5,
    reviewCount: 780,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP"
    }
  },
  {
    id: 92,
    name: "Luxor Museum",
    description: "Luxor Museum houses a superb collection of artifacts from the Theban temples and necropolis. The museum features beautifully displayed statues, reliefs, and artifacts from Luxor Temple, Karnak, and the Valley of the Kings, including items from Tutankhamun's tomb and the mummy of Ramesses I.",
    region: "Luxor",
    coverImage: luxorSvg,
    category: "cultural",
    shortDescription: "Superb collection of Theban artifacts",
    averageRating: 4.7,
    reviewCount: 1450,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning or late afternoon",
    entryFee: {
      adult: "140 EGP",
      student: "70 EGP"
    }
  },
  {
    id: 93,
    name: "Nubian Museum",
    description: "The Nubian Museum in Aswan showcases the rich culture and history of Nubia, much of which was submerged by Lake Nasser. The museum features artifacts, traditional crafts, and exhibits about Nubian customs, architecture, and the impact of the High Dam on Nubian communities.",
    region: "Aswan",
    coverImage: abuSimbelSvg,
    category: "cultural",
    shortDescription: "Showcases rich Nubian culture and history",
    averageRating: 4.6,
    reviewCount: 920,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "140 EGP",
      student: "70 EGP"
    }
  },
  {
    id: 94,
    name: "Abdeen Palace Museum",
    description: "Abdeen Palace was the main royal residence of Egyptian rulers from the 1870s to the 1952 revolution. Now a museum, it displays royal collections including weapons, decorations, silverware, and historical documents. The palace represents the grandeur of Egypt's modern royal period.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Former royal palace with royal collections",
    averageRating: 4.4,
    reviewCount: 680,
    visitDuration: "2-3 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "100 EGP",
      student: "50 EGP"
    }
  },
  {
    id: 95,
    name: "Nilometer",
    description: "The Nilometer on Roda Island is an ancient device used to measure the Nile's water level, crucial for predicting flood levels and determining taxes in ancient Egypt. Dating from 861 CE, it's one of the oldest Islamic monuments in Cairo and represents the importance of the Nile in Egyptian civilization.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "historical",
    shortDescription: "Ancient device for measuring Nile water levels",
    averageRating: 4.2,
    reviewCount: 520,
    visitDuration: "30-45 minutes",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "40 EGP",
      student: "20 EGP"
    }
  },
  {
    id: 96,
    name: "Stanley Bridge",
    description: "Stanley Bridge is an iconic landmark in Alexandria, connecting the Stanley neighborhood with the Corniche. The modern bridge offers spectacular views of the Mediterranean Sea and Alexandria's coastline. It's particularly beautiful at sunset and has become a symbol of modern Alexandria.",
    region: "Alexandria",
    coverImage: pyramidsSvg,
    category: "urban",
    shortDescription: "Iconic modern bridge with Mediterranean views",
    averageRating: 4.3,
    reviewCount: 1280,
    visitDuration: "30 minutes",
    bestTimeToVisit: "Sunset",
    entryFee: {
      notes: "Free to visit"
    }
  },
  {
    id: 97,
    name: "Tombs of the Nobles",
    description: "The Tombs of the Nobles in Aswan contain the rock-cut tombs of ancient Egyptian governors and nobles who ruled the southern frontier. These tombs feature beautiful wall paintings depicting daily life, hunting scenes, and religious ceremonies, offering insights into ancient Egyptian provincial administration.",
    region: "Aswan",
    coverImage: abuSimbelSvg,
    category: "historical",
    shortDescription: "Rock-cut tombs of ancient governors with wall paintings",
    averageRating: 4.5,
    reviewCount: 620,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Early morning",
    entryFee: {
      adult: "80 EGP",
      student: "40 EGP"
    }
  },
  {
    id: 98,
    name: "Lake Nasser",
    description: "Lake Nasser is one of the world's largest artificial lakes, created by the Aswan High Dam. The lake offers spectacular scenery, fishing opportunities, and access to remote temples like Abu Simbel. Luxury cruise boats navigate the lake, providing a unique way to experience Nubian landscapes and ancient sites.",
    region: "Aswan",
    coverImage: abuSimbelSvg,
    category: "nature",
    shortDescription: "World's largest artificial lake with temple cruises",
    averageRating: 4.6,
    reviewCount: 850,
    visitDuration: "1-3 days (cruise)",
    bestTimeToVisit: "October to April",
    entryFee: {
      notes: "Cruise packages vary by operator"
    }
  },
  {
    id: 99,
    name: "Mahmoud Mokhtar Museum",
    description: "The Mahmoud Mokhtar Museum is dedicated to Egypt's most famous sculptor, known as the father of modern Egyptian sculpture. The museum displays Mokhtar's bronze and marble sculptures, including his famous 'Egypt's Renaissance' statue. It showcases the development of modern Egyptian art.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Museum of Egypt's most famous sculptor",
    averageRating: 4.3,
    reviewCount: 420,
    visitDuration: "1-2 hours",
    bestTimeToVisit: "Morning hours",
    entryFee: {
      adult: "60 EGP",
      student: "30 EGP"
    }
  },
  {
    id: 100,
    name: "Opera House Cairo",
    description: "The Cairo Opera House is Egypt's main performing arts venue, hosting opera, ballet, classical music, and traditional Egyptian performances. The modern complex includes multiple theaters and represents Egypt's commitment to cultural arts. It regularly features both international and local productions.",
    region: "Cairo",
    coverImage: pyramidsSvg,
    category: "cultural",
    shortDescription: "Egypt's premier performing arts venue",
    averageRating: 4.5,
    reviewCount: 1150,
    visitDuration: "2-4 hours (performance dependent)",
    bestTimeToVisit: "Evening performances",
    entryFee: {
      notes: "Varies by performance"
    }
  }
];

// Mock API function to fetch all destinations
export const fetchAllEgyptianSites = async (searchParams = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredSites = [...egyptianSites];

  // Apply search filter if provided
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredSites = filteredSites.filter(site =>
      site.name.toLowerCase().includes(searchTerm) ||
      site.description.toLowerCase().includes(searchTerm) ||
      site.region.toLowerCase().includes(searchTerm) ||
      site.category.toLowerCase().includes(searchTerm)
    );

    // Return all matching sites when searching
    return {
      data: filteredSites
    };
  }

  // Apply region filter if provided
  if (searchParams.region) {
    filteredSites = filteredSites.filter(site =>
      site.region.toLowerCase() === searchParams.region.toLowerCase()
    );
  }

  // Apply category filter if provided
  if (searchParams.category) {
    filteredSites = filteredSites.filter(site =>
      site.category.toLowerCase() === searchParams.category.toLowerCase()
    );
  }

  // If no search term but filters are applied, return all matching sites
  if (searchParams.region || searchParams.category) {
    return {
      data: filteredSites
    };
  }

  // If showAll is true, return all sites
  if (searchParams.showAll) {
    return {
      data: filteredSites
    };
  }

  // By default, return only the first 12 sites
  return {
    data: filteredSites.slice(0, 12)
  };
};

// Mock API function to fetch a destination by ID
export const fetchEgyptianSiteById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const site = egyptianSites.find(site => site.id === parseInt(id));

  if (!site) {
    throw new Error('Destination not found');
  }

  return {
    data: site
  };
};

// Function to get all destinations (for compatibility with removed services)
export const getAllDestinations = () => {
  return egyptianSites.slice(0, 12);
};

// Function to search destinations (for compatibility with removed services)
export const searchDestinations = (searchTerm) => {
  if (!searchTerm) {
    return getAllDestinations();
  }

  const term = searchTerm.toLowerCase();
  return egyptianSites.filter(dest =>
    dest.name.toLowerCase().includes(term) ||
    dest.description.toLowerCase().includes(term) ||
    dest.region.toLowerCase().includes(term) ||
    dest.category.toLowerCase().includes(term)
  );
};

// Function to get a destination by ID (for compatibility with removed services)
export const getDestinationById = (id) => {
  return egyptianSites.find(dest => dest.id === parseInt(id));
};

// Export the fetchDestinations and fetchDestinationById functions for compatibility with mockDataService
export const fetchDestinations = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    data: egyptianSites
  };
};

export const fetchDestinationById = async (id) => {
  return fetchEgyptianSiteById(id);
};
