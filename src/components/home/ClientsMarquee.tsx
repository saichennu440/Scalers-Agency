import React from 'react';
import { motion } from 'framer-motion';

export default function ClientsMarquee() {
    const clients = [
        { name: 'Honeyharvest', logo: './HH_logo.png' },
        { name: 'Slack', logo: './HH_logo.png' },
        { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/200px-Spotify_icon.svg.png' },
        { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/200px-Airbnb_Logo_B%C3%A9lo.svg.png' },
        { name: 'Pinterest', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/200px-Pinterest-logo.png' },
        { name: 'Discord', logo: './HH_logo.png' },
        { name: 'Figma', logo: './HH_logo.png' },
        { name: 'Notion', logo: './HH_logo.png' },
    ];

    // Duplicate for seamless loop
    const duplicatedClients = [...clients, ...clients, ...clients, ...clients];

    return (
        <section className="bg-[#E8E4D9] py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-serif text-[#D91E36]"
                >
                    Our clients
                </motion.h2>
            </div>

            {/* Marquee Container */}
            <div className="relative">
                <motion.div
                    animate={{ x: [0, -50 * clients.length * 4] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="flex items-center gap-16 md:gap-24"
                >
                    {duplicatedClients.map((client, index) => (
                        <div 
                            key={`${client.name}-${index}`}
                            className="flex-shrink-0 opacity-80 hover:opacity-70 transition-opacity duration-300"
                        >
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="h-12  w-auto grayscale"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}