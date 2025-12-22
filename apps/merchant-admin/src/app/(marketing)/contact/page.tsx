'use client';

import React from 'react';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6">Let's talk.</h1>
                    <p className="text-xl text-[#1d1d1f]/60 mb-12">
                        We're here to help you grow. Reach out to our team for support, sales, or partnerships.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Support</h3>
                            <p className="text-[#1d1d1f]/60 mb-2">Our support team is available 24/7 on WhatsApp and Email.</p>
                            <a href="mailto:support@vayva.com" className="text-[#16a34a] font-bold hover:underline">support@vayva.com</a>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Sales</h3>
                            <p className="text-[#1d1d1f]/60 mb-2">Ready to scale? Talk to our sales team about enterprise plans.</p>
                            <a href="mailto:sales@vayva.com" className="text-[#16a34a] font-bold hover:underline">sales@vayva.com</a>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Office</h3>
                            <p className="text-[#1d1d1f]/60">
                                4 Balarabe Musa Crescent,<br />
                                Victoria Island, Lagos,<br />
                                Nigeria.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            {['twitter', 'linkedin', 'instagram'].map((social) => (
                                <a
                                    key={social}
                                    href={`#${social}`}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all"
                                >
                                    <Icon name={"Globe" as any} size={20} />
                                </a>
                            ))}
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
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1d1d1f]">First Name</label>
                                <input
                                    type="text"
                                    className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1d1d1f]">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1d1d1f]">Email Address</label>
                            <input
                                type="email"
                                className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                                placeholder="john@company.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1d1d1f]">Subject</label>
                            <input
                                type="text"
                                className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors"
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1d1d1f]">Message</label>
                            <textarea
                                className="w-full h-32 rounded-xl bg-gray-50 border border-gray-100 p-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors resize-none"
                                placeholder="Tell us more about your inquiry..."
                            />
                        </div>

                        <Button className="w-full h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl text-lg shadow-xl shadow-[#46EC13]/10">
                            Send Message
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
