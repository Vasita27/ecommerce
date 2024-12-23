import React, { useState, useEffect } from "react";
import "./styles/TabletSlider.css";

const TabletSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://www.kalkifashion.com/blogs/wp-content/uploads/2023/09/10-Tips-To-Look-Attractive-And-Slim-In-Long-Kurtis.jpg",
    "https://stylum.in/cdn/shop/articles/Stylum_Blog_Banner_copy_57e06608-e67f-48ce-aa4f-3a6040c72d45.jpg?v=1711536275&width=1100",
    "https://www.jaipurkurti.com/cdn/shop/files/best_Eoss_in_jaipur_kurti.jpg?v=1734158306&width=1024",
    "https://www.jaipurkurti.com/cdn/shop/files/Sale_a1a85f3a-f987-4262-967c-3652f7f6804d.jpg?v=1697613889&width=1309"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="tablet-slider">
      <div
        className="slider"
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default TabletSlider;
