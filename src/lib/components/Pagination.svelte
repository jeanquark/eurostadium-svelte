<script>
    import { onMount } from "svelte";
    export let totalPages = 1;
    export let currentPage = 1;
    export let maxVisible = 10;
    export let onPageChange;

    $: visiblePages = getVisiblePageNumbers(
        currentPage,
        totalPages,
        maxVisible
    );

    onMount(async () => {
        try {
        } catch (error) {
            console.log("error: ", error);
        }
    });

    function handlePageChange(page) {
        onPageChange(page);
        // getPaginationPages(currentPage, totalPages)
        // console.log('abc: ', abc);
        getVisiblePageNumbers(currentPage, totalPages);
    }

    function getVisiblePageNumbers(current, total, max = maxVisible) {
        if (total <= 0 || current < 1 || current > total) return [];
        const half = Math.floor((max - 1) / 2);
        let start = Math.max(1, current - half);
        let end = Math.min(total, start + max - 1);
        if (end - start + 1 < max) {
            start = Math.max(1, end - max + 1);
        }
        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }
</script>

<div class="pagination my-2">
    totalPages: {totalPages}<br />
    currentPage: {currentPage}<br />
    <!-- visiblePages: {JSON.stringify(visiblePages)}<br /> -->
    <button
        class="page-button"
        disabled={currentPage === 1}
        on:click={() => handlePageChange(currentPage - 1)}>Prev</button
    >

    <!-- {#each Array(totalPages) as _, page}
        <button
            class={`page-button ${currentPage === page + 1 ? "active" : ""}`}
            on:click={() => handlePageChange(page + 1)}
        >
            {page + 1}
        </button>
    {/each} -->

    <!-- {#each Array(10)
        .fill()
        .map((_, index) => currentPage + index - 5) as page}
        <button
            class={`page-button ${currentPage === page + 1 ? "active" : ""}`}
            on:click={() => handlePageChange(page + 1)}
        >
            {page + 1}
        </button>
    {/each} -->

    {#each visiblePages as page}
        <button
            class={`page-button ${currentPage === page ? "active" : ""}`}
            on:click={() => handlePageChange(page)}
        >
            {page}
        </button>
    {/each}

    <button
        class="page-button"
        disabled={currentPage === totalPages}
        on:click={() => handlePageChange(currentPage + 1)}>Next</button
    >
</div>

<style scoped>
    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .page-button {
        margin: 0 5px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
    }

    .active {
        /* background-color: #325bad; */
        background-color: var(--color-theme-1);
        color: #fff;
    }
</style>
