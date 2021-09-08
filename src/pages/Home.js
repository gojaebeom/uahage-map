/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { apiScaffold } from "../api";
import { createLoadingContainer, removeLoadingContainer } from "../utils/loading";
import { getQuerystringInfo } from "../utils/qeuryStringParser";

import locationImg from "../assets/images/location.png";
import userMarkerImg from "../assets/images/path.png";
import placeMarkerImg from "../assets/images/place.svg";
import destinationImg from "../assets/images/destination.svg"; 
import arrowImg from "../assets/images/arrow.png"; 

const Home = () => {

    const [location, setLocation ] = useState({
        map: null,
        lat: "",
        lon: ""
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {

        // 맵이 완전이 로딩 될 때 까지 로딩컨텐츠 보여주기
        const loadingContainer = createLoadingContainer();

        const { lat, lon, search } = getQuerystringInfo();

        const map = new kakao.maps.Map(
            document.getElementById('map'), 
            {
                center: new kakao.maps.LatLng(lat, lon), //지도의 중심좌표.
                level: 3, //지도의 레벨(확대, 축소 정도)
            }
        );

        setLocation({map:map, lat:lat, lon:lon});

        if(search)
            new kakao.maps.CustomOverlay({
                map: map,
                content: 
                `<div class="border w-10 h-10"> 
                    <img src="${destinationImg}" />
                </div>`,
                position: new kakao.maps.LatLng(lat, lon),
                yAnchor: 2.2,
                xAnchor: 0.5,
                clickable: true,
            });
        else 
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
            URL: `${process.env.REACT_APP__URL}/places/restaurants?lat=${lat}&lon=${lon}&type=map`,
        });

        let placeMarkers = [];
        drawMarkers(map, res.places, placeMarkers);

        // 화면에 모든 마커정보와 이벤트가 생성되었을 때 
        // 로딩 컨테이너를 제거시킵니다.
        removeLoadingContainer(loadingContainer);
        

        // 지도 움직임 이벤트
        let timer = null;
        kakao.maps.event.addListener(map, 'center_changed', function() {
            // 지도 영역정보를 얻어옵니다 
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(async function() {
                // 맵이 완전이 로딩 될 때 까지 로딩컨텐츠 보여주기
                const loadingContainer = createLoadingContainer();

                const { Ma, La } = map.getCenter();
                const res = await apiScaffold({
                    METHOD: "GET",
                    URL: `${process.env.REACT_APP__URL}/places/restaurants?lat=${Ma}&lon=${La}&type=map`,
                });
                // 장소가 없을 경우 토스트메세지 띄우기
                if(res.places.length <= 0){
                    removeLoadingContainer(loadingContainer);
                    ifNullPlacesThenThrowToast(map);
                    return;
                }
                // 기존의 마커 지우기
                removeMarkers(placeMarkers);
                // 마커 맵에 그리기
                drawMarkers(map, res.places, placeMarkers);
                // 로딩바 제거
                removeLoadingContainer(loadingContainer);
            }, 200);
        });

        // 줌 이벤트
        kakao.maps.event.addListener(map, 'zoom_changed', function() {        
            const level = map.getLevel();
            if(level > 6){
                map.setLevel(level-1);
            }
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    const drawMarkers = (map, places, placeMarkers) => {
        let clickedOverlay = null;

        for(let place of places){
            const placeMarker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.restaurant.lat, place.restaurant.lon),
                image: new kakao.maps.MarkerImage(
                    placeMarkerImg, 
                    new kakao.maps.Size(20, 30),
                    new kakao.maps.Point(13, 34)
                ),
            });
            placeMarkers.push(placeMarker);

            const placeOverlay = new kakao.maps.CustomOverlay({
                content: 
                `<div class="w-auto flex justify-center items-center pl-6 py-1 bg-custom-pink rounded-3xl">
                    <div class="text-white">${place.restaurant.name}</div> 
                    <img src="${arrowImg}" alt="img" class="w-7 h-7 ml-3 mr-4"/>
                </div>`,
                position:new kakao.maps.LatLng(place.restaurant.lat, place.restaurant.lon),
                map: null,
                yAnchor: 2.2,
                xAnchor: 0.5,
                clickable: true,
            });

            kakao.maps.event.addListener(placeMarker, "click", function() {
                if (clickedOverlay !== null) {
                    clickedOverlay.setMap(null);
                }
                placeOverlay.setMap(map);
                clickedOverlay = placeOverlay;
            });

            kakao.maps.event.addListener(map, "click", function() {
                if (placeOverlay !== null) {
                    placeOverlay.setMap(null);
                }
            });

            kakao.maps.event.addListener(map, "center_changed", function() {
                if (placeOverlay !== null) {
                    placeOverlay.setMap(null);
                }
            });
        }
    }

    const removeMarkers = (placeMarkers) => {
        for(let placeMarker of placeMarkers){
            placeMarker.setMap(null);
            placeMarkers = [];
        }
    }
    
    const ifNullPlacesThenThrowToast = (map) => {
        const { Ma, La } = map.getCenter();
        const content = '<div class="py-2 px-3 rounded-md bg-black bg-opacity-80 text-white animate-bounce">장소가 존재하지 않아요!</div>';
        const position = new kakao.maps.LatLng(Ma, La);  
        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: position,
            content: content   
        });
        setTimeout(()=> {
            customOverlay.setMap(null);
        }, 1000);
    }

    const clickToNowPosition = () => {
        const moveLatLon = new kakao.maps.LatLng(location.lat, location.lon);
        location.map.panTo(moveLatLon);
    }

    return(
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
export default Home;