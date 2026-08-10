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

const imgUrl = (v: unknown): string | undefined =>
  v && typeof v === "object" && "url" in v ? (v as { url?: string }).url : undefined;

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
      about,
      novaVera,
      mediaContent,
      videos,
      resourceItems,
      blogPosts,
      tips,
      pageImages,
    ] = await Promise.all([
      payload.find({ collection: "spiritual-sessions", ...findOptions }),
      payload.find({ collection: "coaching-services", ...findOptions }),
      payload.find({ collection: "programs", ...findOptions }),
      payload.find({ collection: "faqs", ...findOptions }),
      payload.find({ collection: "events", ...findOptions }),
      payload.findGlobal({ slug: "site-settings", locale: lang, depth: 1 }),
      payload.findGlobal({ slug: "hero", locale: lang }),
      payload.find({ collection: "testimonials", ...findOptions }),
      payload.findGlobal({ slug: "about", locale: lang, depth: 1 }),
      payload.findGlobal({ slug: "nova-vera", locale: lang }),
      payload.findGlobal({ slug: "media-content", locale: lang, depth: 1 }),
      payload.find({ collection: "videos", ...findOptions, depth: 1 }),
      payload.find({ collection: "resource-items", ...findOptions }),
      payload.find({ collection: "blog-posts", ...findOptions }),
      payload.find({ collection: "tips", ...findOptions }),
      payload.findGlobal({ slug: "page-images", locale: lang, depth: 1 }),
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
    const logoUrl = imgUrl(siteSettings?.logo);
    if (logoUrl) siteSettingsOut.logo = logoUrl;
    const logoWhiteUrl = imgUrl(siteSettings?.logoWhite);
    if (logoWhiteUrl) siteSettingsOut.logoWhite = logoWhiteUrl;
    const faviconUrl = imgUrl(siteSettings?.favicon);
    if (faviconUrl) siteSettingsOut.favicon = faviconUrl;
    if (Object.keys(siteSettingsOut).length > 0) {
      data.siteSettings = siteSettingsOut;
    }

    // pageImages (page-images global — sayfa arka plan görselleri)
    const pageImagesOut: Record<string, unknown> = {};
    for (const key of [
      "servicesBg", "mediaBg", "programsBg", "resourcesBg", "contactBg", "novaVeraBg",
    ] as const) {
      const url = imgUrl(pageImages?.[key]);
      if (url) pageImagesOut[key] = url;
    }
    if (Object.keys(pageImagesOut).length > 0) {
      data.pageImages = pageImagesOut;
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

    // about (about global — t.about.*)
    const aboutOut: Record<string, unknown> = {};
    const profileImageUrl = imgUrl(about?.profileImage);
    if (profileImageUrl) aboutOut.profileImage = profileImageUrl;
    if (about?.subtitle) aboutOut.subtitle = about.subtitle;
    if (about?.title) aboutOut.title = about.title;
    if (about?.name) aboutOut.name = about.name;
    if (about?.heroDescription) aboutOut.heroDescription = about.heroDescription;
    if (about?.heroDescription2) aboutOut.heroDescription2 = about.heroDescription2;
    if (about?.appointment) aboutOut.appointment = about.appointment;
    if (about?.mediaButton) aboutOut.mediaButton = about.mediaButton;
    if (about?.storyTitle) aboutOut.storyTitle = about.storyTitle;
    if (about?.story1) aboutOut.story1 = about.story1;
    if (about?.story2) aboutOut.story2 = about.story2;
    if (about?.story3) aboutOut.story3 = about.story3;
    if (about?.story4) aboutOut.story4 = about.story4;
    if (about?.valuesTitle) aboutOut.valuesTitle = about.valuesTitle;
    if (about?.valuesDescription) aboutOut.valuesDescription = about.valuesDescription;
    if (about?.certificationsTitle) aboutOut.certificationsTitle = about.certificationsTitle;
    if (about?.journeyTitle) aboutOut.journeyTitle = about.journeyTitle;
    if (about?.spiritualTitle) aboutOut.spiritualTitle = about.spiritualTitle;
    if (about?.spiritual1) aboutOut.spiritual1 = about.spiritual1;
    if (about?.spiritual2) aboutOut.spiritual2 = about.spiritual2;
    if (about?.spiritual3) aboutOut.spiritual3 = about.spiritual3;
    if (about?.ctaTitle) aboutOut.ctaTitle = about.ctaTitle;
    if (about?.ctaDescription) aboutOut.ctaDescription = about.ctaDescription;
    if (about?.ctaButton) aboutOut.ctaButton = about.ctaButton;

    // about.values — group → object (dizi değil): { empathy: {title, description}, ... }
    const aboutValues: Record<string, unknown> = {};
    for (const key of ["empathy", "honesty", "transformation", "excellence"] as const) {
      const group = about?.values?.[key];
      if (group && typeof group === "object") {
        const valueOut: Record<string, unknown> = {};
        if (group.title) valueOut.title = group.title;
        if (group.description) valueOut.description = group.description;
        if (Object.keys(valueOut).length > 0) aboutValues[key] = valueOut;
      }
    }
    if (Object.keys(aboutValues).length > 0) aboutOut.values = aboutValues;

    // about.certifications — array → [{title, organization, year}]
    if (Array.isArray(about?.certifications) && about.certifications.length > 0) {
      aboutOut.certifications = about.certifications.map((row) => ({
        title: row?.title,
        organization: row?.organization,
        year: row?.year,
      }));
    }

    // about.timeline — array → [{year, title, description}]
    if (Array.isArray(about?.timeline) && about.timeline.length > 0) {
      aboutOut.timeline = about.timeline.map((row) => ({
        year: row?.year,
        title: row?.title,
        description: row?.description,
      }));
    }

    // about.spiritualApproaches — array-of-{item} → string[]
    const spiritualApproaches = toStringArray(about?.spiritualApproaches, "item");
    if (spiritualApproaches) aboutOut.spiritualApproaches = spiritualApproaches;

    if (Object.keys(aboutOut).length > 0) {
      data.about = aboutOut;
    }

    // novaVera (nova-vera global — t.novaVera.*)
    const novaVeraOut: Record<string, unknown> = {};
    if (novaVera?.brand) novaVeraOut.brand = novaVera.brand;
    if (novaVera?.tagline) novaVeraOut.tagline = novaVera.tagline;
    if (novaVera?.introQuestion) novaVeraOut.introQuestion = novaVera.introQuestion;
    if (novaVera?.introAnswer) novaVeraOut.introAnswer = novaVera.introAnswer;
    if (novaVera?.whatTitle) novaVeraOut.whatTitle = novaVera.whatTitle;
    if (novaVera?.whatQuestion) novaVeraOut.whatQuestion = novaVera.whatQuestion;
    if (novaVera?.journeyTitle) novaVeraOut.journeyTitle = novaVera.journeyTitle;
    if (novaVera?.journeyHighlight) novaVeraOut.journeyHighlight = novaVera.journeyHighlight;
    if (novaVera?.includesTitle) novaVeraOut.includesTitle = novaVera.includesTitle;
    if (novaVera?.includesIntro) novaVeraOut.includesIntro = novaVera.includesIntro;
    if (novaVera?.includesNote) novaVeraOut.includesNote = novaVera.includesNote;
    if (novaVera?.outcomesTitle) novaVeraOut.outcomesTitle = novaVera.outcomesTitle;
    if (novaVera?.outcomesFinal) novaVeraOut.outcomesFinal = novaVera.outcomesFinal;
    if (novaVera?.outcomesNote) novaVeraOut.outcomesNote = novaVera.outcomesNote;
    if (novaVera?.notSessionTitle) novaVeraOut.notSessionTitle = novaVera.notSessionTitle;
    if (novaVera?.whoTitle) novaVeraOut.whoTitle = novaVera.whoTitle;
    if (novaVera?.whoIntro) novaVeraOut.whoIntro = novaVera.whoIntro;
    if (novaVera?.whoOutro) novaVeraOut.whoOutro = novaVera.whoOutro;
    if (novaVera?.whoNote) novaVeraOut.whoNote = novaVera.whoNote;
    if (novaVera?.firstStepTitle) novaVeraOut.firstStepTitle = novaVera.firstStepTitle;
    if (novaVera?.quote) novaVeraOut.quote = novaVera.quote;
    if (novaVera?.ctaButton) novaVeraOut.ctaButton = novaVera.ctaButton;

    // novaVera string[] alanları (array-of-obje → string[])
    const novaVeraIntro = toStringArray(novaVera?.intro, "text");
    if (novaVeraIntro) novaVeraOut.intro = novaVeraIntro;
    const novaVeraWhat = toStringArray(novaVera?.what, "text");
    if (novaVeraWhat) novaVeraOut.what = novaVeraWhat;
    const novaVeraJourney = toStringArray(novaVera?.journey, "text");
    if (novaVeraJourney) novaVeraOut.journey = novaVeraJourney;
    const novaVeraNotSession = toStringArray(novaVera?.notSession, "text");
    if (novaVeraNotSession) novaVeraOut.notSession = novaVeraNotSession;
    const novaVeraFirstStep = toStringArray(novaVera?.firstStep, "text");
    if (novaVeraFirstStep) novaVeraOut.firstStep = novaVeraFirstStep;
    const novaVeraIncludes = toStringArray(novaVera?.includes, "item");
    if (novaVeraIncludes) novaVeraOut.includes = novaVeraIncludes;
    const novaVeraOutcomes = toStringArray(novaVera?.outcomes, "item");
    if (novaVeraOutcomes) novaVeraOut.outcomes = novaVeraOutcomes;
    const novaVeraWho = toStringArray(novaVera?.who, "item");
    if (novaVeraWho) novaVeraOut.who = novaVeraWho;

    if (Object.keys(novaVeraOut).length > 0) {
      data.novaVera = novaVeraOut;
    }

    // media (media-content global — t.media.*)
    const mediaOut: Record<string, unknown> = {};
    for (const k of [
      "subtitle", "title", "titleHighlight", "description", "featuredTitle",
      "quotesTitle", "awardsTitle", "instagramTitle", "instagramDescription",
      "followInstagram", "ctaTitle", "ctaDescription", "ctaButton",
    ] as const) {
      if (mediaContent?.[k]) mediaOut[k] = mediaContent[k];
    }
    // mediaItems group → object { magazine: {...}, award: {...} }
    const mediaItems: Record<string, unknown> = {};
    for (const key of ["magazine", "award"] as const) {
      const g = mediaContent?.mediaItems?.[key];
      if (g && typeof g === "object") {
        const itemOut: Record<string, unknown> = {};
        for (const f of ["title", "subtitle", "date", "description"] as const) {
          if (g[f]) itemOut[f] = g[f];
        }
        const itemImage = imgUrl(g.image);
        if (itemImage) itemOut.image = itemImage;
        if (Object.keys(itemOut).length > 0) mediaItems[key] = itemOut;
      }
    }
    if (Object.keys(mediaItems).length > 0) mediaOut.mediaItems = mediaItems;
    // quotes array
    if (Array.isArray(mediaContent?.quotes) && mediaContent.quotes.length > 0) {
      mediaOut.quotes = mediaContent.quotes.map((r) => ({ quote: r?.quote, source: r?.source }));
    }
    // awards array
    if (Array.isArray(mediaContent?.awards) && mediaContent.awards.length > 0) {
      mediaOut.awards = mediaContent.awards.map((r) => ({
        title: r?.title, organization: r?.organization, year: r?.year,
      }));
    }
    // instagramPosts array → [{image, link}] (sadece görseli olanlar)
    if (Array.isArray(mediaContent?.instagramPosts)) {
      const instagramPosts = mediaContent.instagramPosts
        .map((p) => ({
          image: imgUrl(p?.image),
          link: typeof p?.link === "string" ? p.link : undefined,
        }))
        .filter((p): p is { image: string; link: string | undefined } => typeof p.image === "string");
      if (instagramPosts.length > 0) mediaOut.instagramPosts = instagramPosts;
    }
    if (Object.keys(mediaOut).length > 0) {
      data.media = mediaOut;
    }

    // videos (videos koleksiyonu — t.videos)
    if (videos.docs.length > 0) {
      const videoList = videos.docs
        .filter((doc) => doc.published !== false)
        .map((doc) => {
          const file = doc.videoFile as { url?: string } | undefined;
          const thumb = doc.thumbnail as { url?: string } | undefined;
          return {
            title: doc.title,
            description: doc.description,
            source: doc.source,
            youtubeUrl: doc.youtubeUrl,
            fileUrl: file && typeof file === "object" ? file.url : undefined,
            thumbnail: thumb && typeof thumb === "object" ? thumb.url : undefined,
          };
        });
      if (videoList.length > 0) data.videos = videoList;
    }

    // resourceItems (resource-items koleksiyonu)
    if (resourceItems.docs.length > 0) {
      data.resourceItems = resourceItems.docs.map((doc) => ({
        title: doc.title,
        description: doc.description,
        type: doc.type,
        category: doc.category,
      }));
    }

    // blogPosts (blog-posts koleksiyonu)
    if (blogPosts.docs.length > 0) {
      data.blogPosts = blogPosts.docs.map((doc) => ({
        title: doc.title,
        excerpt: doc.excerpt,
        category: doc.category,
        readTime: doc.readTime,
      }));
    }

    // tips (tips koleksiyonu)
    if (tips.docs.length > 0) {
      data.tips = tips.docs.map((doc) => ({
        title: doc.title,
        tip: doc.tip,
      }));
    }

    return Response.json(data, { headers: CACHE_HEADERS });
  } catch (error) {
    console.error("[/api/content] Failed to load CMS content:", error);
    return Response.json({}, { status: 200 });
  }
};
