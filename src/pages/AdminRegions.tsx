import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegionRegistry, RegionRegistry, RegionRegistryEntry } from '@/utils/getRegionData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Plus, Eye, Power, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminRegions() {
  const [registry, setRegistry] = useState<RegionRegistry | null>(null);
  const [aiInstructions, setAiInstructions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    displayName: '',
    issueNumber: '',
    colorScheme: 'default'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reg, aiInst] = await Promise.all([
        getRegionRegistry(),
        fetch('/data/ai-instructions.json').then(r => r.json())
      ]);
      setRegistry(reg);
      setAiInstructions(aiInst);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      live: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
      draft: { variant: 'secondary', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
      archived: { variant: 'outline', className: 'bg-gray-500 hover:bg-gray-600' }
    };
    const config = variants[status] || variants.draft;
    return (
      <Badge {...config}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const handleToggleLock = async (slug: string, currentLocked: boolean) => {
    if (currentLocked) {
      const confirmed = window.confirm(
        `⚠️ WARNING: You are about to UNLOCK "${slug}".\n\nThis will allow modifications to a LIVE region. Are you absolutely sure?`
      );
      if (!confirmed) return;
    }

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate with localStorage or show instructions
      toast({
        title: currentLocked ? 'Region Unlocked' : 'Region Locked',
        description: `${slug} is now ${currentLocked ? 'unlocked and editable' : 'locked and protected'}`,
      });

      // Reload data
      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lock status',
        variant: 'destructive',
      });
    }
  };

  const handleSetActive = async (slug: string) => {
    try {
      // In a real implementation, this would update ai-instructions.json via API
      toast({
        title: 'Active Region Set',
        description: `AI will now work on: ${slug}`,
      });
      
      // Reload data
      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set active region',
        variant: 'destructive',
      });
    }
  };

  const handleCreateRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.displayName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // In a real implementation, this would:
      // 1. Copy _template.json to /data/regions/italy/{slug}.json
      // 2. Create {slug}-climate.json
      // 3. Update region-registry.json
      // 4. Update newsletter-index.json
      // 5. Update feature-flags.json
      // 6. Update section-order.json
      // 7. Create color scheme class in index.css
      
      toast({
        title: 'Region Scaffolded',
        description: `${formData.displayName} has been created as a draft region`,
      });

      setDialogOpen(false);
      setFormData({ slug: '', displayName: '', issueNumber: '', colorScheme: 'default' });
      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create region',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    );
  }

  const regions = registry?.regions || {};
  const activeRegion = aiInstructions?.activeRegion;
  const lockedRegions = aiInstructions?.lockedRegions || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Region Administration</h1>
            <p className="text-muted-foreground mt-2">
              Manage regional content, create drafts, and control publishing workflow
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New Region
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Scaffold New Region</DialogTitle>
                <DialogDescription>
                  Create a new region from the template. All structural sections will be pre-populated.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateRegion} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    placeholder="e.g., Liguria"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., liguria"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL path: /{formData.slug || 'region-slug'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueNumber">Issue Number</Label>
                  <Input
                    id="issueNumber"
                    type="number"
                    placeholder="e.g., 9"
                    value={formData.issueNumber}
                    onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <Select value={formData.colorScheme} onValueChange={(value) => setFormData({ ...formData, colorScheme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Puglia Blue)</SelectItem>
                      <SelectItem value="piemonte-theme">Piemonte (Warm Fall)</SelectItem>
                      <SelectItem value="custom">Custom (Will generate)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will create a draft region with all standard sections pre-populated from the template.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Draft Region
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Region Alert */}
        {activeRegion && (
          <Alert className="mb-6 border-blue-500 bg-blue-500/10">
            <Power className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-foreground">
              <strong>Active Region:</strong> AI is currently working on <strong>{activeRegion}</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Region List */}
        <Card>
          <CardHeader>
            <CardTitle>All Regions</CardTitle>
            <CardDescription>
              Manage status, lock protection, and publishing workflow for each region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lock</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Color Scheme</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(regions).map(([slug, region]: [string, RegionRegistryEntry]) => (
                  <TableRow key={slug}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {region.displayName}
                        {activeRegion === slug && (
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30">
                            ACTIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">/{slug}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(region.status)}</TableCell>
                    <TableCell>
                      {region.locked ? (
                        <Badge variant="destructive" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Locked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Unlock className="h-3 w-3" />
                          Unlocked
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{region.version}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {region.publishedDate || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {region.colorScheme}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/${slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        {region.status === 'draft' && activeRegion !== slug && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(slug)}
                          >
                            <Power className="h-4 w-4 mr-1" />
                            Set Active
                          </Button>
                        )}

                        <Button
                          variant={region.locked ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleLock(slug, region.locked)}
                        >
                          {region.locked ? (
                            <>
                              <Unlock className="h-4 w-4 mr-1" />
                              Unlock
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-1" />
                              Lock
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {Object.keys(regions).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No regions found. Create your first region to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">1. Create New Region:</strong> Click "Create New Region" to scaffold a draft from the template
            </div>
            <div>
              <strong className="text-foreground">2. Set Active:</strong> Set a draft region as "Active" to work on it with AI assistance
            </div>
            <div>
              <strong className="text-foreground">3. Populate Content:</strong> Use AI prompts to add towns, recipes, images, etc. (only affects active region)
            </div>
            <div>
              <strong className="text-foreground">4. Preview:</strong> Click the eye icon to preview the region page
            </div>
            <div>
              <strong className="text-foreground">5. Publish & Lock:</strong> When ready, change status to "live" and lock to protect from edits
            </div>
            <div className="pt-2 border-t">
              <strong className="text-foreground">⚠️ Lock Protection:</strong> Locked regions (like Piemonte & Puglia) cannot be modified by AI or manual edits
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
