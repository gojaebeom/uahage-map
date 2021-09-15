/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
import React, {useEffect, useState} from "react";
import {apiScaffold} from "../api";
import {createLoadingContainer, removeLoadingContainer} from "../utils/loading";
import {getQuerystringInfo} from "../utils/qeuryStringParser";

import locationImg from "../assets/images/location.svg";
import userMarkerImg from "../assets/images/path.png";

import arrowImg from "../assets/images/arrow.png";

import hospitalMarker from "../assets/images/haspitalMarker.svg";
import kidCafeMarker from "../assets/images/kidCafeMarker.svg";
import centerMarker from "../assets/images/centerMarker.svg";
import babyMarker from "../assets/images/babyMarker.svg";
import craftMarker from "../assets/images/craftMarker.svg";


const DetailMap= () => {

    const [location, setLocation] = useState({
        map: null,
        lat: "",
        lon: ""
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        // 맵이 완전이 로딩 될 때 까지 로딩컨텐츠 보여주기
        const loadingContainer = createLoadingContainer();

        let { address, name } = getQuerystringInfo();

        if(!address){
            address = "";
        }

        console.log(address)

        const map = new kakao.maps.Map(
            document.getElementById('map'),
            {
                center: new kakao.maps.LatLng(35.1449589, 126.9216603), //지도의 중심좌표.
                level: 2, //지도의 레벨(확대, 축소 정도)
            }
        );

        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(address, function(result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                new kakao.maps.CustomOverlay({
                    content: `
                    <div class="flex justify-center  items-center py-1 px-10 bg-border-custom-pink rounded-2xl text-white">
                        <h1>${name}</h1>
                    </div>`,
                    map: map,
                    position: coords,
                    yAnchor: 1.0,
                    xAnchor: 0.3,
                });
                map.setCenter(coords);
            }
        });

        // 화면에 모든 마커정보와 이벤트가 생성되었을 때 
        // 로딩 컨테이너를 제거시킵니다.
        removeLoadingContainer(loadingContainer);
    }, []);

    return (
        <div className="map-wrapper">
            <div id="map" className="fixed left-0 top-0 w-full h-full"></div>
        </div>
    );
}
export default DetailMap;