import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { ReactComponent as Next } from "./assets/chevronDown.svg";
import { ReactComponent as Prev } from "./assets/chevronUp.svg";
import "./styles.css";

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({ data, leadingText }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Used to determine which items appear above the active item
    const halfwayIndex = Math.ceil(data.length / 2);

    // Usd to determine the height/spacing of each item
    const itemHeight = 150;

    // Used to determine at what point an item is moved from the top to the bottom
    const shuffleThreshold = halfwayIndex * itemHeight;

    // Used to determine which items should be visible. this prevents the "ghosting" animation
    const visibleStyleThreshold = shuffleThreshold / 2;

    const determinePlacement = (itemIndex) => {
        // If these match, the item is active
        if (activeIndex === itemIndex) return 0;

        if (itemIndex >= halfwayIndex) {
            if (activeIndex > itemIndex - halfwayIndex) {
                return (itemIndex - activeIndex) * itemHeight;
            } else {
                return -(data.length + activeIndex - itemIndex) * itemHeight;
            }
        }

        if (itemIndex > activeIndex) {
            return (itemIndex - activeIndex) * itemHeight;
        }

        if (itemIndex < activeIndex) {
            if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
                return (data.length - (activeIndex - itemIndex)) * itemHeight;
            }
            return -(activeIndex - itemIndex) * itemHeight;
        }
    };

    const handleClick = (direction) => {
        setActiveIndex((prevIndex) => {
            if (direction === "next") {
                if (prevIndex + 1 > data.length - 1) {
                    return 0;
                }
                return prevIndex + 1;
            }

            if (prevIndex - 1 < 0) {
                return data.length - 1;
            }

            return prevIndex - 1;
        });
    };

    return (
        <div className="container">
            <section className="outer-container">
                <div className="carousel-wrapper">
                    <button
                        type="button"
                        className="carousel-button prev"
                        onClick={() => handleClick("prev")}
                    >
                        <Prev />
                    </button>

                    <div className="carousel">
                        <div className="leading-text">
                            <p>{leadingText}</p>
                        </div>
                        <div className="slides">
                            <div className="carousel-inner">
                                {data.map((item, i) => (
                                    <button
                                        type="button"
                                        onClick={() => setActiveIndex(i)}
                                        className={cn("carousel-item", {
                                            active: activeIndex === i,
                                            visible:
                                                Math.abs(determinePlacement(i)) <= visibleStyleThreshold
                                        })}
                                        key={item.Site_Name}
                                        style={{
                                            transform: `translateY(${determinePlacement(i)}px)`
                                        }}
                                    >
                                        {item.Site_Name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="carousel-button next"
                        onClick={() => handleClick("next")}
                    >
                        <Next />
                    </button>
                </div>
                <div className="content">
                    <h2>{data[activeIndex].Site_Name}</h2>
                        <ul>Suburb: {data[activeIndex].Suburb}</ul>
                        <ul>Phone: {data[activeIndex].Phone}</ul>
                        <ul>Type: {data[activeIndex].ServiceFormat}</ul>
                        <ul>Address: {data[activeIndex].Address}</ul>
                        <ul>Age Limit: {data[activeIndex].AgeLimit}</ul>


                    <h5>Opening hours: </h5>
                    <ol>Mon: {data[activeIndex].Mo_Start} - {data[activeIndex].Mo_End}</ol>
                    <ol>Tue: {data[activeIndex].Tu_Start} - {data[activeIndex].Tu_End}</ol>
                    <ol>Wed: {data[activeIndex].We_Start} - {data[activeIndex].We_End}</ol>
                    <ol>Thu: {data[activeIndex].Th_Start} - {data[activeIndex].Th_End}</ol>
                    <ol>Fri: {data[activeIndex].Fr_Start} - {data[activeIndex].Fr_End}</ol>
                    <ol>Sat: {data[activeIndex].Sa_Start} - {data[activeIndex].Sa_End}</ol>
                    <ol>Sun: {data[activeIndex].Su_Start} - {data[activeIndex].Su_End}</ol>

                </div>
            </section>
        </div>
    );
};

VerticalCarousel.propTypes = {
    data: PropTypes.array.isRequired,
    leadingText: PropTypes.string.isRequired
};

export default VerticalCarousel;
