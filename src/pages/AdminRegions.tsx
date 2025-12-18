import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegionRegistry, RegionRegistry, RegionRegistryEntry } from '@/utils/getRegionData';
import { 
  scaffoldRegionApi, 
  updateRegionLockApi, 
  setActiveRegionApi, 
  publishRegionApi 
} from '@/utils/regionApi';
import { 
  getPendingOperations,
  clearPendingOperations,
  archiveRegion
} from '@/utils/regionManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Plus, Eye, Power, ArrowLeft, AlertCircle, Rocket, Archive, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminRegions() {
  const [registry, setRegistry] = useState<RegionRegistry | null>(null);
  const [aiInstructions, setAiInstructions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [lastScaffoldResult, setLastScaffoldResult] = useState<any>(null);
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

    setActionLoading(`lock-${slug}`);
    const result = await updateRegionLockApi(slug, !currentLocked);
    setActionLoading(null);
    
    if (result.success) {
      toast({
        title: currentLocked ? 'Region Unlocked' : 'Region Locked',
        description: result.message,
      });
      await loadData();
    } else {
      toast({
        title: 'Error',
        description: result.error || result.message,
        variant: 'destructive',
      });
    }
  };

  const handleSetActive = async (slug: string) => {
    setActionLoading(`active-${slug}`);
    const result = await setActiveRegionApi(slug);
    setActionLoading(null);
    
    if (result.success) {
      toast({
        title: 'Active Region Set',
        description: result.message,
      });
      await loadData();
    } else {
      toast({
        title: 'Error',
        description: result.error || result.message,
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

    setActionLoading('create');
    const result = await scaffoldRegionApi({
      slug: formData.slug,
      displayName: formData.displayName,
      issueNumber: parseInt(formData.issueNumber) || 1,
      colorScheme: formData.colorScheme
    });
    setActionLoading(null);

    if (result.success) {
      setLastScaffoldResult(result.data);
      toast({
        title: 'Region Scaffolded Successfully',
        description: (
          <div className="mt-2">
            <p>{result.message}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              Generated files: {result.data?.filesToCreate?.join(', ')}
            </p>
          </div>
        ),
      });

      setDialogOpen(false);
      setFormData({ slug: '', displayName: '', issueNumber: '', colorScheme: 'default' });
      await loadData();
    } else {
      toast({
        title: 'Error',
        description: result.error || result.message,
        variant: 'destructive',
      });
    }
  };

  const handlePublishRegion = async () => {
    if (!selectedRegion) return;

    const confirmed = window.confirm(
      `🚀 PUBLISH "${selectedRegion}"\n\nThis will:\n• Change status to LIVE\n• Lock the region\n• Make it publicly visible\n\nAre you ready to publish?`
    );

    if (!confirmed) return;

    setActionLoading(`publish-${selectedRegion}`);
    const result = await publishRegionApi(selectedRegion);
    setActionLoading(null);
    
    if (result.success) {
      toast({
        title: 'Region Published',
        description: result.message,
      });
      setPublishDialogOpen(false);
      setSelectedRegion(null);
      await loadData();
    } else {
      toast({
        title: 'Error',
        description: result.error || result.message,
        variant: 'destructive',
      });
    }
  };

  const handleArchiveRegion = async (slug: string) => {
    const confirmed = window.confirm(
      `📦 ARCHIVE "${slug}"\n\nThis will remove the region from public view but preserve all data. Continue?`
    );

    if (!confirmed) return;

    setActionLoading(`archive-${slug}`);
    const result = await archiveRegion(slug);
    setActionLoading(null);
    
    if (result.success) {
      toast({
        title: 'Region Archived',
        description: result.message,
      });
      await loadData();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleClearOperations = () => {
    const confirmed = window.confirm(
      '⚠️ Clear all pending operations?\n\nThis will reset all simulated changes in localStorage.'
    );

    if (!confirmed) return;

    clearPendingOperations();
    toast({
      title: 'Operations Cleared',
      description: 'All pending operations have been cleared.',
    });
  };

  const pendingOps = getPendingOperations();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground ml-3">Loading admin panel...</p>
      </div>
    );
  }

  const regions = registry?.regions || {};
  const activeRegion = aiInstructions?.activeRegion;

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
                  Create a new region from the template. This will call the backend to generate all necessary files.
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
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
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
                      <SelectItem value="default">Default (Mediterranean Blue)</SelectItem>
                      <SelectItem value="piemonte-theme">Piemonte (Warm Fall)</SelectItem>
                      <SelectItem value="coastal-theme">Coastal (Azure Blue)</SelectItem>
                      <SelectItem value="custom">Custom (Generate later)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <strong>Backend Function:</strong> This will call the <code>scaffold-region</code> edge function to generate region data structures.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={actionLoading === 'create'}>
                    {actionLoading === 'create' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Draft Region'
                    )}
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

        {/* Last Scaffold Result */}
        {lastScaffoldResult && (
          <Alert className="mb-6 border-green-500 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Last Scaffold:</strong> {lastScaffoldResult.registryEntry?.displayName}
                  <span className="text-xs text-muted-foreground ml-2">
                    (Active region set to: {lastScaffoldResult.aiInstructions?.activeRegion})
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setLastScaffoldResult(null)}>
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Operations (Dev Only) */}
        {(pendingOps.scaffoldQueue.length > 0 || 
          Object.keys(pendingOps.lockChanges).length > 0 || 
          pendingOps.publishQueue.length > 0) && (
          <Alert className="mb-6 border-orange-500 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-foreground flex items-center justify-between">
              <div>
                <strong>Local Storage Cache:</strong> {
                  pendingOps.scaffoldQueue.length + 
                  Object.keys(pendingOps.lockChanges).length + 
                  pendingOps.publishQueue.length
                } cached operation(s)
              </div>
              <Button variant="outline" size="sm" onClick={handleClearOperations}>
                Clear Cache
              </Button>
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
                            disabled={actionLoading === `active-${slug}`}
                          >
                            {actionLoading === `active-${slug}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Power className="h-4 w-4 mr-1" />
                                Set Active
                              </>
                            )}
                          </Button>
                        )}

                        {region.status === 'draft' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedRegion(slug);
                              setPublishDialogOpen(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Rocket className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}

                        {region.status === 'live' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveRegion(slug)}
                            disabled={actionLoading === `archive-${slug}`}
                          >
                            {actionLoading === `archive-${slug}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Archive className="h-4 w-4 mr-1" />
                                Archive
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          variant={region.locked ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleLock(slug, region.locked)}
                          disabled={actionLoading === `lock-${slug}`}
                        >
                          {actionLoading === `lock-${slug}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : region.locked ? (
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
          </CardContent>
        </Card>

        {/* Publish Confirmation Dialog */}
        <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish Region: {selectedRegion}</DialogTitle>
              <DialogDescription>
                This will make the region publicly visible and lock it from further edits.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <Rocket className="h-4 w-4" />
                <AlertDescription>
                  <strong>This action will:</strong>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Change status from DRAFT to LIVE</li>
                    <li>Lock the region (prevent modifications)</li>
                    <li>Update the newsletter index</li>
                    <li>Make the region visible on the map</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handlePublishRegion}
                disabled={actionLoading === `publish-${selectedRegion}`}
              >
                {actionLoading === `publish-${selectedRegion}` ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Publish Now
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🆕 Creating a Region</h4>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Click "Create New Region"</li>
                  <li>Fill in region details</li>
                  <li>Edge function generates JSON files</li>
                  <li>Region is set as ACTIVE for AI work</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🚀 Publishing Flow</h4>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Work on region content while it's DRAFT</li>
                  <li>Click "Publish" when ready</li>
                  <li>Region becomes LIVE and LOCKED</li>
                  <li>Map automatically shows new region</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔒 Lock Protection</h4>
                <p className="text-sm text-muted-foreground">
                  LOCKED regions cannot be modified. This protects published content.
                  Unlocking requires confirmation and should only be done for urgent fixes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Active Region</h4>
                <p className="text-sm text-muted-foreground">
                  Setting a region as ACTIVE tells the AI to focus exclusively on that region.
                  This prevents accidental modifications to other regions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
