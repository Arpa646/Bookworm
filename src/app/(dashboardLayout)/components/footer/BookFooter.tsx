"use client";

import Link from "next/link";
import { BookOpen, Mail, Facebook, Twitter, Instagram, Github, Heart } from "lucide-react";

export const BookFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "My Library", href: "/dashboard/my-library" },
      { label: "Search Books", href: "/dashboard/search" },
      { label: "Tutorials", href: "/dashboard/tutorial" },
      { label: "Reading Challenge", href: "/dashboard/reading-challenge" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
    about: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  };

  return (
    <footer className="bg-black border-t border-red-600/30 mt-auto w-full" style={{ position: "relative", zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="p-2 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Bookworm</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your personal reading companion. Discover, organize, and track your reading journey with ease.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@bookworm.com" className="hover:text-red-500 transition-colors">
                  support@bookworm.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>
                © {currentYear} Bookworm. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>for book lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
