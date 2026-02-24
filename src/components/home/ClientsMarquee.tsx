import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Client {
  name: string;
  logo: string;
}

export default function ClientsMarquee() {
  const clients: Client[] = [
    { name: 'Honeyharvest',   logo: './HH_logo_png.png'            },
    { name: 'Aranya',         logo: './Aranya_logo_png.png'         },
    { name: 'AromaSpa',       logo: './Aroma_Spa_logo_png.png'      },
    { name: 'Avis',           logo: './Avis_logo_png.png'           },
    { name: 'Bahar Cafe',     logo: './Bahar_Cafe_logo_png.png'     },
    { name: 'Bellwether',     logo: './Bellwether_logo_png.png'     },
    {name: 'Feast House',     logo: './feasthouselogo.png'       },   
    { name: 'BIA',            logo: './BIA_logo_png.png'            },
    { name: 'Coco Tang',      logo: './coco_Tang_logo_png.png'      },
    { name: '7 Midway Plaza', logo: './7plaza_logo.png'          },
    { name: 'Colors',         logo: './Colors_logo_png.png'         },
    { name: 'DPS',            logo: './DPS_logo_png.png'            },
    { name: 'HTGS',           logo: './HTGS_logo_png.png'           },
    { name: 'Ideal Kitchen',  logo: './Ideal_Kitchen_logo_png.png'  },
    { name: 'Legacy Reality', logo: './Legacy_Reality_logo_png.png' },
    { name: 'Ortus',          logo: './Ortus_logo_png.png'          },
    { name: 'Vinjee',         logo: './Vinjee_logo_png.png'         },
    { name: 'Viroha',         logo: './viroha_logo_png.png'         },
    { name: 'Westberry',      logo: './Westberry_logo_png.png'      },
  ];

  const [selected, setSelected] = useState<Client | null>(null);

  // Quadruple for a seamless infinite loop
  const duplicatedClients = [...clients, ...clients, ...clients, ...clients];

  const handleLogoClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(client);
  };

  const handleClose = () => setSelected(null);

  return (
    <>
      <section className="bg-[#E8E4D9] py-16 md:py-24 overflow-hidden">

        {/* Heading */}
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

        {/* Marquee */}
        <div className="relative">
          {/* Left / right edge fades */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
            style={{ background: 'linear-gradient(to right, #E8E4D9, transparent)' }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
            style={{ background: 'linear-gradient(to left, #E8E4D9, transparent)' }}
          />

          {/*
            The track animates with CSS animation so we can pause it cleanly
            via animation-play-state rather than fighting Framer Motion re-renders.
          */}
          <div
            className="flex items-center gap-16 md:gap-24"
            style={{
              animation: `marquee-scroll ${40 * (clients.length / 17)}s linear infinite`,
              animationPlayState: selected ? 'paused' : 'running',
              width: 'max-content',
            }}
          >
            {duplicatedClients.map((client, index) => (
              <button
                key={`${client.name}-${index}`}
                onClick={(e) => handleLogoClick(client, e)}
                className={`
                  flex-shrink-0 cursor-pointer outline-none
                  transition-all duration-300
                  ${selected?.name === client.name
                    ? 'opacity-100 grayscale-0 scale-110'
                    : 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0 hover:scale-105'
                  }
                `}
                aria-label={`View ${client.name} logo`}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-24 w-auto pointer-events-none select-none"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Keyframe injected once */}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
      `}</style>

      {/* ── Logo popup overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop — click anywhere to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[6px] cursor-pointer"
              onClick={handleClose}
            />

            {/* Popup card — centred on screen */}
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.76, y: 28 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.82,  y: 20 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-none"
            >
              <div
                className="relative bg-white rounded-3xl shadow-2xl px-14 py-12 md:px-20 md:py-16 pointer-events-auto flex flex-col items-center"
                style={{ boxShadow: '0 40px 90px rgba(0,0,0,0.24), 0 0 0 1px rgba(217,30,54,0.07)' }}
                onClick={(e) => e.stopPropagation()} // card click doesn't close
              >
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#D91E36]/8 hover:bg-[#D91E36] text-[#D91E36] hover:text-white flex items-center justify-center transition-all duration-200"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>

                {/* Logo — medium size */}
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="h-36 md:h-48 w-auto max-w-[300px] object-contain"
                />

                {/* Client name below logo */}
                <p className="mt-7 text-[#8B1E32]/40 text-[10px] font-bold tracking-[0.32em] uppercase">
                  {selected.name}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}