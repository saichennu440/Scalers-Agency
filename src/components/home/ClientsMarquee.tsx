import React from 'react';
import { motion } from 'framer-motion';

export default function ClientsMarquee() {
    const clients = [
        { name: 'Dropbox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/200px-Dropbox_Icon.svg.png' },
        { name: 'Slack', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/200px-Slack_icon_2019.svg.png' },
        { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/200px-Spotify_icon.svg.png' },
        { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/200px-Airbnb_Logo_B%C3%A9lo.svg.png' },
        { name: 'Pinterest', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/200px-Pinterest-logo.png' },
        { name: 'Discord', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Font_Awesome_5_brands_discord_color.svg/200px-Font_Awesome_5_brands_discord_color.svg.png' },
        { name: 'Figma', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/200px-Figma-logo.svg.png' },
        { name: 'Notion', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/200px-Notion-logo.svg.png' },
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
                            className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-300"
                        >
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="h-8 md:h-12 w-auto grayscale"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}