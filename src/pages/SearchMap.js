/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
import { useEffect } from "react";
import { getQuerystringInfo } from "../utils/qeuryStringParser";

const SearchMap = () => {


    useEffect(() => {
        
        let { keyword, lat, lon ,userId }  = getQuerystringInfo();

        if(!keyword) keyword = "카페";
        
        if (!keyword.replace(/^\\s+|\s+$/g, '')) {
            getResult('null');
            return false;
        }

        const ps = new kakao.maps.services.Places();

        ps.keywordSearch(keyword, (data, status, pagination) => {
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
        },
        {
            location: new kakao.maps.LatLng(lat,lon)
        });
    }, []);

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {
        let listEl = document.getElementById('placesList'),
            menuEl = document.getElementById('menu_wrap'),
            fragment = document.createDocumentFragment(),
            bounds = new kakao.maps.LatLngBounds(),
            listStr = '';
        // 검색 결과 목록에 추가된 항목들을 제거합니다
        removeAllChildNods(listEl);
        for (let i = 0; i < places.length; i++) {
            let  itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
            fragment.appendChild(itemEl);
        }
        // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;
    }

    function getResult(address) { 
        if(address=='null'){
            Print.postMessage( "null" );
        }
        var geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function(result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
             //  result.La, result.Ma.
                console.log(result[0].x);
                window.location.href="/?type=destination&userId="+userId+"&lat="+result[0].y+"&lon="+result[0].x;
             //   location.href="/maps/show-place?lat="+result[0].y+"&lon="+result[0].x+"&type=destination";
            }
        });
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {
        const address = "'" + places.address_name + "'";
        const el = document.createElement('li');

        let itemStr = `
        <span class="markerbg marker_' + (index + 1) + '"></span>
        <div class="info" onclick="getResult(`+address+`)">
            <h5>${ places.place_name }</h5>`;
        
        if (places.road_address_name) {
            itemStr += `
            <span>${ places.road_address_name }</span>
            <span class="jibun gray">${ places.address_name }</span>`;
        } else {
            itemStr += 
            `<span>${ places.address_name }</span>`;
        }
        itemStr += 
            `<span class="tel">${ places.phone }</span>
        </div>`;
        el.innerHTML = itemStr;
        el.className = "item";
        return el;
    }

    function removeAllChildNods(el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }


    return(
    <div>
        <div className="map_wrap">
            <div id="map" style={{position:"fixed",width:"100%",height:"100%",left:0,top:0,background:"rgba(0,0,0,0)",zIndex:10}}>
                <div className="bg_white" id="menu_wrap">
                    <hr/>
                    <ul id="placesList"></ul>
                    <div id="pagination"></div>
                </div>
            </div>
        </div>
    </div>
    );
}
export default SearchMap;