const initialState = {
    lat: "",
    lon: "",
}

export const userLocation = (state=initialState, action ) => {
    switch( action.type ) {
        case "SET_LOCATION" :
            return action.payload;
        default :
            return state;
    }
}