"use client";

import React, { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function ContactPage(): React.JSX.Element {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6">
            Let's talk.
          </h1>
          <p className="text-xl text-[#1d1d1f]/60 mb-12">
            We're here to help you grow. Reach out to our team for support,
            sales, or partnerships.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Support</h3>
              <p className="text-[#1d1d1f]/60 mb-2">
                Our support team is available 24/7 on WhatsApp and Email.
              </p>
              <a
                href="mailto:support@vayva.ng"
                className="text-[#16a34a] font-bold hover:underline"
              >
                support@vayva.ng
              </a>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">General Inquiries</h3>
              <p className="text-[#1d1d1f]/60 mb-2">
                Questions about Vayva? Partnerships? We'd love to hear from you.
              </p>
              <a
                href="mailto:hello@vayva.ng"
                className="text-[#16a34a] font-bold hover:underline"
              >
                hello@vayva.ng
              </a>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Office</h3>
              <p className="text-[#1d1d1f]/60">
                4 Balarabe Musa Crescent,
                <br />
                Victoria Island, Lagos,
                <br />
                Nigeria.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="https://twitter.com/vayva_ng"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com/company/vayva"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://instagram.com/vayva.ng"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2rem] shadow-xl"
        >
          {status === "success" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Icon name="Check" size={32} className="text-[#22C55E]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">
                Ticket Opened!
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Thank you for reaching out. A support ticket has been created
                and we've sent a confirmation to your email address.
              </p>
              <Button
                onClick={() => setStatus("idle")}
                className="bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1d1d1f]">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1d1d1f]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1d1d1f]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1d1d1f]">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1d1d1f]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full h-32 rounded-xl bg-gray-50 border border-gray-100 p-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl text-lg shadow-xl shadow-[#46EC13]/10 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </Button>
              {status === "error" && (
                <p className="text-red-500 text-center text-sm font-bold">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
