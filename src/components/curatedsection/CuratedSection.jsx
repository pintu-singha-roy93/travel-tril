
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./CuratedSection.css";

import tripCardImage1 from "../../assets/images/icon_h1.svg";
import tripCardImage2 from "../../assets/images/icon_h2.svg";
import tripCardImage3 from "../../assets/images/icon_h3.svg";

const CuratedSection = () => {
  const [curatedData, setCuratedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardImages = {
    icon_h1: tripCardImage1,
    icon_h2: tripCardImage2,
    icon_h3: tripCardImage3,
  };

  useEffect(() => {
    fetch("https://travel-tril-itbd.vercel.app/api/curated")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API response error");
        }

        return response.json();
      })
      .then((data) => {
        setCuratedData(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="commonbox_sec1 top_cmn_pad">
      <div className="container">
        <div className="section_head">
          <div className="section_head_left">
            <h2 className="section_title">
              Curated for you (and your sanity)
            </h2>
          </div>

          <a href="#" className="see_all_btn">
            See all

            <svg
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.2797 5.03145C10.5727 4.73848 10.5727 4.2627 10.2797 3.96973L6.52969 0.219727C6.23672 -0.0732422 5.76094 -0.0732422 5.46797 0.219727C5.175 0.512695 5.175 0.988476 5.46797 1.28145L7.94062 3.75176H0.75C0.335156 3.75176 0 4.08691 0 4.50176C0 4.9166 0.335156 5.25176 0.75 5.25176H7.93828L5.47031 7.72207C5.17734 8.01504 5.17734 8.49082 5.47031 8.78379C5.76328 9.07676 6.23906 9.07676 6.53203 8.78379C6.825 8.49082 6.825 8.01504 6.53203 7.72207L10.2797 5.03145Z" />
            </svg>
          </a>
        </div>

        <div className="curated_flex">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
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
              }}
              className="curated_swiper"
            >
              {curatedData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="trip_card">
                    <div className="trip_card_shape"></div>

                    <div className="trip_card_icon">
                      <img
                        src={cardImages[item.image]}
                        alt={item.title}
                      />
                    </div>

                    <div className="trip_card_content">
                      <h3 className="trip_card_title">
                        {item.title}
                      </h3>

                      <p className="trip_card_text">
                        {item.description}
                      </p>
                    </div>

                    <div className="trip_card_bottom">
                      <span className="trip_card_price">
                        From {item.price}
                      </span>
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

export default CuratedSection;
