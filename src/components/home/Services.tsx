import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
    const services = [
        {
            number: '01',
            title: 'Branding',
            description: 'Describe the service and how customers or clients can benefit from it. This is the place to add a short description with relevant details, like pricing, duration and how to book.',
        },
        {
            number: '02',
            title: 'Content Creation',
            description: 'Describe the service and how customers or clients can benefit from it. This is the place to add a short description with relevant details, like pricing, duration and how to book.',
        },
        {
            number: '03',
            title: 'Website Design & Development',
            description: 'Describe the service and how customers or clients can benefit from it. This is the place to add a short description with relevant details, like pricing, duration and how to book.',
        },
        {
            number: '04',
            title: 'Social Media Management',
            description: 'Describe the service and how customers or clients can benefit from it. This is the place to add a short description with relevant details, like pricing, duration and how to book.',
        },
        {
            number: '05',
            title: 'Digital Marketing',
            description: 'Describe the service and how customers or clients can benefit from it. This is the place to add a short description with relevant details, like pricing, duration and how to book.',
        },
    ];

    return (
        <section id="services" className="bg-[#E8E4D9] py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#D91E36] mb-6 md:mb-0"
                    >
                        What we do
                    </motion.h2>
                    
                    
                </div>

                {/* Services List */}
                <div className="space-y-0">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.number}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="border-t border-[#D91E36]/20 py-8 md:py-12 group cursor-pointer hover:bg-[#D91E36]/5 transition-colors px-4 -mx-4"
                        >
                            <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-start">
                                <div className="md:col-span-1">
                                    <span className="text-sm text-[#D91E36]/60 font-light">
                                        {service.number}
                                    </span>
                                </div>
                                <div className="md:col-span-4">
                                    <h3 className="text-2xl md:text-3xl font-serif text-[#D91E36] group-hover:translate-x-2 transition-transform">
                                        {service.title}
                                    </h3>
                                </div>
                                <div className="md:col-span-7">
                                    <p className="text-[#8B1E32]/80 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div className="border-t border-[#D91E36]/20" />
                </div>
                <div className="flex justify-end mt-8">
                    <button className="flex items-center gap-2 text-[#D91E36] font-semibold hover:gap-3 transition-all duration-300">
                        View all services
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}