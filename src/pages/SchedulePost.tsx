import { useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Upload, Image, Sparkles, CalendarClock, ArrowLeft, ArrowRight, Check, X, GripVertical, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

/* ─── TYPES ─── */
interface ImageFile {
  id: string;
  name: string;
  url: string;
  order: number;
}

const STEPS = [
  { num: 1, label: "Import & Organisation", icon: Upload },
  { num: 2, label: "Retouches & Filtres", icon: Image },
  { num: 3, label: "Description & Hashtags", icon: Sparkles },
  { num: 4, label: "Programmation", icon: CalendarClock },
];

/* ─── STEP 1: IMPORT ─── */
const StepImport = ({ images, setImages, postType, setPostType }: {
  images: ImageFile[]; setImages: (imgs: ImageFile[]) => void;
  postType: "simple" | "carousel"; setPostType: (t: "simple" | "carousel") => void;
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")).slice(0, 50);
    addFiles(files);
  }, [images]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files).slice(0, 50));
  };

  const addFiles = (files: File[]) => {
    const newImgs: ImageFile[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      order: images.length + i,
    }));
    const combined = [...images, ...newImgs];
    setImages(postType === "simple" ? combined.slice(0, 1) : combined.slice(0, 10));
  };

  const removeImage = (id: string) => setImages(images.filter(img => img.id !== id));

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer relative"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
        <p className="text-foreground font-medium text-lg">Glissez vos photos ici ou cliquez pour sélectionner</p>
        <p className="text-muted-foreground text-sm mt-2">JPG, PNG, WEBP · Max 50MB par image</p>
        <input id="file-input" type="file" accept="image/*" multiple className="hidden" onChange={handleSelect} />
      </div>

      {/* Post type toggle */}
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-foreground text-sm font-medium">{images.length} image{images.length > 1 ? "s" : ""} importée{images.length > 1 ? "s" : ""}</p>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              <button onClick={() => { setPostType("simple"); if (images.length > 1) setImages(images.slice(0, 1)); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${postType === "simple" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                Post simple
              </button>
              <button onClick={() => setPostType("carousel")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${postType === "carousel" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                Carrousel
              </button>
            </div>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-secondary border border-border">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                <button onClick={() => removeImage(img.id)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-primary-foreground" />
                </button>
                {postType === "carousel" && (
                  <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-card/90 border border-border flex items-center justify-center text-xs font-bold text-foreground">
                    {i + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── STEP 2: FILTERS ─── */
const filters = ["Original", "Vintage", "Clair", "Dramatique", "Pastel", "B&W", "Sunset", "Moody", "Vibrant", "Film"];

const StepFilters = ({ images, selectedFilter, setSelectedFilter, adjustments, setAdjustments, currentIdx, setCurrentIdx }: {
  images: ImageFile[]; selectedFilter: string; setSelectedFilter: (f: string) => void;
  adjustments: Record<string, number>; setAdjustments: (a: Record<string, number>) => void;
  currentIdx: number; setCurrentIdx: (i: number) => void;
}) => {
  const sliders = [
    { key: "brightness", label: "Luminosité" },
    { key: "contrast", label: "Contraste" },
    { key: "saturation", label: "Saturation" },
    { key: "sharpness", label: "Netteté" },
    { key: "temperature", label: "Température" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="space-y-4">
        <div className="aspect-square rounded-2xl bg-secondary overflow-hidden relative">
          {images[currentIdx] && (
            <img src={images[currentIdx].url} alt="" className="w-full h-full object-cover"
              style={{
                filter: `brightness(${1 + (adjustments.brightness || 0) / 200}) contrast(${1 + (adjustments.contrast || 0) / 200}) saturate(${1 + (adjustments.saturation || 0) / 200})`,
                ...(selectedFilter === "B&W" ? { filter: "grayscale(1)" } : {}),
              }} />
          )}
          {selectedFilter !== "Original" && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card/80 backdrop-blur-sm text-xs text-foreground font-medium">
              {selectedFilter}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">{currentIdx + 1} / {images.length}</span>
            <button onClick={() => setCurrentIdx(Math.min(images.length - 1, currentIdx + 1))} disabled={currentIdx === images.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div>
          <h3 className="text-foreground font-medium text-sm mb-3">Filtres</h3>
          <div className="grid grid-cols-5 gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setSelectedFilter(f)}
                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-medium border transition-all ${
                  selectedFilter === f ? "border-primary bg-primary/10 text-foreground" : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-foreground font-medium text-sm">Ajustements</h3>
          {sliders.map((s) => (
            <div key={s.key} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="text-foreground">{adjustments[s.key] || 0}</span>
              </div>
              <input type="range" min={-100} max={100} value={adjustments[s.key] || 0}
                onChange={(e) => setAdjustments({ ...adjustments, [s.key]: Number(e.target.value) })}
                className="w-full h-1.5 rounded-full bg-secondary appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer" />
            </div>
          ))}
          <button onClick={() => setAdjustments({})} className="text-xs text-primary hover:underline font-medium">
            <RefreshCw className="w-3 h-3 inline mr-1" />Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── STEP 3: DESCRIPTION & HASHTAGS ─── */
const tones = ["Professionnel", "Casual", "Inspirant", "Humoristique", "Luxe"];
const languages = ["FR", "EN", "ES", "IT", "DE"];
const sampleHashtags = ["#lifestyle", "#photography", "#instagood", "#mood", "#aesthetic", "#creative", "#design", "#art", "#inspiration", "#daily", "#vibes", "#explore", "#trending", "#love", "#beautiful"];

const StepDescription = ({ images, description, setDescription, hashtags, setHashtags, tone, setTone, language, setLanguage, cta, setCta }: {
  images: ImageFile[]; description: string; setDescription: (d: string) => void;
  hashtags: string[]; setHashtags: (h: string[]) => void;
  tone: string; setTone: (t: string) => void;
  language: string; setLanguage: (l: string) => void;
  cta: string; setCta: (c: string) => void;
}) => {
  const [generating, setGenerating] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(15);

  const generateDescription = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const descs: Record<string, string> = {
      Professionnel: "Découvrez notre dernière collection, pensée pour les créateurs exigeants. Chaque détail compte, chaque image raconte une histoire. 📸\n\nNotre engagement : vous offrir les outils pour sublimer votre présence en ligne.",
      Casual: "Nouveau drop 🔥 On adore ce rendu ! Vous en pensez quoi ? Dites-nous en commentaire 👇",
      Inspirant: "Chaque jour est une nouvelle page blanche. Créez, partagez, inspirez ✨ La beauté se trouve dans les détails les plus simples.",
      Humoristique: "Quand ton feed Instagram est plus organisé que ta vie 😅 Merci SpeedPost ! 🚀",
      Luxe: "L'excellence n'est pas un acte, c'est une habitude. Découvrez une vision raffinée de la création de contenu. ✦",
    };
    setDescription(descs[tone] || descs.Professionnel);
    setHashtags(sampleHashtags.slice(0, hashtagCount));
    setGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Phone mockup preview */}
      <div className="flex justify-center">
        <div className="w-[280px] bg-card border border-border rounded-[32px] p-3 shadow-2xl">
          <div className="rounded-[24px] overflow-hidden bg-secondary">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 bg-card">
              <div className="w-7 h-7 rounded-full bg-gradient-primary" />
              <span className="text-foreground text-xs font-medium">@votre_compte</span>
            </div>
            {/* Image */}
            <div className="aspect-square bg-secondary">
              {images[0] && <img src={images[0].url} alt="" className="w-full h-full object-cover" />}
            </div>
            {/* Caption */}
            <div className="p-3 bg-card space-y-2">
              <p className="text-foreground text-[10px] leading-relaxed line-clamp-4">{description || "Votre description apparaîtra ici..."}</p>
              {hashtags.length > 0 && (
                <p className="text-[10px] text-violet-light">{hashtags.slice(0, 5).join(" ")}...</p>
              )}
              {cta && <p className="text-[10px] text-primary font-medium">{cta}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        {/* Tone */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-2">Ton de la description</h3>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button key={t} onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  tone === t ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-2">Langue</h3>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Generate button */}
        <button onClick={generateDescription} disabled={generating}
          className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
          {generating ? (
            <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Génération...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Générer la description</>
          )}
        </button>

        {/* Description textarea */}
        <div className="relative">
          <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 2200))} placeholder="La description générée par l'IA apparaîtra ici. Vous pouvez aussi l'écrire manuellement..." rows={5}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
          <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">{description.length}/2200</span>
        </div>

        {/* Hashtags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-foreground font-medium text-sm">Hashtags ({hashtags.length})</h3>
            <button onClick={() => { setHashtags(sampleHashtags.sort(() => Math.random() - 0.5).slice(0, hashtagCount)); }}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Regénérer
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hashtags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet/15 text-violet-light text-xs">
                {tag}
                <button onClick={() => setHashtags(hashtags.filter(h => h !== tag))} className="hover:text-foreground"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Nombre</span>
            <input type="range" min={5} max={30} value={hashtagCount} onChange={(e) => setHashtagCount(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full bg-secondary appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer" />
            <span className="text-xs text-foreground w-6 text-right">{hashtagCount}</span>
          </div>
        </div>

        {/* CTA */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-2">Call-to-action (optionnel)</h3>
          <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Ex: Lien en bio ↑"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
        </div>
      </div>
    </div>
  );
};

/* ─── STEP 4: SCHEDULE ─── */
const suggestedSlots = [
  { label: "Mar 18h00", badge: "⭐ Meilleur engagement" },
  { label: "Jeu 12h00", badge: "Bon créneau" },
  { label: "Sam 10h30", badge: "Recommandé" },
];

const StepSchedule = ({ images, description, hashtags, publishMode, setPublishMode, selectedDate, setSelectedDate, selectedTime, setSelectedTime }: {
  images: ImageFile[]; description: string; hashtags: string[];
  publishMode: "now" | "schedule"; setPublishMode: (m: "now" | "schedule") => void;
  selectedDate: string; setSelectedDate: (d: string) => void;
  selectedTime: string; setSelectedTime: (t: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Summary */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-foreground font-medium">Récapitulatif</h3>
        <div className="flex gap-3">
          {images.slice(0, 3).map((img) => (
            <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {images.length > 3 && (
            <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">+{images.length - 3}</div>
          )}
        </div>
        <div>
          <p className="text-foreground text-sm line-clamp-3">{description || "Aucune description"}</p>
        </div>
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hashtags.slice(0, 8).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-violet/15 text-violet-light text-[10px]">{tag}</span>
            ))}
            {hashtags.length > 8 && <span className="text-[10px] text-muted-foreground">+{hashtags.length - 8}</span>}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">S</div>
          @studio_mode
        </div>
      </div>

      {/* Scheduling options */}
      <div className="space-y-6">
        {/* Account selector */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-2">Compte Instagram</h3>
          <select className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
            <option>@studio_mode</option>
            <option>@lifestyle_daily</option>
          </select>
        </div>

        {/* Publish mode */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-2">Quand publier ?</h3>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${publishMode === "now" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <input type="radio" name="mode" checked={publishMode === "now"} onChange={() => setPublishMode("now")} className="accent-primary" />
              <span className="text-foreground text-sm font-medium">Maintenant</span>
            </label>
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${publishMode === "schedule" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <input type="radio" name="mode" checked={publishMode === "schedule"} onChange={() => setPublishMode("schedule")} className="accent-primary" />
              <span className="text-foreground text-sm font-medium">Programmer</span>
            </label>
          </div>
        </div>

        {publishMode === "schedule" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Heure</label>
                <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>

            {/* AI suggested slots */}
            <div>
              <h3 className="text-foreground font-medium text-sm mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Suggestions IA
              </h3>
              <div className="space-y-2">
                {suggestedSlots.map((slot) => (
                  <button key={slot.label} onClick={() => { setSelectedTime(slot.label.includes("18") ? "18:00" : slot.label.includes("12") ? "12:00" : "10:30"); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all text-sm">
                    <span className="text-foreground font-medium">{slot.label}</span>
                    <span className="text-primary text-xs">{slot.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN PAGE ─── */
const SchedulePost = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [postType, setPostType] = useState<"simple" | "carousel">("simple");

  // Step 2
  const [selectedFilter, setSelectedFilter] = useState("Original");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  // Step 3
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tone, setTone] = useState("Professionnel");
  const [language, setLanguage] = useState("FR");
  const [cta, setCta] = useState("");

  // Step 4
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("schedule");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const canNext = () => {
    if (step === 1) return images.length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return publishMode === "now" || (selectedDate && selectedTime);
    return false;
  };

  const handleConfirm = () => {
    toast.success("Post programmé avec succès ! 🎉");
  };

  return (
    <AdminLayout title="Nouveau post">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`hidden sm:block text-xs font-medium transition-colors ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-colors ${step > s.num ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
          {step === 1 && <StepImport images={images} setImages={setImages} postType={postType} setPostType={setPostType} />}
          {step === 2 && <StepFilters images={images} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} adjustments={adjustments} setAdjustments={setAdjustments} currentIdx={currentIdx} setCurrentIdx={setCurrentIdx} />}
          {step === 3 && <StepDescription images={images} description={description} setDescription={setDescription} hashtags={hashtags} setHashtags={setHashtags} tone={tone} setTone={setTone} language={language} setLanguage={setLanguage} cta={cta} setCta={setCta} />}
          {step === 4 && <StepSchedule images={images} description={description} hashtags={hashtags} publishMode={publishMode} setPublishMode={setPublishMode} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50">
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleConfirm} disabled={!canNext()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50">
              <Check className="w-4 h-4" /> Confirmer et programmer
            </button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SchedulePost;
