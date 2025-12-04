export async function uploadToImgBB(file) {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error('Missing VITE_IMGBB_KEY in environment variables');

  if (!file) throw new Error('No file provided');

  const form = new FormData();
  form.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();

  if (!data?.success) {
    console.error(data);
    throw new Error('ImgBB upload failed');
  }

  return data.data.url; // direct image URL
}
