const express = require("express");
const cors = require("cors");
const { authCors, registerAuthRoutes, verifyAuthOrigin } = require("./auth");

const app = express();

const publicCors = cors();
app.use((req, res, next) => {
    if (req.path.startsWith("/api/auth")) return next();
    return publicCors(req, res, next);
});
app.use("/api/auth", authCors, verifyAuthOrigin);
app.use(express.json());
registerAuthRoutes(app);


// =========================
// CURATED DATA
// =========================

const curatedData = [
    {
        id: 1,
        title: 'The "We Need a Break" Package',
        description:
            "Skip the sightseeing. Just resorts with very large pools and very strong drinks.",
        price: "$899",
        image: "icon_h1"
    },
    {
        id: 2,
        title: 'The "Look at Me" Tour',
        description:
            "Highly photogenic spots guaranteed to make your ex jealous on Instagram.",
        price: "$1,250",
        image: "icon_h2"
    },
    {
        id: 3,
        title: "Last Minute Panic",
        description:
            "Forgot your anniversary? We've got quick escapes that look like you planned for months.",
        price: "$599",
        image: "icon_h3"
    }
];


// =========================
// TRENDING DATA
// =========================

const trendingData = [
    {
        id: 1,
        title: "Maldives",
        image: "maldives",
        rating: "4.8",
        count: "(120)",
        tag: "Popular",
        tagClass: "popular",
        flight: "Flights from $299"
    },
    {
        id: 2,
        title: "Japan",
        image: "japan",
        rating: "4.7",
        count: "(98)",
        tag: "Trending",
        tagClass: "trending",
        flight: "Flights from $499"
    },
    {
        id: 3,
        title: "Costa Rica",
        image: "coste",
        rating: "4.6",
        count: "(85)",
        tag: "Hot",
        tagClass: "hot",
        flight: "Flights from $399"
    },
    {
        id: 4,
        title: "Canada",
        image: "canada",
        rating: "4.8",
        count: "(110)",
        tag: "Popular",
        tagClass: "popular",
        flight: "Flights from $349"
    },
    {
        id: 5,
        title: "Bali",
        image: "bali",
        rating: "4.9",
        count: "(140)",
        tag: "Trending",
        tagClass: "trending",
        flight: "Flights from $429"
    }
];


// =========================
// API ROUTES
// =========================

app.get("/api/curated", (req, res) => {
    res.json(curatedData);
});


app.get("/api/trending", (req, res) => {
    res.json(trendingData);
});


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("Backend API is working!");
});


// =========================
// SERVER
// =========================

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



const hotelData = [
    {
        id: 1,
        image: "index_hotel1",
        title: "The Grand Horizon",
        price: "$240",
        location: "Downtown Metro",
        rating: "4.9",
        count: "(128)",
        features: [
            {
                icon: "wifi",
                text: "Free WiFi"
            },
            {
                icon: "pool",
                text: "Pool"
            }
        ]
    },
    {
        id: 2,
        image: "index_hotel2",
        title: "Urban Oasis Suites",
        price: "$240",
        location: "Arts District",
        rating: "4.9",
        count: "(128)",
        features: [
            {
                icon: "breakfast",
                text: "Breakfast"
            },
            {
                icon: "pool",
                text: "Pool"
            }
        ]
    },
    {
        id: 3,
        image: "index_hotel3",
        title: "The Grand Horizon",
        price: "$240",
        location: "Downtown Metro",
        rating: "4.9",
        count: "(128)",
        features: [
            {
                icon: "wifi",
                text: "Free WiFi"
            },
            {
                icon: "pool",
                text: "Pool"
            }
        ]
    },
    {
        id: 4,
        image: "index_hotel4",
        title: "The Grand Horizon",
        price: "$240",
        location: "Downtown Metro",
        rating: "4.9",
        count: "(128)",
        features: [
            {
                icon: "wifi",
                text: "Free WiFi"
            },
            {
                icon: "pool",
                text: "Pool"
            }
        ]
    },
    {
        id: 5,
        image: "index_hotel5",
        title: "Coastal Haven Resort",
        price: "$320",
        location: "Seaside District",
        rating: "4.8",
        count: "(96)",
        features: [
            {
                icon: "wifi",
                text: "Free WiFi"
            },
            {
                icon: "breakfast",
                text: "Breakfast"
            },
            {
                icon: "pool",
                text: "Pool"
            }
        ]
    }
];

app.get("/api/hotels", (req, res) => {
    res.json(hotelData);
});




// flight deals
const flightData = [
    {
        id: 1,
        tripType: "oneway",
        logo: "airlines_img1",
        airline: "AeroSky Airlines",
        meta: "Airbus A320 · Economy",
        departureTime: "08:30",
        departurePlace: "JFK (New York)",
        duration: "5h 40m",
        flightType: "Direct",
        arrivalTime: "11:15",
        arrivalPlace: "LAX (Los Angeles)",
        price: "$199",
        priceText: "per person"
    },
    {
        id: 2,
        tripType: "oneway",
        logo: "airlines_img2",
        airline: "AeroSky Airlines",
        meta: "Airbus A320 · Economy",
        departureTime: "08:30",
        departurePlace: "JFK (New York)",
        duration: "5h 40m",
        flightType: "1 Stop(ORD)",
        arrivalTime: "11:15",
        arrivalPlace: "LAX (Los Angeles)",
        price: "$450",
        priceText: "per person"
    },
    {
        id: 3,
        tripType: "roundtrip",
        logo: "airlines_img1",
        airline: "AeroSky Airlines",
        meta: "Airbus A320 · Economy",
        departureTime: "08:30",
        departurePlace: "JFK (New York)",
        duration: "5h 40m",
        flightType: "Direct",
        arrivalTime: "11:15",
        arrivalPlace: "LAX (Los Angeles)",
        returnDepartureTime: "14:30",
        returnDeparturePlace: "LAX (Los Angeles)",
        returnArrivalTime: "22:45",
        returnArrivalPlace: "JFK (New York)",
        returnDuration: "5h 15m",
        returnFlightType: "Direct",
        price: "$450",
        priceText: "per person"
    }
];

app.get("/api/flights", (req, res) => {
    res.json(flightData);
});


// cardeals
const transportData = [
  {
    id: 1,
    type: "Economy",
    image: "sedan",
    title: "Standard Sedan",
    description: "Toyota Camry or similar",
    passengers: 3,
    bags: 2,
    price: "$450",
    active: false
  },
  {
    id: 2,
    type: "Economy",
    image: "suv",
    title: "Executive SUV",
    description: "Toyota Camry or similar",
    passengers: 3,
    bags: 2,
    price: "$450",
    active: false
  },
  {
    id: 3,
    type: "Economy",
    image: "van",
    title: "Group Van",
    description: "Toyota Camry or similar",
    passengers: 8,
    bags: 8,
    price: "$450",
    active: true
  },

  {
    id: 4,
    type: "Business",
    image: "sedan",
    title: "Business Sedan",
    description: "Mercedes E-Class or similar",
    passengers: 3,
    bags: 2,
    price: "$650",
    active: false
  },
  {
    id: 5,
    type: "Business",
    image: "suv",
    title: "Business SUV",
    description: "BMW X5 or similar",
    passengers: 5,
    bags: 4,
    price: "$750",
    active: false
  },

  {
    id: 6,
    type: "Van",
    image: "van",
    title: "Premium Group Van",
    description: "Mercedes Sprinter or similar",
    passengers: 8,
    bags: 8,
    price: "$850",
    active: true
  }
];

app.get("/api/transport", (req, res) => {
  res.json(transportData);
});