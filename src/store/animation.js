import { writable } from "svelte/store"

// export const animationStore = writable({
//     hasAnimationPlayed: false,
// })

export const hasAnimationPlayed = writable(false);