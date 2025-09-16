<script>
    export let totalPages;
    export let currentPage;
    export let onPageChange;

    function handlePageChange(page) {
        onPageChange(page);
    }
</script>

<div class="pagination my-2">
    totalPages: {totalPages}<br />
    currentPage: {currentPage}<br />
    {#if currentPage > 1}
        <button class="page-button" on:click={() => handlePageChange(currentPage - 1)}>Prev</button>
    {/if}

    {#each Array(totalPages) as _, page}
        <button
            class={`page-button ${currentPage === page + 1 ? "active" : ""}`}
            on:click={() => handlePageChange(page + 1)}
        >
            {page + 1}
        </button>
    {/each}

    {#if currentPage < totalPages}
        <button class="page-button" on:click={() => handlePageChange(currentPage + 1)}>Next</button>
    {/if}
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
        background-color: #325bad;
        color: #fff;
    }
</style>