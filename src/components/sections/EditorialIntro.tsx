interface EditorialIntroProps {
  headline: string;
  byline: string;
  paragraphs: string[];
  portrait: string;
}

export function EditorialIntro({
  headline,
  byline,
  paragraphs,
  portrait,
}: EditorialIntroProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
          {/* Portrait */}
          <div className="flex justify-center md:justify-start">
            <img
              src={portrait}
              alt="Cesare"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-soft"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground italic">
              {headline}
            </h2>

            <div className="space-y-6">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-lg leading-relaxed text-foreground/90 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
