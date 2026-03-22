import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

type CreateTourDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    transportType: string;
    from: string;
    to: string;
  }) => void;
};

type FormState = {
  name: string;
  description: string;
  transportType: string;
  from: string;
  to: string;
};

const initialForm: FormState = {
  name: "",
  description: "",
  transportType: "foot",
  from: "",
  to: "",
};

export default function CreateTourDialog({
  open,
  onClose,
  onSubmit,
}: CreateTourDialogProps) {
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.name.trim() &&
    form.description.trim() &&
    form.transportType.trim() &&
    form.from.trim() &&
    form.to.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      transportType: form.transportType,
      from: form.from.trim(),
      to: form.to.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-primary p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-3xl font-bold text-heading text-secondary">Create <span className="text-accent">Tour</span></div>
            <p className="mt-1 text-base">
              Add the basic tour details to get started.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-border p-2 text-secondary transition hover:bg-danger/10 hover:text-danger"
          >
            <CircleX size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="tour-name"
              className="mb-2 block text-sm font-medium text-secondary"
            >
              Name
            </label>
            <input
              id="tour-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Morning Hike"
              className="w-full rounded-xl border border-border bg-primary px-4 py-3 text-secondary outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="tour-description"
              className="mb-2 block text-sm font-medium text-secondary"
            >
              Description
            </label>
            <textarea
              id="tour-description"
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="A beautiful morning hike through the mountains"
              className="w-full rounded-xl border border-border bg-primary px-4 py-3 text-secondary outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="transport-type"
              className="mb-2 block text-sm font-medium text-secondary"
            >
              Transport Type
            </label>
            <select
              id="transport-type"
              value={form.transportType}
              onChange={(e) => updateField("transportType", e.target.value)}
              className="w-full rounded-xl border border-border bg-primary px-4 py-3 text-secondary outline-none transition focus:border-accent"
            >
              <option value="foot">Foot / Hike</option>
              <option value="bike">Bike</option>
              <option value="running">Running</option>
              <option value="car">Car / Vacation</option>
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="from-location"
                className="mb-2 block text-sm font-medium text-secondary"
              >
                From
              </label>
              <input
                id="from-location"
                type="text"
                value={form.from}
                onChange={(e) => updateField("from", e.target.value)}
                placeholder="Start location"
                className="w-full rounded-xl border border-border bg-primary px-4 py-3 text-secondary outline-none transition focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="to-location"
                className="mb-2 block text-sm font-medium text-secondary"
              >
                To
              </label>
              <input
                id="to-location"
                type="text"
                value={form.to}
                onChange={(e) => updateField("to", e.target.value)}
                placeholder="Destination"
                className="w-full rounded-xl border border-border bg-primary px-4 py-3 text-secondary outline-none transition focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-danger px-4 py-2 text-danger transition hover:bg-danger/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid}
              className="rounded-xl bg-secondary px-4 py-2 text-primary transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Tour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
