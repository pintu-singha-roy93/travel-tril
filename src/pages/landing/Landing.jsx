import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

import logo from "../../assets/logo.png";
import airplane from "../../assets/images/aroplane.svg";
import location from "../../assets/images/location.svg";
import roundIcon from "../../assets/images/round_icon.svg";
import yellowOverlay from "../../assets/images/yellow_overlay.svg";
import line1 from "../../assets/images/line1.svg";

import roomIcon from "../../assets/images/room_icon.svg";
import starIcon from "../../assets/images/star_icon.svg";
import planeIcon from "../../assets/images/plane_icon.svg";
import loveIcon from "../../assets/images/love_icon.svg";
import carIcon from "../../assets/images/car_icon.svg";

import hotelIcon from "../../assets/images/hotel.svg";
import flightIcon from "../../assets/images/flight.svg";
import transferIcon from "../../assets/images/car.svg";
import cardIcon from "../../assets/images/card.svg";
import arrowIcon from "../../assets/images/arrow.svg";
import buttonArrow from "../../assets/images/btn_arrow.svg";
import eyeIcon from "../../assets/images/eye.png";


const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="main_landing">
      <div className="main_landing_inner">

        <div className="container">

          {/* Header */}
          <div className="header_inner landing_header">
            <div className="logo_area">
              <img src={logo} alt="TravelTrail" />
            </div>
          </div>

          <div className="landing_outer">

            {/* Map */}
            <div className="map">

              <svg viewBox="0 0 200 200">

                <path
                  d="M20,180 
                  C40,140 80,140 100,100 
                  C120,60 60,40 80,100 
                  C100,150 140,130 180,20"
                />

                <image
                  href={airplane}
                  width="50"
                  height="50"
                  id="plane"
                />

              </svg>

              {/* Pin */}
              <img
                className="pin"
                src={location}
                alt="Location"
              />

            </div>

            {/* Round Icon */}
            <img
              src={roundIcon}
              className="round_icon"
              alt=""
            />

            {/* Yellow Overlay */}
            <div className="yellow_overlay_otter">

              <img
                src={yellowOverlay}
                alt=""
                className="ylw_overlay"
              />

              <img
                src={line1}
                alt=""
                className="line1"
              />

            </div>

            {/* Landing Icons */}
            <div className="landing_icon">

              <div className="room_icon_area">
                <img
                  src={roomIcon}
                  alt="Hotel"
                  className="room_icon"
                />

                <img
                  src={starIcon}
                  alt=""
                  className="star_icon"
                />
              </div>

              <div className="plane_icon_area">
                <img
                  src={planeIcon}
                  alt="Flight"
                  className="plane_icon"
                />

                <img
                  src={loveIcon}
                  alt=""
                  className="love_icon"
                />
              </div>

              <div className="car_icon_area">
                <img
                  src={carIcon}
                  alt="Car"
                  className="car_icon"
                />
              </div>

            </div>

            {/* Heading */}
            <div className="mid_conn">

              <h2 className="cmn_head1">
                Build your
                <br />

                <span className="new_undrline">
                  <span className="stylish_font">
                    ridiculous-perfect
                  </span>
                </span>

                {" "}trip
              </h2>

              <p className="sub_heading">
                In literally minutes. No spreadsheets required.
                (Unless you're into that sort of thing.)
              </p>

            </div>

            {/* Steps */}
            <div className="step-wrapper">

              <div className="step">
                <img src={hotelIcon} alt="Hotel" />
                <span>Hotel</span>
              </div>

              <div className="arrow">
                <img src={arrowIcon} alt="arrow" />
              </div>

              <div className="step">
                <img src={flightIcon} alt="Flight" />
                <span>Flight</span>
              </div>

              <div className="arrow">
                <img src={arrowIcon} alt="arrow" />
              </div>

              <div className="step">
                <img src={transferIcon} alt="Transfer" />
                <span>Transfer</span>
              </div>

              <div className="arrow">
                <img src={arrowIcon} alt="arrow" />
              </div>

              <div className="step">
                <img src={cardIcon} alt="Done" />
                <span>Done</span>
              </div>

            </div>

            {/* Buttons */}
            <div className="btn-group">

              <button
                type="button"
                className="common-btn with_arrow"
                onClick={() => navigate("/")}
              >
                <span>Start Planning</span>

                <img
                  src={buttonArrow}
                  alt="arrow"
                />
              </button>

              <button
                type="button"
                className="common-btn2 with_arrow"
                onClick={() => navigate("/home")}
              >
                <span>I'm just browsing</span>

                <img
                  src={eyeIcon}
                  alt="eye"
                />
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;