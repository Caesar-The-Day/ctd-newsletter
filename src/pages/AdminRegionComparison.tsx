import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegionRegistry, RegionRegistry, getRegionData, RegionData } from '@/utils/getRegionData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, GitCompare, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function AdminRegionComparison() {
  const [registry, setRegistry] = useState<RegionRegistry | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regionDataLive, setRegionDataLive] = useState<RegionData | null>(null);
  const [regionDataDraft, setRegionDataDraft] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRegistry();
  }, []);

  const loadRegistry = async () => {
    const reg = await getRegionRegistry();
    setRegistry(reg);
  };

  const loadComparison = async (slug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, this would load two versions:
      // - Live version from published data
      // - Draft version from draft data
      // For now, we'll simulate by loading the same data twice
      const data = await getRegionData(slug);
      setRegionDataLive(data);
      setRegionDataDraft(data); // Simulate draft
      setLoading(false);
    } catch (err) {
      setError('Failed to load region data for comparison');
      setLoading(false);
    }
  };

  const handleRegionSelect = (slug: string) => {
    setSelectedRegion(slug);
    loadComparison(slug);
  };

  const regions = registry?.regions || {};
  const regionsList = Object.entries(regions).filter(([_, region]) => region.status === 'live');

  const getDifferences = () => {
    if (!regionDataLive || !regionDataDraft) return [];

    // Simulate differences for demo
    return [
      {
        section: 'Towns',
        field: 'featured[0].name',
        live: 'Torino',
        draft: 'Turin (Updated)',
        status: 'modified' as const
      },
      {
        section: 'Climate',
        field: 'intro.headline',
        live: 'Four Distinct Seasons',
        draft: 'Four Distinct Seasons',
        status: 'unchanged' as const
      },
      {
        section: 'Cost of Living',
        field: 'townPresets[0].modest.rent',
        live: '800',
        draft: '850',
        status: 'modified' as const
      },
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link to="/admin/regions">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <GitCompare className="h-8 w-8" />
              Region Comparison
            </h1>
            <p className="text-muted-foreground mt-2">
              Compare live and draft versions side by side
            </p>
          </div>
        </div>

        {/* Region Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Region to Compare</CardTitle>
            <CardDescription>
              Choose a region to view differences between live and draft versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedRegion} onValueChange={handleRegionSelect}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Choose a region..." />
                </SelectTrigger>
                <SelectContent>
                  {regionsList.map(([slug, region]) => (
                    <SelectItem key={slug} value={slug}>
                      {region.displayName}
                      <Badge variant="outline" className="ml-2">
                        {region.status}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRegion && (
                <Button onClick={() => loadComparison(selectedRegion)}>
                  Reload Comparison
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison View */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading comparison...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && selectedRegion && regionDataLive && regionDataDraft && (
          <Tabs defaultValue="side-by-side" className="w-full">
            <TabsList>
              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
              <TabsTrigger value="differences">Differences Only</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="side-by-side" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Live Version */}
                <Card>
                  <CardHeader className="bg-green-500/10 border-b border-green-500/20">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">LIVE</Badge>
                      Published Version
                    </CardTitle>
                    <CardDescription>
                      Currently visible to public
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <DataSection title="Basic Info" data={{
                      'Title': regionDataLive.region.title,
                      'Tagline': regionDataLive.region.tagline,
                      'Issue #': regionDataLive.region.issueNumber,
                      'Date': regionDataLive.region.date,
                    }} />
                    
                    <DataSection title="Featured Towns" data={{
                      'Count': regionDataLive.towns.featured.length,
                      'First Town': regionDataLive.towns.featured[0]?.name || 'N/A',
                    }} />

                    <DataSection title="Content Sections" data={{
                      'Recipes': regionDataLive.recipes.cards.length,
                      'Hospitals': regionDataLive.healthcare.hospitals.length,
                      'Highlights': Object.keys(regionDataLive.highlights).length - 1,
                    }} />
                  </CardContent>
                </Card>

                {/* Draft Version */}
                <Card>
                  <CardHeader className="bg-yellow-500/10 border-b border-yellow-500/20">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-yellow-600">DRAFT</Badge>
                      Working Version
                    </CardTitle>
                    <CardDescription>
                      Not yet published
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <DataSection title="Basic Info" data={{
                      'Title': regionDataDraft.region.title,
                      'Tagline': regionDataDraft.region.tagline,
                      'Issue #': regionDataDraft.region.issueNumber,
                      'Date': regionDataDraft.region.date,
                    }} />
                    
                    <DataSection title="Featured Towns" data={{
                      'Count': regionDataDraft.towns.featured.length,
                      'First Town': regionDataDraft.towns.featured[0]?.name || 'N/A',
                    }} />

                    <DataSection title="Content Sections" data={{
                      'Recipes': regionDataDraft.recipes.cards.length,
                      'Hospitals': regionDataDraft.healthcare.hospitals.length,
                      'Highlights': Object.keys(regionDataDraft.highlights).length - 1,
                    }} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="differences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Changed Fields</CardTitle>
                  <CardDescription>
                    Only showing fields that differ between versions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getDifferences().filter(d => d.status === 'modified').map((diff, idx) => (
                      <DifferenceRow key={idx} difference={diff} />
                    ))}

                    {getDifferences().filter(d => d.status === 'modified').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No differences found between versions</p>
                        <p className="text-sm mt-2">
                          This demo shows simulated differences. In production, this would detect actual changes.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="mt-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataSection title="Registry Info" data={{
                      'Status': regions[selectedRegion]?.status,
                      'Locked': regions[selectedRegion]?.locked ? 'Yes' : 'No',
                      'Version': regions[selectedRegion]?.version,
                      'Published': regions[selectedRegion]?.publishedDate || 'N/A',
                      'Color Scheme': regions[selectedRegion]?.colorScheme,
                    }} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Draft Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="bg-yellow-500/10 border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription>
                        In production, draft versions would have their own metadata tracking changes, timestamps, and version history.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Instructions */}
        {!selectedRegion && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">1. Select a Region:</strong> Choose a region from the dropdown above
              </div>
              <div>
                <strong className="text-foreground">2. View Side by Side:</strong> Compare live vs draft versions in parallel
              </div>
              <div>
                <strong className="text-foreground">3. Check Differences:</strong> See only the fields that have changed
              </div>
              <div>
                <strong className="text-foreground">4. Review Metadata:</strong> Inspect version info and registry details
              </div>
              <div className="pt-2 border-t text-xs">
                <strong className="text-foreground">📝 Note:</strong> Currently showing simulated differences. In production, this would load actual live and draft data from separate sources and calculate real differences.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DataSection({ title, data }: { title: string; data: Record<string, any> }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{key}:</span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifferenceRow({ difference }: { 
  difference: { 
    section: string; 
    field: string; 
    live: string; 
    draft: string; 
    status: 'modified' | 'unchanged' 
  } 
}) {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      difference.status === 'modified' && "bg-yellow-500/5 border-yellow-500/20"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <Badge variant="outline" className="text-xs">{difference.section}</Badge>
          <p className="text-sm font-medium mt-1">{difference.field}</p>
        </div>
        <Badge variant={difference.status === 'modified' ? 'default' : 'outline'}>
          {difference.status}
        </Badge>
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mt-3">
        <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-muted-foreground mb-1">LIVE</p>
          <p className="text-sm font-mono">{difference.live}</p>
        </div>

        <ArrowRight className="h-4 w-4 text-muted-foreground" />

        <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-muted-foreground mb-1">DRAFT</p>
          <p className="text-sm font-mono">{difference.draft}</p>
        </div>
      </div>
    </div>
  );
}
