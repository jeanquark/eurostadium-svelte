<script>
    import { jwtDecode } from "jwt-decode";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { addToast } from "@store/toast";

    let loading = $state(false);
    let email = $state("");
    let password = $state("");

    onMount(() => {});

    const handleLogin = async () => {
        try {
            console.log("handleLogin");
            loading = true;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            console.log("data: ", data);
            console.log("Login completed!");
            goto("/");
        } catch (error) {
            console.log("error: ", error);
            // alert(error)
            addToast({
                message: "An error occured.",
                type: "error",
                dismissible: false,
                timeout: 3000,
            });
            if (error instanceof Error) {
                // alert(error.message);
            }
        } finally {
            loading = false;
        }
    };
</script>

<div class="" style="">
    <h2 class="text-center my-2">Login</h2>
    <form onsubmit={() => handleLogin()}>
        <div class="row justify-center align-center">
            <div class="col-4 text-right px-2">
                <label for="emailLogin">Email</label>
            </div>
            <div class="col-8 px-2">
                <input
                    id="emailLogin"
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    required
                    bind:value={email}
                />
            </div>
        </div>
        <div class="row justify-center align-center my-1">
            <div class="col-4 text-right px-2">
                <label for="passwordLogin">Password</label>
            </div>
            <div class="col-8 px-2">
                <input
                    id="passwordLogin"
                    class="inputField"
                    type="password"
                    placeholder="Your password"
                    required
                    bind:value={password}
                />
            </div>
        </div>
        <div class="row justify-center">
            <div class="col-6 text-center">
                <button
                    type="submit"
                    class=""
                    aria-live="polite"
                    disabled={loading}
                >
                    <span>{loading ? "Loading" : "Login"}</span>
                </button>
            </div>
        </div>
    </form>
</div>

<style>
    input[type="text"],
    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    button[type="submit"] {
        width: 100%;
        background-color: #4caf50;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button[type="submit"]:hover {
        background-color: #45a049;
    }
</style>
