
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import logo from "../../assets/images/logo.png";

const footerData = {
  description:
    "We make booking trips so easy, you'll actually have energy left to pack. Join our newsletter for deals that shouldn't be legal.",

  destinations: [
    {
      title: "Beach Escapes",
      path: "/beach-escapes",
    },
    {
      title: "City Breaks",
      path: "/city-breaks",
    },
    {
      title: "Mountain Retreats",
      path: "/mountain-retreats",
    },
    {
      title: "Last Minute Deal",
      path: "/last-minute-deal",
    },
  ],

  support: [
    {
      title: "Help Center",
      path: "/help-center",
    },
    {
      title: "Cancellation Policy",
      path: "/cancellation-policy",
    },
    {
      title: "Contact Us",
      path: "/contact",
    },
    {
      title: "FAQ",
      path: "/faq",
    },
  ],

  social: {
    twitter: "#",
    instagram: "#",
    facebook: "#",
  },

  copyright: "© 2026 TravelTrail. All rights reserved.",
};

const Footer = () => {
  return (
    <footer className="footer_area">
      <div className="container">
        <div className="footer_inner">

          {/* LEFT */}
          <div className="footer_left">

            <Link to="/" className="footer_logo">
              <img src={logo} alt="TravelTrail" />
            </Link>

            <p className="footer_text">
              {footerData.description}
            </p>

            <form
              className="footer_newsletter"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
              />

              <button type="submit">
                Subscribe
              </button>
            </form>

          </div>

          {/* RIGHT */}
          <div className="footer_right">

            {/* DESTINATIONS */}
            <div className="footer_menu">
              <h3 className="footer_title">
                Destinations
              </h3>

              <ul>
                {footerData.destinations.map((item) => (
                  <li key={item.title}>
                    <Link to={item.path}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SUPPORT */}
            <div className="footer_menu">
              <h3 className="footer_title">
                Support
              </h3>

              <ul>
                {footerData.support.map((item) => (
                  <li key={item.title}>
                    <Link to={item.path}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer_bottom_outer">
          <div className="footer_bottom">

            <p className="footer_copy">
              {footerData.copyright}
            </p>

            <div className="footer_social">

              {/* X / Twitter */}
              <a
                href={footerData.social.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                {/* তোমার existing Twitter SVG এখানে */}
              </a>

              {/* Instagram */}
              <a
                href={footerData.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                {/* তোমার existing Instagram SVG এখানে */}
              </a>

              {/* Facebook */}
              <a
                href={footerData.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                {/* তোমার existing Facebook SVG এখানে */}
              </a>

            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
