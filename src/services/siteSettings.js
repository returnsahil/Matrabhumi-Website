import { supabase } from "../lib/supabase.js";

const homepageSettingsId = "homepage";
const siteAssetBucket = "site-assets";
export const homepageSettingsChangeEvent =
  "matrabhumi-homepage-settings-changed";
const homepageSettingsFields =
  "id, hero_line_en, hero_line_hi, hero_image_path, updated_at";

export const defaultHomepageSettings = {
  id: homepageSettingsId,
  hero_line_en: "",
  hero_line_hi: "",
  hero_image_path: null,
};

export async function getHomepageSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select(homepageSettingsFields)
    .eq("id", homepageSettingsId)
    .maybeSingle();

  return {
    settings: data ?? defaultHomepageSettings,
    error,
  };
}

export async function saveHomepageSettings(changes) {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: homepageSettingsId,
        ...changes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select(homepageSettingsFields)
    .single();

  return { settings: data, error };
}

export function notifyHomepageSettingsChanged(updatedAt) {
  localStorage.setItem(homepageSettingsChangeEvent, updatedAt);
  window.dispatchEvent(new Event(homepageSettingsChangeEvent));
}

export function getSiteAssetUrl(storagePath) {
  if (!storagePath) return null;

  return supabase.storage.from(siteAssetBucket).getPublicUrl(storagePath).data
    .publicUrl;
}

export async function uploadHomepageHero(file) {
  const storagePath = `homepage/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(siteAssetBucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  return { storagePath: error ? null : storagePath, error };
}

export async function removeSiteAsset(storagePath) {
  if (!storagePath) return { error: null };

  const { error } = await supabase.storage
    .from(siteAssetBucket)
    .remove([storagePath]);

  return { error };
}
