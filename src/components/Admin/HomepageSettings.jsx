import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import architectureHero from "../../assets/architecture-hero.png";
import { siteCopy } from "../../content/siteCopy.js";
import {
  defaultHomepageSettings,
  getHomepageSettings,
  getSiteAssetUrl,
  notifyHomepageSettingsChanged,
  removeSiteAsset,
  saveHomepageSettings,
  uploadHomepageHero,
} from "../../services/siteSettings.js";

const supportedHeroTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const maximumSourceSize = 30 * 1024 * 1024;
const defaultHeroForm = {
  hero_line_en: siteCopy.en.home.heroHeading,
  hero_line_hi: siteCopy.hi.home.heroHeading,
};

async function optimizeHeroImage(file) {
  const optimizedImage = await imageCompression(file, {
    maxSizeMB: 3,
    maxWidthOrHeight: 3000,
    fileType: "image/webp",
    initialQuality: 0.9,
    preserveExif: false,
    useWebWorker: true,
  });

  return new File([optimizedImage], "homepage-hero.webp", {
    type: "image/webp",
    lastModified: file.lastModified,
  });
}

function HomepageSettings() {
  const [settings, setSettings] = useState(defaultHomepageSettings);
  const [form, setForm] = useState(defaultHeroForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadSettings() {
      const { settings: savedSettings, error } = await getHomepageSettings();

      if (!isCurrent) return;

      if (error) {
        setErrorMessage(
          "Homepage controls are not connected yet. Run the supplied Supabase setup first.",
        );
      } else {
        setSettings(savedSettings);
        setForm({
          hero_line_en:
            savedSettings.hero_line_en || defaultHeroForm.hero_line_en,
          hero_line_hi:
            savedSettings.hero_line_hi || defaultHeroForm.hero_line_hi,
        });
      }

      setIsLoading(false);
    }

    loadSettings();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleTextChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function handleImageSelection(event) {
    const [file] = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!file) return;

    if (!supportedHeroTypes.has(file.type)) {
      setErrorMessage("Choose a JPG, PNG, or WebP hero image.");
      return;
    }

    if (file.size > maximumSourceSize) {
      setErrorMessage("The original hero image must be smaller than 30 MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUseDefaultImage(false);
    setErrorMessage("");
    setMessage("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    let nextImagePath = useDefaultImage ? null : settings.hero_image_path;
    let uploadedImagePath = null;

    if (selectedImage) {
      try {
        const optimizedImage = await optimizeHeroImage(selectedImage);
        const { storagePath, error } = await uploadHomepageHero(optimizedImage);

        if (error) throw error;
        nextImagePath = storagePath;
        uploadedImagePath = storagePath;
      } catch {
        setErrorMessage("The hero image could not be optimized or uploaded.");
        setIsSaving(false);
        return;
      }
    }

    const { settings: savedSettings, error } = await saveHomepageSettings({
      hero_line_en: form.hero_line_en.trim(),
      hero_line_hi: form.hero_line_hi.trim(),
      hero_image_path: nextImagePath,
    });

    if (error) {
      if (uploadedImagePath) await removeSiteAsset(uploadedImagePath);
      setErrorMessage("The homepage changes could not be saved.");
      setIsSaving(false);
      return;
    }

    const previousImagePath = settings.hero_image_path;
    setSettings(savedSettings);
    setForm({
      hero_line_en:
        savedSettings.hero_line_en || defaultHeroForm.hero_line_en,
      hero_line_hi:
        savedSettings.hero_line_hi || defaultHeroForm.hero_line_hi,
    });
    setSelectedImage(null);
    setPreviewUrl("");
    setUseDefaultImage(false);
    setMessage("Homepage hero updated successfully.");
    setIsSaving(false);
    notifyHomepageSettingsChanged(savedSettings.updated_at);

    if (
      previousImagePath &&
      previousImagePath !== savedSettings.hero_image_path
    ) {
      await removeSiteAsset(previousImagePath);
    }
  }

  const currentImageUrl = settings.hero_image_path && !useDefaultImage
    ? getSiteAssetUrl(settings.hero_image_path)
    : null;

  return (
    <section className="admin-homepage-settings" aria-labelledby="homepage-settings-heading">
      <div className="admin-homepage-heading">
        <div>
          <p className="admin-eyebrow">Homepage content</p>
          <h2 id="homepage-settings-heading">Homepage hero</h2>
        </div>
        <span>
          {settings.hero_image_path && !useDefaultImage
            ? "Custom image"
            : "Default image"}
        </span>
      </div>

      {isLoading ? (
        <p className="admin-project-message" role="status">
          Loading homepage controls…
        </p>
      ) : (
        <form onSubmit={handleSave}>
          <div className="admin-hero-editor">
            <div className="admin-hero-preview">
              <img
                src={previewUrl || currentImageUrl || architectureHero}
                alt="Homepage hero preview"
              />
              <span>
                {previewUrl
                  ? "New image preview"
                  : currentImageUrl
                    ? "Current custom hero"
                    : "Current default hero"}
              </span>
            </div>

            <div className="admin-hero-fields">
              <label className="admin-form-field">
                <span>Hero heading in English</span>
                <input
                  name="hero_line_en"
                  value={form.hero_line_en}
                  maxLength="120"
                  placeholder="This Diwali, build something lasting with Matrabhumi."
                  onChange={handleTextChange}
                />
              </label>

              <label className="admin-form-field">
                <span>Hero heading in Hindi</span>
                <input
                  name="hero_line_hi"
                  value={form.hero_line_hi}
                  maxLength="120"
                  placeholder="इस दिवाली, मातृभूमि के साथ कुछ स्थायी बनाएँ।"
                  lang="hi"
                  onChange={handleTextChange}
                />
              </label>

              <small>
                The current heading is shown above. Edit it and save; clearing it restores the permanent default. Recommended image: landscape, at least 2000px wide.
              </small>

              <label className="admin-hero-upload">
                {selectedImage ? "Choose a different image" : "Choose hero image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelection}
                />
              </label>
            </div>
          </div>

          {errorMessage && (
            <p className="admin-error" role="alert">
              {errorMessage}
            </p>
          )}

          {message && (
            <p className="admin-success" role="status">
              {message}
            </p>
          )}

          <div className="admin-form-actions admin-homepage-actions">
            {selectedImage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl("");
                }}
              >
                Cancel image
              </button>
            )}
            {!selectedImage && settings.hero_image_path && (
              <button
                type="button"
                onClick={() => setUseDefaultImage((current) => !current)}
              >
                {useDefaultImage
                  ? "Keep custom image"
                  : "Restore default image"}
              </button>
            )}
            <button type="submit" disabled={isSaving || isLoading}>
              {isSaving ? "Saving homepage…" : "Save homepage"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default HomepageSettings;
