/**
 * Region Management API
 * 
 * Calls Edge Functions to manage region scaffolding, locking, publishing, and active state.
 * Uses direct fetch to Edge Functions for reliability.
 */

// Get Supabase URL from env or use hardcoded value as fallback
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jolbywwrnehhwodlgytt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbGJ5d3dybmVoaHdvZGxneXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDczNTIsImV4cCI6MjA4MTU4MzM1Mn0.3UUV5PbolRzbZmo1_oCe9TgctYF1esT2xvA_izLR4SQ';

export interface ScaffoldRegionParams {
  slug: string;
  displayName: string;
  issueNumber: number;
  colorScheme: string;
}

export interface ScaffoldResponse {
  success: boolean;
  message: string;
  data?: {
    registryEntry: {
      status: string;
      locked: boolean;
      createdDate: string;
      version: string;
      colorScheme: string;
      slug: string;
      displayName: string;
    };
    newsletterEntry: {
      slug: string;
      title: string;
      issueNumber: number;
      date: string;
      status: string;
      thumbnail: string;
      description: string;
      ctaText: string;
      ctaLink: string;
    };
    regionData: Record<string, unknown>;
    climateData: Record<string, unknown>;
    aiInstructions: {
      activeRegion: string;
      lockedRegions: string[];
      instruction: string;
      lastUpdated: string;
    };
    filesToCreate: string[];
    filesToUpdate: string[];
  };
  error?: string;
}

export interface LockResponse {
  success: boolean;
  message: string;
  data?: {
    slug: string;
    locked: boolean;
    updatedAt: string;
  };
  error?: string;
}

export interface PublishResponse {
  success: boolean;
  message: string;
  data?: {
    slug: string;
    publishedDate: string;
    registryUpdate: {
      status: string;
      locked: boolean;
      publishedDate: string;
      version: string;
    };
    newsletterUpdate: {
      status: string;
      ctaText: string;
      ctaLink: string;
    };
  };
  error?: string;
}

export interface SetActiveResponse {
  success: boolean;
  message: string;
  data?: {
    activeRegion: string | null;
  };
  error?: string;
}

/**
 * Call an edge function directly via fetch
 */
async function callEdgeFunction<T>(functionName: string, body: object): Promise<T> {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;
  
  console.log(`[regionApi] Calling ${functionName}:`, body);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(`[regionApi] ${functionName} response:`, data);
  
  if (!response.ok) {
    throw new Error(data.error || `Failed to call ${functionName}`);
  }
  
  return data as T;
}

/**
 * Scaffolds a new region from template via Edge Function
 */
export async function scaffoldRegionApi(params: ScaffoldRegionParams): Promise<ScaffoldResponse> {
  try {
    return await callEdgeFunction<ScaffoldResponse>('scaffold-region', params);
  } catch (error) {
    console.error('[regionApi] Scaffold error:', error);
    return { 
      success: false, 
      message: 'Failed to scaffold region',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Updates region lock status via Edge Function
 */
export async function updateRegionLockApi(slug: string, locked: boolean): Promise<LockResponse> {
  try {
    return await callEdgeFunction<LockResponse>('region-lock', { slug, locked });
  } catch (error) {
    console.error('[regionApi] Lock error:', error);
    return { 
      success: false, 
      message: 'Failed to update lock status',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Publishes a region via Edge Function
 */
export async function publishRegionApi(slug: string): Promise<PublishResponse> {
  try {
    return await callEdgeFunction<PublishResponse>('publish-region', { slug });
  } catch (error) {
    console.error('[regionApi] Publish error:', error);
    return { 
      success: false, 
      message: 'Failed to publish region',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Sets the active region for AI work via Edge Function
 */
export async function setActiveRegionApi(slug: string | null): Promise<SetActiveResponse> {
  try {
    return await callEdgeFunction<SetActiveResponse>('set-active-region', { slug });
  } catch (error) {
    console.error('[regionApi] Set active error:', error);
    return { 
      success: false, 
      message: 'Failed to set active region',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
