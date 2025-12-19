import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload, Save, Plus, Trash2, ExternalLink } from 'lucide-react';

interface RegionOGMetadata {
  id: string;
  region_slug: string;
  title: string;
  description: string;
  image_url: string | null;
}

export function OGImageManager() {
  const [regions, setRegions] = useState<RegionOGMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [newRegion, setNewRegion] = useState({ slug: '', title: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  async function fetchRegions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('region_og_metadata')
      .select('*')
      .order('region_slug');

    if (error) {
      toast({ title: 'Error fetching regions', description: error.message, variant: 'destructive' });
    } else {
      setRegions(data || []);
    }
    setLoading(false);
  }

  async function handleImageUpload(regionSlug: string, file: File) {
    setUploading(regionSlug);

    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const filePath = `${regionSlug}-og.${fileExt}`;

    const uploadAttempt = await supabase.storage
      .from('og-images')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadAttempt.error) {
      // Some environments can return a conflict on "upload" even with upsert.
      // Try a direct update as a fallback.
      const isConflict =
        (uploadAttempt.error as any)?.statusCode === 409 ||
        /already exists/i.test(uploadAttempt.error.message);

      if (!isConflict) {
        toast({
          title: 'Upload failed',
          description: uploadAttempt.error.message,
          variant: 'destructive',
        });
        setUploading(null);
        return;
      }

      const updateAttempt = await supabase.storage
        .from('og-images')
        .update(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
        });

      if (updateAttempt.error) {
        toast({
          title: 'Upload failed',
          description: updateAttempt.error.message,
          variant: 'destructive',
        });
        setUploading(null);
        return;
      }
    }

    const { data: urlData } = supabase.storage.from('og-images').getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('region_og_metadata')
      .update({ image_url: imageUrl })
      .eq('region_slug', regionSlug);

    if (updateError) {
      toast({
        title: 'Failed to save image URL',
        description: updateError.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Image uploaded successfully' });
      setRegions(prev => prev.map(r => (r.region_slug === regionSlug ? { ...r, image_url: imageUrl } : r)));
    }

    setUploading(null);
  }


  async function handleSave(region: RegionOGMetadata) {
    setSaving(region.id);

    const { error } = await supabase
      .from('region_og_metadata')
      .update({
        title: region.title,
        description: region.description,
        image_url: region.image_url,
      })
      .eq('id', region.id);

    if (error) {
      toast({ title: 'Failed to save', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved successfully' });
    }

    setSaving(null);
  }

  async function handleAddRegion() {
    if (!newRegion.slug || !newRegion.title || !newRegion.description) {
      toast({ title: 'All fields required', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('region_og_metadata')
      .insert({
        region_slug: newRegion.slug.toLowerCase().replace(/\s+/g, '-'),
        title: newRegion.title,
        description: newRegion.description,
      });

    if (error) {
      toast({ title: 'Failed to add region', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Region added' });
      setNewRegion({ slug: '', title: '', description: '' });
      setShowAddForm(false);
      fetchRegions();
    }
  }

  async function handleDelete(id: string, slug: string) {
    if (!confirm(`Delete OG metadata for "${slug}"?`)) return;

    const { error } = await supabase
      .from('region_og_metadata')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted' });
      fetchRegions();
    }
  }

  function updateRegion(id: string, field: keyof RegionOGMetadata, value: string) {
    setRegions(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading OG metadata...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Social Media OG Images</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Region
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Manage Open Graph images and metadata for social media sharing. Images should be at least 1200×630px for best results.
      </p>

      {showAddForm && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Add New Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Region Slug</Label>
              <Input
                placeholder="e.g., toscana"
                value={newRegion.slug}
                onChange={e => setNewRegion(prev => ({ ...prev, slug: e.target.value }))}
              />
            </div>
            <div>
              <Label>OG Title</Label>
              <Input
                placeholder="Retiring in Toscana | Veni. Vidi. Vici."
                value={newRegion.title}
                onChange={e => setNewRegion(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>OG Description</Label>
              <Textarea
                placeholder="Your guide to retiring in Toscana..."
                value={newRegion.description}
                onChange={e => setNewRegion(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRegion}>Add Region</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {regions.map(region => (
          <Card key={region.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">/{region.region_slug}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://developers.facebook.com/tools/debug/?q=https://news.caesartheday.com/${region.region_slug}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    FB Debug
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(region.id, region.region_slug)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>OG Title</Label>
                    <Input
                      value={region.title}
                      onChange={e => updateRegion(region.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>OG Description</Label>
                    <Textarea
                      value={region.description}
                      onChange={e => updateRegion(region.id, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={region.image_url || ''}
                      onChange={e => updateRegion(region.id, 'image_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>OG Image Preview</Label>
                  <div className="relative aspect-[1.91/1] bg-muted rounded-lg overflow-hidden border">
                    {region.image_url ? (
                      <img
                        src={region.image_url}
                        alt={`OG image for ${region.region_slug}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        No image set
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(region.region_slug, file);
                        }}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={uploading === region.region_slug}
                        asChild
                      >
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading === region.region_slug ? 'Uploading...' : 'Upload Image'}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave(region)}
                  disabled={saving === region.id}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving === region.id ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {regions.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-muted-foreground">
          No regions configured. Click "Add Region" to get started.
        </div>
      )}
    </div>
  );
}
