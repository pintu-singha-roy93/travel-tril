import React, { useEffect, useState } from "react";
import "./CarDeals.css";

import sedan from "../../assets/images/sedan.jpg";
import suv from "../../assets/images/suv.jpg";
import van from "../../assets/images/van.jpg";
import userIcon from "../../assets/images/user_icon.svg";
import bagIcon from "../../assets/images/bag_icon.svg";

const CarDeals = () => {
  const [transportData, setTransportData] = useState([]);
  const [transportType, setTransportType] = useState("Economy");
  const [loading, setLoading] = useState(true);

  const transportImages = {
    sedan: sedan,
    suv: suv,
    van: van,
  };

  useEffect(() => {
    fetch("https://travel-tril-itbd.vercel.app/api/transport")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Transport API Error");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Transport API Data:", data);
        setTransportData(data);
      })
      .catch((error) => {
        console.error("Transport API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredTransport = transportData.filter(
    (item) => item.type === transportType,
  );
  return (
    <div>
      <section className="transport_area btm_cmn_pad">
        <div className="container">
          <div className="transport_wrapper">
            {/* Section Head */}
            <div className="section_head transport_head">
              <div className="section_head_left">
                <h2 className="section_title">Top Flight Deals</h2>

                <p className="section_subtitle">
                  Get there faster, cheaper, or with more legroom.
                </p>
              </div>

              {/* Switch */}
              <div className="trip_switch">
                {["Economy", "Business", "Van"].map((type) => (
                  <label className="trip_switch_item" key={type}>
                    <input
                      type="radio"
                      name="transport_type"
                      checked={transportType === type}
                      onChange={() => setTransportType(type)}
                    />

                    <span className="trip_switch_btn">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="transport_flex">
              {loading ? (
                <p>Loading...</p>
              ) : filteredTransport.length === 0 ? (
                <p>No transport available.</p>
              ) : (
                filteredTransport.map((item) => (
                  <div className="transport_card" key={item.id}>
                    {/* Thumb */}
                    <a href="#" className="transport_thumb">
                      <img src={transportImages[item.image]} alt={item.title} />
                    </a>

                    {/* Content */}
                    <div className="trans_otter">
                      <div className="transport_content">
                        <h3 className="transport_title">{item.title}</h3>

                        <p className="transport_text">{item.description}</p>
                      </div>

                      {/* Meta */}
                      <div className="transport_meta">
                        <div className="transport_meta_item">
                          <img src={userIcon} alt="" />
                          <span>X{item.passengers}</span>
                        </div>

                        <div className="transport_meta_item">
                          <img src={bagIcon} alt="" />
                          <span>X{item.bags}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="transport_bottom">
                      <h4 className="transport_price">{item.price}</h4>

                      <a
                        href="#"
                        className={`transport_btn ${
                          item.active ? "active_btn" : ""
                        }`}
                      >
                        Add
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarDeals;
