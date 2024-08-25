// components/LottieAnimation.tsx
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '@/Animation - 1724568650652.json'

interface LottieAnimationProps {
    isPlaying: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ isPlaying }) => {
    const defaultOptions = {
        loop: true,
        autoplay: isPlaying,
        animationData: animationData,
    };

    return <Lottie options={defaultOptions} height={100} width={100} />;
};

export default LottieAnimation;
