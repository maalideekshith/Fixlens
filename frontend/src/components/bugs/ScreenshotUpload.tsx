import { useState } from "react";
import api from "../../api/axios";

type ScreenshotUploadProps = {
  bugId: number;
  onUploaded: (url: string) => void;
};

export default function ScreenshotUpload({
  bugId,
  onUploaded,
}: ScreenshotUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const token = localStorage.getItem("token");

      const response = await api.post(
        `/bugs/${bugId}/screenshot`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      onUploaded(response.data.screenshot_url);

      setFile(null);
    } catch (err: any) {
      console.error("Screenshot upload error:", err);

      const message =
        err?.response?.data?.detail ||
        "Screenshot upload failed.";

      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="text-sm font-semibold text-white">
        Screenshot
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Upload an image showing the bug.
      </p>

      <div className="mt-5">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-6 py-8 text-center transition hover:border-blue-500/50 hover:bg-slate-950">
          <div className="text-2xl">📷</div>

          <p className="mt-3 text-sm font-medium text-slate-300">
            {file ? file.name : "Choose a screenshot"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            PNG, JPG or JPEG
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError("");
            }}
          />
        </label>
      </div>

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload Screenshot"}
        </button>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}