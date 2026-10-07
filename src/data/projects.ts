export interface Project {
  slug: string;
  name: string;
  category: string;
  description: string;
  solved: string;
  built: string;
  result: string;
  challenge: string;
  solution: string;
  delivered: { title: string; desc: string }[];
  tech: string[];
  results: string[];
  image: string;
  gallery: string[];
  logoUrl?: string;
  liveUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "hatbusiness",
    name: "Hat Business",
    category: "Web Platform",
    description: "An award-winning children's podcast platform pairing mood-based story picks with real parenting insights.",
    solved: "Needed a playful children's podcast platform filled with imaginative stories to inspire curiosity.",
    built: "A Next.js and Firebase platform where kids pick a mood, get a matching story, and parents see what their child is listening to.",
    result: "Created a robust, responsive environment for young listeners and families — since recognized as an Australian Audio Award winner.",
    challenge: "The client wanted to create an engaging platform that inspires curiosity, courage, and creativity in young listeners through fun narratives and calming routines.",
    solution: "We designed and developed a custom podcast web application tailored for families and children, complete with a soothing and fun interface, mood-based story recommendations, and reliable audio streaming capabilities.",
    delivered: [
      { title: "Design & UX", desc: "Playful, kid-friendly interface." },
      { title: "Frontend", desc: "Next.js for blazing fast performance." },
      { title: "Backend", desc: "Firebase & Firestore NoSQL Database." },
      { title: "Streaming", desc: "Custom Audio Streaming integration." },
    ],
    tech: ["Next.js", "TypeScript", "Framer Motion", "Firebase", "Firestore"],
    results: [
      "Delivered a seamless and secure streaming environment",
      "Increased engagement time for young listeners",
      "Named an Australian Audio Award winner",
    ],
    image: "/projects/hatbusiness-min.png",
    gallery: ["/projects/hatbusiness-min.png"],
    logoUrl: "/projects/logos/hatbusiness.png",
    liveUrl: "https://www.hatbusiness.com.au",
  },
  {
    slug: "townsville-tight-ass",
    name: "Townsville Tight Ass",
    category: "Local Deals & Directory Platform",
    description: "A local deals, giveaways and directory platform helping Townsville residents live well for less.",
    solved: "Needed a single, always-fresh destination for local deals, giveaways, events, and business listings across Townsville and North Queensland.",
    built: "A fast, searchable Next.js and Firebase platform surfacing the best local offers, a ranked \"Top Deals\" leaderboard, giveaways, and a business directory in one place.",
    result: "Launched a daily-use local platform that rewards residents for engaging and gives local businesses a direct line to a ready-to-buy audience.",
    challenge: "The client needed a scalable platform connecting Townsville locals with the best deals, events, and services, while giving local businesses an easy way to list offers and reach customers directly.",
    solution: "We built a fast, mobile-first Next.js and Firebase platform with live local search, a ranked deals leaderboard, a giveaways ('Win') hub, a business directory, and a self-serve listing flow for merchants.",
    delivered: [
      { title: "Architecture", desc: "High-performance Next.js setup on Vercel." },
      { title: "Search & Discovery", desc: "Local search across deals, dining, and attractions." },
      { title: "Backend", desc: "Firebase for listings, deals, and member accounts." },
      { title: "Merchant Tools", desc: "Self-serve business listing and offer submission." },
    ],
    tech: ["Next.js", "Firebase", "Tailwind CSS", "TypeScript"],
    results: [
      "Launched a daily-use destination for local deals and giveaways",
      "Gave local businesses a direct, low-friction way to list offers",
    ],
    image: "/projects/townsvilletightass-min.png",
    gallery: ["/projects/townsvilletightass-min.png"],
    liveUrl: "https://www.townsvilletightass.com",
  },
  {
    slug: "nq-fishing-adventures",
    name: "NQ Fishing Adventures",
    category: "Booking System & Website",
    description: "A modern booking system and website designed for seamless trip planning.",
    solved: "Needed a modern, mobile-friendly website designed for seamless trip planning and high-resolution visuals.",
    built: "A high-performance marketing website with integrated trip planning and detailed service information.",
    result: "Improved user experience for browsing boat options and booking.",
    challenge: "The client needed a modern, mobile-friendly website to showcase detailed boat options, location highlights, and service information with high-resolution visuals.",
    solution: "We delivered a high-performance marketing website with an integrated trip planning system, utilizing Next.js for speed and Stripe for secure payments.",
    delivered: [
      { title: "Design", desc: "High-resolution visual showcase." },
      { title: "Frontend", desc: "Next.js & TailwindCSS." },
      { title: "Payments", desc: "Stripe integration for easy checkout." },
      { title: "Database", desc: "MongoDB for trip management." },
    ],
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "Stripe", "MongoDB"],
    results: [
      "Improved user experience for browsing boat options",
      "Increased direct bookings and lead generation",
    ],
    image: "/projects/nqfishing-min.png",
    gallery: ["/projects/nqfishing-min.png"],
    liveUrl: "https://www.nqfishingadventures.com",
  },
  {
    slug: "care4many",
    name: "Care4Many Support & Services",
    category: "Business Website",
    description: "A compassionate, booking-ready website for a Townsville NDIS and DVA support services provider.",
    solved: "Needed a professional, trustworthy online presence where NDIS and DVA clients could learn about services and book support directly.",
    built: "A clean Next.js website presenting each care service clearly, with a per-service \"Book this service\" flow and direct contact details.",
    result: "Gave the business a credible digital front door that turns service browsing straight into bookings and enquiries.",
    challenge: "The business needed to clearly explain personal care, domestic assistance, and NDIS/DVA support services to families and participants, while making it easy to book or enquire without picking up the phone.",
    solution: "We designed and built a warm, accessible Next.js website structured around each service line — personal support, community access, domestic assistance, and compassionate care — with a simple booking and contact flow for every service.",
    delivered: [
      { title: "Design & UX", desc: "Warm, accessible, trust-building interface." },
      { title: "Frontend", desc: "Next.js for speed and SEO." },
      { title: "Service Pages", desc: "Clear breakdown of NDIS & DVA offerings." },
      { title: "Booking", desc: "Per-service \"Book this service\" flow." },
    ],
    tech: ["Next.js", "Tailwind CSS", "TypeScript"],
    results: [
      "Gave NDIS and DVA clients a clear, direct way to book services",
      "Elevated the brand's trust and professionalism online",
    ],
    image: "/projects/care4many-min.png",
    gallery: ["/projects/care4many-min.png"],
    liveUrl: "https://www.care4many.com.au",
  },
  {
    slug: "bwg-colman-radio",
    name: "BWG Colman Radio",
    category: "Community Radio Web",
    description: "A community-focused radio station broadcasting from Palm Island.",
    solved: "Needed a digital presence for a community-focused radio station broadcasting from Palm Island.",
    built: "A site offering live streaming of local news, music, and Indigenous content at 97.3 FM.",
    result: "Successfully connected the remote audience through live stream.",
    challenge: "The community needed a reliable digital platform to live stream local news, music, and Indigenous content to its audience.",
    solution: "We designed a modern, accessible website with an integrated live streaming player and responsive design.",
    delivered: [
      { title: "Streaming", desc: "Live radio stream integration." },
      { title: "UX/UI Design", desc: "Accessible, community-focused." },
      { title: "Responsive Web", desc: "Works on all modern devices." },
    ],
    tech: ["Live Stream", "Responsive Design", "Next.js"],
    results: [
      "Expanded community reach beyond local FM range",
      "Simplified content consumption for the audience",
    ],
    image: "/projects/bwgcolmanradio-min.png",
    gallery: ["/projects/bwgcolmanradio-min.png"],
    logoUrl: "/projects/logos/bwgcolman-logo.png",
    liveUrl: "https://www.bwgcolmanradio.com.au",
  },
  {
    slug: "spotto",
    name: "SPOTTO!",
    category: "Interactive Web App",
    description: "An online interactive platform for score keeping and challenges.",
    solved: "Needed an online interactive platform where users can keep score and compete in fun challenges.",
    built: "A real-time scoring system with responsive UI to crown the ultimate SPOTTO champion.",
    result: "Created an engaging competitive experience for users.",
    challenge: "Users needed a platform to keep score, settle arguments, and compete in fun challenges with friends.",
    solution: "We developed an interactive web application with a real-time scoring system to crown the ultimate SPOTTO champion.",
    delivered: [
      { title: "Interactive UI", desc: "Playful, engaging interface." },
      { title: "Real-Time Logic", desc: "Scoring and challenge system." },
      { title: "Responsive", desc: "Optimized for mobile use on the go." },
    ],
    tech: ["Interactive Web App", "Real-Time Scoring", "Responsive UI"],
    results: [
      "Created a highly engaging competitive experience",
      "Achieved rapid user adoption for fun challenges",
    ],
    image: "/projects/spotto-min.png",
    gallery: ["/projects/spotto-min.png"],
    logoUrl: "/projects/logos/spotto.jpeg",
    liveUrl: "https://www.spotto.online",
  },
  {
    slug: "tsv-alterations",
    name: "TSV Alterations & Formal Wear",
    category: "Business Website",
    description: "A professional online presence for a trusted Townsville tailoring service.",
    solved: "Needed a professional online presence for a trusted Townsville-based tailoring service.",
    built: "A modern Next.js and Firebase website highlighting alteration offerings and formal wear rentals.",
    result: "Streamlined the booking process for local customers.",
    challenge: "The business needed to modernize its online presence to better highlight alteration offerings, formal wear rentals, and appointment booking.",
    solution: "We built a clean, professional website utilizing Next.js and Firebase to handle their service listings and customer inquiries.",
    delivered: [
      { title: "Design", desc: "Elegant, professional aesthetic." },
      { title: "Frontend", desc: "Next.js for speed and SEO." },
      { title: "Backend", desc: "Firebase for form handling." },
      { title: "Booking", desc: "Integrated appointment system." },
    ],
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
    results: [
      "Elevated the brand's digital presence",
      "Streamlined customer inquiries and appointments",
    ],
    image: "/projects/tsvalteration-min.png",
    gallery: ["/projects/tsvalteration-min.png"],
    liveUrl: "https://www.tsvalterationsandformalwear.com",
  },
  {
    slug: "nq-interiors",
    name: "NQ Interiors",
    category: "Portfolio Website",
    description: "A sophisticated platform showcasing elegant interior design.",
    solved: "Needed to showcase elegant interior design through a sophisticated and user-friendly platform.",
    built: "A Next.js website with high-quality visual galleries and immersive project showcases.",
    result: "Delivered a premium digital experience reflecting their design quality.",
    challenge: "The client needed a platform with an emphasis on high-quality visuals to offer an immersive experience for browsing design projects.",
    solution: "We developed a sophisticated, user-friendly website using Next.js and Cloudinary for optimized image delivery.",
    delivered: [
      { title: "Visual Design", desc: "High-end, immersive aesthetic." },
      { title: "Media Hosting", desc: "Cloudinary image optimization." },
      { title: "Frontend", desc: "Smooth navigation and galleries." },
    ],
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "Cloudinary"],
    results: [
      "Showcased projects with stunning clarity and speed",
      "Enhanced the agency's premium brand positioning",
    ],
    image: "/projects/nqinterior-min.png",
    gallery: ["/projects/nqinterior-min.png"],
    logoUrl: "/projects/logos/nqinteriors-logo.png",
    liveUrl: "https://www.nqinteriors.com.au",
  },
  {
    slug: "huntrix",
    name: "Huntrix",
    category: "Real-Time Chat Platform",
    description: "A real-time messaging platform for live, multi-user conversations.",
    solved: "Needed a real-time chat platform where users can message, share media, and connect live.",
    built: "A Next.js application handling live text, voice notes, and file sharing between multiple concurrent users.",
    result: "Delivered a working real-time messaging experience for an active user base.",
    challenge: "The client needed a real-time communication platform supporting live chat, media sharing, and multi-user presence.",
    solution: "We built a Next.js application with live messaging, voice/video call controls, file and emoji support, and online presence tracking.",
    delivered: [
      { title: "Real-Time Messaging", desc: "Live chat between multiple users." },
      { title: "Media Sharing", desc: "Picture, GIF, video, and file support." },
      { title: "Presence", desc: "Online/registered user tracking." },
      { title: "Frontend", desc: "Next.js application." },
    ],
    tech: ["Next.js", "TypeScript", "Real-Time Messaging"],
    results: [
      "Delivered a functioning real-time chat experience",
      "Supported concurrent multi-user conversations",
    ],
    image: "/projects/huntrix-min.png",
    gallery: ["/projects/huntrix-min.png"],
    liveUrl: "https://www.huntrix.com",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
