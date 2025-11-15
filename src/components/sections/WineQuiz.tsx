import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wine, ChevronRight } from 'lucide-react';

interface QuizAnswer {
  text: string;
  wine: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  answers: QuizAnswer[];
}

interface WineProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
}

interface WineQuizData {
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
  profiles: WineProfile[];
}

// Legacy format for backward compatibility
interface LegacyProfile {
  id: string;
  label: string;
  result: {
    name: string;
    note: string;
    image: string;
  };
}

interface LegacyQuizData {
  profiles: LegacyProfile[];
}

interface WineQuizProps {
  quizData: WineQuizData | LegacyQuizData;
}

// Type guard to check if it's the new quiz format
function isNewQuizFormat(data: WineQuizData | LegacyQuizData): data is WineQuizData {
  return 'questions' in data && 'title' in data;
}

export function WineQuiz({ quizData }: WineQuizProps) {
  // Handle legacy format (old Piemonte quiz)
  if (!isNewQuizFormat(quizData)) {
    return <LegacyWineQuiz profiles={quizData.profiles} />;
  }

  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleStart = () => {
    setStage('quiz');
    setCurrentQuestion(0);
    setAnswers(new Map());
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (wineId: string) => {
    setSelectedAnswer(wineId);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = new Map(answers);
    newAnswers.set(quizData.questions[currentQuestion].id, selectedAnswer);
    setAnswers(newAnswers);

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate result and track completion
      setStage('result');
      if (window.trackEvent) {
        window.trackEvent('wine_quiz_complete', { location: window.location.pathname });
      }
    }
  };

  const calculateResult = (): WineProfile => {
    const scores = new Map<string, number>();
    
    // Count occurrences of each wine
    answers.forEach((wineId) => {
      scores.set(wineId, (scores.get(wineId) || 0) + 1);
    });

    // Find highest score
    let maxScore = 0;
    let winners: string[] = [];
    
    scores.forEach((score, wineId) => {
      if (score > maxScore) {
        maxScore = score;
        winners = [wineId];
      } else if (score === maxScore) {
        winners.push(wineId);
      }
    });

    // Tie-breaking priority order
    const priority = ['primitivo', 'negroamaro', 'rosato', 'nero-di-troia', 'fiano'];
    
    let winningWineId = winners[0];
    if (winners.length > 1) {
      for (const wine of priority) {
        if (winners.includes(wine)) {
          winningWineId = wine;
          break;
        }
      }
    }

    return quizData.profiles.find(p => p.id === winningWineId) || quizData.profiles[0];
  };

  const result = stage === 'result' ? calculateResult() : null;

  // Intro Screen
  if (stage === 'intro') {
    return (
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Wine-themed background */}
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('/images/puglia/primitivo-grapes.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Wine className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{quizData.title}</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              {quizData.subtitle}
            </p>
            
            {/* Wine preview images to clarify purpose */}
            <div className="flex justify-center gap-4 mb-8 opacity-90">
              <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                <img 
                  src="/images/puglia/primitivo-puglia-wine.jpg" 
                  alt="Primitivo wine" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                <img 
                  src="/images/puglia/negroamaro-puglia-wine.jpg" 
                  alt="Negroamaro wine" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                <img 
                  src="/images/puglia/fiano-minutolo-puglia-wine.jpg" 
                  alt="Fiano Minutolo wine" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Take a quick quiz to discover which Puglian wine matches your personality — complete with tasting notes and where to find it.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleStart}
              className="group"
              data-analytics-event="wine_quiz_start"
            >
              Start Quiz
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz Screen
  if (stage === 'quiz') {
    const question = quizData.questions[currentQuestion];
    
    return (
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h3 className="text-2xl md:text-3xl font-bold mb-8 animate-fade-in">
              {question.text}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer.wine)}
                  className={`w-full text-left p-4 md:p-6 rounded-lg border-2 transition-all duration-200 animate-fade-in ${
                    selectedAnswer === answer.wine
                      ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-base md:text-lg font-medium">
                    {answer.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <Button 
              size="lg" 
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="w-full md:w-auto px-8"
            >
              {currentQuestion < quizData.questions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Result Screen
  if (stage === 'result' && result) {
    return (
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <Wine className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg text-muted-foreground mb-2">Your Puglia Wine Is...</p>
            </div>

            <Card className="overflow-hidden shadow-xl animate-scale-in">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 md:p-10 flex flex-col justify-center bg-card">
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
                    {result.name}
                  </h3>
                  <p className="text-xl md:text-2xl font-semibold mb-6 text-foreground/80">
                    {result.title}
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                    {result.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleStart}
                    className="w-full md:w-auto"
                  >
                    Retake Quiz
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

// Legacy Wine Quiz Component (for old format compatibility)
function LegacyWineQuiz({ profiles }: { profiles: LegacyProfile[] }) {
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
