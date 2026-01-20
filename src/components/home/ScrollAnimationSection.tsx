'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useScroll, useTransform, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
    {
        id: 'passport',
        title: "Easily accessed with your trusted digital identity",
        description: "Access government services securely with your National Digital Identity.",
        image: "/images/01-passport.svg",
        color: "text-gray-900",
    },
    {
        id: 'educert',
        title: "Manage your education credentials",
        description: "View and share your verified academic certificates.",
        image: "/images/03-educert.svg",
        color: "text-gray-900",
    },
    {
        id: 'driving',
        title: "Vehicle ownership made simple",
        description: "Digital access to your driving license and details.",
        image: "/images/06-drivinglicence.svg",
        color: "text-gray-900",
    },
    {
        id: 'resume',
        title: "Your professional profile",
        description: "Keep your career documents organized and accessible.",
        image: "/images/05-resume.svg",
        color: "text-gray-900",
    },
];

export function ScrollAnimationSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Mobile Animation:
    // 1. Rises from bottom (500) to top position (70)
    // 2. Stays there for a bit
    // 3. Moves down to center (200) - Reduced from 350 as requested
    const mobileY = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [500, 70, 70, 200]);
    const mobileOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    // Text Animation (First Phase): Fades in, then fades out
    const textOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0.2, 0.3], [120, 70]);

    // Background Animation: Fades in middle phase
    const bgOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

    // Final Cards Animation: Fade in at the end
    const finalCardsOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
    const finalCardsY = useTransform(scrollYProgress, [0.8, 0.95], [50, 0]);

    return (
        <section ref={containerRef} className="relative h-[500vh] bg-white">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">

                {/* Background Image - Fades in */}
                <motion.div
                    style={{ opacity: bgOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/10-bg-final.webp"
                        alt="Background"
                        fill
                        className="object-cover opacity-50"
                    />
                </motion.div>

                <div className="container mx-auto px-4 relative h-full flex items-center justify-center z-10">

                    {/* Left Side Text (First Phase) */}
                    <motion.div
                        style={{ opacity: textOpacity, y: textY }}
                        className="absolute left-4 md:left-10 lg:left-24 top-1/3 -translate-y-1/2 z-30 max-w-xs md:max-w-md"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight">
                            <span className="block text-black mb-4">Easily accessed with your </span>
                            <span className="block text-red-600">trusted digital identity</span>
                        </h2>
                    </motion.div>

                    {/* Final Phase Cards (Left & Right) */}
                    <motion.div
                        style={{ opacity: finalCardsOpacity, y: finalCardsY }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 container mx-auto px-4 flex justify-between items-center pointer-events-none"
                    >
                        {/* Left Card */}
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-xs md:max-w-sm ml-4 pointer-events-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Verified</h3>
                            <p className="text-gray-600">Your data is protected with state-of-the-art encryption and biometric verification.</p>
                        </div>

                        {/* Right Card */}
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-xs md:max-w-sm mr-4 pointer-events-auto text-right">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">One-Stop Access</h3>
                            <p className="text-gray-600">Connect to over 800 government and private sector services seamlessly.</p>
                        </div>
                    </motion.div>

                    {/* Central Setup - Specific Size */}
                    <div className="relative w-[280px] h-[560px] md:w-[330px] md:h-[660px] flex items-center justify-center">

                        {/* Phone - Rises up, stays on top */}
                        <motion.div
                            style={{ y: mobileY, opacity: mobileOpacity }}
                            className="absolute inset-0 z-20 w-full h-full drop-shadow-2xl"
                        >
                            <Image
                                src="/images/digital-ic.webp"
                                alt="GovDocs Mobile App"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Icons/Cards - Start visible, then tuck behind */}
                        <div className="absolute inset-x-0 top-0 bottom-0 z-10 flex items-center justify-center">
                            {features.map((feature, index) => (
                                <StackingCard
                                    key={feature.id}
                                    feature={feature}
                                    index={index}
                                    total={features.length}
                                    scrollYProgress={scrollYProgress}
                                />
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

function StackingCard({ feature, index, total, scrollYProgress }: any) {
    // Determine positions
    // Initially: Distributed/Visible (e.g., Grid or scattered)
    // Finally: Stacked behind phone (Center)

    // Calculate initial offset based on index to scatter them
    // e.g., Top-Left, Top-Right, Bottom-Left, Bottom-Right
    const xOffset = index % 2 === 0 ? -150 : 150;
    const yOffset = index < 2 ? -150 : 150;

    const x = useTransform(scrollYProgress, [0, 0.5], [xOffset, 0]);
    // Adjust end Y to match mobile's new stop position (70) + stack offset
    const y = useTransform(scrollYProgress, [0, 0.5], [yOffset, 70 + (index + 1) * -15]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9 - (index * 0.05)]);
    const rotate = useTransform(scrollYProgress, [0, 0.5], [0, (index % 2 === 0 ? -1 : 1) * (index + 1) * 3]);

    return (
        <motion.div
            style={{ x, y, scale, rotate }}
            className="absolute w-[160px] h-[100px] md:w-[180px] md:h-[120px]"
        >
            <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-contain drop-shadow-md"
            />
        </motion.div>
    );
}
