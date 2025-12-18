/**
 * Region Management API
 * 
 * Calls Edge Functions to manage region scaffolding, locking, publishing, and active state.
 */

import { supabase } from '@/integrations/supabase/client';

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
 * Scaffolds a new region from template via Edge Function
 */
export async function scaffoldRegionApi(params: ScaffoldRegionParams): Promise<ScaffoldResponse> {
  try {
    console.log('[regionApi] Calling scaffold-region:', params);
    
    const { data, error } = await supabase.functions.invoke('scaffold-region', {
      body: params
    });

    if (error) {
      console.error('[regionApi] Edge function error:', error);
      return { success: false, message: 'Failed to scaffold region', error: error.message };
    }

    console.log('[regionApi] Scaffold response:', data);
    return data as ScaffoldResponse;
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
    console.log('[regionApi] Calling region-lock:', { slug, locked });
    
    const { data, error } = await supabase.functions.invoke('region-lock', {
      body: { slug, locked }
    });

    if (error) {
      console.error('[regionApi] Edge function error:', error);
      return { success: false, message: 'Failed to update lock status', error: error.message };
    }

    console.log('[regionApi] Lock response:', data);
    return data as LockResponse;
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
    console.log('[regionApi] Calling publish-region:', slug);
    
    const { data, error } = await supabase.functions.invoke('publish-region', {
      body: { slug }
    });

    if (error) {
      console.error('[regionApi] Edge function error:', error);
      return { success: false, message: 'Failed to publish region', error: error.message };
    }

    console.log('[regionApi] Publish response:', data);
    return data as PublishResponse;
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
    console.log('[regionApi] Calling set-active-region:', slug);
    
    const { data, error } = await supabase.functions.invoke('set-active-region', {
      body: { slug }
    });

    if (error) {
      console.error('[regionApi] Edge function error:', error);
      return { success: false, message: 'Failed to set active region', error: error.message };
    }

    console.log('[regionApi] Set active response:', data);
    return data as SetActiveResponse;
  } catch (error) {
    console.error('[regionApi] Set active error:', error);
    return { 
      success: false, 
      message: 'Failed to set active region',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
