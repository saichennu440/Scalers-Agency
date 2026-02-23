import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <section id="about" className="bg-[#ffffff]">
            {/* Large Image */}
            <div className="w-full h-[50vh] md:h-[70vh] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: true }}
                    src="./home_office.jpeg"
                    alt="Modern office space"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#D91E36]">
                            Who we are
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="text-lg text-[#8B1E32] leading-relaxed">
                            Scalers Business Agency is a marketing and branding firm focused on helping businesses grow with clarity and direction. We work closely with founders and teams to understand how their business operates before we design how it communicates.                        </p>
                        <p className="text-lg text-[#8B1E32] leading-relaxed">
                            Our work connects strategy, branding and execution into one structured approach. Instead of isolated campaigns, we build consistent systems that support long-term growth. Every decision is aligned with business objectives, ensuring marketing feels organised, purposeful and scalable. </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

