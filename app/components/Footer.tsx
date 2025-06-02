import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const socialLinks = [
  {
    icon: <Facebook size={24} />,
    url: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: <Twitter size={24} />,
    url: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: <Instagram size={24} />,
    url: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: <Linkedin size={24} />,
    url: "https://linkedin.com",
    label: "LinkedIn",
  },
];

const Footer: React.FC = () => (
  <footer className="flex w-full gap-10 justify-center items-center bg-gray-100 text-gray-700 p-4 fixed bottom-0 left-0 z-50">
    {socialLinks.map(({ icon, url, label }) => (
      <a
        key={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        style={{ color: "#333", transition: "color 0.2s" }}
      >
        {icon}
      </a>
    ))}
  </footer>
);

export default Footer;
