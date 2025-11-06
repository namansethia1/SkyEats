import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "We deliver grocery all over the city",
      subtitle: "GET THEM ALL IN OUR STORE",
      buttonText: "SHOP NOW",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
      bgColor: "from-orange-400 to-red-500"
    },
    {
      id: 2,
      title: "Fresh Fruits & Vegetables",
      subtitle: "FARM TO YOUR DOORSTEP",
      buttonText: "ORDER NOW",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=400&fit=crop",
      bgColor: "from-green-400 to-emerald-500"
    },
    {
      id: 3,
      title: "Premium Quality Dairy",
      subtitle: "FRESH & PURE EVERYDAY",
      buttonText: "EXPLORE",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=400&fit=crop",
      bgColor: "from-blue-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Bakery & Snacks",
      subtitle: "FRESHLY BAKED DAILY",
      buttonText: "DISCOVER",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=400&fit=crop",
      bgColor: "from-purple-400 to-pink-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 transform translate-x-0' 
                : index < currentSlide 
                ? 'opacity-0 transform -translate-x-full'
                : 'opacity-0 transform translate-x-full'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-between px-8 md:px-16`}>
              {/* Left Content */}
              <div className="flex-1 text-white z-10">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6 opacity-90">
                  {slide.subtitle}
                </p>
                <button className="bg-white text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  {slide.buttonText}
                </button>
              </div>

              {/* Right Image */}
              <div className="flex-1 flex justify-end">
                <div className="relative w-80 h-64 md:w-96 md:h-80">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white bg-opacity-30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;