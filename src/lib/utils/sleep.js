export default async function sleep(seconds=2000) {
    await new Promise((resolve) => setTimeout(resolve, seconds));
}