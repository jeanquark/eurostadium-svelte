<script>
    import { supabase } from "@lib/supabase/supabaseClient";
    import { goto } from "$app/navigation";

    let loading = $state(false);
    let email = $state("");
    let password = $state("");

    const handleRegister = async () => {
        try {
            loading = true;
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            console.log("Registration completed!");
            alert("Registration completed!");
            goto("/auth/login");
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
        <h2 class="text-center my-2">Register</h2>
        <form class="form-widget" onsubmit={handleRegister}>
            <div>
                <label for="emailRegister">Email</label>
                <input
                    id="emailRegister"
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    bind:value={email}
                />
            </div>
            <div>
                <label for="passwordRegister">Password</label>
                <input
                    id="passwordRegister"
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
                    <span>{loading ? "Loading" : "Register"}</span>
                </button>
            </div>
        </form>
    </div>
</div>
