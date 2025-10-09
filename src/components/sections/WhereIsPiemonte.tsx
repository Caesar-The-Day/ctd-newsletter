import { InteractiveMap } from './InteractiveMap';
import { RegionData } from '@/utils/getRegionData';

interface WhereIsPiemonteProps {
  where: RegionData['where'];
}

export function WhereIsPiemonte({ where }: WhereIsPiemonteProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Intro Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {where.intro.headline}
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            {where.intro.copy}
          </p>
        </div>

        {/* Interactive Map */}
        <InteractiveMap mapData={where.map} />

        {/* Tabs Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            {where.tabs.map((tab) => (
              <div
                key={tab.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {tab.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tab.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
