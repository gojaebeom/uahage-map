const mapContainer = document.querySelector(".map-wrapper");

export const createLoadingContainer = ( ) => {
    const loadingContainer = document.createElement("div");
    loadingContainer.setAttribute("class","loadingContainer");
    loadingContainer.innerHTML = `
    <div class="w-full h-screen flex justify-center items-center">
        <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>`;
    
    document.querySelector(".map-wrapper").appendChild(loadingContainer);
    return loadingContainer;
}

export const removeLoadingContainer = ( loadingContainer ) => {
    document.querySelector(".map-wrapper").removeChild(loadingContainer);
}