import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { souls } from './friuliSoulsData';
import { RotateCcw, MapPin, Sparkles, ArrowLeft } from 'lucide-react';

type SoulId = 'coast' | 'plain' | 'alps';
type Scale = 'urban' | 'town' | 'village';

interface Answer {
  label: string;
  soul: SoulId;
  scale?: Scale;
}

interface Question {
  prompt: string;
  answers: Answer[];
}

const questions: Question[] = [
  {
    prompt: 'It is a wet Tuesday in February. Where would you rather be?',
    answers: [
      { label: 'A warm café on a grand square, newspaper in hand', soul: 'coast', scale: 'urban' },
      { label: 'A market town bar with a glass of Friulano before lunch', soul: 'plain', scale: 'town' },
      { label: 'Boots on, snow underfoot, nobody else on the trail', soul: 'alps', scale: 'village' }
    ]
  },
  {
    prompt: 'How close do you need a full hospital with specialists?',
    answers: [
      { label: 'In my city — I want to walk or take a bus to it', soul: 'coast', scale: 'urban' },
      { label: 'Within about half an hour by car is fine', soul: 'plain', scale: 'town' },
      { label: 'An hour down the valley is a trade I will happily make', soul: 'alps', scale: 'village' }
    ]
  },
  {
    prompt: 'What does your budget actually need to buy?',
    answers: [
      { label: 'Services and city life — I will pay the premium', soul: 'coast', scale: 'urban' },
      { label: 'The most house and town per euro, with services attached', soul: 'plain', scale: 'town' },
      { label: 'Cheap property; I accept heating bills and winter tyres', soul: 'alps', scale: 'village' }
    ]
  },
  {
    prompt: 'Pick the weather you can genuinely live with.',
    answers: [
      { label: 'Mild winters and sea air — but a wind that means it', soul: 'coast', scale: 'town' },
      { label: 'Fog and grey in winter, sticky heat in August', soul: 'plain', scale: 'town' },
      { label: 'Real snow from December and cool summer nights', soul: 'alps', scale: 'village' }
    ]
  },
  {
    prompt: 'What should be 45 minutes from your front door?',
    answers: [
      { label: 'Slovenia, Croatia and a proper airport', soul: 'coast', scale: 'urban' },
      { label: 'Vineyards, a UNESCO town and the regional capital', soul: 'plain', scale: 'town' },
      { label: 'Austria, ski lifts and an empty mountain road', soul: 'alps', scale: 'village' }
    ]
  },
  {
    prompt: 'Your ideal neighbourhood on a Saturday morning is…',
    answers: [
      { label: 'Busy — trams, markets, people you do not know', soul: 'coast', scale: 'urban' },
      { label: 'A weekly market where the same faces recognise you', soul: 'plain', scale: 'town' },
      { label: 'Silent, with church bells and maybe a tractor', soul: 'alps', scale: 'village' }
    ]
  }
];

export default function FriuliSoulQuiz() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Answer[]>([]);

  const done = step >= questions.length;

  const choose = (a: Answer) => {
    setPicks((p) => [...p.slice(0, step), a]);
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setPicks([]); setStep(0); };

  const tally = picks.reduce<Record<string, number>>((acc, p) => {
    acc[p.soul] = (acc[p.soul] || 0) + 1;
    return acc;
  }, {});
  const winnerId = (Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0] || 'plain') as SoulId;
  const soul = souls.find((s) => s.id === winnerId)!;

  const scaleTally = picks.reduce<Record<string, number>>((acc, p) => {
    if (p.scale) acc[p.scale] = (acc[p.scale] || 0) + 1;
    return acc;
  }, {});
  const preferredScale = (Object.keys(scaleTally).sort((a, b) => scaleTally[b] - scaleTally[a])[0] || 'town') as Scale;
  const town = soul.townMatches.find((t) => t.scale === preferredScale) || soul.townMatches[1];

  const confidence = Math.round(((tally[winnerId] || 0) / questions.length) * 100);
  const runnerUpId = (Object.keys(tally).filter((k) => k !== winnerId).sort((a, b) => tally[b] - tally[a])[0]) as SoulId | undefined;
  const runnerUp = runnerUpId ? souls.find((s) => s.id === runnerUpId) : undefined;

  const SoulIcon = soul.icon;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Six questions</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Which Friuli soul are you?</h2>
          <p className="text-lg text-muted-foreground">
            Answer honestly — the result names your band and the one town in it we'd point you at first.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
            {/* Progress */}
            <div className="h-1.5 w-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={false}
                animate={{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            <div className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Question {step + 1} of {questions.length}
                      </span>
                      {step > 0 && (
                        <button
                          onClick={back}
                          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </button>
                      )}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-6">{questions[step].prompt}</h3>

                    <div className="space-y-3">
                      {questions[step].answers.map((a) => (
                        <button
                          key={a.label}
                          onClick={() => choose(a)}
                          className="w-full rounded-2xl border-2 border-border bg-muted/20 p-4 text-left text-sm md:text-base transition-all duration-200 hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-6">
                      <img
                        src={soul.image}
                        alt={soul.imageAlt}
                        loading="lazy"
                        width={1600}
                        height={1008}
                        className="h-44 md:h-56 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-background/80" />
                          <span className="text-[11px] uppercase tracking-[0.2em] text-background/80">Your Friuli</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SoulIcon className="h-6 w-6 text-background" />
                          <h3 className="text-2xl md:text-3xl font-bold text-background">{soul.name}</h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">{soul.blurb}</p>

                    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 mb-5">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.15em]">Start looking here</span>
                      </div>
                      <p className="text-xl font-bold mb-1">{town.name}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{town.why}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">Match strength</p>
                        <p className="text-2xl font-bold text-primary tabular-nums">{confidence}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {confidence >= 66 ? 'Clear fit — your answers point one way.' : 'Split answers: worth visiting both bands.'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">Also consider</p>
                        <p className="text-lg font-semibold">{runnerUp ? runnerUp.name : 'Nothing else'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {runnerUp ? runnerUp.subtitle : 'You were unanimous — rare, and useful.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      {soul.meters.map((m) => (
                        <span
                          key={m.label}
                          className={cn('rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium')}
                        >
                          {m.label}: <span className="text-primary font-bold tabular-nums">{m.value}</span>
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" /> Take it again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
