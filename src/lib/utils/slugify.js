// import * as slugifyFn from 'slugify'
// import {slugifyFn as slugify} from 'slugify'
import slugifyFn from 'slugify'

export default function slugify(str) {
    // return slugifyFn(str, { replacement: '_', lower: true });
    return slugifyFn(str, { replacement: '_', lower: true }).replace(/-/g, '_');;
}
