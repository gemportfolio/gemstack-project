async function loadComponent(id, file) {
    const element = document.getElementById(id);

    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        element.innerHTML = await response.text();

    } catch (error) {
        console.error(error);
    }
}

async function loadComponents() {
    const components = document.querySelectorAll("[data-component]");

    await Promise.all(
        Array.from(components).map(element => {
            const id = element.id;
            const file = element.dataset.component;

            return loadComponent(id, file);
        })
    );
}