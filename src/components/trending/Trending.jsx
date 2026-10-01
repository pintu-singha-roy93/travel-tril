
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./Trending.css";

// Images
import maldives from "../../assets/images/maldives.webp";
import japan from "../../assets/images/japan.webp";
import coste from "../../assets/images/coste.webp";
import canada from "../../assets/images/canada.webp";
import bali from "../../assets/images/bali.jpg";

import star from "../../assets/images/star.svg";
import planeIcon from "../../assets/images/plane_icon2.svg";

const Trending = () => {
  const swiperRef = useRef(null);

  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardImages = {
    maldives,
    japan,
    coste,
    canada,
    bali,
  };

  // API call
useEffect(() => {
  fetch("https://travel-tril-itbd.vercel.app/api/trending")
    .then((response) => {
      if (!response.ok) {
        throw new Error("API response error");
      }

      return response.json();
    })
    .then((data) => {
      console.log("Trending API Data:", data);
      setTrendingData(data);
    })
    .catch((error) => {
      console.error("API Error:", error);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);
  // useEffect(() => {
  //   fetch("http://localhost:5000/api/trending")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch trending data");
  //       }

  //       return response.json();
  //     })
  //     .then((data) => {
  //       setTrendingData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Trending API Error:", error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <section className="commonbox_sec2 top_cmn_pad">
      <div className="container">

        {/* Header */}
        <div className="section_head trending_head">

          <div className="section_head_left">
            <h2 className="section_title">
              Trending right now
            </h2>

            <p className="section_subtitle">
              Because everyone else is doing it.
            </p>
          </div>

          {/* Navigation */}
          <div className="trending_nav">

            <button
              type="button"
              className="trending_arrow trending_prev"
              aria-label="Previous"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <svg
                width="5.4"
                height="9.6"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  d="M4.5 1L1 5L4.5 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="trending_arrow trending_next"
              aria-label="Next"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <svg
                width="5.4"
                height="9.6"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  d="M1.5 1L5 5L1.5 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

          </div>
        </div>

        {/* Slider */}
        <div className="slider_place">

          {loading ? (
            <p>Loading...</p>
          ) : trendingData.length === 0 ? (
            <p>No trending destinations found.</p>
          ) : (
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={20}
              slidesPerView={1}
              loop={trendingData.length > 4}
              speed={700}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                },
                992: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 4,
                },
              }}
              className="trending_slider"
            >

              {trendingData.map((item) => (
                <SwiperSlide key={item.id}>

                  <div className="trending_card">

                    <div className="trending_thumb">

                      <img
                        src={cardImages[item.image]}
                        alt={item.title}
                      />

                      <div className="trending_rating">

                        <img
                          src={star}
                          alt=""
                        />

                        {item.rating}

                        {item.count && (
                          <span className="rt_count">
                            {item.count}
                          </span>
                        )}

                      </div>
                    </div>

                    <div className="trending_content">

                      <div className="trending_top">

                        <h3 className="trending_title">
                          {item.title}
                        </h3>

                        <span
                          className={`trending_tag ${item.tagClass}`}
                        >
                          {item.tag}
                        </span>

                      </div>

                      <div className="trending_meta">

                        <img
                          src={planeIcon}
                          alt=""
                        />

                        <span>
                          {item.flight}
                        </span>

                      </div>

                    </div>

                  </div>

                </SwiperSlide>
              ))}

            </Swiper>
          )}

        </div>

      </div>
    </section>
  );
};

export default Trending;