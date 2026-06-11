//alert("My JavaScript is successfully loading!");

//const socket = io();
//const map = L.map('map').setView([0, 0], 2);
// ... the rest of your code

const socket = io("http://localhost:3000");
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markers = {};
let isFirstLoad = true;

// --- UTILITY: Generate a unique color from a string (Socket ID) ---
function getColorFromId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        // Pad with 0 to ensure 2 characters
        color += ('00' + value.toString(16)).substr(-2); 
    }
    return color;
}

// --- SOCKET LISTENERS ---
socket.on("connection",(socket) => {
  console.log("user connected: ",socket.id);
})
socket.on('current-users', (users) => {
    for (const id in users) {
        if (!markers[id]) {
            const userColor = getColorFromId(id);
            // Use L.circleMarker instead of L.marker
            markers[id] = L.circleMarker([users[id].latitude, users[id].longitude], {
                color: '#fff',       // White border
                weight: 2,           // Border thickness
                fillColor: userColor,// Unique inner color
                fillOpacity: 1,      // Solid fill
                radius: 10           // Size of the circle
            }).addTo(map);
        }
    }
});

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        const userColor = getColorFromId(id);
        markers[id] = L.circleMarker([latitude, longitude], {
            color: '#fff',
            weight: 2,
            fillColor: userColor,
            fillOpacity: 1,
            radius: 10
        }).addTo(map);
    }
});

socket.on('disconnect', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

// --- GEOLOCATION TRACKING ---

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });

        if (isFirstLoad) {
            map.setView([latitude, longitude], 16);
            isFirstLoad = false;
        }
    }, (error) => {
        console.error("Geolocation error:", error);
        alert(error.message)
    }, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    });
} else {
    alert("Your browser doesn't support geolocation.");
}