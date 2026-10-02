import React, { useEffect, useState } from "react";
import "./Hotel.css";

import hotel1 from "../../assets/images/index_hotel1.jpg";
import hotel2 from "../../assets/images/index_hotel2.jpg";
import hotel3 from "../../assets/images/index_hotel3.jpg";
import hotel4 from "../../assets/images/index_hotel4.jpg";
import hotel5 from "../../assets/images/coastal.jpg";
import hotel6 from "../../assets/images/skyline.jpg";
import hotel7 from "../../assets/images/garden.jpg";
import hotel8 from "../../assets/images/harbor.jpg";

import star from "../../assets/images/star.svg";
import locationPlace from "../../assets/images/location_place.svg";
import wifi from "../../assets/images/wifi.svg";
import pool from "../../assets/images/pool.svg";
import breakfast from "../../assets/images/breakfast.svg";

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const cardImages = {
    index_hotel1: hotel1,
    index_hotel2: hotel2,
    index_hotel3: hotel3,
    index_hotel4: hotel4,
    index_hotel5: hotel5,
    index_hotel6: hotel6,
    index_hotel7: hotel7,
    index_hotel8: hotel8
  };

  const featureIcons = {
    wifi: wifi,
    pool: pool,
    breakfast: breakfast,
  };

  useEffect(() => {
    fetch("https://travel-tril-itbd.vercel.app/api/hotels")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hotel API error");
        }

        return response.json();
      })

      .then((data) => {
        console.log("Hotel API Data:", data);

        setHotels(data);
      })

      .catch((error) => {
        console.error("Hotel API Error:", error);
      })

      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="commonbox_sec3 top_cmn_pad btm_cmn_pad">
      <div className="container">
        <div className="section_head">
          <div className="section_head_left">
            <h2 className="section_title">Trending right now</h2>

            <p className="section_subtitle">
              Because everyone else is doing it.
            </p>
          </div>

          <a href="#" className="see_all_btn">
            See all
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path
                d="M10.2797 5.03145C10.5727 4.73848 10.5727 4.2627 10.2797 3.96973L6.52969 0.219727C6.23672 -0.0732422 5.76094 -0.0732422 5.46797 0.219727C5.175 0.512695 5.175 0.988476 5.46797 1.28145L7.94062 3.75176H0.75C0.335156 3.75176 0 4.08691 0 4.50176C0 4.9166 0.335156 5.25176 0.75 5.25176H7.93828L5.47031 7.72207C5.17734 8.01504 5.17734 8.49082 5.47031 8.78379C5.76328 9.07676 6.23906 9.07676 6.53203 8.78379L10.282 5.03379L10.2797 5.03145Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        <div className="stay_flex">
          {loading ? (
            <p>Loading...</p>
          ) : hotels.length === 0 ? (
            <p>No hotels found.</p>
          ) : (
            hotels.map((hotel) => (
              <div className="stay_card" key={hotel.id}>
                <div className="trending_thumb">
                  <img src={cardImages[hotel.image]} alt={hotel.title} />

                  <div className="trending_rating">
                    <img src={star} alt="" />

                    {hotel.rating}

                    <span>{hotel.count}</span>
                  </div>

                  <button
                    type="button"
                    className={`stay_wishlist ${
                      wishlist.includes(hotel.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(hotel.id)}
                  >
                    <i className="fa-regular fa-heart"></i>
                  </button>
                </div>

                <div className="stay_content">
                  <div className="stay_top">
                    <h3 className="trending_title">{hotel.title}</h3>

                    <div className="stay_price">
                      {hotel.price}

                      <span>/Night</span>
                    </div>
                  </div>

                  <div className="stay_location">
                    <img src={locationPlace} alt="" />

                    <span>{hotel.location}</span>
                  </div>

                  <div className="stay_features">
                    {hotel.features?.map((feature, index) => (
                      <span className="stay_feature" key={index}>
                        <img src={featureIcons[feature.icon]} alt="" />

                        {feature.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Hotel;
