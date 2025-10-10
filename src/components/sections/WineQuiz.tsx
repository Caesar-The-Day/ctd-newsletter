import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wine } from 'lucide-react';

interface WineProfile {
  id: string;
  label: string;
  result: {
    name: string;
    note: string;
    image: string;
  };
}

interface WineQuizProps {
  profiles: WineProfile[];
}

export function WineQuiz({ profiles }: WineQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProfile = profiles.find((p) => p.id === selected);

  return (
    <section className="py-8 md:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Wine className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Piemonte Wine
            </h2>
            <p className="text-lg text-muted-foreground">
              What's your wine personality? Choose your style:
            </p>
          </div>

          {/* Selection Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {profiles.map((profile) => (
              <Button
                key={profile.id}
                variant={selected === profile.id ? 'default' : 'outline'}
                size="lg"
                className="h-auto py-6 text-left justify-start hover-lift"
                onClick={() => setSelected(profile.id)}
              >
                <span className="text-lg font-semibold">{profile.label}</span>
              </Button>
            ))}
          </div>

          {/* Result Card */}
          {selectedProfile && (
            <Card className="overflow-hidden shadow-medium animate-scale-in">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={selectedProfile.result.image}
                    alt={selectedProfile.result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4 text-primary">
                    {selectedProfile.result.name}
                  </h3>
                  <p className="text-foreground/90 leading-relaxed">
                    {selectedProfile.result.note}
                  </p>
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
