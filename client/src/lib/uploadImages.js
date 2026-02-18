import { supabase } from "../supabase/supabase";

export async function uploadImage(file) {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;

  // Upload the file to Supabase storage
  const { error } = await supabase.storage
    .from("item-images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  // Get public URL
  const { data } = supabase.storage.from("item-images").getPublicUrl(fileName);

  if (!data || !data.publicUrl) {
    console.error("Error fetching public URL");
    return null;
  }

  return data.publicUrl; // Store this in MySQL
}
