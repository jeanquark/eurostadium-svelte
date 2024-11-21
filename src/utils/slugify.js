import slugify from 'slugify'

export default function slugify(str) {
    return slugify(str, { replacement: '_', lower: true });
}
