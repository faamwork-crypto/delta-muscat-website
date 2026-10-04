/**
 * Centralized product category architecture (Phase 1).
 *
 * Single source of truth for the Residential / Commercial / Urban Structures
 * taxonomy and all of their subcategories. Navigation, category overview
 * pages and the dynamic subcategory template all read from this file — never
 * hardcode category names in components or pages.
 *
 * All company claims stay within verified facts (in-house design & engineering,
 * own factory in Rusayl, own installation crews, steel & aluminium, powder
 * coating and fabric finishes). No specifications, certifications or projects
 * are invented here.
 *
 * Slugs are shared between locales (the site's existing routing convention —
 * e.g. /en/solutions/pergolas and /ar/solutions/pergolas). The locale prefix
 * alone switches the language, so no separate Arabic slugs are required.
 */

import type { Locale } from "@/i18n/config";

export type CategoryId = "residential" | "commercial" | "urban-structures";

export type LocaleText = { en: string; ar: string };

export type Subcategory = {
  /** Unique id across the whole taxonomy. */
  id: string;
  /** Parent category id. */
  categoryId: CategoryId;
  /** URL slug (shared between locales). */
  slug: string;
  name: LocaleText;
  short: LocaleText;
  /** 1-based display order within the parent category. */
  order: number;
  active: boolean;
  /** Optional image path (BASE-prefixed). Undefined → pattern fallback. */
  image?: string;
};

export type Category = {
  id: CategoryId;
  /** URL slug (shared between locales). */
  slug: string;
  name: LocaleText;
  short: LocaleText;
  /** 1-based display order. */
  order: number;
  active: boolean;
  /** Optional hero/card image (BASE-prefixed). Undefined → pattern fallback. */
  image?: string;
  subcategories: Subcategory[];
};

type RawSubcategory = Omit<Subcategory, "id" | "categoryId" | "order" | "active"> & {
  image?: string;
};

type RawCategory = Omit<Category, "subcategories" | "order" | "active"> & {
  subcategories: RawSubcategory[];
};

const withBase = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;

const RAW_CATEGORIES: RawCategory[] = [
  {
    id: "residential",
    slug: "residential",
    name: { en: "Residential", ar: "السكني" },
    short: {
      en: "Custom steel and aluminium structures for villas and private homes — designed, manufactured and installed by our own teams.",
      ar: "منشآت حديد وألمنيوم مخصصة للفلل والمنازل الخاصة — تصميمًا وتصنيعًا وتركيبًا بفرقنا الخاصة.",
    },
    image: withBase("/images/photos/pergola-villa.webp"),
    subcategories: [
      {
        slug: "doors-windows",
        name: { en: "Doors & Windows", ar: "الأبواب والنوافذ" },
        short: {
          en: "Aluminium doors and window systems, powder-coated and glazed to suit each elevation.",
          ar: "أنظمة أبواب ونوافذ ألمنيوم بتشطيبات مطرقية وزجاج يناسب كل واجهة.",
        },
      },
      {
        slug: "sliding-folding-doors",
        name: { en: "Sliding & Folding Doors", ar: "الأبواب المنزلقة والقابلة للطي" },
        short: {
          en: "Wide-span sliding and folding door systems that open interior spaces to the outdoors.",
          ar: "أنظمة أبواب منزلقة وقابلة للطي بامتدادات واسعة تفتح المساحات الداخلية على الخارج.",
        },
      },
      {
        slug: "pergolas",
        name: { en: "Pergolas", ar: "البرجولات" },
        short: {
          en: "Louvred, fixed-roof and fabric pergolas for terraces, rooftops and poolside living.",
          ar: "برجولات بشرائح دوّارة وأسقف ثابتة وقماشية للشرفات والأسطح ومسابح المنازل.",
        },
        image: withBase("/images/photos/pergola-pool.webp"),
      },
      {
        slug: "carports",
        name: { en: "Carports", ar: "مظلات السيارات" },
        short: {
          en: "Cantilever and T-type carport shades engineered for daily sun and heat.",
          ar: "مظلات سيارات كابولية وطراز T مُهندَسة لشمس وحرارة كل يوم.",
        },
        image: withBase("/images/solutions/parking-shades.svg"),
      },
      {
        slug: "terrace-awnings",
        name: { en: "Terrace Awnings", ar: "مظلات الشرفات" },
        short: {
          en: "Fixed and retractable awnings that make terraces usable through the hottest hours.",
          ar: "مظلات ثابتة وسحابية تجعل الشرفات صالحة للاستخدام في ساعات الذروة الحارة.",
        },
      },
      {
        slug: "swimming-pool-shades",
        name: { en: "Swimming Pool Shades", ar: "مظلات المسابح" },
        short: {
          en: "Poolside shade sails and canopies resistant to sun, chlorine and coastal air.",
          ar: "أشرعة ومظلات مسابح مقاومة للشمس والكلور وجو السواحل.",
        },
      },
      {
        slug: "balconies-railings",
        name: { en: "Balconies & Railings", ar: "درابزين الشرفات والبلكونات" },
        short: {
          en: "Steel and aluminium railings and balcony structures in modern or classic lines.",
          ar: "درابزين وهياكل شرفات من الحديد والألمنيوم بخطوط حديثة أو كلاسيكية.",
        },
      },
      {
        slug: "staircases",
        name: { en: "Staircases", ar: "السلالم المعدنية" },
        short: {
          en: "Custom steel staircases — straight, spiral and cantilevered — with safe, precise fabrication.",
          ar: "سلالم حديدية مخصصة — مستقيمة وحلزونية وكابولية — بتصنيع دقيق وآمن.",
        },
      },
      {
        slug: "gates-fences",
        name: { en: "Gates & Fences", ar: "البوابات والأسوار" },
        short: {
          en: "Sliding, swing and fixed gates and boundary fences built to structural standards.",
          ar: "بوابات انزلاقية ودفاعية وأسوار ثابتة مبنية وفق المعايير الإنشائية.",
        },
      },
      {
        slug: "security-screens",
        name: { en: "Security Screens & Doors", ar: "الحواجز والأبواب الأمنية" },
        short: {
          en: "Protective screens and reinforced doors that keep entrances open to light, not risk.",
          ar: "حواجز واقية وأبواب معززة تحافظ على إدخال الضوء مع حماية المداخل.",
        },
      },
      {
        slug: "mosquito-screens",
        name: { en: "Mosquito Screens", ar: "شبك الحشرات" },
        short: {
          en: "Fine mesh screens for windows and doors — ventilation without insects.",
          ar: "شبك دقيق للنوافذ والأبواب — تهوية كاملة دون حشرات.",
        },
      },
      {
        slug: "skylights",
        name: { en: "Skylights", ar: "النوافذ السقفية" },
        short: {
          en: "Rooflight structures that bring daylight into interiors while managing heat.",
          ar: "هياكل نوافذ سقفية تدخل ضوء النهار إلى الداخل مع التحكم بالحرارة.",
        },
      },
      {
        slug: "facade-cladding",
        name: { en: "Facade Cladding", ar: "كسر الواجهات" },
        short: {
          en: "Aluminium and composite cladding that gives villa facades a clean, durable skin.",
          ar: "كسرة ألمنيوم ومركبة تمنح واجهات الفلل مظهرًا نظيفًا ودائمًا.",
        },
      },
      {
        slug: "mashrabiya-screens",
        name: { en: "Mashrabiya & Privacy Screens", ar: "المشربيات وحواجز الخصوصية" },
        short: {
          en: "Laser-cut privacy screens in geometric and mashrabiya-inspired patterns.",
          ar: "حواجز خصوصية مقطوعة بالليزر بأنماط هندسية ومستوحاة من المشربية.",
        },
      },
      {
        slug: "garden-structures",
        name: { en: "Garden Structures", ar: "هياكل الحدائق" },
        short: {
          en: "Arches, frames and garden features in powder-coated steel and aluminium.",
          ar: "أقواس وهياكل وعناصر حدائق من الحديد والألمنيوم المطروق.",
        },
      },
      {
        slug: "rooftop-terraces",
        name: { en: "Rooftop Terrace Structures", ar: "مظلات أسطح المنازل" },
        short: {
          en: "Lightweight rooftop shade and pergola structures engineered for wind and exposure.",
          ar: "هياكل ظل وبرجولات خفيفة للأسطح مُهندَسة للرياح والتعرض المباشر.",
        },
      },
      {
        slug: "outdoor-kitchens",
        name: { en: "Outdoor Kitchens & BBQ Areas", ar: "المطابخ ومناطق الشواء الخارجية" },
        short: {
          en: "Counter structures and canopies for outdoor cooking and majlis-style gathering.",
          ar: "هياكل كاونترات ومظلات للطهي الخارجي وجلسات المجالس.",
        },
      },
      {
        slug: "wardrobe-cabinets",
        name: { en: "Wardrobes & Cabinets", ar: "الدواليب والخزائن" },
        short: {
          en: "Aluminium wardrobes and cabinet systems — moisture-proof and made to measure.",
          ar: "دواليب وخزائن ألمنيوم مقاومة للرطوبة ومصنوعة حسب المقاس.",
        },
      },
      {
        slug: "room-partitions",
        name: { en: "Room Partitions", ar: "قواطف الغرف" },
        short: {
          en: "Aluminium and glass partitions that divide interiors without darkening them.",
          ar: "قواطف ألمنيوم وزجاج تقسم المساحات الداخلية دون إظلامها.",
        },
      },
    ],
  },

  {
    id: "commercial",
    slug: "commercial",
    name: { en: "Commercial", ar: "التجاري" },
    short: {
      en: "Facade systems, canopies and structures for retail, offices, hospitality and industry — built for repeatable quality and realistic timelines.",
      ar: "أنظمة واجهات ومظلات ومنشآت للمتاجر والمكاتب والضيافة والصناعة — بجودة قابلة للتكرار وجداول زمنية واقعية.",
    },
    image: withBase("/images/photos/showroom-office.webp"),
    subcategories: [
      {
        slug: "shopfronts",
        name: { en: "Shopfronts", ar: "واجهات المحلات" },
        short: {
          en: "Aluminium and glass shopfronts that present retail spaces clearly and safely.",
          ar: "واجهات محلات ألمنيوم وزجاج تعرض المساحات التجارية بوضوح وأمان.",
        },
      },
      {
        slug: "curtain-walls",
        name: { en: "Curtain Walls", ar: "الجدران الساترية" },
        short: {
          en: "Framed curtain walling for building elevations, installed to approved technical drawings.",
          ar: "جدران ساترية مؤطرة لواجهات المباني، تُركّب وفق رسومات فنية معتمدة.",
        },
      },
      {
        slug: "glass-facades",
        name: { en: "Glass Facades", ar: "الواجهات الزجاجية" },
        short: {
          en: "Glazed facade systems balanced for daylight, heat and appearance.",
          ar: "أنظمة واجهات زجاجية متوازنة بين ضوء النهار والحرارة والمظهر.",
        },
      },
      {
        slug: "aluminium-cladding",
        name: { en: "Aluminium Composite Cladding", ar: "كسرة الألمنيوم المركبة" },
        short: {
          en: "Composite panel cladding fabricated and fixed with controlled tolerances.",
          ar: "كسرة ألواح مركبة تُصنّع وتُثبّت بتفاوتات مضبوطة.",
        },
      },
      {
        slug: "brise-soleil",
        name: { en: "Brise-Soleil & Sunscreens", ar: "المظلات المعمارية وواقيات الشمس" },
        short: {
          en: "Fixed and operable solar shading that rhythm building elevations.",
          ar: "واقيات شمس ثابتة وقابلة للحركة تمنح الواجهات إيقاعًا معماريًا.",
        },
      },
      {
        slug: "office-partitions",
        name: { en: "Office Partitions", ar: "قواطف المكاتب" },
        short: {
          en: "Aluminium and glass office partitioning — modular, tidy and reconfigurable.",
          ar: "قواطف مكاتب ألمنيوم وزجاج — معيارية ومرتبة وقابلة لإعادة التشكيل.",
        },
      },
      {
        slug: "entrance-canopies",
        name: { en: "Entrance Canopies", ar: "مظلات المداخل" },
        short: {
          en: "Canopies that give building entrances presence and protect the arrival line.",
          ar: "مظلات تمنح مداخل المباني حضورًا وتحمي خط الوصول.",
        },
      },
      {
        slug: "drop-off-canopies",
        name: { en: "Drop-off Canopies", ar: "مظلات مناطق النزول" },
        short: {
          en: "Covered drop-off structures for hotels, offices and hospitals.",
          ar: "مظلات مناطق نزول الركاب للفنادق والمكاتب والمستشفيات.",
        },
      },
      {
        slug: "walkway-covers",
        name: { en: "Walkway Covers", ar: "أغطية الممرات" },
        short: {
          en: "Continuous covered walkways linking buildings and parking areas.",
          ar: "ممرات مغطاة متصلة تربط المباني بمواقف السيارات.",
        },
      },
      {
        slug: "parking-canopies",
        name: { en: "Parking Canopies", ar: "مظلات المواقف" },
        short: {
          en: "Cantilever, T-type and multi-bay parking canopies for commercial sites.",
          ar: "مظلات مواقف كابولية وطراز T ومتعددة الأحواض للمواقع التجارية.",
        },
      },
      {
        slug: "restaurant-terraces",
        name: { en: "Restaurant & Café Terraces", ar: "تراسات المطاعم والمقاهي" },
        short: {
          en: "Pergolas and shade for outdoor dining that performs at noon and looks right at dusk.",
          ar: "برجولات ومظلات للجلوس الخارجي تعمل وقت الظهيرة وتبدو أنيقة وقت الغروب.",
        },
      },
      {
        slug: "hotel-poolside",
        name: { en: "Hotel Poolside Structures", ar: "منشآت مسابح الفنادق" },
        short: {
          en: "Pool and beach shade engineered for high-traffic hospitality use.",
          ar: "مظلات مسابح وشواطئ مُهندَسة للاستخدام الفندقي عالي الحركة.",
        },
      },
      {
        slug: "resort-shade",
        name: { en: "Resort Shade Structures", ar: "منشآت الظل للمنتجعات" },
        short: {
          en: "Sails and canopies shaped to resort landscapes and brand character.",
          ar: "أشرعة ومظلات تتشكل مع بيئة المنتجع وشخصية العلامة.",
        },
      },
      {
        slug: "mall-kiosks",
        name: { en: "Mall Kiosks & Fit-outs", ar: "أكشاك المجمعات التجارية" },
        short: {
          en: "Kiosk structures and metal fit-out elements for retail interiors.",
          ar: "هياكل أكشاك وعناصر معدنية لتجهيز المساحات التجارية الداخلية.",
        },
      },
      {
        slug: "showroom-structures",
        name: { en: "Showroom Structures", ar: "منشآت الصالات التجارية" },
        short: {
          en: "Feature structures and displays that organise showroom space.",
          ar: "هياكل مميزة وعناصر عرض تنظّم مساحات الصالات التجارية.",
        },
      },
      {
        slug: "warehouse-sheds",
        name: { en: "Warehouse Sheds", ar: "سقوف المستودعات" },
        short: {
          en: "Steel shed roofs for storage and logistics spaces, engineered for span.",
          ar: "سقوف مستودعات حديدية للمخازن ومساحات اللوجستيات، مُهندَسة للامتدادات.",
        },
      },
      {
        slug: "industrial-sheds",
        name: { en: "Industrial Sheds", ar: "المباني الصناعية" },
        short: {
          en: "Steel industrial buildings and extensions produced on a factory-controlled schedule.",
          ar: "مبانٍ وإضافات صناعية حديدية تُنتج بجدول مضبوط داخل المصنع.",
        },
      },
      {
        slug: "factory-canopies",
        name: { en: "Factory Canopies", ar: "مظلات المصانع" },
        short: {
          en: "Canopies over plant yards, equipment and staff areas.",
          ar: "مظلات فوق ساحات المصانع والمعدات ومناطق العاملين.",
        },
      },
      {
        slug: "loading-bay-covers",
        name: { en: "Loading Bay Covers", ar: "أغطية مناطق التحميل" },
        short: {
          en: "Covered loading and service bays that keep goods moving in full sun.",
          ar: "أحواض تحميل وخدمة مغطاة تُبقي حركة البضائع مستمرة تحت الشمس.",
        },
      },
      {
        slug: "exhibition-structures",
        name: { en: "Exhibition Structures", ar: "منشآت المعارض" },
        short: {
          en: "Custom frames and pavilions for exhibitions and public events.",
          ar: "هياكل وأجنحة مخصصة للمعارض والفعاليات العامة.",
        },
      },
      {
        slug: "stadium-stands",
        name: { en: "Stadium Seating Covers", ar: "مظلات مدرجات الملاعب" },
        short: {
          en: "Grandstand shade structures spanning spectator rows.",
          ar: "منشآت ظل للمدرجات تمتد فوق صفوف المتفرجين.",
        },
      },
      {
        slug: "school-canopies",
        name: { en: "School Canopies", ar: "مظلات المدارس" },
        short: {
          en: "Shade for schoolyards, assembly areas and waiting zones.",
          ar: "مظلات لساحات المدارس ومناطق التجمع والانتظار.",
        },
      },
      {
        slug: "university-structures",
        name: { en: "University & Campus Structures", ar: "منشآت الجامعات والحرم التعليمي" },
        short: {
          en: "Walkway and courtyard shade for campuses and educational facilities.",
          ar: "مظلات ممرات وساحات للحرم الجامعي والمنشآت التعليمية.",
        },
      },
      {
        slug: "hospital-walkways",
        name: { en: "Hospital Walkway Covers", ar: "ممرات المستشفيات المغطاة" },
        short: {
          en: "Protected patient and visitor routes between hospital buildings.",
          ar: "مسارات مغطاة للمرضى والزوار بين مباني المستشفيات.",
        },
      },
      {
        slug: "mosque-shade",
        name: { en: "Mosque Courtyard Shade", ar: "مظلات ساحات المساجد" },
        short: {
          en: "Courtyard and ablution-area shade designed with respect for mosque architecture.",
          ar: "مظلات ساحات ومناطق وضوء مصممة باحترام لهوية عمارة المساجد.",
        },
      },
      {
        slug: "bank-facades",
        name: { en: "Bank & Office Facades", ar: "واجهات البنوك والمكاتب" },
        short: {
          en: "Facade metalwork and screening for corporate and institutional buildings.",
          ar: "عناصر واجهات معدنية وحواجز للمباني المؤسسية والمكتبية.",
        },
      },
      {
        slug: "rooftop-amenity",
        name: { en: "Rooftop Amenity Structures", ar: "منشآت أسطح المباني" },
        short: {
          en: "Rooftop pergolas and covers that activate unused building tops.",
          ar: "برجولات وأغطية أسطح تُفعّل أسطح المباني غير المستخدمة.",
        },
      },
      {
        slug: "gym-covers",
        name: { en: "Sports Hall Covers", ar: "مظلات الصالات الرياضية" },
        short: {
          en: "Wide-span covers for courts, halls and training areas.",
          ar: "أغطية واسعة الامتداد للملاعب والصالات ومناطق التدريب.",
        },
      },
      {
        slug: "signage-structures",
        name: { en: "Signage Support Structures", ar: "هياكل اللوحات الإعلانية" },
        short: {
          en: "Engineered steel frames for signage and wayfinding elements.",
          ar: "هياكل حديدية مُهندَسة للوحات الإعلانية وعناصر الإرشاد.",
        },
      },
    ],
  },

  {
    id: "urban-structures",
    slug: "urban-structures",
    name: { en: "Urban Structures", ar: "الهياكل الحضرية" },
    short: {
      en: "Public-realm shade and structures — shelters, canopies and civic metalwork engineered for safety, durability and maintainability.",
      ar: "ظل ومنشآت للحيز العام — مآوي ومظلات وعناصر مدنية مُهندَسة للأمان والدائمة والقابلة للصيانة.",
    },
    image: withBase("/images/photos/shade-sail.webp"),
    subcategories: [
      {
        slug: "bus-shelters",
        name: { en: "Bus Shelters", ar: "مآوي الحافلات" },
        short: {
          en: "Passenger shelters engineered for public use and easy maintenance.",
          ar: "مآوي للركاب مُهندَسة للاستخدام العام وسهولة الصيانة.",
        },
      },
      {
        slug: "pedestrian-bridges",
        name: { en: "Pedestrian Bridges", ar: "جسور المشاة" },
        short: {
          en: "Steel footbridge structures fabricated to structural drawings.",
          ar: "هياكل جسور مشاة حديدية مصنعة وفق رسومات إنشائية.",
        },
      },
      {
        slug: "shade-sails",
        name: { en: "Shade Sails", ar: "الأشرعة المشدودة" },
        short: {
          en: "Sculptural tension sails for plazas, parks and play areas.",
          ar: "أشرعة مشدودة منحوتة الشكل للساحات والحدائق ومساحات اللعب.",
        },
        image: withBase("/images/photos/shade-sail.webp"),
      },
      {
        slug: "park-shelters",
        name: { en: "Park Shelters", ar: "مآوي الحدائق" },
        short: {
          en: "Shelter structures for parks, picnic areas and public gardens.",
          ar: "هياكل مأوى للحدائق العامة ومناطق النزهات.",
        },
      },
      {
        slug: "playground-shades",
        name: { en: "Playground Shades", ar: "مظلات مساحات الألعاب" },
        short: {
          en: "Shade that keeps children's play areas usable through summer.",
          ar: "مظلات تُبقي مساحات ألعاب الأطفال صالحة طوال الصيف.",
        },
      },
      {
        slug: "sports-court-covers",
        name: { en: "Sports Court Covers", ar: "مظلات الملاعب الرياضية" },
        short: {
          en: "Court and pitch covers for community and public sports facilities.",
          ar: "أغطية ملاعب للمرافق الرياضية العامة والمجتمعية.",
        },
      },
      {
        slug: "amphitheatre-covers",
        name: { en: "Amphitheatre Covers", ar: "مظلات المسارح المكشوفة" },
        short: {
          en: "Stage and seating shade for open-air theatres and venues.",
          ar: "مظلات مسارح ومقاعد للمساحات المسرحية المكشوفة.",
        },
      },
      {
        slug: "street-furniture",
        name: { en: "Street Furniture & Shade", ar: "أثاث الشوارع والظل" },
        short: {
          en: "Benches, frames and shading elements for streetscapes.",
          ar: "مقاعد وهياكل وعناصر ظل لتنسيق الشوارع.",
        },
      },
      {
        slug: "public-plaza-canopies",
        name: { en: "Public Plaza Canopies", ar: "مظلات الساحات العامة" },
        short: {
          en: "Feature canopies that make civic plazas usable at midday.",
          ar: "مظلات مميزة تجعل الساحات المدنية صالحة وقت الظهيرة.",
        },
      },
      {
        slug: "metro-station-canopies",
        name: { en: "Metro & Station Canopies", ar: "مظلات محطات النقل" },
        short: {
          en: "Platform and entrance canopies for transit stations.",
          ar: "مظلات أرصفة ومداخل لمحطات النقل العام.",
        },
      },
      {
        slug: "taxi-waiting-shelters",
        name: { en: "Taxi Waiting Shelters", ar: "مآوي انتظار سيارات الأجرة" },
        short: {
          en: "Compact waiting shelters for taxi and ride-hailing points.",
          ar: "مآوي انتظار مدمجة لنقاط سيارات الأجرة والتوصيل.",
        },
      },
      {
        slug: "prayer-shelters",
        name: { en: "Outdoor Prayer Shelters", ar: "مظلات المصلين الخارجية" },
        short: {
          en: "Shaded prayer areas for public gatherings and holy days.",
          ar: "مساحات صلاة مظللة للتجمعات العامة والمناسبات الدينية.",
        },
      },
      {
        slug: "kiosks",
        name: { en: "Kiosks & Pavilions", ar: "الأكشاك والأجنحة" },
        short: {
          en: "Steel and aluminium kiosks and pavilions for public spaces.",
          ar: "أكشاك وأجنحة من الحديد والألمنيوم للمساحات العامة.",
        },
      },
      {
        slug: "ticket-booths",
        name: { en: "Ticket Booths", ar: "كبائن التذاكر" },
        short: {
          en: "Purpose-built booth structures for entries and attractions.",
          ar: "كبائن مخصصة للمداخل والمرافق الترفيهية والأثرية.",
        },
      },
      {
        slug: "guard-cabins",
        name: { en: "Guard & Security Cabins", ar: "كبائن الأمن والحراسة" },
        short: {
          en: "Insulated, shaded security cabins manufactured to order.",
          ar: "كبائن أمن معزولة ومظللة تُصنّع حسب الطلب.",
        },
      },
      {
        slug: "information-booths",
        name: { en: "Information Booths", ar: "أكشاك الاستعلامات" },
        short: {
          en: "Orientation booths for parks, waterfronts and event sites.",
          ar: "أكشاك إرشاد للحدائق والواجهات البحرية ومواقع الفعاليات.",
        },
      },
      {
        slug: "public-amenities",
        name: { en: "Public Amenities Structures", ar: "منشآت المرافق العامة" },
        short: {
          en: "Structure and enclosure work for public amenity buildings.",
          ar: "أعمال هياكل وأسوار لمباني المرافق العامة.",
        },
      },
      {
        slug: "bicycle-shelters",
        name: { en: "Bicycle Shelters", ar: "مآوي الدراجات الهوائية" },
        short: {
          en: "Compact cycle shelters and racks for public and private sites.",
          ar: "مآوي وحوامل دراجات هوائية للمواقع العامة والخاصة.",
        },
      },
      {
        slug: "motorcycle-shelters",
        name: { en: "Motorcycle Shelters", ar: "مآوي الدراجات النارية" },
        short: {
          en: "Shaded motorcycle parking rows for hot-climate cities.",
          ar: "صفوف مظلات لركن الدراجات النارية في المدن الحارة.",
        },
      },
      {
        slug: "waste-enclosures",
        name: { en: "Waste & Bin Enclosures", ar: "مظلات الحاويات" },
        short: {
          en: "Screened and shaded enclosures for bins and services areas.",
          ar: "أسوار ومظلات محجوبة للحاويات ومناطق الخدمات.",
        },
      },
      {
        slug: "water-tank-structures",
        name: { en: "Water Tank Structures", ar: "هياكل خزانات المياه" },
        short: {
          en: "Support frames and covers for public water storage.",
          ar: "هياكل دعم وأغطية لتخزين المياه العامة.",
        },
      },
      {
        slug: "billboard-frames",
        name: { en: "Billboard Frames", ar: "هياكل اللوحات" },
        short: {
          en: "Engineered frames for public advertising and announcement boards.",
          ar: "هياكل مُهندَسة للوحات الإعلانية والتوجيه العامة.",
        },
      },
      {
        slug: "tensile-structures",
        name: { en: "Tensile Structures", ar: "المنشآت المشدودة" },
        short: {
          en: "Large-scale tensile membranes for civic and landmark spaces.",
          ar: "أغشية مشدودة كبيرة النطاق للساحات المدنية والمعالم.",
        },
      },
      {
        slug: "gazebos",
        name: { en: "Garden Pavilions & Gazebos", ar: "أجنحة الحدائق" },
        short: {
          en: "Freestanding pavilions for parks, gardens and waterfronts.",
          ar: "أجنحة قائمة بذاتها للحدائق العامة والواجهات البحرية.",
        },
      },
      {
        slug: "monument-structures",
        name: { en: "Monument & Landmark Structures", ar: "منشآت المعالم" },
        short: {
          en: "Feature metalwork for monuments, roundabouts and gateways.",
          ar: "عناصر معدنية مميزة للمعالم والدوّارات والمداخل الرئيسية.",
        },
      },
      {
        slug: "event-structures",
        name: { en: "Event & Festival Structures", ar: "منشآت الفعاليات" },
        short: {
          en: "Temporary-feel, permanently-built structures for public events.",
          ar: "منشآت دائمة البناء بمرونة الفعاليات والمناسبات العامة.",
        },
      },
      {
        slug: "market-shades",
        name: { en: "Market & Souq Shades", ar: "مظلات الأسواق" },
        short: {
          en: "Aisles and stall shading for markets and traditional souqs.",
          ar: "مظلات ممرات وبسطات للأسواق والأسواق الشعبية.",
        },
      },
      {
        slug: "beach-structures",
        name: { en: "Beach Shade Structures", ar: "منشآت الشواطئ" },
        short: {
          en: "Corrosion-resistant shade for beaches and waterfront promenades.",
          ar: "مظلات مقاومة للتآكل للشواطئ والممشى البحري.",
        },
      },
      {
        slug: "checkpoint-canopies",
        name: { en: "Checkpoint Canopies", ar: "مظلات نقاط التفتيش" },
        short: {
          en: "Canopies and cabins for checkpoints and controlled entries.",
          ar: "مظلات وكبائن لنقاط التفتيش والمداخل المنضبطة.",
        },
      },
    ],
  },
];

/* ---- Flatten + index ---------------------------------------------------- */

function buildCategories(): Category[] {
  return RAW_CATEGORIES.map((cat, ci) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    short: cat.short,
    order: ci + 1,
    active: true,
    image: cat.image,
    subcategories: cat.subcategories.map((sub, si) => ({
      ...sub,
      id: `${cat.id}-${sub.slug}`,
      categoryId: cat.id,
      order: si + 1,
      active: true,
      // Default to the generated brand illustration; real photography
      // overrides by setting `image` in the raw data above.
      image: sub.image ?? withBase(`/images/categories/${sub.slug}.svg`),
    })),
  }));
}

export const categories: Category[] = buildCategories();

/** All subcategories in one flat, ordered list (77 items). */
export const allSubcategories: Subcategory[] = categories.flatMap((c) => c.subcategories);

export function getCategory(categorySlug: string): Category | undefined {
  return categories.find((c) => c.slug === categorySlug);
}

export function getSubcategory(
  categorySlug: string,
  subcategorySlug: string,
): { category: Category; subcategory: Subcategory } | undefined {
  const category = getCategory(categorySlug);
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug);
  return category && subcategory ? { category, subcategory } : undefined;
}

/** Localized name / description helper. */
export function t(text: LocaleText, locale: Locale): string {
  return locale === "ar" ? text.ar : text.en;
}

/** Route helpers (locale-prefixed for next/link). */
export const categoryPath = (locale: Locale, category: Category) =>
  `/${locale}/${category.slug}`;

export const subcategoryPath = (locale: Locale, category: Category, sub: Subcategory) =>
  `/${locale}/${category.slug}/${sub.slug}`;
