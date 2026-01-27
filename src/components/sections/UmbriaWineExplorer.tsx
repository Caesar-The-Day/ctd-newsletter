import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wine, ExternalLink, Grape } from 'lucide-react';

// Import wine images
import sagrantinoWineImg from '@/assets/umbria/sagrantino-wine.jpg';
import orvietoWineImg from '@/assets/umbria/orvieto-wine.jpg';
import torgianoWineImg from '@/assets/umbria/torgiano-wine.jpg';

interface WineProfile {
  id: string;
  name: string;
  classification: 'DOCG' | 'DOC';
  type: 'red' | 'white';
  image: string;
  tagline: string;
  description: string;
  keyFact: string;
  pairing: string;
  priceRange: string;
  link: string;
  linkLabel: string;
}

const wines: WineProfile[] = [
  {
    id: 'sagrantino',
    name: 'Sagrantino di Montefalco',
    classification: 'DOCG',
    type: 'red',
    image: sagrantinoWineImg,
    tagline: 'The Bold One',
    description: "Italy's most tannic red — bigger than Barolo, more structured than Brunello. This is a wine that demands attention and rewards patience. World-class aging potential if you can wait 10+ years.",
    keyFact: 'Only 2,500 acres planted worldwide, all in Umbria. The grape nearly went extinct in the 1970s.',
    pairing: 'Wild boar, aged pecorino, piccione alla ghiotta',
    priceRange: '€25–€80',
    link: 'https://www.consorziomontefalco.it/en/',
    linkLabel: 'Consorzio Montefalco'
  },
  {
    id: 'orvieto',
    name: 'Orvieto Classico',
    classification: 'DOC',
    type: 'white',
    image: orvietoWineImg,
    tagline: 'The Everyday One',
    description: "Umbria's most famous white — crisp, floral, and incredibly food-friendly. The 'Classico' zone produces the best examples. Look for Grechetto-dominant blends for more character.",
    keyFact: 'Historically made sweet (abboccato) for papal courts. Dry is the modern style.',
    pairing: 'Lake Trasimeno fish, antipasti, truffle dishes',
    priceRange: '€8–€18',
    link: 'https://www.orvietodoc.it/',
    linkLabel: 'Consorzio Orvieto'
  },
  {
    id: 'torgiano',
    name: 'Torgiano Rosso Riserva',
    classification: 'DOCG',
    type: 'red',
    image: torgianoWineImg,
    tagline: 'The Secret One',
    description: "Umbria's other DOCG red — Sangiovese-based, comparable to top Brunello. Lungarotti's 'Rubesco Riserva' is legendary. The wine museum in Torgiano is worth the trip alone.",
    keyFact: 'Only one producer (Lungarotti) makes most of it. Must age minimum 3 years before release.',
    pairing: 'Bistecca, umbricelli con ragù d\'oca, aged Parmigiano',
    priceRange: '€30–€60',
    link: 'https://lungarotti.it/eng/',
    linkLabel: 'Lungarotti Winery'
  }
];

export function UmbriaWineExplorer() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-purple-50/30">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Wine className="h-4 w-4" />
            Wine Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Three Wines <span className="text-purple-600">You Need to Know</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Umbria's wines aren't famous because Tuscany got there first. But serious wine people know: 
            <strong className="text-foreground"> Sagrantino is Italy's biggest secret</strong>, and Orvieto punches above its weight class.
          </p>
        </div>

        {/* Wine Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {wines.map(wine => (
            <Card key={wine.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Image */}
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={wine.image} 
                  alt={wine.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${wine.type === 'red' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'}
                  `}>
                    {wine.type === 'red' ? 'Red' : 'White'}
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-foreground">
                    {wine.classification}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Title */}
                <p className="text-sm font-medium text-purple-600 mb-1">{wine.tagline}</p>
                <h3 className="text-xl font-bold mb-3">{wine.name}</h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {wine.description}
                </p>
                
                {/* Key Fact */}
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-purple-800 mb-1">What to Know</p>
                  <p className="text-sm text-muted-foreground">{wine.keyFact}</p>
                </div>
                
                {/* Pairing & Price */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-muted-foreground w-16">Pairs with:</span>
                    <span className="text-sm">{wine.pairing}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-muted-foreground w-16">Price:</span>
                    <span className="text-sm font-medium">{wine.priceRange}</span>
                  </div>
                </div>
                
                {/* Link Button */}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={wine.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {wine.linkLabel}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editorial Footer */}
        <div className="bg-gradient-to-r from-purple-50 to-rose-50 rounded-2xl p-6 md:p-8 border border-purple-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Grape className="h-5 w-5 text-purple-600" />
            The Insider Take
          </h4>
          <p className="text-muted-foreground">
            <strong>Don't leave Umbria without trying Sagrantino Passito</strong> — the dried-grape dessert wine version. 
            It's liquid history, made the same way for 500 years. Pair it with dark chocolate (preferably from Perugia) 
            and you'll understand why the monks kept this secret. For everyday drinking, a €12 Rosso di Montefalco 
            will outperform most €30 Chiantis.
          </p>
        </div>
      </div>
    </section>
  );
}

export default UmbriaWineExplorer;
