<script lang="ts">
    import { onMount } from "svelte";
    import { jwtDecode } from "jwt-decode";
    import type { AuthSession } from "@supabase/supabase-js";
    import { supabase } from "@lib/supabase/supabaseClient";

    // export let session: AuthSession;

    let loading = false;
    let username: string | null = null;
    let website: string | null = null;
    let avatarUrl: string | null = null;

    let session;

    onMount(() => {
        // getProfile();
        supabase.auth.getSession().then(({ data }) => {
            console.log("data: ", data);
            session = data.session;
            // const { user } = session;
            // console.log("user: ", user);
        });

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
            const jwt: any = jwtDecode(session.access_token);
            console.log("jwt: ", jwt);
            const userRole = jwt.user_role;
            console.log("userRole: ", userRole);
        });
    });

    const getProfile = async () => {
        try {
            loading = true;
            console.log("session: ", session);
            return;
            const { user } = session;
            console.log("user: ", user);

            const { data, error, status } = await supabase
                .from("profiles")
                .select("username, website")
                .eq("id", user.id)
                .single();

            if (error && status !== 406) throw error;

            if (data) {
                username = data.username;
                website = data.website;
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
        }
    };

    const updateProfile = async () => {
        try {
            loading = true;
            const { user } = session;

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
        }
    };
</script>

<form on:submit|preventDefault={updateProfile} class="form-widget">
    <div>Email: {session?.user?.email}</div>
    <div>
        <label for="username">Name</label>
        <input id="username" type="text" bind:value={username} />
    </div>
    <div>
        <label for="website">Website</label>
        <input id="website" type="text" bind:value={website} />
    </div>
    <div>
        <button type="submit" class="button primary block" disabled={loading}>
            {loading ? "Saving ..." : "Update profile"}
        </button>
    </div>
    <button
        type="button"
        class="button block"
        on:click={() => supabase.auth.signOut()}
    >
        Sign Out
    </button>
</form>
