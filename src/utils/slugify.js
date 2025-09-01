// /src/utils/slugify.js

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single one
    .replace(/^-+/, "") // Trim hyphens from the start
    .replace(/-+$/, ""); // Trim hyphens from the end
};

export default slugify;
