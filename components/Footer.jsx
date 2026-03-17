"use client";
import { withBasePath } from "@/lib/basePath";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(160deg, #0f0c06 0%, #1c1609 25%, #2a1f0d 50%, #1c1609 75%, #0a0802 100%)" }}>
      {/* Ambient glow — sama seperti section lain */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Gold top border */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4a017, #f59e0b, #d4a017, transparent)" }}></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Logo & Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex-shrink-0 ring-1 ring-amber-500/40">
                <img
                  src={withBasePath("/logo_batik.png")}
                  alt="Batik UMM Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                BATIK
              </span>
            </div>
            <p className="text-amber-100/60 leading-relaxed text-sm md:text-base">
              We always provide the best service to make it easy for researchers
              to research batik. Platform riset batik berbasis AI dari
              Universitas Muhammadiyah Malang.
            </p>
            <div className="mt-5 h-px w-16" style={{ background: "linear-gradient(90deg, #d4a017, transparent)" }}></div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/projects", label: "Projects" },
                { href: "/datasets", label: "Datasets" },
                { href: "/publications", label: "Publications" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={withBasePath(href)}
                    className="group flex items-center gap-2 text-amber-100/60 hover:text-amber-300 transition-colors duration-200 text-sm md:text-base"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-500/50 group-hover:bg-amber-400 transition-colors duration-200 flex-shrink-0"></span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-5 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Contact
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20" style={{ background: "rgba(255,200,50,0.08)" }}>
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-amber-100/60 text-sm md:text-base break-all">
                  aguseko@umm.ac.id
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20" style={{ background: "rgba(255,200,50,0.08)" }}>
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-amber-100/60 text-sm md:text-base">
                  Jl. Raya Tlogomas No.246, Jawa Timur 65144, Indonesia
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20" style={{ background: "rgba(255,200,50,0.08)" }}>
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-amber-100/60 text-sm md:text-base">
                  (0341) 464318, ext 252
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t" style={{ borderColor: "rgba(212, 160, 23, 0.2)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-amber-100/40 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-amber-400/70">IRC-UMM</span>. All Rights Reserved.
              Developed by Informatics Researcher.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a
                  key={item}
                  href={withBasePath("/about")}
                  className="text-amber-100/40 hover:text-amber-300 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
