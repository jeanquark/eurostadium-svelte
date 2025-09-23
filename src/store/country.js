import { writable } from "svelte/store";
import { supabase } from "@lib/supabase/supabaseClient";

const state = {
    country: null,
    countries: [],
    paginatedCountries: {
        data: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0
    },
}

function createCountryStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchCountries() {
            // console.log('[Store] fetchCountries()')
            const { data, error } = await supabase.from("countries").select(`id, name, image, uefa_ranking, leagues (id, name, image, api_football_id)`).order('name');
            console.log("data2: ", data);
            // console.log('error: ', error);
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            // console.log('array: ', array);
            // this.countries = array
            update((state) => ({ ...state, countries: [...array] }))
        },

        async fetchPaginatedCountries(page = 1, pageSize = 10, sortBy = 'uefa_ranking', sortOrder = 'asc') {
            console.log('[Store] fetchPaginatedCountries()', page, pageSize, sortBy, sortOrder)
            // const { data, error } = await supabase.from("countries").select(`id, name, image`);
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1

            const { data, error, count } = await supabase
                .from('countries')
                .select('*, leagues (id, name, wiki)', { count: 'exact' })
                // .order('id', { ascending: true })
                .order(sortBy, { ascending: sortOrder === 'asc' })
                .range(from, to)
            console.log("data2: ", data);
            if (error) {
                console.log('error: ', error);
            }

            update((state) => ({
                ...state, paginatedCountries: {
                    data,
                    totalCount: count,
                    currentPage: page,
                    totalPages: Math.ceil(count / pageSize)
                }
            }))
        },

        async fetchCountryByName(searchTerm, page = 1, pageSize = 10) {
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1

            const { data, error, count } = await supabase
                .from("countries")
                .select("*, leagues (id, name)", { count: 'exact' })
                .ilike("name", `%${searchTerm}%`)
                .order("name")
                .range(from, to);

            if (error) {
                console.error("Error fetching data:", error);
                return [];
            }
            update((state) => ({
                ...state, paginatedCountries: {
                    data,
                    totalCount: count,
                    currentPage: page,
                    totalPages: Math.ceil(count / pageSize)
                }
            }))
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
