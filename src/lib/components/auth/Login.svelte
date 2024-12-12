<script>
    import { jwtDecode } from "jwt-decode";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';

	// let { supabase, session } = $props()

    let loading = $state(false);
    let email = $state("");
    let password = $state("");

    onMount(() => {});

    const handleLogin = async () => {
        try {
            loading = true;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            console.log("data: ", data);
            console.log("Login completed!");
            alert('Login success!')
            goto('/')

            const { subscription } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    if (session) {
                        console.log('session: ', session);
                        // const jwt = jwtDecode(session.access_token);
                        // console.log('jwt: ', jwt)
                        // const userRole = jwt.user_role;
                        // console.log('userRole: ', userRole);
                    }
                },
            );
        } catch (error) {
            console.log("error: ", error);
            // alert(error)
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
        }
    };
</script>

<div class="row flex-center flex">
    <div class="col-6">
        <h2 class="my-2">Login</h2>
        <form class="form-widget" on:submit|preventDefault={handleLogin}>
            <div>
                <label for="emailLogin">Email</label>
                <input
                    id="emailLogin"
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    bind:value={email}
                />
            </div>
            <div>
                <label for="passwordLogin">Password</label>
                <input
                    id="passwordLogin"
                    class="inputField"
                    type="password"
                    placeholder="Your password"
                    bind:value={password}
                />
            </div>
            <div>
                <button
                    type="submit"
                    class="button block"
                    aria-live="polite"
                    disabled={loading}
                >
                    <span>{loading ? "Loading" : "Login"}</span>
                </button>
            </div>
        </form>
    </div>
</div>
