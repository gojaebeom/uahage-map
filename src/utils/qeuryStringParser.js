export const getQuerystringInfo = () => {
    const path = window.location.search.substring( 1 );
    console.log( path );
    if( path === "" ){
        return { 
            lat: 35.1449589,
            lon: 126.9216603,
            search: false,
        }
    }
    return JSON.parse('{"' + decodeURI(path)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g,'":"') + '"}');
}