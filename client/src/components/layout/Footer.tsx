import React from "react";
import Logo from "@/components/ui/Logo";
import { Instagram, Twitch, Youtube, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-sm mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:underline">LADIES</a></li>
              <li><a href="#" className="text-sm hover:underline">MEN</a></li>
              <li><a href="#" className="text-sm hover:underline">KIDS</a></li>
              <li><a href="#" className="text-sm hover:underline">HOME</a></li>
              <li><a href="#" className="text-sm hover:underline">MAGAZINE</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">Corporate Info</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:underline">CAREER AT H&M</a></li>
              <li><a href="#" className="text-sm hover:underline">ABOUT H&M GROUP</a></li>
              <li><a href="#" className="text-sm hover:underline">SUSTAINABILITY H&M GROUP</a></li>
              <li><a href="#" className="text-sm hover:underline">PRESS</a></li>
              <li><a href="#" className="text-sm hover:underline">INVESTOR RELATIONS</a></li>
              <li><a href="#" className="text-sm hover:underline">CORPORATE GOVERNANCE</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:underline">CUSTOMER SERVICE</a></li>
              <li><a href="#" className="text-sm hover:underline">MY H&M</a></li>
              <li><a href="#" className="text-sm hover:underline">FIND A STORE</a></li>
              <li><a href="#" className="text-sm hover:underline">LEGAL & PRIVACY</a></li>
              <li><a href="#" className="text-sm hover:underline">CONTACT</a></li>
              <li><a href="#" className="text-sm hover:underline">SECURE SHOPPING</a></li>
              <li><a href="#" className="text-sm hover:underline">COOKIE NOTICE</a></li>
              <li><a href="#" className="text-sm hover:underline">COOKIE SETTINGS</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="mb-6">
            <p className="text-sm mb-2">Sign up now and be the first to know about exclusive offers, latest fashion news & style tips!</p>
            <button className="text-sm font-medium underline">READ MORE</button>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8">
            <Logo />
            
            <div>
              <span className="text-sm mr-2">INDIA (₹s.)</span>
              <button className="text-sm underline">CHANGE REGION</button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <p className="text-xs text-gray-500 mb-6">The content of this site is copyright-protected and is the property of H & M Hennes & Mauritz AB.</p>
            
            <div className="flex space-x-4 justify-center md:justify-end">
              <a href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" aria-label="TikTok">
                <Twitch className="h-6 w-6" />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
