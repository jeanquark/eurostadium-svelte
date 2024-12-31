import { writable } from "svelte/store";
import { supabase } from "../lib/supabase/supabaseClient";

const state = {
    images: [],
}

function createImageStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchImages() {
            console.log('[Store] fetchImages()')
            const { data, error } = await supabase.from("images").select(`*`);
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            console.log('array: ', array);
            // this.images = array
            update((state) => ({ ...state, images: [...array] }))
        }
    }

    return {
        subscribe,
        ...methods,
    }
}

export const countryStore = createCountryStore()
