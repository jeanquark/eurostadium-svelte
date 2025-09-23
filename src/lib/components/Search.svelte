<script>
    export let onSearch;
    export let searchTable;

    let text = "";

    const debouncedHandleInput = debounce((value) => {
        console.log("Debounced input:", value);
        // Perform expensive operation (e.g., API call)
        onSearch(value)
    }, 300);

    function handleInput(event) {
        text = event.target.value; // Update text with input value
        // console.log("Input changed:", text);
        debouncedHandleInput(text);
    }

    function handleSearch(text) {
        console.log("handleSearch: ", text);
        onSearch(text);
    }

    function debounce(func, wait) {
        let timeout;

        return function (...args) {
            clearTimeout(timeout); // Clear any existing timer
            timeout = setTimeout(() => {
                func(...args); // Call the function after the delay
            }, wait);
        };
    }
</script>

<div class="search-section">
    <div class="search-box">
        <input
            type="text"
            id="searchInput"
            placeholder="Start typing a {searchTable} name"
            autocomplete="off"
            on:input={handleInput}
        />
        <button id="clearButton" class="primary-button" on:click={() => handleSearch()}>Clear</button>
    </div>
    <!-- <p>Current input: {text}</p> -->
</div>

<style scoped>
    .search-section {
        padding: 25px;
        border-bottom: 1px solid #eee;
    }

    .search-box {
        display: flex;
        gap: 12px;
    }
    input {
        flex: 1;
        padding: 14px 18px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s;
    }

    input:focus {
        outline: none;
        border-color: var(--color-theme-1);
        box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.2);
    }

    /*  */
</style>
