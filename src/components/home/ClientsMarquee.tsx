import React from 'react';
import { motion } from 'framer-motion';

export default function ClientsMarquee() {
    const clients = [
        { name: 'Honeyharvest', logo: './HH_logo.png' },
        { name: 'Aranya', logo: './Aranya_logo_png.png' },
        { name: 'AromaSpa', logo: './Aroma_Spa_logo_png.png' },
        { name: 'Avis', logo: './Avis_logo_png.png' },
        { name: 'Bahar Cafe', logo: './Bahar_Cafe_logo_png.png' },
        { name: 'Bellwether', logo: './Bellwether_logo_png.png' },
        { name: 'BIA', logo: './BIA_logo_png.png' },
        { name: 'Coco Tang', logo: './coco_Tang_logo_png.png' },
        { name: 'Colors', logo: './Colors_logo_png.png' },
        { name: 'DPS', logo: './DPS_logo_png.png' },
        { name: 'HTGS', logo: './HTGS_logo_png.png' },
        { name: 'Ideal_Kitchen', logo: './Ideal_Kitchen_logo_png.png' },
        { name: 'Legacy Reality', logo: './Legacy_Reality_logo_png.png' },
        { name: 'Ortus', logo: './Ortus_logo_png.png' },
        { name: 'Vinjee', logo: './Vinjee_logo_png.png' },
        { name: 'viroha', logo: './viroha_logo_png.png' },
        { name: 'Westberry', logo: './Westberry_logo_png.png' },
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
                            className="flex-shrink-0 opacity-80 hover:opacity-80 transition-opacity duration-300"
                        >
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="h-24  w-auto grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}