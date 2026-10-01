import React, { useEffect, useState } from "react";
import "./FlightDeals.css";
import airlinesImg1 from "../../assets/images/airlines_img1.svg";
import airlinesImg2 from "../../assets/images/airlines_img2.svg";
import planeGray from "../../assets/images/plane_gray.svg";

const FlightDeals = () => {
  const [tripType, setTripType] = useState("oneway");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const airlineImages = {
    airlines_img1: airlinesImg1,
    airlines_img2: airlinesImg2,
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/flights")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Flight API Error");
        }

        return response.json();
      })

      .then((data) => {
        console.log("Flight API Data:", data);

        setFlights(data);
      })

      .catch((error) => {
        console.error("Flight API Error:", error);
      })

      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter flight
  const filteredFlights = flights.filter(
    (flight) => flight.tripType === tripType,
  );

  return (
    <div>
      <section className="flight_deals_area btm_cmn_pad">
        <div className="container">
          {/* Section Head */}
          <div className="section_head flight_head">
            <div className="section_head_left">
              <h2 className="section_title">Top Flight Deals</h2>

              <p className="section_subtitle">
                Get there faster, cheaper, or with more legroom.
              </p>
            </div>

            {/* Trip Type */}

            <div className="trip_switch">
              <label className="trip_switch_item">
                <input
                  type="radio"
                  name="trip_type2"
                  checked={tripType === "oneway"}
                  onChange={() => setTripType("oneway")}
                />

                <span className="trip_switch_btn">One Way</span>
              </label>

              <label className="trip_switch_item">
                <input
                  type="radio"
                  name="trip_type2"
                  checked={tripType === "roundtrip"}
                  onChange={() => setTripType("roundtrip")}
                />

                <span className="trip_switch_btn">Round Trip</span>
              </label>
            </div>
          </div>

          <div className="tab_Result">
            {/* Flight List */}

            <div className="flight_list">
              {loading ? (
                <p>Loading flights...</p>
              ) : filteredFlights.length === 0 ? (
                <p>
                  No {tripType === "oneway" ? "one way" : "round trip"} flights
                  found.
                </p>
              ) : (
                filteredFlights.map((flight) => (
                  <div className="flight_card" key={flight.id}>
                    {/* Left */}

                    <div className="flight_left">
                      <div className="flight_logo">
                        <img
                          src={airlineImages[flight.logo]}
                          alt={flight.airline}
                        />
                      </div>

                      <div className="flight_airline">
                        <h3 className="flight_name">{flight.airline}</h3>

                        <p className="flight_meta">{flight.meta}</p>
                      </div>
                    </div>

                    {/* Middle */}

                    <div className="flight_middle">
                      {/* Departure */}

                      <div className="flight_time_box">
                        <h4 className="flight_time">{flight.departureTime}</h4>

                        <span className="flight_place">
                          {flight.departurePlace}
                        </span>
                      </div>

                      {/* Flight Path */}

                      <div className="flight_path_wrap">
                        <span className="flight_duration">
                          {flight.duration}
                        </span>

                        <div
                          className={`flight_path ${
                            flight.flightType !== "Direct" ? "stop_path" : ""
                          }`}
                        >
                          <span className="flight_line"></span>

                          {flight.flightType === "Direct" ? (
                            <div className="flight_plane">
                              <img src={planeGray} alt="" />
                            </div>
                          ) : (
                            <div className="flight_plane stop_plane">
                              <span></span>
                            </div>
                          )}
                        </div>

                        <span
                          className={`flight_type ${
                            flight.flightType !== "Direct" ? "stop_text" : ""
                          }`}
                        >
                          {flight.flightType}
                        </span>
                      </div>

                      {/* Arrival */}

                      <div className="flight_time_box">
                        <h4 className="flight_time">{flight.arrivalTime}</h4>

                        <span className="flight_place">
                          {flight.arrivalPlace}
                        </span>
                      </div>
                    </div>

                    {/* Right */}

                    <div className="flight_right">
                      <div className="flight_price_box">
                        <h4 className="flight_price">{flight.price}</h4>

                        <span className="flight_price_text">
                          {flight.priceText}
                        </span>
                      </div>

                      <a href="#" className="flight_btn">
                        Select
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* More Button */}

            <div className="flight_more_wrap">
              <a href="#" className="flight_more_btn">
                Show More Flight
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightDeals;
