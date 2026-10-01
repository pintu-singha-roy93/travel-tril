import React from "react";
import "./Home.css";
import "../../assets/css/Common.css";
import BookingTab from "../../components/bookingtab/BookingTab";
import CuratedSection from "../../components/curatedsection/CuratedSection";
import Trending from "../../components/trending/Trending";
import Hotel from "../../components/hotel/Hotel";
import FlightDeals from "../../components/flightdeals/FlightDeals";
import CarDeals from "../../components/cardeals/CarDeals";

const Home = () => {
  return (
    <div className="home">
      <section className="hero_banner_area">
        <div className="container">
          <div className="hero_banner_wrap">
            <span className="hero_shape hero_shape1"></span>
            <span className="hero_shape hero_shape2"></span>
            <div className="hero_banner_content">
              <h1 className="hero_title">
                Where to,
                <span>Captain Adventure?</span>
              </h1>
              <p className="hero_subtitle">
                Pick a spot. We'll handle the boring logistics. You just focus
                on packing too many pairs of shoes.
              </p>
            </div>
            <BookingTab />
          </div>
        </div>
      </section>
      <CuratedSection />
      <Trending />
      <Hotel />
      <FlightDeals />
      <CarDeals />
    </div>
  );
};

export default Home;
