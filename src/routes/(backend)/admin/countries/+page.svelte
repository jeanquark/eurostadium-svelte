<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { countryStore } from "@store/country";
    import { counter } from "@store/count";
    import SortAsc from "@components/icons/SortAsc.svelte";
    import SortDesc from "@components/icons/SortDesc.svelte";

    onMount(async () => {
        if ($countryStore.countries.length < 2) {
            await countryStore.fetchCountries();
        }
        // items = $countryStore.countries.slice(
        //     currentPage - 1,
        //     currentPage * itemsPerPage,
        // );
    });

    let itemsPerPage = $state("5");
    let currentPage = $state(1);
    let sortBy = $state("id");
    let sortOrder = $state("asc");
    let loading = $state(false);
    // let items = $state([]);

    const items = $derived(
        $countryStore.countries
            .sort((a, b) => {
                if (sortBy == "id") {
                    return sortOrder == "asc"
                        ? a["id"] - b["id"]
                        : b["id"] - a["id"];
                } else {
                    return sortOrder == "asc"
                        ? a[sortBy].localeCompare(b[sortBy])
                        : b[sortBy].localeCompare(a[sortBy]);
                }
            })
            .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage,
            ),
    );

    const fetchCountries = async () => {
        try {
            await countryStore.fetchCountries();
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const sortColumn = (column) => {
        console.log("sortColumn", column);
        sortBy = column.toLowerCase();
        sortOrder == "asc" ? (sortOrder = "desc") : (sortOrder = "asc");
    };
</script>

<div class="container">
    itemsPerPage: {itemsPerPage}<br />
    currentPage: {currentPage}<br />
    sortBy: {sortBy}<br />
    sortOrder: {sortOrder}<br />
    <h2 class="text-center my-2">Countries</h2>
    <div class="row justify-center">
        <div class="col-10">
            <table>
                <thead>
                    <tr>
                        <th>N°</th>
                        <th
                            >ID
                            <button
                                class="btnSort"
                                onclick={() => sortColumn("id")}
                            >
                                {#if sortBy == "id"}
                                    {#if sortOrder == "asc"}
                                        <SortAsc width="20" color="#FF0000" />
                                    {:else}
                                        <SortDesc width="20" color="#FF0000" />
                                    {/if}
                                {:else}
                                    <SortAsc width="20" color="#ccc" />
                                {/if}
                                <!-- {#if sortBy == "id"}<img
                                        src={`/images/icons/${sortOrder == "asc" ? "arrow-up-wide-short-solid.svg" : "arrow-down-short-wide-solid.svg"}`}
                                        width="20"
                                        alt="sort direction"
                                    />{:else}<img
                                        src={"/images/icons/arrow-up-wide-short-solid-grey.svg"}
                                        width="20"
                                        alt="sort direction"
                                    />{/if}</button
                            > -->
                            </button></th
                        >
                        <th
                            >Name<button
                                class="btnSort"
                                onclick={() => sortColumn("name")}
                            >
                                {#if sortBy == "name"}
                                    {#if sortOrder == "asc"}
                                        <SortAsc width="20" color="#FF0000" />
                                    {:else}
                                        <SortDesc width="20" color="#FF0000" />
                                    {/if}
                                {:else}
                                    <SortAsc width="20" color="#ccc" />
                                {/if}
                            </button></th
                        >
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as country, i}
                        <tr>
                            <td>{i + 1}</td>
                            <td>{country.id} </td>
                            <td>{country.name}</td>
                            <td
                                ><img
                                    src="/images/flags/{country.image}"
                                    height="20"
                                    alt="country flag"
                                /></td
                            >
                        </tr>
                    {/each}
                </tbody>
                <tfoot class="footer">
                    <tr>
                        <td colspan="4">
                            <div class="d-flex" style="align-items: center;">
                                <div
                                    class="flex flex-grow flex-start border-1"
                                    style=""
                                >
                                    Items per page
                                    <select bind:value={itemsPerPage}>
                                        <option value="5" selected>5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="all">all</option>
                                    </select>
                                </div>
                                <div
                                    class="flex flex-grow flex-center border-2"
                                    style=""
                                >
                                    <div class="pagination border-5">
                                        {#each { length: $countryStore.countries?.length / itemsPerPage } as _, i}
                                            <button
                                                type="button"
                                                class={`btnPage ${
                                                    currentPage == i + 1 &&
                                                    "active"
                                                }`}
                                                onclick={() =>
                                                    (currentPage = i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        {/each}
                                    </div>
                                </div>
                                <div
                                    class="flex flex-grow flex-end text-right border-3"
                                    style=""
                                >
                                    Total entries: {$countryStore.countries
                                        ?.length}
                                </div>
                            </div></td
                        >
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<style>
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }

    .footer {
        border: 2px solid red;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }
    .btnPage {
        margin: 0 5px;
        padding: 6px;
        background: #ccc;
        border: none;
        /* border-radius: 0.2em; */
    }
    .btnPage:hover {
        cursor: pointer;
        background: orange;
    }
    .btnPage.active {
        background: orange;
    }
    .btnSort {
        background: none;
        border: none;
    }
    .btnSort:hover {
        cursor: pointer;
    }
</style>
