import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegionRegistry, RegionRegistry, RegionRegistryEntry } from '@/utils/getRegionData';
import { 
  scaffoldNewRegion, 
  updateRegionLock, 
  setActiveRegion, 
  publishRegion,
  archiveRegion,
  getPendingOperations,
  clearPendingOperations
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
import { Lock, Unlock, Plus, Eye, Power, ArrowLeft, AlertCircle, Rocket, Archive, Trash2, Palette, GitCompare, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminRegions() {
  const [registry, setRegistry] = useState<RegionRegistry | null>(null);
  const [aiInstructions, setAiInstructions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
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
    switch (status) {
      case 'live':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent">Live</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-transparent">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border-transparent">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleToggleLock = async (slug: string, currentLocked: boolean) => {
    if (currentLocked) {
      const confirmed = window.confirm(
        `⚠️ WARNING: You are about to UNLOCK "${slug}".\n\nThis will allow modifications to a LIVE region. Are you absolutely sure?`
      );
      if (!confirmed) return;
    }

    const result = await updateRegionLock(slug, !currentLocked);
    
    if (result.success) {
      toast({
        title: currentLocked ? 'Region Unlocked' : 'Region Locked',
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

  const handleSetActive = async (slug: string) => {
    const result = await setActiveRegion(slug);
    
    if (result.success) {
      toast({
        title: 'Active Region Set',
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

    const result = await scaffoldNewRegion({
      slug: formData.slug,
      displayName: formData.displayName,
      issueNumber: formData.issueNumber,
      colorScheme: formData.colorScheme
    });

    if (result.success) {
      toast({
        title: 'Region Scaffolded',
        description: result.message,
      });

      setDialogOpen(false);
      setFormData({ slug: '', displayName: '', issueNumber: '', colorScheme: 'default' });
      await loadData();
    } else {
      toast({
        title: 'Error',
        description: result.message,
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

    const result = await publishRegion(selectedRegion);
    
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
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleArchiveRegion = async (slug: string) => {
    const confirmed = window.confirm(
      `📦 ARCHIVE "${slug}"\n\nThis will remove the region from public view but preserve all data. Continue?`
    );

    if (!confirmed) return;

    const result = await archiveRegion(slug);
    
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
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    );
  }

  const regions = registry?.regions || {};
  const activeRegion = aiInstructions?.activeRegion;
  const lockedRegions = aiInstructions?.lockedRegions || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="w-full md:w-auto">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4 -ml-3">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Site
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Region Administration</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage regional content, create drafts, and control publishing workflow
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Tools
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/admin/color-generator" className="flex items-center cursor-pointer">
                    <Palette className="mr-2 h-4 w-4" />
                    Color Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/comparison" className="flex items-center cursor-pointer">
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare Versions
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
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
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <Power className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              <strong className="font-semibold">Active Region:</strong> AI is currently working on <strong className="font-bold">{activeRegion}</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Operations (Dev Only) */}
        {(pendingOps.scaffoldQueue.length > 0 || 
          Object.keys(pendingOps.lockChanges).length > 0 || 
          pendingOps.publishQueue.length > 0) && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-900 dark:text-amber-100">
              <div className="flex items-center justify-between">
                <span>
                  <strong className="font-semibold">Development Mode:</strong> {
                    pendingOps.scaffoldQueue.length + 
                    Object.keys(pendingOps.lockChanges).length + 
                    pendingOps.publishQueue.length
                  } pending operation(s) in localStorage
                </span>
                <Button variant="outline" size="sm" className="h-7 ml-4" onClick={handleClearOperations}>
                  Clear All
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Region List */}
        {loading ? (
          <Card className="mb-8 border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : Object.keys(regions).length === 0 ? (
          <Card className="mb-8 border-border/50 shadow-sm">
            <CardContent className="p-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No regions yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Get started by creating your first region
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Region
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-xl">All Regions</CardTitle>
              <CardDescription className="text-sm">
                Manage status, lock protection, and publishing workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px] pl-6">Region</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px]">Lock Status</TableHead>
                      <TableHead className="w-[80px]">Version</TableHead>
                      <TableHead className="w-[120px]">Published</TableHead>
                      <TableHead className="w-[140px]">Color Scheme</TableHead>
                      <TableHead className="text-right pr-6 w-auto min-w-[280px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(regions).map(([slug, region]: [string, RegionRegistryEntry]) => (
                      <TableRow key={slug} className="hover:bg-muted/50 transition-colors border-b border-border/50">
                        <TableCell className="font-medium py-4 pl-6">
                          <div className="flex items-center gap-2">
                            {region.displayName}
                            {activeRegion === slug && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 border">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">/{slug}</p>
                        </TableCell>
                        <TableCell className="py-4">{getStatusBadge(region.status)}</TableCell>
                        <TableCell className="py-4">
                          {region.locked ? (
                            <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-transparent">
                              Locked
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent">
                              Unlocked
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-muted-foreground">{region.version}</TableCell>
                        <TableCell className="py-4 text-sm text-muted-foreground">
                          {region.publishedDate || 'Not published'}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-xs text-muted-foreground">{region.colorScheme}</span>
                        </TableCell>
                        <TableCell className="py-4 pr-6">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <Link to={`/${slug}`}>
                              <Button variant="ghost" size="sm" className="h-8">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            {region.status === 'draft' && activeRegion !== slug && (
                              <Button variant="outline" size="sm" className="h-8" onClick={() => handleSetActive(slug)}>
                                <Power className="h-3.5 w-3.5 mr-1.5" />
                                Activate
                              </Button>
                            )}
                            {region.status === 'draft' && (
                              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
                                setSelectedRegion(slug);
                                setPublishDialogOpen(true);
                              }}>
                                <Rocket className="h-3.5 w-3.5 mr-1.5" />
                                Publish
                              </Button>
                            )}
                            {region.status === 'live' && (
                              <Button variant="outline" size="sm" className="h-8" onClick={() => handleArchiveRegion(slug)}>
                                <Archive className="h-3.5 w-3.5 mr-1.5" />
                                Archive
                              </Button>
                            )}
                            <Button
                              variant={region.locked ? 'destructive' : 'default'}
                              size="sm"
                              className="h-8"
                              onClick={() => handleToggleLock(slug, region.locked)}
                            >
                              {region.locked ? (
                                <>
                                  <Unlock className="h-3.5 w-3.5 mr-1.5" />
                                  Unlock
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3.5 w-3.5 mr-1.5" />
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Guide</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Create Region</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Scaffold a new draft from template with all necessary files
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Set Active for AI</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Activate a draft so the AI works on this region
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Lock/Unlock</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Control whether AI can modify a region
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium text-sm">Publish or Archive</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Make drafts live or archive regions from public view
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publish Confirmation Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🚀 Publish Region</DialogTitle>
            <DialogDescription>
              Publishing will make this region live and automatically lock it for protection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert>
              <Rocket className="h-4 w-4" />
              <AlertDescription>
                <strong>What happens when you publish:</strong>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>Status changes from "draft" to "live"</li>
                  <li>Region is automatically locked</li>
                  <li>Becomes visible on the public site</li>
                  <li>Removed from active editing (if set)</li>
                  <li>Added to locked regions list</li>
                </ul>
              </AlertDescription>
            </Alert>

            {selectedRegion && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium">Region: <strong>{selectedRegion}</strong></p>
                <p className="text-xs text-muted-foreground mt-1">
                  Make sure all content is finalized before publishing.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublishRegion} className="bg-green-600 hover:bg-green-700">
              <Rocket className="mr-2 h-4 w-4" />
              Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
