import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-brown text-cream mt-auto">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="OrderIt" className="h-10 w-10 rounded-xl object-contain bg-gradient-hero" />
              <span className="text-xl font-bold">OrderIt</span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              نقدم لكم أشهى المأكولات العربية الأصيلة بجودة عالية وخدمة مميزة. تجربة طعام لا تُنسى.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cream/70 hover:text-gold transition-colors text-sm">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-cream/70 hover:text-gold transition-colors text-sm">
                  القائمة
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-cream/70 hover:text-gold transition-colors text-sm">
                  السلة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-cream/70 text-sm">
                <Phone className="h-4 w-4 text-gold" />
                <span dir="ltr">+966 12 345 6789</span>
              </li>
              <li className="flex items-center gap-3 text-cream/70 text-sm">
                <Mail className="h-4 w-4 text-gold" />
                <span>info@althawaka.com</span>
              </li>
              <li className="flex items-center gap-3 text-cream/70 text-sm">
                <MapPin className="h-4 w-4 text-gold" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">تابعنا</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream/10 hover:bg-gold hover:text-brown transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream/10 hover:bg-gold hover:text-brown transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream/10 hover:bg-gold hover:text-brown transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 text-center text-cream/50 text-sm">
          <p>© {new Date().getFullYear()} OrderIt. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
