import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import imageCompression from "browser-image-compression";
import { supabase } from "../../lib/supabase.js";
import {
  createProject,
  deleteProjectImage,
  deleteProject,
  getAdminProjects,
  getProjectImageUrl,
  reorderProjectImages,
  setProjectCover,
  setProjectPublished,
  updateProject,
  uploadProjectImages,
} from "../../services/projects.js";
import HomepageSettings from "./HomepageSettings.jsx";
import "./Admin.css";

const emptyProjectForm = {
  title_en: "",
  title_hi: "",
  slug: "",
  description_en: "",
  description_hi: "",
  location_en: "",
  location_hi: "",
  completion_year: "",
  construction_status: "under_construction",
  sort_order: "0",
};

const supportedProjectImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
]);
const maximumSourceImageSize = 30 * 1024 * 1024;
const maximumUploadedImageSize = 10 * 1024 * 1024;

function createOptimizedImageName(fileName) {
  const baseName = fileName.replace(/\.[^/.]+$/, "").trim();
  return `${baseName || "project-image"}.webp`;
}

async function optimizeProjectImage(file) {
  const optimizedImage = await imageCompression(file, {
    maxSizeMB: 3,
    maxWidthOrHeight: 3000,
    fileType: "image/webp",
    initialQuality: 0.9,
    preserveExif: false,
    useWebWorker: true,
  });

  return new File([optimizedImage], createOptimizedImageName(file.name), {
    type: "image/webp",
    lastModified: file.lastModified,
  });
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function SortableProjectImage({
  image,
  index,
  project,
  isChangingCover,
  isReordering,
  isDeletingImage,
  onCoverChange,
  onDeleteImage,
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled: isReordering });

  return (
    <div
      className={`admin-cover-option${image.is_cover ? " is-cover" : ""}${
        isDragging ? " is-dragging" : ""
      }`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        className="admin-cover-select"
        type="button"
        disabled={isChangingCover || isDragging}
        onClick={() => onCoverChange(project, image)}
      >
        <img
          src={getProjectImageUrl(image.storage_path)}
          alt={
            image.alt_text_en || `${project.title_en} image ${index + 1}`
          }
          width="180"
          height="120"
          loading="lazy"
          draggable="false"
        />
        <span>{image.is_cover ? "Current cover" : "Set as cover"}</span>
      </button>

      <div className="admin-image-tile-footer">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div className="admin-image-tile-actions">
          <button
            className="admin-image-delete-button"
            type="button"
            disabled={isDeletingImage || isReordering}
            onClick={() => onDeleteImage(project, image)}
            aria-label={`Delete image ${index + 1} from ${project.title_en}`}
          >
            Delete
          </button>
          <button
            className="admin-image-drag-handle"
            ref={setActivatorNodeRef}
            type="button"
            disabled={isDeletingImage || isReordering}
            aria-label={`Drag image ${index + 1} to change its position`}
            {...attributes}
            {...listeners}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="6" cy="5" r="1" />
              <circle cx="14" cy="5" r="1" />
              <circle cx="6" cy="10" r="1" />
              <circle cx="14" cy="10" r="1" />
              <circle cx="6" cy="15" r="1" />
              <circle cx="14" cy="15" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableProjectImages({
  images,
  project,
  isChangingCover,
  isReordering,
  isUploading,
  isDeletingImage,
  onCoverChange,
  onDeleteImage,
  onReorder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((image) => image.id === active.id);
    const newIndex = images.findIndex((image) => image.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(project, arrayMove(images, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((image) => image.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="admin-cover-grid">
          {images.map((image, index) => (
            <SortableProjectImage
              image={image}
              index={index}
              project={project}
              isChangingCover={isChangingCover}
              isReordering={isReordering || isUploading}
              isDeletingImage={isDeletingImage}
              onCoverChange={onCoverChange}
              onDeleteImage={onDeleteImage}
              key={image.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectFormError, setProjectFormError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");
  const [imageUploadStatus, setImageUploadStatus] = useState(null);
  const [publishingProjectId, setPublishingProjectId] = useState(null);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imageUploadErrorProjectId, setImageUploadErrorProjectId] =
    useState(null);
  const [projectPendingDeletion, setProjectPendingDeletion] = useState(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [imagePendingDeletion, setImagePendingDeletion] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [coverPickerProjectId, setCoverPickerProjectId] = useState(null);
  const [changingCoverProjectId, setChangingCoverProjectId] = useState(null);
  const [reorderingProjectId, setReorderingProjectId] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function restoreAdminSession() {
      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession();

      if (!existingSession) {
        if (isCurrent) setIsCheckingSession(false);
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc("is_admin");

      if (!isCurrent) return;

      if (error || !isAdmin) {
        await supabase.auth.signOut();
        setErrorMessage("This account is not authorized to use the dashboard.");
      } else {
        setSession(existingSession);
      }

      setIsCheckingSession(false);
    }

    restoreAdminSession();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!session) return undefined;

    let isCurrent = true;

    async function loadProjects() {
      const { projects: projectRows, error } = await getAdminProjects();

      if (!isCurrent) return;

      if (error) {
        setProjectError("Projects could not be loaded. Please try again.");
      } else {
        setProjects(projectRows);
        setProjectError("");
      }

      setIsLoadingProjects(false);
    }

    loadProjects();

    return () => {
      isCurrent = false;
    };
  }, [session]);

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password },
    );

    if (signInError) {
      setErrorMessage("The email or password is incorrect.");
      setIsSubmitting(false);
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

    if (adminError || !isAdmin) {
      await supabase.auth.signOut();
      setErrorMessage("This account is not authorized to use the dashboard.");
      setIsSubmitting(false);
      return;
    }

    setSession(data.session);
    setPassword("");
    setIsSubmitting(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setEmail("");
    setPassword("");
  }

  function handleProjectField(event) {
    const { name, value } = event.target;

    if (name === "slug") setIsSlugEdited(true);

    setProjectForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "title_en" && !isSlugEdited
        ? { slug: createSlug(value) }
        : {}),
    }));
  }

  function closeProjectForm() {
    setIsProjectFormOpen(false);
    setProjectForm(emptyProjectForm);
    setEditingProjectId(null);
    setIsSlugEdited(false);
    setProjectFormError("");
  }

  function openEditProject(project) {
    setProjectForm({
      title_en: project.title_en ?? "",
      title_hi: project.title_hi ?? "",
      slug: project.slug ?? "",
      description_en: project.description_en ?? "",
      description_hi: project.description_hi ?? "",
      location_en: project.location_en ?? "",
      location_hi: project.location_hi ?? "",
      completion_year: project.completion_year?.toString() ?? "",
      construction_status: project.construction_status ?? "under_construction",
      sort_order: project.sort_order?.toString() ?? "0",
    });
    setEditingProjectId(project.id);
    setIsSlugEdited(true);
    setProjectFormError("");
    setProjectSuccess("");
    setIsProjectFormOpen(true);

    requestAnimationFrame(() => {
      document
        .querySelector(".admin-project-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleSaveProject(event) {
    event.preventDefault();
    setIsSavingProject(true);
    setProjectFormError("");
    setProjectSuccess("");

    const projectChanges = {
      title_en: projectForm.title_en.trim(),
      title_hi: projectForm.title_hi.trim() || null,
      slug: projectForm.slug.trim(),
      description_en: projectForm.description_en.trim(),
      description_hi: projectForm.description_hi.trim(),
      location_en: projectForm.location_en.trim(),
      location_hi: projectForm.location_hi.trim(),
      completion_year: projectForm.completion_year
        ? Number(projectForm.completion_year)
        : null,
      construction_status: projectForm.construction_status,
      sort_order: Number(projectForm.sort_order) || 0,
    };

    const { project, error } = editingProjectId
      ? await updateProject(editingProjectId, projectChanges)
      : await createProject({ ...projectChanges, is_published: false });

    if (error) {
      setProjectFormError(
        error.code === "23505"
          ? "That URL name is already being used. Please choose another one."
          : `The project could not be ${editingProjectId ? "updated" : "created"}. Please try again.`,
      );
      setIsSavingProject(false);
      return;
    }

    setProjects((current) => {
      const nextProjects = editingProjectId
        ? current.map((currentProject) =>
            currentProject.id === editingProjectId ? project : currentProject,
          )
        : [...current, project];

      return nextProjects.sort((first, second) =>
        first.sort_order === second.sort_order
          ? new Date(second.created_at) - new Date(first.created_at)
          : first.sort_order - second.sort_order,
      );
    });
    const wasEditing = Boolean(editingProjectId);
    closeProjectForm();
    setProjectSuccess(
      wasEditing
        ? "Project details updated successfully."
        : "Project created as a draft. Add its images before publishing.",
    );
    setIsSavingProject(false);
  }

  async function handleImageUpload(project, event) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const unsupportedFile = files.find(
      (file) => !supportedProjectImageTypes.has(file.type),
    );

    if (unsupportedFile) {
      setImageUploadErrorProjectId(project.id);
      setImageUploadError(
        "Use JPG, PNG, WebP, or BMP project images.",
      );
      return;
    }

    const oversizedSource = files.find(
      (file) => file.size > maximumSourceImageSize,
    );

    if (oversizedSource) {
      setImageUploadErrorProjectId(project.id);
      setImageUploadError(
        "Each original image must be no larger than 30 MB before optimization.",
      );
      return;
    }

    setImageUploadStatus({ projectId: project.id, stage: "optimizing" });
    setImageUploadError("");
    setImageUploadErrorProjectId(null);
    setProjectSuccess("");

    let optimizedFiles;

    try {
      optimizedFiles = [];

      for (const file of files) {
        const optimizedFile = await optimizeProjectImage(file);

        if (optimizedFile.size > maximumUploadedImageSize) {
          throw new Error("The optimized image is still too large.");
        }

        optimizedFiles.push(optimizedFile);
      }
    } catch {
      setImageUploadErrorProjectId(project.id);
      setImageUploadError(
        "One image could not be optimized. Try exporting it as a JPG or PNG first.",
      );
      setImageUploadStatus(null);
      return;
    }

    setImageUploadStatus({ projectId: project.id, stage: "uploading" });

    const { images, error } = await uploadProjectImages(
      project,
      optimizedFiles,
    );

    if (images.length > 0) {
      setProjects((current) =>
        current.map((currentProject) =>
          currentProject.id === project.id
            ? {
                ...currentProject,
                project_images: [
                  ...(currentProject.project_images ?? []),
                  ...images,
                ],
              }
            : currentProject,
        ),
      );
    }

    if (error) {
      setImageUploadErrorProjectId(project.id);
      setImageUploadError(
        images.length > 0
          ? "Some images uploaded, but one file failed. Please try that file again."
          : "The images could not be uploaded. Please try again.",
      );
    } else {
      setImageUploadErrorProjectId(null);
      setProjectSuccess(
        `${images.length} ${images.length === 1 ? "image" : "images"} optimized and uploaded successfully.`,
      );
    }

    setImageUploadStatus(null);
  }

  async function handlePublicationChange(project) {
    const shouldPublish = !project.is_published;

    if (shouldPublish && (project.project_images ?? []).length === 0) {
      setImageUploadErrorProjectId(null);
      setImageUploadError(
        "Add at least one image before publishing this project.",
      );
      return;
    }

    setPublishingProjectId(project.id);
    setImageUploadError("");
    setProjectSuccess("");

    const { project: updatedProject, error } = await setProjectPublished(
      project.id,
      shouldPublish,
    );

    if (error) {
      setImageUploadErrorProjectId(null);
      setImageUploadError("The publication status could not be changed.");
    } else {
      setProjects((current) =>
        current.map((currentProject) =>
          currentProject.id === project.id ? updatedProject : currentProject,
        ),
      );
      setProjectSuccess(
        shouldPublish
          ? "Project published. It is now visible on the Projects page."
          : "Project returned to drafts and removed from the public Projects page.",
      );
    }

    setPublishingProjectId(null);
  }

  async function handleDeleteProject() {
    if (!projectPendingDeletion) return;

    setIsDeletingProject(true);
    setImageUploadError("");
    setProjectSuccess("");

    const { error, cleanupError } = await deleteProject(projectPendingDeletion);

    if (error) {
      setImageUploadErrorProjectId(null);
      setImageUploadError("The project could not be deleted. Please try again.");
      setIsDeletingProject(false);
      return;
    }

    setProjects((current) =>
      current.filter((project) => project.id !== projectPendingDeletion.id),
    );
    setProjectPendingDeletion(null);
    setIsDeletingProject(false);

    if (cleanupError) {
      setImageUploadErrorProjectId(null);
      setImageUploadError(
        "The project was deleted, but some stored image files need manual cleanup.",
      );
    } else {
      setProjectSuccess("Project and its images deleted successfully.");
    }
  }

  async function handleCoverChange(project, image) {
    if (image.is_cover) return;

    const previousCover = (project.project_images ?? []).find(
      (projectImage) => projectImage.is_cover,
    );

    setChangingCoverProjectId(project.id);
    setImageUploadError("");
    setProjectSuccess("");

    const { error } = await setProjectCover(
      project.id,
      image.id,
      previousCover?.id,
    );

    if (error) {
      setImageUploadErrorProjectId(null);
      setImageUploadError("The cover image could not be changed.");
    } else {
      setProjects((current) =>
        current.map((currentProject) =>
          currentProject.id === project.id
            ? {
                ...currentProject,
                project_images: (currentProject.project_images ?? []).map(
                  (projectImage) => ({
                    ...projectImage,
                    is_cover: projectImage.id === image.id,
                  }),
                ),
              }
            : currentProject,
        ),
      );
      setProjectSuccess("Cover image updated successfully.");
    }

    setChangingCoverProjectId(null);
  }

  function requestImageDeletion(project, image) {
    if (project.is_published && (project.project_images ?? []).length === 1) {
      setImageUploadErrorProjectId(project.id);
      setImageUploadError(
        "A published project must keep one image. Add its replacement or unpublish the project first.",
      );
      return;
    }

    setImageUploadError("");
    setImageUploadErrorProjectId(null);
    setProjectSuccess("");
    setImagePendingDeletion({ project, image });
  }

  async function handleDeleteImage() {
    if (!imagePendingDeletion) return;

    const { project, image } = imagePendingDeletion;
    const remainingImages = (project.project_images ?? []).filter(
      (projectImage) => projectImage.id !== image.id,
    );
    const replacementCover = image.is_cover ? remainingImages[0] : null;

    setIsDeletingImage(true);
    setImageUploadError("");
    setImageUploadErrorProjectId(null);
    setProjectSuccess("");

    if (replacementCover) {
      const { error: coverError } = await setProjectCover(
        project.id,
        replacementCover.id,
        image.id,
      );

      if (coverError) {
        setImageUploadErrorProjectId(project.id);
        setImageUploadError(
          "The image could not be deleted because its replacement cover could not be set.",
        );
        setIsDeletingImage(false);
        return;
      }
    }

    const { error, cleanupError } = await deleteProjectImage(
      project.id,
      image,
    );

    if (error) {
      if (replacementCover) {
        await setProjectCover(project.id, image.id, replacementCover.id);
      }

      setImageUploadErrorProjectId(project.id);
      setImageUploadError("The image could not be deleted. Please try again.");
      setIsDeletingImage(false);
      return;
    }

    const updatedImages = remainingImages.map((projectImage) => ({
      ...projectImage,
      is_cover: replacementCover
        ? projectImage.id === replacementCover.id
        : projectImage.is_cover,
    }));

    setProjects((current) =>
      current.map((currentProject) =>
        currentProject.id === project.id
          ? { ...currentProject, project_images: updatedImages }
          : currentProject,
      ),
    );
    setImagePendingDeletion(null);
    setIsDeletingImage(false);

    if (cleanupError) {
      setImageUploadErrorProjectId(project.id);
      setImageUploadError(
        "The image was removed from the project, but its stored file needs manual cleanup.",
      );
    } else {
      setProjectSuccess("Project image deleted successfully.");
    }
  }

  async function handleImageReorder(project, orderedImages) {
    const previousImages = project.project_images ?? [];
    const imagesWithUpdatedOrder = orderedImages.map((image, index) => ({
      ...image,
      sort_order: index + 1,
    }));

    setReorderingProjectId(project.id);
    setImageUploadError("");
    setProjectSuccess("");
    setProjects((current) =>
      current.map((currentProject) =>
        currentProject.id === project.id
          ? { ...currentProject, project_images: imagesWithUpdatedOrder }
          : currentProject,
      ),
    );

    const { error } = await reorderProjectImages(
      project.id,
      imagesWithUpdatedOrder,
    );

    if (error) {
      setImageUploadErrorProjectId(null);
      setImageUploadError("The image order could not be changed.");
      setProjects((current) =>
        current.map((currentProject) =>
          currentProject.id === project.id
            ? { ...currentProject, project_images: previousImages }
            : currentProject,
        ),
      );
    } else {
      setProjectSuccess("Image order updated successfully.");
    }

    setReorderingProjectId(null);
  }

  if (isCheckingSession) {
    return (
      <div className="admin-page">
        <p className="admin-loading" role="status">
          Checking secure session…
        </p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="admin-page">
        <section className="admin-panel admin-dashboard">
          <div className="admin-panel-header">
            <p className="admin-brand">
              <img
                src="/brand/Matrabhumi-logo-web.png"
                alt=""
                width="34"
                height="34"
                aria-hidden="true"
              />
              <span>Matrabhumi</span>
            </p>
            <button
              className="admin-text-button"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>

          <p className="admin-eyebrow">Secure administration</p>
          <h1>Stay busy Lobo seth</h1>
          <p className="admin-intro">
            You are signed in as {session.user.email}. Manage the portfolio
            shown across the Matrabhumi website.
          </p>

          <div className="admin-status-card">
            <span aria-hidden="true" />
            Supabase authentication and admin authorization are active.
          </div>

          <HomepageSettings />

          <div className="admin-projects-heading">
            <div>
              <p className="admin-eyebrow">Portfolio content</p>
              <h2>Projects</h2>
            </div>
            <p className="admin-project-count">
              <strong>{projects.length}</strong>
              <span>{projects.length === 1 ? "project" : "projects"}</span>
            </p>
            <button
              className="admin-add-button"
              type="button"
              onClick={() => {
                if (isProjectFormOpen) {
                  closeProjectForm();
                } else {
                  setIsProjectFormOpen(true);
                  setProjectSuccess("");
                }
              }}
            >
              {isProjectFormOpen ? "Close form" : "Add project"}
            </button>
          </div>

          {projectSuccess && (
            <p className="admin-success" role="status">
              {projectSuccess}
            </p>
          )}

          {imageUploadError && !imageUploadErrorProjectId && (
            <p className="admin-error" role="alert">
              {imageUploadError}
            </p>
          )}

          {isProjectFormOpen && (
            <form className="admin-project-form" onSubmit={handleSaveProject}>
              <div className="admin-project-form-heading">
                <div>
                  <p className="admin-eyebrow">
                    {editingProjectId
                      ? "Editing portfolio entry"
                      : "New portfolio entry"}
                  </p>
                  <h3>
                    {editingProjectId
                      ? "Edit project details"
                      : "Project details"}
                  </h3>
                </div>
                <span>
                  {editingProjectId
                    ? "Updates existing project"
                    : "Saved as draft"}
                </span>
              </div>

              <div className="admin-form-grid">
                <label className="admin-form-field">
                  <span>English title *</span>
                  <input
                    name="title_en"
                    value={projectForm.title_en}
                    onChange={handleProjectField}
                    required
                  />
                </label>

                <label className="admin-form-field">
                  <span>Hindi title</span>
                  <input
                    name="title_hi"
                    value={projectForm.title_hi}
                    onChange={handleProjectField}
                    lang="hi"
                  />
                </label>

                <label className="admin-form-field admin-form-field--wide">
                  <span>URL name *</span>
                  <input
                    name="slug"
                    value={projectForm.slug}
                    onChange={handleProjectField}
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    placeholder="example-project"
                    required
                  />
                  <small>Automatically created from the English title.</small>
                </label>

                <label className="admin-form-field admin-form-field--wide">
                  <span>English description</span>
                  <textarea
                    name="description_en"
                    value={projectForm.description_en}
                    onChange={handleProjectField}
                    rows="4"
                  />
                </label>

                <label className="admin-form-field admin-form-field--wide">
                  <span>Hindi description</span>
                  <textarea
                    name="description_hi"
                    value={projectForm.description_hi}
                    onChange={handleProjectField}
                    rows="4"
                    lang="hi"
                  />
                </label>

                <label className="admin-form-field">
                  <span>Location in English</span>
                  <input
                    name="location_en"
                    value={projectForm.location_en}
                    onChange={handleProjectField}
                  />
                </label>

                <label className="admin-form-field">
                  <span>Location in Hindi</span>
                  <input
                    name="location_hi"
                    value={projectForm.location_hi}
                    onChange={handleProjectField}
                    lang="hi"
                  />
                </label>

                <label className="admin-form-field">
                  <span>Completion year</span>
                  <input
                    name="completion_year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={projectForm.completion_year}
                    onChange={handleProjectField}
                  />
                </label>

                <label className="admin-form-field">
                  <span>Construction status</span>
                  <select
                    name="construction_status"
                    value={projectForm.construction_status}
                    onChange={handleProjectField}
                  >
                    <option value="planning">Planning</option>
                    <option value="under_construction">
                      Under construction
                    </option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label className="admin-form-field">
                  <span>Display order</span>
                  <input
                    name="sort_order"
                    type="number"
                    min="0"
                    value={projectForm.sort_order}
                    onChange={handleProjectField}
                  />
                </label>
              </div>

              {projectFormError && (
                <p className="admin-error" role="alert">
                  {projectFormError}
                </p>
              )}

              <div className="admin-form-actions">
                <button type="button" onClick={closeProjectForm}>
                  Cancel
                </button>
                <button type="submit" disabled={isSavingProject}>
                  {isSavingProject
                    ? editingProjectId
                      ? "Saving…"
                      : "Creating…"
                    : editingProjectId
                      ? "Save changes"
                      : "Create draft"}
                </button>
              </div>
            </form>
          )}

          {isLoadingProjects && (
            <p className="admin-project-message" role="status">
              Loading projects…
            </p>
          )}

          {projectError && (
            <p className="admin-error" role="alert">
              {projectError}
            </p>
          )}

          {!isLoadingProjects && !projectError && projects.length === 0 && (
            <div className="admin-empty-state">
              <p>No projects have been added yet.</p>
              <span>
                Your first project will appear here after it is created.
              </span>
            </div>
          )}

          {!isLoadingProjects && projects.length > 0 && (
            <div className="admin-project-list">
              {projects.map((project) => {
                const projectImages = [...(project.project_images ?? [])].sort(
                  (first, second) => first.sort_order - second.sort_order,
                );
                const coverImage =
                  projectImages.find((image) => image.is_cover) ??
                  projectImages[0];
                const currentImageUploadStage =
                  imageUploadStatus?.projectId === project.id
                    ? imageUploadStatus.stage
                    : null;

                return (
                  <div className="admin-project-entry" key={project.id}>
                    <div className="admin-project-row">
                      <div className="admin-project-summary">
                      {coverImage ? (
                        <img
                          src={getProjectImageUrl(coverImage.storage_path)}
                          alt=""
                          width="72"
                          height="54"
                        />
                      ) : (
                        <div
                          className="admin-project-placeholder"
                          aria-hidden="true"
                        >
                          No image
                        </div>
                      )}

                      <div>
                        <h3>{project.title_en}</h3>
                        <p>{project.slug}</p>
                        <p>
                          {projectImages.length}{" "}
                          {projectImages.length === 1 ? "image" : "images"}
                        </p>
                      </div>
                      </div>

                      <div className="admin-project-actions">
                        {imageUploadError &&
                          imageUploadErrorProjectId === project.id && (
                            <p
                              className="admin-project-upload-error"
                              role="alert"
                            >
                              {imageUploadError}
                            </p>
                          )}

                      <span
                        className={`admin-project-state${
                          project.is_published ? " is-published" : ""
                        }`}
                      >
                        {project.is_published ? "Published" : "Draft"}
                      </span>

                      <label className="admin-upload-button">
                        {currentImageUploadStage === "optimizing"
                          ? "Optimizing…"
                          : currentImageUploadStage === "uploading"
                            ? "Uploading…"
                            : "Add images"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/bmp"
                          multiple
                          disabled={Boolean(currentImageUploadStage)}
                          onChange={(event) =>
                            handleImageUpload(project, event)
                          }
                        />
                      </label>

                      {projectImages.length > 0 && (
                        <button
                          className="admin-cover-button"
                          type="button"
                          onClick={() =>
                            setCoverPickerProjectId((current) =>
                              current === project.id ? null : project.id,
                            )
                          }
                        >
                          {coverPickerProjectId === project.id
                            ? "Close images"
                            : "Manage images"}
                        </button>
                      )}

                      <button
                        className="admin-edit-button"
                        type="button"
                        onClick={() => openEditProject(project)}
                      >
                        Edit
                      </button>

                      <button
                        className={`admin-publish-button${
                          project.is_published ? " is-published" : ""
                        }`}
                        type="button"
                        disabled={publishingProjectId === project.id}
                        onClick={() => handlePublicationChange(project)}
                      >
                        {publishingProjectId === project.id
                          ? "Saving…"
                          : project.is_published
                            ? "Unpublish"
                            : "Publish"}
                      </button>

                      <button
                        className="admin-delete-button"
                        type="button"
                        onClick={() => setProjectPendingDeletion(project)}
                      >
                        Delete
                      </button>
                      </div>
                    </div>

                    {coverPickerProjectId === project.id && (
                      <div className="admin-cover-picker">
                        <div className="admin-cover-picker-heading">
                          <h4>Manage project images</h4>
                          <p>
                            Tap an image for the cover. Hold its grip to drag;
                            swipe the strip to browse.
                          </p>
                        </div>
                        <SortableProjectImages
                          images={projectImages}
                          project={project}
                          isChangingCover={
                            changingCoverProjectId === project.id
                          }
                          isReordering={reorderingProjectId === project.id}
                          isUploading={Boolean(currentImageUploadStage)}
                          isDeletingImage={isDeletingImage}
                          onCoverChange={handleCoverChange}
                          onDeleteImage={requestImageDeletion}
                          onReorder={handleImageReorder}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {projectPendingDeletion && (
            <div className="admin-dialog-backdrop">
              <section
                className="admin-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-project-heading"
              >
                <p className="admin-eyebrow">Permanent action</p>
                <h2 id="delete-project-heading">Delete this project?</h2>
                <p>
                  “{projectPendingDeletion.title_en}” and all of its uploaded
                  images will be permanently removed. This cannot be undone.
                </p>
                <div className="admin-dialog-actions">
                  <button
                    type="button"
                    disabled={isDeletingProject}
                    onClick={() => setProjectPendingDeletion(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeletingProject}
                    onClick={handleDeleteProject}
                  >
                    {isDeletingProject ? "Deleting…" : "Delete permanently"}
                  </button>
                </div>
              </section>
            </div>
          )}

          {imagePendingDeletion && (
            <div className="admin-dialog-backdrop">
              <section
                className="admin-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-image-heading"
              >
                <p className="admin-eyebrow">Permanent action</p>
                <h2 id="delete-image-heading">Delete this image?</h2>
                <img
                  className="admin-dialog-image"
                  src={getProjectImageUrl(
                    imagePendingDeletion.image.storage_path,
                  )}
                  alt={
                    imagePendingDeletion.image.alt_text_en ||
                    imagePendingDeletion.project.title_en
                  }
                />
                <p>
                  This image will be permanently removed from “
                  {imagePendingDeletion.project.title_en}”. This cannot be
                  undone.
                </p>
                <div className="admin-dialog-actions">
                  <button
                    type="button"
                    disabled={isDeletingImage}
                    onClick={() => setImagePendingDeletion(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeletingImage}
                    onClick={handleDeleteImage}
                  >
                    {isDeletingImage ? "Deleting…" : "Delete image"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <section
        className="admin-panel admin-login"
        aria-labelledby="admin-heading"
      >
        <p className="admin-brand">
          <img
            src="/brand/Matrabhumi-logo-web.png"
            alt=""
            width="34"
            height="34"
            aria-hidden="true"
          />
          <span>Matrabhumi</span>
        </p>
        <p className="admin-eyebrow">Lobo/admin</p>
        <h1 id="admin-heading">Welcome back</h1>
        <p className="admin-intro">Hello rajje! New Project?</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {errorMessage && (
            <p className="admin-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="admin-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign in securely"}
          </button>
        </form>

        <a className="admin-return" href="/">
          Return to website
        </a>
      </section>
    </div>
  );
}

export default AdminPage;
