import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

import image1 from '../assets/images/1.png';
import image2 from '../assets/images/1.png';
import image3 from '../assets/images/1.png';

const images = [
  { src: image1, alt: 'Promo 1', description: 'Special offer on mobile recharges' },
  { src: image2, alt: 'Promo 2', description: '50% cashback on electricity bills' },
  { src: image3, alt: 'Promo 3', description: 'Free movie tickets on game top-ups' },
];

const PromoBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div
      className="relative p-4 rounded-lg overflow-hidden h-[340px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex transition-transform duration-500 ease-out" 
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        aria-live="polite"
      >
        {images.map((image, index) => (
          <div 
            key={image.alt} 
            className={classNames('w-full h-[260px] flex-shrink-0 transition-opacity duration-1000 ease-in-out', {
              'opacity-100': currentImageIndex === index,
              'opacity-0': currentImageIndex !== index,
            })}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="h-[250px] w-full object-cover rounded-2xl p-2" 
            />
            {/* <p className="mt-2 text-center text-gray-700">{image.description}</p> */}
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className={classNames(
          "absolute top-1/2 left-2 mb-8 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md transition duration-300 ease-in-out",
          {
            "opacity-100 translate-x-0": isHovered,
            "opacity-0 -translate-x-4 pointer-events-none": !isHovered,
          }
        )}
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-600 " />
      </button>

      <button
        onClick={goToNext}
        className={classNames(
          "absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md transition duration-300 ease-in-out",
          {
            "opacity-100 translate-x-0": isHovered,
            "opacity-0 translate-x-4 pointer-events-none": !isHovered,
          }
        )}
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-600" />
      </button>

      <div className="flex justify-center mt-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={classNames('h-2 w-2 mx-1 rounded-full cursor-pointer transition duration-300', {
              'bg-blue-600 scale-125': currentImageIndex === index,
              'bg-gray-300': currentImageIndex !== index,
            })}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
