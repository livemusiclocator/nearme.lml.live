const API_URL = "https://api.lml.live";
const DEFAULT_LAT = "-37.7983359"; // Centerpoint latitude
const DEFAULT_LNG = "144.9778293"; // Centerpoint longitude
const DEFAULT_RADIUS = "5000"; // Maximum radius in meters
const DEFAULT_LOCATION = "melbourne";

// Haversine distance calculation
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const toRad = (angle) => angle * (Math.PI / 180);
    const deltaLat = toRad(lat2 - lat1);
    const deltaLon = toRad(lon2 - lon1);
    const a = Math.sin(deltaLat / 2) ** 2
		+ Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function formatTime(time) {
	const splits = time.split(":");
	const hours = parseInt(splits[0]);
	const minutes = splits[1];
	const ampm = hours > 12 ? "pm" : "am";

	return `${hours > 12 ? hours % 12 : hours}:${minutes} ${ampm}`;
}

async function todaysGigs({ lat, lng, radius, loc, sortBy }) {
	const today = new Date().toISOString().split("T")[0];
	const queryUrl = `${API_URL}/gigs/query?date_from=${today}&date_to=${today}&location=${loc}`;

	lat = parseFloat(lat);
	lng = parseFloat(lng);

	try {
        const res = await fetch(queryUrl);
        const gigs = await res.json();

		const withinRadius = (g) =>
			haversine(g.venue.latitude, g.venue.longitude, lat, lng) < radius;

		const byStartTime = (a, b) =>
			new Date(a.start_timestamp) - new Date(b.start_timestamp);

		const byDistance = (a, b) =>
			haversine(a.venue.latitude, a.venue.longitude, lat, lng)
				- haversine(b.venue.latitude, b.venue.longitude, lat, lng);

        return gigs
			.filter(withinRadius)
			.sort((a, b) =>
				sortBy == "start_time" ? byStartTime(a, b) : byDistance(a, b)
			);
    } catch (err) {
        console.error("Error fetching gigs: ", err);
        return [];
    }
}

document.addEventListener("alpine:init", () => {
	Alpine.data("gigs", function () {
		return {
			init: function () {
				this.fetchGigs();
			},
			gigs: [],
			loadingGigs: false,
			sortOptions: [
				{ value: "distance", label: "nearest to me" },
				{ value: "start_time", label: "start time" }
			],
			sortBy: "distance",
			fetchGigs: async function () {
				const params = new URLSearchParams(window.location.search);
				this.gigs = [];
				this.loadingGigs = true;
				this.gigs = await todaysGigs({
					lat: params.get("lat") || DEFAULT_LAT,
					lng: params.get("lng") || DEFAULT_LNG,
					radius: params.get("radius") || DEFAULT_RADIUS,
					loc: params.get("location") || DEFAULT_LOCATION,
					sortBy: this.sortBy
				});
				this.loadingGigs = false;
			},
			handleSortChange: function (e) {
				this.sortBy = e.target.value;
				this.fetchGigs();
			}
		};
	});
});
