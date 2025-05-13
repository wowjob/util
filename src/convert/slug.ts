export const slugify = (str = '') => {
  // convert to lowercase and replace spaces with hyphens
  let slug = str.trim().toLowerCase().replace(/\s+/g, '-')

  // remove special characters
  slug = slug.replace(/[^a-z0-9-]/g, '')

  // remove consecutive hyphens
  slug = slug.replace(/-+/g, '-')

  // replace leading and trailing dashes (-)
  if (slug[0] === '-') {
    slug = slug.slice(1)
  }

  if (slug[slug.length - 1] === '-') {
    slug = slug.slice(0, -1)
  }

  return slug
}
