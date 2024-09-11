import { writable } from 'svelte/store'

export const countStore = writable({
    value: 0
})

export const countHandlers = {
    // setCount: async (n) => {
    //     countStore.value = n
    //     console.log('countStore.value: ', countStore.value)
    // }
}