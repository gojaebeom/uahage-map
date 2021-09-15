export const getQuerystringInfo = () => {
    const path = window.location.search.substring(1);
    try{
        return JSON.parse('{"' + decodeURI(path)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') + '"}');
    }catch(e){
        console.warn("위도, 경도값이 입력되지 않아, 대체 장소로 이동됩니다.");
        return {
            lat:"", 
            lon:""
        }
    }
}