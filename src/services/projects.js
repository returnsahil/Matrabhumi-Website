import { supabase } from "../lib/supabase.js";

const adminProjectFields =
  `id, slug, title_en, title_hi, description_en, description_hi,
  location_en, location_hi, completion_year, construction_status,
  is_published, sort_order, created_at, updated_at,
  project_images (
    id, storage_path, alt_text_en, alt_text_hi,
    is_cover, sort_order, created_at
  )`;

const projectImageBucket = "project-images";

export async function getAdminProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(adminProjectFields)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    projects: data ?? [],
    error,
  };
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select(adminProjectFields)
    .single();

  return {
    project: data,
    error,
  };
}

export async function updateProject(projectId, changes) {
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...changes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select(adminProjectFields)
    .single();

  return {
    project: data,
    error,
  };
}

export async function getPublishedProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(adminProjectFields)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    projects: data ?? [],
    error,
  };
}

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(adminProjectFields)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return {
    projects: data ?? [],
    error,
  };
}

export async function setProjectPublished(projectId, isPublished) {
  const { data, error } = await supabase
    .from("projects")
    .update({
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select(adminProjectFields)
    .single();

  return {
    project: data,
    error,
  };
}

export async function deleteProject(project) {
  const storagePaths = (project.project_images ?? []).map(
    (image) => image.storage_path,
  );

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (error) {
    return { error, cleanupError: null };
  }

  if (storagePaths.length === 0) {
    return { error: null, cleanupError: null };
  }

  const { error: cleanupError } = await supabase.storage
    .from(projectImageBucket)
    .remove(storagePaths);

  return { error: null, cleanupError };
}

export function getProjectImageUrl(storagePath) {
  return supabase.storage.from(projectImageBucket).getPublicUrl(storagePath).data
    .publicUrl;
}

export function orderProjectImages(images = []) {
  return [...images].sort(
    (first, second) =>
      Number(second.is_cover) - Number(first.is_cover) ||
      first.sort_order - second.sort_order,
  );
}

function createSafeFileName(fileName) {
  const extension = fileName.includes(".")
    ? `.${fileName.split(".").pop().toLowerCase()}`
    : "";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "project-image"}${extension}`;
}

export async function uploadProjectImages(project, files) {
  const existingImages = project.project_images ?? [];
  const uploadedImages = [];

  for (const [index, file] of files.entries()) {
    const storagePath = `${project.id}/${crypto.randomUUID()}-${createSafeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(projectImageBucket)
      .upload(storagePath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { images: uploadedImages, error: uploadError };
    }

    const { data: imageRecord, error: recordError } = await supabase
      .from("project_images")
      .insert({
        project_id: project.id,
        storage_path: storagePath,
        alt_text_en: project.title_en,
        alt_text_hi: project.title_hi || project.title_en,
        is_cover: existingImages.length === 0 && index === 0,
        sort_order: existingImages.length + index + 1,
      })
      .select(
        "id, storage_path, alt_text_en, alt_text_hi, is_cover, sort_order, created_at",
      )
      .single();

    if (recordError) {
      await supabase.storage.from(projectImageBucket).remove([storagePath]);
      return { images: uploadedImages, error: recordError };
    }

    uploadedImages.push(imageRecord);
  }

  return { images: uploadedImages, error: null };
}

export async function setProjectCover(projectId, imageId, previousCoverId) {
  const { error: unsetError } = await supabase
    .from("project_images")
    .update({ is_cover: false })
    .eq("project_id", projectId)
    .eq("is_cover", true);

  if (unsetError) return { error: unsetError };

  const { error: setError } = await supabase
    .from("project_images")
    .update({ is_cover: true })
    .eq("project_id", projectId)
    .eq("id", imageId);

  if (setError && previousCoverId) {
    await supabase
      .from("project_images")
      .update({ is_cover: true })
      .eq("project_id", projectId)
      .eq("id", previousCoverId);
  }

  return { error: setError };
}

export async function reorderProjectImages(projectId, orderedImageIds) {
  for (const [index, imageId] of orderedImageIds.entries()) {
    const { error } = await supabase
      .from("project_images")
      .update({ sort_order: index + 1 })
      .eq("project_id", projectId)
      .eq("id", imageId);

    if (error) return { error };
  }

  return { error: null };
}
