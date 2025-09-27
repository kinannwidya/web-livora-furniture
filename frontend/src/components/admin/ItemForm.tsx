// React hooks and image cropper import
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Cropper from "react-easy-crop";

// Form value type
export type ItemFormValue = {
  key: string;
  name: string;
  imageFile: File | null;
  imageUrl?: string;
};

// Props for ItemForm
type Props = {
  mode: "create" | "edit";
  type: "category" | "room";
  initial?: Partial<ItemFormValue>;
  submitting?: boolean;
  onSubmit: (val: { key: string; name: string; imageFile: File | null }) => void | Promise<void>;
};

// ItemForm component (used for create/edit category or room)
export default function ItemForm({ mode, type, initial, submitting, onSubmit }: Props) {
  // Form states
  const [keyVal, setKeyVal] = useState(initial?.key ?? "");
  const [nameVal, setNameVal] = useState(initial?.name ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");

  // Raw image before crop
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Aspect ratio (square for category, 16:9 for room)
  const aspect = type === "category" ? 1 : type === "room" ? 16 / 9 : undefined;

  // Preview image (either cropped file or existing URL)
  const preview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl || "";
  }, [imageFile, imageUrl]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  // Handle file input change
  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setRawImage(reader.result as string);
      reader.readAsDataURL(f);
    }
  }

  // Clear file/image states
  function clearFile() {
    setImageFile(null);
    setImageUrl("");
    setRawImage(null);
  }

  // Submit form handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyVal || !nameVal) return;
    await onSubmit({ key: keyVal.toLowerCase(), name: nameVal, imageFile });
  }

  // Crop complete handler
  async function onCropComplete(_: any, areaPixels: any) {
    if (!rawImage) return;

    const image = await createCroppedImage(rawImage, areaPixels);
    setImageFile(image);
    setImageUrl("");
  }

  // File name display
  const fileName = imageFile
    ? imageFile.name
    : imageUrl
    ? "Image already uploaded"
    : "No file chosen";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 md:grid-cols-2 bg-white border p-4 relative"
    >
      {/* LEFT: key + name inputs */}
      <div className="grid gap-3 content-start">
        <div>
          <label className="text-sm font-medium">Key</label>
          <input
            value={keyVal}
            onChange={(e) => setKeyVal(e.target.value)}
            placeholder="living-room / sofa / etc."
            className="mt-1 w-full border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            placeholder="Living Room / Sofas / etc."
            className="mt-1 w-full border px-3 py-2"
            required
          />
        </div>
      </div>

      {/* RIGHT: image upload + crop */}
      <div className="grid gap-2 content-start">
        <span className="text-sm">Image</span>

        {/* File input + filename + clear button */}
        <div className="flex gap-2 items-center border p-2 w-full overflow-hidden">
          <input
            id="item-file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <label
            htmlFor="item-file"
            className="px-4 py-2 bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 transition-colors shrink-0"
          >
            Choose File
          </label>

          <span className="text-gray-500 text-sm flex-1 truncate min-w-0">
            {fileName}
          </span>

          {(imageFile || imageUrl || rawImage) && (
            <button
              type="button"
              onClick={clearFile}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
              title="Clear"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Cropper modal */}
        {rawImage && (
          <div className="relative w-full h-64 bg-black">
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {/* Preview image */}
        {preview && !rawImage && (
          <img
            src={preview}
            alt="preview"
            className="h-32 object-contain mt-2"
          />
        )}
      </div>

      {/* Submit button */}
      <div className="md:col-span-2 flex justify-end">
        <button
          disabled={!!submitting}
          className="h-10 px-4 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : mode === "create" ? "Add" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/* ---------------------------
   Helper: crop image to new file
---------------------------- */
async function createCroppedImage(src: string, pixelCrop: any): Promise<File> {
  const img = document.createElement("img");
  img.src = src;
  await new Promise((resolve) => (img.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      }
    }, "image/jpeg");
  });
}
