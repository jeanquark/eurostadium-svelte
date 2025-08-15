<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { userStore } from "@store/user";
    import { counter } from "@store/count";
    import dayjs from '$lib/utils/day'


    onMount(async () => {
        try {
            if ($userStore.users.length < 2) {
                await userStore.fetchUsers();
            }
            console.log("$userStore.users: ", $userStore.users);
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let selectedUser = $state(null);
    let loading = $state(false);

    const fetchUsers = async () => {
        try {
            await userStore.fetchUsers();
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Users</h2>
    $userStore.users.length: {$userStore.users?.length}<br />
    userStore.users.length: {userStore.users?.length}<br />
    <br /><br />

    <div class="row">
        <div class="col-12">
            <div class="responsive-table-container">
                <table class="full-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Created at</th>
                            <th>Last update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $userStore.users as user, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>
                                    {#each user.roles as role}
                                        <span>{role} </span>
                                    {/each}
                                </td>
                                <td>{dayjs(user.inserted_at).format('ddd DD MMM YYYY')}</td>
                                <td>{dayjs(user.updated_at).fromNow()}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style scoped>
    
</style>
