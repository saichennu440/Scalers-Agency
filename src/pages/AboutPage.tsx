import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../lib/types';
import { ArrowRight } from 'lucide-react';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

const stats = [
    { value: '50+', label: 'Clients Served' },
    { value: '5+', label: 'Years of Experience' },
    { value: '2500+', label: 'Influencers Colabs' },
    { value: '98%', label: 'Client Satisfaction' },
];

const team = [
    {
        name: 'Alexandra Moore',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    {
        name: 'James Carter',
        role: 'Creative Director',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
        name: 'Sofia Reyes',
        role: 'Head of Strategy',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    },
    {
        name: 'David Kim',
        role: 'Lead Developer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
];

const values = [
    { title: 'Bold Thinking', description: 'We challenge assumptions and build ideas that move brands forward.' },
    { title: 'Data-Driven', description: 'Every decision is backed by insight, performance and measurable impact.' },
    { title: 'Transparent Partnership', description: 'We work with clarity, consistency and shared accountability.' },
];

export default function About({ onNavigate }: AboutProps) {
    return (
        <div className="bg-[#E8E4D9] min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[70vh] bg-[#D91E36] flex flex-col overflow-hidden">
                {/* <div className="absolute right-4 bottom-10 text-white/[0.045] text-[16rem] font-black font-serif leading-none select-none pointer-events-none">WE</div> */}
                <div className="flex-1 flex items-end pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full pt-32">
                    <div className="grid md:grid-cols-2 gap-12 items-end w-full">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-serif text-white leading-tight"
                        >
                            We are the agency behind your growth.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-white/70 text-lg leading-relaxed md:mb-2"
                        >
                            Scalers is a strategy-led marketing and branding agency focused on building strong business foundations. We help brands define their position, communicate with clarity and scale with consistency.
                        </motion.p>
                    </div>
                
                </div>
                
                {/* Diagonal cut */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#E8E4D9]" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
            </section>

            {/* Stats */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-5xl md:text-6xl font-serif text-[#D91E36] mb-2">{stat.value}</div>
                            <div className="text-[#8B1E32]/70 text-sm tracking-wide uppercase">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Story */}
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                            alt="Team at work"
                            className="rounded-2xl w-full object-cover aspect-[4/5]"
                        />
                        <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#D91E36] rounded-2xl -z-10" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="text-[#D91E36] text-sm tracking-widest uppercase font-medium">Our Story</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#8B1E32] leading-tight">
                            Built by marketers, for brands that want to scale.
                        </h2>
                        <p className="text-[#8B1E32]/70 leading-relaxed">
                            Scalers was founded with a clear purpose — to bring structure to marketing and clarity to growth. What began as a focused team of strategists has evolved into a full-service agency working across industries with one consistent principle: align creativity with measurable outcomes.
                        </p>
                        <p className="text-[#8B1E32]/70 leading-relaxed">
                            We believe marketing should do more than create visibility. It should build connection, drive conversion and strengthen long-term brand value. Every step we take is guided by strategy, accountability and sustained progress.
                        </p>
                        <button
                            onClick={() => { onNavigate('services'); window.scrollTo({ top: 0 }); }}
                            className="inline-flex items-center gap-2 text-[#D91E36] font-medium hover:gap-4 transition-all group"
                            >
                            Explore our services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-[#D91E36] mb-16"
                    >
                        What drives us
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-0">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                                className="border-t border-[#D91E36]/20 pt-8 pr-8 pb-8"
                            >
                                <span className="text-[#D91E36]/40 text-sm font-light block mb-4">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="text-2xl font-serif text-[#8B1E32] mb-4">{value.title}</h3>
                                <p className="text-[#8B1E32]/70 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 md:py-28 bg-[#D91E36]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-white mb-16"
                    >
                        Meet the team
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="aspect-[3/4] overflow-hidden rounded-xl mb-4">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="text-white font-medium">{member.name}</h4>
                                <p className="text-white/50 text-sm mt-1">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 md:px-12 text-center">
                <div className="max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif text-[#D91E36] mb-8"
                    >
                        Ready to scale your brand?
                    </motion.h2>
                    <a
                        href="/#contact"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-[#D91E36] text-white rounded-full hover:bg-[#B01830] transition-colors text-lg group"
                    >
                        Let's talk <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </section>

            
        </div>
    );
}