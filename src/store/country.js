import { writable } from "svelte/store";
import { supabase } from "@lib/supabase/supabaseClient";

const state = {
    country: null,
    countries: [],
}

function createCountryStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchCountries() {
            console.log('[Store] fetchCountries()')
            const { data, error } = await supabase.from("countries").select(`id, name, image, leagues (id, name, image, api_football_id)`);
            console.log("data2: ", data);
            console.log('error: ', error);
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            console.log('array: ', array);
            // this.countries = array
            update((state) => ({ ...state, countries: [...array] }))
        },
        setCountry: (country) => {
            console.log('[Store] setCountry()')
            update((state) => ({ ...state, country: country }))
        }
    }

    return {
        subscribe,
        ...methods,
    }
}

export const countryStore = createCountryStore()
