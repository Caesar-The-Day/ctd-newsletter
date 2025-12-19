import { useState, useEffect, useRef } from 'react';
import { Cake, Star, Heart } from 'lucide-react';

interface Question {
  question: string;
  optionA: string;
  optionB: string;
}

const questions: Question[] = [
  {
    question: "Your ideal dessert texture is:",
    optionA: "Structured, airy, and slightly challenging",
    optionB: "Soft, uniform, and immediately comforting"
  },
  {
    question: "When following a recipe, you:",
    optionA: "Respect technique and timing",
    optionB: "Adjust until it feels right"
  },
  {
    question: "You prefer traditions that are:",
    optionA: "Earned through repetition",
    optionB: "Warm and forgiving"
  },
  {
    question: "At Christmas dinner, you value:",
    optionA: "Craft and execution",
    optionB: "Comfort and abundance"
  },
  {
    question: "You're more impressed by:",
    optionA: "A baker who nails a difficult process",
    optionB: "A dessert everyone loves without thinking"
  },
  {
    question: "Winter, to you, is:",
    optionA: "A season to be managed properly",
    optionB: "A time to indulge and soften the edges"
  }
];

type Answer = 'A' | 'B' | null;
type Result = 'panettone' | 'pandoro' | 'hybrid';

const PanettoneQuiz = () => {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(Array(6).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<Answer>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleStart = () => {
    setStage('quiz');
    setCurrentQuestion(0);
    setAnswers(Array(6).fill(null));
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answer: Answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate result
      const aCount = newAnswers.filter(a => a === 'A').length;
      const bCount = newAnswers.filter(a => a === 'B').length;
      
      if (aCount > bCount + 1) {
        setResult('panettone');
      } else if (bCount > aCount + 1) {
        setResult('pandoro');
      } else {
        setResult('hybrid');
      }
      setStage('result');
    }
  };

  const handleRetake = () => {
    setStage('intro');
    setResult(null);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Header - Always visible */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-800 dark:text-amber-200 text-sm font-medium mb-4">
              <Cake className="w-4 h-4" />
              Christmas Personality Test
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
              Panettone or Pandoro?
            </h2>
            <p className="text-muted-foreground text-lg italic">
              A Christmas personality test Italy takes very seriously
            </p>
          </div>

          {/* Quiz Card */}
          <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Intro Stage */}
            {stage === 'intro' && (
              <div className="p-8 md:p-12 text-center">
                <div className="max-w-xl mx-auto space-y-6">
                  <p className="text-foreground text-lg leading-relaxed">
                    Italy pretends this is a friendly debate. <span className="font-semibold">It isn't.</span>
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Panettone and pandoro aren't just desserts; they're cultural positions. One comes from Milan, built on technique and patience. The other comes from Verona, built on softness and indulgence.
                  </p>
                  <p className="text-foreground/80 text-sm italic">
                    Answer honestly. Lombardia will know if you're lying.
                  </p>
                  <button
                    onClick={handleStart}
                    className="mt-6 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Begin the Test
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Stage */}
            {stage === 'quiz' && (
              <div className="p-8 md:p-12">
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx < currentQuestion
                          ? 'bg-amber-600'
                          : idx === currentQuestion
                          ? 'bg-amber-500 w-4'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <span className="text-sm text-muted-foreground mb-2 block">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-4 max-w-lg mx-auto">
                  <button
                    onClick={() => handleAnswerSelect('A')}
                    className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                      selectedAnswer === 'A'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-border hover:border-amber-300 hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-foreground">{questions[currentQuestion].optionA}</span>
                  </button>
                  <button
                    onClick={() => handleAnswerSelect('B')}
                    className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                      selectedAnswer === 'B'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-border hover:border-amber-300 hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-foreground">{questions[currentQuestion].optionB}</span>
                  </button>
                </div>

                {/* Next Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className={`px-8 py-3 font-medium rounded-full transition-all duration-300 ${
                      selectedAnswer === null
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105'
                    }`}
                  >
                    {currentQuestion === questions.length - 1 ? 'See My Result' : 'Next'}
                  </button>
                </div>
              </div>
            )}

            {/* Result Stage */}
            {stage === 'result' && result && (
              <div className="p-8 md:p-12">
                {result === 'panettone' && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2">
                      <Star className="w-10 h-10 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-display text-foreground mb-2">
                        You're Panettone
                      </h3>
                      <p className="text-amber-700 dark:text-amber-400 italic">
                        Milan would approve. Quietly.
                      </p>
                    </div>
                    <div className="max-w-lg mx-auto space-y-4 text-left">
                      <p className="text-foreground leading-relaxed">
                        Panettone is difficult on purpose. Long fermentation, precise timing, and no tolerance for shortcuts. It reflects Lombardy's mindset: discipline first, reward later.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        This is the dessert of a region that values execution over ease and believes winter is something you prepare for, not escape.
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground/80 italic pt-4 border-t border-border mt-6">
                      Cultural footnote: Panettone was born in Milan. Lombards consider that the end of the discussion.
                    </p>
                  </div>
                )}

                {result === 'pandoro' && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2">
                      <Heart className="w-10 h-10 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-display text-foreground mb-2">
                        You're Pandoro
                      </h3>
                      <p className="text-amber-700 dark:text-amber-400 italic">
                        Verona welcomes you with open arms.
                      </p>
                    </div>
                    <div className="max-w-lg mx-auto space-y-4 text-left">
                      <p className="text-foreground leading-relaxed">
                        Pandoro is soft, rich, and unapologetically indulgent. It's about pleasure now, not patience later. There's nothing wrong with that—but it's not how Lombardy operates.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        You may still enjoy Lombardia, but you'll notice its winters feel stricter and its traditions less forgiving.
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground/80 italic pt-4 border-t border-border mt-6">
                      Cultural footnote: Pandoro belongs to Veneto. Lombardy respects it. From a distance.
                    </p>
                  </div>
                )}

                {result === 'hybrid' && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2">
                      <div className="flex">
                        <Star className="w-6 h-6 text-amber-600" />
                        <Heart className="w-6 h-6 text-amber-600 -ml-1" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-display text-foreground mb-2">
                        You're Diplomatically Conflicted
                      </h3>
                      <p className="text-amber-700 dark:text-amber-400 italic">
                        Italy is full of people like you.
                      </p>
                    </div>
                    <div className="max-w-lg mx-auto space-y-4 text-left">
                      <p className="text-foreground leading-relaxed">
                        You appreciate structure but crave comfort. You respect craft but don't want to suffer for it. This puts you somewhere between Lombardy and its neighbors.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        You'll enjoy Lombardia best if you understand that it won't soften itself for you.
                      </p>
                    </div>
                  </div>
                )}

                {/* Retake Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={handleRetake}
                    className="px-6 py-2 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors"
                  >
                    Take Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanettoneQuiz;
