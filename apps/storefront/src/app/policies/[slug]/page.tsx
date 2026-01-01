"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

// Public endpoint for storefront to fetch policies
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";


export default function PublicPolicyPage({ params }: any) {
  const { slug } = useParams() as { slug: string };
  const [policy, setPolicy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        // Assuming slug maps to key like 'privacy'
        const res = await axios.get(`${API_URL}/compliance/policies/${slug}`);
        setPolicy(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolicy();
  }, [slug]);

  if (isLoading)
    return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!policy)
    return (
      <div className="p-12 text-center text-gray-400">Policy not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 sm:px-8">
      <h1 className="text-3xl font-bold text-[#0B1220] mb-8">{policy.title}</h1>
      {/* 
                CRITICAL SECURITY NOTE: 
                In a production environment, this content MUST be sanitized using a library like DOMPurify 
                to prevent Stored XSS attacks from malicious merchant input.
            */}
      <div
        className="prose prose-slate max-w-none leading-relaxed text-[#525252]"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
      <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400 italic">
        Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
