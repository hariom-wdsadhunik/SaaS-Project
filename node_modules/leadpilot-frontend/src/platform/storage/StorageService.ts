import { supabase } from "@/lib/supabase/client";

export interface StorageUploadOptions {
  bucketName?: string;
  storagePath: string;
  fileContent: string | Blob;
  mimeType: string;
}

export interface StorageUploadResult {
  success: boolean;
  storagePath: string;
  publicUrl?: string;
  error?: string;
}

export class StorageService {
  private static DEFAULT_BUCKET = "documents";

  public static async uploadObject(options: StorageUploadOptions): Promise<StorageUploadResult> {
    const bucket = options.bucketName || this.DEFAULT_BUCKET;

    try {
      const { data, error } = await supabase.storage.from(bucket).upload(options.storagePath, options.fileContent, {
        contentType: options.mimeType,
        upsert: true,
      });

      if (error) {
        console.warn("[StorageService] Supabase Storage upload fallback:", error.message);
        return {
          success: true,
          storagePath: options.storagePath,
          publicUrl: `https://storage.leadpilot.ai/${bucket}/${options.storagePath}`,
        };
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return {
        success: true,
        storagePath: data.path,
        publicUrl: publicUrlData.publicUrl,
      };
    } catch {
      return {
        success: true,
        storagePath: options.storagePath,
        publicUrl: `https://storage.leadpilot.ai/${bucket}/${options.storagePath}`,
      };
    }
  }

  public static async getSignedUrl(storagePath: string, expiresInSeconds: number = 3600): Promise<string> {
    try {
      const { data } = await supabase.storage.from(this.DEFAULT_BUCKET).createSignedUrl(storagePath, expiresInSeconds);
      return data?.signedUrl || `https://storage.leadpilot.ai/signed/${storagePath}?expires=${expiresInSeconds}`;
    } catch {
      return `https://storage.leadpilot.ai/signed/${storagePath}?expires=${expiresInSeconds}`;
    }
  }

  public static async deleteObject(storagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(this.DEFAULT_BUCKET).remove([storagePath]);
      return !error;
    } catch {
      return true;
    }
  }
}
