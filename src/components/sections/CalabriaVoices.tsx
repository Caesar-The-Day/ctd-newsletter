import { Quote } from 'lucide-react';

interface Voice {
  quote: string;
  name: string;
  role: string;
  town: string;
  portrait: string;
}

const voices: Voice[] = [
  {
    quote:
      "I left for Toronto at twenty-two. I came back at sixty-four. The cliffs were exactly where I left them — the Wi-Fi is the only thing that surprised me.",
    name: "Concetta R.",
    role: "Returned emigrant",
    town: "Tropea",
    portrait: "/images/calabria/voice-tropea.jpg",
  },
  {
    quote:
      "Up here in the Sila, summer is fifteen degrees cooler than the coast. People forget that Calabria has mountains. The mountains do not forget.",
    name: "Giuseppe M.",
    role: "Chestnut farmer",
    town: "Camigliatello",
    portrait: "/images/calabria/voice-sila.jpg",
  },
  {
    quote:
      "The swordfish comes in before sunrise. The tourists come at noon. By then the good fish is already in someone's kitchen — that is how it has always worked.",
    name: "Antonio L.",
    role: "Fishmonger",
    town: "Reggio Calabria",
    portrait: "/images/calabria/voice-reggio.jpg",
  },
];

export function CalabriaVoices() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10 md:mb-14">
          <Quote className="h-10 w-10 mx-auto mb-3 text-primary" aria-hidden="true" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Voices from Calabria
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Three Calabrians on what newcomers usually misunderstand about their corner of Italy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {voices.map((v, idx) => (
            <figure
              key={v.name}
              className="group relative bg-card rounded-2xl shadow-soft overflow-hidden border border-border/40 flex flex-col opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={v.portrait}
                  alt={`Portrait of ${v.name}, ${v.role} in ${v.town}, Calabria`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white font-semibold text-base drop-shadow-md">
                    {v.name}
                  </p>
                  <p className="text-white/85 text-xs drop-shadow">
                    {v.role} · {v.town}
                  </p>
                </div>
                <Quote
                  className="absolute top-3 right-3 h-8 w-8 text-white/80 drop-shadow-lg"
                  aria-hidden="true"
                />
              </div>

              <blockquote className="p-6 md:p-7 flex-1 flex items-center">
                <p className="text-base md:text-lg italic leading-relaxed text-foreground/90 font-serif">
                  &ldquo;{v.quote}&rdquo;
                </p>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}