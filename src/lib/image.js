const PLACEHOLDER_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>" +
  "<rect width='400' height='300' fill='#f3f4f6'/>" +
  "<path d='M160 190l40-50 30 36 20-22 30 36H160z' fill='#d1d5db'/>" +
  "<circle cx='250' cy='120' r='14' fill='#d1d5db'/>" +
  "<text x='200' y='240' text-anchor='middle' font-family='system-ui,sans-serif' font-size='18' fill='#6b7280'>No image available</text>" +
  "</svg>";

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

// TheMealDB serves a small variant of every thumbnail at `<thumb>/preview`.
export const previewThumb = (url) => (url ? `${url}/preview` : IMAGE_PLACEHOLDER);

export const onImageError = (e) => {
  const img = e.currentTarget;
  if (img.src !== IMAGE_PLACEHOLDER) img.src = IMAGE_PLACEHOLDER;
};
