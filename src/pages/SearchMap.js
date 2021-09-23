/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
import { useEffect } from "react";
import { getQuerystringInfo } from "../utils/qeuryStringParser";

const SearchMap = () => {

    useEffect(()=> {
        console.log("searchPlaces 함수 실행");
        searchPlaces();
    }, []);


    let { keyword, lat, lon ,userId, token } = getQuerystringInfo();
    
    console.log(keyword);

    if( !lat || !lon ){
        lat = 35.1449589;
        lon = 126.9216603;
    }
    
    function getResult(address) { 
        console.log(address);
        console.log("리절트");
        if(address === 'null'){
            Print.postMessage( "null" );
        }
        var geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function(result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                window.location.href="/?type=destination&userId="+userId+"&lat="+result[0].y+"&lon="+result[0].x;
            }
        });
    }
    
    // 장소 검색 객체를 생성합니다
    const ps = new kakao.maps.services.Places();
    
    // 키워드 검색을 요청하는 함수입니다
    function searchPlaces() {
        if (!keyword.replace(/^\\s+|\s+$/g, '')) {
            getResult('null');
            return false;
        }
        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        ps.keywordSearch(keyword, placesSearchCB, {
            location: new kakao.maps.LatLng(lat,lon)
        });
    }
    
    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            // 정상적으로 검색이 완료됐으면
            // 검색 목록과 마커를 표출합니다
            displayPlaces(data);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            getResult('null');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            getResult('null');
            return;
        }
    }
    
    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {
        let listEl = document.getElementById('placesList'),
            menuEl = document.getElementById('menu_wrap'),
            fragment = document.createDocumentFragment(),
            bounds = new kakao.maps.LatLngBounds();
        // 검색 결과 목록에 추가된 항목들을 제거합니다
        removeAllChildNods(listEl);
        for (let i = 0; i < places.length; i++) {
            // 검색 결과 항목 Element를 생성합니다.
            let itemEl = getListItem(i, places[i]); 
            fragment.appendChild(itemEl);
        }
        // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다.
    function getListItem(index, places) {
        const address = "'" +places.address_name+ "'";
        const el = document.createElement('li');
        const dom = `
        <div class="w-full border-b p-5 cursor-pointer">
            <h5 class="font-noto-medium text-gray-800 text-xl mb-1">${ places.place_name }</h5>
            <p class="font-noto-light text-gray-400">${ places.road_address_name ? places.road_address_name : places.address_name  }</p>
            <p class="text-custom-pink">${ places.phone }</p>
        </div>`; 
        el.innerHTML = dom;
        el.className = "item";
        el.onclick = () => {
            if(address === 'null'){
                Print.postMessage( "null" );
            }
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, function(result, status) {
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    window.location.href=`/?type=destination&userId=${userId?userId:0}&lat=${result[0].y}&lon=${result[0].x}`;
                }
            });
        }
        return el;
    }
    
    function removeAllChildNods(el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }

    return(
    <div id="map">
        <div id="menu_wrap">
            <ul id="placesList"></ul>
            <div id="pagination"></div>
        </div>
    </div>
    );
}
export default SearchMap;