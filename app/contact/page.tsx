import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Tech Bytes Design. We're available Mon–Thu & Sat, 10 AM – 4 PM IST.",
};

const contactInfo = [
  { Icon: FiMail,  label: 'Email',             value: 'techbytesdesign@gmail.com', href: 'mailto:techbytesdesign@gmail.com' },
  { Icon: FiPhone, label: 'Phone / WhatsApp',   value: '+91 95965 24832',           href: 'tel:+919596524832' },
  { Icon: FiMapPin,label: 'Location',           value: 'Srinagar, J&K, India 190001', href: null },
  { Icon: FiClock, label: 'Business Hours',     value: 'Mon–Thu & Sat, 10:00 AM – 4:00 PM IST', href: null },
];

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Have a question, idea, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {contactInfo.map(({ Icon, label, value, href }) => (
            <div key={label} className="glass rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <div className="text-xs text-muted font-medium mb-0.5">{label}</div>
                {href ? (
                  <a href={href} className="text-sm text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{value}</a>
                ) : (
                  <span className="text-sm text-primary">{value}</span>
                )}
              </div>
            </div>
          ))}
          <div className="glass rounded-xl p-5 mt-6">
            <p className="text-sm text-muted leading-relaxed">
              <span className="text-primary font-medium">Average response time:</span> Within 24 hours on business days.
              For urgent matters, WhatsApp is the fastest way to reach us.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
