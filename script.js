let map;
let userLocation = null;
let userMarker = null;
let markers = [];
let directionsService, directionsRenderer;

// تحميل الخريطة
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: 31.5130, lng: 34.4570 }
    });

    directionsService = new google.maps.DirectionsService();

    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

// حساب المسافة بين نقطتين
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // نصف قطر الأرض
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;

}

// البحث عن أقرب موقع
function findNearestLocation(userLat, userLng, locations) {
    let nearestLocation = null;
    let shortestDistance = Infinity;

    locations.forEach(location => {
        const distance = calculateDistance(userLat, userLng, location.lat, location.lng);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestLocation = location;
        }
    });

    return { nearestLocation, shortestDistance };
}


// تحميل المحطات والبحث عن الأقرب
function loadStationsAndFindNearest(type) {
    fetch('stations.json')
        .then(response => response.json())
        .then(data => {
            let stations = data[type];
            if (userLocation) {
                const { nearestLocation, shortestDistance } = findNearestLocation(userLocation.lat, userLocation.lng, stations);
                if (nearestLocation) {
                    document.getElementById('output').innerHTML = `أقرب ${type}: ${nearestLocation.name}<br>المسافة: ${shortestDistance.toFixed(2)} كم`;
                    addMarker(nearestLocation);
                    drawRoute(nearestLocation);

                } else {
                    document.getElementById('output').innerHTML = "لا توجد مواقع قريبة.";
                }
            } else {
                alert("حدد موقعك أولاً!");
            }
        })
        .catch(error => console.error("خطأ في تحميل ملف JSON:", error));
}

// إضافة علامة على الخريطة
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name

    });
    markers.push(marker);
}

// رسم المسار على الخريطة
function drawRoute(destination) {
    const request = {
        origin: userLocation,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: 'DRIVING'
    };
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            console.error('تعذر رسم المسار:', status);
        }

    });
}

// تحديد الموقع
document.getElementById('locate-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (userMarker) userMarker.setMap(null);

            userMarker = new google.maps.Marker({
                position: userLocation,

                map: map,
                title: "موقعك"
            });

            map.setCenter(userMarker.getPosition());
            document.getElementById('output').innerHTML = "تم تحديد موقعك بنجاح!";
        });
    } else {
        alert("ميزة تحديد الموقع غير مدعومة.");
    }
});

// ربط الأزرار بالوظائف
document.getElementById('nearest-gas-btn').addEventListener('click', () => loadStationsAndFindNearest('gas_stations'));
document.getElementById('nearest-petrol-btn').addEventListener('click', () => loadStationsAndFindNearest('petrol_stations'));
document.getElementById('nearest-fire-btn').addEventListener('click', () => loadStationsAndFindNearest('fire_stations'));
