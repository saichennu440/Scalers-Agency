import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            quote: "Worth every minute working together.",
            description: "This is the space to share a review from one of the business's clients or customers.",
            name: 'Jean G.',
            title: 'Senior Art Director',
            company: 'at MAL',
        },
        {
            quote: "Reliable, creative, and truly exceptional.",
            description: "The team consistently delivered beyond our expectations. Their strategic approach transformed our brand.",
            name: 'Sarah M.',
            title: 'Marketing Director',
            company: 'at TechCorp',
        },
        {
            quote: "A game-changer for our business.",
            description: "Working with The Firm was one of the best decisions we made. Results speak for themselves.",
            name: 'David R.',
            title: 'CEO',
            company: 'at Innovate Inc',
        },
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="bg-[#D91E36] py-20 md:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#E8E4D9] mb-16 md:mb-24"
                >
                    Client testimonials
                </motion.h2>

                {/* Testimonial Content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-2 gap-12 md:gap-20"
                        >
                            <div>
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#E8E4D9] italic leading-tight">
                                    "{testimonials[currentIndex].quote}"
                                </h3>
                            </div>

                            <div className="flex flex-col justify-end">
                                <p className="text-[#E8E4D9]/70 text-lg mb-8 leading-relaxed">
                                    {testimonials[currentIndex].description}
                                </p>
                                <div>
                                    <p className="text-[#E8E4D9] font-medium text-lg">
                                        {testimonials[currentIndex].name}
                                    </p>
                                    <p className="text-[#E8E4D9]/60">
                                        {testimonials[currentIndex].title}
                                    </p>
                                    <p className="text-[#E8E4D9]/60">
                                        {testimonials[currentIndex].company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center gap-4 mt-12 md:mt-16">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 rounded-full border border-[#E8E4D9]/30 text-[#E8E4D9]/60 hover:text-[#E8E4D9] hover:border-[#E8E4D9] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="p-3 rounded-full border border-[#E8E4D9]/30 text-[#E8E4D9]/60 hover:text-[#E8E4D9] hover:border-[#E8E4D9] transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <span className="ml-4 text-[#E8E4D9]/40 text-sm">
                            {currentIndex + 1} / {testimonials.length}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}