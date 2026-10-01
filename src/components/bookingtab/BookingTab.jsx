import React, { useEffect, useRef, useState } from "react";
import "./BookingTab.css";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

import destinationIcon from "../../assets/images/desti.svg";
import originIcon from "../../assets/images/origin.svg";
import whenIcon from "../../assets/images/when.svg";
import paxIcon from "../../assets/images/pax.svg";
import sendIcon from "../../assets/images/send_icon.svg";

/* =========================================
   LOCATION DATA
========================================= */

const locations = [
  {
    city: "Kolkata",
    country: "India",
    code: "CCU",
  },
  {
    city: "Delhi",
    country: "India",
    code: "DEL",
  },
  {
    city: "Mumbai",
    country: "India",
    code: "BOM",
  },
  {
    city: "Bangalore",
    country: "India",
    code: "BLR",
  },
  {
    city: "Dubai",
    country: "UAE",
    code: "DXB",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    code: "BKK",
  },
  {
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
  },
  {
    city: "Bali",
    country: "Indonesia",
    code: "DPS",
  },
  {
    city: "Tokyo",
    country: "Japan",
    code: "TYO",
  },
  {
    city: "London",
    country: "United Kingdom",
    code: "LHR",
  },
  {
    city: "Paris",
    country: "France",
    code: "CDG",
  },
  {
    city: "New York",
    country: "USA",
    code: "JFK",
  },
  {
    city: "Maldives",
    country: "Maldives",
    code: "MLE",
  },
];

/* =========================================
   MAIN COMPONENT
========================================= */

const BookingTab = () => {
  const [activeTab, setActiveTab] = useState("hotel");

  const [tripType, setTripType] = useState("oneWay");

  const [error, setError] = useState("");

  /* =========================================
     FLIGHT
  ========================================= */

  const [flightData, setFlightData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
  });

  const [originOpen, setOriginOpen] = useState(false);

  const [destinationOpen, setDestinationOpen] =
    useState(false);

  /* =========================================
     HOTEL
  ========================================= */

  const [hotelData, setHotelData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
  });

  const [hotelDestinationOpen, setHotelDestinationOpen] =
    useState(false);

  /* =========================================
     CAR
  ========================================= */

  const [carData, setCarData] = useState({
    pickup: "",
    pickupDate: "",
    returnDate: "",
  });

  const [carLocationOpen, setCarLocationOpen] =
    useState(false);

  /* =========================================
     PACKAGE
  ========================================= */

  const [packageData, setPackageData] = useState({
    destination: "",
    travelDate: "",
    travelers: 2,
  });

  const [packageDestinationOpen, setPackageDestinationOpen] =
    useState(false);

  /* =========================================
     GUEST
  ========================================= */

  const [guestOpen, setGuestOpen] = useState(false);

  const guestDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target)
      ) {
        setGuestOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
     GUEST DATA
  ========================================= */

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const totalGuests =
    guests.adults +
    guests.children +
    guests.infants;

  const updateGuest = (type, value) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(
        type === "adults" ? 1 : 0,
        prev[type] + value
      ),
    }));
  };

  /* =========================================
     DATE FORMAT
  ========================================= */

  const formatDate = (date) => {
    if (!date) return "";

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =========================================
     FILTER LOCATIONS
  ========================================= */

  const filterLocations = (value) => {
    const search = value.toLowerCase().trim();

    if (!search) return locations;

    return locations.filter(
      (item) =>
        item.city.toLowerCase().includes(search) ||
        item.country.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search)
    );
  };

  /* =========================================
     TRIP TYPE
  ========================================= */

  const changeTripType = (type) => {
    setTripType(type);
    setError("");

    if (type === "oneWay") {
      setFlightData((prev) => ({
        ...prev,
        returnDate: "",
      }));
    }
  };

  /* =========================================
     SWAP FLIGHT
  ========================================= */

  const swapFlight = () => {
    setFlightData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  /* =========================================
     FLIGHT SEARCH
  ========================================= */

  const handleFlightSearch = (e) => {
    e.preventDefault();

    setError("");

    if (!flightData.origin) {
      setError("Please enter origin.");
      return;
    }

    if (!flightData.destination) {
      setError("Please enter destination.");
      return;
    }

    if (!flightData.departureDate) {
      setError("Please select departure date.");
      return;
    }

    if (
      tripType === "roundTrip" &&
      !flightData.returnDate
    ) {
      setError("Please select return date.");
      return;
    }

    console.log("FLIGHT SEARCH:", {
      type: "flight",
      tripType,
      ...flightData,
      guests,
    });
  };

  /* =========================================
     HOTEL SEARCH
  ========================================= */

  const handleHotelSearch = (e) => {
    e.preventDefault();

    setError("");

    if (!hotelData.destination) {
      setError("Please enter destination.");
      return;
    }

    if (!hotelData.checkIn) {
      setError("Please select check-in date.");
      return;
    }

    if (!hotelData.checkOut) {
      setError("Please select check-out date.");
      return;
    }

    console.log("HOTEL SEARCH:", {
      type: "hotel",
      ...hotelData,
      guests,
    });
  };

  /* =========================================
     CAR SEARCH
  ========================================= */

  const handleCarSearch = (e) => {
    e.preventDefault();

    setError("");

    if (!carData.pickup) {
      setError("Please select pickup location.");
      return;
    }

    if (!carData.pickupDate) {
      setError("Please select pickup date.");
      return;
    }

    if (!carData.returnDate) {
      setError("Please select return date.");
      return;
    }

    console.log("CAR SEARCH:", {
      type: "car",
      ...carData,
    });
  };

  /* =========================================
     PACKAGE SEARCH
  ========================================= */

  const handlePackageSearch = (e) => {
    e.preventDefault();

    setError("");

    if (!packageData.destination) {
      setError("Please choose destination.");
      return;
    }

    if (!packageData.travelDate) {
      setError("Please select travel date.");
      return;
    }

    console.log("PACKAGE SEARCH:", {
      type: "package",
      ...packageData,
    });
  };

  /* =========================================
     CALENDAR
  ========================================= */

  const calendarOptions = {
    dateFormat: "Y-m-d",
    minDate: "today",
    showMonths: 2,
    disableMobile: true,
  };

  return (
    <div className="booking_tab">

      {/* ======================================
          TOP BAR
      ====================================== */}

      <div className="booking_topbar">

        <div className="booking_service_tabs">

          {/* HOTEL */}

          <button
            type="button"
            className={`booking_service_btn ${
              activeTab === "hotel"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("hotel");
              setError("");
            }}
          >
            <div className="booking_service_icon">
              <span><svg viewBox="0 0 18 20" fill="none">
                <path d="M0 0.9C0 0.40125 0.40125 0 0.9 0H17.1C17.5988 0 18 0.40125 18 0.9C18 1.39875 17.5988 1.8 17.1 1.8H16.8V17.4H17.1C17.5988 17.4 18 17.8013 18 18.3C18 18.7988 17.5988 19.2 17.1 19.2H0.9C0.40125 19.2 0 18.7988 0 18.3C0 17.8013 0.40125 17.4 0.9 17.4H1.2V1.8H0.9C0.40125 1.8 0 1.39875 0 0.9ZM7.8 4.2V5.4C7.8 5.73 8.07 6 8.4 6H9.6C9.93 6 10.2 5.73 10.2 5.4V4.2C10.2 3.87 9.93 3.6 9.6 3.6H8.4C8.07 3.6 7.8 3.87 7.8 4.2ZM4.2 3.6C3.87 3.6 3.6 3.87 3.6 4.2V5.4C3.6 5.73 3.87 6 4.2 6H5.4C5.73 6 6 5.73 6 5.4V4.2C6 3.87 5.73 3.6 5.4 3.6H4.2ZM7.8 7.8V9C7.8 9.33 8.07 9.6 8.4 9.6H9.6C9.93 9.6 10.2 9.33 10.2 9V7.8C10.2 7.47 9.93 7.2 9.6 7.2H8.4C8.07 7.2 7.8 7.47 7.8 7.8ZM12.6 3.6C12.27 3.6 12 3.87 12 4.2V5.4C12 5.73 12.27 6 12.6 6H13.8C14.13 6 14.4 5.73 14.4 5.4V4.2C14.4 3.87 14.13 3.6 13.8 3.6H12.6ZM3.6 7.8V9C3.6 9.33 3.87 9.6 4.2 9.6H5.4C5.73 9.6 6 9.33 6 9V7.8C6 7.47 5.73 7.2 5.4 7.2H4.2C3.87 7.2 3.6 7.47 3.6 7.8ZM12.6 7.2C12.27 7.2 12 7.47 12 7.8V9C12 9.33 12.27 9.6 12.6 9.6H13.8C14.13 9.6 14.4 9.6 14.4 9V7.8C14.4 7.47 14.13 7.2 13.8 7.2H12.6ZM10.2 14.4H11.8425C12.2137 14.4 12.4988 14.0625 12.3675 13.7175C11.85 12.3637 10.5375 11.4 9.00375 11.4C7.47 11.4 6.1575 12.3637 5.64 13.7175C5.50875 14.0625 5.79375 14.4 6.165 14.4H7.8075V17.4H10.2075V14.4H10.2Z" />
              </svg></span>
            </div>

            <span className="booking_service_text">
              Hotel
            </span>
          </button>


          {/* FLIGHT */}

          <button
            type="button"
            className={`booking_service_btn ${
              activeTab === "flight"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("flight");
              setError("");
            }}
          >
            <div className="booking_service_icon">
              <span><svg viewBox="0 0 18 22" fill="none">
                <path d="M6.9 2.1C6.9 0.941248 7.84125 -2.2501e-06 9 -2.30075e-06C10.1588 -2.3514e-06 11.1 0.941247 11.1 2.1L11.1 6.87375L17.61 12.8437C17.8575 13.0725 18 13.3912 18 13.7287L18 15.3675C18 15.7762 17.5988 16.065 17.2088 15.9375L11.1 13.9012L11.1 17.64L13.575 19.62C13.7175 19.7325 13.8 19.905 13.8 20.0887L13.8 20.8312C13.8 21.2212 13.4325 21.5062 13.0538 21.4125L9 20.4L4.94625 21.4125C4.5675 21.51 4.2 21.2212 4.2 20.8312L4.2 20.0887C4.2 19.905 4.2825 19.7325 4.425 19.62L6.9 17.64L6.9 13.9012L0.79125 15.9375C0.40125 16.065 -2.47202e-07 15.7762 -2.65069e-07 15.3675L-3.36701e-07 13.7287C-3.51454e-07 13.3912 0.1425 13.0725 0.39 12.8437L6.9 6.87375L6.9 2.1Z" />
              </svg></span>
            </div>

            <span className="booking_service_text">
              Flight
            </span>
          </button>


          {/* CAR */}

          <button
            type="button"
            className={`booking_service_btn ${
              activeTab === "car"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("car");
              setError("");
            }}
          >
            <div className="booking_service_icon">
              <span><svg viewBox="0 0 20 18" fill="none">
                <path d="M5.28125 3.43125L4.26172 6.42857H15.7383L14.7188 3.43125C14.543 2.91696 14.0703 2.57143 13.5391 2.57143H6.46094C5.92969 2.57143 5.45703 2.91696 5.28125 3.43125ZM1.54688 6.62143L2.92188 2.58348C3.44922 1.03661 4.86719 0 6.46094 0H13.5391C15.1328 0 16.5508 1.03661 17.0781 2.58348L18.4531 6.62143C19.3594 7.00714 20 7.92723 20 9V16.7143C20 17.4254 19.4414 18 18.75 18H17.5C16.8086 18 16.25 17.4254 16.25 16.7143V15.4286H3.75V16.7143C3.75 17.4254 3.19141 18 2.5 18H1.25C0.558594 18 0 17.4254 0 16.7143V9C0 7.92723 0.640625 7.00714 1.54688 6.62143ZM5 10.9286C5 10.2174 4.44141 9.64286 3.75 9.64286C3.05859 9.64286 2.5 10.2174 2.5 10.9286C2.5 11.6397 3.05859 12.2143 3.75 12.2143C4.44141 12.2143 5 11.6397 5 10.9286ZM16.25 12.2143C16.9414 12.2143 17.5 11.6397 17.5 10.9286C17.5 10.2174 16.9414 9.64286 16.25 9.64286C15.5586 9.64286 15 10.2174 15 10.9286C15 11.6397 15.5586 12.2143 16.25 12.2143Z" />
              </svg></span>
            </div>

            <span className="booking_service_text">
              Car
            </span>
          </button>


          {/* PACKAGE */}

          <button
            type="button"
            className={`booking_service_btn ${
              activeTab === "package"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("package");
              setError("");
            }}
          >
            <div className="booking_service_icon">
              <span><svg viewBox="0 0 20 20" fill="none">
                <path d="M18.6562 12.7913C18.435 13.4175 17.7075 13.6538 17.115 13.3575L10.4325 10.0163L10.3725 10.1362L7.0425 16.8H18C18.6638 16.8 19.2 17.3363 19.2 18C19.2 18.6638 18.6638 19.2 18 19.2H1.2C0.53625 19.2 0 18.6638 0 18C0 17.3363 0.53625 16.8 1.2 16.8H4.3575L8.2275 9.06375L8.2875 8.94375L2.085 5.8425C1.4925 5.54625 1.245 4.81875 1.61625 4.2675C3.3375 1.695 6.27 0 9.6 0C14.9025 0 19.2 4.2975 19.2 9.6C19.2 10.7175 19.0088 11.7938 18.6562 12.7913Z" />
              </svg></span>
            </div>

            <span className="booking_service_text">
              Package
            </span>
          </button>

        </div>


        {/* ======================================
            ONE WAY / ROUND TRIP
        ====================================== */}

        {activeTab === "flight" && (
          <div className="trip_type_switch">

            <label className="trip_type_item">

              <input
                type="radio"
                name="trip_type"
                value="oneWay"
                checked={
                  tripType === "oneWay"
                }
                onChange={() =>
                  changeTripType("oneWay")
                }
              />

              <span>One Way</span>

            </label>


            <label className="trip_type_item">

              <input
                type="radio"
                name="trip_type"
                value="roundTrip"
                checked={
                  tripType === "roundTrip"
                }
                onChange={() =>
                  changeTripType(
                    "roundTrip"
                  )
                }
              />

              <span>Round Trip</span>

            </label>

          </div>
        )}

      </div>


      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="booking_tab_contents">


        {/* ======================================
            FLIGHT
        ====================================== */}

        {activeTab === "flight" && (

          <div
            className="booking_tab_content active"
            id="flight"
          >

            <form
              onSubmit={handleFlightSearch}
            >

              <div className="booking_search_wrap">


                {/* ORIGIN */}

                <div className="booking_field destination_search">

                  <div className="booking_field_icon">
                    <img
                      src={originIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Origin
                    </span>

                    <input
                      type="text"
                      placeholder="e.g. Kolkata, Delhi"
                      value={
                        flightData.origin
                      }
                      onFocus={() =>
                        setOriginOpen(true)
                      }
                      onChange={(e) =>
                        setFlightData({
                          ...flightData,
                          origin:
                            e.target.value,
                        })
                      }
                    />


                    {/* ORIGIN LIST */}

                    {originOpen && (
                      <LocationList
                        value={
                          flightData.origin
                        }
                        onSelect={(item) => {
                          setFlightData({
                            ...flightData,
                            origin:
                              `${item.city}, ${item.country}`,
                          });

                          setOriginOpen(false);
                        }}
                        filterLocations={
                          filterLocations
                        }
                      />
                    )}

                  </div>

                </div>


                {/* SWAP */}

                <button
                  type="button"
                  className="swap_btn"
                  onClick={swapFlight}
                  aria-label="Swap origin and destination"
                >
                  ⇄
                </button>


                {/* DESTINATION */}

                <div className="booking_field destination_search">

                  <div className="booking_field_icon">
                    <img
                      src={destinationIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Destination
                    </span>

                    <input
                      type="text"
                      placeholder="Where to?"
                      value={
                        flightData.destination
                      }
                      onFocus={() =>
                        setDestinationOpen(true)
                      }
                      onChange={(e) =>
                        setFlightData({
                          ...flightData,
                          destination:
                            e.target.value,
                        })
                      }
                    />


                    {/* DESTINATION LIST */}

                    {destinationOpen && (
                      <LocationList
                        value={
                          flightData.destination
                        }
                        onSelect={(item) => {
                          setFlightData({
                            ...flightData,
                            destination:
                              `${item.city}, ${item.country}`,
                          });

                          setDestinationOpen(
                            false
                          );
                        }}
                        filterLocations={
                          filterLocations
                        }
                      />
                    )}

                  </div>

                </div>


                {/* DEPARTURE */}

                <DateField
                  label="Departure"
                  value={
                    flightData.departureDate
                  }
                  options={{
                    ...calendarOptions,
                    mode:
                      tripType === "roundTrip"
                        ? "range"
                        : "single",
                  }}
                  onChange={(dates) => {

                    if (
                      tripType === "oneWay"
                    ) {

                      setFlightData(
                        (prev) => ({
                          ...prev,
                          departureDate:
                            formatDate(
                              dates[0]
                            ),
                          returnDate: "",
                        })
                      );

                    } else if (
                      dates.length === 1
                    ) {

                      setFlightData(
                        (prev) => ({
                          ...prev,
                          departureDate:
                            formatDate(
                              dates[0]
                            ),
                          returnDate: "",
                        })
                      );

                    } else if (
                      dates.length === 2
                    ) {

                      setFlightData(
                        (prev) => ({
                          ...prev,
                          departureDate:
                            formatDate(
                              dates[0]
                            ),
                          returnDate:
                            formatDate(
                              dates[1]
                            ),
                        })
                      );

                    }

                  }}
                />


                {/* RETURN */}

                {tripType ===
                  "roundTrip" && (

                  <DateField
                    label="Return"
                    value={
                      flightData.returnDate
                    }
                    minDate={
                      flightData.departureDate ||
                      "today"
                    }
                    onChange={(date) =>
                      setFlightData(
                        (prev) => ({
                          ...prev,
                          returnDate:
                            formatDate(date),
                        })
                      )
                    }
                  />

                )}


                {/* PASSENGERS */}

                <div
                  className="booking_field guest_dropdown_wrap"
                  ref={
                    guestDropdownRef
                  }
                >

                  <div className="booking_field_icon">
                    <img
                      src={paxIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Who's going?
                    </span>

                    <button
                      type="button"
                      className="guest_dropdown_btn"
                      onClick={() =>
                        setGuestOpen(
                          !guestOpen
                        )
                      }
                    >
                      {totalGuests}{" "}
                      {totalGuests === 1
                        ? "Passenger"
                        : "Passengers"}
                    </button>

                  </div>


                  {guestOpen && (

                    <div className="guest_dropdown">

                      {[
                        ["adults", "Adult"],
                        [
                          "children",
                          "Children",
                        ],
                        [
                          "infants",
                          "Infants",
                        ],
                      ].map(
                        ([type, label]) => (

                          <div
                            className="guest_counter_item"
                            key={type}
                          >

                            <div className="guest_counter_left">
                              <h5>
                                {label}
                              </h5>
                            </div>

                            <div className="guest_counter_box">

                              <button
                                type="button"
                                className="counter_btn minus"
                                onClick={() =>
                                  updateGuest(
                                    type,
                                    -1
                                  )
                                }
                              >
                                -
                              </button>

                              <span className="counter_value">
                                {guests[type]}
                              </span>

                              <button
                                type="button"
                                className="counter_btn plus"
                                onClick={() =>
                                  updateGuest(
                                    type,
                                    1
                                  )
                                }
                              >
                                +
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>


                {/* SEARCH */}

                <button
                  type="submit"
                  className="booking_submit_btn"
                >
                  Let's Go!

                  <img
                    src={sendIcon}
                    alt=""
                  />
                </button>

              </div>

            </form>

          </div>

        )}


        {/* ======================================
            HOTEL
        ====================================== */}

        {activeTab === "hotel" && (

          <div
            className="booking_tab_content active"
            id="hotel"
          >

            <form
              onSubmit={handleHotelSearch}
            >

              <div className="booking_search_wrap">


                {/* DESTINATION */}

                <div className="booking_field destination_search">

                  <div className="booking_field_icon">
                    <img
                      src={destinationIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Destination
                    </span>

                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={
                        hotelData.destination
                      }
                      onFocus={() =>
                        setHotelDestinationOpen(
                          true
                        )
                      }
                      onChange={(e) =>
                        setHotelData({
                          ...hotelData,
                          destination:
                            e.target.value,
                        })
                      }
                    />

                    {hotelDestinationOpen && (
                      <LocationList
                        value={
                          hotelData.destination
                        }
                        onSelect={(item) => {

                          setHotelData({
                            ...hotelData,
                            destination:
                              `${item.city}, ${item.country}`,
                          });

                          setHotelDestinationOpen(
                            false
                          );

                        }}
                        filterLocations={
                          filterLocations
                        }
                      />
                    )}

                  </div>

                </div>


                <DateField
                  label="Check In"
                  value={
                    hotelData.checkIn
                  }
                  onChange={(date) =>
                    setHotelData({
                      ...hotelData,
                      checkIn:
                        formatDate(date),
                    })
                  }
                />


                <DateField
                  label="Check Out"
                  value={
                    hotelData.checkOut
                  }
                  minDate={
                    hotelData.checkIn ||
                    "today"
                  }
                  onChange={(date) =>
                    setHotelData({
                      ...hotelData,
                      checkOut:
                        formatDate(date),
                    })
                  }
                />


                <button
                  type="submit"
                  className="booking_submit_btn"
                >
                  Let's Go!

                  <img
                    src={sendIcon}
                    alt=""
                  />
                </button>

              </div>

            </form>

          </div>

        )}


        {/* ======================================
            CAR
        ====================================== */}

        {activeTab === "car" && (

          <div
            className="booking_tab_content active"
            id="car"
          >

            <form
              onSubmit={handleCarSearch}
            >

              <div className="booking_search_wrap">

                <div className="booking_field destination_search">

                  <div className="booking_field_icon">
                    <img
                      src={originIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Pickup
                    </span>

                    <input
                      type="text"
                      placeholder="Select Location"
                      value={
                        carData.pickup
                      }
                      onFocus={() =>
                        setCarLocationOpen(
                          true
                        )
                      }
                      onChange={(e) =>
                        setCarData({
                          ...carData,
                          pickup:
                            e.target.value,
                        })
                      }
                    />

                    {carLocationOpen && (
                      <LocationList
                        value={
                          carData.pickup
                        }
                        onSelect={(item) => {

                          setCarData({
                            ...carData,
                            pickup:
                              `${item.city}, ${item.country}`,
                          });

                          setCarLocationOpen(
                            false
                          );

                        }}
                        filterLocations={
                          filterLocations
                        }
                      />
                    )}

                  </div>

                </div>


                <DateField
                  label="Pickup Date"
                  value={
                    carData.pickupDate
                  }
                  onChange={(date) =>
                    setCarData({
                      ...carData,
                      pickupDate:
                        formatDate(date),
                    })
                  }
                />


                <DateField
                  label="Return Date"
                  value={
                    carData.returnDate
                  }
                  minDate={
                    carData.pickupDate ||
                    "today"
                  }
                  onChange={(date) =>
                    setCarData({
                      ...carData,
                      returnDate:
                        formatDate(date),
                    })
                  }
                />


                <button
                  type="submit"
                  className="booking_submit_btn"
                >
                  Let's Go!

                  <img
                    src={sendIcon}
                    alt=""
                  />
                </button>

              </div>

            </form>

          </div>

        )}


        {/* ======================================
            PACKAGE
        ====================================== */}

        {activeTab === "package" && (

          <div
            className="booking_tab_content active"
            id="package"
          >

            <form
              onSubmit={handlePackageSearch}
            >

              <div className="booking_search_wrap">


                <div className="booking_field destination_search">

                  <div className="booking_field_icon">
                    <img
                      src={destinationIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Package Destination
                    </span>

                    <input
                      type="text"
                      placeholder="Choose Destination"
                      value={
                        packageData.destination
                      }
                      onFocus={() =>
                        setPackageDestinationOpen(
                          true
                        )
                      }
                      onChange={(e) =>
                        setPackageData({
                          ...packageData,
                          destination:
                            e.target.value,
                        })
                      }
                    />

                    {packageDestinationOpen && (
                      <LocationList
                        value={
                          packageData.destination
                        }
                        onSelect={(item) => {

                          setPackageData({
                            ...packageData,
                            destination:
                              `${item.city}, ${item.country}`,
                          });

                          setPackageDestinationOpen(
                            false
                          );

                        }}
                        filterLocations={
                          filterLocations
                        }
                      />
                    )}

                  </div>

                </div>


                <DateField
                  label="Travel Date"
                  value={
                    packageData.travelDate
                  }
                  onChange={(date) =>
                    setPackageData({
                      ...packageData,
                      travelDate:
                        formatDate(date),
                    })
                  }
                />


                <div className="booking_field">

                  <div className="booking_field_icon">
                    <img
                      src={paxIcon}
                      alt=""
                    />
                  </div>

                  <div className="booking_field_content">

                    <span className="booking_label">
                      Travelers
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={
                        packageData.travelers
                      }
                      onChange={(e) =>
                        setPackageData({
                          ...packageData,
                          travelers:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="booking_submit_btn"
                >
                  Let's Go!

                  <img
                    src={sendIcon}
                    alt=""
                  />
                </button>

              </div>

            </form>

          </div>

        )}

      </div>


      {error && (
        <div className="booking_error">
          {error}
        </div>
      )}

    </div>
  );
};


/* =========================================
   LOCATION LIST
========================================= */

const LocationList = ({
  value,
  onSelect,
  filterLocations,
}) => {

  const results =
    filterLocations(value).slice(0, 8);

  return (
    <div className="destination_list">

      {results.length > 0 ? (

        results.map((item) => (

          <button
            type="button"
            className="destination_list_item"
            key={item.code}
            onClick={() =>
              onSelect(item)
            }
          >

            <div className="destination_list_icon">
              📍
            </div>

            <div className="destination_list_content">

              <strong>
                {item.city}
              </strong>

              <small>
                {item.country}
              </small>

            </div>

            <span className="destination_code">
              {item.code}
            </span>

          </button>

        ))

      ) : (

        <div className="destination_no_result">
          No location found
        </div>

      )}

    </div>
  );
};


/* =========================================
   DATE FIELD
========================================= */

const DateField = ({
  label,
  value,
  minDate = "today",
  options = {},
  onChange,
}) => {

  return (
    <div className="booking_field calendar-searchbox-datepicker">

      <div className="booking_field_icon">
        <img
          src={whenIcon}
          alt=""
        />
      </div>

      <div className="booking_field_content">

        <span className="booking_label">
          {label}
        </span>

        <Flatpickr
          value={value}
          options={{
            dateFormat: "Y-m-d",
            minDate,
            showMonths: 2,
            disableMobile: true,
            ...options,
          }}
          onChange={(dates) => {

            if (dates.length) {
              onChange(dates[0]);
            }

          }}
          placeholder="Select Date"
        />

      </div>

    </div>
  );
};

export default BookingTab;