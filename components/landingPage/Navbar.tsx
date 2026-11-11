// src/components/landingPage/Navbar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ServiceDropdownNav } from '@/components/services/ServiceDropdownNav';
import { LocationDropdownNav } from '@/components/locations/LocationDropdownNav';

interface NavbarProps {
  className?: string;
  cmsNavigation?: CmsNavItem[];
  siteName?: string;
  logo?: string;
}

type CmsNavItem = {
  id: string;
  label: string;
  url: string;
  target: string;
  children: CmsNavItem[];
};

function CmsNavLink({
  item,
  className,
  onClick,
}: {
  item: CmsNavItem;
  className: string;
  onClick?: () => void;
}) {
  const props = {
    className,
    target: item.target,
    rel: item.target === '_blank' ? 'noopener noreferrer' : undefined,
    onClick,
  };
  return item.url.startsWith('/') ? (
    <Link href={item.url} {...props}>{item.label}</Link>
  ) : (
    <a href={item.url} {...props}>{item.label}</a>
  );
}

export function Navbar({ className, cmsNavigation, siteName, logo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  const navLinks = [
    { name: 'Work', href: '/work' },
    { name: 'Services', href: '/ai-development', hasDropdown: true, dropdownType: 'services' },
    { name: 'Locations', href: '/ai-development-company', hasDropdown: true, dropdownType: 'locations' },
    { name: 'Process', href: '/process' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
  ];
  const cmsLinks = cmsNavigation?.length ? cmsNavigation : null;

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/" 
            className="text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity flex-shrink-0 group"
          >
            {logo ? (
              <Image src={logo} alt={siteName || 'ClickMasters'} width={180} height={48} unoptimized className="h-10 w-auto object-contain" />
            ) : (
            <span className="relative">
              {siteName || 'ClickMasters'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-500"></span>
            </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center gap-6 2xl:gap-8 flex-1">
            {cmsLinks ? cmsLinks.map((link) => (
              <div key={link.id} className="group relative">
                <CmsNavLink
                  item={link}
                  className="relative text-sm font-medium text-white/80 hover:text-white transition-colors"
                />
                {link.children.length > 0 && (
                  <div className="absolute left-0 top-full hidden min-w-48 pt-3 group-hover:block group-focus-within:block">
                    <div className="border border-white/10 bg-black/95 p-3 shadow-xl">
                      {link.children.map((child) => (
                        <CmsNavLink
                          key={child.id}
                          item={child}
                          className="block px-3 py-2 text-sm text-white/80 hover:text-white"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )) : navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown && link.dropdownType === 'services' ? (
                  <ServiceDropdownNav />
                ) : link.hasDropdown && link.dropdownType === 'locations' ? (
                  <LocationDropdownNav />
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-white/80 hover:text-white transition-colors relative group",
                      pathname === link.href && "text-white"
                    )}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Contact Button */}
          <Link
            href="/contact"
            className="hidden xl:block text-sm font-medium border border-white/40 rounded-full px-5 py-2 hover:bg-white hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
          >
            Let&apos;s talk
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden flex flex-col gap-1.5 p-2 text-white flex-shrink-0"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "block w-6 h-0.5 bg-white transition-all duration-300",
                isMobileMenuOpen && "rotate-45 translate-y-2"
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-white transition-all duration-300",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-white transition-all duration-300",
                isMobileMenuOpen && "-rotate-45 -translate-y-2"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {cmsLinks ? cmsLinks.map((link) => (
                <div key={link.id}>
                  <CmsNavLink
                    item={link}
                    className="block text-sm font-medium text-white/80 hover:text-white transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {link.children.map((child) => (
                    <CmsNavLink
                      key={child.id}
                      item={child}
                      className="block pl-4 text-sm text-white/60 hover:text-white py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              )) : navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block text-sm font-medium text-white/80 hover:text-white transition-colors py-2",
                    pathname === link.href && "text-white"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block text-sm font-medium border border-white/40 rounded-full px-5 py-2 text-center hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Let&apos;s talk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
