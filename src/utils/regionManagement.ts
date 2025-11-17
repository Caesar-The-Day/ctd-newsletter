/**
 * Region Management Utilities
 * 
 * In production, these would be API endpoints (Edge Functions).
 * For development, we simulate with localStorage + JSON updates.
 */

import { RegionRegistry, RegionRegistryEntry } from './getRegionData';

interface AIInstructions {
  activeRegion: string | null;
  lockedRegions: string[];
  instruction: string;
  lastUpdated: string;
}

interface ScaffoldRegionParams {
  slug: string;
  displayName: string;
  issueNumber?: string;
  colorScheme: string;
}

/**
 * Creates a new draft region from template
 */
export async function scaffoldNewRegion(params: ScaffoldRegionParams): Promise<{ success: boolean; message: string }> {
  try {
    const { slug, displayName, issueNumber, colorScheme } = params;

    // In production: POST /api/regions/scaffold
    // This would:
    // 1. Copy _template.json to /data/regions/italy/{slug}.json
    // 2. Create {slug}-climate.json
    // 3. Update region-registry.json
    // 4. Update newsletter-index.json
    // 5. Update feature-flags.json
    // 6. Update section-order.json
    // 7. If custom color scheme, create CSS class in index.css

    const newEntry: RegionRegistryEntry = {
      status: 'draft',
      locked: false,
      createdDate: new Date().toISOString().split('T')[0],
      version: '0.1',
      colorScheme,
      slug,
      displayName
    };

    // Simulate: Store in localStorage for development
    const existingData = localStorage.getItem('region-scaffold-queue') || '[]';
    const queue = JSON.parse(existingData);
    queue.push({ ...newEntry, issueNumber });
    localStorage.setItem('region-scaffold-queue', JSON.stringify(queue));

    console.log('[Region Management] Scaffold request queued:', newEntry);

    return {
      success: true,
      message: `Region "${displayName}" scaffolded successfully. In production, this would create all necessary files and configurations.`
    };
  } catch (error) {
    console.error('[Region Management] Scaffold failed:', error);
    return {
      success: false,
      message: 'Failed to scaffold region. Please check console for details.'
    };
  }
}

/**
 * Updates region lock status
 */
export async function updateRegionLock(slug: string, locked: boolean): Promise<{ success: boolean; message: string }> {
  try {
    // In production: PATCH /api/regions/{slug}/lock
    // This would update region-registry.json

    const action = locked ? 'locked' : 'unlocked';
    console.log(`[Region Management] Region ${slug} ${action}`);

    // Simulate: Store in localStorage
    const lockData = JSON.parse(localStorage.getItem('region-lock-changes') || '{}');
    lockData[slug] = { locked, timestamp: Date.now() };
    localStorage.setItem('region-lock-changes', JSON.stringify(lockData));

    return {
      success: true,
      message: `Region "${slug}" ${action} successfully.`
    };
  } catch (error) {
    console.error('[Region Management] Lock update failed:', error);
    return {
      success: false,
      message: 'Failed to update lock status.'
    };
  }
}

/**
 * Sets the active region for AI work
 */
export async function setActiveRegion(slug: string | null): Promise<{ success: boolean; message: string }> {
  try {
    // In production: PATCH /api/ai-instructions
    // This would update ai-instructions.json

    console.log('[Region Management] Active region set to:', slug || 'none');

    // Simulate: Store in localStorage
    localStorage.setItem('active-region', slug || '');

    return {
      success: true,
      message: slug 
        ? `AI will now work exclusively on "${slug}"`
        : 'No active region set'
    };
  } catch (error) {
    console.error('[Region Management] Set active failed:', error);
    return {
      success: false,
      message: 'Failed to set active region.'
    };
  }
}

/**
 * Publishes a draft region (draft → live, locks it)
 */
export async function publishRegion(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    // In production: POST /api/regions/{slug}/publish
    // This would:
    // 1. Update region-registry.json (status: live, locked: true, publishedDate)
    // 2. Update newsletter-index.json (status: live)
    // 3. Update ai-instructions.json (remove from activeRegion, add to lockedRegions)
    // 4. Increment version number
    // 5. Trigger deployment/cache invalidation

    const publishDate = new Date().toISOString().split('T')[0];
    
    console.log('[Region Management] Publishing region:', slug);

    // Simulate: Store in localStorage
    const publishData = JSON.parse(localStorage.getItem('region-publish-queue') || '[]');
    publishData.push({ slug, publishedDate: publishDate, timestamp: Date.now() });
    localStorage.setItem('region-publish-queue', JSON.stringify(publishData));

    return {
      success: true,
      message: `Region "${slug}" published successfully and is now LIVE and LOCKED.`
    };
  } catch (error) {
    console.error('[Region Management] Publish failed:', error);
    return {
      success: false,
      message: 'Failed to publish region.'
    };
  }
}

/**
 * Archives a region (live/draft → archived)
 */
export async function archiveRegion(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    // In production: POST /api/regions/{slug}/archive
    // This would update region-registry.json and newsletter-index.json

    console.log('[Region Management] Archiving region:', slug);

    const archiveData = JSON.parse(localStorage.getItem('region-archive-queue') || '[]');
    archiveData.push({ slug, timestamp: Date.now() });
    localStorage.setItem('region-archive-queue', JSON.stringify(archiveData));

    return {
      success: true,
      message: `Region "${slug}" archived successfully.`
    };
  } catch (error) {
    console.error('[Region Management] Archive failed:', error);
    return {
      success: false,
      message: 'Failed to archive region.'
    };
  }
}

/**
 * Validates if a region can be modified
 */
export function canModifyRegion(region: RegionRegistryEntry | null, aiInstructions: AIInstructions | null): {
  canModify: boolean;
  reason?: string;
} {
  if (!region) {
    return { canModify: false, reason: 'Region not found' };
  }

  if (region.locked) {
    return { 
      canModify: false, 
      reason: `This region is LOCKED. It cannot be modified unless unlocked in the admin panel.` 
    };
  }

  if (region.status === 'live') {
    return { 
      canModify: false, 
      reason: `This region is LIVE. Changes should be made carefully and require unlocking.` 
    };
  }

  if (aiInstructions?.activeRegion && aiInstructions.activeRegion !== region.slug) {
    return { 
      canModify: false, 
      reason: `AI is currently working on "${aiInstructions.activeRegion}". Set this region as active first.` 
    };
  }

  return { canModify: true };
}

/**
 * Gets all pending operations from localStorage (dev only)
 */
export function getPendingOperations() {
  return {
    scaffoldQueue: JSON.parse(localStorage.getItem('region-scaffold-queue') || '[]'),
    lockChanges: JSON.parse(localStorage.getItem('region-lock-changes') || '{}'),
    publishQueue: JSON.parse(localStorage.getItem('region-publish-queue') || '[]'),
    archiveQueue: JSON.parse(localStorage.getItem('region-archive-queue') || '[]'),
    activeRegion: localStorage.getItem('active-region') || null
  };
}

/**
 * Clears all pending operations (dev only)
 */
export function clearPendingOperations() {
  localStorage.removeItem('region-scaffold-queue');
  localStorage.removeItem('region-lock-changes');
  localStorage.removeItem('region-publish-queue');
  localStorage.removeItem('region-archive-queue');
  localStorage.removeItem('active-region');
}
