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


const SharedMap = () => {

    const [location, setLocation] = useState({
        map: null,
        lat: "",
        lon: ""
    });

    let marker = "";
    let customOverlayStyleClass = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {

        // 맵이 완전이 로딩 될 때 까지 로딩컨텐츠 보여주기
        const loadingContainer = createLoadingContainer();

        let {lat, lon, name } = getQuerystringInfo();

        if( !lat || !lon ){
            lat = 35.1449589;
            lon = 126.9216603;
        }

        if( name === "hospitals" ){
            marker = hospitalMarker;
            customOverlayStyleClass = "bg-border-custom-green";
        }
        else if( name === "day-care-centers" ){
            marker = babyMarker;
            customOverlayStyleClass = "bg-border-custom-yellow";
        }
        else if( name === "kid-cafes" ){
            marker = kidCafeMarker;
            customOverlayStyleClass = "bg-border-custom-puple";
        }
        else if( name === "experience-centers" ){
            marker = centerMarker;
            customOverlayStyleClass = "bg-border-custom-orange";
        }
        else if( name === "craft-rooms" ){
            marker = craftMarker;
            customOverlayStyleClass = "bg-border-custom-sky";
        }
        else{
            marker = hospitalMarker;
            customOverlayStyleClass = "bg-border-custom-green";
            name = "hospitals";
        }

        const map = new kakao.maps.Map(
            document.getElementById('map'),
            {
                center: new kakao.maps.LatLng(lat, lon), //지도의 중심좌표.
                level: 3, //지도의 레벨(확대, 축소 정도)
            }
        );

        setLocation({map: map, lat: lat, lon: lon});

        new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lon),
            image: new kakao.maps.MarkerImage(
                userMarkerImg,
                new kakao.maps.Size(40, 40),
                new kakao.maps.Point(13, 34)
            ),
        });

        const res = await apiScaffold({
            METHOD: "GET",
            URL: `${process.env.REACT_APP__URL}/places/${name}?lat=${lat}&lon=${lon}`,
        });
        console.log(res);

        let placeMarkers = [];
        drawMarkers(map, res.places, placeMarkers);

        // 화면에 모든 마커정보와 이벤트가 생성되었을 때 
        // 로딩 컨테이너를 제거시킵니다.
        removeLoadingContainer(loadingContainer);



        // 줌 이벤트
        kakao.maps.event.addListener(map, 'zoom_changed', function () {
            const level = map.getLevel();
            if (level > 6) {
                map.setLevel(level - 1);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const drawMarkers = (map, places, placeMarkers) => {
        let clickedOverlay = null;

        for (let place of places) {
            const placeMarker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.lat, place.lon),
                image: new kakao.maps.MarkerImage(
                    marker,
                    new kakao.maps.Size(26, 34),
                    new kakao.maps.Point(13, 34)
                ),
            });
            placeMarkers.push(placeMarker);

            const placeOverlay = new kakao.maps.CustomOverlay({
                content:`
                <div class="custom-overlay ${customOverlayStyleClass} w-auto flex justify-center items-center pl-6 py-1  rounded-3xl">
                    <div class="text-white">${place.name}</div> 
                    <img src="${arrowImg}" alt="img" class="w-7 h-7 ml-3 mr-5"/>
                </div>`,
                position: new kakao.maps.LatLng(place.lat, place.lon),
                map: null,
                yAnchor: 2.2,
                xAnchor: 0.5,
                clickable: true,
            });

            const placeOverlayDom = placeOverlay.a.querySelector(".custom-overlay");
            placeOverlayDom.addEventListener("click", async ( event ) => {
                let { name } = getQuerystringInfo();
                if(!name) name = "hapitals";
                const res = await apiScaffold({
                    METHOD: "GET",
                    URL: `${process.env.REACT_APP__URL}/places/${name}/${place.id}`,
                });
                getPlaceDetailInfo( res.place );
            });

            kakao.maps.event.addListener(placeMarker, "click", function () {
                if (clickedOverlay !== null) {
                    clickedOverlay.setMap(null);
                }
                placeOverlay.setMap(map);
                clickedOverlay = placeOverlay;
            });

            kakao.maps.event.addListener(map, "click", function () {
                if (placeOverlay !== null) {
                    placeOverlay.setMap(null);
                }
            });

            kakao.maps.event.addListener(map, "center_changed", function () {
                if (placeOverlay !== null) {
                    placeOverlay.setMap(null);
                }
            });
        }
    }

    const clickToNowPosition = () => {
        const moveLatLon = new kakao.maps.LatLng(location.lat, location.lon);
        location.map.panTo(moveLatLon);
    }

    const getPlaceDetailInfo = ( result ) => {
        console.log( result );
        result = JSON.stringify( result );
        Print.postMessage( result );
    }

    return (
        <div className="map-wrapper">
            <div id="map" className="fixed left-0 top-0 w-full h-full"></div>
            <button className="fixed left-5 bottom-5" onClick={clickToNowPosition}>
                <img
                    src={locationImg}
                    alt="button img"
                    className="w-20 h-20"
                />
            </button>
        </div>
    );
}
export default SharedMap;