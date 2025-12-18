import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Snowflake, Trophy, Calendar, Mountain } from 'lucide-react';
import LombardyMapSVG, { winterDestinations as winterDestinationPositions } from './LombardyMapSVG';

// Christmas market cities
const christmasCities = ['milano', 'bergamo', 'brescia', 'mantova'];

// City modal content
const cityModals: Record<string, { title: string; content: string }> = {
  milano: {
    title: 'Oh Bej! Oh Bej! (Milan)',
    content: "One of Italy's oldest Christmas fairs. Busy, local, and unapologetically urban. This is a market people go to because it exists, not because it's charming.",
  },
  bergamo: {
    title: 'Bergamo Christmas Markets',
    content: 'The upper city transforms with markets along medieval streets. Less crowded than Milan, more atmospheric than practical.',
  },
  brescia: {
    title: 'Brescia Winter Markets',
    content: 'Piazza della Loggia hosts a proper market with local producers. Functional, organized, and distinctly Lombard.',
  },
  mantova: {
    title: 'Mantova Christmas',
    content: 'Renaissance squares dressed for winter. The markets here feel ceremonial rather than commercial.',
  },
};

// Winter destination modals
const destinationModals: Record<string, { title: string; content: string; whyItWorks: string }> = {
  bormio: {
    title: 'Bormio',
    content: 'Alpine resort with a real town behind it. Long winters, serious skiing, and Olympic pedigree.',
    whyItWorks: "It's built for sustained winter living, not weekend novelty.",
  },
  livigno: {
    title: 'Livigno',
    content: 'High-altitude, snow-secure, and lively even midweek.',
    whyItWorks: 'Consistent snow, strong infrastructure, and a social winter culture.',
  },
  aprica: {
    title: 'Aprica',
    content: 'Smaller, quieter, and more local.',
    whyItWorks: 'Accessible, manageable, and not dominated by spectacle.',
  },
  pontedilegno: {
    title: 'Ponte di Legno / Tonale',
    content: 'Reliable skiing and wide-open terrain.',
    whyItWorks: 'You go to ski, not to be seen.',
  },
  valmalenco: {
    title: 'Valmalenco',
    content: 'Snowshoeing, winter walking, and mountain life without resort intensity.',
    whyItWorks: 'Winter without adrenaline.',
  },
};

// Olympic venue modals
const olympicVenueModals: Record<string, { title: string; content: string }> = {
  milano: {
    title: 'Milan — Olympic Hub',
    content: 'Ceremonies and infrastructure center. The city coordinates without transforming.',
  },
  bormio: {
    title: 'Bormio — Olympic Venue',
    content: 'Preparation accelerates infrastructure already in place. What exists improves. Nothing is reinvented.',
  },
  livigno: {
    title: 'Livigno — Olympic Venue',
    content: 'Freestyle and snowboarding events. High-altitude reliability meets international attention.',
  },
};

export default function WinterInLombardia() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('traditions');
  const [activeTimelineSegment, setActiveTimelineSegment] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [showPanettonModal, setShowPanettonModal] = useState(false);
  const [startingPoint, setStartingPoint] = useState('milano');
  const [activity, setActivity] = useState('skiing');
  const [showOlympicOverlay, setShowOlympicOverlay] = useState(false);
  const [selectedOlympicVenue, setSelectedOlympicVenue] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Get highlighted provinces based on tab and state
  const getHighlightedProvinces = () => {
    if (activeTab === 'traditions') {
      if (activeTimelineSegment === 'early') {
        return christmasCities;
      }
      return [];
    }
    if (activeTab === 'recreation') {
      // For recreation, we highlight sondrio (contains mountain resorts)
      return ['sondrio', 'brescia'];
    }
    if (activeTab === 'sport') {
      if (showOlympicOverlay) {
        return ['milano', 'sondrio', 'brescia'];
      }
      return ['milano', 'bergamo'];
    }
    return [];
  };

  // Get highlight color based on tab
  const getHighlightColor = () => {
    if (activeTab === 'traditions') return '#38bdf8'; // sky-400
    if (activeTab === 'recreation') return '#34d399'; // emerald-400
    if (activeTab === 'sport' && showOlympicOverlay) return '#fbbf24'; // amber-400
    if (activeTab === 'sport') return '#34d399'; // emerald-400
    return '#38bdf8';
  };

  const highlightedProvinces = getHighlightedProvinces();

  // Handle province click on map
  const handleProvinceClick = (province: string) => {
    if (activeTab === 'traditions' && christmasCities.includes(province)) {
      setSelectedCity(province);
    } else if (activeTab === 'sport') {
      if (showOlympicOverlay && ['milano', 'sondrio', 'brescia'].includes(province)) {
        const venueMap: Record<string, string> = { milano: 'milano', sondrio: 'bormio', brescia: 'livigno' };
        setSelectedOlympicVenue(venueMap[province] || province);
      } else if (['milano', 'bergamo'].includes(province)) {
        setSelectedCity(province);
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Snowflake className="w-6 h-6 text-sky-400" />
            <span className="text-sm uppercase tracking-widest text-slate-400">Seasonal Focus</span>
            <Snowflake className="w-6 h-6 text-sky-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-cream-100 mb-4">
            Winter in Lombardia
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-6">
            Christmas, Cold, and a Region That Knows What It's Doing
          </p>
          <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Winter in Lombardia isn't endured, escaped, or aestheticized. It's organized. Cities keep moving, 
            mountains stay accessible, and traditions follow a calendar that people actually observe. 
            With Milano–Cortina approaching, winter reveals what this region has always been built for.
          </p>
        </div>

        {/* Main Content: Map + Tabs */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map Panel */}
          <div className="relative order-1 lg:order-1">
            <div className="sticky top-24">
              <div className="relative bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="relative aspect-[4/5] w-full">
                  <LombardyMapSVG
                    highlightedProvinces={highlightedProvinces}
                    highlightColor={getHighlightColor()}
                    onProvinceClick={handleProvinceClick}
                    showLabels={true}
                  />
                  
                  {/* Winter Destination Pins for Recreation tab - overlay on SVG */}
                  {activeTab === 'recreation' && (
                    <svg
                      viewBox="80 50 560 510"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      {Object.entries(winterDestinationPositions).map(([key, dest]) => (
                        <g 
                          key={key} 
                          className="pointer-events-auto cursor-pointer"
                          onClick={() => setSelectedDestination(key)}
                        >
                          <circle
                            cx={dest.x}
                            cy={dest.y}
                            r="12"
                            fill="rgba(52, 211, 153, 0.3)"
                            className="animate-ping"
                          />
                          <circle
                            cx={dest.x}
                            cy={dest.y}
                            r="8"
                            fill="#34d399"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={dest.x}
                            y={dest.y + 22}
                            textAnchor="middle"
                            className="text-[9px] font-medium fill-slate-200"
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                          >
                            {dest.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  )}
                </div>
                
                {/* Map Legend */}
                <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-slate-400">
                  {activeTab === 'traditions' && (
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-sky-400" />
                      Christmas Markets
                    </span>
                  )}
                  {activeTab === 'recreation' && (
                    <span className="flex items-center gap-1.5">
                      <Mountain className="w-4 h-4 text-emerald-400" />
                      Winter Destinations
                    </span>
                  )}
                  {activeTab === 'sport' && !showOlympicOverlay && (
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      Football Cities
                    </span>
                  )}
                  {activeTab === 'sport' && showOlympicOverlay && (
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      Olympic Venues 2026
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Content Panel */}
          <div className="order-2 lg:order-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-slate-800/50 border border-slate-700/50 p-1 rounded-lg mb-6">
                <TabsTrigger 
                  value="traditions" 
                  className="text-xs md:text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-cream-100 text-slate-400"
                >
                  <Calendar className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Christmas
                </TabsTrigger>
                <TabsTrigger 
                  value="recreation"
                  className="text-xs md:text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-cream-100 text-slate-400"
                >
                  <Snowflake className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Recreation
                </TabsTrigger>
                <TabsTrigger 
                  value="sport"
                  className="text-xs md:text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-cream-100 text-slate-400"
                >
                  <Trophy className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Sport
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Christmas & Winter Traditions */}
              <TabsContent value="traditions" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-cream-100 mb-2">
                      Christmas & Winter Traditions
                    </h3>
                    <p className="text-sm text-slate-400 italic mb-4">
                      Orderly, local, and quietly serious
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Lombard Christmas traditions aren't theatrical. They're municipal, food-driven, 
                      and rooted in habit rather than nostalgia.
                    </p>
                  </div>

                  {/* Timeline - Desktop */}
                  <div className="hidden md:block">
                    <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-4">December in Lombardia</h4>
                    <div className="flex gap-2">
                      {[
                        { id: 'early', label: 'Early December', desc: 'Markets open' },
                        { id: 'mid', label: 'Mid December', desc: 'Panettone peaks' },
                        { id: 'late', label: 'Late Dec → Epiphany', desc: 'Cities quiet' },
                      ].map((segment) => (
                        <button
                          key={segment.id}
                          onClick={() => setActiveTimelineSegment(activeTimelineSegment === segment.id ? null : segment.id)}
                          className={`flex-1 p-4 rounded-lg border transition-all text-left ${
                            activeTimelineSegment === segment.id
                              ? 'bg-slate-700/50 border-sky-500/50 text-cream-100'
                              : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">{segment.label}</div>
                          <div className="text-xs text-slate-500">{segment.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline - Mobile Accordion */}
                  <div className="md:hidden">
                    <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-4">December in Lombardia</h4>
                    <Accordion type="single" collapsible className="space-y-2">
                      <AccordionItem value="early" className="border-slate-700/50">
                        <AccordionTrigger 
                          className="text-cream-100 hover:text-cream-100"
                          onClick={() => setActiveTimelineSegment('early')}
                        >
                          Early December
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 text-sm">
                          Cities decorate early. Markets open quietly. No spectacle, no chaos.
                          <div className="mt-2 text-xs text-sky-400">Click pins on map: Milan, Bergamo, Brescia, Mantova</div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="mid" className="border-slate-700/50">
                        <AccordionTrigger 
                          className="text-cream-100 hover:text-cream-100"
                          onClick={() => setActiveTimelineSegment('mid')}
                        >
                          Mid December
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 text-sm">
                          Panettone season peaks. Bakeries compete. Supermarkets step aside.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="late" className="border-slate-700/50">
                        <AccordionTrigger 
                          className="text-cream-100 hover:text-cream-100"
                          onClick={() => setActiveTimelineSegment('late')}
                        >
                          Late December → Epiphany
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 text-sm">
                          Cities quiet. Families retreat. Public life slows but doesn't stop.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Timeline Content */}
                  {activeTimelineSegment && (
                    <div className="hidden md:block bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                      {activeTimelineSegment === 'early' && (
                        <div>
                          <p className="text-slate-300 text-sm mb-3">
                            Cities decorate early. Markets open quietly. No spectacle, no chaos.
                          </p>
                          <p className="text-xs text-sky-400">
                            Click the pins on the map to explore: Milan, Bergamo, Brescia, Mantova
                          </p>
                        </div>
                      )}
                      {activeTimelineSegment === 'mid' && (
                        <div>
                          <p className="text-slate-300 text-sm mb-3">
                            Panettone season peaks. Bakeries compete. Supermarkets step aside.
                          </p>
                          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 mt-3">
                            <p className="text-amber-200 text-sm">
                              <strong>Panettone was born in Milan.</strong> Lombards argue about crumb structure, 
                              fermentation time, and butter quality with the seriousness other regions reserve for politics.
                            </p>
                          </div>
                        </div>
                      )}
                      {activeTimelineSegment === 'late' && (
                        <div>
                          <p className="text-slate-300 text-sm mb-3">
                            Cities quiet. Families retreat. Public life slows but doesn't stop.
                          </p>
                          <p className="text-slate-400 text-xs italic mt-2">
                            Christmas here is social, not sentimental. It runs on schedules and shared expectations.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Panettone Trigger */}
                  <button
                    onClick={() => setShowPanettonModal(true)}
                    className="w-full text-left bg-gradient-to-r from-amber-900/30 to-slate-800/30 rounded-lg p-4 border border-amber-700/30 hover:border-amber-600/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-amber-200 font-medium">Why Panettone Matters Here</span>
                      <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                </div>
              </TabsContent>

              {/* TAB 2: Winter Recreation */}
              <TabsContent value="recreation" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-cream-100 mb-2">
                      Winter Recreation
                    </h3>
                    <p className="text-sm text-slate-400 italic mb-4">
                      From city streets to snow in under two hours
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Winter doesn't shrink life in Lombardia. It relocates it.
                    </p>
                  </div>

                  {/* Choose Your Winter Day */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                    <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-4">Choose Your Winter Day</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-400 mb-2 block">Starting Point</Label>
                        <Select value={startingPoint} onValueChange={setStartingPoint}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="milano">Milan</SelectItem>
                            <SelectItem value="bergamo">Bergamo</SelectItem>
                            <SelectItem value="brescia">Brescia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400 mb-2 block">Activity</Label>
                        <Select value={activity} onValueChange={setActivity}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="skiing">Skiing</SelectItem>
                            <SelectItem value="snowshoeing">Snowshoeing</SelectItem>
                            <SelectItem value="hiking">Winter Hiking</SelectItem>
                            <SelectItem value="spa">Thermal Spa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Destinations List */}
                  <div className="space-y-3">
                    <h4 className="text-sm uppercase tracking-wider text-slate-400">Key Destinations</h4>
                    {Object.entries(destinationModals).map(([key, dest]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedDestination(key)}
                        className="w-full text-left bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 hover:border-emerald-600/50 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-cream-100 font-medium flex items-center gap-2">
                              <Mountain className="w-4 h-4 text-emerald-400" />
                              {dest.title}
                            </div>
                            <div className="text-slate-400 text-sm mt-1">{dest.content}</div>
                          </div>
                          <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-slate-500 text-xs italic text-center">
                    Lombardy doesn't market winter. It maintains it.
                  </p>
                </div>
              </TabsContent>

              {/* TAB 3: Sport & Milano-Cortina */}
              <TabsContent value="sport" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-cream-100 mb-2">
                      Sport & the Milano–Cortina Lens
                    </h3>
                    <p className="text-sm text-slate-400 italic mb-4">
                      What changes, what doesn't
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Sport in Lombardia isn't about passion alone. It's about institutions, schedules, and collective attention.
                    </p>
                  </div>

                  {/* Everyday Sport */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                    <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-4">Everyday Sport (Always On)</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                        <div>
                          <div className="text-cream-100 font-medium">AC Milan & Inter</div>
                          <div className="text-slate-400 text-sm">Global clubs, local habits. Match days alter traffic, not identity.</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                        <div>
                          <div className="text-cream-100 font-medium">Atalanta (Bergamo)</div>
                          <div className="text-slate-400 text-sm">This one matters differently. Regional pride, local loyalty, no glamour.</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs italic mt-4">
                      In Lombardia, sport fits into life. Life doesn't rearrange itself around sport.
                    </p>
                  </div>

                  {/* Milano-Cortina 2026 Toggle */}
                  <div className="bg-gradient-to-r from-amber-900/20 to-slate-800/30 rounded-lg p-4 border border-amber-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm uppercase tracking-wider text-amber-200">Milano–Cortina 2026</h4>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="olympic-toggle" className="text-xs text-slate-400">Show Venues</Label>
                        <Switch
                          id="olympic-toggle"
                          checked={showOlympicOverlay}
                          onCheckedChange={setShowOlympicOverlay}
                        />
                      </div>
                    </div>
                    
                    {showOlympicOverlay && (
                      <div className="space-y-3 text-sm">
                        <p className="text-slate-300">
                          Olympic venues highlighted on the map. Click to explore.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['milano', 'bormio', 'livigno'].map((venue) => (
                            <button
                              key={venue}
                              onClick={() => setSelectedOlympicVenue(venue)}
                              className="px-3 py-1.5 bg-amber-800/30 border border-amber-700/50 rounded-full text-amber-200 text-xs hover:bg-amber-700/40 transition-colors capitalize"
                            >
                              {venue === 'milano' ? 'Milan' : venue}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* What Changes / What Doesn't */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm uppercase tracking-wider text-emerald-400 mb-3">What Changes</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          International visibility
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Transport pressure in peak periods
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Investment timelines accelerate
                        </li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-3">What Doesn't</h4>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          Cost of living
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          Climate
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          Regional temperament
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          Bureaucratic expectations
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-amber-200/80 text-sm font-medium text-center py-2">
                    The Olympics don't transform Lombardia. They validate it.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* End-of-Section Anchor */}
        <div className="mt-16 pt-8 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto">
            Winter reveals whether a place is functional or fragile. Lombardia has been preparing for it for centuries.
          </p>
        </div>
      </div>

      {/* City Modal */}
      <Dialog open={!!selectedCity} onOpenChange={() => setSelectedCity(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cream-100 font-serif text-xl">
              {selectedCity && cityModals[selectedCity]?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300 mt-4">
              {selectedCity && cityModals[selectedCity]?.content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Destination Modal */}
      <Dialog open={!!selectedDestination} onOpenChange={() => setSelectedDestination(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cream-100 font-serif text-xl flex items-center gap-2">
              <Mountain className="w-5 h-5 text-emerald-400" />
              {selectedDestination && destinationModals[selectedDestination]?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300 mt-4 space-y-4">
              <p>{selectedDestination && destinationModals[selectedDestination]?.content}</p>
              <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3">
                <p className="text-emerald-200 text-sm">
                  <strong>Why it works:</strong> {selectedDestination && destinationModals[selectedDestination]?.whyItWorks}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Panettone Modal */}
      <Dialog open={showPanettonModal} onOpenChange={setShowPanettonModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif text-xl">
              Why Panettone Matters Here
            </DialogTitle>
            <DialogDescription className="text-slate-300 mt-4 space-y-4">
              <p>
                Panettone isn't dessert in Lombardia. It's craft. Milanese bakers treat it as a technical benchmark: 
                long fermentation, high butter content, no shortcuts. December isn't about indulgence. It's about execution.
              </p>
              <p className="text-amber-200/80 text-sm italic">
                If you don't like panettone, Lombardy will not apologize.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Olympic Venue Modal */}
      <Dialog open={!!selectedOlympicVenue} onOpenChange={() => setSelectedOlympicVenue(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif text-xl flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              {selectedOlympicVenue && olympicVenueModals[selectedOlympicVenue]?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300 mt-4">
              {selectedOlympicVenue && olympicVenueModals[selectedOlympicVenue]?.content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
