<script lang="ts">
    import { supabase } from "../../lib/supabase/supabaseClient";

    let loading = false;
    let email = "";
    let password = "";

    const handleLogin = async () => {
        try {
            loading = true;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error;
            console.log('Login completed!')
        } catch (error) {
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
