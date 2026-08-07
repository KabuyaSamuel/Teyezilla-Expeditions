"use client";

import { useState } from "react";
import MediaPickerField from "./MediaPickerField";
import type { MediaItem } from "@/lib/admin/data/media";

// The Settings page's forms are plain server-action forms (no client state
// of their own), but MediaPickerField needs a controlled value/onChange to
// drive its preview + "Browse Library" picker. This thin wrapper holds that
// local state so MediaPickerField can be dropped into those forms directly --
// the underlying <input name=...> still submits via FormData as normal.
export default function SettingsImageField({
  id,
  name,
  label,
  defaultValue,
  mediaItems,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  mediaItems: MediaItem[];
}) {
  const [value, setValue] = useState(defaultValue);
  return <MediaPickerField id={id} name={name} label={label} value={value} onChange={setValue} mediaItems={mediaItems} />;
}
