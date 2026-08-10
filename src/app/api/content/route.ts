import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

type Locale = "tr" | "en";

const CACHE_HEADERS = { "Cache-Control": "public, max-age=60, s-maxage=60" };

const toStringArray = (
  items: unknown,
  field: string,
): string[] | undefined => {
  if (!Array.isArray(items)) return undefined;
  const flattened = items
    .map((row) => (row && typeof row === "object" ? (row as Record<string, unknown>)[field] : undefined))
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  return flattened.length > 0 ? flattened : undefined;
};

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const langParam = searchParams.get("lang");
    const lang: Locale = langParam === "en" ? "en" : "tr";

    const payload = await getPayload({ config });

    const findOptions = {
      locale: lang,
      sort: "order",
      limit: 200,
      pagination: false as const,
    };

    const [
      spiritualSessions,
      coachingServices,
      programs,
      faqs,
      events,
      siteSettings,
      hero,
      testimonials,
    ] = await Promise.all([
      payload.find({ collection: "spiritual-sessions", ...findOptions }),
      payload.find({ collection: "coaching-services", ...findOptions }),
      payload.find({ collection: "programs", ...findOptions }),
      payload.find({ collection: "faqs", ...findOptions }),
      payload.find({ collection: "events", ...findOptions }),
      payload.findGlobal({ slug: "site-settings", locale: lang }),
      payload.findGlobal({ slug: "hero", locale: lang }),
      payload.find({ collection: "testimonials", ...findOptions }),
    ]);

    const data: Record<string, unknown> = {};

    // services.spiritual.sessions + services.servicesList
    const services: Record<string, unknown> = {};

    if (spiritualSessions.docs.length > 0) {
      services.spiritual = {
        sessions: spiritualSessions.docs.map((doc) => ({
          title: doc.title,
          description: doc.description,
          duration: doc.duration,
          price: doc.price,
        })),
      };
    }

    if (coachingServices.docs.length > 0) {
      const servicesList: Record<string, unknown> = {};
      for (const doc of coachingServices.docs) {
        if (!doc.key) continue;
        servicesList[doc.key] = {
          title: doc.title,
          shortDesc: doc.shortDesc,
          fullDesc: doc.fullDesc,
          duration: doc.duration,
          features: toStringArray(doc.features, "feature"),
        };
      }
      if (Object.keys(servicesList).length > 0) {
        services.servicesList = servicesList;
      }
    }

    if (Object.keys(services).length > 0) {
      data.services = services;
    }

    // programs.programsList + programs.faq
    const programsSection: Record<string, unknown> = {};

    if (programs.docs.length > 0) {
      const programsList: Record<string, unknown> = {};
      for (const doc of programs.docs) {
        if (!doc.key) continue;
        programsList[doc.key] = {
          title: doc.title,
          subtitle: doc.subtitle,
          duration: doc.duration,
          sessions: doc.sessions,
          description: doc.description,
          includes: toStringArray(doc.includes, "item"),
        };
      }
      if (Object.keys(programsList).length > 0) {
        programsSection.programsList = programsList;
      }
    }

    if (faqs.docs.length > 0) {
      programsSection.faq = faqs.docs.map((doc) => ({
        q: doc.question,
        a: doc.answer,
      }));
    }

    if (Object.keys(programsSection).length > 0) {
      data.programs = programsSection;
    }

    // events.eventsList
    if (events.docs.length > 0) {
      data.events = {
        eventsList: events.docs.map((doc) => ({
          title: doc.title,
          date: doc.dateText,
          time: doc.time,
          description: doc.description,
        })),
      };
    }

    // contact.info (site-settings global — sadece address + hours)
    const info: Record<string, unknown> = {};
    if (siteSettings?.address) info.addressValue = siteSettings.address;
    if (siteSettings?.hours) info.hoursValue = siteSettings.hours;
    if (Object.keys(info).length > 0) {
      data.contact = { info };
    }

    // siteSettings (site-settings global — tam iletişim bilgisi)
    const siteSettingsOut: Record<string, unknown> = {};
    if (siteSettings?.email) siteSettingsOut.email = siteSettings.email;
    if (siteSettings?.phone) siteSettingsOut.phone = siteSettings.phone;
    if (siteSettings?.whatsapp) siteSettingsOut.whatsapp = siteSettings.whatsapp;
    if (siteSettings?.instagram) siteSettingsOut.instagram = siteSettings.instagram;
    if (siteSettings?.youtube) siteSettingsOut.youtube = siteSettings.youtube;
    if (siteSettings?.address) siteSettingsOut.address = siteSettings.address;
    if (siteSettings?.hours) siteSettingsOut.hours = siteSettings.hours;
    if (Object.keys(siteSettingsOut).length > 0) {
      data.siteSettings = siteSettingsOut;
    }

    // hero (hero global)
    const heroOut: Record<string, unknown> = {};
    if (hero?.badge) heroOut.badge = hero.badge;
    if (hero?.title1) heroOut.title1 = hero.title1;
    if (hero?.title2) heroOut.title2 = hero.title2;
    if (hero?.title3) heroOut.title3 = hero.title3;
    if (hero?.description) heroOut.description = hero.description;
    if (hero?.cta1) heroOut.cta1 = hero.cta1;
    if (hero?.cta2) heroOut.cta2 = hero.cta2;
    if (hero?.googleReview) heroOut.googleReview = hero.googleReview;

    const heroStats: Record<string, unknown> = {};
    if (hero?.stats?.clients) heroStats.clients = hero.stats.clients;
    if (hero?.stats?.experience) heroStats.experience = hero.stats.experience;
    if (hero?.stats?.satisfaction) heroStats.satisfaction = hero.stats.satisfaction;
    if (Object.keys(heroStats).length > 0) {
      heroOut.stats = heroStats;
    }

    if (Object.keys(heroOut).length > 0) {
      data.hero = heroOut;
    }

    // testimonials (testimonials koleksiyonu)
    if (testimonials.docs.length > 0) {
      data.testimonials = {
        list: testimonials.docs.map((doc) => ({
          name: doc.name,
          text: doc.text,
          rating: doc.rating,
        })),
      };
    }

    return Response.json(data, { headers: CACHE_HEADERS });
  } catch (error) {
    console.error("[/api/content] Failed to load CMS content:", error);
    return Response.json({}, { status: 200 });
  }
};
