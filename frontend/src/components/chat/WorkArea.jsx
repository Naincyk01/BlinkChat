import React from 'react';
import { LuMessagesSquare } from 'react-icons/lu';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import Image1 from '../../assets/welcomeImage1.svg';
import Image2 from '../../assets/welcomeImage2.svg';

const WorkArea = () => {
  const text = "Connect easily with your friends and family.......";

 
  const image1Variants = {
    initial: { y: 0, opacity: 0 }, // Initial position and opacity
    animate: {
      y: -10, // Animation position (upward)
      opacity: 1, // Fade in effect
      transition: {
        yoyo: Infinity, // Loop animation indefinitely
        duration: 2, // Animation duration
        ease: "easeInOut" // Easing function
      }
    }
  };


  const image2Variants = {
    initial: { y: 0, opacity: 0 },
    animate: {
      y: 10, 
      opacity: 1, 
      transition: {
        yoyo: Infinity, 
        duration: 2, 
        ease: "easeInOut" 
      }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08, 
        delayChildren: 1 
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, 
        ease: 'easeOut' 
      }
    }
  };

  return (
    <div className="w-full h-screen bg-chatBg p-4">
      <div className="flex flex-col justify-center items-center w-full h-full bg-[#0D0D0D] rounded-xl gap-6 border border-primaryLight border-opacity-50">
        <div className="flex justify-center items-baseline">
          {/* Image 2 with animation */}
          <motion.img
            src={Image2}
            alt="Second Image"
            className="w-48 h-72"
            variants={image2Variants}
            initial="initial"
            animate="animate"
          />

          {/* Image 1 with animation */}
          <motion.img
            src={Image1}
            alt="First Image"
            className="h-48 w-48"
            variants={image1Variants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Animated text using Framer Motion */}
        <motion.div
          className="text-logoFontSize  font-bold text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap justify-center">
            {text.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="mr-4"> {/* Add margin to space out words */}
                {word.split("").map((char, charIndex) => (
                  <motion.span key={charIndex} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>
        </motion.div>


        <LuMessagesSquare className="" size={50} />
      </div>
    </div>
  );
};

export default WorkArea;
