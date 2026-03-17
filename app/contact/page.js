"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import for Map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 flex items-center justify-center">
      <div className="text-white">Loading map...</div>
    </div>
  ),
});

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "Email",
      content: "aguseko@umm.ac.id",
      link: "mailto:aguseko@umm.ac.id",
    },
    {
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
      title: "Phone",
      content: "(0341) 464318, ext 252",
      link: "tel:(0341)464318",
    },
    {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      title: "Office",
      content: "Jl. Raya Tlogomas No.246, Jawa Timur 65144, Indonesia",
      link: "#",
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Business Hours",
      content: "Mon - Fri: 8:00 AM - 16:00 PM WIB",
      link: "#",
    },
  ];

  const faqs = [
    {
      question: "How can I access your datasets?",
      answer:
        "All our datasets are available through our platform. Simply create an account and browse our dataset collection.",
    },
    {
      question: "Do you offer enterprise solutions?",
      answer:
        "Yes, we provide customized enterprise solutions. Contact our sales team to discuss your specific needs.",
    },
    {
      question: "Can I contribute to your research?",
      answer:
        "Absolutely! We welcome collaboration. Reach out to our research team to explore partnership opportunities.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0f0c06 0%, #1c1609 25%, #2a1f0d 50%, #1c1609 75%, #0f0c06 100%)", color: "white" }}>
      {/* Hero Section */}
      <section className="relative py-20 pt-32 overflow-hidden border-b border-amber-500/10">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background_batik.jpg')" }}
        />
        {/* Warm-dark gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: "linear-gradient(160deg, rgba(15,12,6,0.85) 0%, rgba(28,22,9,0.7) 25%, rgba(42,31,13,0.6) 50%, rgba(28,22,9,0.8) 75%, rgba(15,12,6,0.95) 100%)" 
          }} 
        />

        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-amber-200 mb-8">
            <button
              onClick={() => router.push("/")}
              className="hover:text-amber-100 transition-colors"
            >
              Home
            </button>
            <svg
              className="w-4 h-4 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-amber-50">Contact Us</span>
          </div>

          {/* Title */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-amber-500/30 mb-6">
              <svg
                className="w-4 h-4 text-amber-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-bold text-amber-200">
                Get In Touch
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-50 via-amber-200 to-yellow-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              Contact Us
            </h1>
            <p className="text-xl text-amber-100/80 font-light max-w-3xl mx-auto leading-relaxed">
              Have questions or want to collaborate? We'd love to hear from you.
              Our team is here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-amber-500/20 hover:border-amber-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 group shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={info.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-amber-50 mb-2 group-hover:text-amber-300 transition-colors">
                  {info.title}
                </h3>
                <p className="text-amber-100/60 font-light">{info.content}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {/* Map Section */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-amber-500/20 p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-amber-50 mb-6 drop-shadow-sm">
                  Visit Our Office
                </h3>
                <MapComponent />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
