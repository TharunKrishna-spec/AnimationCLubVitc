import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 active:scale-100">
    {children}
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 text-gray-300 py-12 border-t border-cyan-900/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-orbitron font-bold text-white mb-4">Animation Club VITC</h3>
            <p className="text-sm text-gray-400">Creativity in Motion. Join us to explore the world of animation and visual storytelling.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/departments" className="hover:text-cyan-400 transition-colors inline-block transform transition-transform active:scale-95">Departments</Link></li>
              <li><Link to="/events" className="hover:text-cyan-400 transition-colors inline-block transform transition-transform active:scale-95">Events</Link></li>
              <li><Link to="/leads" className="hover:text-cyan-400 transition-colors inline-block transform transition-transform active:scale-95">Our Leads</Link></li>
              <li><Link to="/members" className="hover:text-cyan-400 transition-colors inline-block transform transition-transform active:scale-95">Join Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.04c-5.5 0-10 4.49-10 10s4.5 10 10 10 10-4.49 10-10-4.5-10-10-10zm0 18.2c-4.52 0-8.2-3.68-8.2-8.2s3.68-8.2 8.2-8.2 8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z"/><path d="M12 7.02c-2.75 0-4.98 2.23-4.98 4.98s2.23 4.98 4.98 4.98 4.98-2.23 4.98-4.98-2.23-4.98-4.98-4.98zm0 8.16c-1.75 0-3.18-1.43-3.18-3.18s1.43-3.18 3.18-3.18 3.18 1.43 3.18 3.18-1.43 3.18-3.18 3.18zM16.95 6.05c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9z"/></svg>
              </SocialIcon>
               <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Animation Club VITC. All Rights Reserved.</p>
          <p className="mt-2">
            Developed by <span className="text-cyan-400 font-semibold">Tharun Krishna S I</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;