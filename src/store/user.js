import { writable } from "svelte/store";
import { supabase } from "@lib/supabase/supabaseClient";

const state = {
    users: [],
}

function createUserStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchUsers() {
            console.log('[Store] fetchUsers()')
            // const { data, error } = await supabase.from("users").select(`*`);
            // const { data: data2, error: error2 } = await supabase.from("auth.users").select(`*`);
            
            const array = []
            const response = await fetch('/api/supabase/fetch-users')
            console.log('[User store] response: ', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { users} = await response.json();
            console.log('users: ', users);

            for (let i = 0; i < users.length; i++) {
                array.push(users[i])
            }
            console.log('[Store] @user array: ', array);
            update((state) => ({ ...state, users: [...array] }))
        }
    }

    return {
        subscribe,
        ...methods,
    }
}

export const userStore = createUserStore()
